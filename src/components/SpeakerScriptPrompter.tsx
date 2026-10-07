import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  HelpCircle,
  Eye,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import {
  domainPresentationScripts,
  generalKeynoteIntro,
  generalKeynoteOutro,
  DomainPresentationScript
} from '../data/presentationScripts';
import {
  soundFX
} from '../utils/soundEffects';

interface SpeakerScriptPrompterProps {
  currentDomainIndex: number;
  totalDomains: number;
  onSelectDomainIndex: (idx: number) => void;
  onClose: () => void;
}

export const SpeakerScriptPrompter: React.FC<SpeakerScriptPrompterProps> = ({
  currentDomainIndex,
  totalDomains,
  onSelectDomainIndex,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'current' | 'intro' | 'conclusion'>('current');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [copied, setCopied] = useState<boolean>(false);

  const currentScript: DomainPresentationScript = domainPresentationScripts[currentDomainIndex] || domainPresentationScripts[0];

  const handleCopyScript = () => {
    soundFX.playClick();
    let textToCopy = '';
    if (activeTab === 'intro') {
      textToCopy = `=== AWS WELL-ARCHITECTED FRAMEWORK - KEYNOTE INTRO ===\n\n${generalKeynoteIntro.verbatimScript}`;
    } else if (activeTab === 'conclusion') {
      textToCopy = `=== AWS WELL-ARCHITECTED FRAMEWORK - EXECUTIVE VERDICT ===\n\n${generalKeynoteOutro.verbatimScript}`;
    } else {
      textToCopy = `=== MODULE ${currentScript.domainNumber + 1}: ${currentScript.domainTitle} ===\n\nHOOK: ${currentScript.openingHook}\n\nVERBATIM SCRIPT:\n${currentScript.verbatimScript}\n\nSCREEN ACTION CUE:\n${currentScript.screenActionCue}\n\nARCHITECT DEFENSE:\n${currentScript.architectDefense}\n\nANTICIPATED JURY QUESTIONS:\n${currentScript.juryQuestions.map(q => `Q: ${q.question}\nA: ${q.answer}`).join('\n\n')}`;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFontSizeStyle = () => {
    switch (fontSize) {
      case 'sm': return { fontSize: '14px', lineHeight: '1.6' };
      case 'lg': return { fontSize: '19px', lineHeight: '1.7' };
      case 'base':
      default: return { fontSize: '16px', lineHeight: '1.65' };
    }
  };

  return (
    <div className="sheet-overlay" role="dialog" aria-modal="true" aria-label="Speaker Script and Defense Prompter">
      <div className="presenter-dialog prompter-sheet" style={{ maxWidth: 860, maxHeight: '90dvh' }}>
        {/* Prompter Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--separator)', paddingBottom: 'var(--space-3)', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>🎙️</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Certified Architect Presentation Prompter
                </h2>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 'var(--radius-pill)', background: 'var(--accent-subtle)', color: 'var(--accent)', fontWeight: 600 }}>
                  Live Defense Teleprompter
                </span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                Word-for-word spoken transcript, live screen action cues, and anticipated jury questions
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Font Size Selector */}
            <div className="segmented-control" style={{ height: 26, padding: 1 }}>
              <button 
                className={`segmented-item ${fontSize === 'sm' ? 'active' : ''}`}
                onClick={() => setFontSize('sm')}
                style={{ padding: '2px 8px', fontSize: 11, minHeight: 22 }}
                title="Smaller script text"
              >
                A-
              </button>
              <button 
                className={`segmented-item ${fontSize === 'base' ? 'active' : ''}`}
                onClick={() => setFontSize('base')}
                style={{ padding: '2px 8px', fontSize: 11, minHeight: 22 }}
                title="Default script text"
              >
                A
              </button>
              <button 
                className={`segmented-item ${fontSize === 'lg' ? 'active' : ''}`}
                onClick={() => setFontSize('lg')}
                style={{ padding: '2px 8px', fontSize: 11, minHeight: 22 }}
                title="Large podium script text"
              >
                A+
              </button>
            </div>

            {/* Copy Script */}
            <button
              className="btn-action"
              onClick={handleCopyScript}
              style={{ height: 28, fontSize: 12, gap: 5, borderRadius: 'var(--radius-pill)', boxShadow: 'inset 0 1px 0 var(--hairline-top)' }}
              title="Copy current presentation script to clipboard"
            >
              {copied ? <Check size={13} color="var(--status-success)" /> : <Copy size={13} />}
              <span>{copied ? 'Copied!' : 'Copy Script'}</span>
            </button>

            {/* Close */}
            <button
              className="btn-action btn-icon"
              onClick={() => {
                soundFX.playClick();
                onClose();
              }}
              aria-label="Close prompter"
              style={{
                width: 30,
                height: 30,
                borderRadius: 'var(--radius-pill)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--separator)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                flexShrink: 0
              }}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--separator-subtle)', padding: 'var(--space-2) 0', flexWrap: 'wrap', gap: 8 }}>
          <div className="segmented-control">
            <button
              className={`segmented-item ${activeTab === 'intro' ? 'active' : ''}`}
              onClick={() => setActiveTab('intro')}
            >
              <span>1. Keynote Intro</span>
            </button>
            <button
              className={`segmented-item ${activeTab === 'current' ? 'active' : ''}`}
              onClick={() => setActiveTab('current')}
            >
              <span>2. Module {currentScript.domainNumber + 1} ({currentScript.domainTitle})</span>
            </button>
            <button
              className={`segmented-item ${activeTab === 'conclusion' ? 'active' : ''}`}
              onClick={() => setActiveTab('conclusion')}
            >
              <span>3. Executive Conclusion</span>
            </button>
          </div>

          {activeTab === 'current' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                className="btn-action"
                onClick={() => onSelectDomainIndex(Math.max(0, currentDomainIndex - 1))}
                disabled={currentDomainIndex === 0}
                style={{ height: 26, fontSize: 11, padding: '0 10px', borderRadius: 'var(--radius-pill)', boxShadow: 'inset 0 1px 0 var(--hairline-top)' }}
              >
                <ChevronLeft size={12} /> Prev Module
              </button>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                {currentDomainIndex + 1} / {totalDomains}
              </span>
              <button
                className="btn-action"
                onClick={() => onSelectDomainIndex(Math.min(totalDomains - 1, currentDomainIndex + 1))}
                disabled={currentDomainIndex === totalDomains - 1}
                style={{ height: 26, fontSize: 11, padding: '0 10px', borderRadius: 'var(--radius-pill)', boxShadow: 'inset 0 1px 0 var(--hairline-top)' }}
              >
                Next Module <ChevronRight size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div style={{ overflowY: 'auto', paddingRight: 6, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', flex: 1, marginTop: 'var(--space-3)' }}>
          {activeTab === 'intro' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--separator)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)', boxShadow: 'inset 0 1px 0 var(--hairline-top)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-2)' }}>
                  <Sparkles size={16} color="var(--accent)" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Presentation Opening Hook (Estimated: ~60 Seconds)
                  </span>
                </div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>
                  {generalKeynoteIntro.title}
                </h3>
                <div style={{ ...getFontSizeStyle(), color: 'var(--text-primary)', whiteSpace: 'pre-line' }}>
                  {generalKeynoteIntro.verbatimScript}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'conclusion' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--separator)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)', boxShadow: 'inset 0 1px 0 var(--hairline-top)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-2)' }}>
                  <ShieldCheck size={16} color="var(--status-success)" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--status-success)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Executive Closing Statement (Estimated: ~60 Seconds)
                  </span>
                </div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>
                  {generalKeynoteOutro.title}
                </h3>
                <div style={{ ...getFontSizeStyle(), color: 'var(--text-primary)', whiteSpace: 'pre-line' }}>
                  {generalKeynoteOutro.verbatimScript}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'current' && (
            <>
              {/* Speaker Opening Hook Box */}
              <div style={{ background: 'rgba(41, 151, 255, 0.08)', border: '1px solid rgba(41, 151, 255, 0.25)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-3)', boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' }}>
                    ⚡ 10-Second Attention Hook
                  </span>
                </div>
                <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)', fontStyle: 'italic' }}>
                  "{currentScript.openingHook}"
                </p>
              </div>

              {/* Main Spoken Verbatim Script */}
              <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--separator)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)', boxShadow: 'inset 0 1px 0 var(--hairline-top)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    🎙️ Word-for-Word Presentation Script (Read to Jury / Class)
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>
                    Pacing: ~90-120 seconds
                  </span>
                </div>
                <div style={{ ...getFontSizeStyle(), color: 'var(--text-primary)', whiteSpace: 'pre-line' }}>
                  {currentScript.verbatimScript}
                </div>
              </div>

              {/* Live Screen Action Cue (What is animating on the screen behind the speaker) */}
              <div style={{ background: 'rgba(255, 159, 10, 0.08)', border: '1px solid rgba(255, 159, 10, 0.25)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-3)', boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Eye size={14} color="var(--status-warning)" />
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--status-warning)', textTransform: 'uppercase' }}>
                    Live Screen Cue (What the audience sees behind you right now)
                  </span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-primary)' }}>
                  {currentScript.screenActionCue}
                </p>
              </div>

              {/* Certified Architect Defense Tip */}
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--separator)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-3)', boxShadow: 'inset 0 1px 0 var(--hairline-top)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <ShieldCheck size={14} color="var(--status-success)" />
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--status-success)', textTransform: 'uppercase' }}>
                    Certified Cloud Architect Defense Rationale
                  </span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  {currentScript.architectDefense}
                </p>
              </div>

              {/* Anticipated Jury Questions & Answers */}
              <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--separator)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)', boxShadow: 'inset 0 1px 0 var(--hairline-top)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 'var(--space-3)' }}>
                  <HelpCircle size={15} color="var(--accent)" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                    Anticipated Professor / Jury Questions & Certified Rebuttals
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {currentScript.juryQuestions.map((q, idx) => (
                    <div key={idx} style={{ background: 'var(--bg-surface)', border: '1px solid var(--separator-subtle)', borderRadius: 'var(--radius-control)', padding: 'var(--space-3)', boxShadow: 'inset 0 1px 0 var(--hairline-top)' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', marginBottom: 4 }}>
                        Q: "{q.question}"
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                        <strong>Architect Answer:</strong> {q.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
