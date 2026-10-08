import { talkTrackBeats } from './talkTrackBeats';
import { TalkBeat } from './talkTrackTypes';

/** A steady delivery pace of about 144 words per minute. */
export const SPEECH_WORDS_PER_SECOND = 2.4;
/** Allowance for the pause before each line. */
export const TAP_SECONDS = 0.5;
export const TALK_LIMIT_SECONDS = 8 * 60;
/** Time the stage needs after a module change before it can take screen cues. */
export const TALK_SETTLE_MS = 350;

export const countWords = (text: string): number =>
  text.trim().split(/\s+/).filter(Boolean).length;

export const estimateBeatSeconds = (beat: TalkBeat): number =>
  countWords(beat.say) / SPEECH_WORDS_PER_SECOND + TAP_SECONDS;

export const estimateTalkSeconds = (beats: TalkBeat[] = talkTrackBeats): number =>
  beats.reduce((total, beat) => total + estimateBeatSeconds(beat), 0);

/** Planned seconds for the first `count` lines. */
export const estimateSecondsForLines = (count: number, beats: TalkBeat[] = talkTrackBeats): number =>
  estimateTalkSeconds(beats.slice(0, Math.max(0, count)));

export const formatClock = (totalSeconds: number): string => {
  const rounded = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(rounded / 60);
  const seconds = rounded % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
