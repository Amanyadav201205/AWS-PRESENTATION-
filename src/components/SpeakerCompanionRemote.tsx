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
  Sliders,
  LayoutGrid,
  Landmark,
  Activity,
  Play,
  Monitor,
  Flame,
  ShieldAlert,
  Skull,
  DollarSign,
  SlidersHorizontal,
  Edit3,
  X,
  Shield,
  Lock,
  Database
} from 'lucide-react';
import { allDomains } from '../data';
import {
  domainPresentationScripts,
  DomainPresentationScript,
  generalKeynoteIntro,
  generalKeynoteOutro
} from '../data/presentationScripts';
import {
  domainScriptActionsMap
} from '../data/domainScriptActions';
import {
  PhoneCompanionSync,
  RemoteSpeaker,
  StageState,
  RemoteScrollTarget
} from '../services/presentationRemoteSync';
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
  const [roomCode, setRoomCode] = useState<string>(initialRoomCode);
  const [isEditingRoom, setIsEditingRoom] = useState<boolean>(false);
  const [tempRoomInput, setTempRoomInput] = useState<string>(initialRoomCode);
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
    slideMode: 'keynote',
    isSlideGridOpen: false,
    trafficLoad: 2500,
    activeAttack: 'none',
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

  const handleScrollTo = (target: RemoteScrollTarget) => {
    triggerHaptic(20);
    sendCmd({ type: 'SCROLL_TO', target });
  };

  const handleSpotlight = (targetId: string, label: string) => {
    triggerHaptic(25);
    sendCmd({ type: 'SPOTLIGHT', targetId, label });
  };

  const handleOpenModal = (modal: string) => {
    triggerHaptic(30);
    sendCmd({ type: 'OPEN_MODAL', modal });
  };

  const handleCloseModals = () => {
    triggerHaptic(20);
    sendCmd({ type: 'CLOSE_MODALS' });
  };

  const handlePresenterMode = () => {
    triggerHaptic(50);
    if (stageState.displayMode === 'presenter') {
      sendCmd({ type: 'EXIT_PRESENTER_MODE' });
    } else {
      sendCmd({ type: 'ENTER_PRESENTER_MODE' });
    }
  };

  const handleSetSlideMode = (slideMode: 'keynote' | 'dual' | 'theory') => {
    triggerHaptic(30);
    sendCmd({ type: 'SET_SLIDE_MODE', slideMode });
  };

  const handleRunSlideSim = () => {
    triggerHaptic(40);
    sendCmd({ type: 'RUN_SLIDE_SIM' });
  };

  const handleToggleSlideGrid = () => {
    triggerHaptic(30);
    sendCmd({ type: 'TOGGLE_SLIDE_GRID' });
  };

  const handleSetTraffic = (trafficLoad: number) => {
    triggerHaptic(25);
    sendCmd({ type: 'SET_TRAFFIC', trafficLoad });
  };

  const handleTriggerAttack = (attackScenario: string, label: string) => {
    triggerHaptic(45);
    sendCmd({ type: 'TRIGGER_ATTACK', attackScenario, label });
  };

  const handleStorylineStage = (stage: 'requirement' | 'prescription' | 'waf-solution' | 'theory') => {
    triggerHaptic(25);
    sendCmd({ type: 'SET_STORYLINE_STAGE', storylineStage: stage });
  };

  const handleToggleViewMode = () => {
    triggerHaptic(30);
    const nextMode = stageState.viewMode === 'split' ? 'well-arch-only' : stageState.viewMode === 'well-arch-only' ? 'naive-only' : 'split';
    sendCmd({ type: 'SET_VIEW_MODE', mode: nextMode });
  };

  const handleGotoModule = (index: number) => {
    triggerHaptic(35);
    sendCmd({ type: 'GOTO_MODULE', index });
  };

  const handleSaveRoomCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let clean = tempRoomInput.trim().toUpperCase();
    if (!clean.startsWith('WAF-') && clean.length > 0) {
      clean = `WAF-${clean}`;
    }
    if (clean.length > 0) {
      setRoomCode(clean);
      try {
        sessionStorage.setItem('waf_room_code', clean);
      } catch { /* ignore */ }
    }
    setIsEditingRoom(false);
  };

  const getTimerColor = (sec: number) => {
    if (sec < 480) return '#30d158'; // Green (< 8 mins)
    if (sec < 720) return '#ff9f0a'; // Amber (8-12 mins)
    return '#ff453a'; // Red (> 12 mins)
  };

  const renderActionIcon = (iconName: string, color: string) => {
    switch (iconName) {
      case 'zap': return <Zap size={15} color={color} />;
      case 'shield': return <Shield size={15} color={color} />;
      case 'flame': return <Flame size={15} color={color} />;
      case 'sparkles': return <Sparkles size={15} color={color} />;
      case 'sliders': return <Sliders size={15} color={color} />;
      case 'compass': return <Compass size={15} color={color} />;
      case 'rotate': return <RotateCcw size={15} color={color} />;
      case 'eye': return <Eye size={15} color={color} />;
      case 'play': return <Play size={15} color={color} />;
      case 'database': return <Database size={15} color={color} />;
      case 'lock': return <Lock size={15} color={color} />;
      case 'radar': return <Activity size={15} color={color} />;
      case 'dollar': return <DollarSign size={15} color={color} />;
      default: return <Sparkles size={15} color={color} />;
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isPresenter = stageState.displayMode === 'presenter';
  const primaryNode = currentDomain.wellArch.nodes[0] || currentDomain.naive.nodes[0];
  const domainActions = domainScriptActionsMap[currentIdx] || [];

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
        background: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '10px 16px',
        paddingTop: 'max(10px, env(safe-area-inset-top, 10px))',
        paddingLeft: 'max(16px, env(safe-area-inset-left, 16px))',
        paddingRight: 'max(16px, env(safe-area-inset-right, 16px))',
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
            <button
              onClick={() => {
                setTempRoomInput(roomCode);
                setIsEditingRoom(true);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#86868b',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                padding: '2px 4px',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
              title="Change Room Code"
            >
              <span>ROOM: <strong style={{ color: '#fff' }}>{roomCode}</strong></span>
              <Edit3 size={11} color="var(--accent)" />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Presentation Clock with Pacing Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255, 255, 255, 0.08)', padding: '3px 8px', borderRadius: 12 }}>
              <Clock size={11} color="var(--accent)" />
              <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>
                {formatTime(timerSeconds)}
              </span>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: getTimerColor(timerSeconds),
                  boxShadow: `0 0 6px ${getTimerColor(timerSeconds)}`
                }}
                title={timerSeconds < 480 ? 'Pacing: On Track' : timerSeconds < 720 ? 'Pacing: Wrap up' : 'Pacing: Move to conclusion'}
              />
            </div>

            {onExitRemote && (
              <button
                onClick={onExitRemote}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#86868b',
                  fontSize: 11,
                  padding: '3px 8px',
                  borderRadius: 12,
                  cursor: 'pointer'
                }}
              >
                Exit
              </button>
            )}
          </div>
        </div>

        {/* Presenter Selector Toggle */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          background: 'rgba(255, 255, 255, 0.06)',
          borderRadius: 14,
          padding: 2,
          gap: 2
        }}>
          <button
            onClick={() => {
              triggerHaptic();
              setSpeaker('devarsh');
              sendCmd({ type: 'IDENTIFY_SPEAKER', speaker: 'devarsh', speakerName: 'Devarsh Patel' });
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
            👤 Devarsh
          </button>

          <button
            onClick={() => {
              triggerHaptic();
              setSpeaker('aman');
              sendCmd({ type: 'IDENTIFY_SPEAKER', speaker: 'aman', speakerName: 'Aman Kumar Yadav' });
            }}
            style={{
              padding: '6px 4px',
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              background: speaker === 'aman' ? '#ff9f0a' : 'transparent',
              color: speaker === 'aman' ? '#000000' : '#98989d',
              transition: 'all 0.18s ease'
            }}
          >
            👤 Aman
          </button>

          <button
            onClick={() => {
              triggerHaptic();
              setSpeaker('both');
              sendCmd({ type: 'IDENTIFY_SPEAKER', speaker: 'both', speakerName: 'Devarsh & Aman' });
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

      {/* 15-Slide Quick Jump Ribbon (Instant 1-tap jump to any slide on stage) */}
      <div style={{
        display: 'flex',
        gap: 6,
        overflowX: 'auto',
        padding: '8px 16px',
        background: '#07080b',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none'
      }}>
        {allDomains.map((d, idx) => {
          const isCurrent = idx === currentIdx;
          const isLeadDev = idx % 2 === 0;
          const initials = idx === 14 ? 'D+A' : isLeadDev ? 'D' : 'A';
          return (
            <button
              key={d.id}
              onClick={() => handleGotoModule(idx)}
              style={{
                flexShrink: 0,
                padding: '5px 9px',
                borderRadius: 11,
                border: isCurrent ? '1.5px solid var(--accent)' : '1px solid rgba(255, 255, 255, 0.1)',
                background: isCurrent ? 'rgba(255, 153, 0, 0.16)' : 'rgba(255, 255, 255, 0.04)',
                color: isCurrent ? '#ffffff' : '#8e8e93',
                fontSize: 11,
                fontWeight: isCurrent ? 700 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                background: isCurrent ? 'var(--accent)' : 'rgba(255, 255, 255, 0.12)',
                color: isCurrent ? '#000000' : '#8e8e93',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 9,
                fontWeight: 800,
                fontFamily: 'var(--font-mono)'
              }}>
                {idx + 1}
              </span>
              <span style={{
                whiteSpace: 'nowrap',
                maxWidth: 85,
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {d.title.replace('AWS ', '').replace('Layer', '').trim()}
              </span>
              <span style={{
                fontSize: 8.5,
                padding: '1px 4px',
                borderRadius: 5,
                background: initials === 'D+A' ? 'rgba(48, 209, 88, 0.2)' : isLeadDev ? 'rgba(10, 132, 255, 0.2)' : 'rgba(255, 159, 10, 0.2)',
                color: initials === 'D+A' ? '#30d158' : isLeadDev ? '#5ac8fa' : '#ff9f0a',
                fontWeight: 700
              }}>
                {initials}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Screen Mode Indicator & Fast-Switch Banner */}
      <div style={{
        padding: '10px 16px',
        background: isPresenter ? 'rgba(255, 153, 0, 0.12)' : 'rgba(10, 132, 255, 0.1)',
        borderBottom: `1px solid ${isPresenter ? 'rgba(255, 153, 0, 0.3)' : 'rgba(10, 132, 255, 0.25)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <span style={{ fontSize: 15 }}>{isPresenter ? '🎬' : '💻'}</span>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              color: isPresenter ? 'var(--accent)' : '#5ac8fa',
              letterSpacing: '0.04em'
            }}>
              Big Screen Active Mode
            </span>
            <span style={{
              fontSize: 12,
              fontWeight: 600,
              color: '#ffffff',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {isPresenter ? `16:9 Presentation Deck (Slide ${currentIdx + 1})` : `Architecture Studio (Module ${currentIdx + 1})`}
            </span>
          </div>
        </div>

        <button
          onClick={handlePresenterMode}
          style={{
            padding: '6px 12px',
            borderRadius: 14,
            border: 'none',
            fontSize: 11,
            fontWeight: 700,
            cursor: 'pointer',
            background: isPresenter ? 'rgba(255, 255, 255, 0.15)' : 'var(--accent)',
            color: isPresenter ? '#ffffff' : '#000000',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
        >
          {isPresenter ? 'Switch to Studio 💻' : 'Launch Slides 🎬'}
        </button>
      </div>

      {/* Active Modal Alert Bar (Shows if any modal is open on the laptop screen) */}
      {stageState.activeModal && (
        <div style={{
          padding: '8px 16px',
          background: 'rgba(255, 69, 58, 0.18)',
          borderBottom: '1px solid rgba(255, 69, 58, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13 }}>⚠️</span>
            <span style={{ fontSize: 12, color: '#ff453a', fontWeight: 600 }}>
              Modal Open on Screen: <strong>{stageState.activeModal}</strong>
            </span>
          </div>
          <button
            onClick={handleCloseModals}
            style={{
              padding: '4px 10px',
              borderRadius: 10,
              border: 'none',
              background: '#ff453a',
              color: '#ffffff',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            ✕ Close Modal
          </button>
        </div>
      )}

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

        {/* Lead Speaker Badge & Quick Arrows */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: '#98989d' }}>
            Lead Speaker: <strong style={{ color: isDevarshTurn ? '#5ac8fa' : '#ffb340' }}>{leadSpeakerName}</strong>
          </span>

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
            color: activeTab === 'script' ? '#000000' : '#86868b',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
        >
          🎙️ Teleprompter &amp; Cues
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
            color: activeTab === 'actions' ? '#000000' : '#86868b',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
        >
          ⚡ Stage Remote ({isPresenter ? 'Slides' : 'Studio'})
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
            color: activeTab === 'qa' ? '#000000' : '#86868b',
            whiteSpace: 'nowrap',
            flexShrink: 0
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
            color: activeTab === 'deck' ? '#000000' : '#86868b',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
        >
          📊 Keynote Thesis &amp; Outro
        </button>
      </div>

      {/* Main Body Content Scroll Area */}
      <div style={{ flex: 1, padding: '16px', overflowY: 'auto', paddingBottom: 320 }}>
        {/* ========================================================================= */}
        {/* TAB 1: SPOKEN TELEPROMPTER WITH INLINE STAGE ACTIONS                      */}
        {/* ========================================================================= */}
        {activeTab === 'script' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Presentation Mode Context Bar */}
            {isPresenter ? (
              <div style={{
                background: 'rgba(255, 153, 0, 0.08)',
                border: '1px solid rgba(255, 153, 0, 0.25)',
                borderRadius: 16,
                padding: '10px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' }}>
                    🎬 Slide Canvas Controls (Big Screen)
                  </span>
                  <button
                    onClick={handleToggleSlideGrid}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: 'none',
                      color: '#fff',
                      fontSize: 11,
                      padding: '3px 8px',
                      borderRadius: 8,
                      cursor: 'pointer'
                    }}
                  >
                    🗂️ 15-Slide Grid
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                  <button
                    onClick={() => handleSetSlideMode('keynote')}
                    style={{
                      padding: '6px 4px',
                      borderRadius: 10,
                      border: 'none',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: stageState.slideMode === 'keynote' ? '#ffffff' : 'rgba(255,255,255,0.08)',
                      color: stageState.slideMode === 'keynote' ? '#000000' : '#d1d1d6'
                    }}
                  >
                    1. Architecture
                  </button>
                  <button
                    onClick={() => handleSetSlideMode('dual')}
                    style={{
                      padding: '6px 4px',
                      borderRadius: 10,
                      border: 'none',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: stageState.slideMode === 'dual' ? '#ffffff' : 'rgba(255,255,255,0.08)',
                      color: stageState.slideMode === 'dual' ? '#000000' : '#d1d1d6'
                    }}
                  >
                    2. Notes
                  </button>
                  <button
                    onClick={() => handleSetSlideMode('theory')}
                    style={{
                      padding: '6px 4px',
                      borderRadius: 10,
                      border: 'none',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: stageState.slideMode === 'theory' ? '#ffffff' : 'rgba(255,255,255,0.08)',
                      color: stageState.slideMode === 'theory' ? '#000000' : '#d1d1d6'
                    }}
                  >
                    3. Proof
                  </button>
                </div>

                {/* Direct Traffic Pulse Trigger on Slide */}
                <button
                  onClick={handleRunSlideSim}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 10,
                    border: 'none',
                    background: 'linear-gradient(135deg, rgba(255,153,0,0.9), rgba(220,120,0,0.9))',
                    color: '#000',
                    fontSize: 12,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    cursor: 'pointer'
                  }}
                >
                  <Play size={12} fill="#000" />
                  <span>Run Live Traffic Pulse on Slide</span>
                </button>
              </div>
            ) : (
              <div style={{
                background: 'rgba(10, 132, 255, 0.08)',
                border: '1px solid rgba(10, 132, 255, 0.25)',
                borderRadius: 14,
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8
              }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#5ac8fa' }}>
                  Big Screen Viewport Auto-Scroll:
                </span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    onClick={() => handleScrollTo('journey')}
                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: 11, padding: '4px 8px', borderRadius: 8, cursor: 'pointer' }}
                  >
                    📋 Req
                  </button>
                  <button
                    onClick={() => handleScrollTo('topology')}
                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: 11, padding: '4px 8px', borderRadius: 8, cursor: 'pointer' }}
                  >
                    🗺️ Map
                  </button>
                  <button
                    onClick={() => handleScrollTo('metrics')}
                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: 11, padding: '4px 8px', borderRadius: 8, cursor: 'pointer' }}
                  >
                    📊 SLA
                  </button>
                  <button
                    onClick={() => handleScrollTo('iac')}
                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: 11, padding: '4px 8px', borderRadius: 8, cursor: 'pointer' }}
                  >
                    📜 IaC
                  </button>
                </div>
              </div>
            )}

            {/* Opening Hook Card */}
            <div style={{
              background: 'rgba(255, 153, 0, 0.08)',
              border: '1px solid rgba(255, 153, 0, 0.3)',
              borderRadius: 16,
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  🪝 Spoken Opening Hook (Grab Jury Attention)
                </span>
                <button
                  onClick={() => handleScrollTo('journey')}
                  style={{
                    background: 'rgba(255, 153, 0, 0.2)',
                    border: 'none',
                    color: 'var(--accent)',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 8,
                    cursor: 'pointer'
                  }}
                >
                  Focus on Screen 🎯
                </button>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#ffffff', lineHeight: 1.45 }}>
                &ldquo;{currentScript.openingHook}&rdquo;
              </div>
            </div>

            {/* Word-for-Word Presenter Script Card */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 16,
              padding: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Word-for-Word Presenter Script
                  </span>
                  <span style={{
                    fontSize: 10,
                    padding: '2px 6px',
                    borderRadius: 6,
                    background: isDevarshTurn ? 'rgba(10, 132, 255, 0.2)' : 'rgba(255, 159, 10, 0.2)',
                    color: isDevarshTurn ? '#5ac8fa' : '#ff9f0a',
                    fontWeight: 600
                  }}>
                    {isDevarshTurn ? 'Devarsh' : 'Aman'}
                  </span>
                </div>

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

              {/* Script Text */}
              <div style={{
                fontSize: fontSize === 'xl' ? 20 : fontSize === 'large' ? 17 : 15,
                lineHeight: 1.68,
                color: '#f5f5f7',
                whiteSpace: 'pre-line',
                letterSpacing: '-0.01em',
                marginBottom: 16
              }}>
                {currentScript.verbatimScript}
              </div>

              {/* Domain-Specific Scripted Stage Triggers (Tailored to this exact module's speech) */}
              {domainActions.length > 0 && (
                <div style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingTop: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      ⚡ Scripted Stage Triggers for Module {currentIdx + 1}
                    </span>
                    <span style={{ fontSize: 10, color: '#8e8e93' }}>Tap while speaking</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {domainActions.map(action => (
                      <button
                        key={action.id}
                        onClick={() => {
                          triggerHaptic(35);
                          sendCmd(action.getCommand(primaryNode?.id, primaryNode?.name));
                        }}
                        style={{
                          padding: '10px 12px',
                          borderRadius: 12,
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: '#ffffff',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 10,
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                          <div style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: 'rgba(255, 255, 255, 0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {renderActionIcon(action.icon, action.color)}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {action.label}
                            </div>
                            <div style={{ fontSize: 11, color: '#8e8e93', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {action.description}
                            </div>
                          </div>
                        </div>

                        <span style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 8,
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: action.color,
                          flexShrink: 0
                        }}>
                          {action.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* In-Script Quick Live Action Buttons (Conduct the stage while speaking) */}
              <div style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 8
              }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  🎯 Quick Master Triggers
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  <button
                    onClick={handleTriggerChaos}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 10,
                      border: 'none',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: stageState.isChaosActive ? '#30d158' : 'rgba(255, 69, 58, 0.25)',
                      color: stageState.isChaosActive ? '#000000' : '#ff453a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    {stageState.isChaosActive ? <RotateCcw size={13} /> : <Zap size={13} />}
                    <span>{stageState.isChaosActive ? 'Heal & Restore' : 'Trigger Outage'}</span>
                  </button>

                  {primaryNode && (
                    <button
                      onClick={() => handleSpotlight(primaryNode.id, primaryNode.name)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: 10,
                        border: '1px solid rgba(255, 153, 0, 0.3)',
                        background: 'rgba(255, 153, 0, 0.1)',
                        color: '#ffffff',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        overflow: 'hidden',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <Sparkles size={13} color="var(--accent)" />
                      <span>Spotlight {primaryNode.name}</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleScrollTo('metrics')}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 10,
                      border: '1px solid rgba(48, 209, 88, 0.25)',
                      background: 'rgba(48, 209, 88, 0.08)',
                      color: '#ffffff',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <Sliders size={13} color="var(--status-healthy)" />
                    <span>Focus SLA &amp; ROI</span>
                  </button>

                  <button
                    onClick={() => handleScrollTo('iac')}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 10,
                      border: '1px solid rgba(191, 90, 242, 0.25)',
                      background: 'rgba(191, 90, 242, 0.08)',
                      color: '#ffffff',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <Sparkles size={13} color="#bf5af2" />
                    <span>Focus Terraform IaC</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Visual Action Cue Card (Stage Director Guidance) */}
            <div style={{
              background: 'rgba(10, 132, 255, 0.08)',
              border: '1px solid rgba(10, 132, 255, 0.25)',
              borderRadius: 16,
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#5ac8fa', textTransform: 'uppercase' }}>
                  🎬 Visual Action Cue (What Audience Sees)
                </span>
                <span style={{ fontSize: 10, color: '#86868b' }}>Stage Director</span>
              </div>
              <div style={{ fontSize: 14, color: '#e1e1e6', lineHeight: 1.5 }}>
                {currentScript.screenActionCue}
              </div>

              {/* Direct Tap-to-Execute Button for this cue */}
              <button
                onClick={() => {
                  if (primaryNode) {
                    handleSpotlight(primaryNode.id, primaryNode.name);
                  } else {
                    handleScrollTo('topology');
                  }
                }}
                style={{
                  marginTop: 4,
                  padding: '9px 12px',
                  borderRadius: 12,
                  border: 'none',
                  background: 'rgba(10, 132, 255, 0.25)',
                  color: '#5ac8fa',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                <span>⚡ Execute This Stage Cue Now</span>
              </button>
            </div>

            {/* Speaker Hand-Off Bar */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 14,
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10
            }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 11, color: '#86868b' }}>Next Module Speaker</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
                  {isDevarshTurn ? 'Aman Kumar Yadav' : 'Devarsh Patel'}
                </span>
              </div>

              <button
                onClick={handleNextModule}
                disabled={currentIdx === allDomains.length - 1}
                style={{
                  padding: '8px 14px',
                  borderRadius: 12,
                  border: 'none',
                  background: 'linear-gradient(135deg, #FF9900 0%, #E88B00 100%)',
                  color: '#000',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <span>Pass Off &amp; Advance</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: FULL STAGE REMOTE (COMPLETE CONTROL OVER EVERYTHING)               */}
        {/* ========================================================================= */}
        {activeTab === 'actions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Section 1: Presentation Mode Slide Canvas Controls */}
            {isPresenter && (
              <div style={{
                background: 'rgba(255, 153, 0, 0.08)',
                border: '1px solid rgba(255, 153, 0, 0.3)',
                borderRadius: 18,
                padding: 16
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' }}>
                    🎬 Presentation Deck (16:9 Canvas)
                  </span>
                  <span style={{ fontSize: 11, color: '#86868b' }}>Slide {currentIdx + 1}/{allDomains.length}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
                  <button
                    onClick={() => handleSetSlideMode('keynote')}
                    style={{
                      padding: '10px 8px',
                      borderRadius: 12,
                      border: 'none',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: stageState.slideMode === 'keynote' ? '#ffffff' : 'rgba(255,255,255,0.08)',
                      color: stageState.slideMode === 'keynote' ? '#000000' : '#ffffff'
                    }}
                  >
                    1. Architecture
                  </button>
                  <button
                    onClick={() => handleSetSlideMode('dual')}
                    style={{
                      padding: '10px 8px',
                      borderRadius: 12,
                      border: 'none',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: stageState.slideMode === 'dual' ? '#ffffff' : 'rgba(255,255,255,0.08)',
                      color: stageState.slideMode === 'dual' ? '#000000' : '#ffffff'
                    }}
                  >
                    2. Notes
                  </button>
                  <button
                    onClick={() => handleSetSlideMode('theory')}
                    style={{
                      padding: '10px 8px',
                      borderRadius: 12,
                      border: 'none',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: stageState.slideMode === 'theory' ? '#ffffff' : 'rgba(255,255,255,0.08)',
                      color: stageState.slideMode === 'theory' ? '#000000' : '#ffffff'
                    }}
                  >
                    3. Proof
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <button
                    onClick={handleRunSlideSim}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 12,
                      border: 'none',
                      background: 'linear-gradient(135deg, rgba(255,153,0,0.9), rgba(220,120,0,0.9))',
                      color: '#000',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6
                    }}
                  >
                    <Play size={13} fill="#000" />
                    <span>Run Traffic Pulse</span>
                  </button>

                  <button
                    onClick={handleToggleSlideGrid}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 12,
                      border: '1px solid rgba(255,255,255,0.15)',
                      background: 'rgba(255,255,255,0.08)',
                      color: '#ffffff',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6
                    }}
                  >
                    <LayoutGrid size={13} color="var(--accent)" />
                    <span>15-Slide Grid</span>
                  </button>
                </div>
              </div>
            )}

            {/* Section 2: Chaos Outage Injection & Healing */}
            <div style={{
              background: stageState.isChaosActive ? 'rgba(255, 69, 58, 0.12)' : 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${stageState.isChaosActive ? 'rgba(255, 69, 58, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: 18,
              padding: 16
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: stageState.isChaosActive ? '#ff453a' : 'var(--accent)', textTransform: 'uppercase' }}>
                  ⚡ Multi-AZ Outage &amp; Healing
                </span>
                <span style={{ fontSize: 11, color: stageState.isChaosActive ? '#ff453a' : '#30d158', fontWeight: 600 }}>
                  {stageState.isChaosActive ? '● OUTAGE INJECTED' : '● NOMINAL 99.99%'}
                </span>
              </div>
              <p style={{ fontSize: 13, color: '#a1a1a6', margin: '0 0 12px 0' }}>
                Simulate catastrophic AZ-1 failure on the laptop display. Watch Aurora auto-failover and ALB route traffic seamlessly.
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

            {/* Section 3: Smooth Stage Camera Auto-Scrollers */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 18,
              padding: 16
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', marginBottom: 10 }}>
                🎯 Camera Viewport: Auto-Scroll Big Screen
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button
                  onClick={() => handleScrollTo('top')}
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
                  <span>Top / Hero</span>
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
                  <span>Storyline Req</span>
                </button>

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
                  <span>Topology Map</span>
                </button>

                <button
                  onClick={() => handleScrollTo('sandbox')}
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
                  <SlidersHorizontal size={14} color="var(--accent)" />
                  <span>Sim Sandbox</span>
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
                  <span>FinOps &amp; SLA</span>
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

                <button
                  onClick={() => handleScrollTo('radar')}
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
                  <Activity size={14} color="var(--status-warning)" />
                  <span>Radar Chart</span>
                </button>

                <button
                  onClick={() => handleScrollTo('footer')}
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
                  <Landmark size={14} color="var(--accent)" />
                  <span>Author Footer</span>
                </button>
              </div>
            </div>

            {/* Section 4: Live Traffic Load & Attack Simulator */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 18,
              padding: 16
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#ffffff', textTransform: 'uppercase' }}>
                  📈 Traffic Load &amp; Attack Vectors
                </span>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>
                  Load: {stageState.trafficLoad ? `${(stageState.trafficLoad / 1000).toFixed(0)}k req/s` : '2.5k req/s'}
                </span>
              </div>

              {/* Traffic Volume Presets */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 12 }}>
                {[
                  { label: '1k', load: 1000 },
                  { label: '10k', load: 10000 },
                  { label: '50k', load: 50000 },
                  { label: '100k', load: 100000 },
                  { label: '500k', load: 500000 }
                ].map(p => (
                  <button
                    key={p.load}
                    onClick={() => handleSetTraffic(p.load)}
                    style={{
                      padding: '8px 2px',
                      borderRadius: 10,
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: stageState.trafficLoad === p.load ? 'var(--accent)' : 'rgba(255,255,255,0.06)',
                      color: stageState.trafficLoad === p.load ? '#000000' : '#ffffff',
                      fontWeight: 700,
                      fontSize: 11,
                      cursor: 'pointer'
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Disaster Attack Triggers */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <button
                  onClick={() => handleTriggerAttack('az-outage', 'Multi-AZ Outage')}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 10,
                    border: '1px solid rgba(255,69,58,0.3)',
                    background: stageState.activeAttack === 'az-outage' ? '#ff453a' : 'rgba(255,69,58,0.1)',
                    color: stageState.activeAttack === 'az-outage' ? '#000000' : '#ff453a',
                    fontWeight: 700,
                    fontSize: 11,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Flame size={12} />
                  <span>💥 AZ-1 Failure</span>
                </button>

                <button
                  onClick={() => handleTriggerAttack('ddos', 'DDoS HTTP Flood')}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 10,
                    border: '1px solid rgba(255,159,10,0.3)',
                    background: stageState.activeAttack === 'ddos' ? '#ff9f0a' : 'rgba(255,159,10,0.1)',
                    color: stageState.activeAttack === 'ddos' ? '#000000' : '#ff9f0a',
                    fontWeight: 700,
                    fontSize: 11,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <ShieldAlert size={12} />
                  <span>🌊 DDoS Flood</span>
                </button>

                <button
                  onClick={() => handleTriggerAttack('ransomware', 'Ransomware S3')}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 10,
                    border: '1px solid rgba(191,90,242,0.3)',
                    background: stageState.activeAttack === 'ransomware' ? '#bf5af2' : 'rgba(191,90,242,0.1)',
                    color: stageState.activeAttack === 'ransomware' ? '#000000' : '#bf5af2',
                    fontWeight: 700,
                    fontSize: 11,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Skull size={12} />
                  <span>🔒 Ransomware</span>
                </button>

                <button
                  onClick={() => handleTriggerAttack('bill-shock', 'FinOps Bill Shock')}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 10,
                    border: '1px solid rgba(48,209,88,0.3)',
                    background: stageState.activeAttack === 'bill-shock' ? '#30d158' : 'rgba(48,209,88,0.1)',
                    color: stageState.activeAttack === 'bill-shock' ? '#000000' : '#30d158',
                    fontWeight: 700,
                    fontSize: 11,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <DollarSign size={12} />
                  <span>💸 Bill Shock</span>
                </button>
              </div>
            </div>

            {/* Section 5: Architecture View Modes & Storyline Stages */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 18,
              padding: 16
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', marginBottom: 10 }}>
                ⚖️ Architecture View Mode &amp; Storyline
              </div>

              {/* View Mode */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 10 }}>
                {(['split', 'well-arch-only', 'naive-only'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => sendCmd({ type: 'SET_VIEW_MODE', mode })}
                    style={{
                      padding: '8px 4px',
                      borderRadius: 10,
                      border: 'none',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: stageState.viewMode === mode ? '#ffffff' : 'rgba(255,255,255,0.08)',
                      color: stageState.viewMode === mode ? '#000000' : '#d1d1d6'
                    }}
                  >
                    {mode === 'split' ? 'Split View' : mode === 'well-arch-only' ? 'WAF Only' : 'Naive Only'}
                  </button>
                ))}
              </div>

              {/* Storyline Stages */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6 }}>
                {([
                  { stage: 'requirement' as const, label: '📋 Req' },
                  { stage: 'prescription' as const, label: '💊 Norm' },
                  { stage: 'waf-solution' as const, label: '🛡️ WAF' },
                  { stage: 'theory' as const, label: '📖 Theory' },
                ]).map(({ stage, label }) => (
                  <button
                    key={stage}
                    onClick={() => handleStorylineStage(stage)}
                    style={{
                      padding: '8px 2px',
                      borderRadius: 10,
                      border: '1px solid rgba(255,255,255,0.1)',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: stageState.storylineStage === stage ? 'var(--accent)' : 'rgba(255,255,255,0.06)',
                      color: stageState.storylineStage === stage ? '#000000' : '#d1d1d6'
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Section 6: Launch Big Screen Deep-Dive Simulators & Modals */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 18,
              padding: 16
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#ffffff', textTransform: 'uppercase' }}>
                  🚀 Launch Big Screen Deep-Dive Tools
                </span>
                {stageState.activeModal && (
                  <button
                    onClick={handleCloseModals}
                    style={{ background: '#ff453a', border: 'none', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 6, cursor: 'pointer' }}
                  >
                    Close Modal
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { id: 'advisor', title: '🧠 Architecture Advisor Q&A', desc: 'Guided questions & remediations', color: 'var(--accent)' },
                  { id: '6pillars', title: '🏛️ 6 Pillars Master Explorer', desc: 'Holistic cross-pillar compliance', color: 'var(--accent)' },
                  { id: 'executive', title: '📊 Executive Review & FinOps ROI', desc: 'Cloud spend calculator & HRI savings', color: 'var(--status-healthy)' },
                  { id: 'stresslab', title: '🧪 Incident Stress Lab', desc: 'Multi-vector outage simulator', color: 'var(--status-danger)' },
                  { id: 'latency', title: '✈️ Packet Latency Simulator', desc: 'Edge-to-database benchmark', color: 'var(--accent)' },
                  { id: 'workloads', title: '💼 Client Workload Solutions', desc: 'E-commerce, SaaS, HIPAA healthcare', color: 'var(--status-warning)' },
                  { id: 'subtopics', title: '🔬 Subtopic Deep-Dive Labs', desc: 'RDS Proxy, Aurora Quorum, EBS gp3', color: 'var(--status-healthy)' },
                  { id: 'theory', title: '📖 Theoretical Foundations', desc: 'CAP Theorem, PACELC, Gall\'s Law', color: 'var(--accent)' },
                  { id: 'governance', title: '⚖️ AI Governance & Launch Readiness', desc: 'Checklists and risk compliance', color: 'var(--accent)' }
                ].map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => handleOpenModal(tool.id)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 12,
                      background: stageState.activeModal === tool.id ? 'rgba(255, 153, 0, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                      border: `1px solid ${stageState.activeModal === tool.id ? 'var(--accent)' : 'rgba(255, 255, 255, 0.1)'}`,
                      color: '#fff',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left'
                    }}
                  >
                    <div>
                      <div style={{ color: tool.color, fontWeight: 700 }}>{tool.title}</div>
                      <div style={{ fontSize: 11, color: '#86868b', marginTop: 2 }}>{tool.desc}</div>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--accent)', flexShrink: 0 }}>
                      {stageState.activeModal === tool.id ? '● Active' : 'Open →'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 7: Live Component Spotlights */}
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
                {currentDomain.wellArch.nodes.map(node => (
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

        {/* ========================================================================= */}
        {/* TAB 3: JURY QUESTIONS & EVALUATOR DEFENSE                                 */}
        {/* ========================================================================= */}
        {activeTab === 'qa' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{
              background: 'rgba(48, 209, 88, 0.08)',
              border: '1px solid rgba(48, 209, 88, 0.25)',
              borderRadius: 16,
              padding: 14
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--status-healthy)', textTransform: 'uppercase' }}>
                  🛡️ Certified Architect Defense
                </span>
                <button
                  onClick={() => handleScrollTo('metrics')}
                  style={{ background: 'rgba(48, 209, 88, 0.2)', border: 'none', color: '#30d158', fontSize: 11, padding: '3px 8px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
                >
                  Show Proof on Stage 🎯
                </button>
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
                <div style={{ fontSize: 14, color: '#d1d1d6', lineHeight: 1.55, paddingLeft: 22, borderLeft: '2px solid rgba(255, 159, 10, 0.4)', marginBottom: 10 }}>
                  {q.answer}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      if (primaryNode) handleSpotlight(primaryNode.id, primaryNode.name);
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: 8,
                      cursor: 'pointer'
                    }}
                  >
                    🔦 Spotlight Node Proof
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: KEYNOTE THESIS & CAPSTONE OUTRO                                    */}
        {/* ========================================================================= */}
        {activeTab === 'deck' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Opening Thesis */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 16,
              padding: 16
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' }}>
                  Keynote Opening Thesis (60s)
                </span>
                <button
                  onClick={() => {
                    sendCmd({ type: 'GOTO_MODULE', index: 0 });
                    if (!isPresenter) handlePresenterMode();
                  }}
                  style={{ background: 'var(--accent)', border: 'none', color: '#000', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 8, cursor: 'pointer' }}
                >
                  Start Slide 1 🎬
                </button>
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.6, color: '#e5e5ea', whiteSpace: 'pre-line' }}>
                {generalKeynoteIntro.verbatimScript}
              </div>
            </div>

            {/* Capstone Outro */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 16,
              padding: 16
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--status-healthy)', textTransform: 'uppercase' }}>
                  Executive Capstone Outro &amp; Verdict (60s)
                </span>
                <button
                  onClick={() => {
                    sendCmd({ type: 'GOTO_MODULE', index: 14 });
                    handleScrollTo('metrics');
                  }}
                  style={{ background: '#30d158', border: 'none', color: '#000', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 8, cursor: 'pointer' }}
                >
                  Final Slide 15 📊
                </button>
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.6, color: '#e5e5ea', whiteSpace: 'pre-line' }}>
                {generalKeynoteOutro.verbatimScript}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Presenter Master Controller Dock */}
      <footer style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(10, 12, 16, 0.94)',
        backdropFilter: 'blur(25px) saturate(180%)',
        WebkitBackdropFilter: 'blur(25px) saturate(180%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '10px 16px',
        paddingBottom: 'max(20px, env(safe-area-inset-bottom, 20px))',
        paddingLeft: 'max(16px, env(safe-area-inset-left, 16px))',
        paddingRight: 'max(16px, env(safe-area-inset-right, 16px))',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.75)'
      }}>
        {/* Master Screen Mode Switcher Button */}
        <button
          onClick={handlePresenterMode}
          style={{
            width: '100%',
            padding: '11px 16px',
            borderRadius: 14,
            border: 'none',
            cursor: 'pointer',
            background: isPresenter
              ? 'rgba(255, 255, 255, 0.12)'
              : 'linear-gradient(135deg, rgba(255, 153, 0, 0.92) 0%, rgba(220, 120, 0, 0.92) 100%)',
            color: isPresenter ? '#ffffff' : '#000000',
            fontWeight: 700,
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: isPresenter ? 'none' : '0 4px 18px rgba(255, 153, 0, 0.4)'
          }}
        >
          {isPresenter
            ? <><Monitor size={15} /> <span>Switch Screen to Studio Workspace 💻</span></>
            : <><Play size={15} fill="#000" /> <span>Launch Full 16:9 Presentation Slides 🎬</span></>
          }
        </button>

        {/* Primary Command Quick-Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
          {/* Chaos Trigger button */}
          <button
            onClick={handleTriggerChaos}
            style={{
              padding: '9px 6px',
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              background: stageState.isChaosActive ? '#30d158' : 'rgba(255, 69, 58, 0.22)',
              color: stageState.isChaosActive ? '#000000' : '#ff453a',
              fontWeight: 700,
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4
            }}
          >
            {stageState.isChaosActive ? <RotateCcw size={13} /> : <Zap size={13} />}
            <span>{stageState.isChaosActive ? 'Heal AZ' : 'Fail AZ-1'}</span>
          </button>

          {/* Toggle WAF vs Naive mode */}
          <button
            onClick={handleToggleViewMode}
            style={{
              padding: '9px 6px',
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
              padding: '9px 6px',
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
            <span>Top</span>
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

      {/* Edit Room Code Modal */}
      {isEditingRoom && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20
        }}>
          <div style={{
            background: '#12151b',
            border: '1px solid rgba(255, 153, 0, 0.35)',
            borderRadius: 20,
            padding: 22,
            width: '100%',
            maxWidth: 340,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>
                🔗 Connect to Stage Screen
              </span>
              <button
                onClick={() => setIsEditingRoom(false)}
                style={{ background: 'transparent', border: 'none', color: '#8e8e93', cursor: 'pointer', padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: 12, color: '#8e8e93', margin: 0, lineHeight: 1.4 }}>
              Enter the 4-digit room code shown on the laptop presentation display (e.g. <strong>WAF-1001</strong>).
            </p>

            <form onSubmit={handleSaveRoomCode} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                type="text"
                value={tempRoomInput}
                onChange={e => setTempRoomInput(e.target.value)}
                placeholder="WAF-XXXX"
                autoFocus
                style={{
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: '#ffffff',
                  fontSize: 16,
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  textAlign: 'center',
                  letterSpacing: '0.1em'
                }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setIsEditingRoom(false)}
                  style={{
                    padding: '10px',
                    borderRadius: 12,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: '#8e8e93',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    padding: '10px',
                    borderRadius: 12,
                    border: 'none',
                    background: 'var(--accent)',
                    color: '#000000',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Connect 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeakerCompanionRemote;
