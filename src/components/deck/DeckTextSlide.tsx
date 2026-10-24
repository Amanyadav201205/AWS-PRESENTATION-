import React from 'react';
import { DeckSlide } from '../../data/deck/deckTypes';
import { DeckTable } from './DeckTable';
import {
  ShieldCheck,
  Clock,
  AlertTriangle,
  DollarSign,
  Cloud
} from 'lucide-react';

interface DeckTextSlideProps {
  slide: DeckSlide;
}

export const DeckTextSlide: React.FC<DeckTextSlideProps> = ({ slide }) => {
  const isTitle = slide.kind === 'title';
  const isAgenda = slide.kind === 'agenda';
  const isClosing = slide.kind === 'closing';

  // =========================================================================
  // 1. HERO TITLE SLIDE (Gamma Style)
  // =========================================================================
  if (isTitle) {
    return (
      <div className="gamma-slide gamma-title-slide">
        <div className="gamma-title-badge-row">
          <span className="gamma-brand-badge">
            <Cloud size={14} color="#FF9900" />
            <span>AWS Well-Architected Framework</span>
          </span>
          <span className="gamma-mode-pill">Certified Solutions Architect Defense</span>
        </div>

        <h1 className="gamma-hero-title">
          Naive Builds <span className="gamma-gradient-text">versus</span> Resilient Builds
        </h1>
        <p className="gamma-hero-subtitle">
          An interactive engineering defense contrasting fragile single-point-of-failure architectures against self-healing, cost-optimized multi-AZ cloud blueprints across 15 mission-critical domains.
        </p>

        {/* Presenters Info */}
        <div className="gamma-presenters-card">
          <div className="gamma-presenter">
            <div className="gamma-presenter-avatar">DP</div>
            <div>
              <div className="gamma-presenter-name">Devarsh Patel</div>
              <div className="gamma-presenter-role">AWS Solutions Architect Presenter</div>
            </div>
          </div>
          <div className="gamma-presenters-divider" />
          <div className="gamma-presenter">
            <div className="gamma-presenter-avatar">AK</div>
            <div>
              <div className="gamma-presenter-name">Aman Kumar</div>
              <div className="gamma-presenter-role">AWS Solutions Architect Presenter</div>
            </div>
          </div>
        </div>

        {/* 4 Impact Stat Cards */}
        <div className="gamma-stat-cards-grid">
          <div className="gamma-stat-card">
            <div className="gamma-stat-val">15</div>
            <div className="gamma-stat-label">Live Architectural Domains</div>
            <div className="gamma-stat-sub">Full Stack Coverage</div>
          </div>
          <div className="gamma-stat-card">
            <div className="gamma-stat-val">6</div>
            <div className="gamma-stat-label">Well-Architected Pillars</div>
            <div className="gamma-stat-sub">Enterprise Governance</div>
          </div>
          <div className="gamma-stat-card">
            <div className="gamma-stat-val gamma-stat-success">99.99%</div>
            <div className="gamma-stat-label">Certified Availability</div>
            <div className="gamma-stat-sub">From 98.5% Naive Base</div>
          </div>
          <div className="gamma-stat-card">
            <div className="gamma-stat-val gamma-stat-accent">-59%</div>
            <div className="gamma-stat-label">FinOps Cost Reduction</div>
            <div className="gamma-stat-sub">$4,450 ➔ $1,820 / mo</div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. AGENDA SLIDE (Gamma Style)
  // =========================================================================
  if (isAgenda) {
    return (
      <div className="gamma-slide gamma-agenda-slide">
        <div className="gamma-slide-meta">
          <span className="gamma-pill gamma-pill-eyebrow">Presentation Roadmap</span>
          <span className="gamma-pill gamma-pill-category">20 Minutes · 15 Modules</span>
        </div>

        <h2 className="gamma-slide-title">Core Cloud Theory, Then 15 Live Simulations</h2>
        {slide.banner && (
          <div className="gamma-principle-banner">
            <span className="gamma-principle-icon">🗺️</span>
            <span className="gamma-principle-text">{slide.banner}</span>
          </div>
        )}

        <div className="gamma-agenda-cards-grid">
          <div className="gamma-agenda-card">
            <div className="gamma-agenda-num">01</div>
            <div className="gamma-agenda-content">
              <h3>Part 1 · Foundational Cloud Laws</h3>
              <p>The Six Pillars, Availability in human terms, the myth of the single server (SPOF), and containing Blast Radius with RTO/RPO.</p>
              <ul className="gamma-mini-list">
                <li>Six Pillars of Architecture</li>
                <li>Single Point of Failure</li>
                <li>The Arithmetic of Availability</li>
                <li>Blast Radius, RTO &amp; RPO</li>
              </ul>
            </div>
          </div>

          <div className="gamma-agenda-card">
            <div className="gamma-agenda-num">02</div>
            <div className="gamma-agenda-content">
              <h3>Part 2 · Core Infrastructure Tiers</h3>
              <p>Contrasting fragile single-server anti-patterns against resilient multi-AZ deployments with live traffic &amp; disaster injection.</p>
              <ul className="gamma-mini-list">
                <li>Storage: gp2 vs gp3 &amp; S3 WORM</li>
                <li>Compute: Monolith vs Graviton Fleet</li>
                <li>Database: Single MySQL vs Aurora Multi-AZ</li>
                <li>Networking: Flat VPC vs 3-Tier Isolation</li>
              </ul>
            </div>
          </div>

          <div className="gamma-agenda-card">
            <div className="gamma-agenda-num">03</div>
            <div className="gamma-agenda-content">
              <h3>Part 3 · Advanced Operations &amp; Resiliency</h3>
              <p>Enterprise cloud modernization: zero-trust identity, proactive observability, automated GitOps pipelines, and disaster recovery.</p>
              <ul className="gamma-mini-list">
                <li>Security, IAM &amp; Secrets Manager</li>
                <li>Canaries &amp; Self-Healing Monitoring</li>
                <li>SQS Decoupling &amp; Serverless Lambda</li>
                <li>Multi-Region Active-Active DR</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. EXECUTIVE CLOSING SCORECARD (Gamma Style)
  // =========================================================================
  if (isClosing) {
    return (
      <div className="gamma-slide gamma-closing-slide">
        <div className="gamma-slide-meta">
          <span className="gamma-pill gamma-pill-eyebrow">Executive Verdict</span>
          <span className="gamma-pill gamma-pill-category">Scorecard Across 15 Modules</span>
        </div>

        <h2 className="gamma-slide-title">The Well-Architected Transformation</h2>
        {slide.banner && (
          <div className="gamma-principle-banner">
            <span className="gamma-principle-icon">🏆</span>
            <span className="gamma-principle-text">{slide.banner}</span>
          </div>
        )}

        <div className="gamma-closing-grid">
          <div className="gamma-closing-card">
            <div className="gamma-closing-icon-wrap" style={{ background: 'rgba(30, 126, 52, 0.1)', color: '#1e7e34' }}>
              <ShieldCheck size={24} />
            </div>
            <div className="gamma-closing-title">System Availability</div>
            <div className="gamma-closing-delta">
              <span className="gamma-closing-old">98.5%</span>
              <span className="gamma-closing-arrow">➔</span>
              <span className="gamma-closing-new" style={{ color: '#1e7e34' }}>99.99%</span>
            </div>
            <p className="gamma-closing-desc">Certified High Availability across 3 physical Availability Zones with zero single points of failure.</p>
          </div>

          <div className="gamma-closing-card">
            <div className="gamma-closing-icon-wrap" style={{ background: 'rgba(0, 102, 204, 0.1)', color: '#0066cc' }}>
              <DollarSign size={24} />
            </div>
            <div className="gamma-closing-title">Monthly Cloud Spend</div>
            <div className="gamma-closing-delta">
              <span className="gamma-closing-old">$4,450</span>
              <span className="gamma-closing-arrow">➔</span>
              <span className="gamma-closing-new" style={{ color: '#0066cc' }}>$1,820</span>
            </div>
            <p className="gamma-closing-desc">59% FinOps cost reduction through Graviton ARM processors, S3 Intelligent-Tiering, and serverless compute.</p>
          </div>

          <div className="gamma-closing-card">
            <div className="gamma-closing-icon-wrap" style={{ background: 'rgba(255, 153, 0, 0.1)', color: '#8a4b00' }}>
              <Clock size={24} />
            </div>
            <div className="gamma-closing-title">Recovery Time (RTO)</div>
            <div className="gamma-closing-delta">
              <span className="gamma-closing-old">4-8 Hours</span>
              <span className="gamma-closing-arrow">➔</span>
              <span className="gamma-closing-new" style={{ color: '#8a4b00' }}>&lt; 30 Seconds</span>
            </div>
            <p className="gamma-closing-desc">Automated self-healing replaces stressful manual midnight rebuilds with sub-minute automated failover.</p>
          </div>

          <div className="gamma-closing-card">
            <div className="gamma-closing-icon-wrap" style={{ background: 'rgba(201, 48, 44, 0.1)', color: '#c9302c' }}>
              <AlertTriangle size={24} />
            </div>
            <div className="gamma-closing-title">High Risk Issues (HRIs)</div>
            <div className="gamma-closing-delta">
              <span className="gamma-closing-old">3 Critical</span>
              <span className="gamma-closing-arrow">➔</span>
              <span className="gamma-closing-new" style={{ color: '#1e7e34' }}>0 HRIs</span>
            </div>
            <p className="gamma-closing-desc">100% compliance with AWS Well-Architected Framework guidelines across all 6 core pillars.</p>
          </div>
        </div>

        <div className="gamma-closing-takeaway">
          <span className="gamma-takeaway-bold">The Golden Rule:</span> Start from the failure your business cannot afford to accept, name the pillar it touches, and build the smallest, most resilient design that survives it.
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. CORE THEORY SLIDES (Pillars, SPOF, Nines, Blast Radius, Simulation)
  // =========================================================================
  return (
    <div className={`gamma-slide gamma-theory-doc-slide deck-kind-${slide.kind}`}>
      <div className="gamma-slide-meta">
        <span className="gamma-pill gamma-pill-eyebrow">{slide.eyebrow}</span>
        <span className="gamma-pill gamma-pill-category">Core Cloud Foundations</span>
      </div>

      <h2 className="gamma-slide-title">{slide.title}</h2>
      {slide.banner && (
        <div className="gamma-principle-banner">
          <span className="gamma-principle-icon">💡</span>
          <span className="gamma-principle-text">{slide.banner}</span>
        </div>
      )}

      {/* Render Visual Bullet Cards */}
      {slide.points.length > 0 && (
        <div className="gamma-theory-cards-grid">
          {slide.points.map((point, idx) => (
            <div key={idx} className="gamma-theory-point-card">
              <div className="gamma-point-badge">Key Takeaway {idx + 1}</div>
              <p className="gamma-point-text">{point}</p>
            </div>
          ))}
        </div>
      )}

      {/* Render Clean Tables if present */}
      {slide.tables && slide.tables.length > 0 && (
        <div className="gamma-theory-tables-wrap">
          {slide.tables.map((table) => (
            <DeckTable key={table.headers.join('|')} table={table} />
          ))}
        </div>
      )}
    </div>
  );
};
