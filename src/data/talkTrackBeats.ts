import { deckSlides } from './deck/buildDeck';
import { DeckSlide } from './deck/deckTypes';
import { TalkBeat, TalkSpeaker } from './talkTrackTypes';

// Devarsh opens and the lines alternate from there, so the talk reads as one conversation.
const SPEAKER_BY_POSITION: TalkSpeaker[] = ['devarsh', 'aman'];

const describeSlide = (slide: DeckSlide): string => {
  if (slide.kind === 'module-theory') return `Theory slide: ${slide.banner ?? slide.title}`;
  if (slide.kind === 'comparison') return `Naive (left) vs Well-Architected (right): ${slide.title}`;
  return `${slide.title}`;
};

/** Every spoken line in order, with the slide it belongs to and the domain the stage should show. */
export const talkTrackBeats: TalkBeat[] = (() => {
  const beats: TalkBeat[] = [];
  let domainIndex = 0;
  deckSlides.forEach((slide, slideIndex) => {
    if (slide.domainIndex !== undefined) domainIndex = slide.domainIndex;
    slide.lines.forEach((line, lineIndex) => {
      const position = beats.length;
      beats.push({
        id: `line-${String(position + 1).padStart(2, '0')}`,
        speaker: SPEAKER_BY_POSITION[position % SPEAKER_BY_POSITION.length],
        domainIndex,
        slideIndex,
        say: line.say,
        show: lineIndex === 0 ? describeSlide(slide) : `${describeSlide(slide)} (continued)`,
        cues: line.cues ?? []
      });
    });
  });
  return beats;
})();

/** Slide index for a spoken line. Before the first line the title slide is shown. */
export const slideIndexForLine = (lineIndex: number): number =>
  lineIndex < 0 ? 0 : talkTrackBeats[Math.min(lineIndex, talkTrackBeats.length - 1)]?.slideIndex ?? 0;

/** Opening lines, shown on the phone's read-through card. */
export const talkOpeningText = talkTrackBeats.slice(0, 2).map((beat) => beat.say).join(' ');
/** Closing lines, shown on the phone's read-through card. */
export const talkClosingText = talkTrackBeats.slice(-2).map((beat) => beat.say).join(' ');
