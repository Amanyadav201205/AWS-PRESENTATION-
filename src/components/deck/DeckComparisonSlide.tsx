import { DeckSlide } from '../../data/deck/deckTypes';
import { allDomains } from '../../data/index';
import { DeckFlowColumn } from './DeckFlowColumn';
import { DeckTable } from './DeckTable';

interface DeckComparisonSlideProps {
  slide: DeckSlide;
  isFailing: boolean;
}

/** One screen per module: the naive and Well-Architected flows side by side, with the measures underneath. */
export const DeckComparisonSlide: React.FC<DeckComparisonSlideProps> = ({ slide, isFailing }) => {
  const domain = allDomains[slide.domainIndex ?? 0];
  const affectedNodeIds = domain.chaos.affectedNodeIds;
  return (
    <div className="deck-comparison">
      <div className="deck-comparison-head">
        <p className="deck-eyebrow">{slide.eyebrow}</p>
        <h2 className="deck-title">{slide.title}</h2>
        {slide.banner && <p className="deck-banner deck-banner-alert">{slide.banner}</p>}
      </div>
      <div className="deck-flow-pair">
        <DeckFlowColumn spec={domain.naive} label="Naive build" tone="naive" affectedNodeIds={affectedNodeIds} isFailing={isFailing} />
        <DeckFlowColumn spec={domain.wellArch} label="Well-Architected build" tone="resilient" affectedNodeIds={affectedNodeIds} isFailing={isFailing} />
      </div>
      {slide.tables?.map((table) => (
        <DeckTable key={table.headers.join('|')} table={table} />
      ))}
    </div>
  );
};
