import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingCart,
  Building,
  Video,
  CreditCard,
  Activity,
  Cpu,
  TrendingDown,
  ShieldCheck,
  Check,
  AlertTriangle,
  Play,
  RotateCcw,
  Copy,
  Zap
} from 'lucide-react';
import {
  clientWorkloads
} from '../data/clientWorkloads';
import {
  soundFX
} from '../utils/soundEffects';

interface ClientSolutionsExplorerProps {
  onClose: () => void;
  selectedWorkloadId?: string;
  onSelectWorkloadId?: (id: string) => void;
  simTrigger?: number;
}

export const ClientSolutionsExplorer: React.FC<ClientSolutionsExplorerProps> = ({
  onClose,
  selectedWorkloadId: controlledWorkloadId,
  onSelectWorkloadId,
  simTrigger
}) => {
  const [internalWorkloadId, setInternalWorkloadId] = useState<string>('ecommerce-cart');
  const activeWorkloadId = controlledWorkloadId || internalWorkloadId;

  const handleSelectWorkload = (id: string) => {
    soundFX.playClick();
    setInternalWorkloadId(id);
    setActiveSimulationStep(-1);
    if (onSelectWorkloadId) onSelectWorkloadId(id);
  };

  const [activeSimulationStep, setActiveSimulationStep] = useState<number>(-1); // -1 = idle
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const workload = clientWorkloads.find(w => w.id === activeWorkloadId) || clientWorkloads[0];

  const getWorkloadIcon = (name: string, size = 16) => {
    switch (name) {
      case 'ShoppingCart': return <ShoppingCart size={size} />;
      case 'Building': return <Building size={size} />;
      case 'Video': return <Video size={size} />;
      case 'CreditCard': return <CreditCard size={size} />;
      case 'Activity': return <Activity size={size} />;
      case 'Cpu': return <Cpu size={size} />;
      default: return <Zap size={size} />;
    }
  };

  const handleRunSimulation = () => {
    soundFX.playClick();
    setIsSimulating(true);
    setActiveSimulationStep(0);

    const stepInterval = 1400;
    workload.simulatedFlow.forEach((_, index) => {
      setTimeout(() => {
        setActiveSimulationStep(index);
        soundFX.playClick();
        if (index === workload.simulatedFlow.length - 1) {
          setTimeout(() => {
            setIsSimulating(false);
            soundFX.playHealChime();
          }, 1200);
        }
      }, (index + 1) * stepInterval);
    });
  };

  useEffect(() => {
    if (!simTrigger || simTrigger <= 0) return;
    handleRunSimulation();
  }, [simTrigger]);

  const handleResetSimulation = () => {
    soundFX.playClick();
    setActiveSimulationStep(-1);
    setIsSimulating(false);
  };

  const handleCopyProposal = () => {
    soundFX.playClick();
    const proposalText = `=== AWS WELL-ARCHITECTED CLIENT SOLUTION PROPOSAL ===
Client Workload: ${workload.title} (${workload.category})
Client Profile: ${workload.customerProfile.clientType}
Scale: ${workload.customerProfile.trafficScale}

BUSINESS OBJECTIVE:
${workload.customerProfile.businessNeed}

NAIVE ANTI-PATTERN AUDIT:
Stack: ${workload.naiveApproach.prescribedStack}
Monthly Cost: $${workload.naiveApproach.monthlyCost.toLocaleString()} / mo ($${(workload.naiveApproach.monthlyCost * 12).toLocaleString()} / yr)
Identified Flaws:
${workload.naiveApproach.flaws.map(f => `- ${f}`).join('\n')}

WELL-ARCHITECTED PROPOSED SOLUTION:
Stack: ${workload.wellArchSolution.prescribedStack}
Monthly Cost: $${workload.wellArchSolution.monthlyCost.toLocaleString()} / mo ($${workload.wellArchSolution.annualCost.toLocaleString()} / yr)
Net Savings: ${workload.wellArchSolution.netSavingsPercent}% reduction (+$${workload.naiveApproach.annualWaste.toLocaleString()} / yr saved)
Availability SLA: ${workload.wellArchSolution.availabilitySLA} | RTO: ${workload.wellArchSolution.rto} | RPO: ${workload.wellArchSolution.rpo}

FINOPS COST-CUTTING LEVERS:
${workload.costCuttingLevers.map(l => `- ${l.lever} (${l.monthlySavings}): ${l.description}`).join('\n')}

PILLAR IMPLEMENTATION HIGHLIGHTS:
${workload.pillarsApplied.map(p => `- ${p.pillar}: ${p.implementation}`).join('\n')}`;

    navigator.clipboard.writeText(proposalText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="sheet-overlay" role="dialog" aria-modal="true" aria-label="Client Solutions & Workload Architecture Explorer">
      <div className="presenter-dialog client-sheet" style={{ maxWidth: 980, maxHeight: '92dvh' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--separator)', paddingBottom: 'var(--space-3)', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-control)', background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
              💼
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  Real-World Client Solutions & Workload Blueprints
                </h2>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 'var(--radius-pill)', background: 'var(--status-success-subtle)', color: 'var(--status-success)', fontWeight: 600, letterSpacing: '0.02em' }}>
                  Customer WAF Transformation
                </span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>
                How to tailor the AWS Well-Architected Framework to diverse customer business requirements while slashing cloud spend
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              className="btn-action"
              onClick={handleCopyProposal}
              style={{ height: 30, fontSize: 12, gap: 6, borderRadius: 'var(--radius-pill)' }}
              title="Copy complete client architecture proposal"
            >
              {copied ? <Check size={13} color="var(--status-success)" /> : <Copy size={13} />}
              <span>{copied ? 'Proposal Copied' : 'Copy Proposal'}</span>
            </button>

            <button
              className="btn-action btn-icon"
              onClick={() => {
                soundFX.playClick();
                onClose();
              }}
              style={{ width: 30, height: 30, borderRadius: 'var(--radius-pill)' }}
              aria-label="Close Client Solutions Explorer"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* 6 Client Workload Tabs */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--separator-subtle)' }}>
          {clientWorkloads.map(w => {
            const isSelected = w.id === workload.id;
            return (
              <button
                key={w.id}
                onClick={() => handleSelectWorkload(w.id)}
                className="btn-action"
                style={{
                  height: 32,
                  fontSize: 12,
                  fontWeight: isSelected ? 600 : 500,
                  background: isSelected ? 'var(--accent)' : 'var(--bg-surface)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                  borderColor: isSelected ? 'transparent' : 'var(--separator)',
                  borderRadius: 'var(--radius-pill)',
                  flexShrink: 0,
                  gap: 6
                }}
              >
                {getWorkloadIcon(w.iconName, 13)}
                <span>{w.title.split('&')[0].trim()}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div style={{ overflowY: 'auto', paddingRight: 6, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', flex: 1, marginTop: 'var(--space-3)' }}>
          {/* Workload Hero & Customer Requirement Banner */}
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--separator)', boxShadow: 'inset 0 1px 0 var(--hairline-top)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--accent)' }}>{getWorkloadIcon(workload.iconName, 18)}</span>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.015em' }}>
                  {workload.title}
                </h3>
              </div>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 'var(--radius-pill)', background: 'var(--accent-subtle)', color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.02em' }}>
                {workload.badge}
              </span>
            </div>

            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.48 }}>
              <strong style={{ color: 'var(--text-primary)' }}>Client Profile:</strong> {workload.customerProfile.clientType} • <strong style={{ color: 'var(--text-primary)' }}>Traffic Scale:</strong> {workload.customerProfile.trafficScale}
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: 'var(--space-3)', borderRadius: 'var(--radius-control)', border: '1px solid var(--separator-subtle)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                Primary Business Goal
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.48 }}>
                {workload.customerProfile.businessNeed}
              </p>
            </div>
          </div>

          {/* Side-by-Side Solution & Financial Comparison */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 'var(--space-3)' }}>
            {/* Naive Approach */}
            <div style={{ background: 'rgba(255, 69, 58, 0.05)', border: '1px solid rgba(255, 69, 58, 0.25)', boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--status-danger)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Naive Conventional Prescription
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', fontSize: 15, fontWeight: 700, color: 'var(--status-danger)' }}>
                  ${workload.naiveApproach.monthlyCost.toLocaleString()} / mo
                </span>
              </div>

              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.01em' }}>
                {workload.naiveApproach.title}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 'var(--space-3)' }}>
                {workload.naiveApproach.flaws.map((flaw, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                    <AlertTriangle size={13} color="var(--status-danger)" style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ lineHeight: 1.4 }}>{flaw}</span>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 11, color: 'var(--status-danger)', fontWeight: 600, borderTop: '1px solid rgba(255, 69, 58, 0.2)', paddingTop: 8 }}>
                ⚠️ Failure Mode: {workload.naiveApproach.failureRisk}
              </div>
            </div>

            {/* Well-Architected Solution */}
            <div style={{ background: 'rgba(48, 209, 88, 0.05)', border: '1px solid rgba(48, 209, 88, 0.25)', boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--status-success)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  AWS Well-Architected Blueprint
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', fontSize: 15, fontWeight: 700, color: 'var(--status-success)' }}>
                  ${workload.wellArchSolution.monthlyCost.toLocaleString()} / mo ({workload.wellArchSolution.netSavingsPercent}% Savings)
                </span>
              </div>

              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.01em' }}>
                {workload.wellArchSolution.title}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 'var(--space-3)' }}>
                {workload.wellArchSolution.architectureHighlights.map((hl, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                    <Check size={13} color="var(--status-success)" style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ lineHeight: 1.4 }}>{hl}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--status-success)', fontWeight: 600, borderTop: '1px solid rgba(48, 209, 88, 0.2)', paddingTop: 8, fontVariantNumeric: 'tabular-nums' }}>
                <span>🛡️ SLA: {workload.wellArchSolution.availabilitySLA}</span>
                <span>RTO: {workload.wellArchSolution.rto}</span>
                <span>RPO: {workload.wellArchSolution.rpo}</span>
              </div>
            </div>
          </div>

          {/* Interactive Live Customer Request Simulation */}
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--separator)', boxShadow: 'inset 0 1px 0 var(--hairline-top)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Live Customer Request Propagation Simulation
                </h4>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                  Simulate end-to-end user transactions across each tier: observe the contrast between Naive and Well-Architected execution
                </p>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn-action primary"
                  onClick={handleRunSimulation}
                  disabled={isSimulating}
                  style={{ height: 30, fontSize: 12, gap: 6, borderRadius: 'var(--radius-pill)' }}
                >
                  <Play size={12} />
                  <span>Run Flow Simulation</span>
                </button>
                <button
                  className="btn-action btn-icon"
                  onClick={handleResetSimulation}
                  style={{ width: 30, height: 30, borderRadius: 'var(--radius-pill)' }}
                  aria-label="Reset simulation"
                >
                  <RotateCcw size={13} />
                </button>
              </div>
            </div>

            {/* Step-by-Step Interactive Flow Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
              {workload.simulatedFlow.map((step, idx) => {
                const isActive = activeSimulationStep === idx;
                const isPassed = activeSimulationStep > idx;

                return (
                  <div
                    key={idx}
                    style={{
                      background: isActive ? 'rgba(10, 132, 255, 0.12)' : isPassed ? 'var(--bg-surface)' : 'var(--bg-surface)',
                      border: `1px solid ${isActive ? 'var(--accent)' : isPassed ? 'rgba(48, 209, 88, 0.4)' : 'var(--separator-subtle)'}`,
                      borderRadius: 'var(--radius-control)',
                      padding: 'var(--space-3)',
                      transition: 'all 0.3s var(--ease-spring)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: isActive ? 'var(--accent)' : 'var(--text-secondary)' }}>
                        {step.stepName}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', fontSize: 10, padding: '1px 6px', borderRadius: 'var(--radius-pill)', background: 'var(--bg-subtle)', color: 'var(--text-tertiary)' }}>
                        {step.latency}
                      </span>
                    </div>

                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                      {step.service}
                    </div>

                    <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6, lineHeight: 1.4 }}>
                      {step.description}
                    </p>

                    <div style={{ borderTop: '1px solid var(--separator-subtle)', paddingTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ fontSize: 10, color: 'var(--status-danger)' }}>
                        <strong>Naive:</strong> {step.naiveBehavior}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--status-success)' }}>
                        <strong>WAF:</strong> {step.wellArchBehavior}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FinOps Cost-Cutting Levers & 6-Pillar Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--space-3)' }}>
            {/* Cost Levers */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--separator)', boxShadow: 'inset 0 1px 0 var(--hairline-top)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 'var(--space-3)' }}>
                <TrendingDown size={15} color="var(--status-success)" />
                <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  FinOps Cost-Cutting Levers (${workload.naiveApproach.annualWaste.toLocaleString()}/yr Saved)
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {workload.costCuttingLevers.map((lever, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-control)', padding: 'var(--space-3)', border: '1px solid var(--separator-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{lever.lever}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--status-success)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>{lever.monthlySavings}</span>
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                      {lever.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 6-Pillars Applied */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--separator)', boxShadow: 'inset 0 1px 0 var(--hairline-top)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 'var(--space-3)' }}>
                <ShieldCheck size={15} color="var(--accent)" />
                <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  AWS Well-Architected 6-Pillars Applied
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {workload.pillarsApplied.map((pillar, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-control)', padding: 'var(--space-3)', border: '1px solid var(--separator-subtle)' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', marginBottom: 2 }}>
                      {pillar.pillar} Pillar
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                      {pillar.implementation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
