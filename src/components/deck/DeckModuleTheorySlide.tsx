import React, { useState } from 'react';
import { DeckSlide } from '../../data/deck/deckTypes';
import { DeckTable } from './DeckTable';
import { Sparkles, AlertTriangle, Target, CheckCircle2, Table as TableIcon } from 'lucide-react';

interface DeckModuleTheorySlideProps {
  slide: DeckSlide;
}

export const DeckModuleTheorySlide: React.FC<DeckModuleTheorySlideProps> = ({ slide }) => {
  const [showTable, setShowTable] = useState(false);

  const cards = slide.cards && slide.cards.length >= 3 ? slide.cards : [
    {
      tag: '🎯 Real-World Scenario',
      title: 'The Challenge',
      desc: slide.points[0] ?? 'High user load and real-world conditions test fragile single-server setups.',
      variant: 'scenario' as const
    },
    {
      tag: '⚠️ Naive Anti-Pattern',
      title: 'Single Point of Failure',
      desc: slide.points[1] ?? 'Unpartitioned dependencies and monolithic instances crash when traffic spikes.',
      variant: 'spof' as const
    },
    {
      tag: '🚀 Well-Architected Fix',
      title: 'Resilient Cloud Design',
      desc: slide.points[2] ?? 'Decoupled, multi-AZ services with automated healing provide 99.99% availability.',
      variant: 'waf' as const
    }
  ];

  return (
    <div className="gamma-slide gamma-theory-slide">
      {/* Top Metadata Bar */}
      <div className="gamma-slide-meta">
        <div className="gamma-pill-group">
          <span className="gamma-pill gamma-pill-eyebrow">{slide.eyebrow}</span>
          {slide.category && <span className="gamma-pill gamma-pill-category">{slide.category}</span>}
          {slide.pillars?.slice(0, 3).map((pillar) => (
            <span key={pillar} className="gamma-pill gamma-pill-pillar">{pillar}</span>
          ))}
        </div>
        {slide.tables && slide.tables.length > 0 && (
          <button
            type="button"
            className={`gamma-view-toggle ${showTable ? 'active' : ''}`}
            onClick={() => setShowTable(!showTable)}
            title="Toggle component breakdown table"
          >
            <TableIcon size={13} />
            <span>{showTable ? 'Show Gamma Cards' : 'View Component Specs'}</span>
          </button>
        )}
      </div>

      {/* Slide Header */}
      <div className="gamma-slide-header">
        <h2 className="gamma-slide-title">{slide.title}</h2>
        {slide.banner && (
          <div className="gamma-principle-banner">
            <span className="gamma-principle-icon">⚡</span>
            <span className="gamma-principle-text">{slide.banner}</span>
          </div>
        )}
      </div>

      {/* Main Slide Content: 3-Card Gamma Layout or Detailed Table */}
      {showTable ? (
        <div className="gamma-table-wrap">
          {slide.tables?.map((table) => (
            <DeckTable key={table.headers.join('|')} table={table} />
          ))}
        </div>
      ) : (
        <div className="gamma-cards-grid">
          {cards.map((card, idx) => {
            const isScenario = card.variant === 'scenario' || idx === 0;
            const isSpof = card.variant === 'spof' || idx === 1;
            const isWaf = card.variant === 'waf' || idx === 2;

            return (
              <div
                key={card.tag ?? idx}
                className={`gamma-card ${isScenario ? 'gamma-card-scenario' : isSpof ? 'gamma-card-spof' : 'gamma-card-waf'}`}
              >
                <div className="gamma-card-header">
                  <div className="gamma-card-badge">
                    {isScenario && <Target size={14} className="gamma-icon-scenario" />}
                    {isSpof && <AlertTriangle size={14} className="gamma-icon-spof" />}
                    {isWaf && <Sparkles size={14} className="gamma-icon-waf" />}
                    <span>{card.tag}</span>
                  </div>
                </div>
                <h3 className="gamma-card-title">{card.title}</h3>
                <p className="gamma-card-desc">{card.desc}</p>
                <div className="gamma-card-footer">
                  <span className="gamma-card-footer-pill">
                    {isScenario && 'Student Scenario'}
                    {isSpof && 'What Breaks (SPOF)'}
                    {isWaf && 'AWS Solution'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Key Metrics Strip */}
      {slide.metrics && slide.metrics.length > 0 && (
        <div className="gamma-metrics-strip">
          <div className="gamma-metrics-label">
            <CheckCircle2 size={13} color="var(--status-success)" />
            <span>Well-Architected Impact:</span>
          </div>
          <div className="gamma-metrics-items">
            {slide.metrics.map((metric) => (
              <div key={metric.label} className="gamma-metric-item">
                <span className="gamma-metric-name">{metric.label}:</span>
                <span className="gamma-metric-naive">{metric.naiveVal}</span>
                <span className="gamma-metric-arrow">➔</span>
                <span className="gamma-metric-waf">{metric.wafVal}</span>
                <span className="gamma-metric-benefit">({metric.benefit})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
