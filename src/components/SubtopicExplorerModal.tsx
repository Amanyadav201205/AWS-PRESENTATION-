import React, { useState } from 'react';
import {
  X,
  Database,
  HardDrive,
  Zap,
  Layers,
  RefreshCw,
  Play
} from 'lucide-react';
import {
  soundFX
} from '../utils/soundEffects';

interface SubtopicExplorerModalProps {
  onClose: () => void;
}

type SubtopicId = 'rds-proxy' | 'ebs-gp3' | 'caching-patterns' | 'aurora-quorum' | 'sqs-dlq';

export const SubtopicExplorerModal: React.FC<SubtopicExplorerModalProps> = ({ onClose }) => {
  const [activeSubtopic, setActiveSubtopic] = useState<SubtopicId>('rds-proxy');

  // Subtopic 1: RDS Proxy Simulation State
  const [lambdaConcurrency, setLambdaConcurrency] = useState<number>(200);
  const [rdsProxySimState, setRdsProxySimState] = useState<'idle' | 'running' | 'completed'>('idle');

  // Subtopic 2: EBS gp2 vs gp3 Slider States
  const [volumeSizeGb, setVolumeSizeGb] = useState<number>(2000); // 2TB
  const [requiredIops, setRequiredIops] = useState<number>(6000);

  // Subtopic 4: Aurora Quorum Simulation State
  const [failedAz, setFailedAz] = useState<'none' | 'az-a'>('none');

  // Subtopic 5: SQS DLQ Simulation State
  const [dlqAttempt, setDlqAttempt] = useState<number>(0);
  const [isDlqRunning, setIsDlqRunning] = useState<boolean>(false);

  // Subtopic 2 Calculation
  // gp2: $0.10/GB, IOPS is 3 * size (capped at 16,000). To get requiredIops, size must be >= requiredIops / 3
  const gp2RequiredSize = Math.max(volumeSizeGb, Math.ceil(requiredIops / 3));
  const gp2MonthlyCost = gp2RequiredSize * 0.10;
  // gp3: $0.08/GB for storage + $0.005/IOPS above 3,000 baseline
  const gp3StorageCost = volumeSizeGb * 0.08;
  const gp3IopsCost = Math.max(0, requiredIops - 3000) * 0.005;
  const gp3MonthlyCost = gp3StorageCost + gp3IopsCost;
  const ebsSavingsPercent = Math.round(((gp2MonthlyCost - gp3MonthlyCost) / gp2MonthlyCost) * 100);

  // Subtopic 1 Simulation
  const handleRunRdsProxySim = () => {
    soundFX.playChaosAlarm();
    setRdsProxySimState('running');
    setTimeout(() => {
      setRdsProxySimState('completed');
      soundFX.playHealChime();
    }, 1200);
  };

  // Subtopic 5 DLQ Simulation
  const handleRunDlqSim = () => {
    soundFX.playClick();
    setIsDlqRunning(true);
    setDlqAttempt(1);

    setTimeout(() => {
      setDlqAttempt(2);
      soundFX.playClick();
      setTimeout(() => {
        setDlqAttempt(3);
        soundFX.playClick();
        setTimeout(() => {
          setDlqAttempt(4); // routed to DLQ
          setIsDlqRunning(false);
          soundFX.playHealChime();
        }, 1000);
      }, 1000);
    }, 1000);
  };

  return (
    <div className="sheet-overlay" role="dialog" aria-modal="true" aria-label="Architectural Subtopics & Deep-Dive Simulations">
      <div className="presenter-dialog subtopic-sheet" style={{ maxWidth: 960, maxHeight: '92dvh' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--separator)', paddingBottom: 'var(--space-3)', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-control)', background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
              🔬
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  Architectural Subtopic Labs & Deep-Dive Simulators
                </h2>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 'var(--radius-pill)', background: 'var(--accent-subtle)', color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.02em' }}>
                  Engineering Mechanics
                </span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>
                Inspect the low-level distributed systems mechanisms that make the AWS Well-Architected Framework resilient and cost-optimized
              </p>
            </div>
          </div>

          <button
            className="btn-action btn-icon"
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            style={{ width: 30, height: 30, borderRadius: 'var(--radius-pill)' }}
            aria-label="Close Subtopic Explorer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Subtopic Navigation Tabs */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--separator-subtle)' }}>
          {[
            { id: 'rds-proxy', label: '1. RDS Proxy Pooling', icon: <Database size={13} /> },
            { id: 'ebs-gp3', label: '2. EBS gp2 vs gp3 Slider', icon: <HardDrive size={13} /> },
            { id: 'caching-patterns', label: '3. Cache-Aside Patterns', icon: <Zap size={13} /> },
            { id: 'aurora-quorum', label: '4. Aurora 6-Way Quorum', icon: <RefreshCw size={13} /> },
            { id: 'sqs-dlq', label: '5. SQS Dead Letter Queue', icon: <Layers size={13} /> }
          ].map(tab => {
            const isSelected = activeSubtopic === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundFX.playClick();
                  setActiveSubtopic(tab.id as SubtopicId);
                }}
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
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div style={{ overflowY: 'auto', paddingRight: 6, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', flex: 1, marginTop: 'var(--space-3)' }}>
          {/* Subtopic 1: RDS Proxy Multiplexing */}
          {activeSubtopic === 'rds-proxy' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--separator)', boxShadow: 'inset 0 1px 0 var(--hairline-top)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, letterSpacing: '-0.015em' }}>
                  Subtopic 1: Relational Database Connection Starvation & Amazon RDS Proxy
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.48 }}>
                  Serverless functions (AWS Lambda) open a new TCP connection on every concurrent execution. Direct connections quickly breach PostgreSQL / MySQL connection pool limits, exhausting RAM and returning <code style={{ color: 'var(--status-danger)', background: 'rgba(255, 69, 58, 0.1)', padding: '1px 6px', borderRadius: 4, fontFamily: 'var(--font-mono)' }}>FATAL: too many connections</code>. RDS Proxy pools and multiplexes thousands of concurrent clients over a small pool of warm connections.
                </p>
              </div>

              {/* Interactive Concurrency Slider */}
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--separator)', boxShadow: 'inset 0 1px 0 var(--hairline-top)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                    Concurrent Lambda Invocations: <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>{lambdaConcurrency} concurrent tasks</span>
                  </label>
                  <button className="btn-action primary" onClick={handleRunRdsProxySim} disabled={rdsProxySimState === 'running'} style={{ height: 28, fontSize: 11, padding: '0 12px', borderRadius: 'var(--radius-pill)', opacity: rdsProxySimState === 'running' ? 0.7 : 1 }}>
                    <Play size={11} /> {rdsProxySimState === 'running' ? 'Simulating Spike...' : (rdsProxySimState === 'completed' ? 'Spike Verified' : 'Simulate Spike')}
                  </button>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={lambdaConcurrency}
                  onChange={e => setLambdaConcurrency(Number(e.target.value))}
                  className="traffic-slider"
                  style={{ width: '100%', marginBottom: 'var(--space-3)' }}
                />

                {/* Comparison Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-3)' }}>
                  {/* Naive */}
                  <div style={{ background: 'rgba(255, 69, 58, 0.05)', border: '1px solid rgba(255, 69, 58, 0.25)', borderRadius: 'var(--radius-control)', padding: 'var(--space-3)' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--status-danger)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Without RDS Proxy (Direct Connection)
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-primary)', marginBottom: 4 }}>
                      Database Connection Pool Limit: <strong style={{ fontVariantNumeric: 'tabular-nums' }}>100 Connections</strong>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: lambdaConcurrency > 100 ? 'var(--status-danger)' : 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                      {lambdaConcurrency > 100 
                        ? `💥 FAILED: ${lambdaConcurrency - 100} connections rejected (HTTP 500)` 
                        : `Normal load (${lambdaConcurrency}/100)`}
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
                      Database RAM consumed by TCP buffer handshakes: ~{lambdaConcurrency * 10} MB
                    </p>
                  </div>

                  {/* With RDS Proxy */}
                  <div style={{ background: 'rgba(48, 209, 88, 0.05)', border: '1px solid rgba(48, 209, 88, 0.25)', borderRadius: 'var(--radius-control)', padding: 'var(--space-3)' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--status-success)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      With Amazon RDS Proxy (Well-Architected)
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-primary)', marginBottom: 4 }}>
                      Pinned DB Connections: <strong style={{ fontVariantNumeric: 'tabular-nums' }}>~18 Warm Connections</strong>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--status-success)', fontVariantNumeric: 'tabular-nums' }}>
                      🛡️ 100% Succeeded: Multiplexed seamlessly across {lambdaConcurrency} clients
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
                      Database RAM overhead reduced by 82%; failover time reduced by 66%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subtopic 2: EBS gp2 vs gp3 Slider */}
          {activeSubtopic === 'ebs-gp3' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--separator)', boxShadow: 'inset 0 1px 0 var(--hairline-top)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, letterSpacing: '-0.015em' }}>
                  Subtopic 2: EBS gp2 vs gp3 Decoupling & IOPS Economics
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.48 }}>
                  In legacy gp2, IOPS is locked to disk size (3 IOPS per GB). To get 6,000 IOPS, you are forced to purchase 2,000 GB of storage even if your application only uses 200 GB. EBS gp3 decouples storage capacity from IOPS, providing a baseline 3,000 IOPS at 20% lower cost per GB.
                </p>
              </div>

              {/* Sliders */}
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--separator)', boxShadow: 'inset 0 1px 0 var(--hairline-top)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                      Desired Disk Volume: <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>{volumeSizeGb} GB</span>
                    </label>
                    <input
                      type="range"
                      min="200"
                      max="5000"
                      step="100"
                      value={volumeSizeGb}
                      onChange={e => setVolumeSizeGb(Number(e.target.value))}
                      className="traffic-slider"
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                      Required Performance: <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>{requiredIops} IOPS</span>
                    </label>
                    <input
                      type="range"
                      min="3000"
                      max="16000"
                      step="500"
                      value={requiredIops}
                      onChange={e => setRequiredIops(Number(e.target.value))}
                      className="traffic-slider"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                {/* Real-Time Billing Calculator Output */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
                  <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-control)', padding: 'var(--space-3)', border: '1px solid var(--separator-subtle)' }}>
                    <div style={{ fontSize: 11, color: 'var(--status-danger)', fontWeight: 600 }}>Legacy EBS gp2 Cost</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                      ${Math.round(gp2MonthlyCost)} / mo
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
                      Forced allocation: {gp2RequiredSize} GB
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-control)', padding: 'var(--space-3)', border: '1px solid rgba(48, 209, 88, 0.3)' }}>
                    <div style={{ fontSize: 11, color: 'var(--status-success)', fontWeight: 600 }}>Well-Architected gp3 Cost</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--status-success)', fontVariantNumeric: 'tabular-nums' }}>
                      ${Math.round(gp3MonthlyCost)} / mo
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
                      Actual allocation: {volumeSizeGb} GB
                    </div>
                  </div>

                  <div style={{ background: 'var(--status-success-subtle)', borderRadius: 'var(--radius-control)', padding: 'var(--space-3)', border: '1px solid rgba(48, 209, 88, 0.4)' }}>
                    <div style={{ fontSize: 11, color: 'var(--status-success)', fontWeight: 600 }}>Net Monthly Savings</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--status-success)', fontVariantNumeric: 'tabular-nums' }}>
                      {ebsSavingsPercent}% Saved
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-primary)', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
                      +${Math.round(gp2MonthlyCost - gp3MonthlyCost)} / month
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subtopic 3: Caching Simulator */}
          {activeSubtopic === 'caching-patterns' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--separator)', boxShadow: 'inset 0 1px 0 var(--hairline-top)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, letterSpacing: '-0.015em' }}>
                  Subtopic 3: Multi-Layer Caching (CloudFront Edge + ElastiCache Redis)
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.48 }}>
                  When 1,000 requests arrive, edge caching intercepts 92% of queries at CloudFront POPs with sub-15ms response times. Only the remaining 8% miss the edge, which ElastiCache Redis resolves in-memory in 2ms. The origin relational database handles only a tiny fraction of writes.
                </p>
              </div>

              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--separator)', boxShadow: 'inset 0 1px 0 var(--hairline-top)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13, flexWrap: 'wrap', gap: 8 }}>
                  <span>Incoming Request Stream: <strong>1,000 req/sec</strong></span>
                  <span style={{ color: 'var(--status-success)', fontWeight: 600 }}>Edge Cache Hit Ratio: 92%</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                  <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-3)', borderRadius: 'var(--radius-control)', border: '1px solid var(--separator-subtle)' }}>
                    <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>Edge Hit (CloudFront)</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>920 Requests</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>Latency: 12ms (Edge POP)</div>
                  </div>

                  <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-3)', borderRadius: 'var(--radius-control)', border: '1px solid var(--separator-subtle)' }}>
                    <div style={{ fontSize: 11, color: 'var(--status-success)', fontWeight: 600 }}>In-Memory Hit (Redis)</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--status-success)', fontVariantNumeric: 'tabular-nums' }}>65 Requests</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>Latency: 2ms (In-Memory)</div>
                  </div>

                  <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-3)', borderRadius: 'var(--radius-control)', border: '1px solid var(--separator-subtle)' }}>
                    <div style={{ fontSize: 11, color: 'var(--status-warning)', fontWeight: 600 }}>Origin Database Queries</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--status-warning)', fontVariantNumeric: 'tabular-nums' }}>15 Requests (1.5%)</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>Database CPU: 8% (Calm)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subtopic 4: Aurora Quorum Storage */}
          {activeSubtopic === 'aurora-quorum' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--separator)', boxShadow: 'inset 0 1px 0 var(--hairline-top)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, letterSpacing: '-0.015em' }}>
                  Subtopic 4: Amazon Aurora 6-Way Storage Quorum & Peer Self-Repair
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.48 }}>
                  Aurora writes 6 copies of data across 3 Availability Zones (2 copies per AZ). Aurora uses a write quorum of 4/6 and a read quorum of 3/6. Even if an entire AWS AZ loses power and one additional disk crashes in another AZ, Aurora continues processing writes and automatically self-heals peer storage nodes in background threads without impacting compute performance.
                </p>
              </div>

              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--separator)', boxShadow: 'inset 0 1px 0 var(--hairline-top)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)', flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Simulate Availability Zone Power Cut:</span>
                  <button 
                    className={`btn-action ${failedAz === 'az-a' ? 'danger-quiet' : 'primary'}`}
                    onClick={() => {
                      soundFX.playClick();
                      setFailedAz(failedAz === 'az-a' ? 'none' : 'az-a');
                    }}
                    style={{ height: 28, fontSize: 11, padding: '0 12px', borderRadius: 'var(--radius-pill)' }}
                  >
                    {failedAz === 'az-a' ? 'Restore AZ-a' : 'Simulate Cut in AZ-a'}
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                  {['AZ-a (us-east-1a)', 'AZ-b (us-east-1b)', 'AZ-c (us-east-1c)'].map((azName, i) => {
                    const isDown = failedAz === 'az-a' && i === 0;
                    return (
                      <div 
                        key={azName}
                        style={{
                          background: isDown ? 'rgba(255, 69, 58, 0.08)' : 'var(--bg-elevated)',
                          border: `1px solid ${isDown ? 'rgba(255, 69, 58, 0.3)' : 'var(--separator-subtle)'}`,
                          borderRadius: 'var(--radius-control)',
                          padding: 'var(--space-3)',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontSize: 12, fontWeight: 600, color: isDown ? 'var(--status-danger)' : 'var(--text-primary)', marginBottom: 4 }}>
                          {azName}
                        </div>
                        <div style={{ fontSize: 11, color: isDown ? 'var(--status-danger)' : 'var(--status-success)', fontWeight: 600 }}>
                          {isDown ? 'OFFLINE (Power Lost)' : 'ONLINE (Storage Nodes OK)'}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 4 }}>
                          {isDown ? '0/2 Nodes Active' : '2/2 Synchronous Nodes'}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ marginTop: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-control)', fontSize: 12, color: failedAz === 'az-a' ? 'var(--status-success)' : 'var(--text-secondary)' }}>
                  <strong>Quorum Status:</strong> {failedAz === 'az-a' ? '4/6 Nodes Available — WRITE QUORUM MAINTAINED (Zero Downtime, Aurora Auto-Promoting Standby)' : '6/6 Nodes Healthy (100% Replication)'}
                </div>
              </div>
            </div>
          )}

          {/* Subtopic 5: SQS DLQ */}
          {activeSubtopic === 'sqs-dlq' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--separator)', boxShadow: 'inset 0 1px 0 var(--hairline-top)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, letterSpacing: '-0.015em' }}>
                  Subtopic 5: Amazon SQS Dead Letter Queue (DLQ) & Exponential Backoff
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.48 }}>
                  Poison pill messages (malformed payloads or corrupt data) can crash consumer worker loops indefinitely. An SQS Dead Letter Queue (DLQ) isolates faulty messages after a set number of retry attempts (maxReceiveCount), alerting operators without stalling legitimate traffic.
                </p>
              </div>

              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--separator)', boxShadow: 'inset 0 1px 0 var(--hairline-top)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)', flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Poison Pill Message Delivery Test:</span>
                  <button 
                    className="btn-action primary"
                    onClick={handleRunDlqSim}
                    disabled={isDlqRunning}
                    style={{ height: 28, fontSize: 11, padding: '0 12px', borderRadius: 'var(--radius-pill)' }}
                  >
                    <Play size={11} /> Simulate Poison Message
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
                  {[
                    { step: 1, title: 'Attempt 1', desc: 'Worker fails (Malformed JSON)' },
                    { step: 2, title: 'Attempt 2', desc: 'Retrying with backoff' },
                    { step: 3, title: 'Attempt 3', desc: 'Final retry breach' },
                    { step: 4, title: 'DLQ Isolated', desc: 'Moved to Dead Letter Queue' }
                  ].map(item => {
                    const isCurrent = dlqAttempt === item.step;
                    const isDone = dlqAttempt >= item.step;
                    const isDlq = item.step === 4 && isDone;

                    return (
                      <div 
                        key={item.step}
                        style={{
                          background: isDlq ? 'rgba(255, 159, 10, 0.12)' : isCurrent ? 'rgba(10, 132, 255, 0.12)' : 'var(--bg-elevated)',
                          border: `1px solid ${isDlq ? 'var(--status-warning)' : isCurrent ? 'var(--accent)' : 'var(--separator-subtle)'}`,
                          borderRadius: 'var(--radius-control)',
                          padding: 'var(--space-3)',
                          textAlign: 'center',
                          transition: 'all 0.3s var(--ease-spring)'
                        }}
                      >
                        <div style={{ fontSize: 12, fontWeight: 700, color: isDlq ? 'var(--status-warning)' : isCurrent ? 'var(--accent)' : 'var(--text-secondary)' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>
                          {item.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
