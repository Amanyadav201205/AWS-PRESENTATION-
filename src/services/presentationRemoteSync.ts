import { Peer, DataConnection } from 'peerjs';
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
  | 'TALK_SET_LINE';

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

// Format clean peer ID from room code
const formatHostPeerId = (roomCode: string) => `waf-host-${roomCode.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

const STUN_SERVERS = ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'];
const PEER_RETRY_DELAY_MS = 3000;
const PHONE_RECONNECT_DELAY_MS = 3000;
const PHONE_CONNECT_TIMEOUT_MS = 12000;
const PHONE_HEARTBEAT_MS = 5000;
// Phones sleep or change networks silently. No traffic from the stage for this long means the link is dead.
const PHONE_SILENCE_TIMEOUT_MS = 15000;
// The stage re-sends its state this often, so a phone that joins late, reloads, or misses a message catches up.
const STAGE_STATE_RESEND_MS = 2000;

/**
 * PeerJS options shared by stage and phones. STUN works on the same network and most home
 * connections. Phones on cellular data or venue Wi-Fi with client isolation need a TURN relay,
 * configured through VITE_TURN_URL / VITE_TURN_USERNAME / VITE_TURN_CREDENTIAL at build time.
 */
const buildPeerOptions = () => {
  const iceServers: RTCIceServer[] = STUN_SERVERS.map((urls) => ({ urls }));
  const turnUrl = import.meta.env.VITE_TURN_URL;
  if (turnUrl) {
    iceServers.push({
      urls: turnUrl,
      username: import.meta.env.VITE_TURN_USERNAME,
      credential: import.meta.env.VITE_TURN_CREDENTIAL,
    });
  }
  return { debug: 0, config: { iceServers } };
};

/**
 * Stage Host Synchronization Service (Runs on the Main Display/Laptop)
 */
export class StageHostSync {
  private peer: Peer | null = null;
  private connections: Map<string, DataConnection> = new Map();
  private broadcastChannel: BroadcastChannel | null = null;
  private roomCode: string;
  private commandListeners: Set<CommandHandler> = new Set();
  private connectionListeners: Set<ConnectionStatusHandler> = new Set();
  private retryTimer: number | null = null;
  private isDestroyed = false;
  private lastState: StageState | null = null;
  private resendTimer: number | null = null;

  constructor(roomCode: string) {
    this.roomCode = roomCode;
    this.initBroadcastChannel();
    this.initPeerHost();
    this.resendTimer = window.setInterval(() => this.resendState(), STAGE_STATE_RESEND_MS);
  }

  private stateMessage(state: StageState) {
    return { _isWafState: true, state: { ...state, connectedDevicesCount: this.connections.size } };
  }

  private resendState() {
    if (this.isDestroyed || !this.lastState) return;
    const message = this.stateMessage(this.lastState);
    this.connections.forEach((conn) => {
      if (conn.open) {
        try { conn.send(message); } catch { /* the next resend will try again */ }
      }
    });
  }

  private initBroadcastChannel() {
    if (typeof BroadcastChannel === 'undefined') return;
    try {
      this.broadcastChannel = new BroadcastChannel(`waf-sync-${this.roomCode}`);
      this.broadcastChannel.onmessage = (event) => {
        const data = event.data;
        if (data && data._isWafCommand) {
          this.handleIncomingCommand(data.command);
        }
      };
    } catch {
      // Fallback silently if BroadcastChannel not allowed
    }
  }

  private initPeerHost() {
    if (this.isDestroyed) return;
    this.clearRetryTimer();
    const hostId = formatHostPeerId(this.roomCode);
    try {
      const peer = new Peer(hostId, buildPeerOptions());
      this.peer = peer;

      peer.on('open', () => this.notifyConnectionStatus(true, this.connections.size));
      peer.on('connection', (conn) => this.registerConnection(conn));
      // Signalling server dropped us (Wi-Fi blip, laptop sleep). Phones already linked stay linked.
      peer.on('disconnected', () => this.scheduleRecovery('Stage lost its signalling link'));
      peer.on('error', (err) => this.scheduleRecovery(err.message));
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'PeerJS init failed';
      this.scheduleRecovery(msg);
    }
  }

  private registerConnection(conn: DataConnection) {
    const markLinked = () => {
      this.connections.set(conn.peer, conn);
      this.notifyConnectionStatus(this.isSignallingOpen(), this.connections.size);
      // A phone that has just joined needs the current state right away, not at the next change
      if (this.lastState) {
        try { conn.send(this.stateMessage(this.lastState)); } catch { /* the periodic resend covers it */ }
      }
    };
    const markUnlinked = () => {
      this.connections.delete(conn.peer);
      this.notifyConnectionStatus(this.isSignallingOpen(), this.connections.size);
    };

    // An incoming connection can already be open by the time the event fires
    if (conn.open) markLinked();
    else conn.on('open', markLinked);

    conn.on('data', (data: unknown) => {
      if (data && typeof data === 'object' && 'type' in data) {
        this.handleIncomingCommand(data as RemoteCommand);
      }
    });
    conn.on('close', markUnlinked);
    conn.on('error', markUnlinked);
  }

  private isSignallingOpen(): boolean {
    return this.peer !== null && this.peer.open;
  }

  private scheduleRecovery(reason: string) {
    this.notifyConnectionStatus(false, this.connections.size, reason);
    this.clearRetryTimer();
    if (this.isDestroyed) return;
    this.retryTimer = window.setTimeout(() => {
      this.retryTimer = null;
      this.recoverRegistration();
    }, PEER_RETRY_DELAY_MS);
  }

  private recoverRegistration() {
    if (this.isDestroyed) return;
    const peer = this.peer;
    // Keep the same ID and the open phone links when the signalling socket can simply be re-opened
    if (peer && !peer.destroyed && peer.disconnected) {
      try {
        peer.reconnect();
        return;
      } catch {
        // Fall through: rebuild the peer from scratch
      }
    }
    // Old registration is still held on the server (e.g. host reloaded): release it and claim the ID again
    this.destroyPeer();
    this.initPeerHost();
  }

  private destroyPeer() {
    if (this.peer) {
      try { this.peer.destroy(); } catch { /* already gone */ }
      this.peer = null;
    }
  }

  private clearRetryTimer() {
    if (this.retryTimer !== null) {
      window.clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
  }

  private recentCommandSignatures: Set<string> = new Set();

  private handleIncomingCommand(cmd: RemoteCommand) {
    const signature = `${cmd.type}-${cmd.timestamp}-${cmd.speaker || ''}-${cmd.target || ''}-${cmd.modal || ''}-${cmd.scrollDelta ?? ''}-${cmd.zoomLevel ?? ''}`;
    if (this.recentCommandSignatures.has(signature)) return;
    this.recentCommandSignatures.add(signature);
    setTimeout(() => this.recentCommandSignatures.delete(signature), 2000);

    if (cmd.type === 'PING') {
      this.broadcastCommand({ type: 'PONG', timestamp: Date.now() });
      return;
    }
    this.commandListeners.forEach(listener => listener(cmd));
  }

  public broadcastState(state: StageState) {
    if (this.isDestroyed) return;
    this.lastState = state;
    const payload = this.stateMessage(state);

    // Broadcast across local channel
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(payload);
      } catch {
        // Ignore channel post errors
      }
    }

    // Broadcast to all connected remote mobile peers
    this.connections.forEach((conn) => {
      if (conn.open) {
        try {
          conn.send(payload);
        } catch {
          // Handle connection send error
        }
      }
    });
  }

  public broadcastCommand(cmd: RemoteCommand) {
    const payload = { _isWafCommand: true, command: cmd };
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(payload);
      } catch {
        // Ignore
      }
    }
    this.connections.forEach(conn => {
      if (conn.open) {
        try {
          conn.send(payload);
        } catch {
          // Ignore
        }
      }
    });
  }

  public onCommand(handler: CommandHandler): () => void {
    this.commandListeners.add(handler);
    return () => this.commandListeners.delete(handler);
  }

  public onConnectionStatus(handler: ConnectionStatusHandler): () => void {
    this.connectionListeners.add(handler);
    handler(this.peer ? !this.peer.disconnected : false, this.connections.size);
    return () => this.connectionListeners.delete(handler);
  }

  private notifyConnectionStatus(connected: boolean, count: number, error?: string) {
    this.connectionListeners.forEach(listener => listener(connected, count, error));
  }

  public getRoomCode(): string {
    return this.roomCode;
  }

  public getConnectedCount(): number {
    return this.connections.size;
  }

  public destroy() {
    this.isDestroyed = true;
    this.clearRetryTimer();
    if (this.resendTimer !== null) window.clearInterval(this.resendTimer);
    this.recentCommandSignatures.clear();
    this.commandListeners.clear();
    this.connectionListeners.clear();
    this.connections.forEach(conn => conn.close());
    this.connections.clear();
    this.destroyPeer();
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }
  }
}

let activeStageHost: StageHostSync | null = null;

/**
 * Returns the one stage host for this page. React StrictMode runs state initialisers twice in
 * development; creating two hosts would register the same peer ID twice and strand one of them.
 */
export const getStageHostSync = (roomCode: string): StageHostSync => {
  if (!activeStageHost || activeStageHost.getRoomCode() !== roomCode) {
    activeStageHost?.destroy();
    activeStageHost = new StageHostSync(roomCode);
  }
  return activeStageHost;
};

/**
 * Mobile Phone Companion Synchronization Client (Runs on Presenter Smartphones)
 */
export class PhoneCompanionSync {
  private peer: Peer | null = null;
  private connection: DataConnection | null = null;
  // The link being established. Only this one may become `connection`, so stale attempts cannot revive
  private attempt: DataConnection | null = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private roomCode: string;
  private stateListeners: Set<StateChangeHandler> = new Set();
  private connectionListeners: Set<ConnectionStatusHandler> = new Set();
  private reconnectTimer: number | null = null;
  private connectTimer: number | null = null;
  private heartbeatTimer: number | null = null;
  private lastStageMessageAt = 0;
  private isDestroyed = false;
  private speaker: RemoteSpeaker = 'devarsh';

  constructor(roomCode: string, speaker: RemoteSpeaker = 'devarsh') {
    this.roomCode = roomCode;
    this.speaker = speaker;
    this.initBroadcastChannel();
    this.connectToHost();
    this.setupWakeLock();
  }

  private setupWakeLock() {
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      try {
        navigator.wakeLock.request('screen').catch(() => {
          // Screen lock optional
        });
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
        if (data && data._isWafState) {
          this.stateListeners.forEach(listener => listener(data.state));
        }
      };
    } catch {
      // Ignore
    }
  }

  public setSpeaker(speaker: RemoteSpeaker) {
    this.speaker = speaker;
    this.sendCommand({
      type: 'IDENTIFY_SPEAKER',
      speaker,
      speakerName: speaker === 'devarsh' ? 'Devarsh Patel' : speaker === 'aman' ? 'Aman Kumar Yadav' : 'Co-Presenters',
      timestamp: Date.now()
    });
  }

  private connectToHost() {
    if (this.isDestroyed) return;
    try {
      const peer = new Peer(buildPeerOptions());
      this.peer = peer;

      peer.on('open', () => this.attemptLink());
      // Signalling dropped while no link is up: rebuild on our own schedule
      peer.on('disconnected', () => {
        if (!this.connection) this.scheduleReconnect();
      });
      peer.on('error', (err) => {
        this.notifyConnectionStatus(false, 0, err.message);
        this.scheduleReconnect();
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Mobile peer error';
      this.notifyConnectionStatus(false, 0, msg);
      this.scheduleReconnect();
    }
  }

  private attemptLink() {
    if (this.isDestroyed || !this.peer) return;
    const conn = this.peer.connect(formatHostPeerId(this.roomCode), { reliable: true });
    this.attempt = conn;
    this.armConnectTimeout(conn);

    conn.on('open', () => this.promoteLink(conn));
    conn.on('data', (data: unknown) => this.handleStageData(data));
    conn.on('close', () => this.handleLinkLost(conn));
    conn.on('error', () => this.handleLinkLost(conn));
  }

  private promoteLink(conn: DataConnection) {
    if (conn !== this.attempt) {
      conn.close();
      return;
    }
    this.clearConnectTimer();
    this.connection = conn;
    this.lastStageMessageAt = Date.now();
    this.notifyConnectionStatus(true, 1);
    // Greet stage with speaker identity
    this.setSpeaker(this.speaker);
    this.startHeartbeat();
  }

  private handleStageData(data: unknown) {
    // Any traffic (state, PONG) proves the stage is still there
    this.lastStageMessageAt = Date.now();
    if (data && typeof data === 'object') {
      const msg = data as { _isWafState?: boolean; state?: StageState };
      if (msg._isWafState && msg.state) {
        this.stateListeners.forEach(listener => listener(msg.state!));
      }
    }
  }

  private handleLinkLost(conn: DataConnection) {
    if (conn !== this.attempt || this.isDestroyed) return;
    this.attempt = null;
    this.connection = null;
    this.clearConnectTimer();
    this.stopHeartbeat();
    this.notifyConnectionStatus(false, 0);
    this.scheduleReconnect();
  }

  // A link that never opens (blocked WebRTC path) would otherwise wait forever
  private armConnectTimeout(conn: DataConnection) {
    this.clearConnectTimer();
    this.connectTimer = window.setTimeout(() => {
      this.connectTimer = null;
      if (conn.open) return;
      conn.close();
      this.handleLinkLost(conn);
    }, PHONE_CONNECT_TIMEOUT_MS);
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatTimer = window.setInterval(() => this.heartbeatTick(), PHONE_HEARTBEAT_MS);
  }

  private heartbeatTick() {
    const conn = this.connection;
    if (!conn || !conn.open) return;
    if (Date.now() - this.lastStageMessageAt > PHONE_SILENCE_TIMEOUT_MS) {
      // Timers pause while a phone sleeps. After wake-up the link is usually dead even if the browser has not reported it.
      this.handleLinkLost(conn);
      conn.close();
      return;
    }
    conn.send({ type: 'PING', timestamp: Date.now() });
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer !== null) {
      window.clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private clearConnectTimer() {
    if (this.connectTimer !== null) {
      window.clearTimeout(this.connectTimer);
      this.connectTimer = null;
    }
  }

  private clearReconnectTimer() {
    if (this.reconnectTimer !== null) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private scheduleReconnect() {
    if (this.isDestroyed || this.reconnectTimer !== null) return;
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      if (!this.connection) this.rebuildPeer();
    }, PHONE_RECONNECT_DELAY_MS);
  }

  private rebuildPeer() {
    this.attempt = null;
    this.clearConnectTimer();
    if (this.peer) {
      try { this.peer.destroy(); } catch { /* already gone */ }
      this.peer = null;
    }
    this.connectToHost();
  }

  /** Drops the current link and dials the stage again right away (used by the "Reconnect" button). */
  public reconnectNow() {
    if (this.isDestroyed) return;
    this.clearReconnectTimer();
    const stale = this.connection ?? this.attempt;
    this.connection = null;
    this.attempt = null;
    this.stopHeartbeat();
    stale?.close();
    this.rebuildPeer();
  }

  /** Returns true when the command left over the live link. False means the stage did not receive it. */
  public sendCommand(cmd: RemoteCommandInput, options: { haptic?: boolean } = {}): boolean {
    const fullCmd: RemoteCommand = {
      ...cmd,
      speaker: this.speaker,
      speakerName: this.speaker === 'devarsh' ? 'Devarsh Patel' : this.speaker === 'aman' ? 'Aman Kumar Yadav' : 'Co-Presenters',
      timestamp: cmd.timestamp || Date.now()
    };

    // Continuous input (touch drag, slider) must not buzz on every frame; a multi-command sequence buzzes once
    const shouldBuzz = options.haptic !== false && !cmd.isContinuous;
    if (shouldBuzz && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(25);
      } catch {
        // Haptics optional
      }
    }

    // Post to local BroadcastChannel
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ _isWafCommand: true, command: fullCmd });
      } catch {
        // Ignore
      }
    }

    const conn = this.connection;
    if (!conn || !conn.open) return false;
    try {
      conn.send(fullCmd);
      return true;
    } catch {
      return false;
    }
  }

  public onState(handler: StateChangeHandler): () => void {
    this.stateListeners.add(handler);
    return () => this.stateListeners.delete(handler);
  }

  public onConnectionStatus(handler: ConnectionStatusHandler): () => void {
    this.connectionListeners.add(handler);
    handler(this.connection?.open || false, this.connection?.open ? 1 : 0);
    return () => this.connectionListeners.delete(handler);
  }

  private notifyConnectionStatus(connected: boolean, count: number, error?: string) {
    this.connectionListeners.forEach(listener => listener(connected, count, error));
  }

  public destroy() {
    this.isDestroyed = true;
    this.clearReconnectTimer();
    this.clearConnectTimer();
    this.stopHeartbeat();
    this.stateListeners.clear();
    this.connectionListeners.clear();
    const stale = this.connection ?? this.attempt;
    this.connection = null;
    this.attempt = null;
    stale?.close();
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }
  }
}
