import React, { useState } from 'react';
import { DeckSlide } from '../../data/deck/deckTypes';
import { DeckTable } from './DeckTable';
import { ShieldCheck, AlertOctagon, Table as TableIcon } from 'lucide-react';

interface DeckModuleTheorySlideProps {
  slide: DeckSlide;
}

export const DeckModuleTheorySlide: React.FC<DeckModuleTheorySlideProps> = ({ slide }) => {
  const [showTable, setShowTable] = useState(false);

  const scenarioText = slide.points[0] ?? 'Production traffic and real-world failure modes test architectural resilience.';
  const naiveText = slide.points[1] ?? 'Unpartitioned monolithic components create single points of failure that choke under load.';
  const wellArchText = slide.points[2] ?? 'Decoupled multi-AZ services with automated scaling and self-healing maintain 99.99% uptime.';

  return (
    <div className="gamma-slide gamma-theory-slide">
      {/* Top Metadata Bar - High Contrast */}
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
            <TableIcon size={20} />
            <span>{showTable ? 'Show Architecture Defense' : 'View Component Specs'}</span>
          </button>
        )}
      </div>

      {/* Slide Header: Large High-Contrast Title for Projectors */}
      <div className="gamma-slide-header">
        <h2 className="gamma-slide-title">{slide.title}</h2>
        {slide.banner && (
          <div className="gamma-principle-banner">
            <span className="gamma-banner-tag">CORE PRINCIPLE</span>
            <span className="gamma-principle-text">{slide.banner.replace(/^Core Principle[·:\s]*/i, '')}</span>
          </div>
        )}
      </div>

      {/* Main Slide Content */}
      {showTable ? (
        <div className="gamma-table-wrap">
          {slide.tables?.map((table) => (
            <DeckTable key={table.headers.join('|')} table={table} />
          ))}
        </div>
      ) : (
        <div className="defense-architecture-layout">
          {/* Real-World Context Bar */}
          <div className="defense-context-bar">
            <span className="defense-context-tag">PRODUCTION CHALLENGE</span>
            <span className="defense-context-text">{scenarioText}</span>
          </div>

          {/* 2-Column Architectural Contrast (Human-Engineered, Non-AI) */}
          <div className="defense-columns-grid">
            {/* Left: Anti-Pattern Column */}
            <div className="defense-col defense-col-naive">
              <div className="defense-col-header">
                <div className="defense-col-badge badge-naive">
                  <AlertOctagon size={24} />
                  <span>THE FRAGILE ANTI-PATTERN</span>
                </div>
                <span className="defense-tag-danger">Single Point of Failure</span>
              </div>
              <div className="defense-col-body">
                <p className="defense-main-text">{naiveText}</p>
                <div className="defense-callout callout-naive">
                  <div className="defense-callout-title">Production Consequence</div>
                  <div className="defense-callout-desc">Single zone hardware failure or traffic spike causes cascading outages, 504 timeouts, and hours of manual rebuilds.</div>
                </div>
              </div>
            </div>

            {/* Right: Well-Architected Column */}
            <div className="defense-col defense-col-waf">
              <div className="defense-col-header">
                <div className="defense-col-badge badge-waf">
                  <ShieldCheck size={24} />
                  <span>AWS WELL-ARCHITECTED DESIGN</span>
                </div>
                <span className="defense-tag-success">Certified High Availability</span>
              </div>
              <div className="defense-col-body">
                <p className="defense-main-text">{wellArchText}</p>
                <div className="defense-callout callout-waf">
                  <div className="defense-callout-title">Architectural Guarantee</div>
                  <div className="defense-callout-desc">Multi-AZ automated health checks, stateless elasticity, and distributed data replication maintain 99.99% continuity.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom High-Impact Metrics Callout Deck (Big Bold Type Visible from 50m) */}
      {slide.metrics && slide.metrics.length > 0 && (
        <div className="gamma-metrics-strip">
          <div className="gamma-metrics-header-label">
            <span>ARCHITECTURAL DELTA</span>
          </div>
          <div className="gamma-metrics-cards">
            {slide.metrics.map((metric) => (
              <div key={metric.label} className="gamma-metric-box">
                <span className="gamma-metric-box-title">{metric.label}</span>
                <div className="gamma-metric-box-values">
                  <span className="gamma-val-naive">{metric.naiveVal}</span>
                  <span className="gamma-val-arrow">➔</span>
                  <span className="gamma-val-waf">{metric.wafVal}</span>
                </div>
                <span className="gamma-val-benefit">{metric.benefit}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
