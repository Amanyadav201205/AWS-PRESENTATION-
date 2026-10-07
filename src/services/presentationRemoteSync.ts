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
  | 'PING'
  | 'PONG';

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
  storylineStage?: StorylineStage;
  slideMode?: 'keynote' | 'dual' | 'theory';
  trafficLoad?: number;
  attackScenario?: string;
  timestamp: number;
}

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
  elapsedSeconds: number;
  connectedDevicesCount: number;
  spotlightTarget: string | null;
  latestSpeakerName: string | null;
  latestActionNotice: string | null;
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
  private isDestroyed = false;

  constructor(roomCode: string) {
    this.roomCode = roomCode;
    this.initBroadcastChannel();
    this.initPeerHost();
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
    const hostId = formatHostPeerId(this.roomCode);
    try {
      this.peer = new Peer(hostId, {
        debug: 0,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        }
      });

      this.peer.on('open', () => {
        if (this.isDestroyed) return;
        this.notifyConnectionStatus(true, this.connections.size);
      });

      this.peer.on('connection', (conn) => {
        conn.on('open', () => {
          this.connections.set(conn.peer, conn);
          this.notifyConnectionStatus(true, this.connections.size);
        });

        conn.on('data', (data: unknown) => {
          if (data && typeof data === 'object' && 'type' in data) {
            this.handleIncomingCommand(data as RemoteCommand);
          }
        });

        conn.on('close', () => {
          this.connections.delete(conn.peer);
          this.notifyConnectionStatus(true, this.connections.size);
        });

        conn.on('error', () => {
          this.connections.delete(conn.peer);
          this.notifyConnectionStatus(true, this.connections.size);
        });
      });

      this.peer.on('error', (err) => {
        // If host ID is already taken, peer handles retry or local broadcast
        if (err.type === 'unavailable-id') {
          // Connected in another tab
        }
        this.notifyConnectionStatus(this.connections.size > 0, this.connections.size, err.message);
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'PeerJS init failed';
      this.notifyConnectionStatus(false, 0, msg);
    }
  }

  private recentCommandSignatures: Set<string> = new Set();

  private handleIncomingCommand(cmd: RemoteCommand) {
    const signature = `${cmd.type}-${cmd.timestamp}-${cmd.speaker || ''}-${cmd.target || ''}-${cmd.modal || ''}`;
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
    const payload = {
      _isWafState: true,
      state: {
        ...state,
        connectedDevicesCount: this.connections.size
      }
    };

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
    this.recentCommandSignatures.clear();
    this.commandListeners.clear();
    this.connectionListeners.clear();
    this.connections.forEach(conn => conn.close());
    this.connections.clear();
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

/**
 * Mobile Phone Companion Synchronization Client (Runs on Presenter Smartphones)
 */
export class PhoneCompanionSync {
  private peer: Peer | null = null;
  private connection: DataConnection | null = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private roomCode: string;
  private stateListeners: Set<StateChangeHandler> = new Set();
  private connectionListeners: Set<ConnectionStatusHandler> = new Set();
  private reconnectTimer: number | null = null;
  private pingInterval: number | null = null;
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
    const hostId = formatHostPeerId(this.roomCode);

    try {
      this.peer = new Peer({
        debug: 0,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        }
      });

      this.peer.on('open', () => {
        if (this.isDestroyed || !this.peer) return;
        const conn = this.peer.connect(hostId, {
          reliable: true
        });

        conn.on('open', () => {
          this.connection = conn;
          this.notifyConnectionStatus(true, 1);
          // Greet stage with speaker identity
          this.setSpeaker(this.speaker);
          this.startHeartbeat();
        });

        conn.on('data', (data: unknown) => {
          if (data && typeof data === 'object') {
            const msg = data as { _isWafState?: boolean; state?: StageState };
            if (msg._isWafState && msg.state) {
              this.stateListeners.forEach(listener => listener(msg.state!));
            }
          }
        });

        conn.on('close', () => {
          this.connection = null;
          this.notifyConnectionStatus(false, 0);
          this.scheduleReconnect();
        });

        conn.on('error', () => {
          this.connection = null;
          this.notifyConnectionStatus(false, 0);
          this.scheduleReconnect();
        });
      });

      this.peer.on('error', (err) => {
        this.notifyConnectionStatus(false, 0, err.message);
        this.scheduleReconnect();
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Mobile peer error';
      this.notifyConnectionStatus(false, 0, msg);
      this.scheduleReconnect();
    }
  }

  private startHeartbeat() {
    if (this.pingInterval) window.clearInterval(this.pingInterval);
    this.pingInterval = window.setInterval(() => {
      if (this.connection && this.connection.open) {
        this.connection.send({ type: 'PING', timestamp: Date.now() });
      }
    }, 15000);
  }

  private scheduleReconnect() {
    if (this.isDestroyed || this.reconnectTimer) return;
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      if (!this.connection || !this.connection.open) {
        if (this.peer) {
          try { this.peer.destroy(); } catch { /* ignore */ }
          this.peer = null;
        }
        this.connectToHost();
      }
    }, 3000);
  }

  public sendCommand(cmd: Omit<RemoteCommand, 'timestamp'> & { timestamp?: number }) {
    const fullCmd: RemoteCommand = {
      ...cmd,
      speaker: this.speaker,
      speakerName: this.speaker === 'devarsh' ? 'Devarsh Patel' : this.speaker === 'aman' ? 'Aman Kumar Yadav' : 'Co-Presenters',
      timestamp: cmd.timestamp || Date.now()
    };

    // Trigger local haptic feedback on mobile
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
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

    // Send to Stage WebRTC Host
    if (this.connection && this.connection.open) {
      try {
        this.connection.send(fullCmd);
      } catch {
        // Ignore
      }
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
    if (this.pingInterval) window.clearInterval(this.pingInterval);
    if (this.reconnectTimer) window.clearTimeout(this.reconnectTimer);
    this.stateListeners.clear();
    this.connectionListeners.clear();
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }
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
