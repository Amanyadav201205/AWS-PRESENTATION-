import React, { useState, useRef, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Presentation,
  AlertCircle,
  FileText,
  Zap,
  Activity,
  Clock,
  Briefcase,
  Sliders,
  BookOpen,
  ChevronDown,
  Layers,
  Sparkles
} from 'lucide-react';
import { soundFX } from '../utils/soundEffects';
import { AwsLogo } from './AwsLogo';

interface HeaderProps {
  currentDomainIndex: number;
  totalDomains: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  isChaosActive: boolean;
  onTriggerChaos: () => void;
  onResetChaos: () => void;
  onTogglePresenter: () => void;
  isPresenterMode: boolean;
  onOpenScriptPrompter: () => void;
  onOpen6Pillars: () => void;
  onOpenExecutiveReview: () => void;
  onOpenStressLab: () => void;
  onOpenPacketSimulator: () => void;
  onOpenClientSolutions: () => void;
  onOpenSubtopics: () => void;
  onOpenTheory: () => void;
  onOpenAiCopilot: () => void;
  onOpenAiGovernance: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDomainIndex,
  totalDomains,
  isDarkMode,
  onToggleTheme,
  audioEnabled,
  onToggleAudio,
  isChaosActive,
  onTriggerChaos,
  onResetChaos,
  onTogglePresenter,
  isPresenterMode,
  onOpenScriptPrompter,
  onOpen6Pillars,
  onOpenExecutiveReview,
  onOpenStressLab,
  onOpenPacketSimulator,
  onOpenClientSolutions,
  onOpenSubtopics,
  onOpenTheory,
  onOpenAiCopilot,
  onOpenAiGovernance
}) => {
  const [simMenuOpen, setSimMenuOpen] = useState<boolean>(false);
  const [fwMenuOpen, setFwMenuOpen] = useState<boolean>(false);

  const simRef = useRef<HTMLDivElement>(null);
  const fwRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (simRef.current && !simRef.current.contains(e.target as Node)) {
        setSimMenuOpen(false);
      }
      if (fwRef.current && !fwRef.current.contains(e.target as Node)) {
        setFwMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSimMenuOpen(false);
        setFwMenuOpen(false);
      }
    };
    window.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header className="app-header" role="banner">
      {/* Official AWS Brand & Presenter Authorship */}
      <div className="header-brand" style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>
        <div className="brand-glyph-aws" aria-hidden="true" title="Amazon Web Services Official">
          <AwsLogo height={22} width={38} />
        </div>
        <div className="brand-title-group" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="brand-title" style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
              AWS Well-Architected Framework
            </span>
            <span className="brand-author-chip">
              Devarsh Patel &amp; Aman Kumar
            </span>
          </div>
          <div className="brand-meta-wrapper" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="brand-meta">Module {currentDomainIndex + 1} of {totalDomains}</span>
            <span style={{ color: 'var(--text-tertiary)', fontSize: 10 }}>•</span>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Cloud Architecture Defense &amp; Analysis</span>
          </div>
        </div>
      </div>

      {/* Streamlined Apple-Grade Control Center */}
      <div className="header-controls">
        {/* Outage Simulation Trigger */}
        {isChaosActive ? (
          <button
            className="btn-action danger-quiet"
            onClick={onResetChaos}
            aria-label="Reset simulation to normal state"
            title="Reset active Multi-AZ outage simulation [R]"
          >
            <RotateCcw size={13} />
            <span>Reset [R]</span>
          </button>
        ) : (
          <button
            className="btn-action chaos-trigger-btn"
            onClick={onTriggerChaos}
            aria-label="Simulate workload outage"
            title="Simulate sudden Multi-AZ workload disaster outage [C]"
          >
            <AlertCircle size={13} color="var(--status-danger)" />
            <span>Simulate Outage [C]</span>
          </button>
        )}

        {/* Dropdown: Interactive Simulators Menu */}
        <div className="header-dropdown-wrap" ref={simRef} style={{ position: 'relative' }}>
          <button
            className={`btn-action ${simMenuOpen ? 'active-quiet' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setSimMenuOpen(!simMenuOpen);
              setFwMenuOpen(false);
            }}
            title="Open Interactive Architecture Simulators"
            aria-expanded={simMenuOpen}
          >
            <Zap size={13} color="var(--status-warning)" />
            <span className="btn-label-desktop">Simulators</span>
            <ChevronDown size={11} style={{ opacity: 0.7 }} />
          </button>

          {simMenuOpen && (
            <div className="header-dropdown-menu" role="menu">
              <button
                className="dropdown-item"
                onClick={() => {
                  soundFX.playClick();
                  setSimMenuOpen(false);
                  onOpenAiCopilot();
                }}
                role="menuitem"
              >
                <Sparkles size={14} color="#FF9900" />
                <div className="dropdown-text">
                  <span className="dropdown-title">AI Architecture Copilot [A]</span>
                  <span className="dropdown-desc">Grounded RAG advisor &amp; safe agent remediation</span>
                </div>
              </button>
              <button
                className="dropdown-item"
                onClick={() => {
                  soundFX.playClick();
                  setSimMenuOpen(false);
                  onOpenPacketSimulator();
                }}
                role="menuitem"
              >
                <Clock size={14} color="var(--accent)" />
                <div className="dropdown-text">
                  <span className="dropdown-title">Packet Flight Simulator [L]</span>
                  <span className="dropdown-desc">Real-time packet flight latency benchmark</span>
                </div>
              </button>
              <button
                className="dropdown-item"
                onClick={() => {
                  soundFX.playClick();
                  setSimMenuOpen(false);
                  onOpenClientSolutions();
                }}
                role="menuitem"
              >
                <Briefcase size={14} color="var(--accent)" />
                <div className="dropdown-text">
                  <span className="dropdown-title">Client Workload Solutions [W]</span>
                  <span className="dropdown-desc">E-commerce, SaaS, HIPAA healthcare workloads</span>
                </div>
              </button>
              <button
                className="dropdown-item"
                onClick={() => {
                  soundFX.playClick();
                  setSimMenuOpen(false);
                  onOpenSubtopics();
                }}
                role="menuitem"
              >
                <Sliders size={14} color="var(--status-success)" />
                <div className="dropdown-text">
                  <span className="dropdown-title">Subtopic Deep-Dive Labs [T]</span>
                  <span className="dropdown-desc">RDS Proxy, EBS gp3 IOPS, Aurora Quorum, S3</span>
                </div>
              </button>
              <button
                className="dropdown-item"
                onClick={() => {
                  soundFX.playClick();
                  setSimMenuOpen(false);
                  onOpenStressLab();
                }}
                role="menuitem"
              >
                <Activity size={14} color="var(--status-danger)" />
                <div className="dropdown-text">
                  <span className="dropdown-title">Incident Stress Lab</span>
                  <span className="dropdown-desc">Multi-vector traffic surge and AZ failure tests</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Dropdown: Framework Explorer Menu */}
        <div className="header-dropdown-wrap" ref={fwRef} style={{ position: 'relative' }}>
          <button
            className={`btn-action ${fwMenuOpen ? 'active-quiet' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setFwMenuOpen(!fwMenuOpen);
              setSimMenuOpen(false);
            }}
            title="Explore 6 Pillars & Academic Framework"
            aria-expanded={fwMenuOpen}
          >
            <Layers size={13} color="var(--accent)" />
            <span className="btn-label-desktop">Framework</span>
            <ChevronDown size={11} style={{ opacity: 0.7 }} />
          </button>

          {fwMenuOpen && (
            <div className="header-dropdown-menu" role="menu">
              <button
                className="dropdown-item"
                onClick={() => {
                  soundFX.playClick();
                  setFwMenuOpen(false);
                  onOpen6Pillars();
                }}
                role="menuitem"
              >
                <span style={{ fontSize: 14 }}>🏛️</span>
                <div className="dropdown-text">
                  <span className="dropdown-title">6 Pillars Master Audit</span>
                  <span className="dropdown-desc">Operational, Security, Reliability, Cost, Perf, Sustain</span>
                </div>
              </button>
              <button
                className="dropdown-item"
                onClick={() => {
                  soundFX.playClick();
                  setFwMenuOpen(false);
                  onOpenExecutiveReview();
                }}
                role="menuitem"
              >
                <span style={{ fontSize: 14 }}>📊</span>
                <div className="dropdown-text">
                  <span className="dropdown-title">Executive Review &amp; Cost ROI</span>
                  <span className="dropdown-desc">FinOps cloud spend calculator &amp; HRI mitigation</span>
                </div>
              </button>
              <button
                className="dropdown-item"
                onClick={() => {
                  soundFX.playClick();
                  setFwMenuOpen(false);
                  onOpenTheory();
                }}
                role="menuitem"
              >
                <BookOpen size={14} color="var(--accent)" />
                <div className="dropdown-text">
                  <span className="dropdown-title">Theoretical Foundations [K]</span>
                  <span className="dropdown-desc">CAP Theorem, PACELC, Gall's Law, academic citations</span>
                </div>
              </button>
              <button
                className="dropdown-item"
                onClick={() => {
                  soundFX.playClick();
                  setFwMenuOpen(false);
                  onOpenAiGovernance();
                }}
                role="menuitem"
              >
                <span style={{ fontSize: 14 }}>⚖️</span>
                <div className="dropdown-text">
                  <span className="dropdown-title">AI Governance &amp; Launch Readiness [G]</span>
                  <span className="dropdown-desc">12-Pillar production standard &amp; checklist audit</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* AI Copilot Direct Hero Trigger Button */}
        <button
          className="btn-action"
          onClick={() => {
            soundFX.playClick();
            onOpenAiCopilot();
          }}
          aria-label="Launch AI Well-Architected Copilot"
          title="Launch Grounded AI Architecture Copilot [A]"
          style={{
            height: 30,
            padding: '0 10px',
            background: 'linear-gradient(135deg, rgba(255, 153, 0, 0.22), rgba(255, 153, 0, 0.06))',
            border: '1px solid rgba(255, 153, 0, 0.45)',
            color: '#FF9900',
            fontWeight: 600,
            gap: 6
          }}
        >
          <Sparkles size={13} color="#FF9900" />
          <span className="btn-label-desktop">AI Copilot [A]</span>
        </button>

        {/* Speaker Script Prompter */}
        <button
          className="btn-action"
          onClick={() => {
            soundFX.playClick();
            onOpenScriptPrompter();
          }}
          aria-label="Open Speaker Script and Defense Prompter"
          title="Verbatim presentation script and anticipated jury Q&A [S]"
        >
          <FileText size={13} color="var(--accent)" />
          <span className="btn-label-desktop">Script [S]</span>
        </button>

        {/* Hero Presenter Mode Button */}
        <button
          className="btn-action primary"
          onClick={() => {
            soundFX.playClick();
            onTogglePresenter();
          }}
          aria-label="Toggle presentation deck mode"
          title="Launch full-screen Keynote presentation deck [P]"
          style={{ height: 30, padding: '0 12px', fontWeight: 600, gap: 6 }}
        >
          <Presentation size={14} />
          <span>Launch Keynote [P]</span>
        </button>

        <span className="header-divider" style={{ width: 1, height: 16, background: 'var(--separator)', margin: '0 2px' }} />

        {/* Audio Toggle */}
        <button
          className="btn-action btn-icon"
          onClick={() => {
            soundFX.playClick();
            onToggleAudio();
          }}
          aria-label={audioEnabled ? "Mute audio sound effects" : "Enable audio sound effects"}
          title={audioEnabled ? "Sound on" : "Sound muted"}
        >
          {audioEnabled ? <Volume2 size={15} /> : <VolumeX size={15} color="var(--text-tertiary)" />}
        </button>

        {/* Dark / Light Mode Toggle */}
        <button
          className="btn-action btn-icon"
          onClick={() => {
            soundFX.playClick();
            onToggleTheme();
          }}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={isDarkMode ? "Light mode" : "Dark mode"}
        >
          {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  );
};
