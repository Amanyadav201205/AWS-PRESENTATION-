import React, { useState, useEffect, useCallback } from 'react';
import { allDomains } from './data';
import { AppDisplayMode, ArchitectureNode, ChaosPhase, PillarType, ViewMode } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CustomerJourneyCard } from './components/CustomerJourneyCard';
import { DualArchitectureStage } from './components/DualArchitectureStage';
import { MetricComparisonBar } from './components/MetricComparisonBar';
import { PillarRadarChart } from './components/PillarRadarChart';
import { IaCInspector } from './components/IaCInspector';
import { ChaosBanner } from './components/ChaosBanner';
import { PresenterOverlay } from './components/PresenterOverlay';
import { DRStrategyExplorer } from './components/DRStrategyExplorer';
import { NodeDetailModal } from './components/NodeDetailModal';
import { AutoPilotBar } from './components/AutoPilotBar';
import { SpeakerScriptPrompter } from './components/SpeakerScriptPrompter';
import { PillarsExplorerModal } from './components/PillarsExplorerModal';
import { ExecutiveReviewModal } from './components/ExecutiveReviewModal';
import { StressLabModal } from './components/StressLabModal';
import { PacketLatencySimulator } from './components/PacketLatencySimulator';
import { ClientSolutionsExplorer } from './components/ClientSolutionsExplorer';
import { SubtopicExplorerModal } from './components/SubtopicExplorerModal';
import { TheoreticalFoundationsModal } from './components/TheoreticalFoundationsModal';
import { PresenterFooter } from './components/PresenterFooter';
import { AiArchitectCopilotModal } from './components/AiArchitectCopilotModal';
import { AiGovernanceModal } from './components/AiGovernanceModal';
import { WafRemediationAction } from './data/wafKnowledgeBase';
import { soundFX } from './utils/soundEffects';

