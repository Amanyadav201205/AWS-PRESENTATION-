import React, { ReactNode } from 'react';
import { deckSlides, DECK_SLIDE_COUNT } from '../../data/deck/buildDeck';
import { DeckSlide } from '../../data/deck/deckTypes';
import { talkTrackBeats } from '../../data/talkTrackBeats';
import { DeckComparisonSlide } from './DeckComparisonSlide';
import { DeckModuleTheorySlide } from './DeckModuleTheorySlide';
import { DeckTextSlide } from './DeckTextSlide';
import { Cloud, Download, LogOut, ChevronLeft, ChevronRight, Mic } from 'lucide-react';

interface PresentationDeckProps {
  /** Index of the line on the stage. The slide follows the line. */
  lineIndex: number;
  slideIndex: number;
  onStep: (step: number) => void;
  onExit: () => void;
  onExportPptx: () => void;
  isExporting: boolean;
  renderDiagram: (domainIndex?: number) => ReactNode;
  onTriggerChaos?: () => void;
  isChaosActive?: boolean;
}

const renderSlide = (
  slide: DeckSlide,
  renderDiagram: (domainIndex?: number) => ReactNode,
  onTriggerChaos?: () => void,
  isChaosActive?: boolean
): ReactNode => {
  if (slide.kind === 'module-theory') return <DeckModuleTheorySlide slide={slide} />;
  if (slide.kind === 'comparison') {
    return (
      <DeckComparisonSlide
        slide={slide}
        renderDiagram={renderDiagram}
        onTriggerChaos={onTriggerChaos}
        isChaosActive={isChaosActive}
      />
    );
  }
  return <DeckTextSlide slide={slide} />;
};

export const PresentationDeck: React.FC<PresentationDeckProps> = ({
  lineIndex,
  slideIndex,
  onStep,
  onExit,
  onExportPptx,
  isExporting,
  renderDiagram,
  onTriggerChaos,
  isChaosActive
}) => {
  const safeIndex = Math.min(Math.max(slideIndex, 0), DECK_SLIDE_COUNT - 1);
  const slide = deckSlides[safeIndex];
  const progress = ((safeIndex + 1) / DECK_SLIDE_COUNT) * 100;
  const lineCount = talkTrackBeats.length;
  const currentLine = Math.max(lineIndex + 1, 0);

  const beatIndex = Math.min(Math.max(lineIndex, 0), lineCount - 1);
  const currentBeat = talkTrackBeats[beatIndex];
  const isDevarsh = currentBeat?.speaker === 'devarsh';
  const speakerName = isDevarsh ? 'Devarsh' : 'Aman';

  return (
    <div className="presenter-overlay deck-root" role="dialog" aria-modal="true" aria-label="Presentation deck">
      <header className="deck-topbar">
        <div className="deck-brand">
          <Cloud size={18} color="#FF9900" />
          <span>AWS Well-Architected Framework</span>
          <span className="deck-brand-pill">16:9 Presentation</span>
        </div>

        <div className="deck-topbar-actions">
          <button type="button" className="deck-button" onClick={onExportPptx} disabled={isExporting}>
            <Download size={14} />
            <span>{isExporting ? 'Building PowerPoint…' : 'Download PowerPoint'}</span>
          </button>
          <button type="button" className="deck-button" onClick={onExit}>
            <LogOut size={14} />
            <span>Exit deck (Esc)</span>
          </button>
        </div>
      </header>

      <main className="deck-stage-wrap">
        <section className="deck-slide" aria-live="polite" aria-label={`Slide ${safeIndex + 1} of ${DECK_SLIDE_COUNT}`}>
          {renderSlide(slide, renderDiagram, onTriggerChaos, isChaosActive)}
        </section>
      </main>

      <footer className="deck-footer">
        <div className="deck-nav">
          <button
            type="button"
            className="deck-button"
            onClick={() => onStep(-1)}
            disabled={lineIndex <= 0}
            aria-label="Previous line"
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>
          <button
            type="button"
            className="deck-button deck-button-primary"
            onClick={() => onStep(1)}
            disabled={lineIndex >= lineCount - 1}
            aria-label="Next line"
          >
            <span>Next line</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Live Spoken Prompter Snippet */}
        {currentBeat && (
          <div className="deck-prompter-preview" style={{ display: 'flex', alignItems: 'center', gap: 10, maxWidth: 620, overflow: 'hidden' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 12,
                fontWeight: 800,
                textTransform: 'uppercase',
                padding: '3px 10px',
                borderRadius: 9999,
                background: isDevarsh ? 'rgba(0, 102, 204, 0.12)' : 'rgba(255, 153, 0, 0.15)',
                color: isDevarsh ? '#0066cc' : '#8a4b00',
                whiteSpace: 'nowrap'
              }}
            >
              <Mic size={12} />
              {speakerName}
            </span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#0f172a',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
              title={currentBeat.say}
            >
              {currentBeat.say}
            </span>
          </div>
        )}

        <div className="deck-progress" role="progressbar" aria-valuemin={1} aria-valuemax={DECK_SLIDE_COUNT} aria-valuenow={safeIndex + 1} aria-label="Slide progress">
          <span style={{ width: `${progress}%` }} />
        </div>
        <span className="deck-counter">Slide {safeIndex + 1} of {DECK_SLIDE_COUNT} · Line {currentLine} of {lineCount}</span>
      </footer>
    </div>
  );
};
