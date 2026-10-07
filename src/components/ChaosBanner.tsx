import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { ChaosPhase, ChaosScenario } from '../types';

interface ChaosBannerProps {
  scenario: ChaosScenario;
  phase: ChaosPhase;
  onReset: () => void;
}

export const ChaosBanner: React.FC<ChaosBannerProps> = ({
  scenario,
  phase,
  onReset
}) => {
  return (
    <div
      className="chaos-banner"
      style={{
        background: 'var(--status-danger-subtle)',
        border: '1px solid rgba(255, 69, 58, 0.3)',
        borderRadius: 'var(--radius-inner)',
        padding: 'var(--space-4)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 'var(--space-4)'
      }}
      role="alert"
    >
      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        <AlertCircle size={18} color="var(--status-danger)" style={{ marginTop: 2, flexShrink: 0 }} />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
              Outage simulation active: {scenario.title}
            </span>
            <span
              style={{
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-pill)',
                background: phase === 'healing' ? 'var(--status-success-subtle)' : 'var(--status-danger-subtle)',
                color: phase === 'healing' ? 'var(--status-success)' : 'var(--status-danger)',
                fontWeight: 600
              }}
            >
              {phase === 'injected' ? 'Phase 1: Outage active' : phase === 'healing' ? 'Phase 2: Self-healing' : 'Resolved'}
            </span>
          </div>

          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 4 }}>
            {scenario.description}
          </p>

          {/* Outcome comparison */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--separator)', borderRadius: 'var(--radius-control)', padding: 'var(--space-2) var(--space-3)', boxShadow: 'inset 0 1px 0 var(--hairline-top)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--status-danger)' }}>
                Anti-pattern: {scenario.naiveConsequence.statusText}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
                Error rate: {scenario.naiveConsequence.errorRate} • Downtime: {scenario.naiveConsequence.downtime}
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--separator)', borderRadius: 'var(--radius-control)', padding: 'var(--space-2) var(--space-3)', boxShadow: 'inset 0 1px 0 var(--hairline-top)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--status-success)' }}>
                Well-Architected: {scenario.wellArchConsequence.statusText}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
                Error rate: {scenario.wellArchConsequence.errorRate} • Failover: {scenario.wellArchConsequence.failoverTime}
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        className="btn-action"
        onClick={onReset}
        style={{ flexShrink: 0, borderRadius: 'var(--radius-pill)', boxShadow: 'inset 0 1px 0 var(--hairline-top)' }}
        aria-label="Reset outage simulation"
      >
        <RotateCcw size={13} />
        <span>Reset</span>
      </button>
    </div>
  );
};
