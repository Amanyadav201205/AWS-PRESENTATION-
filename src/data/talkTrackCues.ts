import { TalkCue } from './talkTrackTypes';

// The big screen shows only the simulation diagram. These cues change what that diagram shows.

export const ENTER_DECK: TalkCue = { type: 'ENTER_PRESENTER_MODE' };
export const SHOW_NAIVE: TalkCue = { type: 'SET_VIEW_MODE', mode: 'naive-only' };
export const SHOW_WAF: TalkCue = { type: 'SET_VIEW_MODE', mode: 'well-arch-only' };
export const SHOW_BOTH: TalkCue = { type: 'SET_VIEW_MODE', mode: 'split' };
export const LOAD_NORMAL: TalkCue = { type: 'SET_TRAFFIC', trafficLoad: 2500 };
export const LOAD_BUSY: TalkCue = { type: 'SET_TRAFFIC', trafficLoad: 25000 };
export const LOAD_PEAK: TalkCue = { type: 'SET_TRAFFIC', trafficLoad: 100000 };
export const FAILURE: TalkCue = { type: 'TRIGGER_CHAOS' };
export const RECOVER: TalkCue = { type: 'RESET_CHAOS' };
export const PACKETS_ON: TalkCue = { type: 'SET_PACKET_FLOW', packetFlow: true };
export const PACKETS_OFF: TalkCue = { type: 'SET_PACKET_FLOW', packetFlow: false };
