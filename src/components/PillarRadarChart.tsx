import React from 'react';
import { PillarScore } from '../types';

interface PillarRadarProps {
  naiveScores: PillarScore;
  wellArchScores: PillarScore;
}

const PILLARS: { key: keyof PillarScore; label: string; short: string }[] = [
  { key: 'operationalExcellence', label: 'Operational Excellence', short: 'Ops' },
  { key: 'security', label: 'Security', short: 'Security' },
  { key: 'reliability', label: 'Reliability', short: 'Reliability' },
  { key: 'performanceEfficiency', label: 'Performance', short: 'Perf' },
  { key: 'costOptimization', label: 'Cost', short: 'Cost' },
  { key: 'sustainability', label: 'Sustainability', short: 'Sustain' }
];

export const PillarRadarChart: React.FC<PillarRadarProps> = ({
  naiveScores,
  wellArchScores
}) => {
  const size = 260;
  const center = size / 2;
  const radius = 85;
  const totalAxes = PILLARS.length;

  const getCoordinates = (value: number, index: number) => {
    const angle = index * ((2 * Math.PI) / totalAxes) - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const naivePoints = PILLARS.map((p, i) => {
    const { x, y } = getCoordinates(naiveScores[p.key], i);
    return `${x},${y}`;
  }).join(' ');

  const wellArchPoints = PILLARS.map((p, i) => {
    const { x, y } = getCoordinates(wellArchScores[p.key], i);
    return `${x},${y}`;
  }).join(' ');

  const naiveAvg = Math.round(
    PILLARS.reduce((acc, p) => acc + naiveScores[p.key], 0) / totalAxes
  );
  const wellArchAvg = Math.round(
    PILLARS.reduce((acc, p) => acc + wellArchScores[p.key], 0) / totalAxes
  );

  return (
    <div className="card-apple" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Framework alignment
          </span>
          <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
            6-Pillar Scorecard
          </h4>
        </div>
        <div style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)' }}>
          <span style={{ color: 'var(--text-tertiary)' }}>{naiveAvg}%</span>
          <span style={{ margin: '0 4px', color: 'var(--separator)' }}>→</span>
          <span style={{ color: 'var(--status-success)', fontWeight: 600 }}>{wellArchAvg}%</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Concentric rings */}
          {[0.25, 0.5, 0.75, 1.0].map((step) => {
            const stepPoints = PILLARS.map((_, i) => {
              const { x, y } = getCoordinates(step * 100, i);
              return `${x},${y}`;
            }).join(' ');
            return (
              <polygon
                key={step}
                points={stepPoints}
                fill="none"
                stroke="var(--separator)"
                strokeWidth="1"
              />
            );
          })}

          {/* Spokes */}
          {PILLARS.map((p, i) => {
            const { x, y } = getCoordinates(100, i);
            const labelCoord = getCoordinates(118, i);
            return (
              <g key={p.key}>
                <line
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="var(--separator)"
                  strokeWidth="1"
                />
                <text
                  x={labelCoord.x}
                  y={labelCoord.y}
                  fill="var(--text-secondary)"
                  fontSize="9"
                  fontFamily="var(--font-sans)"
                  fontWeight="500"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {p.short}
                </text>
              </g>
            );
          })}

          {/* Naive Polygon */}
          <polygon
            points={naivePoints}
            fill="var(--status-danger-subtle)"
            stroke="var(--status-danger)"
            strokeWidth="1.5"
            strokeOpacity="0.7"
          />

          {/* Well-Architected Polygon */}
          <polygon
            points={wellArchPoints}
            fill="var(--status-success-subtle)"
            stroke="var(--status-success)"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Breakdown list */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px', fontSize: 11, borderTop: '1px solid var(--separator)', paddingTop: 8 }}>
        {PILLARS.map((p) => (
          <div key={p.key} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{p.label}</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: 'var(--text-tertiary)' }}>{naiveScores[p.key]}%</span>
              {' '}
              <span style={{ color: 'var(--status-success)' }}>{wellArchScores[p.key]}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
