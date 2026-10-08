import React from 'react';
import { RefreshCw } from 'lucide-react';

interface StageLinkBannerProps {
  isLinked: boolean;
  onReconnect: () => void;
}

/**
 * Shown on the phone whenever it is not linked to the main screen. Without it, taps are dropped
 * silently and the presenter cannot tell that the stage never heard them.
 */
export const StageLinkBanner: React.FC<StageLinkBannerProps> = ({ isLinked, onReconnect }) => {
  if (isLinked) return null;

  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        margin: '12px 16px 0',
        padding: '10px 12px',
        borderRadius: 12,
        background: 'rgba(255, 159, 10, 0.12)',
        border: '1px solid rgba(255, 159, 10, 0.4)',
        color: '#ffd60a',
        fontSize: 12,
        lineHeight: 1.4,
      }}
    >
      <span>
        <strong>Not linked to the stage.</strong> Taps will not reach the main screen until it reconnects.
      </span>
      <button
        type="button"
        onClick={onReconnect}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          minHeight: 44,
          padding: '8px 12px',
          borderRadius: 10,
          border: 'none',
          background: '#ffd60a',
          color: '#000',
          fontSize: 12,
          fontWeight: 700,
          whiteSpace: 'nowrap',
          cursor: 'pointer',
        }}
      >
        <RefreshCw size={14} aria-hidden="true" />
        Reconnect
      </button>
    </div>
  );
};
