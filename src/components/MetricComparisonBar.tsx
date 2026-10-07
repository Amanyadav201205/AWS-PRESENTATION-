import React from 'react';
import { MetricComparison } from '../types';

interface MetricBarProps {
  metrics: MetricComparison[];
}

export const MetricComparisonBar: React.FC<MetricBarProps> = ({ metrics }) => {
  return (
    <section className="metrics-section" aria-labelledby="metrics-heading" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 id="metrics-heading" style={{ fontSize: 'var(--text-base)', color: 'var(--text-primary)', fontWeight: 600 }}>
          Before / after
        </h2>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          Direct architectural comparison
        </span>
      </div>

      <div className="metric-quad-grid">
        {metrics.map((m, idx) => (
          <div key={idx} className="metric-cell">
            <span className="metric-cell-label">{m.label}</span>
            <div className="metric-cell-values">
              <span className="val-naive">{m.naiveValue}</span>
              <span className="val-wellarch">{m.wellArchValue}</span>
            </div>
            <p className="metric-cell-caption">{m.explanation}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MetricComparisonBar;
