import { allDomains } from '../index';
import { theoreticalFoundations } from '../theoreticalFoundations';
import { FAILURE, LOAD_NORMAL, LOAD_PEAK, PACKETS_ON, RECOVER, SHOW_BOTH } from '../talkTrackCues';
import { DeckSlide } from './deckTypes';
import { moduleScripts } from './moduleScripts';
import { agendaSlide, closingSlide, theorySlides, titleSlide } from './theorySlides';

const MODULE_COUNT = allDomains.length;

const buildModuleSlides = (index: number): DeckSlide[] => {
  const domain = allDomains[index];
  const theory = theoreticalFoundations[domain.id];
  const script = moduleScripts[index];
  const moduleLabel = `Module ${index + 1} of ${MODULE_COUNT}`;
  const law = theory?.lawOrTheorem;

  const theorySlide: DeckSlide = {
    id: `module-${index + 1}-theory`,
    kind: 'module-theory',
    eyebrow: `${moduleLabel} · Theory`,
    title: domain.title,
    points: [...script.points],
    source: law ? `${law.name} · ${law.founder} (${law.year})` : undefined,
    formula: law?.mathematicalFormula,
    formulaText: law?.formulaExplanation,
    domainIndex: index,
    lines: [{ say: script.theory }]
  };

  const comparisonSlide: DeckSlide = {
    id: `module-${index + 1}-comparison`,
    kind: 'comparison',
    eyebrow: `${moduleLabel} · Naive (left) vs Well-Architected (right)`,
    title: domain.subtitle,
    points: [
      `Naive: ${domain.naive.availabilitySLA}, recovery ${domain.naive.rto}`,
      `Well-Architected: ${domain.wellArch.availabilitySLA}, recovery ${domain.wellArch.rto}`
    ],
    domainIndex: index,
    lines: [
      { say: script.naive, cues: [SHOW_BOTH, LOAD_NORMAL, RECOVER, PACKETS_ON] },
      { say: script.resilient, cues: [LOAD_PEAK, FAILURE, PACKETS_ON] }
    ]
  };

  return [theorySlide, comparisonSlide];
};

/** The full presentation, in the order it is spoken. */
export const deckSlides: DeckSlide[] = [
  titleSlide,
  agendaSlide,
  ...theorySlides,
  ...Array.from({ length: MODULE_COUNT }, (_, index) => buildModuleSlides(index)).flat(),
  closingSlide
];

export const DECK_SLIDE_COUNT = deckSlides.length;
