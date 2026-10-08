import React, { useState } from 'react';
import {
  X,
  TrendingDown,
  Copy,
  Check,
  Building,
  Rocket,
  Globe
} from 'lucide-react';
import {
  soundFX
} from '../utils/soundEffects';
import { copyText } from '../utils/clipboard';

interface ExecutiveReviewModalProps {
  onClose: () => void;
  selectedTier?: WorkloadTier;
  onSelectTier?: (tier: WorkloadTier) => void;
}

type WorkloadTier = 'startup' | 'midmarket' | 'enterprise';

interface TierData {
  name: string;
  traffic: string;
  naiveMonthly: number;
  wellArchMonthly: number;
  downtimeRiskPerHour: number;
  avgAnnualOutageHours: number;
  computeSavings: string;
  storageSavings: string;
  dbSavings: string;
}

const tierMetrics: Record<WorkloadTier, TierData> = {
  startup: {
    name: 'Growth Startup',
    traffic: '50,000 requests / day (~15k MAU)',
    naiveMonthly: 4450,
    wellArchMonthly: 1820,
    downtimeRiskPerHour: 8500,
    avgAnnualOutageHours: 16.5,
    computeSavings: '54% (Graviton3 + Target Auto Scaling)',
    storageSavings: '72% (S3 Intelligent-Tiering + gp3 decoupled IOPS)',
    dbSavings: '48% (Aurora Serverless v2 + RDS Proxy connection pooling)'
  },
  midmarket: {
    name: 'Mid-Market Enterprise',
    traffic: '2,500,000 requests / day (~750k MAU)',
    naiveMonthly: 18900,
    wellArchMonthly: 7650,
    downtimeRiskPerHour: 45000,
    avgAnnualOutageHours: 18.0,
    computeSavings: '60% (ECS Fargate Spot + Graviton + Auto-Scaling)',
    storageSavings: '75% (Glacier Deep Archive transitions + Object Lock)',
    dbSavings: '52% (Aurora Multi-AZ Read Replicas + ElastiCache Redis 90% offload)'
  },
  enterprise: {
    name: 'Global Financial / Healthcare Tier',
    traffic: '50,000,000 requests / day (~12M MAU)',
    naiveMonthly: 84200,
    wellArchMonthly: 34100,
    downtimeRiskPerHour: 220000,
    avgAnnualOutageHours: 14.0,
    computeSavings: '62% (Multi-AZ serverless clusters + EventBridge event routing)',
    storageSavings: '78% (Tiered lifecycle + S3 Express One Zone + KMS envelope cache)',
    dbSavings: '58% (Global Database + DynamoDB On-Demand + Redis cache clusters)'
  }
};

