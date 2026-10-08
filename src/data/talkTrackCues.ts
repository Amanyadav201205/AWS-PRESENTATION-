import { TalkCue } from './talkTrackTypes';

// The talk runs in presenter mode: the big screen is the full-screen deck with three slides
// (keynote = architecture and outage, theory = formula proof).

export const ENTER_DECK: TalkCue = { type: 'ENTER_PRESENTER_MODE' };
export const ARCHITECTURE_SLIDE: TalkCue = { type: 'SET_SLIDE_MODE', slideMode: 'keynote' };
export const PROOF_SLIDE: TalkCue = { type: 'SET_SLIDE_MODE', slideMode: 'theory' };
export const INJECT_OUTAGE: TalkCue = { type: 'TRIGGER_CHAOS' };
export const TRAFFIC_PULSE: TalkCue = { type: 'RUN_SLIDE_SIM' };
