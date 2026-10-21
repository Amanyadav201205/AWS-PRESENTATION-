import { allDomains } from '../index';
import { theoreticalFoundations } from '../theoreticalFoundations';
import { FAILURE, LOAD_NORMAL, LOAD_PEAK, PACKETS_ON, RECOVER, SHOW_BOTH } from '../talkTrackCues';
import { DeckSlide, DeckTable } from './deckTypes';
import { moduleScripts } from './moduleScripts';
import { moduleTables } from './moduleTables';
import { extractPercent } from './theoryTables';
import { agendaSlide, closingSlide, theorySlides, titleSlide } from './theorySlides';

const MODULE_COUNT = allDomains.length;

const componentTable = (index: number): DeckTable => ({
  headers: ['Component', 'Naive build', 'Well-Architected build'],
  rows: moduleTables[index]
});

const measuresTable = (index: number): DeckTable => {
  const { naive, wellArch } = allDomains[index];
  return {
    headers: ['Build', 'Availability', 'Recovery time', 'Monthly cost'],
    rows: [
      ['Naive build', extractPercent(naive.availabilitySLA), naive.rto, `$${naive.monthlyCostEst.toLocaleString('en-US')}`],
      ['Well-Architected', extractPercent(wellArch.availabilitySLA), wellArch.rto, `$${wellArch.monthlyCostEst.toLocaleString('en-US')}`]
    ]
  };
};

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
    banner: law ? `Theory: ${law.name} · ${law.founder} (${law.year})` : undefined,
    points: [...script.points],
    tables: [componentTable(index)],
    domainIndex: index,
    lines: [{ say: script.theory }]
  };

  const comparisonSlide: DeckSlide = {
    id: `module-${index + 1}-comparison`,
    kind: 'comparison',
    eyebrow: `${moduleLabel} · Naive (left) vs Well-Architected (right)`,
    title: domain.subtitle,
    banner: `Failure injected: ${domain.chaos.title}`,
    points: [],
    tables: [measuresTable(index)],
    domainIndex: index,
    lines: [
      { say: script.leftRest, cues: [SHOW_BOTH, LOAD_NORMAL, RECOVER, PACKETS_ON] },
      { say: script.rightRest, cues: [SHOW_BOTH, LOAD_NORMAL, RECOVER, PACKETS_ON] },
      { say: script.underFailure, cues: [LOAD_PEAK, FAILURE, PACKETS_ON] }
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
