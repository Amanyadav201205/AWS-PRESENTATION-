import { ReactNode } from 'react';
import { DeckSlide } from '../../data/deck/deckTypes';
import { DeckTable } from './DeckTable';

interface DeckComparisonSlideProps {
  slide: DeckSlide;
  renderDiagram: () => ReactNode;
}

/** One screen per module: the naive and Well-Architected builds side by side, with the measures underneath. */
export const DeckComparisonSlide: React.FC<DeckComparisonSlideProps> = ({ slide, renderDiagram }) => (
  <div className="deck-comparison">
    <div className="deck-comparison-head">
      <p className="deck-eyebrow">{slide.eyebrow}</p>
      <h2 className="deck-title">{slide.title}</h2>
      {slide.banner && <p className="deck-banner deck-banner-alert">{slide.banner}</p>}
    </div>
    <div className="deck-comparison-labels" aria-hidden="true">
      <span className="deck-label deck-label-naive">Naive build</span>
      <span className="deck-label deck-label-waf">Well-Architected build</span>
    </div>
    <div className="deck-diagram">{renderDiagram()}</div>
    {slide.tables?.map((table) => (
      <DeckTable key={table.headers.join('|')} table={table} />
    ))}
  </div>
);
