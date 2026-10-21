import type { TalkCue } from '../talkTrackTypes';

/** Which layout a slide uses on the big screen. */
export type DeckSlideKind = 'title' | 'agenda' | 'theory' | 'module-theory' | 'comparison' | 'closing';

/** One spoken line. Its cues run when the line is taken, so the screen is ready before the presenter speaks. */
export interface DeckLine {
  say: string;
  cues?: TalkCue[];
}

export interface DeckSlide {
  id: string;
  kind: DeckSlideKind;
  /** Small label above the title, for example "Module 3 · Compute Layer". */
  eyebrow: string;
  title: string;
  /** Short bullet points printed on the slide. */
  points: string[];
  /** Module index (0 to 14) whose diagram or metrics the slide shows. Omit to keep the current module. */
  domainIndex?: number;
  /** Named law or theorem with its author and year, shown under the title. */
  source?: string;
  /** LaTeX for the formula shown on the slide. */
  formula?: string;
  /** Plain-text reading of the formula, used in the PowerPoint export and the printed script. */
  formulaText?: string;
  lines: DeckLine[];
}
