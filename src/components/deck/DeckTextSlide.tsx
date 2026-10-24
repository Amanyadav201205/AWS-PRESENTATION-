import React, { useState } from 'react';
import { DeckSlide } from '../../data/deck/deckTypes';
import { DeckTable } from './DeckTable';
import {
  ShieldCheck,
  Clock,
  AlertTriangle,
  DollarSign,
  Cloud,
  Layers,
  Activity,
  Zap,
  RefreshCw,
  Leaf,
  Compass,
  Award,
  AlertOctagon,
  CheckCircle2,
  Table as TableIcon
} from 'lucide-react';

interface DeckTextSlideProps {
  slide: DeckSlide;
}

export const DeckTextSlide: React.FC<DeckTextSlideProps> = ({ slide }) => {
  const isTitle = slide.kind === 'title';
  const isAgenda = slide.kind === 'agenda';
  const isClosing = slide.kind === 'closing';
  const isPillars = slide.id === 'theory-pillars';

  const [showTable, setShowTable] = useState(false);

  // =========================================================================
  // 1. HERO TITLE SLIDE (Projector-Optimized, High Contrast)
  // =========================================================================
  if (isTitle) {
    return (
      <div className="gamma-slide gamma-title-slide">
        <div className="gamma-title-badge-row">
          <span className="gamma-brand-badge">
            <Cloud size={16} color="#FF9900" />
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

        {/* Presenters Info - High Contrast */}
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
            <div className="gamma-presenter-avatar avatar-aman">AK</div>
            <div>
              <div className="gamma-presenter-name">Aman Kumar</div>
              <div className="gamma-presenter-role">AWS Solutions Architect Presenter</div>
            </div>
          </div>
        </div>

        {/* 4 Impact Stat Cards - Bold High Visibility */}
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
  // 2. AGENDA SLIDE (Enterprise Roadmap & Flight Plan - Non-AI)
  // =========================================================================
  if (isAgenda) {
    return (
      <div className="gamma-slide gamma-agenda-slide">
        <div className="gamma-slide-meta">
          <div className="gamma-pill-group">
            <span className="gamma-pill gamma-pill-eyebrow">Flight Plan</span>
            <span className="gamma-pill gamma-pill-category">20 Minutes · 15 Modules</span>
          </div>
        </div>

        <div className="gamma-slide-header">
          <h2 className="gamma-slide-title">Core Cloud Theory, Then 15 Live Simulations</h2>
          {slide.banner && (
            <div className="gamma-principle-banner">
              <Compass size={18} className="gamma-principle-icon" />
              <span className="gamma-principle-text">{slide.banner}</span>
            </div>
          )}
        </div>

        {/* Cohesive 3-Phase Roadmap Timeline (Non-AI Card Slop) */}
        <div className="roadmap-timeline-grid">
          <div className="roadmap-phase-card phase-1">
            <div className="roadmap-phase-header">
              <div className="roadmap-phase-pill">PHASE 01</div>
              <span className="roadmap-phase-time">5 Mins</span>
            </div>
            <h3 className="roadmap-phase-title">Foundational Cloud Laws</h3>
            <p className="roadmap-phase-desc">
              The Six Pillars, Availability in human terms, the myth of the single server (SPOF), and containing Blast Radius with RTO/RPO.
            </p>
            <div className="roadmap-milestones">
              <div className="roadmap-item"><CheckCircle2 size={14} className="roadmap-check" /> Six Pillars of Architecture</div>
              <div className="roadmap-item"><CheckCircle2 size={14} className="roadmap-check" /> Single Point of Failure (SPOF)</div>
              <div className="roadmap-item"><CheckCircle2 size={14} className="roadmap-check" /> The Arithmetic of Availability</div>
              <div className="roadmap-item"><CheckCircle2 size={14} className="roadmap-check" /> Blast Radius, RTO &amp; RPO</div>
            </div>
          </div>

          <div className="roadmap-phase-card phase-2">
            <div className="roadmap-phase-header">
              <div className="roadmap-phase-pill">PHASE 02</div>
              <span className="roadmap-phase-time">8 Mins</span>
            </div>
            <h3 className="roadmap-phase-title">Core Infrastructure Tiers</h3>
            <p className="roadmap-phase-desc">
              Contrasting fragile single-server anti-patterns against resilient multi-AZ deployments with live traffic &amp; disaster injection.
            </p>
            <div className="roadmap-milestones">
              <div className="roadmap-item"><CheckCircle2 size={14} className="roadmap-check" /> Storage: gp2 vs gp3 &amp; S3 WORM</div>
              <div className="roadmap-item"><CheckCircle2 size={14} className="roadmap-check" /> Compute: Monolith vs Graviton Fleet</div>
              <div className="roadmap-item"><CheckCircle2 size={14} className="roadmap-check" /> Database: Single MySQL vs Aurora Multi-AZ</div>
              <div className="roadmap-item"><CheckCircle2 size={14} className="roadmap-check" /> Networking: Flat VPC vs 3-Tier Isolation</div>
            </div>
          </div>

          <div className="roadmap-phase-card phase-3">
            <div className="roadmap-phase-header">
              <div className="roadmap-phase-pill">PHASE 03</div>
              <span className="roadmap-phase-time">7 Mins</span>
            </div>
            <h3 className="roadmap-phase-title">Advanced Modernization</h3>
            <p className="roadmap-phase-desc">
              Enterprise cloud modernization: zero-trust identity, proactive observability, automated GitOps pipelines, and disaster recovery.
            </p>
            <div className="roadmap-milestones">
              <div className="roadmap-item"><CheckCircle2 size={14} className="roadmap-check" /> Security, IAM &amp; Secrets Manager</div>
              <div className="roadmap-item"><CheckCircle2 size={14} className="roadmap-check" /> Canaries &amp; Self-Healing Monitoring</div>
              <div className="roadmap-item"><CheckCircle2 size={14} className="roadmap-check" /> SQS Decoupling &amp; Serverless Lambda</div>
              <div className="roadmap-item"><CheckCircle2 size={14} className="roadmap-check" /> Multi-Region Active-Active DR</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. EXECUTIVE CLOSING SCORECARD (Projector-Grade High Impact)
  // =========================================================================
  if (isClosing) {
    return (
      <div className="gamma-slide gamma-closing-slide">
        <div className="gamma-slide-meta">
          <div className="gamma-pill-group">
            <span className="gamma-pill gamma-pill-eyebrow">Executive Verdict</span>
            <span className="gamma-pill gamma-pill-category">Scorecard Across 15 Modules</span>
          </div>
        </div>

        <div className="gamma-slide-header">
          <h2 className="gamma-slide-title">The Well-Architected Transformation</h2>
          {slide.banner && (
            <div className="gamma-principle-banner">
              <Award size={18} className="gamma-principle-icon" />
              <span className="gamma-principle-text">{slide.banner}</span>
            </div>
          )}
        </div>

        <div className="gamma-closing-grid">
          <div className="gamma-closing-card card-availability">
            <div className="gamma-closing-icon-wrap icon-wrap-success">
              <ShieldCheck size={26} />
            </div>
            <div className="gamma-closing-title">System Availability</div>
            <div className="gamma-closing-delta">
              <span className="gamma-closing-old">98.5%</span>
              <span className="gamma-closing-arrow">➔</span>
              <span className="gamma-closing-new new-success">99.99%</span>
            </div>
            <p className="gamma-closing-desc">Certified High Availability across 3 physical Availability Zones with zero single points of failure.</p>
          </div>

          <div className="gamma-closing-card card-finops">
            <div className="gamma-closing-icon-wrap icon-wrap-accent">
              <DollarSign size={26} />
            </div>
            <div className="gamma-closing-title">Monthly Cloud Spend</div>
            <div className="gamma-closing-delta">
              <span className="gamma-closing-old">$4,450</span>
              <span className="gamma-closing-arrow">➔</span>
              <span className="gamma-closing-new new-accent">$1,820</span>
            </div>
            <p className="gamma-closing-desc">59% FinOps cost reduction through Graviton ARM processors, S3 Intelligent-Tiering, and serverless compute.</p>
          </div>

          <div className="gamma-closing-card card-rto">
            <div className="gamma-closing-icon-wrap icon-wrap-amber">
              <Clock size={26} />
            </div>
            <div className="gamma-closing-title">Recovery Time (RTO)</div>
            <div className="gamma-closing-delta">
              <span className="gamma-closing-old">4-8 Hours</span>
              <span className="gamma-closing-arrow">➔</span>
              <span className="gamma-closing-new new-amber">&lt; 30 Seconds</span>
            </div>
            <p className="gamma-closing-desc">Automated self-healing replaces stressful manual midnight rebuilds with sub-minute automated failover.</p>
          </div>

          <div className="gamma-closing-card card-hri">
            <div className="gamma-closing-icon-wrap icon-wrap-success">
              <AlertTriangle size={26} />
            </div>
            <div className="gamma-closing-title">High Risk Issues (HRIs)</div>
            <div className="gamma-closing-delta">
              <span className="gamma-closing-old">3 Critical</span>
              <span className="gamma-closing-arrow">➔</span>
              <span className="gamma-closing-new new-success">0 HRIs</span>
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
  // Human-Authored Architecture Specification View - Zero AI Slop
  // =========================================================================
  const getTheoryIcon = (id: string) => {
    switch (id) {
      case 'theory-pillars': return <Layers size={18} />;
      case 'theory-spof': return <AlertOctagon size={18} />;
      case 'theory-nines': return <Activity size={18} />;
      case 'theory-blast-radius': return <ShieldCheck size={18} />;
      default: return <Compass size={18} />;
    }
  };

  const pillarCardsData = [
    { title: 'Operational Excellence', icon: <Activity size={20} color="#0066cc" />, desc: 'Run and monitor workloads to deliver business value, continually improving processes and procedures.' },
    { title: 'Security', icon: <ShieldCheck size={20} color="#c9302c" />, desc: 'Protect information, systems, and assets with automated IAM zero-trust, encryption, and continuous audits.' },
    { title: 'Reliability', icon: <RefreshCw size={20} color="#1e7e34" />, desc: 'Prevent and quickly recover from failures across multi-AZ clusters with automated self-healing.' },
    { title: 'Performance Efficiency', icon: <Zap size={20} color="#8a4b00" />, desc: 'Use computing resources efficiently through Graviton processors, serverless, and elastic scaling.' },
    { title: 'Cost Optimization', icon: <DollarSign size={20} color="#0066cc" />, desc: 'Avoid unnecessary cloud spending with FinOps rightsizing, Intelligent-Tiering, and automated cleanups.' },
    { title: 'Sustainability', icon: <Leaf size={20} color="#1e7e34" />, desc: 'Minimize environmental impact through efficient resource utilization and low-carbon AWS regions.' },
  ];

  return (
    <div className={`gamma-slide gamma-theory-doc-slide deck-kind-${slide.kind}`}>
      <div className="gamma-slide-meta">
        <div className="gamma-pill-group">
          <span className="gamma-pill gamma-pill-eyebrow">{slide.eyebrow}</span>
          <span className="gamma-pill gamma-pill-category">Core Cloud Foundations</span>
        </div>
        {slide.tables && slide.tables.length > 0 && (
          <button
            type="button"
            className={`gamma-view-toggle ${showTable ? 'active' : ''}`}
            onClick={() => setShowTable(!showTable)}
            title="Toggle component breakdown table"
          >
            <TableIcon size={16} />
            <span>{showTable ? 'View Architectural Principles' : 'View Specification Table'}</span>
          </button>
        )}
      </div>

      <div className="gamma-slide-header">
        <h2 className="gamma-slide-title">{slide.title}</h2>
        {slide.banner && (
          <div className="gamma-principle-banner">
            <span className="gamma-principle-icon">{getTheoryIcon(slide.id)}</span>
            <span className="gamma-principle-text">{slide.banner}</span>
          </div>
        )}
      </div>

      {showTable ? (
        <div className="gamma-table-wrap">
          {slide.tables?.map((table) => (
            <DeckTable key={table.headers.join('|')} table={table} />
          ))}
        </div>
      ) : isPillars ? (
        /* The Six Pillars: Structured 6-Pillar Matrix (Non-AI 3-card) */
        <div className="pillars-matrix-grid">
          {pillarCardsData.map((pillar) => (
            <div key={pillar.title} className="pillar-matrix-card">
              <div className="pillar-matrix-header">
                <div className="pillar-matrix-icon-wrap">{pillar.icon}</div>
                <h3 className="pillar-matrix-title">{pillar.title}</h3>
              </div>
              <p className="pillar-matrix-desc">{pillar.desc}</p>
            </div>
          ))}
        </div>
      ) : (
        /* Other Theory Slides: Authoritative Architectural Specification Rail & Table */
        <div className="theory-spec-layout">
          {/* Engineering Rules & Architectural Principles (Numbered, Crisp, Non-AI) */}
          <div className="theory-principles-list">
            {slide.points.map((point, idx) => {
              const ruleNum = `RULE 0${idx + 1}`;
              const [lead, ...rest] = point.split(':');
              const hasColon = rest.length > 0;
              const ruleTitle = hasColon ? lead.trim() : `Principle ${idx + 1}`;
              const ruleDesc = hasColon ? rest.join(':').trim() : point;

              return (
                <div key={idx} className={`theory-principle-row row-color-${idx % 3}`}>
                  <div className="theory-rule-badge">
                    <span>{ruleNum}</span>
                  </div>
                  <div className="theory-rule-content">
                    <h4 className="theory-rule-title">{ruleTitle}</h4>
                    <p className="theory-rule-text">{ruleDesc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Embedded High-Contrast Table alongside or below */}
          {slide.tables && slide.tables.length > 0 && (
            <div className="theory-spec-table-container">
              <div className="theory-table-header">
                <span className="theory-table-tag">ENGINEERING SPECIFICATION REFERENCE</span>
              </div>
              <div className="theory-table-inner">
                {slide.tables.slice(0, 1).map((table) => (
                  <DeckTable key={table.headers.join('|')} table={table} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