export const ExecutiveReviewModal: React.FC<ExecutiveReviewModalProps> = ({
  onClose,
  selectedTier: controlledTier,
  onSelectTier
}) => {
  const [internalTier, setInternalTier] = useState<WorkloadTier>('startup');
  const activeTier = controlledTier || internalTier;
  const [copied, setCopied] = useState<boolean>(false);

  const handleSelectTier = (t: WorkloadTier) => {
    soundFX.playClick();
    setInternalTier(t);
    if (onSelectTier) onSelectTier(t);
  };

  const data = tierMetrics[activeTier];
  const monthlySavings = data.naiveMonthly - data.wellArchMonthly;
  const annualSavings = monthlySavings * 12;
  const savingsPercent = Math.round((monthlySavings / data.naiveMonthly) * 100);
  const annualDowntimeRiskNaive = data.downtimeRiskPerHour * data.avgAnnualOutageHours;
  const annualDowntimeRiskWellArch = data.downtimeRiskPerHour * 0.1; // 99.99% availability = ~52 mins/yr

  const handleCopyReport = () => {
    soundFX.playClick();
    const text = `=== AWS WELL-ARCHITECTED FRAMEWORK: EXECUTIVE REVIEW REPORT ===
Workload Scale: ${data.name} (${data.traffic})
Overall Health Score:
- Naive Anti-Pattern Architecture: 22 / 100 (Critical Risk - 13 HRIs, 28 MRIs)
- AWS Well-Architected Framework: 96 / 100 (Exemplary - 0 HRIs, 2 MRIs)

Financial Audit:
- Naive Monthly Infrastructure: $${data.naiveMonthly.toLocaleString()} / mo ($${(data.naiveMonthly * 12).toLocaleString()} / yr)
- Well-Architected Monthly: $${data.wellArchMonthly.toLocaleString()} / mo ($${(data.wellArchMonthly * 12).toLocaleString()} / yr)
- Direct Annual Cloud Savings: $${annualSavings.toLocaleString()} (${savingsPercent}% reduction)
- Annual Downtime Business Loss Risk: Reduced from $${annualDowntimeRiskNaive.toLocaleString()} to $${annualDowntimeRiskWellArch.toLocaleString()} (99.99% SLA)

Key Optimization Levers:
- Compute: ${data.computeSavings}
- Storage: ${data.storageSavings}
- Database: ${data.dbSavings}`;

    copyText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="sheet-overlay" role="dialog" aria-modal="true" aria-label="Executive WAF Review & ROI Calculator">
      <div className="presenter-dialog executive-sheet" style={{ maxWidth: 920, maxHeight: '90dvh' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--separator)', paddingBottom: 'var(--space-3)', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-control)', background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
              📊
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  Executive Well-Architected Review & ROI Audit
                </h2>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 'var(--radius-pill)', background: 'var(--status-success-subtle)', color: 'var(--status-success)', fontWeight: 600, letterSpacing: '0.02em' }}>
                  Certified Business Impact
                </span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>
                Quantitative Total Cost of Ownership (TCO), High Risk Issues (HRI) audit, and downtime liability
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              className="btn-action"
              onClick={handleCopyReport}
              style={{ height: 30, fontSize: 12, gap: 6, borderRadius: 'var(--radius-pill)' }}
            >
              {copied ? <Check size={13} color="var(--status-success)" /> : <Copy size={13} />}
              <span>{copied ? 'Report Copied' : 'Copy Summary'}</span>
            </button>

            <button
              className="btn-action btn-icon"
              onClick={() => {
                soundFX.playClick();
                onClose();
              }}
              style={{ width: 30, height: 30, borderRadius: 'var(--radius-pill)' }}
              aria-label="Close Executive Review"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Workload Scale Selector Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--separator-subtle)', padding: 'var(--space-2) 0', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', letterSpacing: '-0.01em' }}>
            Workload Deployment Scale
          </span>
          <div className="segmented-control" style={{ height: 32, padding: 2 }}>
            <button
              className={`segmented-item ${activeTier === 'startup' ? 'active' : ''}`}
              onClick={() => handleSelectTier('startup')}
              style={{ minHeight: 28, fontSize: 12 }}
            >
              <Rocket size={13} />
              <span>Growth Startup</span>
            </button>
            <button
              className={`segmented-item ${activeTier === 'midmarket' ? 'active' : ''}`}
              onClick={() => handleSelectTier('midmarket')}
              style={{ minHeight: 28, fontSize: 12 }}
            >
              <Building size={13} />
              <span>Mid-Market</span>
            </button>
            <button
              className={`segmented-item ${activeTier === 'enterprise' ? 'active' : ''}`}
              onClick={() => handleSelectTier('enterprise')}
              style={{ minHeight: 28, fontSize: 12 }}
            >
              <Globe size={13} />
              <span>Global Enterprise</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ overflowY: 'auto', paddingRight: 6, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', flex: 1, marginTop: 'var(--space-3)' }}>
          {/* Top Scorecard Row: Naive vs Well-Architected */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--space-3)' }}>
            {/* Naive Architecture Card */}
            <div style={{ background: 'rgba(255, 69, 58, 0.05)', border: '1px solid rgba(255, 69, 58, 0.25)', boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--status-danger)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Naive Anti-Pattern Architecture
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', fontSize: 18, fontWeight: 700, color: 'var(--status-danger)' }}>
                  22 / 100
                </span>
              </div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 'var(--space-3)' }}>
                <div style={{ background: 'var(--bg-surface)', padding: '8px 12px', borderRadius: 'var(--radius-control)', border: '1px solid var(--separator-subtle)', flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>High Risk Issues</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--status-danger)', fontVariantNumeric: 'tabular-nums' }}>13 HRIs</div>
                </div>
                <div style={{ background: 'var(--bg-surface)', padding: '8px 12px', borderRadius: 'var(--radius-control)', border: '1px solid var(--separator-subtle)', flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Medium Risk Issues</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--status-warning)', fontVariantNumeric: 'tabular-nums' }}>28 MRIs</div>
                </div>
                <div style={{ background: 'var(--bg-surface)', padding: '8px 12px', borderRadius: 'var(--radius-control)', border: '1px solid var(--separator-subtle)', flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Uptime SLA</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--status-danger)', fontVariantNumeric: 'tabular-nums' }}>98.5% (SPOF)</div>
                </div>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.48 }}>
                Critical single points of failure across EC2, databases, and network gateways. Zero ransomware protection, public S3 exposure, unmanaged secrets, and zero automated failover.
              </p>
            </div>

            {/* Well-Architected Card */}
            <div style={{ background: 'rgba(48, 209, 88, 0.05)', border: '1px solid rgba(48, 209, 88, 0.25)', boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--status-success)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  AWS Well-Architected Framework
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', fontSize: 18, fontWeight: 700, color: 'var(--status-success)' }}>
                  96 / 100
                </span>
              </div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 'var(--space-3)' }}>
                <div style={{ background: 'var(--bg-surface)', padding: '8px 12px', borderRadius: 'var(--radius-control)', border: '1px solid var(--separator-subtle)', flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>High Risk Issues</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--status-success)', fontVariantNumeric: 'tabular-nums' }}>0 HRIs</div>
                </div>
                <div style={{ background: 'var(--bg-surface)', padding: '8px 12px', borderRadius: 'var(--radius-control)', border: '1px solid var(--separator-subtle)', flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Medium Risk Issues</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>2 MRIs</div>
                </div>
                <div style={{ background: 'var(--bg-surface)', padding: '8px 12px', borderRadius: 'var(--radius-control)', border: '1px solid var(--separator-subtle)', flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Uptime SLA</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--status-success)', fontVariantNumeric: 'tabular-nums' }}>99.99% (HA)</div>
                </div>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.48 }}>
                Multi-AZ fault tolerance, Aurora 6-way replication, CloudFront edge caching, ephemeral IAM roles, 100% Terraform IaC, and automated EventBridge self-healing playbooks.
              </p>
            </div>
          </div>

          {/* Financial ROI Comparison Banner */}
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--separator)', boxShadow: 'inset 0 1px 0 var(--hairline-top)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Financial ROI & Cloud Spend Audit ({data.traffic})
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                  Monthly and annual balance sheet impact comparing un-optimized spend with Well-Architected optimization
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--status-success-subtle)', padding: '4px 10px', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(48, 209, 88, 0.25)' }}>
                <TrendingDown size={14} color="var(--status-success)" />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--status-success)', fontVariantNumeric: 'tabular-nums' }}>
                  {savingsPercent}% Net Cloud Cost Reduction
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
              <div style={{ background: 'var(--bg-surface)', padding: 'var(--space-3)', borderRadius: 'var(--radius-control)', border: '1px solid var(--separator-subtle)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 2 }}>Naive Monthly Spend</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', textDecoration: 'line-through', opacity: 0.7, fontVariantNumeric: 'tabular-nums' }}>
                  ${data.naiveMonthly.toLocaleString()} / mo
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
                  ${(data.naiveMonthly * 12).toLocaleString()} / year
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: 'var(--space-3)', borderRadius: 'var(--radius-control)', border: '1px solid rgba(48, 209, 88, 0.25)' }}>
                <div style={{ fontSize: 11, color: 'var(--status-success)', fontWeight: 600, marginBottom: 2 }}>Well-Architected Monthly</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--status-success)', fontVariantNumeric: 'tabular-nums' }}>
                  ${data.wellArchMonthly.toLocaleString()} / mo
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
                  ${(data.wellArchMonthly * 12).toLocaleString()} / year
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: 'var(--space-3)', borderRadius: 'var(--radius-control)', border: '1px solid var(--separator-subtle)' }}>
                <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, marginBottom: 2 }}>Annual Direct Savings</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>
                  +${annualSavings.toLocaleString()} / yr
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                  Direct cloud infrastructure savings
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: 'var(--space-3)', borderRadius: 'var(--radius-control)', border: '1px solid var(--separator-subtle)' }}>
                <div style={{ fontSize: 11, color: 'var(--status-warning)', fontWeight: 600, marginBottom: 2 }}>Downtime Risk Eliminated</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--status-warning)', fontVariantNumeric: 'tabular-nums' }}>
                  -${(annualDowntimeRiskNaive - annualDowntimeRiskWellArch).toLocaleString()} / yr
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                  Unplanned downtime loss avoided
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown by Core Service Layers */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--separator)', boxShadow: 'inset 0 1px 0 var(--hairline-top)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 'var(--space-3)' }}>
              Layer-by-Layer Architectural Optimization Drivers
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-3)' }}>
              <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-control)', padding: 'var(--space-3)', border: '1px solid var(--separator-subtle)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                  Compute Layer
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', marginBottom: 4 }}>
                  {data.computeSavings}
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  Horizontal auto-scaling with Graviton3 processors, right-sizing with Compute Optimizer, and spot/fargate container elasticity.
                </p>
              </div>

              <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-control)', padding: 'var(--space-3)', border: '1px solid var(--separator-subtle)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                  Storage Layer
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--status-success)', marginBottom: 4 }}>
                  {data.storageSavings}
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  EBS gp3 decouples IOPS from storage disk volume, and S3 Intelligent-Tiering auto-archives untouched files to Glacier.
                </p>
              </div>

              <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-control)', padding: 'var(--space-3)', border: '1px solid var(--separator-subtle)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                  Database Layer
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--status-warning)', marginBottom: 4 }}>
                  {data.dbSavings}
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  Aurora storage auto-expansion + ElastiCache Redis absorbing 85% of read queries, allowing a smaller database instance tier.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
