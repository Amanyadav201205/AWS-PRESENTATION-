import React, { useState, useRef, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
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
  Compass,
  MoreHorizontal
} from 'lucide-react';
import { soundFX } from '../utils/soundEffects';
import { AwsLogo } from './AwsLogo';

interface HeaderProps {
  currentDomainIndex: number;
  totalDomains: number;
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
  onOpenAdvisor: () => void;
  onOpenAiGovernance: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDomainIndex,
  totalDomains,
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
  onOpenAdvisor,
  onOpenAiGovernance
}) => {
  const [simMenuOpen, setSimMenuOpen] = useState<boolean>(false);
  const [fwMenuOpen, setFwMenuOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const simRef = useRef<HTMLDivElement>(null);
  const fwRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click with proper propagation isolation
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (simRef.current && !simRef.current.contains(target)) {
        setSimMenuOpen(false);
      }
      if (fwRef.current && !fwRef.current.contains(target)) {
        setFwMenuOpen(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(target)) {
        setMobileMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSimMenuOpen(false);
        setFwMenuOpen(false);
        setMobileMenuOpen(false);
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
      {/* Brand & 1-based Module Tracker */}
      <div className="header-brand" style={{ flexShrink: 0 }}>
        <div className="brand-glyph-aws" aria-hidden="true" title="AWS Architecture Study">
          <AwsLogo height={22} width={38} color="#FFFFFF" />
        </div>
        <div className="brand-title-group" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="brand-title" style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
              AWS Well-Architected Framework
            </span>
          </div>
          <div className="brand-meta-wrapper" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="brand-meta">Module {currentDomainIndex + 1} of {totalDomains}</span>
            <span style={{ color: 'var(--text-tertiary)', fontSize: 10 }}>•</span>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Cloud Architecture Defense &amp; Analysis</span>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Controls */}
      <div className="header-controls header-controls-desktop">
        {/* Outage Simulation Toggle (Stable Button Label, P1 Fix 1.10) */}
        <button
          className={`btn-action ${isChaosActive ? 'danger-quiet active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (isChaosActive) {
              onResetChaos();
            } else {
              onTriggerChaos();
            }
          }}
          title={isChaosActive ? "Reset active outage simulation [R]" : "Simulate Multi-AZ outage [C]"}
        >
          <AlertCircle size={13} color={isChaosActive ? "var(--status-danger)" : "var(--status-danger)"} />
          <span>{isChaosActive ? 'Outage: ON' : 'Outage: OFF'}</span>
        </button>

        {/* Simulators Dropdown */}
        <div className="header-dropdown-wrap" ref={simRef} style={{ position: 'relative' }}>
          <button
            className={`btn-action ${simMenuOpen ? 'active-quiet' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              soundFX.playClick();
              setSimMenuOpen(!simMenuOpen);
              setFwMenuOpen(false);
              setMobileMenuOpen(false);
            }}
            title="Interactive architecture simulators"
            aria-expanded={simMenuOpen}
          >
            <Zap size={13} color="var(--status-warning)" />
            <span>Simulators</span>
            <ChevronDown size={11} style={{ opacity: 0.7 }} />
          </button>

          {simMenuOpen && (
            <div className="header-dropdown-menu" role="menu">
              <button
                className="dropdown-item"
                onClick={(e) => {
                  e.stopPropagation();
                  soundFX.playClick();
                  setSimMenuOpen(false);
                  onOpenAdvisor();
                }}
                role="menuitem"
              >
                <Compass size={14} color="var(--accent)" />
                <div className="dropdown-text">
                  <span className="dropdown-title">Architecture Advisor [A]</span>
                  <span className="dropdown-desc">Guided questions &amp; safe framework remediation</span>
                </div>
              </button>
              <button
                className="dropdown-item"
                onClick={(e) => {
                  e.stopPropagation();
                  soundFX.playClick();
                  setSimMenuOpen(false);
                  onOpenPacketSimulator();
                }}
                role="menuitem"
              >
                <Clock size={14} color="var(--accent)" />
                <div className="dropdown-text">
                  <span className="dropdown-title">Packet Latency Simulator [L]</span>
                  <span className="dropdown-desc">Comparative edge-to-database latency benchmark</span>
                </div>
              </button>
              <button
                className="dropdown-item"
                onClick={(e) => {
                  e.stopPropagation();
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
                onClick={(e) => {
                  e.stopPropagation();
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
                onClick={(e) => {
                  e.stopPropagation();
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

        {/* Framework Dropdown */}
        <div className="header-dropdown-wrap" ref={fwRef} style={{ position: 'relative' }}>
          <button
            className={`btn-action ${fwMenuOpen ? 'active-quiet' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              soundFX.playClick();
              setFwMenuOpen(!fwMenuOpen);
              setSimMenuOpen(false);
              setMobileMenuOpen(false);
            }}
            title="Explore 6 Pillars & academic foundation"
            aria-expanded={fwMenuOpen}
          >
            <Layers size={13} color="var(--accent)" />
            <span>Framework</span>
            <ChevronDown size={11} style={{ opacity: 0.7 }} />
          </button>

          {fwMenuOpen && (
            <div className="header-dropdown-menu" role="menu">
              <button
                className="dropdown-item"
                onClick={(e) => {
                  e.stopPropagation();
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
                onClick={(e) => {
                  e.stopPropagation();
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
                onClick={(e) => {
                  e.stopPropagation();
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
                onClick={(e) => {
                  e.stopPropagation();
                  soundFX.playClick();
                  setFwMenuOpen(false);
                  onOpenAiGovernance();
                }}
                role="menuitem"
              >
                <span style={{ fontSize: 14 }}>⚖️</span>
                <div className="dropdown-text">
                  <span className="dropdown-title">AI Governance &amp; Launch Readiness [G]</span>
                  <span className="dropdown-desc">Production readiness standards &amp; checklist audit</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Guided Q&A Direct Trigger (Clean honest naming, P0 Fix 1.3) */}
        <button
          className="btn-action"
          onClick={(e) => {
            e.stopPropagation();
            soundFX.playClick();
            onOpenAdvisor();
          }}
          title="Open Guided Architecture Q&A [A]"
          style={{
            height: 30,
            padding: '0 10px',
            background: 'linear-gradient(135deg, rgba(41, 151, 255, 0.16), rgba(41, 151, 255, 0.05))',
            border: '1px solid rgba(41, 151, 255, 0.35)',
            color: 'var(--accent)',
            fontWeight: 600,
            gap: 6
          }}
        >
          <Compass size={13} color="var(--accent)" />
          <span>Guided Q&amp;A</span>
        </button>

        {/* Speaker Script Prompter */}
        <button
          className="btn-action"
          onClick={(e) => {
            e.stopPropagation();
            soundFX.playClick();
            onOpenScriptPrompter();
          }}
          title="Verbatim presentation script and anticipated jury Q&A [S]"
        >
          <FileText size={13} color="var(--accent)" />
          <span>Script</span>
        </button>

        {/* Presenter Mode Button (Renamed from Keynote per 3a) */}
        <button
          className="btn-action primary"
          onClick={(e) => {
            e.stopPropagation();
            soundFX.playClick();
            onTogglePresenter();
          }}
          title="Launch full-screen presentation deck [P]"
          style={{ height: 30, padding: '0 12px', fontWeight: 600, gap: 6 }}
        >
          <Presentation size={14} />
          <span>{isPresenterMode ? 'Exit Deck' : 'Present'}</span>
        </button>

        <span className="header-divider" style={{ width: 1, height: 16, background: 'var(--separator)', margin: '0 2px' }} />

        {/* Audio Toggle (Muted by default per 1.19) */}
        <button
          className="btn-action btn-icon"
          onClick={(e) => {
            e.stopPropagation();
            soundFX.playClick();
            onToggleAudio();
          }}
          title={audioEnabled ? "Sound on" : "Sound muted"}
          aria-label={audioEnabled ? "Sound on" : "Sound muted"}
        >
          {audioEnabled ? <Volume2 size={15} /> : <VolumeX size={15} color="var(--text-tertiary)" />}
        </button>
      </div>

      {/* Mobile Drawer / '⋯' Menu Trigger (< 900px, P0 Fix 1.7) */}
      <div className="header-controls-mobile" ref={mobileRef} style={{ position: 'relative' }}>
        <button
          className="btn-action primary"
          onClick={(e) => {
            e.stopPropagation();
            soundFX.playClick();
            onTogglePresenter();
          }}
          style={{ height: 30, padding: '0 10px', fontSize: 12 }}
          title="Launch Presentation Deck [P]"
        >
          <Presentation size={13} />
          <span>Present</span>
        </button>

        <button
          className={`btn-action btn-icon ${mobileMenuOpen ? 'active-quiet' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            soundFX.playClick();
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          title="More actions"
          aria-label="Open mobile action menu"
          style={{ height: 30, width: 30 }}
        >
          <MoreHorizontal size={16} />
        </button>

        {mobileMenuOpen && (
          <div className="header-dropdown-menu mobile-dropdown-menu" role="menu">
            <button
              className="dropdown-item"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdvisor();
              }}
              role="menuitem"
            >
              <Compass size={14} color="var(--accent)" />
              <div className="dropdown-text">
                <span className="dropdown-title">Guided Architecture Q&amp;A</span>
              </div>
            </button>
            <button
              className="dropdown-item"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenScriptPrompter();
              }}
              role="menuitem"
            >
              <FileText size={14} color="var(--accent)" />
              <div className="dropdown-text">
                <span className="dropdown-title">Speaker Script</span>
              </div>
            </button>
            <button
              className="dropdown-item"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpen6Pillars();
              }}
              role="menuitem"
            >
              <span style={{ fontSize: 14 }}>🏛️</span>
              <div className="dropdown-text">
                <span className="dropdown-title">6 Pillars Master Audit</span>
              </div>
            </button>
            <button
              className="dropdown-item"
              onClick={() => {
                setMobileMenuOpen(false);
                if (isChaosActive) onResetChaos();
                else onTriggerChaos();
              }}
              role="menuitem"
            >
              <AlertCircle size={14} color="var(--status-danger)" />
              <div className="dropdown-text">
                <span className="dropdown-title">{isChaosActive ? 'Reset Outage' : 'Simulate Outage'}</span>
              </div>
            </button>
            <button
              className="dropdown-item"
              onClick={() => {
                setMobileMenuOpen(false);
                onToggleAudio();
              }}
              role="menuitem"
            >
              {audioEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              <div className="dropdown-text">
                <span className="dropdown-title">{audioEnabled ? 'Mute Sounds' : 'Enable Sounds'}</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
