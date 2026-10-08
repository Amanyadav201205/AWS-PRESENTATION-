import mqtt from 'mqtt';

import { AppDisplayMode, ChaosPhase, ViewMode, StorylineStage } from '../types';

export type RemoteSpeaker = 'devarsh' | 'aman' | 'both';

export type RemoteScrollTarget =
  | 'top'
  | 'hero'
  | 'storyline'
  | 'journey'
  | 'comparison'
  | 'sandbox'
  | 'topology'
  | 'metrics'
  | 'iac'
  | 'radar'
  | 'pillars'
  | 'footer';

export type RemoteCommandType =
  | 'GOTO_MODULE'
  | 'NEXT_MODULE'
  | 'PREV_MODULE'
  | 'TRIGGER_CHAOS'
  | 'RESET_CHAOS'
  | 'SET_VIEW_MODE'
  | 'SCROLL_TO'
  | 'SPOTLIGHT'
  | 'OPEN_MODAL'
  | 'CLOSE_MODALS'
  | 'TOGGLE_KEYNOTE'
  | 'IDENTIFY_SPEAKER'
  | 'ENTER_PRESENTER_MODE'
  | 'EXIT_PRESENTER_MODE'
  | 'SET_STORYLINE_STAGE'
  | 'SET_SLIDE_MODE'
  | 'RUN_SLIDE_SIM'
  | 'TOGGLE_SLIDE_GRID'
  | 'SET_TRAFFIC'
  | 'TRIGGER_ATTACK'
  | 'INSPECT_NODE'
  | 'TOGGLE_AUDIO'
  | 'INTERACT_MODAL'
  | 'SCROLL_BY'
  | 'SCROLL_PAGE'
  | 'SCROLL_EDGE'
  | 'SCROLL_SECTION_STEP'
  | 'ZOOM_CONTENT'
  | 'PING'
  | 'PONG'
  | 'TALK_SET_LINE'
  | 'TALK_STEP'
  | 'SET_PACKET_FLOW';

export type ContentScrollDirection = 'up' | 'down';
export type ContentSectionDirection = 'prev' | 'next';
export type ContentZoomAction = 'in' | 'out' | 'reset' | 'set';

export interface RemoteCommand {
  type: RemoteCommandType;
  index?: number;
  speaker?: RemoteSpeaker;
  speakerName?: string;
  mode?: ViewMode;
  target?: RemoteScrollTarget;
  targetId?: string;
  label?: string;
  modal?: string;
  modalAction?: string;
  modalPayload?: any;
  storylineStage?: StorylineStage;
  slideMode?: 'keynote' | 'dual' | 'theory';
  trafficLoad?: number;
  attackScenario?: string;
  isWellArch?: boolean;
  scrollDelta?: number;
  scrollDirection?: ContentScrollDirection;
  scrollEdge?: 'top' | 'bottom';
  sectionDirection?: ContentSectionDirection;
  zoomAction?: ContentZoomAction;
  zoomLevel?: number;
  packetFlow?: boolean;
  /** High-frequency input (touch drag, slider, pinch). Applied silently: no HUD toast, no haptic. */
  isContinuous?: boolean;
  timestamp: number;
}

export type RemoteCommandInput = Omit<RemoteCommand, 'timestamp'> & { timestamp?: number };

export interface StageState {
  currentDomainIndex: number;
  currentDomainId: string;
  domainTitle: string;
  domainCategory: string;
  viewMode: ViewMode;
  chaosPhase: ChaosPhase;
  isChaosActive: boolean;
  displayMode: AppDisplayMode;
  slideMode?: 'keynote' | 'dual' | 'theory';
  isSlideGridOpen?: boolean;
  trafficLoad?: number;
  activeAttack?: string;
  storylineStage?: StorylineStage;
  activeModal: string | null;
  modalSubState?: {
    pillarId?: string;
    subtopicId?: string;
    workloadId?: string;
    incidentId?: string;
    tier?: string;
    theoryDomainId?: string;
  };
  audioEnabled?: boolean;
  selectedNodeId?: string | null;
  selectedNodeName?: string | null;
  elapsedSeconds: number;
  connectedDevicesCount: number;
  spotlightTarget: string | null;
  latestSpeakerName: string | null;
  latestActionNotice: string | null;
  /** 0–100 position of the main site's scroll container, reported back to phones */
  contentScrollPercent?: number;
  /** Current content zoom of the main site, in percent (100 = normal) */
  contentZoom?: number;
  /** Line of the talk track now on the big screen. -1 means the talk has not started. */
  talkIndex?: number;
}

