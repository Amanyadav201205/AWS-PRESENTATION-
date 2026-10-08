import React, { useState } from 'react';
import { allDomains } from '../data';
import { talkTrackBeats } from '../data/talkTrackBeats';
import { TalkSpeaker } from '../data/talkTrackTypes';
import { estimateBeatSeconds, estimateSecondsForLines, estimateTalkSeconds, formatClock, TALK_LIMIT_SECONDS } from '../data/talkTrackTiming';

export type SendLine = (index: number) => boolean;

interface TalkTrackPanelProps {
  isLinked: boolean;
  /** Line now on the big screen, from the stage. -1 before the talk starts. */
  /** Line now on the big screen. Undefined until the laptop has sent its state after linking. */
  stageLineIndex: number | undefined;
  elapsedSeconds: number;
  sendLine: SendLine;
  onHaptic: () => void;
}

type SendStatus = 'idle' | 'sent' | 'failed';

const LAST_INDEX = talkTrackBeats.length - 1;
const SPEAKER_NAMES: Record<TalkSpeaker, string> = { devarsh: 'Devarsh', aman: 'Aman' };
const SPEAKER_COLORS: Record<TalkSpeaker, string> = { devarsh: '#64d2ff', aman: '#ffd60a' };

const COLORS = {
  surface: '#1c1c1e',
  text: '#f5f5f7',
  textSecondary: '#aeaeb2',
  success: '#30d158',
  warning: '#ffd60a',
  danger: '#ff6961',
  accent: '#0a84ff',
  signal: '#ff9f0a'
} as const;

// Reduced-motion users get no transitions. Inline styles cannot express media queries, so this is injected once.
const MOTION_CSS = `
.talk-track-cta { transition: transform 120ms ease, filter 120ms ease; }
.talk-track-cta:active:not(:disabled) { transform: scale(0.98); filter: brightness(0.92); }
@media (prefers-reduced-motion: reduce) { .talk-track-cta { transition: none; } }
`;

const card: React.CSSProperties = {
  background: COLORS.surface,
  borderRadius: 18,
  padding: '16px 18px',
  display: 'flex',
  flexDirection: 'column',
  gap: 10
};

