import React, { useState, useEffect, useCallback } from 'react';
import {
  SkipBack, SkipForward, AlertCircle, CheckCircle,
  Wifi, WifiOff, FileText, Layers, Activity, Zap,
  Clock, Briefcase, Sliders, BookOpen, Compass, Map
} from 'lucide-react';
import {
  PhoneCompanionSync,
  RemoteSpeaker,
  StageState,
} from '../services/presentationRemoteSync';

interface ControllerViewProps {
  roomCode: string;
}

const SPEAKER_LABELS: Record<RemoteSpeaker, string> = {
  devarsh: 'Devarsh',
  aman: 'Aman',
  both: 'Both',
};

const scrollSections = [
  { target: 'topology' as const, label: 'Architecture', icon: <Map size={14} /> },
  { target: 'journey' as const,  label: 'Journey',      icon: <Compass size={14} /> },
  { target: 'metrics' as const,  label: 'Metrics',      icon: <Activity size={14} /> },
  { target: 'iac' as const,      label: 'Code',         icon: <Sliders size={14} /> },
  { target: 'radar' as const,    label: 'Radar',        icon: <Layers size={14} /> },
];

const modalShortcuts = [
  { modal: 'script',        label: 'Script',     icon: <FileText size={14} /> },
  { modal: 'advisor',       label: 'Guided Q&A', icon: <Compass size={14} /> },
  { modal: '6pillars',      label: '6 Pillars',  icon: <Layers size={14} /> },
  { modal: 'executive',     label: 'Exec ROI',   icon: <Activity size={14} /> },
  { modal: 'stresslab',     label: 'Stress Lab', icon: <Zap size={14} /> },
  { modal: 'latency',       label: 'Latency',    icon: <Clock size={14} /> },
  { modal: 'workloads',     label: 'Workloads',  icon: <Briefcase size={14} /> },
  { modal: 'theory',        label: 'Theory',     icon: <BookOpen size={14} /> },
];

export const ControllerView: React.FC<ControllerViewProps> = ({ roomCode }) => {
  const [sync] = useState(() => new PhoneCompanionSync(roomCode));
  const [connected, setConnected] = useState(false);
  const [stage, setStage] = useState<StageState | null>(null);
  const [speaker, setSpeaker] = useState<RemoteSpeaker>('devarsh');
  const [lastAction, setLastAction] = useState<string>('');

  useEffect(() => {
    const unsubConn = sync.onConnectionStatus((isConnected) => setConnected(isConnected));
    const unsubState = sync.onState((s) => setStage(s));
    return () => {
      unsubConn();
      unsubState();
      sync.destroy();
    };
  }, [sync]);

  const notify = (label: string) => {
    setLastAction(label);
    setTimeout(() => setLastAction(''), 1200);
  };

  const handleSpeakerChange = (s: RemoteSpeaker) => {
    setSpeaker(s);
    sync.setSpeaker(s);
    notify(`Speaker: ${SPEAKER_LABELS[s]}`);
  };

  const handlePrev = useCallback(() => {
    sync.sendCommand({ type: 'PREV_MODULE' });
    notify('← Previous');
  }, [sync]);

  const handleNext = useCallback(() => {
    sync.sendCommand({ type: 'NEXT_MODULE' });
    notify('Next →');
  }, [sync]);

  const handleChaos = () => {
    if (stage?.isChaosActive) {
      sync.sendCommand({ type: 'RESET_CHAOS' });
      notify('Outage resolved');
    } else {
      sync.sendCommand({ type: 'TRIGGER_CHAOS' });
      notify('⚡ Outage triggered');
    }
  };

  const handleScroll = (target: string) => {
    sync.sendCommand({ type: 'SCROLL_TO', target: target as never });
    notify(`Scrolled to ${target}`);
  };

  const handleModal = (modal: string) => {
    const m = modalShortcuts.find(x => x.modal === modal);
    sync.sendCommand({ type: 'OPEN_MODAL', modal, label: m?.label });
    notify(`Opened ${m?.label || modal}`);
  };

  const isChaosActive = stage?.isChaosActive ?? false;
  const totalModules = stage ? (stage.currentDomainIndex + 1) : 0;

  return (
    <div className="controller-root">
      {/* Status bar */}
      <header className="controller-header">
        <div className="controller-header-left">
          <span className="controller-room-label">WAF Remote</span>
          <span className="controller-room-code">{roomCode}</span>
        </div>
        <div className="controller-connection-status">
          {connected ? (
            <><Wifi size={14} color="var(--status-success)" /><span className="controller-conn-text connected">Live</span></>
          ) : (
            <><WifiOff size={14} color="var(--status-danger)" /><span className="controller-conn-text">Connecting…</span></>
          )}
        </div>
      </header>

      {/* Module info */}
      {stage && (
        <div className="controller-module-info">
          <span className="controller-module-counter">
            Module {stage.currentDomainIndex + 1} · {totalModules}
          </span>
          <h2 className="controller-module-title">{stage.domainTitle}</h2>
          <span className="controller-module-category">{stage.domainCategory}</span>
        </div>
      )}

      {/* Navigation */}
      <section className="controller-section">
        <div className="controller-nav-row">
          <button
            className="controller-btn controller-btn--nav"
            onClick={handlePrev}
            disabled={stage?.currentDomainIndex === 0}
            aria-label="Previous module"
          >
            <SkipBack size={20} />
            <span>Prev</span>
          </button>
          <button
            className="controller-btn controller-btn--nav controller-btn--next"
            onClick={handleNext}
            aria-label="Next module"
          >
            <span>Next</span>
            <SkipForward size={20} />
          </button>
        </div>
      </section>

      {/* Scroll to section */}
      <section className="controller-section">
        <span className="controller-section-label">Scroll stage to</span>
        <div className="controller-scroll-grid">
          {scrollSections.map(({ target, label, icon }) => (
            <button
              key={target}
              className="controller-btn controller-btn--scroll"
              onClick={() => handleScroll(target)}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Simulation */}
      <section className="controller-section">
        <span className="controller-section-label">Outage simulation</span>
        <button
          className={`controller-btn controller-btn--chaos ${isChaosActive ? 'is-active' : ''}`}
          onClick={handleChaos}
        >
          {isChaosActive
            ? <><CheckCircle size={16} /><span>Resolve outage</span></>
            : <><AlertCircle size={16} /><span>Trigger outage</span></>
          }
        </button>
      </section>

      {/* Open modals on stage */}
      <section className="controller-section">
        <span className="controller-section-label">Open on stage</span>
        <div className="controller-modal-grid">
          {modalShortcuts.map(({ modal, label, icon }) => (
            <button
              key={modal}
              className="controller-btn controller-btn--modal"
              onClick={() => handleModal(modal)}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Speaker identity */}
      <section className="controller-section">
        <span className="controller-section-label">Speaking now</span>
        <div className="controller-speaker-row">
          {(['devarsh', 'aman'] as RemoteSpeaker[]).map((s) => (
            <button
              key={s}
              className={`controller-btn controller-btn--speaker ${speaker === s ? 'active' : ''}`}
              onClick={() => handleSpeakerChange(s)}
            >
              {SPEAKER_LABELS[s]}
            </button>
          ))}
        </div>
      </section>

      {/* Toast notification */}
      {lastAction && (
        <div className="controller-toast" role="status" aria-live="polite">
          {lastAction}
        </div>
      )}
    </div>
  );
};

export default ControllerView;
