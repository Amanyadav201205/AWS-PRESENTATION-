import { RemoteCommand } from '../services/presentationRemoteSync';

export type TalkSpeaker = 'devarsh' | 'aman';

/** One command the phone sends to the big screen. The timestamp is added at send time. */
export type TalkCue = Omit<RemoteCommand, 'timestamp'>;

/**
 * One spoken line, flattened from the deck. Taking the line moves the big screen to its slide,
 * and runs its cues, before the presenter says `say`.
 */
export interface TalkBeat {
  id: string;
  speaker: TalkSpeaker;
  /** Index into allDomains: 0 = Architecture Overview … 14 = Executive Conclusion. */
  domainIndex: number;
  /** Index into deckSlides for the slide this line belongs to. */
  slideIndex: number;
  /** The exact line to say, kept to one breath. */
  say: string;
  /** One line describing what the big screen shows after the line is taken. */
  show: string;
  cues: TalkCue[];
}
