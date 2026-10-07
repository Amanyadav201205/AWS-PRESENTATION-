import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Clock, 
  Zap, 
  FileText, 
  ChevronUp, 
  ChevronDown, 
  Briefcase, 
  Sliders, 
  BookOpen,
  Compass
} from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

interface AutoPilotBarProps {
  currentDomainIndex: number;
  totalDomains: number;
  onNextDomain: () => void;
  onPrevDomain: () => void;
  onTriggerChaos: () => void;
  onResetChaos: () => void;
  isChaosActive: boolean;
  onOpenScriptPrompter: () => void;
  onOpen6Pillars: () => void;
  onOpenExecutiveReview: () => void;
  onOpenStressLab: () => void;
  onOpenPacketSimulator: () => void;
  onOpenClientSolutions: () => void;
  onOpenSubtopics: () => void;
  onOpenTheory: () => void;
  onOpenAiCopilot: () => void;
}

export const AutoPilotBar: React.FC<AutoPilotBarProps> = ({
  currentDomainIndex,
  totalDomains,
  onNextDomain,
  onPrevDomain,
  onTriggerChaos,
  onResetChaos,
  isChaosActive,
  onOpenScriptPrompter,
  onOpen6Pillars,
  onOpenExecutiveReview,
  onOpenStressLab,
  onOpenPacketSimulator,
  onOpenClientSolutions,
  onOpenSubtopics,
  onOpenTheory,
  onOpenAiCopilot
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [durationSec, setDurationSec] = useState<number>(30); // 15, 30, or 60s
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [autoChaos, setAutoChaos] = useState<boolean>(false);
  // Default to minimized state per Audit Item 1.8
  const [isMinimized, setIsMinimized] = useState<boolean>(true);
  
  // Presentation elapsed timer
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  
  const timerRef = useRef<number | null>(null);
  const elapsedTimerRef = useRef<number | null>(null);

  useEffect(() => {
    elapsedTimerRef.current = window.setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => {
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    };
  }, []);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    setTimeLeft(durationSec);
  }, [currentDomainIndex, durationSec]);

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (autoChaos && prev === Math.floor(durationSec * 0.4) && !isChaosActive) {
          onTriggerChaos();
        }
        if (autoChaos && prev === Math.floor(durationSec * 0.15) && isChaosActive) {
          onResetChaos();
        }

        if (prev <= 1) {
          if (currentDomainIndex < totalDomains - 1) {
            onNextDomain();
            return durationSec;
          } else {
            setIsPlaying(false);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, durationSec, currentDomainIndex, totalDomains, onNextDomain, autoChaos, isChaosActive, onTriggerChaos, onResetChaos]);

  const handleTogglePlay = () => {
    soundFX.playClick();
    setIsPlaying(prev => !prev);
  };

  const progressPercent = ((durationSec - timeLeft) / durationSec) * 100;

  return (
    <aside 
      className={`autopilot-floating-bar ${isMinimized ? 'minimized' : ''}`}
      aria-label="Presentation Runner Dock"
    >
      {/* Top Progress Track */}
      {isPlaying && (
        <div className="autopilot-progress-track">
          <div 
            className="autopilot-progress-fill" 
            style={{ width: `${progressPercent}%` }} 
          />
        </div>
      )}

      {/* Dock Content */}
      <div className="autopilot-inner-container">
        {/* Minimized Pill View */}
        {isMinimized ? (
          <div className="autopilot-minimized-row">
            <button
              className="btn-action primary"
              onClick={handleTogglePlay}
              title="Toggle auto-pilot [Space]"
              aria-label={isPlaying ? "Pause auto-pilot" : "Start auto-pilot"}
              style={{ minHeight: 32, padding: '0 12px' }}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              <span>{isPlaying ? 'Pause' : 'Auto-Pilot'}</span>
            </button>

            <button
              className="btn-action btn-icon"
              onClick={onPrevDomain}
              disabled={currentDomainIndex === 0}
              title="Previous module [←]"
              aria-label="Previous module"
              style={{ minHeight: 32, minWidth: 32 }}
            >
              <SkipBack size={13} />
            </button>

            <button
              className="btn-action btn-icon"
              onClick={onNextDomain}
              disabled={currentDomainIndex === totalDomains - 1}
              title="Next module [→]"
              aria-label="Next module"
              style={{ minHeight: 32, minWidth: 32 }}
            >
              <SkipForward size={13} />
            </button>

            <span className="autopilot-time-pill" title="Total presentation elapsed time">
              <Clock size={11} color="var(--accent)" />
              <span>{formatTime(elapsedSeconds)}</span>
            </span>

            <button
              className="btn-action btn-icon"
              onClick={() => setIsMinimized(false)}
              title="Expand Auto-Pilot dock"
              aria-label="Expand dock"
              style={{ minHeight: 32, minWidth: 32 }}
            >
              <ChevronUp size={13} />
            </button>
          </div>
        ) : (
          /* Expanded Full Dock View */
          <div className="autopilot-expanded-row">
            <div className="autopilot-controls-group">
              <button
                className="btn-action btn-icon"
                onClick={() => {
                  soundFX.playClick();
                  onPrevDomain();
                }}
                disabled={currentDomainIndex === 0}
                title="Previous module [←]"
                aria-label="Previous module"
                style={{ minHeight: 32, minWidth: 32 }}
              >
                <SkipBack size={13} />
              </button>

              <button
                className={`btn-action ${isPlaying ? 'danger-quiet' : 'primary'}`}
                onClick={handleTogglePlay}
                style={{ minHeight: 32, padding: '0 12px', gap: 6, fontWeight: 600 }}
                title="Toggle presentation auto-cycle [Space]"
                aria-label={isPlaying ? "Pause auto-pilot" : "Start auto-pilot"}
              >
                {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                <span style={{ fontSize: 12 }}>{isPlaying ? 'Pause' : 'Start Auto-Pilot'}</span>
              </button>

              <button
                className="btn-action btn-icon"
                onClick={() => {
                  soundFX.playClick();
                  onNextDomain();
                }}
                disabled={currentDomainIndex === totalDomains - 1}
                title="Next module [→]"
                aria-label="Next module"
                style={{ minHeight: 32, minWidth: 32 }}
              >
                <SkipForward size={13} />
              </button>

              {/* Speed Presets - Minimum 32px height for click target */}
              <div className="segmented-control" style={{ padding: 2, height: 32 }}>
                {[15, 30, 60].map(s => (
                  <button
                    key={s}
                    className={`segmented-item ${durationSec === s ? 'active' : ''}`}
                    onClick={() => {
                      soundFX.playClick();
                      setDurationSec(s);
                      setTimeLeft(s);
                    }}
                    style={{ padding: '0 10px', fontSize: 11, minHeight: 28 }}
                    title={`${s} seconds per architecture domain`}
                  >
                    {s}s
                  </button>
                ))}
              </div>

              {/* Auto-Outage Simulation Option */}
              <label 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 6, 
                  fontSize: 12, 
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  marginLeft: 4,
                  userSelect: 'none'
                }}
                title="Automatically trigger outage and self-healing recovery midway through each slide"
              >
                <input
                  type="checkbox"
                  checked={autoChaos}
                  onChange={e => setAutoChaos(e.target.checked)}
                  style={{ accentColor: 'var(--accent)', cursor: 'pointer' }}
                />
                <span className="btn-label-desktop">Auto-Simulate Outage</span>
              </label>
            </div>

            {/* Quick Action Launchers */}
            <div className="autopilot-launchers-group">
              <button
                className="btn-action"
                onClick={onOpenScriptPrompter}
                style={{ minHeight: 32, fontSize: 12, gap: 5 }}
                title="Open speaker script and jury defense questions [S]"
              >
                <FileText size={12} color="var(--accent)" />
                <span className="btn-label-desktop">Script</span>
              </button>

              <button
                className="btn-action"
                onClick={onOpenAiCopilot}
                style={{ minHeight: 32, fontSize: 12, gap: 5 }}
                title="Open Guided Architecture Q&A [A]"
              >
                <Compass size={12} color="var(--accent)" />
                <span className="btn-label-desktop">Guided Q&amp;A</span>
              </button>

              <button
                className="btn-action"
                onClick={onOpen6Pillars}
                style={{ minHeight: 32, fontSize: 12, gap: 5 }}
                title="Explore the 6 Pillars of the AWS Well-Architected Framework"
              >
                <span style={{ fontSize: 12 }}>🏛️</span>
                <span className="btn-label-desktop">6 Pillars</span>
              </button>

              <button
                className="btn-action"
                onClick={onOpenExecutiveReview}
                style={{ minHeight: 32, fontSize: 12, gap: 5 }}
                title="View full AWS Well-Architected Review audit & ROI savings calculator"
              >
                <span style={{ fontSize: 12 }}>📊</span>
                <span className="btn-label-desktop">Executive ROI</span>
              </button>

              <button
                className="btn-action"
                onClick={onOpenStressLab}
                style={{ minHeight: 32, fontSize: 12, gap: 5 }}
                title="Run live incident stress tests"
              >
                <Zap size={12} color="var(--status-warning)" />
                <span className="btn-label-desktop">Stress Lab</span>
              </button>

              <button
                className="btn-action"
                onClick={onOpenPacketSimulator}
                style={{ minHeight: 32, fontSize: 12, gap: 5 }}
                title="Simulate side-by-side animated packet latency"
              >
                <Clock size={12} color="var(--accent)" />
                <span className="btn-label-desktop">Latency Flight</span>
              </button>

              <button
                className="btn-action"
                onClick={onOpenClientSolutions}
                style={{ minHeight: 32, fontSize: 12, gap: 5 }}
                title="Explore real-world client workload requirements [W]"
              >
                <Briefcase size={12} color="var(--accent)" />
                <span className="btn-label-desktop">Workloads</span>
              </button>

              <button
                className="btn-action"
                onClick={onOpenSubtopics}
                style={{ minHeight: 32, fontSize: 12, gap: 5 }}
                title="Interactive subtopic labs [T]"
              >
                <Sliders size={12} color="var(--status-success)" />
                <span className="btn-label-desktop">Labs</span>
              </button>

              <button
                className="btn-action"
                onClick={onOpenTheory}
                style={{ minHeight: 32, fontSize: 12, gap: 5 }}
                title="Master Theoretical Foundations and Academic Literature [K]"
              >
                <BookOpen size={12} color="var(--accent)" />
                <span className="btn-label-desktop">Theory</span>
              </button>

              {/* Minimize toggle */}
              <button
                className="btn-action btn-icon"
                onClick={() => setIsMinimized(true)}
                style={{ minHeight: 32, minWidth: 32 }}
                title="Minimize auto-pilot dock"
                aria-label="Minimize auto-pilot dock"
              >
                <ChevronDown size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AutoPilotBar;
