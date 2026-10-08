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
import {
  CONTENT_ZOOM_DEFAULT,
  getScrollPercent,
  resolveContentZoom,
  runContentScrollCommand,
} from './utils/contentScrollControl';
import { useDialogFocusTrap } from './hooks/useDialogFocusTrap';
import {
  getStageHostSync,
  getOrGenerateRoomCode,
  RemoteCommand,
} from './services/presentationRemoteSync';
import { StorylineStage } from './types';
import { talkTrackBeats } from './data/talkTrackBeats';
import { TALK_SETTLE_MS } from './data/talkTrackTiming';
import { useScrollReveal } from './hooks/useScrollReveal';
import { readStageTalkIndex, writeStageTalkIndex } from './utils/stageTalkStorage';
type SlideViewMode = 'keynote' | 'dual' | 'theory';
import type { AttackScenario } from './components/DualArchitectureStage';

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

  // Presentation Deck remote sync states
  const [slideMode, setSlideMode] = useState<SlideViewMode>('keynote');
  const [isSlideGridOpen, setIsSlideGridOpen] = useState<boolean>(false);

  // Simulation traffic and attack scenario remote sync states
  const [userLoad, setUserLoad] = useState<number>(2500);
  const [activeAttack, setActiveAttack] = useState<AttackScenario>('none');
  // Main site scroll position and zoom, driven by the phone scroll pad
  const [contentZoom, setContentZoom] = useState<number>(CONTENT_ZOOM_DEFAULT);
  const [contentScrollPercent, setContentScrollPercent] = useState<number>(0);
  
  // Audited requirement 1.19: Sound effects default to muted
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [chaosPhase, setChaosPhase] = useState<ChaosPhase>('idle');
  const [completedDomainIds, setCompletedDomainIds] = useState<string[]>(['overview-thesis']);
  
  // Interactive node inspection modal state
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(null);
  const [isWellArchSelected, setIsWellArchSelected] = useState<boolean>(true);

  // Presentation & Framework Modals
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

  // Modal sub-states for live interactive remote control from paired phone
  const [modalPillarId, setModalPillarId] = useState<string>('Operational Excellence');
  const [modalSubtopicId, setModalSubtopicId] = useState<string>('rds-proxy');
  const [modalSubtopicSimTrigger, setModalSubtopicSimTrigger] = useState<number>(0);
  const [modalWorkloadId, setModalWorkloadId] = useState<string>('ecommerce-cart');
  const [modalWorkloadSimTrigger, setModalWorkloadSimTrigger] = useState<number>(0);
  const [modalIncidentId, setModalIncidentId] = useState<string>('traffic_spike');
  const [modalIncidentSimTrigger, setModalIncidentSimTrigger] = useState<number>(0);
  const [modalExecTier, setModalExecTier] = useState<string>('startup');
  const [modalTheoryDomainId, setModalTheoryDomainId] = useState<string>('overview-thesis');
  const [modalLatencySimTrigger, setModalLatencySimTrigger] = useState<number>(0);
  const [modalLatencyBurstTrigger, setModalLatencyBurstTrigger] = useState<number>(0);

  // Storyline stage — controlled from remote (CustomerJourneyCard tabs)
  const [activeStorylineStage, setActiveStorylineStage] = useState<StorylineStage>('requirement');

  // Remote presenter sync (stage host)
  const [roomCode] = useState(() => getOrGenerateRoomCode());
  const [remoteSync] = useState(() => getStageHostSync(roomCode));
  const [isStageOnline, setIsStageOnline] = useState(false);
  const [remoteDeviceCount, setRemoteDeviceCount] = useState(0);

  // HUD toast shown on stage when a phone sends a command
  const [hudSpeakerName, setHudSpeakerName] = useState<string | null>(null);
  const [hudActionNotice, setHudActionNotice] = useState<string | null>(null);
  const [, setHudVisible] = useState(false);
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

  // Incoming remote commands from phones. The subscription is made once and calls whichever handler
  // is current, so a command never runs against the module or view captured when it was subscribed.
  const remoteCommandHandlerRef = useRef<(cmd: RemoteCommand) => void>(() => {});
  useEffect(() => remoteSync.onCommand((cmd) => remoteCommandHandlerRef.current(cmd)), [remoteSync]);

  useEffect(() => {
    remoteCommandHandlerRef.current = (cmd) => {
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
        case 'SET_SLIDE_MODE':
          if (cmd.slideMode) {
            setSlideMode(cmd.slideMode);
            const slideModeLabels = { keynote: 'Architecture Slide', dual: 'Speaker Notes', theory: 'Theoretical Proof' };
            showHudToast(spk, `Slide: ${slideModeLabels[cmd.slideMode] || cmd.slideMode}`);
          }
          break;
        case 'RUN_SLIDE_SIM':
          showHudToast(spk, 'Triggered Live Traffic Pulse on Slide');
          break;
        case 'TOGGLE_SLIDE_GRID':
          setIsSlideGridOpen(prev => !prev);
          showHudToast(spk, 'Toggled Slide Overview Grid');
          break;
        case 'SET_TRAFFIC':
          if (cmd.trafficLoad !== undefined) {
            setUserLoad(cmd.trafficLoad);
            showHudToast(spk, `Traffic: ${(cmd.trafficLoad / 1000).toFixed(0)}k req/s`);
          }
          break;
        case 'TRIGGER_ATTACK':
          if (cmd.attackScenario) {
            setActiveAttack(cmd.attackScenario as AttackScenario);
            const attackLabels: Record<string, string> = {
              none: 'Nominal Traffic',
              'az-outage': 'AZ-1 Outage Disaster',
              ransomware: 'Ransomware Attack',
              ddos: 'DDoS Traffic Flood',
              'bill-shock': 'Bill Shock Surge'
            };
            showHudToast(spk, `Attack: ${attackLabels[cmd.attackScenario] || cmd.label || cmd.attackScenario}`);
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
        case 'SCROLL_BY':
        case 'SCROLL_PAGE':
        case 'SCROLL_EDGE':
        case 'SCROLL_SECTION_STEP': {
          const label = mainRef.current ? runContentScrollCommand(cmd, mainRef.current) : null;
          if (label) showHudToast(spk, label);
          break;
        }
        case 'ZOOM_CONTENT': {
          const nextZoom = resolveContentZoom(cmd, contentZoom);
          setContentZoom(nextZoom);
          if (!cmd.isContinuous) showHudToast(spk, `Content zoom ${nextZoom}%`);
          break;
        }
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
            const searchPool = Array.from(document.querySelectorAll('[data-node-id], .metric-card, .journey-stage-step, .pillar-card, .pillar-mini-badge, .badge'));
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
        case 'SET_PACKET_FLOW':
          setPacketFlowOn(cmd.packetFlow !== false);
          break;
        case 'TALK_SET_LINE':
          applyTalkLine(cmd.index ?? talkIndexRef.current);
          break;
        case 'TALK_STEP':
          // Relative to the stage's own line, so a phone that is a line behind cannot move the talk backwards
          applyTalkLine(talkIndexRef.current + (cmd.index ?? 1));
          break;
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
            script:          () => showHudToast(spk, 'Presenter Script is active on phone'),
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
        case 'INSPECT_NODE': {
          if (cmd.targetId) {
            closeAllModals();
            const wellNode = activeDomain.wellArch.nodes.find(n => n.id === cmd.targetId);
            if (wellNode) {
              setSelectedNode(wellNode);
              setIsWellArchSelected(cmd.isWellArch !== false);
              showHudToast(spk, `Inspecting ${wellNode.name}`);
              break;
            }
            const naiveNode = activeDomain.naive.nodes.find(n => n.id === cmd.targetId);
            if (naiveNode) {
              setSelectedNode(naiveNode);
              setIsWellArchSelected(false);
              showHudToast(spk, `Inspecting ${naiveNode.name}`);
              break;
            }
          }
          break;
        }
        case 'TOGGLE_AUDIO': {
          setAudioEnabled(prev => {
            const next = !prev;
            soundFX.enabled = next;
            showHudToast(spk, next ? 'Audio FX Enabled 🔊' : 'Audio FX Muted 🔇');
            return next;
          });
          break;
        }
        case 'INTERACT_MODAL': {
          const action = cmd.modalAction;
          const payload = cmd.modalPayload;
          if (action === 'SET_PILLAR' && payload?.pillarId) {
            setModalPillarId(payload.pillarId);
            showHudToast(spk, `Pillar: ${payload.pillarId}`);
          } else if (action === 'NAVIGATE_TO_DOMAIN' && payload?.domainId) {
            handleSelectDomain(payload.domainId);
            closeAllModals();
            showHudToast(spk, `Domain: ${payload.domainId}`);
          } else if (action === 'SET_SUBTOPIC' && payload?.subtopicId) {
            setModalSubtopicId(payload.subtopicId);
            showHudToast(spk, `Lab: ${payload.subtopicId}`);
          } else if (action === 'RUN_SUBTOPIC_SIM') {
            setModalSubtopicSimTrigger(prev => prev + 1);
            showHudToast(spk, `Running Lab Simulation`);
          } else if (action === 'SET_WORKLOAD' && payload?.workloadId) {
            setModalWorkloadId(payload.workloadId);
            showHudToast(spk, `Workload: ${payload.workloadId}`);
          } else if (action === 'RUN_WORKLOAD_SIM') {
            setModalWorkloadSimTrigger(prev => prev + 1);
            showHudToast(spk, `Running Workload Flow`);
          } else if (action === 'SET_INCIDENT' && payload?.incidentId) {
            setModalIncidentId(payload.incidentId);
            showHudToast(spk, `Incident: ${payload.incidentId}`);
          } else if (action === 'TRIGGER_INCIDENT_SIM') {
            setModalIncidentSimTrigger(prev => prev + 1);
            showHudToast(spk, `Running Incident Stress`);
          } else if (action === 'SET_TIER' && payload?.tier) {
            setModalExecTier(payload.tier);
            showHudToast(spk, `Tier: ${payload.tier}`);
          } else if (action === 'SET_THEORY' && payload?.domainId) {
            setModalTheoryDomainId(payload.domainId);
            showHudToast(spk, `Theory: ${payload.domainId}`);
          } else if (action === 'START_PACKET_RACE') {
            setModalLatencySimTrigger(prev => prev + 1);
            showHudToast(spk, `Packet Flight Launched!`);
          } else if (action === 'BURST_TEST') {
            setModalLatencyBurstTrigger(prev => prev + 1);
            showHudToast(spk, `50-Packet Burst Stress!`);
          }
          break;
        }
      }
    };
  }, [remoteSync, currentDomainIndex, activeDomain, contentZoom, handleTriggerChaos, handleResetChaos, closeAllModals, showHudToast]);

  // Talk track. The stage owns the current line, so laptop keys and phones always show the same line.
  const [talkIndex, setTalkIndex] = useState<number>(() => readStageTalkIndex(talkTrackBeats.length));
  const [packetFlowOn, setPacketFlowOn] = useState<boolean>(true);
  const talkIndexRef = useRef<number>(talkIndex);
  const talkSettleUntilRef = useRef<number>(0);
  const stageDomainRef = useRef<number>(currentDomainIndex);
  stageDomainRef.current = currentDomainIndex;

  const applyTalkLine = useCallback((requestedIndex: number) => {
    // A module change needs time to settle; a press during that window is ignored, not queued.
    if (Date.now() < talkSettleUntilRef.current) return;
    const index = Math.min(Math.max(requestedIndex, -1), talkTrackBeats.length - 1);
    talkIndexRef.current = index;
    setTalkIndex(index);
    writeStageTalkIndex(index);
    if (index < 0) return;

    const beat = talkTrackBeats[index];
    const playCues = () => {
      beat.cues.forEach((cue) => {
        remoteCommandHandlerRef.current({ ...cue, speakerName: 'Talk track', timestamp: Date.now() });
      });
    };
    if (beat.domainIndex === stageDomainRef.current) {
      playCues();
      return;
    }
    talkSettleUntilRef.current = Date.now() + TALK_SETTLE_MS;
    setCurrentDomainIndex(beat.domainIndex);
    window.setTimeout(playCues, TALK_SETTLE_MS);
  }, []);

  // A reloaded laptop tab resumes the line it was on, and replays that line's screen once the page has settled
  useEffect(() => {
    const resumeIndex = talkIndexRef.current;
    if (resumeIndex < 0) return;
    const timer = window.setTimeout(() => applyTalkLine(resumeIndex), TALK_SETTLE_MS * 2);
    return () => window.clearTimeout(timer);
  }, [applyTalkLine]);

  // Cards reveal as they scroll in; re-scan when the module changes
  useScrollReveal(mainRef, currentDomainIndex);

  // Laptop keys: Space or Page Down for the next line, B or Page Up for the line before.
  useEffect(() => {
    const handleTalkKey = (event: KeyboardEvent) => {
      if (event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) return;
      // The presentation deck is itself a dialog, so only other dialogs block the keys
      if (document.querySelector('[aria-modal="true"]:not(.presenter-overlay)')) return;
      const key = event.key.toLowerCase();
      const step = key === ' ' || key === 'pagedown' || key === 'n' ? 1 : key === 'pageup' || key === 'b' ? -1 : 0;
      if (step === 0) return;
      event.preventDefault();
      if (target instanceof HTMLElement) target.blur();
      applyTalkLine(talkIndexRef.current + step);
    };
    window.addEventListener('keydown', handleTalkKey);
    return () => window.removeEventListener('keydown', handleTalkKey);
  }, [applyTalkLine]);

  // Track the main scroll container so phones can show how far through the page the stage is
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    let frame: number | null = null;
    const syncPercent = () => {
      frame = null;
      setContentScrollPercent(getScrollPercent(main));
    };
    const handleScroll = () => {
      if (frame === null) frame = requestAnimationFrame(syncPercent);
    };
    main.addEventListener('scroll', handleScroll, { passive: true });
    syncPercent();
    return () => {
      main.removeEventListener('scroll', handleScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  // Listen to connection state changes
  useEffect(() => {
    const unsub = remoteSync.onConnectionStatus((connected, count) => {
      setIsStageOnline(connected);
      setRemoteDeviceCount(count);
    });
    return unsub;
  }, [remoteSync]);

  // Broadcast current stage state to connected phones on every relevant state change
  useEffect(() => {
    const anyModalOpen =
      selectedNode ? 'node' :
      is6PillarsOpen ? '6pillars' :
      isExecutiveReviewOpen ? 'executive' :
      isStressLabOpen ? 'stresslab' :
      isPacketSimulatorOpen ? 'latency' :
      isClientSolutionsOpen ? 'workloads' :
      isSubtopicLabsOpen ? 'subtopics' :
      isTheoryOpen ? 'theory' :
      isAdvisorOpen ? 'advisor' :
      isAiGovernanceOpen ? 'governance' :
      isPairingModalOpen ? 'pairing' :
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
      slideMode,
      isSlideGridOpen,
      trafficLoad: userLoad,
      activeAttack,
      storylineStage: activeStorylineStage,
      activeModal: anyModalOpen,
      modalSubState: {
        pillarId: modalPillarId,
        subtopicId: modalSubtopicId,
        workloadId: modalWorkloadId,
        incidentId: modalIncidentId,
        tier: modalExecTier,
        theoryDomainId: modalTheoryDomainId,
      },
      audioEnabled,
      selectedNodeId: selectedNode?.id ?? null,
      selectedNodeName: selectedNode?.name ?? null,
      elapsedSeconds: 0,
      connectedDevicesCount: remoteDeviceCount,
      spotlightTarget: null,
      latestSpeakerName: hudSpeakerName,
      latestActionNotice: hudActionNotice,
      contentScrollPercent,
      contentZoom,
      talkIndex,
    });
  }, [
    remoteSync, currentDomainIndex, viewMode, chaosPhase, displayMode,
    slideMode, isSlideGridOpen, userLoad, activeAttack, activeStorylineStage,
    remoteDeviceCount, hudSpeakerName, hudActionNotice, audioEnabled,
    contentScrollPercent, contentZoom, talkIndex,
    selectedNode,
    modalPillarId, modalSubtopicId, modalWorkloadId, modalIncidentId, modalExecTier, modalTheoryDomainId,
    is6PillarsOpen, isExecutiveReviewOpen, isStressLabOpen,
    isPacketSimulatorOpen, isClientSolutionsOpen, isSubtopicLabsOpen,
    isTheoryOpen, isAdvisorOpen, isAiGovernanceOpen, isPairingModalOpen,
  ]);

  // Keyboard navigation when not in presenter mode or modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const anyModalOpen = is6PillarsOpen || isExecutiveReviewOpen || 
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
        setIsPairingModalOpen(prev => !prev);
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
        <div className="stage-ambient" aria-hidden="true" />
      <main className="app-content" ref={mainRef} id="main-content" style={{ zoom: contentZoom / 100 }}>
          <div id="section-hero" />
          {/* Domain Hero - Derived 1-based Module Index (P0 Fix 1.2) */}
          <section className="domain-hero" aria-labelledby="domain-title">
            <div className="hero-meta-row">
              <span className="hero-tag" style={{ fontVariantNumeric: 'tabular-nums' }}>
                Module {currentDomainIndex + 1} of {allDomains.length} • {activeDomain.category}
              </span>

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
          <div id="section-storyline" />
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
          <div id="section-comparison" />
          <div id="section-sandbox" />
          <div id="section-topology" />
          <DualArchitectureStage
            naive={activeDomain.naive}
            wellArch={activeDomain.wellArch}
            viewMode={viewMode}
            setViewMode={setViewMode}
            chaosPhase={chaosPhase}
            affectedNodeIds={activeDomain.chaos.affectedNodeIds}
            onSelectNode={handleNodeClick}
            externalUserLoad={userLoad}
            onUserLoadChange={setUserLoad}
            externalAttack={activeAttack}
            onAttackChange={setActiveAttack}
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
          <div id="section-pillars" />
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
          <div id="section-footer" />
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
          <div className="diagram-screen" aria-label={`Simulation diagram: ${activeDomain.title}`}>
            <DualArchitectureStage
              diagramOnly
              packetFlowOn={packetFlowOn}
              naive={activeDomain.naive}
              wellArch={activeDomain.wellArch}
              viewMode={viewMode}
              setViewMode={setViewMode}
              chaosPhase={chaosPhase}
              affectedNodeIds={activeDomain.chaos.affectedNodeIds}
              onSelectNode={() => { /* the big screen never opens panels */ }}
              externalUserLoad={userLoad}
              onUserLoadChange={setUserLoad}
              externalAttack={activeAttack}
              onAttackChange={setActiveAttack}
            />
          </div>
        )}


        {/* 6 Pillars Master Explorer */}
        {is6PillarsOpen && (
          <PillarsExplorerModal
            selectedPillarId={modalPillarId}
            onSelectPillarId={setModalPillarId}
            onClose={() => setIs6PillarsOpen(false)}
            onNavigateToDomain={(domainId) => handleSelectDomain(domainId)}
          />
        )}

        {/* Executive WAF Review & ROI Calculator */}
        {isExecutiveReviewOpen && (
          <ExecutiveReviewModal
            selectedTier={modalExecTier as any}
            onSelectTier={(tier) => setModalExecTier(tier)}
            onClose={() => setIsExecutiveReviewOpen(false)}
          />
        )}

        {/* Stress & Incident Simulation Lab */}
        {isStressLabOpen && (
          <StressLabModal
            selectedIncident={modalIncidentId as any}
            onSelectIncident={(type) => setModalIncidentId(type)}
            simTrigger={modalIncidentSimTrigger}
            onClose={() => setIsStressLabOpen(false)}
          />
        )}

        {/* Packet Latency Simulator */}
        {isPacketSimulatorOpen && (
          <PacketLatencySimulator
            raceTrigger={modalLatencySimTrigger}
            burstTrigger={modalLatencyBurstTrigger}
            onClose={() => setIsPacketSimulatorOpen(false)}
          />
        )}

        {/* Client Workload Solutions Explorer */}
        {isClientSolutionsOpen && (
          <ClientSolutionsExplorer
            selectedWorkloadId={modalWorkloadId}
            onSelectWorkloadId={setModalWorkloadId}
            simTrigger={modalWorkloadSimTrigger}
            onClose={() => setIsClientSolutionsOpen(false)}
          />
        )}

        {/* Subtopic Labs */}
        {isSubtopicLabsOpen && (
          <SubtopicExplorerModal
            activeSubtopic={modalSubtopicId as any}
            onSelectSubtopic={(id) => setModalSubtopicId(id)}
            simTrigger={modalSubtopicSimTrigger}
            onClose={() => setIsSubtopicLabsOpen(false)}
          />
        )}

        {/* Theoretical Foundations Modal */}
        {isTheoryOpen && (
          <TheoreticalFoundationsModal
            selectedDomainId={modalTheoryDomainId}
            onSelectDomainId={setModalTheoryDomainId}
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
            isStageOnline={isStageOnline}
            latestSpeakerName={hudSpeakerName}
            onClose={() => setIsPairingModalOpen(false)}
          />
        )}
      </Suspense>

      {/* Stage HUD toast — shows when phone sends a command */}

    </div>
  );
}

export default App;
