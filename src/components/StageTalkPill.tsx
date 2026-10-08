import React from 'react';

interface StageTalkPillProps {
  /** Line on the big screen. -1 before the talk starts. */
  index: number;
  total: number;
}

const PILL_STYLE: React.CSSProperties = {
  position: 'fixed',
  bottom: 16,
  right: 16,
  zIndex: 1000,
  pointerEvents: 'none',
  padding: '6px 12px',
  borderRadius: 999,
  background: 'rgba(0, 0, 0, 0.55)',
  border: '1px solid rgba(255, 255, 255, 0.14)',
  color: '#f5f5f7',
  fontSize: 12,
  fontWeight: 600,
  fontVariantNumeric: 'tabular-nums',
  backdropFilter: 'blur(8px)'
};

/** Shows where the talk is. Audience-safe: it shows a count, never the script. */
export const StageTalkPill: React.FC<StageTalkPillProps> = ({ index, total }) => {
  const label = index < 0 ? `Talk ready · Space starts it` : `Talk · line ${index + 1} of ${total}`;
  return (
    <div key={index} className="talk-pill-pop talk-pill-host" role="status" aria-live="polite" style={PILL_STYLE}>
      {label}
    </div>
  );
};
