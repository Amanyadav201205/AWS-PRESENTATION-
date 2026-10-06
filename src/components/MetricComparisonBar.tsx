import React from 'react';
import { MetricComparison } from '../types';

interface MetricBarProps {
  metrics: MetricComparison[];
}

export const MetricComparisonBar: React.FC<MetricBarProps> = ({ metrics }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 500 }}>
        Quantitative architectural metrics
      </span>

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
    </div>
  );
};