export type CommandHandler = (cmd: RemoteCommand) => void;
export type StateChangeHandler = (state: StageState) => void;
export type ConnectionStatusHandler = (connected: boolean, deviceCount: number, error?: string) => void;

// Generate or retrieve persistent 4-digit room code
export const getOrGenerateRoomCode = (): string => {
  if (typeof window === 'undefined') return 'WAF-1001';
  const urlParams = new URLSearchParams(window.location.search);
  const fromUrl = urlParams.get('room') || urlParams.get('remote');
  if (fromUrl) {
    const clean = fromUrl.toUpperCase().trim();
    sessionStorage.setItem('waf_room_code', clean);
    return clean;
  }
  const saved = sessionStorage.getItem('waf_room_code');
  if (saved) return saved;

  // Generate crisp 4-digit code e.g. WAF-8421
  const num = Math.floor(1000 + Math.random() * 9000);
  const code = `WAF-${num}`;
  sessionStorage.setItem('waf_room_code', code);
  return code;
};


/*
 * Phone link over two public MQTT brokers (WebSocket, HTTPS-compatible). Both the laptop and the phones only make
 * outgoing connections on the standard web port, so the link works from venue Wi-Fi, a hotspot, or mobile data.
 * Each message goes to every broker and is deduplicated on arrival, so one broker failing does not stop the link.
 *
 * Topics (all derived from the session key, which travels only in the pairing QR code):
 *   state  - the laptop's state, published retained, so a phone that joins or reconnects gets the current line at once
 *   cmd    - phone commands and phone presence ("hello"); clean sessions mean old taps are never replayed later
 */
const DEFAULT_MQTT_BROKERS = ['wss://test.mosquitto.org:8081', 'wss://broker.hivemq.com:8884/mqtt'];
const RELAY_TOKEN_KEY = 'waf_relay_token';
const RELAY_TOKEN_LENGTH = 24;
const STAGE_STATE_EVERY_MS = 3000;
const STAGE_STATE_MIN_GAP_MS = 400;
const PHONE_HELLO_EVERY_MS = 8000;
const LINK_FRESH_MS = 9000;
const PHONE_FRESH_MS = 20000;
const SEEN_MESSAGE_LIMIT = 400;
const LINK_CHECK_EVERY_MS = 1000;
const BROKER_CONNECT_TIMEOUT_MS = 8000;
const BROKER_RECONNECT_MS = 1500;

type RelayEnvelope =
  | { kind: 'state'; id: string; seq: number; state: StageState }
  | { kind: 'cmd'; id: string; cmd: RemoteCommandInput }
  | { kind: 'hello'; id: string; phoneId: string; speaker: RemoteSpeaker };

const randomId = (length: number): string => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('');
};

/** Brokers can be overridden at build time with VITE_MQTT_BROKERS (comma separated), for a dedicated broker. */
const relayBrokers = (): string[] => {
  const configured = import.meta.env.VITE_MQTT_BROKERS;
  if (!configured) return DEFAULT_MQTT_BROKERS;
  const list = configured.split(',').map((url: string) => url.trim()).filter(Boolean);
  return list.length > 0 ? list : DEFAULT_MQTT_BROKERS;
};

/** The stage's session key. Created once per tab and kept across reloads, so the same QR keeps working. */
export const getRelayToken = (): string => {
  try {
    const saved = window.sessionStorage.getItem(RELAY_TOKEN_KEY);
    if (saved && saved.length === RELAY_TOKEN_LENGTH) return saved;
    const created = randomId(RELAY_TOKEN_LENGTH);
    window.sessionStorage.setItem(RELAY_TOKEN_KEY, created);
    return created;
  } catch {
    return randomId(RELAY_TOKEN_LENGTH);
  }
};

/** The phone reads the session key from the pairing link (`&k=`). */
const readRelayTokenFromUrl = (): string | null => {
  const token = new URLSearchParams(window.location.search).get('k');
  return token && token.length === RELAY_TOKEN_LENGTH ? token : null;
};

const topicFor = (token: string, channel: 'state' | 'cmd'): string => `waf/${token}/${channel}`;

/** A small, bounded set of recently seen message ids, so a message arriving from two brokers is handled once. */
class SeenIds {
  private ids = new Set<string>();
  /** Returns true the first time an id is seen. */
  first(id: string): boolean {
    if (this.ids.has(id)) return false;
    this.ids.add(id);
    if (this.ids.size > SEEN_MESSAGE_LIMIT) {
      const oldest = this.ids.values().next().value;
      if (oldest !== undefined) this.ids.delete(oldest);
    }
    return true;
  }
}

