import { ReactNode } from 'react';
import { deckSlides, DECK_SLIDE_COUNT } from '../../data/deck/buildDeck';
import { DeckSlide } from '../../data/deck/deckTypes';
import { talkTrackBeats } from '../../data/talkTrackBeats';
import { DeckComparisonSlide } from './DeckComparisonSlide';
import { DeckModuleTheorySlide } from './DeckModuleTheorySlide';
import { DeckTextSlide } from './DeckTextSlide';

interface PresentationDeckProps {
  /** Index of the line on the stage. The slide follows the line. */
  lineIndex: number;
  slideIndex: number;
  onStep: (step: number) => void;
  onExit: () => void;
  onExportPptx: () => void;
  isExporting: boolean;
  renderDiagram: () => ReactNode;
}

const renderSlide = (slide: DeckSlide, renderDiagram: () => ReactNode): ReactNode => {
  if (slide.kind === 'module-theory') return <DeckModuleTheorySlide slide={slide} />;
  if (slide.kind === 'comparison') return <DeckComparisonSlide slide={slide} renderDiagram={renderDiagram} />;
  return <DeckTextSlide slide={slide} />;
};

export const PresentationDeck: React.FC<PresentationDeckProps> = ({
  lineIndex,
  slideIndex,
  onStep,
  onExit,
  onExportPptx,
  isExporting,
  renderDiagram
}) => {
  const safeIndex = Math.min(Math.max(slideIndex, 0), DECK_SLIDE_COUNT - 1);
  const slide = deckSlides[safeIndex];
  const progress = ((safeIndex + 1) / DECK_SLIDE_COUNT) * 100;
  const lineCount = talkTrackBeats.length;
  const currentLine = Math.max(lineIndex + 1, 0);

  return (
    <div className="presenter-overlay deck-root" role="dialog" aria-modal="true" aria-label="Presentation deck">
      <header className="deck-topbar">
        <span className="deck-brand">AWS Well-Architected Framework</span>
        <div className="deck-topbar-actions">
          <button type="button" className="deck-button" onClick={onExportPptx} disabled={isExporting}>
            {isExporting ? 'Building PowerPoint…' : 'Download PowerPoint'}
          </button>
          <button type="button" className="deck-button" onClick={onExit}>Exit deck (Esc)</button>
        </div>
      </header>

      <main className="deck-stage-wrap">
        <section className="deck-slide" aria-live="polite" aria-label={`Slide ${safeIndex + 1} of ${DECK_SLIDE_COUNT}`}>
          {renderSlide(slide, renderDiagram)}
        </section>
      </main>

      <footer className="deck-footer">
        <div className="deck-nav">
          <button type="button" className="deck-button" onClick={() => onStep(-1)} disabled={lineIndex <= 0} aria-label="Previous line">← Previous</button>
          <button type="button" className="deck-button deck-button-primary" onClick={() => onStep(1)} disabled={lineIndex >= lineCount - 1} aria-label="Next line">Next line →</button>
        </div>
        <div className="deck-progress" role="progressbar" aria-valuemin={1} aria-valuemax={DECK_SLIDE_COUNT} aria-valuenow={safeIndex + 1} aria-label="Slide progress">
          <span style={{ width: `${progress}%` }} />
        </div>
        <span className="deck-counter">Slide {safeIndex + 1} of {DECK_SLIDE_COUNT} · Line {currentLine} of {lineCount}</span>
      </footer>
    </div>
  );
};
