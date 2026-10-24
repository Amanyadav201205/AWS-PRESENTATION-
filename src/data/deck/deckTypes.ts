import type { TalkCue } from '../talkTrackTypes';

/** Which layout a slide uses on the big screen. */
export type DeckSlideKind = 'title' | 'agenda' | 'theory' | 'module-theory' | 'comparison' | 'closing';

/** One spoken line. Its cues run when the line is taken, so the screen is ready before the presenter speaks. */
export interface DeckLine {
  say: string;
  cues?: TalkCue[];
}

/** A table printed on a slide. The first row of `headers` labels the columns. */
export interface DeckTable {
  headers: string[];
  rows: string[][];
}

export interface GammaCard {
  tag?: string;
  icon?: string;
  title: string;
  desc: string;
  variant?: 'scenario' | 'spof' | 'waf' | 'metric' | 'neutral';
}

export interface DeckMetric {
  label: string;
  naiveVal: string;
  wafVal: string;
  benefit: string;
}

export interface DeckSlide {
  id: string;
  kind: DeckSlideKind;
  /** Small label above the title, for example "Module 3 · Compute Layer". */
  eyebrow: string;
  title: string;
  /** One highlighted sentence under the title: the principle, the failure, or the source of the theory. */
  banner?: string;
  /** Short bullet points printed on the slide. */
  points: string[];
  /** Detailed tables printed on the slide, matching what the presenters say. */
  tables?: DeckTable[];
  /** Module index (0 to 14) whose diagram or metrics the slide shows. Omit to keep the current module. */
  domainIndex?: number;
  lines: DeckLine[];
  /** Gamma AI visual cards for modern slide layouts */
  cards?: GammaCard[];
  /** The AWS Well-Architected Pillars relevant to this slide */
  pillars?: string[];
  /** Real-world metrics comparing naive vs Well-Architected */
  metrics?: DeckMetric[];
  /** Category or domain subtitle */
  category?: string;
}

