import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RotateCcw,
  Check,
  Award,
  Clock,
  FileText,
  Briefcase,
  Sliders,
  LayoutGrid,
  Printer,
  BookOpen,
  Sparkles,
  Maximize2,
  ShieldCheck,
  Play
} from 'lucide-react';
import {
  DomainData
} from '../types';
import {
  soundFX
} from '../utils/soundEffects';
import { LatexFormula } from './LatexFormula';
import {
  PillarRadarChart
} from './PillarRadarChart';
import {
  theoreticalFoundations
} from '../data/theoreticalFoundations';
import {
  AwsLogo
} from './AwsLogo';

interface PresenterProps {
  domain: DomainData;
  currentIndex: number;
  totalDomains: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  onTriggerChaos: () => void;
  isChaosActive: boolean;
  onResetChaos: () => void;
  onOpenPacketSimulator?: () => void;
  onOpenClientSolutions?: () => void;
  onOpenSubtopics?: () => void;
  allDomains?: DomainData[];
  onSelectIndex?: (index: number) => void;
  slideMode?: SlideViewMode;
  onSlideModeChange?: (mode: SlideViewMode) => void;
  isGridOpen?: boolean;
  onToggleGrid?: (open?: boolean) => void;
  slideSimTrigger?: number;
}

export type SlideViewMode = 'keynote' | 'dual' | 'theory';

