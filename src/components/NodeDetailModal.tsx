import React, { useEffect } from 'react';
import { X, Cpu, Database, Server, HardDrive, Globe } from 'lucide-react';
import { ArchitectureNode } from '../types';
import { soundFX } from '../utils/soundEffects';

interface NodeModalProps {
  node: ArchitectureNode | null;
  onClose: () => void;
  isWellArchNode: boolean;
}

export const NodeDetailModal: React.FC<NodeModalProps> = ({
  node,
  onClose,
  isWellArchNode
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!node) return null;

  const getNodeIcon = (type: ArchitectureNode['type']) => {
    switch (type) {
      case 'compute': return <Cpu size={16} />;
      case 'database': return <Database size={16} />;
      case 'storage': return <HardDrive size={16} />;
      case 'client': return <Globe size={16} />;
      default: return <Server size={16} />;
    }
  };

  return (
    <div className="sheet-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="sheet-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--separator)', paddingBottom: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ color: isWellArchNode ? 'var(--status-success)' : 'var(--status-danger)' }}>
              {getNodeIcon(node.type)}
            </span>
            <div>
              <h3 id="modal-title" style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)' }}>
                {node.name}
              </h3>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                {node.service} {node.tier ? `• ${node.tier}` : ''} {node.az ? `• ${node.az}` : ''}
              </span>
            </div>
          </div>

          <button
            className="btn-action btn-icon"
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            aria-label="Close modal"
          >
            <X size={15} />
          </button>
        </div>

        {/* Status Callout: three honest states (was: every non-SPOF node claimed multi-AZ HA) */}
        {node.isSPOF ? (
          <div style={{ background: 'var(--status-danger-subtle)', border: '1px solid rgba(255, 69, 58, 0.25)', borderRadius: 'var(--radius-control)', padding: 'var(--space-2) var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--status-danger)' }}>
            <strong>Single point of failure: </strong> Loss of this node halts application traffic.
          </div>
        ) : isWellArchNode ? (
          <div style={{ background: 'var(--status-success-subtle)', border: '1px solid rgba(48, 209, 88, 0.25)', borderRadius: 'var(--radius-control)', padding: 'var(--space-2) var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--status-success)' }}>
            <strong>Resilient component: </strong> Part of the redundant, multi-AZ design.
          </div>
        ) : (
          <div style={{ background: 'var(--status-warning-subtle)', border: '1px solid rgba(255, 159, 10, 0.25)', borderRadius: 'var(--radius-control)', padding: 'var(--space-2) var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--status-warning)' }}>
            <strong>Part of the anti-pattern: </strong> Not a single point of failure on its own, but it depends on the fragile components around it.
          </div>
        )}

        {/* Specs & Security */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-3)' }}>
          <div style={{ background: 'var(--bg-canvas)', border: '1px solid var(--separator-subtle)', borderRadius: 'var(--radius-control)', padding: 'var(--space-3)' }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)' }}>Component specs</span>
            <p style={{ fontSize: 12, color: 'var(--text-primary)', marginTop: 4, lineHeight: 1.4 }}>
              {node.configDetails?.specs || node.description || 'Standard cloud instance configuration'}
            </p>
          </div>

          <div style={{ background: 'var(--bg-canvas)', border: '1px solid var(--separator-subtle)', borderRadius: 'var(--radius-control)', padding: 'var(--space-3)' }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)' }}>Security & isolation</span>
            <p style={{ fontSize: 12, color: 'var(--text-primary)', marginTop: 4, lineHeight: 1.4 }}>
              {node.configDetails?.securityPolicy || 'Default perimeter boundary rules'}
            </p>
          </div>
        </div>

        {/* Cost & Role */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, borderTop: '1px solid var(--separator)', paddingTop: 8 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Cost profile:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
              {node.configDetails?.costProfile || 'Standard AWS pricing'}
            </span>
          </div>

          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4, background: 'var(--bg-subtle)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-control)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>{isWellArchNode ? 'Well-Architected role: ' : 'How the Well-Architected design fixes this: '}</strong>
            {node.configDetails?.wafAdvantage || node.description}
          </div>
        </div>
      </div>
    </div>
  );
};
