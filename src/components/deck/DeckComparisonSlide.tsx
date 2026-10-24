import React, { ReactNode } from 'react';
import { DeckSlide } from '../../data/deck/deckTypes';
import { FitToBox } from './FitToBox';
import { Flame, ShieldCheck, AlertOctagon } from 'lucide-react';

interface DeckComparisonSlideProps {
  slide: DeckSlide;
  renderDiagram: () => ReactNode;
}

/** One screen per module: the live naive and Well-Architected simulation side by side, with compact metrics underneath. */
export const DeckComparisonSlide: React.FC<DeckComparisonSlideProps> = ({ slide, renderDiagram }) => {
  const metrics = slide.metrics ?? [];

  return (
    <div className="gamma-slide gamma-comparison-slide">
      {/* Slide Header */}
      <div className="gamma-comparison-head">
        <div className="gamma-comparison-meta">
          <span className="gamma-pill gamma-pill-eyebrow">{slide.eyebrow}</span>
          {slide.category && <span className="gamma-pill gamma-pill-category">{slide.category}</span>}
          {slide.banner && (
            <span className="gamma-disaster-pill">
              <Flame size={18} color="#b91c1c" />
              <span>{slide.banner}</span>
            </span>
          )}
        </div>
        <h2 className="gamma-comparison-title">{slide.title}</h2>
      </div>

      {/* Main Diagram Area with Fixed High-Contrast Lane Headers and Scaled Viewport */}
      <div className="gamma-diagram-stage">
        <div className="gamma-sim-labels" aria-hidden="true">
          <div className="gamma-sim-lane-label gamma-lane-naive">
            <AlertOctagon size={18} />
            <span>FRAGILE ANTI-PATTERN · SINGLE POINT OF FAILURE</span>
          </div>
          <div className="gamma-sim-lane-label gamma-lane-waf">
            <ShieldCheck size={18} />
            <span>AWS WELL-ARCHITECTED · RESILIENT MULTI-AZ CLUSTER</span>
          </div>
        </div>
        <div className="gamma-diagram-viewport">
          <FitToBox>
            {renderDiagram()}
          </FitToBox>
        </div>
      </div>

      {/* Bottom Comparison Metrics Cards - Sleek and Compact so Diagram Has Maximum Height */}
      <div className="gamma-comparison-footer">
        {metrics.map((metric) => (
          <div key={metric.label} className="gamma-comparison-metric-card">
            <span className="gamma-comp-metric-label">{metric.label}</span>
            <div className="gamma-comp-metric-vals">
              <span className="gamma-comp-naive">{metric.naiveVal}</span>
              <span className="gamma-comp-arrow">➔</span>
              <span className="gamma-comp-waf">{metric.wafVal}</span>
            </div>
            <span className="gamma-comp-benefit">{metric.benefit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
