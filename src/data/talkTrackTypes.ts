import { RemoteCommand } from '../services/presentationRemoteSync';

export type TalkSpeaker = 'devarsh' | 'aman';

/** One command the phone sends to the big screen. The timestamp is added at send time. */
export type TalkCue = Omit<RemoteCommand, 'timestamp'>;

/**
 * One spoken line. Tapping the phone button sends `cues` so the screen already shows the
 * matching visual before the presenter says `say`.
 */
export interface TalkBeat {
  id: string;
  speaker: TalkSpeaker;
  /** Index into allDomains: 0 = Architecture Overview … 14 = Executive Conclusion. */
  domainIndex: number;
  /** The exact line to say, kept to one breath. */
  say: string;
  /** One line describing what the big screen shows after the tap. */
  show: string;
  cues: TalkCue[];
  /** Plain-text formula for the presenter's phone. The big screen shows it on the Proof slide. */
  formula?: string;
}

/** A line before its id and speaker are assigned. The speakers alternate in code, so the flow never breaks. */
export type TalkLineDraft = Omit<TalkBeat, 'id' | 'speaker'>;
