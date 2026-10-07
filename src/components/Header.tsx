import React, { useState, useRef, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Presentation,
  AlertCircle,
  Zap,
  Activity,
  Clock,
  Briefcase,
  Sliders,
  BookOpen,
  ChevronDown,
  Layers,
  Compass,
  MoreHorizontal,
  Landmark,
  ShieldCheck,
  Smartphone
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
  onOpen6Pillars: () => void;
  onOpenExecutiveReview: () => void;
  onOpenStressLab: () => void;
  onOpenPacketSimulator: () => void;
  onOpenClientSolutions: () => void;
  onOpenSubtopics: () => void;
  onOpenTheory: () => void;
  onOpenAdvisor: () => void;
  onOpenAiGovernance: () => void;
  onOpenPairingModal: () => void;
  connectedRemotesCount?: number;
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
  onOpen6Pillars,
  onOpenExecutiveReview,
  onOpenStressLab,
  onOpenPacketSimulator,
  onOpenClientSolutions,
  onOpenSubtopics,
  onOpenTheory,
  onOpenAdvisor,
  onOpenAiGovernance,
  onOpenPairingModal,
  connectedRemotesCount = 0
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

  const progressPct = totalDomains > 0
    ? Math.round(((currentDomainIndex + 1) / totalDomains) * 100)
    : 0;

  return (
    <header className="app-header" role="banner">
      {/* Module progress rail — 2px, AWS orange, answers "where am I in 15 modules" */}
      <div
        className="header-module-progress"
        style={{ width: `${progressPct}%` }}
        aria-hidden="true"
      />
      {/* Brand & 1-based Module Tracker */}
      <div className="header-brand">
        <div className="brand-glyph-aws" aria-hidden="true" title="AWS Architecture Study">
          <AwsLogo height={22} width={38} color="#FFFFFF" />
        </div>
        <div className="brand-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="brand-title">
              <span className="brand-title-long">AWS Well-Architected Framework</span>
              <span className="brand-title-short">AWS Well-Architected</span>
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
          className={`btn-action pill ${isChaosActive ? 'danger-quiet active' : ''}`}
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
            className={`btn-action pill ${simMenuOpen ? 'active-quiet' : ''}`}
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
            className={`btn-action pill ${fwMenuOpen ? 'active-quiet' : ''}`}
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
                <Landmark size={14} color="var(--accent)" />
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

        {/* Guided Q&A Direct Trigger */}
        <button
          className="btn-action pill btn-action--qa"
          onClick={(e) => {
            e.stopPropagation();
            soundFX.playClick();
            onOpenAdvisor();
          }}
          title="Open Guided Architecture Q&A [A]"
        >
          <Compass size={13} color="var(--accent)" />
          <span>Guided Q&amp;A</span>
        </button>

        {/* Phone Remote Pairing Trigger */}
        <button
          className={`btn-action pill ${connectedRemotesCount > 0 ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            soundFX.playClick();
            onOpenPairingModal();
          }}
          title="Connect Devarsh & Aman's phones to control big screen [M]"
          style={{
            borderColor: connectedRemotesCount > 0 ? 'rgba(48, 209, 88, 0.4)' : undefined,
            background: connectedRemotesCount > 0 ? 'rgba(48, 209, 88, 0.1)' : undefined
          }}
        >
          <Smartphone size={13} color={connectedRemotesCount > 0 ? 'var(--status-healthy)' : 'var(--accent)'} />
          <span>{connectedRemotesCount > 0 ? `Remote (${connectedRemotesCount})` : 'Phone Remote'}</span>
        </button>

        {/* Presenter Mode Button */}
        <button
          className="btn-action primary pill"
          onClick={(e) => {
            e.stopPropagation();
            soundFX.playClick();
            onTogglePresenter();
          }}
          title="Launch full-screen presentation deck [P]"
          style={{ padding: '0 14px' }}
        >
          <Presentation size={14} />
          <span>{isPresenterMode ? 'Exit Deck' : 'Present'}</span>
        </button>

        <span className="header-divider" aria-hidden="true" />

        {/* Audio Toggle (Muted by default per 1.19) */}
        <button
          className="btn-action btn-icon pill"
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
          className="btn-action primary pill"
          onClick={(e) => {
            e.stopPropagation();
            soundFX.playClick();
            onTogglePresenter();
          }}
          title="Launch Presentation Deck [P]"
        >
          <Presentation size={13} />
          <span>Present</span>
        </button>

        <button
          className={`btn-action btn-icon pill ${mobileMenuOpen ? 'active-quiet' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            soundFX.playClick();
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          title="More actions"
          aria-label="Open mobile action menu"
          aria-expanded={mobileMenuOpen}
          aria-haspopup="menu"
        >
          <MoreHorizontal size={16} />
        </button>

        {mobileMenuOpen && (
          <div className="header-dropdown-menu mobile-dropdown-menu" role="menu">
            {([
              { label: 'Guided Architecture Q&A', icon: <Compass size={16} color="var(--accent)" />, run: onOpenAdvisor },
              { label: connectedRemotesCount > 0 ? `Phone Remote (${connectedRemotesCount} connected)` : 'Phone Remote (Pair Phones)', icon: <Smartphone size={16} color={connectedRemotesCount > 0 ? 'var(--status-healthy)' : 'var(--accent)'} />, run: onOpenPairingModal },
              { label: '6 Pillars Explorer', icon: <Landmark size={16} color="var(--accent)" />, run: onOpen6Pillars },
              { label: 'Executive Review & ROI', icon: <Activity size={16} color="var(--accent)" />, run: onOpenExecutiveReview },
              { label: 'Stress & Incident Lab', icon: <Zap size={16} color="var(--status-warning)" />, run: onOpenStressLab },
              { label: 'Packet Latency Simulator', icon: <Clock size={16} color="var(--status-warning)" />, run: onOpenPacketSimulator },
              { label: 'Client Workload Solutions', icon: <Briefcase size={16} color="var(--status-warning)" />, run: onOpenClientSolutions },
              { label: 'Subtopic Labs', icon: <Sliders size={16} color="var(--status-warning)" />, run: onOpenSubtopics },
              { label: 'Theoretical Foundations', icon: <BookOpen size={16} color="var(--accent)" />, run: onOpenTheory },
              { label: 'AI Governance', icon: <ShieldCheck size={16} color="var(--accent)" />, run: onOpenAiGovernance },
              { label: isChaosActive ? 'Reset Outage' : 'Simulate Outage', icon: <AlertCircle size={16} color="var(--status-danger)" />, run: isChaosActive ? onResetChaos : onTriggerChaos },
              { label: audioEnabled ? 'Mute Sounds' : 'Enable Sounds', icon: audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />, run: onToggleAudio },
            ] as const).map((item) => (
              <button
                key={item.label}
                type="button"
                className="dropdown-item"
                role="menuitem"
                onClick={() => {
                  setMobileMenuOpen(false);
                  item.run();
                }}
              >
                {item.icon}
                <span className="dropdown-title">{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
