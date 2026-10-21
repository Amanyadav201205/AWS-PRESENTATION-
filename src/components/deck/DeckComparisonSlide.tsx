import { ReactNode } from 'react';
import { DeckSlide } from '../../data/deck/deckTypes';

interface DeckComparisonSlideProps {
  slide: DeckSlide;
  renderDiagram: () => ReactNode;
}

/** One screen per module: the naive build and the Well-Architected build side by side, under the same load and failure. */
export const DeckComparisonSlide: React.FC<DeckComparisonSlideProps> = ({ slide, renderDiagram }) => {
  const [naiveSummary, wafSummary] = slide.points;
  return (
    <div className="deck-comparison">
      <div className="deck-comparison-head">
        <div>
          <p className="deck-eyebrow">{slide.eyebrow}</p>
          <h2 className="deck-title">{slide.title}</h2>
        </div>
      </div>
      <div className="deck-comparison-labels" aria-hidden="true">
        <span className="deck-label deck-label-naive">Naive build</span>
        <span className="deck-label deck-label-waf">Well-Architected build</span>
      </div>
      <div className="deck-diagram">{renderDiagram()}</div>
      <div className="deck-comparison-summary">
        <span>{naiveSummary}</span>
        <span>{wafSummary}</span>
      </div>
    </div>
  );
};
