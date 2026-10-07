import React from 'react';
import { Smartphone, Zap, Eye, Compass, RotateCcw, LayoutTemplate } from 'lucide-react';

interface StageRemoteHUDToastProps {
  speakerName: string | null;
  actionNotice: string | null;
  isVisible: boolean;
}

export const StageRemoteHUDToast: React.FC<StageRemoteHUDToastProps> = ({
  speakerName,
  actionNotice,
  isVisible
}) => {
  if (!isVisible || !actionNotice) return null;

  const isDevarsh = speakerName?.includes('Devarsh');
  const isAman = speakerName?.includes('Aman');

  // Determine icon based on action notice text
  const getActionIcon = () => {
    if (actionNotice.includes('Chaos') || actionNotice.includes('Outage')) {
      return <Zap size={15} color="var(--status-critical)" className="pulse-element" />;
    }
    if (actionNotice.includes('Focused') || actionNotice.includes('Spotlight')) {
      return <Eye size={15} color="var(--accent)" />;
    }
    if (actionNotice.includes('Scroll') || actionNotice.includes('Navigated')) {
      return <Compass size={15} color="var(--accent)" />;
    }
    if (actionNotice.includes('Reset') || actionNotice.includes('Healed')) {
      return <RotateCcw size={15} color="var(--status-healthy)" />;
    }
    return <LayoutTemplate size={15} color="var(--accent)" />;
  };

  return (
    <aside
      aria-live="polite"
      aria-label="Presenter remote command execution status"
      style={{
        position: 'fixed',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 18px',
        borderRadius: 'var(--radius-pill)',
        background: 'rgba(11, 13, 16, 0.88)',
        backdropFilter: 'blur(24px) saturate(190%)',
        WebkitBackdropFilter: 'blur(24px) saturate(190%)',
        border: '1px solid rgba(255, 153, 0, 0.35)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.08), 0 0 20px rgba(255, 153, 0, 0.15)',
        animation: 'slideDownFade 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        maxWidth: '92vw'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 26,
        height: 26,
        borderRadius: '50%',
        background: isDevarsh ? 'rgba(10, 132, 255, 0.15)' : isAman ? 'rgba(255, 153, 0, 0.15)' : 'rgba(255, 255, 255, 0.1)',
        border: `1px solid ${isDevarsh ? 'rgba(10, 132, 255, 0.4)' : isAman ? 'rgba(255, 153, 0, 0.4)' : 'rgba(255, 255, 255, 0.2)'}`
      }}>
        <Smartphone size={13} color={isDevarsh ? '#0a84ff' : isAman ? 'var(--accent)' : '#fff'} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
        {speakerName && (
          <span style={{
            fontWeight: 700,
            color: isDevarsh ? '#5ac8fa' : isAman ? '#ffb340' : '#ffffff',
            letterSpacing: '0.01em'
          }}>
            {speakerName}:
          </span>
        )}
        <span style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
          {getActionIcon()}
          <span>{actionNotice}</span>
        </span>
      </div>
    </aside>
  );
};

export default StageRemoteHUDToast;
