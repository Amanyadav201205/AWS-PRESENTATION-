import { useState, useEffect, useCallback, useRef, Suspense, lazy } from 'react';
import { allDomains } from './data';
import { AppDisplayMode, ArchitectureNode, ChaosPhase, ViewMode } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CustomerJourneyCard } from './components/CustomerJourneyCard';
import { DualArchitectureStage } from './components/DualArchitectureStage';
import { MetricComparisonBar } from './components/MetricComparisonBar';
import { PillarRadarChart } from './components/PillarRadarChart';
import { IaCInspector } from './components/IaCInspector';
import { ChaosBanner } from './components/ChaosBanner';
import { AutoPilotBar } from './components/AutoPilotBar';
import { PresenterFooter } from './components/PresenterFooter';
import { soundFX } from './utils/soundEffects';
import { useDialogFocusTrap } from './hooks/useDialogFocusTrap';

// Exact id match first, then a prefix match (e.g. #/storage -> storage-layer). Unknown -> -1.
const findDomainIndexFromHash = (raw: string): number => {
  const hash = raw.replace(/^#\/?/, '').toLowerCase().trim();
  if (!hash) return -1;
  const exact = allDomains.findIndex(d => d.id.toLowerCase() === hash);
  if (exact !== -1) return exact;
  return allDomains.findIndex(d => d.id.toLowerCase().startsWith(hash + '-') || d.id.toLowerCase().split('-')[0] === hash);
};

// Code-split all heavy presentation modals via React.lazy() (P0 bundle size fix)
const GuidedArchitectureQAModal = lazy(() => import('./components/GuidedArchitectureQAModal').then(m => ({ default: m.GuidedArchitectureQAModal })));
const PresenterOverlay = lazy(() => import('./components/PresenterOverlay').then(m => ({ default: m.PresenterOverlay })));
const SpeakerScriptPrompter = lazy(() => import('./components/SpeakerScriptPrompter').then(m => ({ default: m.SpeakerScriptPrompter })));
const PillarsExplorerModal = lazy(() => import('./components/PillarsExplorerModal').then(m => ({ default: m.PillarsExplorerModal })));
const ExecutiveReviewModal = lazy(() => import('./components/ExecutiveReviewModal').then(m => ({ default: m.ExecutiveReviewModal })));
const StressLabModal = lazy(() => import('./components/StressLabModal').then(m => ({ default: m.StressLabModal })));
const PacketLatencySimulator = lazy(() => import('./components/PacketLatencySimulator').then(m => ({ default: m.PacketLatencySimulator })));
const ClientSolutionsExplorer = lazy(() => import('./components/ClientSolutionsExplorer').then(m => ({ default: m.ClientSolutionsExplorer })));
const SubtopicExplorerModal = lazy(() => import('./components/SubtopicExplorerModal').then(m => ({ default: m.SubtopicExplorerModal })));
const TheoreticalFoundationsModal = lazy(() => import('./components/TheoreticalFoundationsModal').then(m => ({ default: m.TheoreticalFoundationsModal })));
const AiGovernanceModal = lazy(() => import('./components/AiGovernanceModal').then(m => ({ default: m.AiGovernanceModal })));
const NodeDetailModal = lazy(() => import('./components/NodeDetailModal').then(m => ({ default: m.NodeDetailModal })));
const DRStrategyExplorer = lazy(() => import('./components/DRStrategyExplorer').then(m => ({ default: m.DRStrategyExplorer })));

export function App() {
  // Parse initial index from hash if available (e.g. #/storage-tiering or #/storage)
  const getInitialIndexFromHash = (): number => Math.max(0, findDomainIndexFromHash(window.location.hash));

  const [currentDomainIndex, setCurrentDomainIndex] = useState<number>(getInitialIndexFromHash);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [displayMode, setDisplayMode] = useState<AppDisplayMode>('studio');
  
  // Audited requirement 1.19: Sound effects default to muted
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [chaosPhase, setChaosPhase] = useState<ChaosPhase>('idle');
  const [completedDomainIds, setCompletedDomainIds] = useState<string[]>(['overview-thesis']);
  
  // Interactive node inspection modal state
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(null);
  const [isWellArchSelected, setIsWellArchSelected] = useState<boolean>(true);

  // Presentation & Framework Modals
  const [isPrompterOpen, setIsPrompterOpen] = useState<boolean>(false);
  const [is6PillarsOpen, setIs6PillarsOpen] = useState<boolean>(false);
  const [isExecutiveReviewOpen, setIsExecutiveReviewOpen] = useState<boolean>(false);
  const [isStressLabOpen, setIsStressLabOpen] = useState<boolean>(false);
  const [isPacketSimulatorOpen, setIsPacketSimulatorOpen] = useState<boolean>(false);
  const [isClientSolutionsOpen, setIsClientSolutionsOpen] = useState<boolean>(false);
  const [isSubtopicLabsOpen, setIsSubtopicLabsOpen] = useState<boolean>(false);
  const [isTheoryOpen, setIsTheoryOpen] = useState<boolean>(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState<boolean>(false);
  const [isAiGovernanceOpen, setIsAiGovernanceOpen] = useState<boolean>(false);

  // Ensure soundFX matches initial audio state
  useEffect(() => {
    soundFX.enabled = false;
  }, []);

  // Active domain definition
  const activeDomain = allDomains[currentDomainIndex] || allDomains[0];
  const mainRef = useRef<HTMLElement>(null);
  const isFirstRenderRef = useRef(true);
  const chaosTimersRef = useRef<number[]>([]);

  useDialogFocusTrap();

  // Hash-based routing & document.title sync (P0 Fix 1.5)
  useEffect(() => {
    const targetHash = `#/${activeDomain.id}`;
    if (window.location.hash !== targetHash) {
      window.history.replaceState(null, '', targetHash);
    }
    document.title = `${activeDomain.title} · AWS Well-Architected Framework`;
  }, [activeDomain]);

  // Listen to external hash changes / browser back & forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const idx = findDomainIndexFromHash(window.location.hash);
      if (idx !== -1 && idx !== currentDomainIndex) {
        setCurrentDomainIndex(idx);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentDomainIndex]);

  // Mark current domain as visited & reset node/chaos
  useEffect(() => {
    if (!completedDomainIds.includes(activeDomain.id)) {
      setCompletedDomainIds(prev => [...prev, activeDomain.id]);
    }
    chaosTimersRef.current.forEach(id => window.clearTimeout(id));
    chaosTimersRef.current = [];
    setChaosPhase('idle');
    setSelectedNode(null);
    // New module starts at the top, and screen readers / keyboard users land on its title
    mainRef.current?.scrollTo({ top: 0 });
    if (!isFirstRenderRef.current) {
      document.getElementById('domain-title')?.focus({ preventScroll: true });
    }
    isFirstRenderRef.current = false;
  }, [activeDomain.id]);

  const handleSelectDomain = (id: string) => {
    const idx = allDomains.findIndex(d => d.id === id);
    if (idx !== -1) {
      setCurrentDomainIndex(idx);
    }
  };

  const handleNextDomain = useCallback(() => {
    if (currentDomainIndex < allDomains.length - 1) {
      soundFX.playClick();
      setCurrentDomainIndex(prev => prev + 1);
    }
  }, [currentDomainIndex]);

  const handlePrevDomain = useCallback(() => {
    if (currentDomainIndex > 0) {
      soundFX.playClick();
      setCurrentDomainIndex(prev => prev - 1);
    }
  }, [currentDomainIndex]);

  // Outage simulation timers are tracked so they can be cancelled (fixes outage leaking into the next module)
  const clearChaosTimers = useCallback(() => {
    chaosTimersRef.current.forEach(id => window.clearTimeout(id));
    chaosTimersRef.current = [];
  }, []);

  const handleTriggerChaos = useCallback(() => {
    clearChaosTimers();
    soundFX.playChaosAlarm();
    setChaosPhase('injected');
    chaosTimersRef.current.push(
      window.setTimeout(() => setChaosPhase('healing'), 2500),
      window.setTimeout(() => {
        setChaosPhase('resolved');
        soundFX.playHealChime();
      }, 5000)
    );
  }, [clearChaosTimers]);

  const handleResetChaos = useCallback(() => {
    clearChaosTimers();
    soundFX.playClick();
    setChaosPhase('idle');
  }, [clearChaosTimers]);

  useEffect(() => clearChaosTimers, [clearChaosTimers]);

  const handleNodeClick = (node: ArchitectureNode, isWellArch: boolean) => {
    setSelectedNode(node);
    setIsWellArchSelected(isWellArch);
  };

  const closeAllModals = useCallback(() => {
    setIsPrompterOpen(false);
    setIs6PillarsOpen(false);
    setIsExecutiveReviewOpen(false);
    setIsStressLabOpen(false);
    setIsPacketSimulatorOpen(false);
    setIsClientSolutionsOpen(false);
    setIsSubtopicLabsOpen(false);
    setIsTheoryOpen(false);
    setIsAdvisorOpen(false);
    setIsAiGovernanceOpen(false);
    setSelectedNode(null);
  }, []);

  // Keyboard navigation when not in presenter mode or modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const anyModalOpen = isPrompterOpen || is6PillarsOpen || isExecutiveReviewOpen || 
        isStressLabOpen || isPacketSimulatorOpen || isClientSolutionsOpen || 
        isSubtopicLabsOpen || isTheoryOpen || isAdvisorOpen || isAiGovernanceOpen || selectedNode !== null;

      if (e.key === 'Escape') {
        if (displayMode === 'presenter') {
          setDisplayMode('studio');
          return;
        }
        if (anyModalOpen) {
          closeAllModals();
          return;
        }
      }

      if (displayMode === 'presenter' || anyModalOpen) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight') {
        handleNextDomain();
      } else if (e.key === 'ArrowLeft') {
        handlePrevDomain();
      } else if (e.key === 'p' || e.key === 'P') {
        soundFX.playClick();
        setDisplayMode('presenter');
      } else if (e.key === 's' || e.key === 'S') {
        soundFX.playClick();
        setIsPrompterOpen(prev => !prev);
      } else if (e.key === 'a' || e.key === 'A') {
        soundFX.playClick();
        setIsAdvisorOpen(prev => !prev);
      } else if (e.key === 'g' || e.key === 'G') {
        soundFX.playClick();
        setIsAiGovernanceOpen(prev => !prev);
      } else if (e.key === 'l' || e.key === 'L') {
        soundFX.playClick();
        setIsPacketSimulatorOpen(prev => !prev);
      } else if (e.key === 'w' || e.key === 'W') {
        soundFX.playClick();
        setIsClientSolutionsOpen(prev => !prev);
      } else if (e.key === 't' || e.key === 'T') {
        soundFX.playClick();
        setIsSubtopicLabsOpen(prev => !prev);
      } else if (e.key === 'k' || e.key === 'K') {
        soundFX.playClick();
        setIsTheoryOpen(prev => !prev);
      } else if (e.key === 'c' || e.key === 'C') {
        if (chaosPhase === 'idle') handleTriggerChaos();
        else handleResetChaos();
      } else if (e.key === 'r' || e.key === 'R') {
        handleResetChaos();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    displayMode, 
    handleNextDomain, 
    handlePrevDomain, 
    handleTriggerChaos, 
    handleResetChaos, 
    chaosPhase, 
    selectedNode,
    isPrompterOpen,
    is6PillarsOpen,
    isExecutiveReviewOpen,
    isStressLabOpen,
    isPacketSimulatorOpen,
    isClientSolutionsOpen,
    isSubtopicLabsOpen,
    isTheoryOpen,
    isAdvisorOpen,
    isAiGovernanceOpen,
    closeAllModals
  ]);

  return (
    <div className="app-container">
      {/* Header with Unified 1-based Module Labeling */}
      <Header
        currentDomainIndex={currentDomainIndex}
        totalDomains={allDomains.length}
        audioEnabled={audioEnabled}
        onToggleAudio={() => {
          const next = !audioEnabled;
          setAudioEnabled(next);
          soundFX.enabled = next;
        }}
        isChaosActive={chaosPhase !== 'idle'}
        onTriggerChaos={handleTriggerChaos}
        onResetChaos={handleResetChaos}
        onTogglePresenter={() => setDisplayMode(displayMode === 'presenter' ? 'studio' : 'presenter')}
        isPresenterMode={displayMode === 'presenter'}
        onOpenScriptPrompter={() => setIsPrompterOpen(true)}
        onOpen6Pillars={() => setIs6PillarsOpen(true)}
        onOpenExecutiveReview={() => setIsExecutiveReviewOpen(true)}
        onOpenStressLab={() => setIsStressLabOpen(true)}
        onOpenPacketSimulator={() => setIsPacketSimulatorOpen(true)}
        onOpenClientSolutions={() => setIsClientSolutionsOpen(true)}
        onOpenSubtopics={() => setIsSubtopicLabsOpen(true)}
        onOpenTheory={() => setIsTheoryOpen(true)}
        onOpenAdvisor={() => setIsAdvisorOpen(true)}
        onOpenAiGovernance={() => setIsAiGovernanceOpen(true)}
      />

      <div className="main-workspace">
        {/* Sidebar with 1-based indexing (1 to 15) */}
        <Sidebar
          domains={allDomains}
          selectedDomainId={activeDomain.id}
          onSelectDomain={handleSelectDomain}
          completedDomainIds={completedDomainIds}
        />

        {/* Main Content Area with bottom padding for minimized dock */}
        <main className="app-content" ref={mainRef} id="main-content">
          {/* Domain Hero - Derived 1-based Module Index (P0 Fix 1.2) */}
          <section className="domain-hero" aria-labelledby="domain-title">
            <div className="hero-meta-row">
              <span className="hero-tag">
                Module {currentDomainIndex + 1} of {allDomains.length} • {activeDomain.category}
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn-action"
                  onClick={() => setIsPrompterOpen(true)}
                  title="View spoken script and jury Q&A [S]"
                >
                  Speaker Script
                </button>
              </div>
            </div>
            <h1 id="domain-title" className="hero-title" tabIndex={-1}>{activeDomain.title}</h1>
            <p className="hero-subtitle">{activeDomain.subtitle}</p>
          </section>

          {/* Active Outage Banner */}
          {chaosPhase !== 'idle' && (
            <ChaosBanner
              scenario={activeDomain.chaos}
              phase={chaosPhase}
              onReset={handleResetChaos}
            />
          )}

          {/* Customer Journey & Requirement Storyline */}
          <CustomerJourneyCard
            customer={activeDomain.customerRequirement}
            normalPrescription={activeDomain.normalPrescription}
            wafSummary={activeDomain.wafTransformationSummary}
            pillars={activeDomain.pillars}
            domainId={activeDomain.id}
          />

          {/* Dual Architecture Stage */}
          <DualArchitectureStage
            naive={activeDomain.naive}
            wellArch={activeDomain.wellArch}
            viewMode={viewMode}
            setViewMode={setViewMode}
            chaosPhase={chaosPhase}
            affectedNodeIds={activeDomain.chaos.affectedNodeIds}
            onSelectNode={handleNodeClick}
          />

          {/* Disaster Recovery Interactive Explorer (Module 14) */}
          {activeDomain.id === 'disaster-recovery' && (
            <Suspense fallback={null}>
              <DRStrategyExplorer />
            </Suspense>
          )}

          {/* Quantitative Metric Delta Grid */}
          <MetricComparisonBar metrics={activeDomain.metrics} />

          {/* Analytics Split: 6-Pillar Radar Scorecard + IaC Inspector */}
          <div className="analytics-split">
            <PillarRadarChart
              naiveScores={activeDomain.naive.scores}
              wellArchScores={activeDomain.wellArch.scores}
            />

            <IaCInspector
              naiveIaC={activeDomain.naive.iacSnippet}
              wellArchIaC={activeDomain.wellArch.iacSnippet}
            />
          </div>

          {/* Clean Executive Attribution Footer (P0/P1 Fix 2.1, 2.2, 3b) */}
          <PresenterFooter />
        </main>
      </div>

      {/* Auto-Pilot Dock (Default Minimized, P1 Fix 1.8) */}
      <AutoPilotBar
        currentDomainIndex={currentDomainIndex}
        totalDomains={allDomains.length}
        onNextDomain={handleNextDomain}
        onPrevDomain={handlePrevDomain}
        onTriggerChaos={handleTriggerChaos}
        onResetChaos={handleResetChaos}
        isChaosActive={chaosPhase !== 'idle'}
        onOpenScriptPrompter={() => setIsPrompterOpen(true)}
        onOpen6Pillars={() => setIs6PillarsOpen(true)}
        onOpenExecutiveReview={() => setIsExecutiveReviewOpen(true)}
        onOpenStressLab={() => setIsStressLabOpen(true)}
        onOpenPacketSimulator={() => setIsPacketSimulatorOpen(true)}
        onOpenClientSolutions={() => setIsClientSolutionsOpen(true)}
        onOpenSubtopics={() => setIsSubtopicLabsOpen(true)}
        onOpenTheory={() => setIsTheoryOpen(true)}
        onOpenAiCopilot={() => setIsAdvisorOpen(true)}
      />

      {/* Lazy Modals Wrapped in Suspense */}
      <Suspense fallback={null}>
        {/* Node Deep Dive Modal */}
        {selectedNode && (
          <NodeDetailModal
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            isWellArchNode={isWellArchSelected}
          />
        )}

        {/* Presenter Mode Deck */}
        {displayMode === 'presenter' && (
          <PresenterOverlay
            domain={activeDomain}
            currentIndex={currentDomainIndex}
            totalDomains={allDomains.length}
            onNext={handleNextDomain}
            onPrev={handlePrevDomain}
            onClose={() => {
              soundFX.playClick();
              setDisplayMode('studio');
            }}
            onTriggerChaos={handleTriggerChaos}
            isChaosActive={chaosPhase !== 'idle'}
            onResetChaos={handleResetChaos}
            onOpenPacketSimulator={() => setIsPacketSimulatorOpen(true)}
            onOpenScriptPrompter={() => setIsPrompterOpen(true)}
            onOpenClientSolutions={() => setIsClientSolutionsOpen(true)}
            onOpenSubtopics={() => setIsSubtopicLabsOpen(true)}
            allDomains={allDomains}
            onSelectIndex={(idx) => setCurrentDomainIndex(idx)}
          />
        )}

        {/* Speaker Script Prompter */}
        {isPrompterOpen && (
          <SpeakerScriptPrompter
            currentDomainIndex={currentDomainIndex}
            totalDomains={allDomains.length}
            onSelectDomainIndex={(idx) => setCurrentDomainIndex(idx)}
            onClose={() => setIsPrompterOpen(false)}
          />
        )}

        {/* 6 Pillars Master Explorer */}
        {is6PillarsOpen && (
          <PillarsExplorerModal
            onClose={() => setIs6PillarsOpen(false)}
            onNavigateToDomain={(domainId) => handleSelectDomain(domainId)}
          />
        )}

        {/* Executive WAF Review & ROI Calculator */}
        {isExecutiveReviewOpen && (
          <ExecutiveReviewModal
            onClose={() => setIsExecutiveReviewOpen(false)}
          />
        )}

        {/* Stress & Incident Simulation Lab */}
        {isStressLabOpen && (
          <StressLabModal
            onClose={() => setIsStressLabOpen(false)}
          />
        )}

        {/* Packet Latency Simulator */}
        {isPacketSimulatorOpen && (
          <PacketLatencySimulator
            onClose={() => setIsPacketSimulatorOpen(false)}
          />
        )}

        {/* Client Workload Solutions Explorer */}
        {isClientSolutionsOpen && (
          <ClientSolutionsExplorer
            onClose={() => setIsClientSolutionsOpen(false)}
          />
        )}

        {/* Subtopic Labs */}
        {isSubtopicLabsOpen && (
          <SubtopicExplorerModal
            onClose={() => setIsSubtopicLabsOpen(false)}
          />
        )}

        {/* Theoretical Foundations Modal */}
        {isTheoryOpen && (
          <TheoreticalFoundationsModal
            onClose={() => setIsTheoryOpen(false)}
            onSelectDomain={(domainId) => handleSelectDomain(domainId)}
          />
        )}

        {/* Guided Architecture Q&A Advisor (P0 Fix 1.3 & 1.4) */}
        {isAdvisorOpen && (
          <GuidedArchitectureQAModal
            activeDomain={activeDomain}
            onClose={() => setIsAdvisorOpen(false)}
            onApplyRemediation={() => {
              soundFX.playHealChime();
              if (chaosPhase !== 'idle') {
                setChaosPhase('resolved');
              }
            }}
            onOpen6PillarsFallback={() => {
              setIsAdvisorOpen(false);
              setIs6PillarsOpen(true);
            }}
          />
        )}

        {/* AI Governance Inspector Modal */}
        {isAiGovernanceOpen && (
          <AiGovernanceModal
            onClose={() => setIsAiGovernanceOpen(false)}
            onOpenCopilot={() => {
              setIsAiGovernanceOpen(false);
              setIsAdvisorOpen(true);
            }}
          />
        )}
      </Suspense>
    </div>
  );
}

export default App;
