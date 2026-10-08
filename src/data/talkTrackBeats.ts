import { talkLinesPartOne } from './talkTrackBeatsPartOne';
import { talkLinesPartTwo } from './talkTrackBeatsPartTwo';
import { TalkBeat, TalkLineDraft, TalkSpeaker } from './talkTrackTypes';

// Devarsh opens and the lines alternate from there, so the talk reads as one conversation.
const SPEAKER_BY_POSITION: TalkSpeaker[] = ['devarsh', 'aman'];

const withSpeakers = (lines: TalkLineDraft[], offset: number): TalkBeat[] =>
  lines.map((line, i) => {
    const position = offset + i;
    return {
      ...line,
      id: `line-${String(position + 1).padStart(2, '0')}`,
      speaker: SPEAKER_BY_POSITION[position % SPEAKER_BY_POSITION.length]
    };
  });

export const talkTrackBeats: TalkBeat[] = [
  ...withSpeakers(talkLinesPartOne, 0),
  ...withSpeakers(talkLinesPartTwo, talkLinesPartOne.length)
];

/** Opening lines, shown on the phone's read-through card. */
export const talkOpeningText = talkTrackBeats.slice(0, 2).map((beat) => beat.say).join(' ');
/** Closing lines, shown on the phone's read-through card. */
export const talkClosingText = talkTrackBeats.slice(-2).map((beat) => beat.say).join(' ');
