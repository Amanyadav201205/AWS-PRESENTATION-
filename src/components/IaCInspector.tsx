import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import { ArchitectureSpec } from '../types';

interface IaCProps {
  naiveIaC: ArchitectureSpec['iacSnippet'];
  wellArchIaC: ArchitectureSpec['iacSnippet'];
}

export const IaCInspector: React.FC<IaCProps> = ({ naiveIaC, wellArchIaC }) => {
  const [activeTab, setActiveTab] = useState<'well-arch' | 'naive'>('well-arch');
  const [copied, setCopied] = useState(false);

  const snippet = activeTab === 'well-arch' ? wellArchIaC : naiveIaC;

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card-apple" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', padding: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--separator)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Terminal size={14} color="var(--text-secondary)" />
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)' }}>
            Infrastructure specification
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
            ({snippet.filename})
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {/* Segmented Tab */}
          <div className="segmented-control">
            <button
              className={`segmented-item ${activeTab === 'well-arch' ? 'active' : ''}`}
              onClick={() => setActiveTab('well-arch')}
            >
              Well-Architected
            </button>
            <button
              className={`segmented-item ${activeTab === 'naive' ? 'active' : ''}`}
              onClick={() => setActiveTab('naive')}
            >
              Anti-pattern
            </button>
          </div>

          <button
            className="btn-action"
            onClick={handleCopy}
            style={{ height: 28, fontSize: 11, padding: '0 8px' }}
            aria-label="Copy code snippet"
          >
            {copied ? <Check size={12} color="var(--status-success)" /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Code body */}
      <pre
        style={{
          margin: 0,
          padding: 'var(--space-4)',
          background: 'var(--bg-canvas)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          lineHeight: 1.6,
          overflowX: 'auto',
          maxHeight: 220
        }}
      >
        <code>{snippet.code}</code>
      </pre>

      {/* Footer annotation */}
      <div style={{ padding: '8px var(--space-4)', borderTop: '1px solid var(--separator)', fontSize: 11, color: 'var(--text-secondary)' }}>
        {snippet.notes}
      </div>
    </div>
  );
};
