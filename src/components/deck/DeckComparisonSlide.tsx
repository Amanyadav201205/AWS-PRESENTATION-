import { ReactNode } from 'react';
import { DeckSlide } from '../../data/deck/deckTypes';
import { DeckTable } from './DeckTable';
import { FitToBox } from './FitToBox';

interface DeckComparisonSlideProps {
  slide: DeckSlide;
  renderDiagram: () => ReactNode;
}

/** One screen per module: the live naive and Well-Architected simulation side by side, with the measures underneath. */
export const DeckComparisonSlide: React.FC<DeckComparisonSlideProps> = ({ slide, renderDiagram }) => (
  <div className="deck-comparison">
    <div className="deck-comparison-head">
      <p className="deck-eyebrow">{slide.eyebrow}</p>
      <h2 className="deck-title">{slide.title}</h2>
      {slide.banner && <p className="deck-banner deck-banner-alert">{slide.banner}</p>}
    </div>
    <div className="deck-diagram">
      <FitToBox>
        <div className="deck-sim-labels" aria-hidden="true">
          <span className="deck-label-naive">Naive build</span>
          <span className="deck-label-waf">Well-Architected build</span>
        </div>
        {renderDiagram()}
      </FitToBox>
    </div>
    {slide.tables?.map((table) => (
      <DeckTable key={table.headers.join('|')} table={table} />
    ))}
  </div>
);
