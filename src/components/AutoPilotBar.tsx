import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  SkipBack, 
  Clock, 
  Zap, 
  FileText, 
  X,
  Volume2,
  VolumeX,
  ShieldAlert,
  ChevronUp,
  ChevronDown,
  Briefcase,
  Sliders,
  BookOpen
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
  const [autoChaos, setAutoChaos] = useState<boolean>(true);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  
  // Presentation elapsed timer
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  
  const timerRef = useRef<number | null>(null);
  const elapsedTimerRef = useRef<number | null>(null);

  // Overall presentation timer runs whenever auto-pilot is active or presentation starts
  useEffect(() => {
    elapsedTimerRef.current = window.setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => {
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    };
  }, []);

  // Format MM:SS
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Reset timer on domain change
  useEffect(() => {
    setTimeLeft(durationSec);
  }, [currentDomainIndex, durationSec]);

  // Main Auto-Pilot countdown loop
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        // Trigger chaos midway (at ~40% remaining)
        if (autoChaos && prev === Math.floor(durationSec * 0.4) && !isChaosActive) {
          onTriggerChaos();
        }

        // Auto-heal / reset chaos before transition (at ~15% remaining)
        if (autoChaos && prev === Math.floor(durationSec * 0.15) && isChaosActive) {
          onResetChaos();
        }

        if (prev <= 1) {
          // Advance domain
          if (currentDomainIndex < totalDomains - 1) {
            onNextDomain();
            return durationSec;
          } else {
            // End of presentation
            setIsPlaying(false);
            soundFX.playHealChime();
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, autoChaos, durationSec, currentDomainIndex, totalDomains, isChaosActive, onNextDomain, onTriggerChaos, onResetChaos]);

  // Toggle play/pause
  const handleTogglePlay = () => {
    soundFX.playClick();
    setIsPlaying(prev => !prev);
  };

  const progressPercent = Math.max(0, Math.min(100, ((durationSec - timeLeft) / durationSec) * 100));

  return (
    <aside 
      className={`autopilot-floating-bar ${isMinimized ? 'minimized' : ''}`}
      aria-label="Presentation auto-pilot and comparison controls"
    >
      <div className="autopilot-inner">
        {/* Progress Bar Line */}
        <div 
          className="autopilot-progress-track"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'rgba(255, 255, 255, 0.08)',
            borderTopLeftRadius: 'var(--radius-outer)',
            borderTopRightRadius: 'var(--radius-outer)',
            overflow: 'hidden'
          }}
        >
          <div 
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: isPlaying ? 'var(--accent)' : 'var(--text-tertiary)',
              transition: 'width 1s linear'
            }}
          />
        </div>

        {/* Bar Content */}
        <div className="autopilot-content-row">
          {/* Status Badge & Presentation Clock */}
          <div className="autopilot-badge-group">
            <span 
              className={`live-indicator-dot ${isPlaying ? 'pulse' : ''}`}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: isPlaying ? 'var(--status-success)' : 'var(--text-tertiary)',
                display: 'inline-block'
              }}
            />
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: isPlaying ? 'var(--status-success)' : 'var(--text-secondary)' }}>
              {isPlaying ? 'Auto-Pilot Running' : 'Auto-Pilot Paused'}
            </span>
            <span style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>•</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }} title="Total elapsed presentation time">
              ⏱ {formatTime(elapsedSeconds)}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>
              {timeLeft}s left
            </span>
          </div>

          {/* Primary Playback Controls */}
          <div className="autopilot-controls-group">
            <button
              className="btn-action btn-icon"
              onClick={() => {
                soundFX.playClick();
                onPrevDomain();
              }}
              disabled={currentDomainIndex === 0}
              title="Previous domain [←]"
              aria-label="Previous domain"
              style={{ height: 28, width: 28 }}
            >
              <SkipBack size={13} />
            </button>

            <button
              className={`btn-action ${isPlaying ? 'danger-quiet' : 'primary'}`}
              onClick={handleTogglePlay}
              style={{ height: 30, padding: '0 12px', gap: 6, fontWeight: 600 }}
              title="Toggle background presentation auto-cycle [Space]"
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
              title="Next domain [→]"
              aria-label="Next domain"
              style={{ height: 28, width: 28 }}
            >
              <SkipForward size={13} />
            </button>

            {/* Speed Presets */}
            <div className="segmented-control" style={{ padding: 1, height: 26 }}>
              {[15, 30, 60].map(s => (
                <button
                  key={s}
                  className={`segmented-item ${durationSec === s ? 'active' : ''}`}
                  onClick={() => {
                    soundFX.playClick();
                    setDurationSec(s);
                    setTimeLeft(s);
                  }}
                  style={{ padding: '2px 7px', fontSize: 11, minHeight: 22 }}
                  title={`${s} seconds per architecture domain`}
                >
                  {s}s
                </button>
              ))}
            </div>

            {/* Auto-Chaos Checkbox */}
            <label 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 5, 
                fontSize: 11, 
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                marginLeft: 4,
                userSelect: 'none'
              }}
              title="Automatically trigger chaos failure injection and self-healing recovery midway through each slide"
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

          {/* Deep Dives & Teleprompter Quick Launchers */}
          <div className="autopilot-launchers-group">
            <button
              className="btn-action"
              onClick={onOpenScriptPrompter}
              style={{ height: 28, fontSize: 11, gap: 5, background: 'rgba(255, 255, 255, 0.05)' }}
              title="Open verbatim speaker script and jury defense questions [S]"
            >
              <FileText size={12} color="var(--accent)" />
              <span className="btn-label-desktop">Speaker Script [S]</span>
              <span className="btn-label-mobile">Script</span>
            </button>

            <button
              className="btn-action"
              onClick={onOpenAiCopilot}
              style={{ height: 28, fontSize: 11, gap: 5, background: 'rgba(255, 153, 0, 0.12)', border: '1px solid rgba(255, 153, 0, 0.35)', color: '#FF9900' }}
              title="Launch Grounded AI Architecture Copilot [A]"
            >
              <span style={{ fontSize: 12 }}>✨</span>
              <span className="btn-label-desktop">AI Copilot [A]</span>
            </button>

            <button
              className="btn-action"
              onClick={onOpen6Pillars}
              style={{ height: 28, fontSize: 11, gap: 5, background: 'rgba(255, 255, 255, 0.05)' }}
              title="Explore the 6 Pillars of the AWS Well-Architected Framework"
            >
              <span style={{ fontSize: 12 }}>🏛️</span>
              <span className="btn-label-desktop">6 Pillars</span>
            </button>

            <button
              className="btn-action"
              onClick={onOpenExecutiveReview}
              style={{ height: 28, fontSize: 11, gap: 5, background: 'rgba(255, 255, 255, 0.05)' }}
              title="View full AWS Well-Architected Review audit & ROI savings calculator"
            >
              <span style={{ fontSize: 12 }}>📊</span>
              <span className="btn-label-desktop">Executive ROI</span>
            </button>

            <button
              className="btn-action"
              onClick={onOpenStressLab}
              style={{ height: 28, fontSize: 11, gap: 5, background: 'rgba(255, 255, 255, 0.05)' }}
              title="Run live real-time stress testing simulations"
            >
              <Zap size={12} color="var(--status-warning)" />
              <span className="btn-label-desktop">Stress Lab</span>
            </button>

            <button
              className="btn-action"
              onClick={onOpenPacketSimulator}
              style={{ height: 28, fontSize: 11, gap: 5, background: 'rgba(255, 255, 255, 0.05)' }}
              title="Simulate side-by-side animated packet latency in bad vs good architecture"
            >
              <Clock size={12} color="var(--accent)" />
              <span className="btn-label-desktop">Packet Flight</span>
            </button>

            <button
              className="btn-action"
              onClick={onOpenClientSolutions}
              style={{ height: 28, fontSize: 11, gap: 5, background: 'rgba(255, 255, 255, 0.05)' }}
              title="Explore real-world client workload requirements and cost cutting [W]"
            >
              <Briefcase size={12} color="var(--accent)" />
              <span className="btn-label-desktop">Client Solutions [W]</span>
              <span className="btn-label-mobile">Clients</span>
            </button>

            <button
              className="btn-action"
              onClick={onOpenSubtopics}
              style={{ height: 28, fontSize: 11, gap: 5, background: 'rgba(255, 255, 255, 0.05)' }}
              title="Interactive subtopic labs: RDS Proxy, EBS gp3 economics, Caching, Aurora Quorum, SQS DLQ [T]"
            >
              <Sliders size={12} color="var(--status-success)" />
              <span className="btn-label-desktop">Subtopics [T]</span>
              <span className="btn-label-mobile">Labs</span>
            </button>

            <button
              className="btn-action"
              onClick={onOpenTheory}
              style={{ height: 28, fontSize: 11, gap: 5, background: 'rgba(255, 255, 255, 0.05)' }}
              title="Master Theoretical Foundations and Academic Literature Compendium [K]"
            >
              <BookOpen size={12} color="var(--accent)" />
              <span className="btn-label-desktop">Theory [K]</span>
              <span className="btn-label-mobile">Theory</span>
            </button>

            {/* Minimize / Collapse */}
            <button
              className="btn-action btn-icon"
              onClick={() => setIsMinimized(!isMinimized)}
              style={{ height: 28, width: 28, marginLeft: 2 }}
              title={isMinimized ? "Expand auto-pilot toolbar" : "Minimize auto-pilot toolbar"}
              aria-label="Toggle auto-pilot minimize"
            >
              {isMinimized ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