interface RelayLink {
  publish: (topic: string, envelope: RelayEnvelope, retain: boolean) => void;
  close: () => void;
  isConnected: () => boolean;
}

/**
 * Opens one connection per broker. Every subscription is made on every broker, and every outgoing message is
 * sent to every broker. Connection state per broker is reported so the stage can show whether any broker is up.
 */
const openRelay = (
  subscriptions: string[],
  onEnvelope: (envelope: RelayEnvelope) => void,
  onBrokerChange: () => void
): RelayLink => {
  const seen = new SeenIds();
  const clients = relayBrokers().map((url) => {
    let connected = false;
    const client = mqtt.connect(url, {
      clientId: `waf-${randomId(12)}`,
      clean: true,
      connectTimeout: BROKER_CONNECT_TIMEOUT_MS,
      reconnectPeriod: BROKER_RECONNECT_MS,
      keepalive: 20
    });
    client.on('connect', () => {
      connected = true;
      subscriptions.forEach((topic) => client.subscribe(topic, { qos: 1 }));
      onBrokerChange();
    });
    const markDown = () => {
      if (!connected) return;
      connected = false;
      onBrokerChange();
    };
    client.on('close', markDown);
    client.on('offline', markDown);
    client.on('error', () => { /* reconnects are automatic; the status above reports the outage */ });
    client.on('message', (_topic, payload) => {
      try {
        const envelope = JSON.parse(payload.toString()) as RelayEnvelope;
        if (envelope && typeof envelope.id === 'string' && seen.first(envelope.id)) onEnvelope(envelope);
      } catch {
        // Not one of ours
      }
    });
    return { client, isConnected: () => connected };
  });

  return {
    publish: (topic, envelope, retain) => {
      const body = JSON.stringify(envelope);
      clients.forEach(({ client }) => {
        try { client.publish(topic, body, { qos: 1, retain }); } catch { /* the other broker still carries it */ }
      });
    },
    close: () => clients.forEach(({ client }) => client.end(true)),
    isConnected: () => clients.some((entry) => entry.isConnected())
  };
};

const speakerDisplayName = (speaker: RemoteSpeaker): string =>
  speaker === 'devarsh' ? 'Devarsh Patel' : speaker === 'aman' ? 'Aman Kumar Yadav' : 'Co-Presenters';

/**
 * Stage side (runs on the laptop). Publishes the state, retained, and receives phone commands. The same-browser
 * BroadcastChannel path is kept, so a phone tab on this laptop works even without internet.
 */
export class StageHostSync {
  private roomCode: string;
  private token: string;
  private commandListeners: Set<CommandHandler> = new Set();
  private connectionListeners: Set<ConnectionStatusHandler> = new Set();
  private broadcastChannel: BroadcastChannel | null = null;
  private link: RelayLink | null = null;
  private lastState: StageState | null = null;
  private lastPublishAt = 0;
  private publishTimer: number | null = null;
  private heartbeatTimer: number | null = null;
  private lastSeq = 0;
  private phoneSeen: Map<string, number> = new Map();
  private seenCommands = new SeenIds();
  private isDestroyed = false;

  constructor(roomCode: string, token: string) {
    this.roomCode = roomCode;
    this.token = token;
    this.initBroadcastChannel();
    this.link = openRelay(
      [topicFor(token, 'cmd')],
      (envelope) => this.handleEnvelope(envelope),
      () => this.notifyConnectionStatus()
    );
    this.heartbeatTimer = window.setInterval(() => this.publishNow(), STAGE_STATE_EVERY_MS);
  }

  private initBroadcastChannel() {
    if (typeof BroadcastChannel === 'undefined') return;
    try {
      this.broadcastChannel = new BroadcastChannel(`waf-sync-${this.roomCode}`);
      this.broadcastChannel.onmessage = (event) => {
        const data = event.data;
        if (data && data._isWafCommand) this.handleIncomingCommand(data.command);
      };
    } catch {
      // BroadcastChannel is optional
    }
  }

  private handleEnvelope(envelope: RelayEnvelope) {
    if (this.isDestroyed) return;
    if (envelope.kind === 'hello') {
      this.phoneSeen.set(envelope.phoneId, Date.now());
      this.notifyConnectionStatus();
      return;
    }
    if (envelope.kind === 'cmd') {
      this.handleIncomingCommand(envelope.cmd as RemoteCommand);
    }
  }

  private handleIncomingCommand(cmd: RemoteCommand) {
    this.commandListeners.forEach((listener) => listener(cmd));
  }

