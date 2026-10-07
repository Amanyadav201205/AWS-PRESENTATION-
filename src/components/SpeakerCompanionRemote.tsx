import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Compass,
  Clock,
  Sparkles,
  HelpCircle,
  FileText,
  Sliders
} from 'lucide-react';
import { allDomains } from '../data';
import {
  domainPresentationScripts,
  DomainPresentationScript,
  generalKeynoteIntro,
  generalKeynoteOutro
} from '../data/presentationScripts';
import { PhoneCompanionSync, RemoteSpeaker, StageState } from '../services/presentationRemoteSync';
import { soundFX } from '../utils/soundEffects';

interface SpeakerCompanionRemoteProps {
  initialRoomCode: string;
  initialSpeaker?: RemoteSpeaker;
  onExitRemote?: () => void;
}

export const SpeakerCompanionRemote: React.FC<SpeakerCompanionRemoteProps> = ({
  initialRoomCode,
  initialSpeaker = 'devarsh',
  onExitRemote
}) => {
  const [roomCode] = useState<string>(initialRoomCode);
  const [speaker, setSpeaker] = useState<RemoteSpeaker>(initialSpeaker);
  const [activeTab, setActiveTab] = useState<'script' | 'actions' | 'qa' | 'deck'>('script');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('large');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Synced state from stage
  const [stageState, setStageState] = useState<StageState>({
    currentDomainIndex: 0,
    currentDomainId: allDomains[0].id,
    domainTitle: allDomains[0].title,
    domainCategory: allDomains[0].category,
    viewMode: 'split',
    chaosPhase: 'idle',
    isChaosActive: false,
    displayMode: 'studio',
    activeModal: null,
    elapsedSeconds: 0,
    connectedDevicesCount: 1,
    spotlightTarget: null,
    latestSpeakerName: null,
    latestActionNotice: null
  });

  // Presentation elapsed timer
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [hapticsEnabled] = useState<boolean>(true);
  const [audioFeedback] = useState<boolean>(false);
  const syncRef = useRef<PhoneCompanionSync | null>(null);

  // Initialize companion sync client
  useEffect(() => {
    const companion = new PhoneCompanionSync(roomCode, speaker);
    syncRef.current = companion;

    const unsubState = companion.onState((incomingState) => {
      setStageState(incomingState);
      if (incomingState.elapsedSeconds > 0) {
        setTimerSeconds(incomingState.elapsedSeconds);
      }
    });

    const unsubConn = companion.onConnectionStatus((connected) => {
      setIsConnected(connected);
    });

    return () => {
      unsubState();
      unsubConn();
      companion.destroy();
      syncRef.current = null;
    };
  }, [roomCode, speaker]);

  // Local timer increment if not provided by stage
  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimerSeconds(s => s + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const triggerHaptic = (ms = 25) => {
    if (hapticsEnabled && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(ms); } catch { /* ignore */ }
    }
    if (audioFeedback) {
      soundFX.playClick();
    }
  };

  const currentIdx = stageState.currentDomainIndex;
  const currentDomain = allDomains[currentIdx] || allDomains[0];
  const currentScript: DomainPresentationScript = domainPresentationScripts[currentIdx] || domainPresentationScripts[0];

  // Determine which presenter leads this module
  const isDevarshTurn = currentIdx % 2 === 0;
  const leadSpeakerName = currentIdx === 14 ? 'Devarsh & Aman (Joint Capstone)' : isDevarshTurn ? 'Devarsh Patel' : 'Aman Kumar Yadav';
  const isMyTurn = speaker === 'both' || (speaker === 'devarsh' && isDevarshTurn) || (speaker === 'aman' && !isDevarshTurn);

  // Dispatch commands to the stage
  const sendCmd = (cmd: Parameters<PhoneCompanionSync['sendCommand']>[0]) => {
    triggerHaptic();
    syncRef.current?.sendCommand(cmd);
  };

  const handleNextModule = () => {
    sendCmd({ type: 'NEXT_MODULE' });
  };

  const handlePrevModule = () => {
    sendCmd({ type: 'PREV_MODULE' });
  };

  const handleTriggerChaos = () => {
    triggerHaptic(60);
    if (stageState.isChaosActive) {
      sendCmd({ type: 'RESET_CHAOS' });
    } else {
      sendCmd({ type: 'TRIGGER_CHAOS' });
    }
  };

  const handleScrollTo = (target: 'topology' | 'journey' | 'metrics' | 'iac' | 'radar' | 'top') => {
    sendCmd({ type: 'SCROLL_TO', target });
  };

  const handleSpotlight = (targetId: string, label: string) => {
    sendCmd({ type: 'SPOTLIGHT', targetId, label });
  };

  const handleOpenModal = (modal: string) => {
    sendCmd({ type: 'OPEN_MODAL', modal });
  };

  const handlePresenterMode = () => {
    triggerHaptic(50);
    if (stageState.displayMode === 'presenter') {
      sendCmd({ type: 'EXIT_PRESENTER_MODE' });
    } else {
      sendCmd({ type: 'ENTER_PRESENTER_MODE' });
    }
  };

  const handleStorylineStage = (stage: 'requirement' | 'prescription' | 'waf-solution' | 'theory') => {
    sendCmd({ type: 'SET_STORYLINE_STAGE', storylineStage: stage });
  };

  const handleToggleViewMode = () => {
    const nextMode = stageState.viewMode === 'split' ? 'well-arch-only' : stageState.viewMode === 'well-arch-only' ? 'naive-only' : 'split';
    sendCmd({ type: 'SET_VIEW_MODE', mode: nextMode });
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="speaker-remote-mobile-root" style={{
      background: '#000000',
      color: '#f5f5f7',
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif',
      WebkitFontSmoothing: 'antialiased',
      touchAction: 'manipulation'
    }}>
      {/* Top Mobile Status Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '10px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: isConnected ? '#30d158' : '#ff9f0a',
              boxShadow: isConnected ? '0 0 8px #30d158' : 'none'
            }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#86868b', letterSpacing: '0.04em' }}>
              ROOM: <strong style={{ color: '#fff' }}>{roomCode}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Presentation Clock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255, 255, 255, 0.08)', padding: '3px 8px', borderRadius: 12 }}>
              <Clock size={11} color="var(--accent)" />
              <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>
                {formatTime(timerSeconds)}
              </span>
            </div>

            {/* Exit Remote Button */}
            {onExitRemote && (
              <button
                onClick={onExitRemote}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#86868b',
                  fontSize: 12,
                  padding: '2px 6px',
                  cursor: 'pointer'
                }}
              >
                Exit
              </button>
            )}
          </div>
        </div>

        {/* Presenter Selector Segmented Pill */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: 14,
          padding: 2,
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <button
            onClick={() => {
              triggerHaptic();
              setSpeaker('devarsh');
              syncRef.current?.setSpeaker('devarsh');
            }}
            style={{
              padding: '6px 4px',
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              background: speaker === 'devarsh' ? '#0a84ff' : 'transparent',
              color: speaker === 'devarsh' ? '#ffffff' : '#98989d',
              transition: 'all 0.18s ease'
            }}
          >
            🧑‍💻 Devarsh
          </button>

          <button
            onClick={() => {
              triggerHaptic();
              setSpeaker('aman');
              syncRef.current?.setSpeaker('aman');
            }}
            style={{
              padding: '6px 4px',
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              background: speaker === 'aman' ? '#ff9900' : 'transparent',
              color: speaker === 'aman' ? '#000000' : '#98989d',
              transition: 'all 0.18s ease'
            }}
          >
            👨‍💻 Aman
          </button>

          <button
            onClick={() => {
              triggerHaptic();
              setSpeaker('both');
              syncRef.current?.setSpeaker('both');
            }}
            style={{
              padding: '6px 4px',
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              background: speaker === 'both' ? '#30d158' : 'transparent',
              color: speaker === 'both' ? '#000000' : '#98989d',
              transition: 'all 0.18s ease'
            }}
          >
            👥 Both
          </button>
        </div>
      </header>

      {/* Module Navigation Card */}
      <div style={{
        padding: '12px 16px',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0) 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.06em' }}>
            Module {currentIdx + 1} of {allDomains.length} · {currentDomain.category}
          </span>

          <div style={{
            fontSize: 11,
            padding: '2px 8px',
            borderRadius: 8,
            fontWeight: 600,
            background: isMyTurn ? 'rgba(48, 209, 88, 0.15)' : 'rgba(255, 255, 255, 0.08)',
            color: isMyTurn ? '#30d158' : '#86868b'
          }}>
            {isMyTurn ? '🔥 YOUR TURN TO SPEAK' : `👉 Hand off to ${leadSpeakerName}`}
          </div>
        </div>

        <h1 style={{
          fontSize: 18,
          fontWeight: 700,
          margin: '0 0 8px 0',
          lineHeight: 1.3,
          color: '#ffffff'
        }}>
          {currentDomain.title}
        </h1>

        {/* Lead Speaker Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: '#98989d' }}>
            Lead Speaker: <strong style={{ color: isDevarshTurn ? '#5ac8fa' : '#ffb340' }}>{leadSpeakerName}</strong>
          </span>

          {/* Quick Prev / Next Module triggers */}
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={handlePrevModule}
              disabled={currentIdx === 0}
              className="btn-action btn-icon"
              style={{ width: 32, height: 32, opacity: currentIdx === 0 ? 0.3 : 1 }}
              aria-label="Previous module on stage"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNextModule}
              disabled={currentIdx === allDomains.length - 1}
              className="btn-action btn-icon"
              style={{ width: 32, height: 32, opacity: currentIdx === allDomains.length - 1 ? 0.3 : 1 }}
              aria-label="Next module on stage"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Tab Nav for Script Views */}
      <div style={{
        display: 'flex',
        padding: '8px 16px',
        gap: 6,
        overflowX: 'auto',
        background: '#0b0d10',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <button
          onClick={() => { triggerHaptic(); setActiveTab('script'); }}
          style={{
            padding: '6px 12px',
            borderRadius: 16,
            fontSize: 12,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'script' ? '#ffffff' : 'rgba(255,255,255,0.06)',
            color: activeTab === 'script' ? '#000000' : '#86868b'
          }}
        >
          🎙️ Teleprompter
        </button>

        <button
          onClick={() => { triggerHaptic(); setActiveTab('actions'); }}
          style={{
            padding: '6px 12px',
            borderRadius: 16,
            fontSize: 12,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'actions' ? '#ffffff' : 'rgba(255,255,255,0.06)',
            color: activeTab === 'actions' ? '#000000' : '#86868b'
          }}
        >
          ⚡ Stage Cues ({stageState.isChaosActive ? 'Chaos ON' : 'Normal'})
        </button>

        <button
          onClick={() => { triggerHaptic(); setActiveTab('qa'); }}
          style={{
            padding: '6px 12px',
            borderRadius: 16,
            fontSize: 12,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'qa' ? '#ffffff' : 'rgba(255,255,255,0.06)',
            color: activeTab === 'qa' ? '#000000' : '#86868b'
          }}
        >
          🛡️ Jury Defense ({currentScript.juryQuestions.length})
        </button>

        <button
          onClick={() => { triggerHaptic(); setActiveTab('deck'); }}
          style={{
            padding: '6px 12px',
            borderRadius: 16,
            fontSize: 12,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'deck' ? '#ffffff' : 'rgba(255,255,255,0.06)',
            color: activeTab === 'deck' ? '#000000' : '#86868b'
          }}
        >
          📊 Thesis &amp; Outro
        </button>
      </div>

      {/* Main Body Content Scroll Area */}
      <div style={{ flex: 1, padding: '16px', overflowY: 'auto', paddingBottom: 160 }}>
        {/* Tab 1: Spoken Teleprompter */}
        {activeTab === 'script' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Opening Hook Card */}
            <div style={{
              background: 'rgba(255, 153, 0, 0.08)',
              border: '1px solid rgba(255, 153, 0, 0.3)',
              borderRadius: 16,
              padding: '12px 16px'
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 4, letterSpacing: '0.04em' }}>
                🪝 Spoken Opening Hook (Grab Jury Attention)
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#ffffff', lineHeight: 1.45 }}>
                &ldquo;{currentScript.openingHook}&rdquo;
              </div>
            </div>

            {/* Verbatim Script Card with Apple optical sizing */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 16,
              padding: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Word-for-Word Presenter Script
                </span>

                {/* Font Size controls */}
                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    onClick={() => setFontSize('normal')}
                    style={{
                      background: fontSize === 'normal' ? 'rgba(255,255,255,0.2)' : 'transparent',
                      border: 'none',
                      color: '#fff',
                      fontSize: 11,
                      padding: '2px 6px',
                      borderRadius: 4
                    }}
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setFontSize('large')}
                    style={{
                      background: fontSize === 'large' ? 'rgba(255,255,255,0.2)' : 'transparent',
                      border: 'none',
                      color: '#fff',
                      fontSize: 13,
                      padding: '2px 6px',
                      borderRadius: 4
                    }}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize('xl')}
                    style={{
                      background: fontSize === 'xl' ? 'rgba(255,255,255,0.2)' : 'transparent',
                      border: 'none',
                      color: '#fff',
                      fontSize: 15,
                      padding: '2px 6px',
                      borderRadius: 4
                    }}
                  >
                    A+
                  </button>
                </div>
              </div>

              <div style={{
                fontSize: fontSize === 'xl' ? 20 : fontSize === 'large' ? 17 : 15,
                lineHeight: 1.65,
                color: '#f5f5f7',
                whiteSpace: 'pre-line',
                letterSpacing: '-0.01em'
              }}>
                {currentScript.verbatimScript}
              </div>
            </div>

            {/* Live Screen Action Cue (What Stage is Doing) */}
            <div style={{
              background: 'rgba(10, 132, 255, 0.08)',
              border: '1px solid rgba(10, 132, 255, 0.25)',
              borderRadius: 16,
              padding: '12px 16px'
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#5ac8fa', textTransform: 'uppercase', marginBottom: 4 }}>
                🎬 Screen Action Cue
              </div>
              <div style={{ fontSize: 14, color: '#e1e1e6', lineHeight: 1.5 }}>
                {currentScript.screenActionCue}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Stage Controls & Actions */}
        {activeTab === 'actions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Quick Chaos Injector */}
            <div style={{
              background: stageState.isChaosActive ? 'rgba(255, 69, 58, 0.12)' : 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${stageState.isChaosActive ? 'rgba(255, 69, 58, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: 18,
              padding: 16
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: stageState.isChaosActive ? '#ff453a' : 'var(--accent)', textTransform: 'uppercase' }}>
                  ⚡ Multi-AZ Outage Simulation
                </span>
                <span style={{ fontSize: 11, color: '#86868b' }}>Affects Big Screen</span>
              </div>
              <p style={{ fontSize: 13, color: '#a1a1a6', margin: '0 0 12px 0' }}>
                Simulate catastrophic AZ-1 datacenter failure. Watch the stage show real-time auto-healing and failover.
              </p>
              <button
                onClick={handleTriggerChaos}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 14,
                  fontSize: 14,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: stageState.isChaosActive ? '#30d158' : '#ff453a',
                  color: stageState.isChaosActive ? '#000000' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
                }}
              >
                {stageState.isChaosActive ? <RotateCcw size={16} /> : <Zap size={16} />}
                <span>{stageState.isChaosActive ? 'Heal & Restore Nominal State' : 'Inject Catastrophic Chaos Outage'}</span>
              </button>
            </div>

            {/* Smooth Stage Auto-Scrollers */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 18,
              padding: 16
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', marginBottom: 10 }}>
                🎯 Camera Viewport: Auto-Scroll Stage
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button
                  onClick={() => handleScrollTo('topology')}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Compass size={14} color="var(--accent)" />
                  <span>Architecture Map</span>
                </button>

                <button
                  onClick={() => handleScrollTo('metrics')}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Sliders size={14} color="var(--status-healthy)" />
                  <span>FinOps Metrics</span>
                </button>

                <button
                  onClick={() => handleScrollTo('journey')}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <FileText size={14} color="#0a84ff" />
                  <span>Customer Journey</span>
                </button>

                <button
                  onClick={() => handleScrollTo('iac')}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Sparkles size={14} color="#bf5af2" />
                  <span>Terraform IaC</span>
                </button>
              </div>
            </div>

            {/* Launch Specialized Simulators on Stage */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 18,
              padding: 16
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', marginBottom: 10 }}>
                🚀 Launch Big Screen Deep-Dive Simulators
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  onClick={() => handleOpenModal('latency')}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 12,
                    background: 'rgba(255, 153, 0, 0.12)',
                    border: '1px solid rgba(255, 153, 0, 0.3)',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>✈️ Packet Flight Latency Benchmark</span>
                  <span style={{ fontSize: 11, color: 'var(--accent)' }}>Open Modal →</span>
                </button>

                <button
                  onClick={() => handleOpenModal('stresslab')}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>🧪 Stress &amp; Incident Lab</span>
                  <span style={{ fontSize: 11, color: '#86868b' }}>Open Modal →</span>
                </button>

                <button
                  onClick={() => handleOpenModal('advisor')}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>🧠 Grounded AWS AI Architect Copilot</span>
                  <span style={{ fontSize: 11, color: '#86868b' }}>Open Modal →</span>
                </button>

                <button
                  onClick={() => handleOpenModal('6pillars')}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>🏛️ 6 Pillars Master Explorer</span>
                  <span style={{ fontSize: 11, color: '#86868b' }}>Open Modal →</span>
                </button>

                <button
                  onClick={() => handleOpenModal('subtopics')}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>🔬 RDS Proxy &amp; Aurora Quorum Lab</span>
                  <span style={{ fontSize: 11, color: '#86868b' }}>Open Modal →</span>
                </button>
              </div>
            </div>

            {/* Live Component Spotlights */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 18,
              padding: 16
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', marginBottom: 10 }}>
                🔦 Laser Spotlight (Pulsing Glow on Big Screen)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {currentDomain.wellArch.nodes.slice(0, 5).map(node => (
                  <button
                    key={node.id}
                    onClick={() => handleSpotlight(node.id, node.name)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 10,
                      background: 'rgba(255, 153, 0, 0.1)',
                      border: '1px solid rgba(255, 153, 0, 0.25)',
                      color: '#ffffff',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <Sparkles size={12} color="var(--accent)" />
                    <span>Focus {node.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Jury Questions & Certified Defense */}
        {activeTab === 'qa' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{
              background: 'rgba(48, 209, 88, 0.08)',
              border: '1px solid rgba(48, 209, 88, 0.25)',
              borderRadius: 16,
              padding: 14
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--status-healthy)', textTransform: 'uppercase', marginBottom: 4 }}>
                🛡️ Certified Architect Defense
              </div>
              <div style={{ fontSize: 14, color: '#fff', lineHeight: 1.5 }}>
                {currentScript.architectDefense}
              </div>
            </div>

            <div style={{ fontSize: 13, fontWeight: 700, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '4px 0 0 2px' }}>
              Anticipated Evaluator / Jury Questions
            </div>

            {currentScript.juryQuestions.map((q, qIdx) => (
              <div
                key={qIdx}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 16,
                  padding: 14
                }}
              >
                <div style={{ fontWeight: 600, color: '#ff9f0a', fontSize: 14, marginBottom: 8, display: 'flex', gap: 6 }}>
                  <HelpCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{q.question}</span>
                </div>
                <div style={{ fontSize: 14, color: '#d1d1d6', lineHeight: 1.55, paddingLeft: 22, borderLeft: '2px solid rgba(255, 159, 10, 0.4)' }}>
                  {q.answer}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Keynote Thesis & Outro */}
        {activeTab === 'deck' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Intro */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 16,
              padding: 16
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 6 }}>
                Keynote Opening Thesis (60s)
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.6, color: '#e5e5ea', whiteSpace: 'pre-line' }}>
                {generalKeynoteIntro.verbatimScript}
              </div>
            </div>

            {/* Outro */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 16,
              padding: 16
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--status-healthy)', textTransform: 'uppercase', marginBottom: 6 }}>
                Executive Capstone Outro &amp; Verdict (60s)
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.6, color: '#e5e5ea', whiteSpace: 'pre-line' }}>
                {generalKeynoteOutro.verbatimScript}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Presenter Remote Control Dock */}
      <footer style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(10, 12, 16, 0.92)',
        backdropFilter: 'blur(25px) saturate(180%)',
        WebkitBackdropFilter: 'blur(25px) saturate(180%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '10px 16px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Presenter Mode Toggle — GO LIVE / EXIT PRESENT */}
        <button
          onClick={handlePresenterMode}
          style={{
            width: '100%',
            padding: '13px 16px',
            borderRadius: 14,
            border: 'none',
            cursor: 'pointer',
            background: stageState.displayMode === 'presenter'
              ? 'rgba(255, 69, 58, 0.18)'
              : 'linear-gradient(135deg, rgba(255, 153, 0, 0.9) 0%, rgba(220, 120, 0, 0.9) 100%)',
            color: stageState.displayMode === 'presenter' ? '#ff453a' : '#000000',
            fontWeight: 700,
            fontSize: 15,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            letterSpacing: '0.02em',
            boxShadow: stageState.displayMode === 'presenter'
              ? '0 0 0 1px rgba(255, 69, 58, 0.4)'
              : '0 4px 20px rgba(255, 153, 0, 0.45)',
          }}
        >
          {stageState.displayMode === 'presenter'
            ? <><span style={{ fontSize: 17 }}>⏹</span> EXIT PRESENTATION</>
            : <><span style={{ fontSize: 17 }}>🎬</span> GO LIVE — PRESENT</>
          }
        </button>

        {/* Storyline Stage Switcher */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6 }}>
          {([
            { stage: 'requirement' as const, label: '📋 Req', short: 'Req' },
            { stage: 'prescription' as const, label: '💊 Norm', short: 'Norm' },
            { stage: 'waf-solution' as const, label: '🛡️ WAF', short: 'WAF' },
            { stage: 'theory' as const, label: '📖 Theory', short: 'Theory' },
          ]).map(({ stage, label }) => (
            <button
              key={stage}
              onClick={() => handleStorylineStage(stage)}
              style={{
                padding: '7px 4px',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.06)',
                color: '#d1d1d6',
                fontWeight: 600,
                fontSize: 11,
                textAlign: 'center'
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Primary Command Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {/* Chaos Trigger button */}
          <button
            onClick={handleTriggerChaos}
            style={{
              padding: '10px 8px',
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              background: stageState.isChaosActive ? '#30d158' : 'rgba(255, 69, 58, 0.2)',
              color: stageState.isChaosActive ? '#000000' : '#ff453a',
              fontWeight: 700,
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4
            }}
          >
            {stageState.isChaosActive ? <RotateCcw size={14} /> : <Zap size={14} />}
            <span>{stageState.isChaosActive ? 'Heal AZ' : 'Fail AZ-1'}</span>
          </button>

          {/* Toggle WAF vs Naive mode */}
          <button
            onClick={handleToggleViewMode}
            style={{
              padding: '10px 8px',
              borderRadius: 12,
              border: '1px solid rgba(255, 255, 255, 0.12)',
              cursor: 'pointer',
              background: 'rgba(255, 255, 255, 0.06)',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4
            }}
          >
            <Eye size={13} color="var(--accent)" />
            <span>Mode: {stageState.viewMode === 'split' ? 'Split' : stageState.viewMode === 'well-arch-only' ? 'WAF' : 'Naive'}</span>
          </button>

          {/* Scroll to Top / Overview */}
          <button
            onClick={() => handleScrollTo('top')}
            style={{
              padding: '10px 8px',
              borderRadius: 12,
              border: '1px solid rgba(255, 255, 255, 0.12)',
              cursor: 'pointer',
              background: 'rgba(255, 255, 255, 0.06)',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4
            }}
          >
            <Compass size={13} />
            <span>Top of Slide</span>
          </button>
        </div>

        {/* Master Slide Navigation Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 8 }}>
          <button
            onClick={handlePrevModule}
            disabled={currentIdx === 0}
            style={{
              padding: '12px 10px',
              borderRadius: 14,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#fff',
              fontWeight: 600,
              fontSize: 13,
              cursor: currentIdx === 0 ? 'not-allowed' : 'pointer',
              opacity: currentIdx === 0 ? 0.35 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4
            }}
          >
            <ChevronLeft size={16} />
            <span>Prev</span>
          </button>

          {/* Big Center Action: Advance or Focus next point */}
          <button
            onClick={handleNextModule}
            disabled={currentIdx === allDomains.length - 1}
            style={{
              padding: '12px 14px',
              borderRadius: 14,
              border: 'none',
              background: 'linear-gradient(135deg, #FF9900 0%, #E88B00 100%)',
              color: '#000000',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              boxShadow: '0 4px 18px rgba(255, 153, 0, 0.35)'
            }}
          >
            <span>Next: Module {currentIdx + 2}</span>
            <ChevronRight size={17} />
          </button>

          {/* Quick Spotlight on topology */}
          <button
            onClick={() => handleScrollTo('topology')}
            style={{
              padding: '12px 10px',
              borderRadius: 14,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#fff',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4
            }}
            title="Auto-scroll big screen to architecture topology"
          >
            <Eye size={15} color="var(--accent)" />
            <span>Focus</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default SpeakerCompanionRemote;
