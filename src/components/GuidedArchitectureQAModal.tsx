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
    navigator.clipboard.writeText(code);
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
      style={{ zIndex: 1100, background: 'rgba(0, 0, 0, 0.65)' }}
    >
      <div 
        className="sheet-content" 
        style={{
          width: '960px',
          maxWidth: '96vw',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          background: '#14171c',
          borderRadius: 16,
          border: '1px solid #22262d',
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.85)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #22262d',
          background: '#0b0d10',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'rgba(255, 153, 0, 0.12)',
              border: '1px solid rgba(255, 153, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Compass size={20} color="#FF9900" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#f0f3f6' }}>
                  Architecture Advisor · Guided Q&amp;A
                </h3>
                <span style={{
                  fontSize: 11,
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: 'rgba(255, 153, 0, 0.12)',
                  color: '#FF9900',
                  fontWeight: 600
                }}>
                  Module {activeDomain.number}: {activeDomain.title}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#9da7b3' }}>
                Curated solutions grounded in the 6 Pillars of the AWS Well-Architected Framework
              </p>
            </div>
          </div>

          <button 
            className="btn-action"
            onClick={onClose}
            title="Close [Esc]"
            style={{ height: 32, width: 32, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Question Selector Ribbon */}
        <div style={{
          padding: '12px 24px',
          background: '#0e1116',
          borderBottom: '1px solid #22262d',
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
                style={{
                  background: isSelected ? 'rgba(255, 153, 0, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: isSelected ? '1px solid #FF9900' : '1px solid #22262d',
                  borderRadius: 8,
                  padding: '8px 14px',
                  fontSize: 13,
                  fontWeight: isSelected ? 600 : 500,
                  color: isSelected ? '#FF9900' : '#9da7b3',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
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
          background: '#14171c'
        }}>
          {/* Question Title Card */}
          <div style={{
            padding: '16px 20px',
            borderRadius: 10,
            background: '#0b0d10',
            border: '1px solid #22262d'
          }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', color: '#FF9900', fontWeight: 700, marginBottom: 4 }}>
              {activeQ.category} Pillar Investigation
            </div>
            <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#f0f3f6' }}>
              {activeQ.question}
            </h4>
            <p style={{ margin: '8px 0 0 0', fontSize: 14, color: '#9da7b3', lineHeight: 1.5 }}>
              {activeQ.summary}
            </p>
          </div>

          {/* Side-by-Side Comparison */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {/* Anti-Pattern */}
            <div style={{
              padding: '16px',
              borderRadius: 10,
              background: 'rgba(255, 69, 58, 0.05)',
              border: '1px solid rgba(255, 69, 58, 0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: '#ff453a', fontWeight: 600, fontSize: 13 }}>
                <AlertTriangle size={15} />
                <span>Anti-Pattern (Traditional Setup)</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#f0f3f6', lineHeight: 1.5 }}>
                {activeQ.antiPattern}
              </p>
            </div>

            {/* Well-Architected Solution */}
            <div style={{
              padding: '16px',
              borderRadius: 10,
              background: 'rgba(48, 209, 88, 0.05)',
              border: '1px solid rgba(48, 209, 88, 0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: '#30d158', fontWeight: 600, fontSize: 13 }}>
                <CheckCircle2 size={15} />
                <span>AWS Well-Architected Solution</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#f0f3f6', lineHeight: 1.5 }}>
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
                borderRadius: 8,
                background: '#0b0d10',
                border: '1px solid #22262d'
              }}>
                <div style={{ fontSize: 11, color: '#9da7b3', fontWeight: 600, textTransform: 'uppercase' }}>
                  {m.label}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#f0f3f6', marginTop: 4 }}>
                  {m.value}
                </div>
              </div>
            ))}
          </div>

          {/* Terraform IaC Snippet if available */}
          {activeQ.iacSnippet && (
            <div style={{
              borderRadius: 10,
              background: '#05070a',
              border: '1px solid #22262d',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '10px 16px',
                background: '#0e1116',
                borderBottom: '1px solid #22262d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#9da7b3', fontFamily: 'monospace' }}>
                  <Terminal size={14} color="#FF9900" />
                  <span>terraform/main.tf</span>
                </div>
                <button
                  onClick={() => handleCopyCode(activeQ.iacSnippet!)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: copiedSnippet ? '#30d158' : '#9da7b3',
                    fontSize: 12,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <Copy size={13} />
                  <span>{copiedSnippet ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre style={{
                margin: 0,
                padding: '16px',
                fontSize: 12,
                color: '#30d158',
                fontFamily: "'JetBrains Mono', monospace",
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
              borderRadius: 8,
              background: 'rgba(255, 153, 0, 0.04)',
              border: '1px solid rgba(255, 153, 0, 0.15)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#FF9900', marginBottom: 6 }}>
                <FileText size={13} />
                <span>Authoritative AWS Whitepaper Citations</span>
              </div>
              {activeQ.citations.map((c, idx) => (
                <div key={idx} style={{ fontSize: 12, color: '#9da7b3', marginTop: 4, lineHeight: 1.5 }}>
                  <strong style={{ color: '#f0f3f6' }}>{c.whitepaper}</strong> ({c.section}): 
                  <span style={{ fontStyle: 'italic', display: 'block', marginTop: 2, paddingLeft: 8, borderLeft: '2px solid rgba(255,153,0,0.3)' }}>
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
              borderRadius: 10,
              background: '#0b0d10',
              border: '1px solid #22262d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#f0f3f6' }}>
                  {activeQ.action.title}
                </div>
                <div style={{ fontSize: 12, color: '#9da7b3', marginTop: 2 }}>
                  Cost impact: <strong style={{ color: '#30d158' }}>{activeQ.action.costDelta}</strong> • Blast radius: {activeQ.action.blastRadius}
                </div>
              </div>
              <button
                className="btn-action"
                onClick={() => handleApplyAction(activeQ.action!)}
                disabled={appliedAction}
                style={{
                  background: appliedAction ? 'rgba(48, 209, 88, 0.2)' : 'rgba(255, 153, 0, 0.15)',
                  border: appliedAction ? '1px solid #30d158' : '1px solid #FF9900',
                  color: appliedAction ? '#30d158' : '#FF9900',
                  fontWeight: 600,
                  fontSize: 13,
                  padding: '8px 18px',
                  borderRadius: 8,
                  cursor: appliedAction ? 'default' : 'pointer'
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
          background: '#0b0d10',
          borderTop: '1px solid #22262d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 12,
          color: '#9da7b3'
        }}>
          <span>Standard manual review also available.</span>
          <button
            onClick={() => {
              onClose();
              onOpen6PillarsFallback();
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#FF9900',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <span>Explore 6 Pillars Master Audit</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};