  private freshPhoneCount(): number {
    const cutoff = Date.now() - PHONE_FRESH_MS;
    this.phoneSeen.forEach((seen, id) => { if (seen < cutoff) this.phoneSeen.delete(id); });
    return this.phoneSeen.size;
  }

  private notifyConnectionStatus() {
    this.connectionListeners.forEach((listener) => listener(this.isRelayOpen(), this.freshPhoneCount()));
  }

  private isRelayOpen(): boolean {
    return this.link?.isConnected() ?? false;
  }

  /** Publishes the latest state. Each publish carries a sequence number the phones use to see the laptop is alive. */
  private publishNow() {
    if (this.isDestroyed || !this.lastState || !this.link) return;
    this.lastPublishAt = Date.now();
    this.lastSeq = Math.max(this.lastSeq + 1, Date.now());
    const state: StageState = { ...this.lastState, connectedDevicesCount: this.freshPhoneCount() };
    this.link.publish(topicFor(this.token, 'state'), { kind: 'state', id: `${this.lastSeq}`, seq: this.lastSeq, state }, true);
    this.notifyConnectionStatus();
  }

  /** Coalesces bursts (a dragged slider) so the broker is not flooded. The last state always goes out. */
  private schedulePublish() {
    const wait = STAGE_STATE_MIN_GAP_MS - (Date.now() - this.lastPublishAt);
    if (wait <= 0) {
      this.publishNow();
      return;
    }
    if (this.publishTimer === null) {
      this.publishTimer = window.setTimeout(() => {
        this.publishTimer = null;
        this.publishNow();
      }, wait);
    }
  }

  public broadcastState(state: StageState) {
    if (this.isDestroyed) return;
    this.lastState = state;
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ _isWafState: true, state: { ...state, connectedDevicesCount: this.freshPhoneCount() } });
      } catch {
        // Same-browser screens are best effort
      }
    }
    this.schedulePublish();
  }

  public broadcastCommand(cmd: RemoteCommand) {
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ _isWafCommand: true, command: cmd });
      } catch {
        // Ignore
      }
    }
  }

  public onCommand(handler: CommandHandler): () => void {
    this.commandListeners.add(handler);
    return () => { this.commandListeners.delete(handler); };
  }

  public onConnectionStatus(handler: ConnectionStatusHandler): () => void {
    this.connectionListeners.add(handler);
    handler(this.isRelayOpen(), this.freshPhoneCount());
    return () => { this.connectionListeners.delete(handler); };
  }

  public getRoomCode(): string {
    return this.roomCode;
  }

  public getConnectedCount(): number {
    return this.freshPhoneCount();
  }

  public destroy() {
    this.isDestroyed = true;
    if (this.heartbeatTimer !== null) window.clearInterval(this.heartbeatTimer);
    if (this.publishTimer !== null) window.clearTimeout(this.publishTimer);
    this.link?.close();
    this.link = null;
    this.commandListeners.clear();
    this.connectionListeners.clear();
    this.phoneSeen.clear();
    this.broadcastChannel?.close();
    this.broadcastChannel = null;
  }
}

let activeStageHost: StageHostSync | null = null;

/** Returns the one stage host for this page. React StrictMode runs state initialisers twice in development. */
export const getStageHostSync = (roomCode: string): StageHostSync => {
  if (!activeStageHost || activeStageHost.getRoomCode() !== roomCode) {
    activeStageHost?.destroy();
    activeStageHost = new StageHostSync(roomCode, getRelayToken());
  }
  return activeStageHost;
};

/**
 * Phone side. It is linked only while the laptop's sequence number keeps changing, as seen on this phone's clock
 * (it changes every 3 seconds). A retained message from an old session is not enough to count as linked.
 */
export class PhoneCompanionSync {
  private roomCode: string;
  private speaker: RemoteSpeaker;
  private token: string | null;
  private phoneId = randomId(8);
  private commandCounter = 0;
  private stateListeners: Set<StateChangeHandler> = new Set();
  private connectionListeners: Set<ConnectionStatusHandler> = new Set();
  private broadcastChannel: BroadcastChannel | null = null;
  private link: RelayLink | null = null;
  private lastSeq = 0;
  private lastSeqChangeAt = 0;
  private linked = false;
  private helloTimer: number | null = null;
  private linkTimer: number | null = null;
  private isDestroyed = false;

