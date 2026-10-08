import React, { useState } from 'react';
import {
  Compass,
  FileText,
  Terminal,
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Copy
} from 'lucide-react';
import {
  DomainData
} from '../types';
import {
  WAF_KNOWLEDGE_BASE,
  WafCitation,
  WafRemediationAction
} from '../data/wafKnowledgeBase';
import {
  soundFX
} from '../utils/soundEffects';
import { copyText } from '../utils/clipboard';

interface GuidedArchitectureQAModalProps {
  activeDomain: DomainData;
  onClose: () => void;
  onApplyRemediation?: (action: WafRemediationAction) => void;
  onOpen6PillarsFallback: () => void;
}

interface QuestionAnswerItem {
  id: string;
  category: string;
  question: string;
  summary: string;
  antiPattern: string;
  solution: string;
  metrics: { label: string; value: string }[];
  citations: WafCitation[];
  iacSnippet?: string;
  action?: WafRemediationAction;
}

export const GuidedArchitectureQAModal: React.FC<GuidedArchitectureQAModalProps> = ({
  activeDomain,
  onClose,
  onApplyRemediation,
  onOpen6PillarsFallback
}) => {
  // Find matching knowledge base entry or fallback to domain data
  const domainEntry = WAF_KNOWLEDGE_BASE.find(k => k.domainId === activeDomain.id) || WAF_KNOWLEDGE_BASE[0];

  // Curated questions for this domain
  const questions: QuestionAnswerItem[] = [
    {
      id: 'q-spof',
      category: 'Reliability',
      question: `How does Module ${activeDomain.number} eliminate Single Points of Failure (SPOFs)?`,
      summary: `Resolves unhedged blast radiuses by decoupling stateful services and deploying across multiple Availability Zones.`,
      antiPattern: activeDomain.normalPrescription?.whyItFailsInProduction?.[0] || domainEntry.antiPattern,
      solution: activeDomain.wafTransformationSummary || domainEntry.wellArchSolution,
      metrics: [
        { label: 'Target Availability', value: '99.99%' },
        { label: 'Failover Window', value: '< 30s' },
        { label: 'Blast Radius', value: 'Isolated to single AZ subnet' }
      ],
      citations: domainEntry.citations,
      action: domainEntry.recommendedAction
    },
    {
      id: 'q-cost',
      category: 'Cost Optimization',
      question: `What is the FinOps ROI and cloud spend reduction in this architecture?`,
      summary: `Replaces over-provisioned idle instances with right-sized Graviton ARM64 compute and tiered lifecycle policies.`,
      antiPattern: `Over-provisioned capacity with 50%+ idle compute waste ($4,450/month initial burn rate).`,
      solution: `Right-sizing compute and offloading traffic reduces cloud spend down to $1,820/month (59.1% net reduction).`,
      metrics: [
        { label: 'Before Cost', value: '$4,450 / month' },
        { label: 'After Cost', value: '$1,820 / month' },
        { label: 'Net Savings', value: '59.1% TCO reduction' }
      ],
      citations: domainEntry.citations.filter(c => c.pillar.includes('Cost')),
      action: domainEntry.recommendedAction
    },
    {
      id: 'q-security',
      category: 'Security',
      question: `Which AWS Security Pillar controls protect against data compromise?`,
      summary: `Applies defense-in-depth with AWS KMS customer-managed keys, least-privilege IAM roles, and private VPC routing.`,
      antiPattern: `Public endpoints open to 0.0.0.0/0 with broad security group permissions and unencrypted storage volumes.`,
      solution: `Private subnets without public IPs, TLS 1.3 in-flight encryption, and AWS KMS envelope encryption at rest.`,
      metrics: [
        { label: 'Public Ingress', value: 'Blocked (0.0.0.0/0 denied)' },
        { label: 'Encryption', value: 'KMS AES-256 + TLS 1.3' },
        { label: 'IAM Roles', value: 'Short-lived STS credentials' }
      ],
      citations: domainEntry.citations.filter(c => c.pillar.includes('Security') || c.pillar.includes('Reliability')),
      action: domainEntry.recommendedAction
    },
    {
      id: 'q-iac',
      category: 'Operational Excellence',
      question: `What does the production Terraform (HCL) deployment look like?`,
      summary: `Automates cloud infrastructure as code (IaC) to guarantee repeatable, immutable environments.`,
      antiPattern: `Manual configuration changes (ClickOps) prone to configuration drift and human error.`,
      solution: `Declarative Terraform HCL definitions parameterized for Multi-AZ provisioning and CI/CD pipelines.`,
      metrics: [
        { label: 'IaC Format', value: 'HashiCorp HCL (Terraform)' },
        { label: 'Deployment', value: 'Automated CI/CD Pipeline' },
        { label: 'Configuration Drift', value: 'Zero (State enforced)' }
      ],
      citations: [
        {
          id: 'cit-ops-iac',
          pillar: 'Operational Excellence',
          whitepaper: 'AWS Well-Architected Framework: Operational Excellence Pillar',
          section: 'Perform operations as code',
          sourceUrl: 'https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/ops_as_code.html',
          verifiedQuote: 'In the cloud, you can define your entire workload (applications, infrastructure, etc.) as code and update it with code.'
        }
      ],
      iacSnippet: domainEntry.recommendedAction?.iacSnippet || activeDomain.wellArch.iacSnippet.code
    }
  ];

  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(questions[0].id);
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);
  const [appliedAction, setAppliedAction] = useState<boolean>(false);

  const activeQ = questions.find(q => q.id === selectedQuestionId) || questions[0];

  const handleCopyCode = (code: string) => {
    copyText(code);
    setCopiedSnippet(true);
    soundFX.playClick();
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleApplyAction = (action: WafRemediationAction) => {
    soundFX.playHealChime();
    setAppliedAction(true);
    if (onApplyRemediation) {
      onApplyRemediation(action);
    }
    setTimeout(() => setAppliedAction(false), 3000);
  };

  return (
    <div 
      className="sheet-overlay" 
      role="dialog" 
      aria-modal="true" 
      aria-label="Architecture Advisor Guided Questions and Answers"
      style={{ zIndex: 1100 }}
    >
      <div 
        className="sheet-content" 
        style={{
          width: '960px',
          maxWidth: '96vw',
          maxHeight: '90dvh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          background: 'rgba(24, 24, 28, 0.94)',
          backdropFilter: 'blur(48px) saturate(200%)',
          WebkitBackdropFilter: 'blur(48px) saturate(200%)',
          borderRadius: 'var(--radius-sheet)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          borderTop: '1px solid var(--hairline-top)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-modal)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--separator)',
          background: 'rgba(255, 255, 255, 0.02)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-control)',
              background: 'rgba(255, 159, 10, 0.12)',
              border: '1px solid rgba(255, 159, 10, 0.3)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Compass size={20} color="var(--status-warning)" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.015em' }}>
                  Architecture Advisor · Guided Q&amp;A
                </h3>
                <span style={{
                  fontSize: 11,
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-pill)',
                  background: 'rgba(255, 159, 10, 0.14)',
                  color: 'var(--status-warning)',
                  border: '1px solid rgba(255, 159, 10, 0.3)',
                  fontWeight: 600,
                  letterSpacing: '0.02em'
                }}>
                  Module {activeDomain.number}: {activeDomain.title}
                </span>
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
                Curated solutions grounded in the 6 Pillars of the AWS Well-Architected Framework
              </p>
            </div>
          </div>

          <button 
            className="btn-action btn-icon"
            onClick={onClose}
            title="Close [Esc]"
            aria-label="Close Architecture Advisor"
            style={{ borderRadius: 'var(--radius-pill)' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Question Selector Ribbon */}
        <div style={{
          padding: '12px 24px',
          background: 'var(--bg-canvas)',
          borderBottom: '1px solid var(--separator-subtle)',
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          {questions.map(q => {
            const isSelected = q.id === selectedQuestionId;
            return (
              <button
                key={q.id}
                onClick={() => {
                  soundFX.playClick();
                  setSelectedQuestionId(q.id);
                }}
                className="btn-action"
                style={{
                  background: isSelected ? 'rgba(255, 159, 10, 0.16)' : 'var(--bg-surface)',
                  border: isSelected ? '1px solid rgba(255, 159, 10, 0.5)' : '1px solid var(--separator)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '0 14px',
                  height: 32,
                  fontSize: 12,
                  fontWeight: isSelected ? 600 : 500,
                  color: isSelected ? 'var(--status-warning)' : 'var(--text-secondary)',
                  boxShadow: isSelected ? '0 2px 10px rgba(255, 159, 10, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)' : 'inset 0 1px 0 var(--hairline-top)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <span>{q.category}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Answer Body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          background: 'rgba(14, 14, 18, 0.6)'
        }}>
          {/* Question Title Card */}
          <div style={{
            padding: '18px 22px',
            borderRadius: 'var(--radius-inner)',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--separator)',
            borderTop: '1px solid var(--hairline-top)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--status-warning)', fontWeight: 700, letterSpacing: '0.04em', marginBottom: 6 }}>
              {activeQ.category} Pillar Investigation
            </div>
            <h4 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.015em' }}>
              {activeQ.question}
            </h4>
            <p style={{ margin: '8px 0 0 0', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {activeQ.summary}
            </p>
          </div>

          {/* Side-by-Side Comparison */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {/* Anti-Pattern */}
            <div style={{
              padding: '16px',
              borderRadius: 'var(--radius-inner)',
              background: 'var(--status-danger-subtle)',
              border: '1px solid rgba(255, 69, 58, 0.25)',
              boxShadow: 'inset 0 1px 0 rgba(255, 69, 58, 0.15)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: 'var(--status-danger)', fontWeight: 600, fontSize: 13 }}>
                <AlertTriangle size={15} />
                <span>Anti-Pattern (Traditional Setup)</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                {activeQ.antiPattern}
              </p>
            </div>

            {/* Well-Architected Solution */}
            <div style={{
              padding: '16px',
              borderRadius: 'var(--radius-inner)',
              background: 'var(--status-success-subtle)',
              border: '1px solid rgba(48, 209, 88, 0.25)',
              boxShadow: 'inset 0 1px 0 rgba(48, 209, 88, 0.15)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: 'var(--status-success)', fontWeight: 600, fontSize: 13 }}>
                <CheckCircle2 size={15} />
                <span>AWS Well-Architected Solution</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                {activeQ.solution}
              </p>
            </div>
          </div>

          {/* Key Metric Deliverables */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${activeQ.metrics.length}, 1fr)`,
            gap: 12
          }}>
            {activeQ.metrics.map((m, idx) => (
              <div key={idx} style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-control)',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--separator)',
                borderTop: '1px solid var(--hairline-top)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {m.label}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>
                  {m.value}
                </div>
              </div>
            ))}
          </div>

          {/* Terraform IaC Snippet if available */}
          {activeQ.iacSnippet && (
            <div style={{
              borderRadius: 'var(--radius-inner)',
              background: 'rgba(0, 0, 0, 0.75)',
              border: '1px solid var(--separator)',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)'
            }}>
              <div style={{
                padding: '10px 16px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderBottom: '1px solid var(--separator)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  <Terminal size={14} color="var(--status-warning)" />
                  <span>terraform/main.tf</span>
                </div>
                <button
                  onClick={() => handleCopyCode(activeQ.iacSnippet!)}
                  className="btn-action"
                  style={{
                    height: 26,
                    padding: '0 10px',
                    fontSize: 11,
                    borderRadius: 'var(--radius-pill)',
                    boxShadow: 'inset 0 1px 0 var(--hairline-top)',
                    color: copiedSnippet ? 'var(--status-success)' : 'var(--text-secondary)'
                  }}
                >
                  <Copy size={12} />
                  <span>{copiedSnippet ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre style={{
                margin: 0,
                padding: '16px',
                fontSize: 12,
                color: 'var(--status-success)',
                fontFamily: 'var(--font-mono)',
                lineHeight: 1.5,
                maxHeight: '160px',
                overflowY: 'auto'
              }}>
                {activeQ.iacSnippet}
              </pre>
            </div>
          )}

          {/* Citations */}
          {activeQ.citations && activeQ.citations.length > 0 && (
            <div style={{
              padding: '14px 18px',
              borderRadius: 'var(--radius-inner)',
              background: 'rgba(255, 159, 10, 0.05)',
              border: '1px solid rgba(255, 159, 10, 0.2)',
              boxShadow: 'inset 0 1px 0 rgba(255, 159, 10, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--status-warning)', marginBottom: 6, letterSpacing: '0.02em' }}>
                <FileText size={13} />
                <span>Authoritative AWS Whitepaper Citations</span>
              </div>
              {activeQ.citations.map((c, idx) => (
                <div key={idx} style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{c.whitepaper}</strong> ({c.section}): 
                  <span style={{ fontStyle: 'italic', display: 'block', marginTop: 2, paddingLeft: 8, borderLeft: '2px solid rgba(255, 159, 10, 0.4)' }}>
                    "{c.verifiedQuote}"
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Action Trigger */}
          {activeQ.action && (
            <div style={{
              padding: '16px 20px',
              borderRadius: 'var(--radius-inner)',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--separator)',
              borderTop: '1px solid var(--hairline-top)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {activeQ.action.title}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                  Cost impact: <strong style={{ color: 'var(--status-success)' }}>{activeQ.action.costDelta}</strong> • Blast radius: {activeQ.action.blastRadius}
                </div>
              </div>
              <button
                className={`btn-action ${appliedAction ? 'primary' : ''}`}
                onClick={() => handleApplyAction(activeQ.action!)}
                disabled={appliedAction}
                style={{
                  height: 34,
                  padding: '0 18px',
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: 'var(--radius-pill)',
                  boxShadow: 'inset 0 1px 0 var(--hairline-top)'
                }}
              >
                {appliedAction ? 'Applied to Stage ✓' : 'Simulate Remediation'}
              </button>
            </div>
          )}
        </div>

        {/* Footer fallback route */}
        <div style={{
          padding: '12px 24px',
          background: 'var(--bg-canvas)',
          borderTop: '1px solid var(--separator)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 12,
          color: 'var(--text-secondary)'
        }}>
          <span>Standard manual review also available.</span>
          <button
            onClick={() => {
              onClose();
              onOpen6PillarsFallback();
            }}
            className="btn-action"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent)',
              fontSize: 12,
              fontWeight: 500,
              gap: 4
            }}
          >
            <span>Explore 6 Pillars Master Audit</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
