import React, { useState } from 'react';
import {
  X,
  Activity,
  Shield,
  RefreshCw,
  Zap,
  DollarSign,
  Leaf,
  CheckCircle,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import {
  pillarDetails
} from '../data/pillarsData';
import {
  soundFX
} from '../utils/soundEffects';

interface PillarsExplorerModalProps {
  onClose: () => void;
  onNavigateToDomain: (domainId: string) => void;
}

export const PillarsExplorerModal: React.FC<PillarsExplorerModalProps> = ({
  onClose,
  onNavigateToDomain
}) => {
  const [selectedPillarId, setSelectedPillarId] = useState<string>('Operational Excellence');

  const activePillar = pillarDetails.find(p => p.id === selectedPillarId) || pillarDetails[0];

  const getPillarIcon = (name: string, size = 16) => {
    switch (name) {
      case 'Operational Excellence': return <Activity size={size} />;
      case 'Security': return <Shield size={size} />;
      case 'Reliability': return <RefreshCw size={size} />;
      case 'Performance Efficiency': return <Zap size={size} />;
      case 'Cost Optimization': return <DollarSign size={size} />;
      case 'Sustainability': return <Leaf size={size} />;
      default: return <Activity size={size} />;
    }
  };

  return (
    <div className="sheet-overlay" role="dialog" aria-modal="true" aria-label="AWS Well-Architected Framework 6 Pillars Master Explorer">
      <div className="presenter-dialog pillars-sheet" style={{ maxWidth: 940, maxHeight: '90vh' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--separator)', paddingBottom: 'var(--space-3)', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>🏛️</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  AWS Well-Architected Framework: The 6 Core Pillars
                </h2>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 'var(--radius-pill)', background: 'var(--accent-subtle)', color: 'var(--accent)', fontWeight: 600 }}>
                  Official Architectural Foundation
                </span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                Comprehensive guide to AWS design principles, review questions, anti-patterns, and domain mappings
              </p>
            </div>
          </div>

          <button
            className="btn-action btn-icon"
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            aria-label="Close 6 Pillars Explorer"
          >
            <X size={15} />
          </button>
        </div>

        {/* 6 Pillars Selection Pill Bar */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--separator-subtle)' }}>
          {pillarDetails.map(p => {
            const isSelected = p.id === activePillar.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  soundFX.playClick();
                  setSelectedPillarId(p.id);
                }}
                className="btn-action"
                style={{
                  height: 34,
                  fontSize: 12,
                  fontWeight: isSelected ? 600 : 500,
                  background: isSelected ? p.color : 'var(--bg-surface)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                  borderColor: isSelected ? p.color : 'var(--separator)',
                  flexShrink: 0,
                  gap: 6
                }}
              >
                {getPillarIcon(p.name, 14)}
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>

        {/* Pillar Detail Body */}
        <div style={{ overflowY: 'auto', paddingRight: 6, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', flex: 1, marginTop: 'var(--space-3)' }}>
          {/* Pillar Hero Banner */}
          <div style={{ 
            background: 'var(--bg-elevated)', 
            border: `1px solid ${activePillar.color}40`, 
            borderRadius: 'var(--radius-inner)', 
            padding: 'var(--space-4)',
            borderLeft: `4px solid ${activePillar.color}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ color: activePillar.color }}>{getPillarIcon(activePillar.name, 20)}</span>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)' }}>
                {activePillar.name} Pillar
              </h3>
            </div>
            <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>
              {activePillar.tagline}
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {activePillar.officialDefinition}
            </p>
          </div>

          {/* Core Design Principles */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--separator)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 'var(--space-3)' }}>
              Core AWS Design Principles
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-3)' }}>
              {activePillar.designPrinciples.map((dp, idx) => (
                <div key={idx} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--separator-subtle)', borderRadius: 8, padding: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ color: activePillar.color, fontSize: 12, fontWeight: 700 }}>#{idx + 1}</span>
                    <h5 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{dp.title}</h5>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    {dp.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Anti-Pattern vs Best Practice Side-by-Side */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--separator)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 'var(--space-3)' }}>
              Common Anti-Patterns vs. Well-Architected Best Practices
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {activePillar.antiPatternVsBestPractice.map((item, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div style={{ background: 'rgba(255, 69, 58, 0.08)', border: '1px solid rgba(255, 69, 58, 0.25)', borderRadius: 8, padding: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <AlertTriangle size={13} color="var(--status-danger)" />
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--status-danger)', textTransform: 'uppercase' }}>
                        Naive Anti-Pattern
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                      {item.antiPattern}
                    </p>
                  </div>

                  <div style={{ background: 'rgba(48, 209, 88, 0.08)', border: '1px solid rgba(48, 209, 88, 0.25)', borderRadius: 8, padding: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <CheckCircle size={13} color="var(--status-success)" />
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--status-success)', textTransform: 'uppercase' }}>
                        Well-Architected Standard
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                      {item.bestPractice}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Official WAF Review Checklist Questions */}
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--separator)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 'var(--space-3)' }}>
              Key Well-Architected Tool Review Questions
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {activePillar.keyQuestions.map((q, idx) => (
                <div key={idx} style={{ background: 'var(--bg-surface)', border: '1px solid var(--separator-subtle)', borderRadius: 8, padding: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: `${activePillar.color}25`, color: activePillar.color }}>
                      {q.code}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {q.question}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', paddingLeft: 2 }}>
                    <strong>Prescribed Practice:</strong> {q.bestPractice}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Jump to Relevant Syllabus Domains */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--separator)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                Demonstrated in Syllabus Modules:
              </span>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                Click any module below to inspect its interactive architecture in the main view
              </p>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {activePillar.relatedDomainIds.map(dId => (
                <button
                  key={dId}
                  className="btn-action"
                  onClick={() => {
                    soundFX.playClick();
                    onNavigateToDomain(dId);
                    onClose();
                  }}
                  style={{ height: 28, fontSize: 11, gap: 5, background: 'var(--bg-elevated)' }}
                >
                  <span>{dId.replace('-', ' ')}</span>
                  <ArrowRight size={11} color="var(--accent)" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