  constructor(roomCode: string, speaker: RemoteSpeaker = 'devarsh') {
    this.roomCode = roomCode;
    this.speaker = speaker;
    this.token = readRelayTokenFromUrl();
    this.initBroadcastChannel();
    if (this.token) {
      this.link = openRelay(
        [topicFor(this.token, 'state')],
        (envelope) => this.handleEnvelope(envelope),
        () => this.updateLinked()
      );
    }
    this.sendHello();
    this.helloTimer = window.setInterval(() => this.sendHello(), PHONE_HELLO_EVERY_MS);
    this.linkTimer = window.setInterval(() => this.updateLinked(), LINK_CHECK_EVERY_MS);
    this.setupWakeLock();
  }

  private setupWakeLock() {
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      try {
        navigator.wakeLock.request('screen').catch(() => { /* optional */ });
      } catch {
        // Ignore
      }
    }
  }

  private initBroadcastChannel() {
    if (typeof BroadcastChannel === 'undefined') return;
    try {
      this.broadcastChannel = new BroadcastChannel(`waf-sync-${this.roomCode}`);
      this.broadcastChannel.onmessage = (event) => {
        const data = event.data;
        if (data && data._isWafState) this.stateListeners.forEach((listener) => listener(data.state as StageState));
      };
    } catch {
      // Ignore
    }
  }

  private handleEnvelope(envelope: RelayEnvelope) {
    if (this.isDestroyed || envelope.kind !== 'state') return;
    // Older or repeated states never move the screen backwards
    if (envelope.seq > this.lastSeq) {
      this.lastSeq = envelope.seq;
      this.lastSeqChangeAt = Date.now();
      this.stateListeners.forEach((listener) => listener(envelope.state));
      this.updateLinked();
    }
  }

  private updateLinked() {
    if (this.isDestroyed) return;
    const linkedNow = this.token !== null && this.lastSeqChangeAt > 0 && Date.now() - this.lastSeqChangeAt < LINK_FRESH_MS;
    if (linkedNow !== this.linked) {
      this.linked = linkedNow;
      this.notifyConnectionStatus();
    }
  }

  private sendHello() {
    if (!this.token || !this.link || this.isDestroyed) return;
    this.link.publish(topicFor(this.token, 'cmd'), { kind: 'hello', id: `${this.phoneId}-hello-${Date.now()}`, phoneId: this.phoneId, speaker: this.speaker }, false);
  }

  private notifyConnectionStatus() {
    this.connectionListeners.forEach((listener) => listener(this.linked, this.linked ? 1 : 0));
  }

  public setSpeaker(speaker: RemoteSpeaker) {
    this.speaker = speaker;
    this.sendHello();
  }

  /** Restarts the connections to the brokers right away (the "Reconnect" button). */
  public reconnectNow() {
    if (this.isDestroyed || !this.token) return;
    this.link?.close();
    this.link = openRelay(
      [topicFor(this.token, 'state')],
      (envelope) => this.handleEnvelope(envelope),
      () => this.updateLinked()
    );
    this.sendHello();
  }

  /** Returns true when the laptop has been seen recently. Delivery is confirmed by the next state the laptop sends. */
  public sendCommand(cmd: RemoteCommandInput, options: { haptic?: boolean } = {}): boolean {
    const fullCmd: RemoteCommandInput = {
      ...cmd,
      speaker: this.speaker,
      speakerName: speakerDisplayName(this.speaker),
      timestamp: cmd.timestamp || Date.now()
    };

    const shouldBuzz = options.haptic !== false && !cmd.isContinuous;
    if (shouldBuzz && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(25); } catch { /* haptics optional */ }
    }

    // One path per command. Sending over both would make a stage on the same browser apply every tap twice.
    if (this.token && this.link) {
      this.commandCounter += 1;
      this.link.publish(topicFor(this.token, 'cmd'), { kind: 'cmd', id: `${this.phoneId}-${this.commandCounter}`, cmd: fullCmd }, false);
      return this.linked;
    }

    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ _isWafCommand: true, command: fullCmd });
      } catch {
        // Ignore
      }
    }
    return false;
  }

  public onState(handler: StateChangeHandler): () => void {
    this.stateListeners.add(handler);
    return () => { this.stateListeners.delete(handler); };
  }

  public onConnectionStatus(handler: ConnectionStatusHandler): () => void {
    this.connectionListeners.add(handler);
    handler(this.linked, this.linked ? 1 : 0);
    return () => { this.connectionListeners.delete(handler); };
  }

  public destroy() {
    this.isDestroyed = true;
    if (this.helloTimer !== null) window.clearInterval(this.helloTimer);
    if (this.linkTimer !== null) window.clearInterval(this.linkTimer);
    this.link?.close();
    this.link = null;
    this.stateListeners.clear();
    this.connectionListeners.clear();
    this.broadcastChannel?.close();
    this.broadcastChannel = null;
  }
}
