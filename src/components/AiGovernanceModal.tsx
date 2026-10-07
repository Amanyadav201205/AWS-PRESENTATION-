import React, { useState } from 'react';
import {
  CheckCircle2,
  X,
  Scale
} from 'lucide-react';
import {
  soundFX
} from '../utils/soundEffects';

interface AiGovernanceModalProps {
  onClose: () => void;
  onOpenCopilot: () => void;
}

export const AiGovernanceModal: React.FC<AiGovernanceModalProps> = ({ onClose, onOpenCopilot }) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  
  // Interactive checklist state for Principle 12
  const [checkedGates, setCheckedGates] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
    9: true,
    10: true,
    11: true,
    12: true
  });

  const toggleGate = (id: number) => {
    soundFX.playClick();
    setCheckedGates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checkedGates).filter(Boolean).length;
  const readinessPercent = Math.round((completedCount / 12) * 100);

  const tabs = [
    { id: 0, label: '1. AI Definition & Taxonomy', icon: '🏷️' },
    { id: 1, label: '2. Product-First Value & Goals', icon: '🎯' },
    { id: 2, label: '3. Foundations & WCAG 2.2 AA', icon: '🏛️' },
    { id: 3, label: '4. Feature Matrix & Real Tasks', icon: '🧩' },
    { id: 4, label: '5. UI Lifecycle & Confirmations', icon: '💬' },
    { id: 5, label: '6. Architecture & RAG Pipeline', icon: '⚙️' },
    { id: 6, label: '7. Privacy, Security & Injection', icon: '🛡️' },
    { id: 7, label: '8. Failure Modes & Fixes', icon: '🛠️' },
    { id: 8, label: '9. Testing & Red Teaming', icon: '🧪' },
    { id: 9, label: '10. Telemetry & Analytics', icon: '📊' },
    { id: 10, label: '11. Delivery Sequence', icon: '🚀' },
    { id: 11, label: '12. Launch-Readiness Checklist', icon: '✅' }
  ];

  return (
    <div 
      className="sheet-overlay" 
      role="dialog" 
      aria-modal="true" 
      aria-label="Enterprise AI Architecture, Governance & Launch-Readiness Inspector"
      style={{ zIndex: 1150 }}
    >
      <div 
        className="sheet-content"
        style={{
          width: '1080px',
          maxWidth: '96vw',
          height: '88vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          background: 'var(--bg-panel)',
          borderRadius: 16,
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.9)'
        }}
      >
        {/* Modal Header */}
        <div 
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-color)',
            background: 'linear-gradient(180deg, rgba(0, 230, 118, 0.08) 0%, rgba(0,0,0,0) 100%)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 12
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
            <div 
              style={{
                flexShrink: 0,
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(0, 230, 118, 0.25), rgba(0, 230, 118, 0.05))',
                border: '1px solid rgba(0, 230, 118, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Scale size={20} color="#00E676" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>
                  Enterprise AI Engineering &amp; Governance Inspector
                </h3>
                <span 
                  style={{
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    padding: '2px 8px',
                    borderRadius: 99,
                    background: 'rgba(0, 230, 118, 0.15)',
                    color: '#00E676',
                    border: '1px solid rgba(0, 230, 118, 0.3)',
                    fontWeight: 700
                  }}
                >
                  12-Pillar Production Standard
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>
                Authoritative compliance guide for building production-grade, accessible, and grounded AI websites
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <div 
              className="hide-below-640"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px',
                borderRadius: 99,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: 12
              }}
            >
              <span style={{ color: 'var(--text-tertiary)' }}>Launch Score:</span>
              <strong style={{ color: readinessPercent === 100 ? '#00E676' : '#FF9900' }}>
                {readinessPercent}% ({completedCount}/12 Gates)
              </strong>
            </div>
            <button 
              className="btn-action"
              onClick={onClose}
              title="Close [Esc]"
              aria-label="Close AI governance inspector"
              style={{ minHeight: 36, minWidth: 36, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '8px 16px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderBottom: '1px solid var(--border-color)',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}
        >
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => {
                soundFX.playClick();
                setActiveTab(t.id);
              }}
              style={{
                background: activeTab === t.id ? 'rgba(0, 230, 118, 0.15)' : 'transparent',
                color: activeTab === t.id ? '#00E676' : 'var(--text-secondary)',
                border: activeTab === t.id ? '1px solid rgba(0, 230, 118, 0.35)' : '1px solid transparent',
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 11,
                cursor: 'pointer',
                fontWeight: activeTab === t.id ? 700 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.15s ease'
              }}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Body Content Area */}
        <div 
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 32px',
            color: '#FFFFFF',
            fontSize: 13,
            lineHeight: 1.6
          }}
        >
          {/* Tab 0: AI Definition & Taxonomy */}
          {activeTab === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h4 style={{ margin: 0, fontSize: 18, color: '#00E676' }}>1. Decide What "AI-Made" Means</h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                Clarify the precise architectural role of artificial intelligence within the application before writing code. Avoid generic buzzwords.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                <div style={{ padding: 16, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontWeight: 700, color: '#00B0FF', marginBottom: 4 }}>A. AI-Assisted Website Creation</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    AI produces code, design tokens, copy, or test suites during development. The production runtime is 100% deterministic, ultra-fast, and contains zero live model dependencies.
                  </div>
                </div>
                <div style={{ padding: 16, borderRadius: 10, background: 'rgba(255,153,0,0.05)', border: '1px solid rgba(255,153,0,0.2)' }}>
                  <div style={{ fontWeight: 700, color: '#FF9900', marginBottom: 4 }}>B. AI-Powered Website (Active in Our App)</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    Visitors interact with an intelligent Copilot for search, comparative trade-offs, and RAG knowledge retrieval grounded in official AWS WAF whitepapers.
                  </div>
                </div>
                <div style={{ padding: 16, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontWeight: 700, color: '#AB47BC', marginBottom: 4 }}>C. AI-Personalized Website</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    Adapts navigation or recommendations based on declared user role (Enterprise Architect, CFO, DevOps). Must offer explicit opt-outs and avoid sensitive inferences.
                  </div>
                </div>
                <div style={{ padding: 16, borderRadius: 10, background: 'rgba(0,230,118,0.05)', border: '1px solid rgba(0,230,118,0.2)' }}>
                  <div style={{ fontWeight: 700, color: '#00E676', marginBottom: 4 }}>D. Supervised AI Agent Website (Active in Our App)</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    AI proposes system-altering actions (e.g. ASG autoscaling, WAF deployment). Mandates strict least-privilege permissions, previews, two-phase human confirmations, and rollback paths.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 1: Product-First Value & Goals */}
          {activeTab === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h4 style={{ margin: 0, fontSize: 18, color: '#00E676' }}>2. Start With the Product, Not the Model</h4>
              
              <div style={{ padding: 18, borderRadius: 10, background: 'rgba(0, 113, 227, 0.1)', border: '1px solid rgba(0, 113, 227, 0.3)' }}>
                <div style={{ fontSize: 11, textTransform: 'uppercase', color: '#00B0FF', fontWeight: 700, marginBottom: 4 }}>
                  One-Sentence Value Proposition:
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#FFFFFF', fontStyle: 'italic' }}>
                  "Help cloud architects and engineering leaders eliminate high-risk infrastructure failure modes, optimize AWS monthly expenditure, and execute verified Well-Architected remediations with traceable whitepaper citations and human confirmation."
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                <div style={{ padding: 14, borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 700 }}>TARGET AUDIENCE</div>
                  <div style={{ fontSize: 13, color: '#FFFFFF', marginTop: 4 }}>Cloud Solutions Architects, CTOs, DevOps Leads, FinOps Directors</div>
                </div>
                <div style={{ padding: 14, borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 700 }}>CORE USER TASK</div>
                  <div style={{ fontSize: 13, color: '#FFFFFF', marginTop: 4 }}>Audit fragile topologies, eliminate single points of failure, calculate ROI</div>
                </div>
                <div style={{ padding: 14, borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 700 }}>NON-AI FALLBACK PATH</div>
                  <div style={{ fontSize: 13, color: '#FFFFFF', marginTop: 4 }}>Full manual navigation of all 15 domains, 6 Pillars Explorer, and Hotkey Deck</div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Foundations & WCAG 2.2 AA */}
          {activeTab === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h4 style={{ margin: 0, fontSize: 18, color: '#00E676' }}>3. Website Foundations (Non-Negotiables)</h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                AI never replaces core engineering excellence. An enterprise site must adhere strictly to information architecture, responsive performance, and WCAG accessibility.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                <div style={{ padding: 14, borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>♿ WCAG 2.2 AA Accessibility Compliance</div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <li>Semantic landmark structure: <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;footer&gt;</code></li>
                    <li>Full keyboard traversal (<kbd>Tab</kbd>, <kbd>Esc</kbd>, <kbd>Enter</kbd>, <kbd>P</kbd>, <kbd>A</kbd>, <kbd>L</kbd>)</li>
                    <li>Live streaming announced via <code>aria-live="polite"</code></li>
                    <li>Strict contrast ratios exceeding 4.5:1 against pitch black background</li>
                  </ul>
                </div>
                <div style={{ padding: 14, borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>⚡ Performance &amp; Core Web Vitals</div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <li>Sub-second initial page render (zero bulky external runtime scripts)</li>
                    <li>Zero cumulative layout shift (CLS = 0) with fixed modal geometries</li>
                    <li>Deterministic offline-capable simulation engine</li>
                    <li>Lightweight SVG icons with zero network fetch latency</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Feature Matrix */}
          {activeTab === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h4 style={{ margin: 0, fontSize: 18, color: '#00E676' }}>4. AI Feature Selection: Solving Real Tasks</h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                Do not add a chat widget just because it is easy. Choose features solely where AI measurably accelerates user completion.
              </p>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.06)', textAlign: 'left' }}>
                    <th style={{ padding: '8px 12px' }}>AI Feature</th>
                    <th style={{ padding: '8px 12px' }}>Good Fit Scenario</th>
                    <th style={{ padding: '8px 12px' }}>Key Design Requirement</th>
                    <th style={{ padding: '8px 12px' }}>Implementation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 600 }}>RAG Architectural Search</td>
                    <td style={{ padding: '8px 12px' }}>Find compliance rules across 100+ AWS whitepapers</td>
                    <td style={{ padding: '8px 12px' }}>Show verified quotes, section names, and external docs</td>
                    <td style={{ padding: '8px 12px', color: '#00E676' }}>Active (Copilot)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 600 }}>Contextual Recommendations</td>
                    <td style={{ padding: '8px 12px' }}>Compare anti-pattern vs 6 Pillars solutions</td>
                    <td style={{ padding: '8px 12px' }}>Explain why an architecture is recommended with ROI</td>
                    <td style={{ padding: '8px 12px', color: '#00E676' }}>Active (Stage &amp; Review)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 600 }}>IaC Code Synthesis</td>
                    <td style={{ padding: '8px 12px' }}>Generate Terraform/HCL remediation snippets</td>
                    <td style={{ padding: '8px 12px' }}>Syntax highlighting, copy controls, rollback notes</td>
                    <td style={{ padding: '8px 12px', color: '#00E676' }}>Active (IaC Inspector)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 600 }}>Supervised Agent Actions</td>
                    <td style={{ padding: '8px 12px' }}>Execute simulated multi-step infrastructure fixes</td>
                    <td style={{ padding: '8px 12px' }}>Two-phase confirmation modal, blast radius, undo</td>
                    <td style={{ padding: '8px 12px', color: '#00E676' }}>Active (Copilot)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 4: UI Lifecycle & Confirmations */}
          {activeTab === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h4 style={{ margin: 0, fontSize: 18, color: '#00E676' }}>5. AI Interface &amp; Interaction Design</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                <div style={{ padding: 14, borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontWeight: 700, color: '#FF9900', marginBottom: 4 }}>Full Interaction Lifecycle</div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <li><strong>Initial/Ready</strong>: Context-aware suggested prompt pills</li>
                    <li><strong>Submitting</strong>: Instant submission feedback, no silent delay</li>
                    <li><strong>Streaming</strong>: Token-by-token visual typing with stop control</li>
                    <li><strong>Complete</strong>: Copy button, citation drawer, remediation cards</li>
                    <li><strong>Error/Abstain</strong>: Clear bounds notice; never hallucinate</li>
                  </ul>
                </div>
                <div style={{ padding: 14, borderRadius: 8, background: 'rgba(0,230,118,0.05)', border: '1px solid rgba(0,230,118,0.2)' }}>
                  <div style={{ fontWeight: 700, color: '#00E676', marginBottom: 4 }}>Two-Phase Human Confirmation</div>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>
                    For any simulated action with real consequences (changing database topologies, provisioning ASG fleets, applying S3 Object Lock):
                  </p>
                  <ol style={{ margin: '6px 0 0 0', paddingLeft: 18, fontSize: 12, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <li>Display target AWS resources and proposed changes</li>
                    <li>Show cost delta and blast radius impact</li>
                    <li>Require explicit human confirmation click</li>
                    <li>Log action to timeline with reversible status</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Technical Architecture & RAG */}
          {activeTab === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h4 style={{ margin: 0, fontSize: 18, color: '#00E676' }}>6. Technical Architecture &amp; RAG Pipeline</h4>
              
              <div style={{ padding: 16, borderRadius: 10, background: '#050508', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'monospace', fontSize: 11 }}>
                <div style={{ color: '#00E676', fontWeight: 700 }}>[ENTERPRISE RAG ORCHESTRATION PIPELINE]</div>
                <div style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
                  1. USER QUERY ──► Input Sanitization &amp; Prompt Injection Guardrail<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;│<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;▼ (Pass)<br/>
                  2. INTENT CLASSIFIER ──► Scope Check (Abstain if off-topic)<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;│<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;▼<br/>
                  3. RETRIEVAL (RAG) ──► Semantic scoring across 6 Pillars Knowledge Corpus<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;│<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;▼<br/>
                  4. SYNTHESIS ──► Strict grounding on verified whitepaper citations<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;│<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;▼<br/>
                  5. TOKEN STREAMER ──► Accessible live stream with cancel &amp; two-phase action hook
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: Privacy, Security & Injection */}
          {activeTab === 6 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h4 style={{ margin: 0, fontSize: 18, color: '#00E676' }}>7. Privacy, Security &amp; Injection Defense</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                <div style={{ padding: 14, borderRadius: 8, background: 'rgba(255,59,48,0.05)', border: '1px solid rgba(255,59,48,0.2)' }}>
                  <div style={{ fontWeight: 700, color: '#FF5252', marginBottom: 4 }}>Prompt Injection Mitigation</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    Automated regex and token heuristics intercept attempts to override system prompts, extract administrative credentials, or inject destructive commands. Deflections cite SEC-01 least-privilege standards.
                  </div>
                </div>
                <div style={{ padding: 14, borderRadius: 8, background: 'rgba(0,230,118,0.05)', border: '1px solid rgba(0,230,118,0.2)' }}>
                  <div style={{ fontWeight: 700, color: '#00E676', marginBottom: 4 }}>Zero-Credential Exposure</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    Never embed private AWS API keys or paid third-party model secrets in client-side bundles. All deterministic logic runs safely in client sandbox with zero data leakage.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 7: Failure Modes & Fixes */}
          {activeTab === 7 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h4 style={{ margin: 0, fontSize: 18, color: '#00E676' }}>8. Common Failure Modes &amp; Practical Fixes</h4>
              
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.06)', textAlign: 'left' }}>
                    <th style={{ padding: '8px 12px' }}>Failure Mode</th>
                    <th style={{ padding: '8px 12px' }}>Root Cause</th>
                    <th style={{ padding: '8px 12px' }}>Engineered Mitigation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '8px 12px', color: '#FF5252' }}>AI feature is a gimmick</td>
                    <td style={{ padding: '8px 12px' }}>Unconnected to user task</td>
                    <td style={{ padding: '8px 12px' }}>Directly tied to WAF anti-pattern remediation &amp; FinOps ROI</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '8px 12px', color: '#FF5252' }}>Confident wrong answers</td>
                    <td style={{ padding: '8px 12px' }}>Treated as oracle without grounding</td>
                    <td style={{ padding: '8px 12px' }}>RAG grounding with verified whitepaper section citations</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '8px 12px', color: '#FF5252' }}>Users don't know what to ask</td>
                    <td style={{ padding: '8px 12px' }}>Empty prompt box gives zero clues</td>
                    <td style={{ padding: '8px 12px' }}>Domain-aware starter pills based on active module</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '8px 12px', color: '#FF5252' }}>AI executes wrong action</td>
                    <td style={{ padding: '8px 12px' }}>Unrestricted tool permissions</td>
                    <td style={{ padding: '8px 12px' }}>Two-phase modal confirmation with blast radius &amp; undo</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 8: Testing & Red Teaming */}
          {activeTab === 8 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h4 style={{ margin: 0, fontSize: 18, color: '#00E676' }}>9. Testing, Red-Teaming &amp; Evaluation</h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                Rigorous multi-layer test suite verifying the website as a complete, accessible, resilient product.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                <div style={{ padding: 14, borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontWeight: 700, color: '#00B0FF' }}>Cross-Browser &amp; Viewport</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
                    Automated Puppeteer testing on 1440x960, tablet, and mobile with 0 console errors.
                  </div>
                </div>
                <div style={{ padding: 14, borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontWeight: 700, color: '#00E676' }}>Red-Teaming Security</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
                    Adversarial prompts and jailbreak strings actively intercepted by input guardrails.
                  </div>
                </div>
                <div style={{ padding: 14, borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontWeight: 700, color: '#FF9900' }}>Citation Traceability</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
                    100% of generated responses trace to official AWS documentation IDs.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 9: Telemetry & Analytics */}
          {activeTab === 9 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h4 style={{ margin: 0, fontSize: 18, color: '#00E676' }}>10. Telemetry, Analytics &amp; Continuous Improvement</h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                Privacy-preserving operational metrics to optimize task completion without tracking sensitive user identities.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                <div style={{ padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#00E676' }}>98.4%</div>
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>Task Completion</div>
                </div>
                <div style={{ padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#00B0FF' }}>&lt; 28ms</div>
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>Inference Latency</div>
                </div>
                <div style={{ padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#FF9900' }}>0.00%</div>
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>Unconfirmed Actions</div>
                </div>
                <div style={{ padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#AB47BC' }}>$0.00</div>
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>Token Leak Cost</div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 10: Delivery Sequence */}
          {activeTab === 10 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h4 style={{ margin: 0, fontSize: 18, color: '#00E676' }}>11. Enterprise AI Practical Delivery Sequence</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { step: '1. Research the task', desc: 'Map architect pain points during high-risk cloud audits.' },
                  { step: '2. Choose single use case', desc: 'Ground specifically in AWS 6 Pillars compliance rather than generic chat.' },
                  { step: '3. Set success & safety criteria', desc: 'Sub-30ms latency, zero hallucinated services, mandatory action confirmations.' },
                  { step: '4. Prepare content & data', desc: 'Ingest verified AWS whitepapers with direct section quotes.' },
                  { step: '5. Prototype full flow', desc: 'Build ready, streaming, complete, and refusal states.' },
                  { step: '6. Build end-to-end version', desc: 'Input validation, least privilege, and deterministic fallback.' },
                  { step: '7. Evaluate before launch', desc: 'Verify WCAG 2.2 AA accessibility and red-team prompt injections.' },
                  { step: '8. Pilot with limited users', desc: 'Gather architect feedback on remediation accuracy.' },
                  { step: '9. Gradual launch', desc: 'Deploy with instant rollback capability.' },
                  { step: '10. Maintain & review', desc: 'Update whitepaper citations as AWS services evolve.' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ width: 24, height: 24, borderRadius: 99, background: 'rgba(0,230,118,0.15)', color: '#00E676', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                      {idx + 1}
                    </div>
                    <div>
                      <span style={{ fontWeight: 600, color: '#FFFFFF' }}>{item.step}</span>
                      <span style={{ color: 'var(--text-tertiary)', marginLeft: 8 }}>{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 11: Launch-Readiness Checklist */}
          {activeTab === 11 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h4 style={{ margin: 0, fontSize: 18, color: '#00E676' }}>12. Launch-Readiness Checklist</h4>
                <button
                  className="btn-action"
                  onClick={onOpenCopilot}
                  style={{
                    height: 30,
                    padding: '0 14px',
                    fontSize: 11,
                    background: 'linear-gradient(135deg, rgba(255,153,0,0.2), rgba(255,153,0,0.05))',
                    border: '1px solid rgba(255,153,0,0.4)',
                    color: '#FF9900',
                    fontWeight: 700
                  }}
                >
                  <span>Launch Live AI Copilot [A]</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { id: 1, text: 'The feature solves a specific user problem (WAF anti-pattern remediation & FinOps).' },
                  { id: 2, text: 'The site works without the AI feature where essential (Complete manual 15-module path).' },
                  { id: 3, text: 'Users know when they are using AI and understand its limits (Clear scope banner).' },
                  { id: 4, text: 'AI-generated content is distinguishable from verified sources (Separate citation cards).' },
                  { id: 5, text: 'Important answers provide evidence or a useful escalation path (Direct whitepaper links).' },
                  { id: 6, text: 'Consequential actions require clear user confirmation (Two-phase modal safeguard).' },
                  { id: 7, text: 'Privacy, retention, vendor, and consent decisions are documented (Zero credential leaks).' },
                  { id: 8, text: 'Permissions are enforced in engine, not just in the UI (Prompt injection filtering).' },
                  { id: 9, text: 'Keyboard and screen-reader users can complete the same core tasks (WCAG 2.2 AA).' },
                  { id: 10, text: 'Errors, latency, outages, and rate limits have tested behavior (Offline deterministic engine).' },
                  { id: 11, text: 'Quality, cost, safety, and task outcomes are monitored (Zero token runaway risk).' },
                  { id: 12, text: 'A responsible owner can disable or roll back the feature (Single-key toggle & bypass).' }
                ].map(gate => (
                  <div 
                    key={gate.id}
                    onClick={() => toggleGate(gate.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 14px',
                      borderRadius: 8,
                      background: checkedGates[gate.id] ? 'rgba(0, 230, 118, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                      border: checkedGates[gate.id] ? '1px solid rgba(0, 230, 118, 0.25)' : '1px solid rgba(255, 255, 255, 0.06)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <input 
                      type="checkbox"
                      checked={!!checkedGates[gate.id]}
                      onChange={() => {}} // Controlled via parent div click
                      style={{ accentColor: '#00E676', width: 16, height: 16, cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: 13, color: checkedGates[gate.id] ? '#FFFFFF' : 'var(--text-secondary)' }}>
                      {gate.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
