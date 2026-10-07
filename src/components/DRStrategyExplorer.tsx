import React, { useState } from 'react';
import { drStrategies } from '../data';
import { Clock, ShieldCheck, DollarSign } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

export const DRStrategyExplorer: React.FC = () => {
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>('multi-region-active');

  const currentStrategy = drStrategies.find(s => s.id === selectedStrategyId) || drStrategies[3];

  return (
    <div className="card-apple" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <div>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 500 }}>
          Interactive Disaster Recovery Engine
        </span>
        <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
          AWS 4-Tier DR Strategies (Trade-off Matrix)
        </h4>
      </div>

      {/* 4 Strategy Cards */}
      <div className="dr-strategy-selector-grid">
        {drStrategies.map((strat) => {
          const isActive = strat.id === selectedStrategyId;
          return (
            <div
              key={strat.id}
              onClick={() => {
                soundFX.playClick();
                setSelectedStrategyId(strat.id);
              }}
              style={{
                background: isActive ? 'var(--accent-subtle)' : 'var(--bg-canvas)',
                border: `1px solid ${isActive ? 'var(--accent)' : 'var(--separator)'}`,
                boxShadow: isActive ? '0 2px 12px rgba(41, 151, 255, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)' : 'inset 0 1px 0 var(--hairline-top)',
                borderRadius: 'var(--radius-control)',
                padding: 'var(--space-3)',
                cursor: 'pointer',
                transition: 'all var(--duration-fast) var(--ease-spring)',
                userSelect: 'none'
              }}
              role="button"
              tabIndex={0}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: isActive ? 'var(--accent)' : 'var(--text-primary)', marginBottom: 6 }}>
                {strat.name}
              </div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', fontVariantNumeric: 'tabular-nums' }}>
                <span>RPO:</span>
                <span style={{ color: 'var(--text-primary)' }}>{strat.rpo}</span>
              </div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
                <span>RTO:</span>
                <span style={{ color: 'var(--text-primary)' }}>{strat.rto}</span>
              </div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--status-success)', display: 'flex', justifyContent: 'space-between', marginTop: 4, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                <span>Cost:</span>
                <span>{strat.costMultiplier}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Pane */}
      <div className="dr-detail-grid">
        <div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 600 }}>
            {currentStrategy.name} architecture
          </span>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginTop: 4, lineHeight: 1.45 }}>
            {currentStrategy.description}
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.4 }}>
            <strong>Recommendation: </strong> {currentStrategy.architectureNotes}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', padding: '6px 12px', borderRadius: 'var(--radius-control)', border: '1px solid var(--separator-subtle)', fontSize: 12 }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={13} /> Target RTO:
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
              {currentStrategy.rto}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', padding: '6px 12px', borderRadius: 'var(--radius-control)', border: '1px solid var(--separator-subtle)', fontSize: 12 }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={13} color="var(--status-success)" /> Target RPO:
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
              {currentStrategy.rpo}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', padding: '6px 12px', borderRadius: 'var(--radius-control)', border: '1px solid var(--separator-subtle)', fontSize: 12 }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <DollarSign size={13} color="var(--accent)" /> Estimated spend:
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
              {currentStrategy.costEstimate} ({currentStrategy.costMultiplier})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
