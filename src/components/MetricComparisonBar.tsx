import React from 'react';
import { MetricComparison } from '../types';

interface MetricBarProps {
  metrics: MetricComparison[];
}

export const MetricComparisonBar: React.FC<MetricBarProps> = ({ metrics }) => {
  return (
    <section className="metrics-section" aria-labelledby="metrics-heading">
      <div className="metrics-section-header">
        <h2 id="metrics-heading" className="metrics-section-title">
          Quantitative impact
        </h2>
        <span className="metrics-section-subtitle">
          Anti-pattern → Well-Architected
        </span>
      </div>

      <div className="metric-quad-grid">
        {metrics.map((m, idx) => (
          <div key={idx} className="metric-cell">
            <span className="metric-cell-label">{m.label}</span>
            <div className="metric-cell-values">
              <span className="val-naive">{m.naiveValue}</span>
              <span className="metric-cell-arrow" aria-hidden="true">→</span>
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