export const PresenterOverlay: React.FC<PresenterProps> = ({
  domain,
  currentIndex,
  totalDomains,
  onNext,
  onPrev,
  onClose,
  onTriggerChaos,
  isChaosActive,
  onResetChaos,
  onOpenPacketSimulator,
  onOpenClientSolutions,
  onOpenSubtopics,
  allDomains,
  onSelectIndex,
  slideMode: externalSlideMode,
  onSlideModeChange,
  isGridOpen: externalGridOpen,
  onToggleGrid,
  slideSimTrigger
}) => {
  const [internalSlideMode, setInternalSlideMode] = useState<SlideViewMode>('keynote');
  const slideMode = externalSlideMode ?? internalSlideMode;
  const setSlideMode = (mode: SlideViewMode) => {
    if (onSlideModeChange) onSlideModeChange(mode);
    setInternalSlideMode(mode);
  };

  const [internalGridOpen, setInternalGridOpen] = useState<boolean>(false);
  const isGridOpen = externalGridOpen !== undefined ? externalGridOpen : internalGridOpen;
  const setIsGridOpen = (val: boolean | ((prev: boolean) => boolean)) => {
    const nextVal = typeof val === 'function' ? val(isGridOpen) : val;
    if (onToggleGrid) onToggleGrid(nextVal);
    setInternalGridOpen(nextVal);
  };

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isLiveSimulating, setIsLiveSimulating] = useState<boolean>(false);
  const [simStep, setSimStep] = useState<number>(0);

  const timerRef = useRef<number | null>(null);
  const lastSimTriggerRef = useRef<number>(0);

  // Trigger live simulation when requested by phone remote
  useEffect(() => {
    if (slideSimTrigger && slideSimTrigger > lastSimTriggerRef.current) {
      lastSimTriggerRef.current = slideSimTrigger;
      handleRunSlideSim();
    }
  }, [slideSimTrigger]);

  // Presentation Timer
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const theory = theoreticalFoundations[domain.id];

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGridOpen) {
        if (e.key === 'Escape' || e.key === 'g' || e.key === 'G') {
          setIsGridOpen(false);
        }
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'Space') {
        onNext();
      } else if (e.key === 'ArrowLeft') {
        onPrev();
      } else if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        onClose();
      } else if (e.key === 'g' || e.key === 'G') {
        setIsGridOpen(prev => !prev);
      } else if (e.key === '1') {
        setSlideMode('keynote');
      } else if (e.key === '2') {
        setSlideMode('dual');
      } else if (e.key === '3') {
        setSlideMode('theory');
      } else if (e.key === 'c' || e.key === 'C') {
        if (!isChaosActive) onTriggerChaos();
      } else if (e.key === 'r' || e.key === 'R') {
        onResetChaos();
      } else if ((e.key === 'l' || e.key === 'L') && onOpenPacketSimulator) {
        onOpenPacketSimulator();
      } else if ((e.key === 'w' || e.key === 'W') && onOpenClientSolutions) {
        onOpenClientSolutions();
      } else if ((e.key === 't' || e.key === 'T') && onOpenSubtopics) {
        onOpenSubtopics();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    onNext, 
    onPrev, 
    onClose, 
    onTriggerChaos, 
    onResetChaos, 
    isChaosActive, 
    isGridOpen,
    onOpenPacketSimulator, 
    onOpenClientSolutions,
    onOpenSubtopics
  ]);

  const handleRunSlideSim = () => {
    soundFX.playClick();
    setIsLiveSimulating(true);
    setSimStep(1);
    setTimeout(() => {
      setSimStep(2);
      soundFX.playClick();
      setTimeout(() => {
        setSimStep(3);
        soundFX.playHealChime();
        setTimeout(() => {
          setIsLiveSimulating(false);
          setSimStep(0);
        }, 1500);
      }, 1000);
    }, 1000);
  };

  const handlePrintHandouts = () => {
    soundFX.playClick();
    window.print();
  };

  return (
    <div className="sheet-overlay presenter-overlay" role="dialog" aria-modal="true" aria-label={`Presentation deck, slide ${currentIndex + 1} of ${totalDomains}: ${domain.title}`}>
      <div className="presenter-dialog presenter-dialog--full">
        {/* Progress Bar */}
        <div style={{ width: '100%', height: 3, background: 'rgba(255, 255, 255, 0.08)', position: 'relative' }}>
          <div 
            style={{ 
              height: '100%', 
              background: 'var(--accent)', 
              width: `${((currentIndex + 1) / totalDomains) * 100}%`,
              transition: 'width 0.3s ease'
            }} 
          />
        </div>

        {/* Top Keynote Control Bar */}
        <div className="presenter-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--separator)', padding: '12px 16px', flexWrap: 'wrap', gap: 10 }}>
          {/* Left: Brand, Slide Title & Timer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255, 255, 255, 0.05)', padding: '4px 10px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--separator)' }}>
              <AwsLogo height={16} width={28} color="#FFFFFF" />
              <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.04em' }}>
                SLIDE {currentIndex + 1}/{totalDomains}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                  {currentIndex + 1}. {domain.title}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                  ({domain.category})
                </span>
              </div>
              <span style={{ fontSize: 10.5, color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '0.02em' }}>
                Devarsh Patel &amp; Aman Kumar Yadav
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255, 255, 255, 0.05)', padding: '3px 10px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--separator)', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
              <Clock size={11} color="var(--accent)" />
              <span>{formatTime(elapsedSeconds)}</span>
            </div>
          </div>

          {/* Center: Slide Mode Segmented Control */}
          <div className="segmented-control" style={{ height: 28 }}>
            <button 
              className={`segmented-item ${slideMode === 'keynote' ? 'active' : ''}`}
              onClick={() => { soundFX.playClick(); setSlideMode('keynote'); }}
              title="16:9 Presentation Slide Canvas [1]"
            >
              <Maximize2 size={12} />
              <span>1. Architecture Slide</span>
            </button>
            <button 
              className={`segmented-item ${slideMode === 'dual' ? 'active' : ''}`}
              onClick={() => { soundFX.playClick(); setSlideMode('dual'); }}
              title="Dual Speaker Notes & Teleprompter [2]"
            >
              <FileText size={12} />
              <span>2. Speaker Notes</span>
            </button>
            <button 
              className={`segmented-item ${slideMode === 'theory' ? 'active' : ''}`}
              onClick={() => { soundFX.playClick(); setSlideMode('theory'); }}
              title="Academic Theorems & AWS Whitepaper Citations [3]"
            >
              <BookOpen size={12} />
              <span>3. Theoretical Proof</span>
            </button>
          </div>

          {/* Right: Quick Launchers & Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* Slide Grid Navigator Button */}
            {allDomains && onSelectIndex && (
              <button
                className="btn-action"
                onClick={() => { soundFX.playClick(); setIsGridOpen(true); }}
                title="Open 15-Slide Overview Grid [G]"
                style={{ height: 28, fontSize: 11, gap: 5, borderRadius: 'var(--radius-pill)', boxShadow: 'inset 0 1px 0 var(--hairline-top)' }}
              >
                <LayoutGrid size={12} color="var(--accent)" />
                <span>Slide Grid [G]</span>
              </button>
            )}

            {/* Outage Simulation */}
            {isChaosActive ? (
              <button className="btn-action danger-quiet" onClick={onResetChaos} style={{ height: 28, fontSize: 11, gap: 4, borderRadius: 'var(--radius-pill)', boxShadow: 'inset 0 1px 0 var(--hairline-top)' }}>
                <RotateCcw size={12} /> <span>Reset [R]</span>
              </button>
            ) : (
              <button className="btn-action" onClick={onTriggerChaos} style={{ height: 28, fontSize: 11, gap: 4, borderRadius: 'var(--radius-pill)', boxShadow: 'inset 0 1px 0 var(--hairline-top)' }}>
                <AlertCircle size={12} color="var(--status-danger)" /> <span>Outage [C]</span>
              </button>
            )}

            {/* Packet Flight */}
            {onOpenPacketSimulator && (
              <button
                className="btn-action"
                onClick={onOpenPacketSimulator}
                title="Launch packet flight latency benchmark [L]"
                style={{ height: 28, fontSize: 11, gap: 4, borderRadius: 'var(--radius-pill)', boxShadow: 'inset 0 1px 0 var(--hairline-top)' }}
              >
                <Clock size={12} color="var(--accent)" /> <span>Flight [L]</span>
              </button>
            )}

            {/* Client Solutions */}
            {onOpenClientSolutions && (
              <button
                className="btn-action"
                onClick={onOpenClientSolutions}
                title="Explore client workload blueprints and cost cutting [W]"
                style={{ height: 28, fontSize: 11, gap: 4, borderRadius: 'var(--radius-pill)', boxShadow: 'inset 0 1px 0 var(--hairline-top)' }}
              >
                <Briefcase size={12} color="var(--accent)" /> <span>Clients [W]</span>
              </button>
            )}

            {/* Subtopic Labs */}
            {onOpenSubtopics && (
              <button
                className="btn-action"
                onClick={onOpenSubtopics}
                title="Interactive subtopic labs [T]"
                style={{ height: 28, fontSize: 11, gap: 4, borderRadius: 'var(--radius-pill)', boxShadow: 'inset 0 1px 0 var(--hairline-top)' }}
              >
                <Sliders size={12} color="var(--status-success)" /> <span>Labs [T]</span>
              </button>
            )}

            {/* Print Handout */}
            <button
              className="btn-action btn-icon"
              onClick={handlePrintHandouts}
              title="Print / Save Slide Handouts"
              style={{ height: 28, width: 28, borderRadius: 'var(--radius-pill)' }}
            >
              <Printer size={13} />
            </button>

            {/* Prev / Next */}
            <button
              className="btn-action btn-icon"
              onClick={onPrev}
              disabled={currentIndex === 0}
              style={{ opacity: currentIndex === 0 ? 0.3 : 1, height: 28, width: 28, borderRadius: 'var(--radius-pill)' }}
              title="Previous slide [←]"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              className="btn-action btn-icon"
              onClick={onNext}
              disabled={currentIndex === totalDomains - 1}
              style={{ opacity: currentIndex === totalDomains - 1 ? 0.3 : 1, height: 28, width: 28, borderRadius: 'var(--radius-pill)' }}
              title="Next slide [→]"
            >
              <ChevronRight size={14} />
            </button>

            {/* Close */}
            <button
              className="btn-action btn-icon"
              onClick={() => { soundFX.playClick(); onClose(); }}
              aria-label="Exit presenter mode"
              style={{ height: 28, width: 28, borderRadius: 'var(--radius-pill)' }}
              title="Exit Presenter Deck [Esc]"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Slide Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {/* MODE 1: KEYNOTE PRESENTATION SLIDE CANVAS */}
          {slideMode === 'keynote' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Slide Headline & Client Context */}
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--separator-subtle)', borderRadius: 'var(--radius-inner)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                    Client Context & Primary Mandate
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
                    {domain.customerRequirement.clientName}: {domain.customerRequirement.businessGoal}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', padding: '4px 10px', borderRadius: 'var(--radius-pill)', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', border: '1px solid var(--separator)' }}>
                    Target: {domain.customerRequirement.budgetOrSlaTarget}
                  </span>
                  <button
                    className="btn-action primary"
                    onClick={handleRunSlideSim}
                    disabled={isLiveSimulating}
                    style={{ height: 28, fontSize: 11, gap: 5, borderRadius: 'var(--radius-pill)', boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.25)' }}
                    title="Simulate live client transactions traversing this architecture"
                  >
                    <Play size={11} />
                    <span>{isLiveSimulating ? `Step ${simStep}/3 Active` : 'Run Live Traffic Pulse'}</span>
                  </button>
                </div>
              </div>

              {/* Side-by-Side Architectural Canvas */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
                {/* Conventional Naive Anti-Pattern */}
                <div style={{ background: 'rgba(255, 69, 58, 0.03)', border: '1px solid rgba(255, 69, 58, 0.25)', borderRadius: 'var(--radius-inner)', padding: 18, display: 'flex', flexDirection: 'column', gap: 12, boxShadow: 'inset 0 1px 0 var(--hairline-top)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <AlertCircle size={14} color="var(--status-danger)" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--status-danger)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                        Naive Conventional Anti-Pattern
                      </span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--status-danger)', fontVariantNumeric: 'tabular-nums' }}>
                      ${domain.naive.monthlyCostEst.toLocaleString()} / mo
                    </span>
                  </div>

                  <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {domain.naive.name}
                  </h3>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    {domain.naive.description}
                  </p>

                  {/* Bullet points & flaws */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '4px 0' }}>
                    {domain.naive.bulletPoints.map((bp, i) => (
                      <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                        <span style={{ color: 'var(--status-danger)', fontWeight: 700 }}>✗</span>
                        <span>{bp}</span>
                      </div>
                    ))}
                  </div>

                  {/* Failure Mode Banner */}
                  <div style={{ marginTop: 'auto', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 69, 58, 0.2)', padding: '10px 12px', borderRadius: 'var(--radius-control)', boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--status-danger)' }}>
                      Production Failure Vulnerability:
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                      {domain.chaos.naiveConsequence.narrative}
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 10, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>
                      <span style={{ color: 'var(--status-danger)' }}>Error Rate: {domain.chaos.naiveConsequence.errorRate}</span>
                      <span style={{ color: 'var(--status-danger)' }}>Downtime: {domain.chaos.naiveConsequence.downtime}</span>
                    </div>
                  </div>
                </div>

                {/* AWS Well-Architected Framework Resolution */}
                <div style={{ background: 'rgba(48, 209, 88, 0.03)', border: '1px solid rgba(48, 209, 88, 0.25)', borderRadius: 'var(--radius-inner)', padding: 18, display: 'flex', flexDirection: 'column', gap: 12, boxShadow: 'inset 0 1px 0 var(--hairline-top)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Sparkles size={14} color="var(--status-success)" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--status-success)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                        AWS Well-Architected Blueprint
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--status-success)', fontVariantNumeric: 'tabular-nums' }}>
                        ${domain.wellArch.monthlyCostEst.toLocaleString()} / mo
                      </span>
                      {domain.naive.monthlyCostEst > domain.wellArch.monthlyCostEst && (
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--status-success)', background: 'rgba(48, 209, 88, 0.15)', padding: '2px 8px', borderRadius: 'var(--radius-pill)', fontVariantNumeric: 'tabular-nums' }}>
                          {Math.round(((domain.naive.monthlyCostEst - domain.wellArch.monthlyCostEst) / domain.naive.monthlyCostEst) * 100)}% Saved
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {domain.wellArch.name}
                  </h3>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    {domain.wellArch.description}
                  </p>

                  {/* Bullet points & strengths */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '4px 0' }}>
                    {domain.wellArch.bulletPoints.map((bp, i) => (
                      <div key={i} style={{ fontSize: 12, color: 'var(--text-primary)', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                        <span style={{ color: 'var(--status-success)', fontWeight: 700 }}>✓</span>
                        <span>{bp}</span>
                      </div>
                    ))}
                  </div>

                  {/* Resilience Details Banner */}
                  <div style={{ marginTop: 'auto', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(48, 209, 88, 0.2)', padding: '10px 12px', borderRadius: 'var(--radius-control)', boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--status-success)' }}>
                      Automated Recovery Architecture:
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                      {domain.chaos.wellArchConsequence.narrative}
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 10, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>
                      <span style={{ color: 'var(--status-success)' }}>SLA: {domain.wellArch.availabilitySLA}</span>
                      <span style={{ color: 'var(--status-success)' }}>RTO: {domain.wellArch.rto}</span>
                      <span style={{ color: 'var(--status-success)' }}>RPO: {domain.wellArch.rpo}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Metrics Transitions & Pillars Strip */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--separator)', borderRadius: 'var(--radius-inner)', padding: '12px 16px' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 8 }}>
                    Architectural Metric Transitions
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {domain.metrics.map((m, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{m.label}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>
                          <span style={{ color: 'var(--text-tertiary)', textDecoration: 'line-through' }}>{m.naiveValue}</span>
                          {' → '}
                          <span style={{ color: 'var(--status-success)', fontWeight: 600 }}>{m.wellArchValue}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Theoretical Anchor Preview */}
                {theory && (
                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--separator)', borderRadius: 'var(--radius-inner)', padding: '12px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'inset 0 1px 0 var(--hairline-top)' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                          Academic Proof Law
                        </span>
                        <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
                          {theory.lawOrTheorem.name}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.4 }}>
                        {theory.lawOrTheorem.formalStatement.slice(0, 140)}...
                      </p>
                    </div>
                    <button
                      className="btn-action"
                      onClick={() => { soundFX.playClick(); setSlideMode('theory'); }}
                      style={{ height: 26, fontSize: 11, alignSelf: 'flex-start', marginTop: 6, borderRadius: 'var(--radius-pill)', boxShadow: 'inset 0 1px 0 var(--hairline-top)' }}
                    >
                      <span>Inspect Full Mathematical Proof →</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MODE 2: DUAL SPEAKER NOTES & PROMPTER */}
          {slideMode === 'dual' && (
            <div className="presenter-content-grid">
              {/* Left Column: Speaker Notes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    Speaker hook & opening statement
                  </span>
                  <p style={{ fontSize: 'var(--text-lg)', fontWeight: 500, color: 'var(--text-primary)', marginTop: 4, lineHeight: 1.35 }}>
                    "{domain.speakerNotes.hook}"
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    Architectural speaking points
                  </span>
                  {domain.speakerNotes.keyPoints.map((pt, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                      <Check size={14} color="var(--status-success)" style={{ marginTop: 3, flexShrink: 0 }} />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>

                {/* Practical insight & Exam card */}
                <div style={{ background: 'var(--bg-canvas)', border: '1px solid var(--separator)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)' }}>
                      Architect practical tip
                    </span>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.4 }}>
                      {domain.speakerNotes.architectTip}
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid var(--separator-subtle)', paddingTop: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Award size={12} /> Certified Architect Exam Focus
                    </span>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.4 }}>
                      {domain.speakerNotes.examQuestion}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Scorecard & Metrics preview */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <PillarRadarChart
                  naiveScores={domain.naive.scores}
                  wellArchScores={domain.wellArch.scores}
                />

                <div style={{ background: 'var(--bg-canvas)', border: '1px solid var(--separator)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Key metric transitions
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                    {domain.metrics.slice(0, 3).map((m, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{m.label}</span>
                        <span style={{ fontFamily: 'var(--font-mono)' }}>
                          <span style={{ color: 'var(--text-tertiary)', textDecoration: 'line-through' }}>{m.naiveValue}</span>
                          {' → '}
                          <span style={{ color: 'var(--status-success)', fontWeight: 600 }}>{m.wellArchValue}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODE 3: THEORETICAL PROOF & WHITE PAPERS */}
          {slideMode === 'theory' && theory && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
              {/* Card 1: Distributed Systems Law */}
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--separator)', borderRadius: 'var(--radius-inner)', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    Theoretical Law / Theorem
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                    {theory.lawOrTheorem.founder} ({theory.lawOrTheorem.year})
                  </span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {theory.lawOrTheorem.name}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {theory.lawOrTheorem.formalStatement}
                </p>

                {theory.lawOrTheorem.mathematicalFormula && (
                  <div style={{ background: '#000000', border: '1px solid var(--separator-subtle)', borderRadius: 'var(--radius-inner)', padding: '12px 14px' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 4 }}>
                      Mathematical Formulation:
                    </div>
                    <LatexFormula
                      formula={theory.lawOrTheorem.mathematicalFormula!}
                      style={{ fontSize: 14, color: 'var(--accent)' }}
                    />
                    {theory.lawOrTheorem.formulaExplanation && (
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.35 }}>
                        {theory.lawOrTheorem.formulaExplanation}
                      </div>
                    )}
                  </div>
                )}

                <div style={{ borderTop: '1px solid var(--separator-subtle)', paddingTop: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)' }}>
                    Architectural Application:
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.4 }}>
                    {theory.lawOrTheorem.architecturalApplication}
                  </p>
                </div>
              </div>

              {/* Card 2: AWS Whitepaper & Amazon Builders' Library */}
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--separator)', borderRadius: 'var(--radius-inner)', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--status-success)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Official AWS Literature Citations
                </span>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {theory.awsWhitepaper.title}
                  </h4>
                  <div style={{ display: 'flex', gap: 6, margin: '6px 0 8px' }}>
                    <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', padding: '2px 6px', borderRadius: 4, background: 'var(--bg-subtle)', border: '1px solid var(--separator)' }}>
                      Doc ID: {theory.awsWhitepaper.docCode}
                    </span>
                    <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', padding: '2px 6px', borderRadius: 4, background: 'rgba(48, 209, 88, 0.1)', color: 'var(--status-success)', border: '1px solid rgba(48, 209, 88, 0.3)' }}>
                      Pillar BP: {theory.awsWhitepaper.pillarBestPracticeCode}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.45 }}>
                    "{theory.awsWhitepaper.canonicalQuote}"
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--separator-subtle)', paddingTop: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    Amazon Builders' Library Reference:
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginTop: 4 }}>
                    "{theory.buildersLibrary.title}"
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 6 }}>
                    By {theory.buildersLibrary.author} ({theory.buildersLibrary.role})
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {theory.buildersLibrary.coreInsight}
                  </p>
                </div>
              </div>

              {/* Card 3: Compliance Frameworks & Jury Defense Q&A */}
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--separator)', borderRadius: 'var(--radius-inner)', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ShieldCheck size={14} color="var(--accent)" />
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    {theory.complianceStandard.standard}
                  </span>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--accent)', marginLeft: 'auto' }}>
                    {theory.complianceStandard.controlId}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {theory.complianceStandard.requirement}
                </p>

                <div style={{ borderTop: '1px solid var(--separator-subtle)', paddingTop: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--status-warning)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    Anticipated Jury Defense Question:
                  </span>
                  <p style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600, marginTop: 4 }}>
                    "{theory.defenseQnA[0].examinerQuestion}"
                  </p>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.45, background: 'rgba(0, 0, 0, 0.5)', padding: 10, borderRadius: 6, border: '1px solid var(--separator-subtle)' }}>
                    <strong style={{ color: 'var(--status-success)' }}>Airtight Defense Answer:</strong> {theory.defenseQnA[0].defenseAnswer}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SLIDE GRID OVERVIEW MODAL (Triggered by 'G' key) */}
      {isGridOpen && allDomains && onSelectIndex && (
        <div 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0, 0, 0, 0.85)', 
            backdropFilter: 'blur(20px)', 
            zIndex: 1000, 
            display: 'flex', 
            flexDirection: 'column',
            padding: 30
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>
                Slide Grid Navigator
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Jump directly to any slide in the 15-module AWS Well-Architected Framework presentation
              </p>
            </div>
            <button
              className="btn-action btn-icon"
              onClick={() => setIsGridOpen(false)}
              aria-label="Close slide grid"
              style={{ width: 32, height: 32, borderRadius: 'var(--radius-pill)' }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            {allDomains.map((d, idx) => (
              <button
                key={d.id}
                onClick={() => {
                  soundFX.playClick();
                  onSelectIndex(idx);
                  setIsGridOpen(false);
                }}
                style={{
                  background: idx === currentIndex ? 'rgba(0, 113, 227, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                  border: idx === currentIndex ? '1.5px solid var(--accent)' : '1px solid var(--separator)',
                  borderRadius: 'var(--radius-control)',
                  padding: 12,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  boxShadow: idx === currentIndex ? '0 4px 16px rgba(0, 113, 227, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2)' : 'inset 0 1px 0 var(--hairline-top)',
                  transition: 'all var(--duration-fast) var(--ease-spring)',
                  userSelect: 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 700, color: idx === currentIndex ? 'var(--accent)' : 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>
                    SLIDE {idx + 1}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
                    {d.category}
                  </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {idx + 1}. {d.title}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 'auto', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {d.customerRequirement.clientName}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
