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
      {/* Header with filename alone and H2 heading (Audit 3a & 1.15) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--separator)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Terminal size={14} color="var(--text-secondary)" />
          <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            {snippet.filename}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {/* Segmented Tab */}
          <div className="segmented-control" style={{ height: 32, padding: 2 }}>
            <button
              className={`segmented-item ${activeTab === 'well-arch' ? 'active' : ''}`}
              onClick={() => setActiveTab('well-arch')}
              style={{ minHeight: 28 }}
            >
              Well-Architected
            </button>
            <button
              className={`segmented-item ${activeTab === 'naive' ? 'active' : ''}`}
              onClick={() => setActiveTab('naive')}
              style={{ minHeight: 28 }}
            >
              Anti-pattern
            </button>
          </div>

          <button
            className="btn-action"
            onClick={handleCopy}
            style={{ minHeight: 32, fontSize: 11, padding: '0 12px', borderRadius: 'var(--radius-pill)', boxShadow: 'inset 0 1px 0 var(--hairline-top)' }}
            aria-label="Copy code snippet"
          >
            {copied ? <Check size={12} color="var(--status-success)" /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Code Block with line numbers */}
      <div className="iac-code-wrap">
        <div className="iac-line-numbers" aria-hidden="true">
          {snippet.code.split('\n').map((_, i) => (
            <span key={i} className="iac-line-num">{i + 1}</span>
          ))}
        </div>
        <pre className="iac-pre">
          <code>{snippet.code}</code>
        </pre>
      </div>

      {/* Notes footer */}
      {snippet.notes && (
        <div style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 12, color: 'var(--text-secondary)', borderTop: '1px solid var(--separator-subtle)', background: 'var(--bg-surface)' }}>
          {snippet.notes}
        </div>
      )}
    </div>
  );
};

export default IaCInspector;