const statCell: React.CSSProperties = { ...card, borderRadius: 16, padding: '12px 12px 10px', gap: 2, minWidth: 0 };
const statNumeral: React.CSSProperties = { fontSize: 28, fontWeight: 700, lineHeight: 1.05, color: COLORS.text, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' };
const statCaption: React.CSSProperties = { fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.textSecondary };

const segmentButton = (enabled: boolean, isFirst: boolean, isLast: boolean): React.CSSProperties => ({
  flex: 1,
  minHeight: 48,
  border: 'none',
  borderRight: isLast ? 'none' : '1px solid rgba(255,255,255,0.08)',
  borderRadius: isFirst ? '14px 0 0 14px' : isLast ? '0 14px 14px 0' : 0,
  background: COLORS.surface,
  color: enabled ? COLORS.text : COLORS.textSecondary,
  fontSize: 15,
  fontWeight: 600,
  cursor: enabled ? 'pointer' : 'default',
  opacity: enabled ? 1 : 0.5
});

const primaryLabel = (index: number | undefined, isLinked: boolean): string => {
  if (!isLinked) return 'Not linked. Follow the laptop';
  if (index === undefined) return 'Syncing with the laptop…';
  if (index < 0) return 'Start the talk';
  if (index >= LAST_INDEX) return 'Talk complete';
  return 'Next line';
};

const statusLine = (sendStatus: SendStatus, isLinked: boolean): string => {
  if (sendStatus === 'failed') return 'That did not reach the big screen. Check the link, then try again.';
  if (!isLinked) return 'The big screen is not linked. The laptop keys still control the talk.';
  return '';
};

export const TalkTrackPanel: React.FC<TalkTrackPanelProps> = ({ isLinked, stageLineIndex: stageLine, elapsedSeconds, sendLine, onHaptic }) => {
  const [sendStatus, setSendStatus] = useState<SendStatus>('idle');
  // Until the laptop has reported its line, show the opening and send nothing: a tap now could move the stage
  const isSynced = stageLine !== undefined;
  const stageLineIndex = stageLine ?? -1;
  const focusBeat = talkTrackBeats[Math.max(stageLineIndex, 0)];
  const focusTitle = allDomains[focusBeat.domainIndex]?.title ?? '';
  const plannedSoFar = estimateSecondsForLines(stageLineIndex + 1);
  const plannedTotal = estimateTalkSeconds();
  const progressPercent = ((stageLineIndex + 1) / talkTrackBeats.length) * 100;
  const canAdvance = isLinked && isSynced && stageLineIndex < LAST_INDEX;

  const send = (index: number) => {
    onHaptic();
    setSendStatus(sendLine(index) ? 'sent' : 'failed');
  };

  const handleRestart = () => {
    if (!window.confirm('Restart the talk from the first line?')) return;
    send(-1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <style>{MOTION_CSS}</style>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
        <div style={statCell}>
          <span key={`line-${stageLineIndex}`} className="num-pop" style={statNumeral}>{Math.max(stageLineIndex + 1, 0)}</span>
          <span style={statCaption}>of {talkTrackBeats.length} lines</span>
        </div>
        <div style={statCell}>
          <span style={statNumeral}>{formatClock(plannedSoFar)}</span>
          <span style={statCaption}>planned so far</span>
        </div>
        <div style={statCell}>
          <span style={statNumeral}>{formatClock(elapsedSeconds)}</span>
          <span style={statCaption}>of {formatClock(TALK_LIMIT_SECONDS)} max</span>
        </div>
      </div>

      <div aria-hidden="true" style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progressPercent}%`, background: `linear-gradient(90deg, ${COLORS.success}, #64d2ff)`, transition: 'width 200ms ease' }} />
      </div>

      {statusLine(sendStatus, isLinked) && (
        <div role="status" style={{ ...card, background: 'rgba(255,214,10,0.10)', border: '1px solid rgba(255,214,10,0.35)', fontSize: 14, color: COLORS.warning }}>
          {statusLine(sendStatus, isLinked)}
        </div>
      )}

      <div
        className="talk-focus talk-spot"
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`);
          event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`);
        }}
        style={{ ...card, borderLeft: `4px solid ${SPEAKER_COLORS[focusBeat.speaker]}`, padding: '16px 18px 16px 16px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: SPEAKER_COLORS[focusBeat.speaker] }}>
            {SPEAKER_NAMES[focusBeat.speaker]} · {stageLineIndex < 0 ? 'opening line' : 'say this now'}
          </span>
          <span style={{ fontSize: 12, color: COLORS.textSecondary }}>{focusTitle}</span>
        </div>
        <p style={{ fontSize: 24, fontWeight: 650, lineHeight: 1.3, color: COLORS.text, margin: '2px 0 0', letterSpacing: '-0.01em' }}>
          {focusBeat.say.split(' ').map((word, wordIndex) => (
            <React.Fragment key={`${focusBeat.id}-${wordIndex}`}>
              <span className="talk-word" style={{ '--i': wordIndex } as React.CSSProperties}>{word}</span>{' '}
            </React.Fragment>
          ))}
        </p>
        <span style={{ fontSize: 12, color: COLORS.textSecondary }}>About {Math.round(estimateBeatSeconds(focusBeat))} seconds</span>
      </div>

      <div style={{ ...card, background: 'rgba(255,159,10,0.08)', border: '1px solid rgba(255,159,10,0.28)' }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: COLORS.signal }}>
          {stageLineIndex < 0 ? 'Big screen will show' : 'On the big screen'}
        </span>
        <p style={{ fontSize: 16, color: COLORS.text, margin: 0, lineHeight: 1.4 }}>{focusBeat.show}</p>
        {focusBeat.formula && (
          <code style={{ fontSize: 14, color: COLORS.warning, background: 'rgba(0,0,0,0.4)', borderRadius: 10, padding: '8px 10px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {focusBeat.formula}
          </code>
        )}
      </div>

      <button
        type="button"
        className="talk-track-cta"
        onClick={() => send(stageLineIndex + 1)}
        disabled={!canAdvance}
        style={{
          minHeight: 72,
          borderRadius: 20,
          border: 'none',
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: '-0.01em',
          cursor: canAdvance ? 'pointer' : 'default',
          color: canAdvance ? '#ffffff' : COLORS.textSecondary,
          background: canAdvance ? `linear-gradient(135deg, ${COLORS.accent}, #5e5ce6)` : '#2c2c2e',
          boxShadow: canAdvance ? '0 10px 30px rgba(0,0,0,0.45)' : 'none'
        }}
      >
        {primaryLabel(stageLine, isLinked)}{canAdvance ? ' →' : ''}
      </button>

      <div role="group" aria-label="Line controls" style={{ display: 'flex', borderRadius: 14, background: COLORS.surface, overflow: 'hidden' }}>
        <button type="button" onClick={() => send(stageLineIndex - 1)} disabled={!isLinked || stageLineIndex <= 0} style={segmentButton(isLinked && stageLineIndex > 0, true, false)}>
          ‹ Back
        </button>
        <button type="button" onClick={() => send(stageLineIndex)} disabled={!isLinked || stageLineIndex < 0} style={segmentButton(isLinked && stageLineIndex >= 0, false, false)}>
          Show again
        </button>
        <button type="button" onClick={handleRestart} disabled={!isLinked || stageLineIndex < 0} style={segmentButton(isLinked && stageLineIndex >= 0, false, true)}>
          Restart
        </button>
      </div>

      {focusBeat && stageLineIndex < LAST_INDEX && (
        <div style={{ ...card, padding: '12px 16px', gap: 4 }}>
          <span style={{ fontSize: 12, color: COLORS.textSecondary }}>
            Up next · {SPEAKER_NAMES[talkTrackBeats[stageLineIndex + 1].speaker]}
          </span>
          <span style={{ fontSize: 14, color: '#d1d1d6', lineHeight: 1.45 }}>{talkTrackBeats[stageLineIndex + 1].say}</span>
        </div>
      )}

      <details style={{ ...card, padding: '12px 16px' }}>
        <summary style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, cursor: 'pointer', minHeight: 44 }}>
          All {talkTrackBeats.length} lines in order · {formatClock(plannedTotal)} planned
        </summary>
        <ol style={{ margin: '8px 0 0', padding: '0 0 0 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {talkTrackBeats.map((beat, index) => (
            <li key={beat.id} aria-current={index === stageLineIndex ? 'step' : undefined} style={{ fontSize: 14, lineHeight: 1.45, color: index === stageLineIndex ? COLORS.text : COLORS.textSecondary, fontWeight: index === stageLineIndex ? 650 : 400 }}>
              <span style={{ color: SPEAKER_COLORS[beat.speaker], fontWeight: 700 }}>{SPEAKER_NAMES[beat.speaker]}: </span>
              {beat.say}
            </li>
          ))}
        </ol>
      </details>
    </div>
  );
};