export function App() {
  const [currentDomainIndex, setCurrentDomainIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [displayMode, setDisplayMode] = useState<AppDisplayMode>('studio');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [chaosPhase, setChaosPhase] = useState<ChaosPhase>('idle');
  const [completedDomainIds, setCompletedDomainIds] = useState<string[]>(['overview-thesis']);
  
  // Interactive node inspection modal state
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(null);
  const [isWellArchSelected, setIsWellArchSelected] = useState<boolean>(true);

  // New Presentation & Framework Modals
  const [isPrompterOpen, setIsPrompterOpen] = useState<boolean>(false);
  const [is6PillarsOpen, setIs6PillarsOpen] = useState<boolean>(false);
  const [isExecutiveReviewOpen, setIsExecutiveReviewOpen] = useState<boolean>(false);
  const [isStressLabOpen, setIsStressLabOpen] = useState<boolean>(false);
  const [isPacketSimulatorOpen, setIsPacketSimulatorOpen] = useState<boolean>(false);
  const [isClientSolutionsOpen, setIsClientSolutionsOpen] = useState<boolean>(false);
  const [isSubtopicLabsOpen, setIsSubtopicLabsOpen] = useState<boolean>(false);
  const [isTheoryOpen, setIsTheoryOpen] = useState<boolean>(false);
  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState<boolean>(false);
  const [isAiGovernanceOpen, setIsAiGovernanceOpen] = useState<boolean>(false);

  // Active domain definition
  const activeDomain = allDomains[currentDomainIndex];

  // Theme synchronization with body element
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('theme-light');
    } else {
      document.body.classList.add('theme-light');
    }
  }, [isDarkMode]);

  // Mark current domain as visited & reset node/chaos
  useEffect(() => {
    if (!completedDomainIds.includes(activeDomain.id)) {
      setCompletedDomainIds(prev => [...prev, activeDomain.id]);
    }
    setChaosPhase('idle');
    setSelectedNode(null);
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

  const handleTriggerChaos = useCallback(() => {
    soundFX.playChaosAlarm();
    setChaosPhase('injected');

    // Automatic self-healing progression
    setTimeout(() => {
      setChaosPhase('healing');
      setTimeout(() => {
        setChaosPhase('resolved');
        soundFX.playHealChime();
      }, 2500);
    }, 2500);
  }, []);

  const handleResetChaos = useCallback(() => {
    soundFX.playClick();
    setChaosPhase('idle');
  }, []);

  const handleNodeClick = (node: ArchitectureNode, isWellArch: boolean) => {
    setSelectedNode(node);
    setIsWellArchSelected(isWellArch);
  };

  // Keyboard navigation when not in presenter mode or modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (displayMode === 'presenter' || selectedNode !== null) return;
      if (isPrompterOpen || is6PillarsOpen || isExecutiveReviewOpen || isStressLabOpen || isPacketSimulatorOpen || isClientSolutionsOpen || isSubtopicLabsOpen || isTheoryOpen || isAiCopilotOpen || isAiGovernanceOpen) {
        if (e.key === 'Escape') {
          setIsPrompterOpen(false);
          setIs6PillarsOpen(false);
          setIsExecutiveReviewOpen(false);
          setIsStressLabOpen(false);
          setIsPacketSimulatorOpen(false);
          setIsClientSolutionsOpen(false);
          setIsSubtopicLabsOpen(false);
          setIsTheoryOpen(false);
          setIsAiCopilotOpen(false);
          setIsAiGovernanceOpen(false);
        }
        return;
      }
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
        setIsAiCopilotOpen(prev => !prev);
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
    isAiCopilotOpen,
    isAiGovernanceOpen
  ]);

  return (
    <div className="app-container">
      {/* Apple Header with Full Brand Title */}
      <Header
        currentDomainIndex={currentDomainIndex}
        totalDomains={allDomains.length}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        audioEnabled={audioEnabled}
        onToggleAudio={() => {
          setAudioEnabled(!audioEnabled);
          soundFX.enabled = !audioEnabled;
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
        onOpenAiCopilot={() => setIsAiCopilotOpen(true)}
        onOpenAiGovernance={() => setIsAiGovernanceOpen(true)}
      />

      <div className="main-workspace">
        {/* macOS Style Sidebar */}
        <Sidebar
          domains={allDomains}
          selectedDomainId={activeDomain.id}
          onSelectDomain={handleSelectDomain}
          completedDomainIds={completedDomainIds}
        />

        {/* Main Content Area */}
        <main className="app-content" style={{ paddingBottom: 130 }}>
          {/* Calm Domain Hero */}
          <div className="domain-hero">
            <div className="hero-meta-row">
              <span className="hero-tag">
                Module {activeDomain.number} of {allDomains.length} • {activeDomain.category}
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn-action"
                  onClick={() => setIsPrompterOpen(true)}
                  style={{ fontSize: 11, height: 26 }}
                  title="View spoken script and jury Q&A"
                >
                  Speaker Script [S]
                </button>
                <button
                  className="btn-action primary"
                  onClick={() => setDisplayMode('presenter')}
                  style={{ fontSize: 11, height: 26 }}
                >
                  Launch Presenter View [P]
                </button>
              </div>
            </div>
            <h1 className="hero-title">{activeDomain.title}</h1>
            <p className="hero-subtitle">{activeDomain.subtitle}</p>
          </div>

          {/* Active Chaos Outage Banner */}
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

          {/* Dual Topology Comparison & Flowing Data Stage */}
          <DualArchitectureStage
            naive={activeDomain.naive}
            wellArch={activeDomain.wellArch}
            viewMode={viewMode}
            setViewMode={setViewMode}
            chaosPhase={chaosPhase}
            affectedNodeIds={activeDomain.chaos.affectedNodeIds}
            onSelectNode={handleNodeClick}
          />

          {/* Interactive Disaster Recovery Explorer (Domain 13) */}
          {activeDomain.id === 'disaster-recovery' && (
            <DRStrategyExplorer />
          )}

          {/* Quantitative Metric Delta Grid */}
          <MetricComparisonBar metrics={activeDomain.metrics} />

          {/* 2-Column Analytics Split: Radar Scorecard + IaC Inspector */}
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

          {/* Luxury Executive Presenter Credits & Telemetry Footer */}
          <PresenterFooter
            onOpenPresenter={() => setDisplayMode('presenter')}
            onTriggerChaos={handleTriggerChaos}
            onOpen6Pillars={() => setIs6PillarsOpen(true)}
          />
        </main>
      </div>

      {/* Background Auto-Pilot Floating Runner (Runs hands-free during presentation) */}
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
        onOpenAiCopilot={() => setIsAiCopilotOpen(true)}
      />

      {/* Interactive Node Deep-Dive Modal */}
      <NodeDetailModal
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        isWellArchNode={isWellArchSelected}
      />

      {/* Fullscreen Presenter Mode Deck Overlay */}
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

      {/* Live Defense Speaker Script & Prompter */}
      {isPrompterOpen && (
        <SpeakerScriptPrompter
          currentDomainIndex={currentDomainIndex}
          totalDomains={allDomains.length}
          onSelectDomainIndex={(idx) => setCurrentDomainIndex(idx)}
          onClose={() => setIsPrompterOpen(false)}
        />
      )}

      {/* 6 Pillars Master Explorer Modal */}
      {is6PillarsOpen && (
        <PillarsExplorerModal
          onClose={() => setIs6PillarsOpen(false)}
          onNavigateToDomain={(domainId) => handleSelectDomain(domainId)}
        />
      )}

      {/* Executive WAF Review & Cost ROI Calculator Modal */}
      {isExecutiveReviewOpen && (
        <ExecutiveReviewModal
          onClose={() => setIsExecutiveReviewOpen(false)}
        />
      )}

      {/* Interactive Stress & Incident Simulation Lab Modal */}
      {isStressLabOpen && (
        <StressLabModal
          onClose={() => setIsStressLabOpen(false)}
        />
      )}

      {/* Interactive Packet Latency & Flight Benchmark Simulator Modal */}
      {isPacketSimulatorOpen && (
        <PacketLatencySimulator
          onClose={() => setIsPacketSimulatorOpen(false)}
        />
      )}

      {/* Client Solutions & Workloads Explorer Modal */}
      {isClientSolutionsOpen && (
        <ClientSolutionsExplorer
          onClose={() => setIsClientSolutionsOpen(false)}
        />
      )}

      {/* Deep-Dive Subtopic Simulators Lab Modal */}
      {isSubtopicLabsOpen && (
        <SubtopicExplorerModal
          onClose={() => setIsSubtopicLabsOpen(false)}
        />
      )}

      {/* Theoretical Foundations & AWS Literature Compendium Modal */}
      {isTheoryOpen && (
        <TheoreticalFoundationsModal
          onClose={() => setIsTheoryOpen(false)}
          onSelectDomain={(domainId) => handleSelectDomain(domainId)}
        />
      )}

      {/* AWS Well-Architected Grounded AI Copilot Modal */}
      {isAiCopilotOpen && (
        <AiArchitectCopilotModal
          activeDomain={activeDomain}
          onClose={() => setIsAiCopilotOpen(false)}
          onApplyRemediation={(action) => {
            soundFX.playHealChime();
            if (chaosPhase !== 'idle') {
              setChaosPhase('resolved');
            }
          }}
          onOpen6PillarsFallback={() => {
            setIsAiCopilotOpen(false);
            setIs6PillarsOpen(true);
          }}
        />
      )}

      {/* Enterprise AI Engineering & Governance Inspector Modal */}
      {isAiGovernanceOpen && (
        <AiGovernanceModal
          onClose={() => setIsAiGovernanceOpen(false)}
          onOpenCopilot={() => {
            setIsAiGovernanceOpen(false);
            setIsAiCopilotOpen(true);
          }}
        />
      )}
    </div>
  );
}

export default App;
