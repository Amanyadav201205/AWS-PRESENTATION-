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
import { RemoteStatusBadge } from './components/RemoteStatusBadge';
import { soundFX } from './utils/soundEffects';
import { useDialogFocusTrap } from './hooks/useDialogFocusTrap';
import {
  StageHostSync,
  getOrGenerateRoomCode,
} from './services/presentationRemoteSync';
import { StorylineStage } from './types';
import { StageRemoteHUDToast } from './components/StageRemoteHUDToast';

// Lazy-load controller and presenter overlay — phone controller uses SpeakerCompanionRemote
const SpeakerCompanionRemote = lazy(() => import('./components/SpeakerCompanionRemote').then(m => ({ default: m.SpeakerCompanionRemote })));

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
const RemotePairingModal = lazy(() => import('./components/RemotePairingModal').then(m => ({ default: m.RemotePairingModal })));

export function App() {
  // Detect remote presenter companion mode from URL: ?mode=remote or ?mode=controller or ?remote=WAF-XXXX
  const urlParams = new URLSearchParams(window.location.search);
  const urlMode = urlParams.get('mode');
  const urlRoom = urlParams.get('room');
  const urlSpeaker = urlParams.get('speaker') as 'devarsh' | 'aman' | null;
  const isRemoteView = urlMode === 'remote' || urlMode === 'controller' || urlParams.has('remote');

  if (isRemoteView) {
    const effectiveRoom = (urlRoom || urlParams.get('remote') || getOrGenerateRoomCode()).toUpperCase();
    return (
      <Suspense fallback={<div style={{ background: '#000', minHeight: '100dvh' }} />}>
        <SpeakerCompanionRemote
          initialRoomCode={effectiveRoom}
          initialSpeaker={urlSpeaker ?? 'devarsh'}
          onExitRemote={() => {
            window.location.href = window.location.pathname;
          }}
        />
      </Suspense>
    );
  }

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
  const [isPairingModalOpen, setIsPairingModalOpen] = useState<boolean>(false);

  // Storyline stage — controlled from remote (CustomerJourneyCard tabs)
  const [activeStorylineStage, setActiveStorylineStage] = useState<StorylineStage>('requirement');

  // Remote presenter sync (stage host)
  const [roomCode] = useState(() => getOrGenerateRoomCode());
  const [remoteSync] = useState(() => new StageHostSync(roomCode));
  const [remoteConnected, setRemoteConnected] = useState(false);
  const [remoteDeviceCount, setRemoteDeviceCount] = useState(0);

  // HUD toast shown on stage when a phone sends a command
  const [hudSpeakerName, setHudSpeakerName] = useState<string | null>(null);
  const [hudActionNotice, setHudActionNotice] = useState<string | null>(null);
  const [hudVisible, setHudVisible] = useState(false);
  const hudTimerRef = useRef<number | null>(null);

  const showHudToast = useCallback((speaker: string | undefined, action: string) => {
    if (hudTimerRef.current) window.clearTimeout(hudTimerRef.current);
    setHudSpeakerName(speaker ?? null);
    setHudActionNotice(action);
    setHudVisible(true);
    hudTimerRef.current = window.setTimeout(() => setHudVisible(false), 2800);
  }, []);

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
    setIsPairingModalOpen(false);
    setSelectedNode(null);
  }, []);

  // Incoming remote commands from phones
  useEffect(() => {
    const unsub = remoteSync.onCommand((cmd) => {
      const spk = cmd.speakerName;
      switch (cmd.type) {
        case 'NEXT_MODULE':
          if (currentDomainIndex < allDomains.length - 1) {
            soundFX.playClick();
            setCurrentDomainIndex(prev => prev + 1);
            showHudToast(spk, 'Advanced to next module');
          }
          break;
        case 'PREV_MODULE':
          if (currentDomainIndex > 0) {
            soundFX.playClick();
            setCurrentDomainIndex(prev => prev - 1);
            showHudToast(spk, 'Navigated to previous module');
          }
          break;
        case 'GOTO_MODULE':
          if (cmd.index !== undefined && cmd.index >= 0 && cmd.index < allDomains.length) {
            soundFX.playClick();
            setCurrentDomainIndex(cmd.index);
            showHudToast(spk, `Jumped to Module ${cmd.index + 1}`);
          }
          break;
        case 'TRIGGER_CHAOS':
          handleTriggerChaos();
          showHudToast(spk, 'Chaos Outage Injected');
          break;
        case 'RESET_CHAOS':
          handleResetChaos();
          showHudToast(spk, 'Outage Healed & Nominal');
          break;
        case 'ENTER_PRESENTER_MODE':
          soundFX.playClick();
          setDisplayMode('presenter');
          showHudToast(spk, 'Entered Presenter Mode');
          break;
        case 'EXIT_PRESENTER_MODE':
          soundFX.playClick();
          setDisplayMode('studio');
          showHudToast(spk, 'Returned to Studio');
          break;
        case 'SET_VIEW_MODE':
          if (cmd.mode) {
            setViewMode(cmd.mode);
            const label = cmd.mode === 'split' ? 'Split View' : cmd.mode === 'well-arch-only' ? 'WAF Only' : 'Naive Only';
            showHudToast(spk, `View: ${label}`);
          }
          break;
        case 'SET_STORYLINE_STAGE':
          if (cmd.storylineStage) {
            setActiveStorylineStage(cmd.storylineStage);
            const stageLabels = { requirement: 'Customer Requirement', prescription: 'Normal Prescription', 'waf-solution': 'WAF Solution', theory: 'Theory' };
            showHudToast(spk, `Storyline: ${stageLabels[cmd.storylineStage]}`);
          }
          break;
        case 'SCROLL_TO':
          if (cmd.target === 'top') {
            mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            showHudToast(spk, 'Scrolled to top of slide');
          } else if (cmd.target) {
            const targetElementId = `section-${cmd.target}`;
            const el = document.getElementById(targetElementId);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              // Trigger a temporary laser spotlight glow on the container
              const container = (el.nextElementSibling || el) as HTMLElement;
              container.classList.add('stage-spotlight-active');
              window.setTimeout(() => container.classList.remove('stage-spotlight-active'), 3200);
            }
            showHudToast(spk, `Focused on ${cmd.target.toUpperCase()}`);
          }
          break;
        case 'SPOTLIGHT': {
          if (cmd.label) showHudToast(spk, `Laser Spotlight: ${cmd.label}`);
          // Clear any active spotlights
          document.querySelectorAll('.stage-spotlight-active').forEach(node => {
            node.classList.remove('stage-spotlight-active');
          });
          let targetEl: HTMLElement | null = null;
          if (cmd.targetId) {
            targetEl = document.getElementById(cmd.targetId) ||
                       document.querySelector(`[data-node-id="${cmd.targetId}"]`) ||
                       document.querySelector(`[data-testid="${cmd.targetId}"]`);
          }
          if (!targetEl && cmd.label) {
            const searchPool = Array.from(document.querySelectorAll('.arch-node, .node-card, .metric-card, .journey-stage-step, .pillar-card, .pillar-mini-badge, .badge'));
            targetEl = (searchPool.find(el => el.textContent?.toLowerCase().includes(cmd.label!.toLowerCase())) as HTMLElement) || null;
          }
          if (targetEl) {
            targetEl.classList.add('stage-spotlight-active');
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            window.setTimeout(() => {
              targetEl?.classList.remove('stage-spotlight-active');
            }, 4500);
          }
          break;
        }
        case 'IDENTIFY_SPEAKER':
          if (cmd.speakerName) showHudToast(cmd.speakerName, 'is presenting');
          break;
        case 'CLOSE_MODALS':
          closeAllModals();
          showHudToast(spk, 'Closed all modals');
          break;
        case 'OPEN_MODAL': {
          closeAllModals();
          // Accept both short keys and legacy keys from SpeakerCompanionRemote
          const modalMap: Record<string, () => void> = {
            script:          () => setIsPrompterOpen(true),
            '6pillars':      () => setIs6PillarsOpen(true),
            executive:       () => setIsExecutiveReviewOpen(true),
            stresslab:       () => setIsStressLabOpen(true),
            stressLab:       () => setIsStressLabOpen(true),
            latency:         () => setIsPacketSimulatorOpen(true),
            packetSimulator: () => setIsPacketSimulatorOpen(true),
            workloads:       () => setIsClientSolutionsOpen(true),
            subtopics:       () => setIsSubtopicLabsOpen(true),
            subtopicLabs:    () => setIsSubtopicLabsOpen(true),
            theory:          () => setIsTheoryOpen(true),
            advisor:         () => setIsAdvisorOpen(true),
            aiAdvisor:       () => setIsAdvisorOpen(true),
            governance:      () => setIsAiGovernanceOpen(true),
          };
          const open = cmd.modal ? modalMap[cmd.modal] : undefined;
          open?.();
          if (cmd.label || cmd.modal) showHudToast(spk, `Opened ${cmd.label || cmd.modal}`);
          break;
        }
      }
    });
    return unsub;
  }, [remoteSync, currentDomainIndex, handleTriggerChaos, handleResetChaos, closeAllModals, showHudToast]);

  // Listen to connection state changes
  useEffect(() => {
    const unsub = remoteSync.onConnectionStatus((connected, count) => {
      setRemoteConnected(connected);
      setRemoteDeviceCount(count);
    });
    return unsub;
  }, [remoteSync]);

  // Broadcast current stage state to connected phones on every relevant state change
  useEffect(() => {
    const anyModalOpen =
      isPrompterOpen ? 'script' :
      is6PillarsOpen ? '6pillars' :
      isExecutiveReviewOpen ? 'executive' :
      isStressLabOpen ? 'stresslab' :
      isPacketSimulatorOpen ? 'latency' :
      isClientSolutionsOpen ? 'workloads' :
      isSubtopicLabsOpen ? 'subtopics' :
      isTheoryOpen ? 'theory' :
      isAdvisorOpen ? 'advisor' :
      isAiGovernanceOpen ? 'governance' :
      null;

    remoteSync.broadcastState({
      currentDomainIndex,
      currentDomainId: allDomains[currentDomainIndex]?.id ?? '',
      domainTitle: allDomains[currentDomainIndex]?.title ?? '',
      domainCategory: allDomains[currentDomainIndex]?.category ?? '',
      viewMode,
      chaosPhase,
      isChaosActive: chaosPhase !== 'idle',
      displayMode,
      activeModal: anyModalOpen,
      elapsedSeconds: 0,
      connectedDevicesCount: remoteDeviceCount,
      spotlightTarget: null,
      latestSpeakerName: null,
      latestActionNotice: null,
    });
  }, [
    remoteSync, currentDomainIndex, viewMode, chaosPhase, displayMode,
    remoteDeviceCount,
    isPrompterOpen, is6PillarsOpen, isExecutiveReviewOpen, isStressLabOpen,
    isPacketSimulatorOpen, isClientSolutionsOpen, isSubtopicLabsOpen,
    isTheoryOpen, isAdvisorOpen, isAiGovernanceOpen, isPairingModalOpen,
  ]);

  // Keyboard navigation when not in presenter mode or modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const anyModalOpen = isPrompterOpen || is6PillarsOpen || isExecutiveReviewOpen || 
        isStressLabOpen || isPacketSimulatorOpen || isClientSolutionsOpen || 
        isSubtopicLabsOpen || isTheoryOpen || isAdvisorOpen || isAiGovernanceOpen || 
        isPairingModalOpen || selectedNode !== null;

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
      } else if (e.key === 'm' || e.key === 'M') {
        soundFX.playClick();
        setIsPairingModalOpen(prev => !prev);
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
    isPairingModalOpen,
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
        onOpenPairingModal={() => setIsPairingModalOpen(true)}
        connectedRemotesCount={remoteDeviceCount}
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
              <span className="hero-tag" style={{ fontVariantNumeric: 'tabular-nums' }}>
                Module {currentDomainIndex + 1} of {allDomains.length} • {activeDomain.category}
              </span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <RemoteStatusBadge
                  roomCode={roomCode}
                  connectedCount={remoteDeviceCount}
                  isConnected={remoteConnected}
                  onOpenModal={() => setIsPairingModalOpen(true)}
                />
                <button
                  className="btn-action"
                  onClick={() => setIsPrompterOpen(true)}
                  title="View spoken script and jury Q&A [S]"
                  style={{ borderRadius: 'var(--radius-pill)', boxShadow: 'inset 0 1px 0 var(--hairline-top)' }}
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
          <div id="section-journey" />
          <CustomerJourneyCard
            customer={activeDomain.customerRequirement}
            normalPrescription={activeDomain.normalPrescription}
            wafSummary={activeDomain.wafTransformationSummary}
            pillars={activeDomain.pillars}
            domainId={activeDomain.id}
            activeStage={activeStorylineStage}
            onStageChange={setActiveStorylineStage}
          />

          {/* Dual Architecture Stage */}
          <div id="section-topology" />
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
          <div id="section-metrics" />
          <MetricComparisonBar metrics={activeDomain.metrics} />

          {/* Analytics Split: 6-Pillar Radar Scorecard + IaC Inspector */}
          <div id="section-radar" />
          <div className="analytics-split">
            <PillarRadarChart
              naiveScores={activeDomain.naive.scores}
              wellArchScores={activeDomain.wellArch.scores}
            />

            <div id="section-iac" style={{ display: 'contents' }}>
              <IaCInspector
                naiveIaC={activeDomain.naive.iacSnippet}
                wellArchIaC={activeDomain.wellArch.iacSnippet}
              />
            </div>
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
        onOpenPairingModal={() => setIsPairingModalOpen(true)}
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

        {/* Dual-Phone Presenter Pairing Modal */}
        {isPairingModalOpen && (
          <RemotePairingModal
            roomCode={roomCode}
            connectedCount={remoteDeviceCount}
            latestSpeakerName={hudSpeakerName}
            onClose={() => setIsPairingModalOpen(false)}
          />
        )}
      </Suspense>

      {/* Stage HUD toast — shows when phone sends a command */}
      <StageRemoteHUDToast
        speakerName={hudSpeakerName}
        actionNotice={hudActionNotice}
        isVisible={hudVisible}
      />
    </div>
  );
}

export default App;
