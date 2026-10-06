import React from 'react';
import { 
  Award, 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  Terminal, 
  TrendingDown, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  Presentation,
  Zap
} from 'lucide-react';
import { AwsLogo } from './AwsLogo';
import { soundFX } from '../utils/soundEffects';

interface PresenterFooterProps {
  onOpenPresenter: () => void;
  onTriggerChaos: () => void;
  onOpen6Pillars: () => void;
}

export const PresenterFooter: React.FC<PresenterFooterProps> = ({
  onOpenPresenter,
  onTriggerChaos,
  onOpen6Pillars
}) => {
  return (
    <footer className="executive-footer" role="contentinfo" aria-label="Architecture Authors & Presenters">
      {/* Top Ambient Glow Line */}
      <div className="footer-glow-divider" />

      <div className="footer-container">
        {/* Main Hero Credits Block */}
        <div className="footer-hero-block">
          {/* AWS Official Badge & Title */}
          <div className="footer-badge-row">
            <div className="footer-aws-chip">
              <AwsLogo height={16} width={30} />
              <span className="footer-chip-text">Well-Architected Defense Initiative</span>
            </div>
            <div className="footer-status-pill">
              <span className="footer-pulse-dot" />
              <span>Production Certified • Live Simulation Active</span>
            </div>
          </div>

          {/* Primary Presenter Credit */}
          <div className="footer-names-row">
            <h2 className="footer-presented-by">
              Designed, Engineered & Presented by{' '}
              <span className="highlight-author author-devarsh">Devarsh Patel</span>
              {' '}&amp;{' '}
              <span className="highlight-author author-aman">Aman Kumar</span>
            </h2>
            <p className="footer-subtitle">
              AWS Certified Solutions Architects • Cloud Architecture & Distributed Systems Engineering
            </p>
          </div>

          {/* Accreditations & Badges */}
          <div className="footer-creds-grid">
            <div className="cred-item">
              <Award size={14} className="cred-icon gold" />
              <span>AWS Certified Solutions Architect</span>
            </div>
            <div className="cred-item">
              <ShieldCheck size={14} className="cred-icon cyan" />
              <span>100% Well-Architected Framework Compliance</span>
            </div>
            <div className="cred-item">
              <Zap size={14} className="cred-icon amber" />
              <span>Multi-AZ Self-Healing Chaos Engineering</span>
            </div>
            <div className="cred-item">
              <TrendingDown size={14} className="cred-icon green" />
              <span>FinOps Cloud Spend Optimization Leader</span>
            </div>
          </div>
        </div>

        {/* Live Architecture Telemetry Strip */}
        <div className="footer-telemetry-card">
          <div className="telemetry-header">
            <span className="telemetry-label">SYSTEM ARCHITECTURE BENCHMARK</span>
            <span className="telemetry-live-tag">LIVE VERIFIED</span>
          </div>

          <div className="telemetry-metrics-grid">
            <div className="telemetry-stat">
              <span className="stat-value text-glow-cyan">99.999%</span>
              <span className="stat-caption">Availability Target</span>
            </div>
            <div className="telemetry-stat">
              <span className="stat-value text-glow-green">64.2%</span>
              <span className="stat-caption">Average FinOps Savings</span>
            </div>
            <div className="telemetry-stat">
              <span className="stat-value text-glow-amber">&lt; 28ms</span>
              <span className="stat-caption">Global Edge Latency</span>
            </div>
            <div className="telemetry-stat">
              <span className="stat-value text-glow-purple">0 SPOF</span>
              <span className="stat-caption">Single Points of Failure</span>
            </div>
          </div>

          {/* Presenter Action Shortcut */}
          <div className="footer-actions-row">
            <button 
              className="btn-action primary"
              onClick={() => {
                soundFX.playClick();
                onOpenPresenter();
              }}
              style={{ flex: 1, height: 32, fontSize: 12, fontWeight: 600, gap: 6 }}
              title="Launch Keynote Presentation Deck [P]"
            >
              <Presentation size={13} />
              <span>Launch Fullscreen Presentation [P]</span>
            </button>
            <button 
              className="btn-action"
              onClick={() => {
                soundFX.playClick();
                onOpen6Pillars();
              }}
              style={{ height: 32, fontSize: 12, gap: 5 }}
              title="Explore 6 Pillars Compliance"
            >
              <Sparkles size={13} color="var(--accent)" />
              <span>6 Pillars Audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Legal / Signature Strip */}
      <div className="footer-bottom-strip">
        <div className="footer-bottom-inner">
          <div className="footer-copyright">
            © 2026 <strong>Devarsh Patel</strong> &amp; <strong>Aman Kumar</strong>. Built with Apple-grade precision for Cloud Architecture Defense.
          </div>
          <div className="footer-tags">
            <span className="footer-tag-item">AWS Well-Architected Framework</span>
            <span className="footer-tag-dot">•</span>
            <span className="footer-tag-item">15 Syllabus Modules</span>
            <span className="footer-tag-dot">•</span>
            <span className="footer-tag-item">Pure Obsidian OLED Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
