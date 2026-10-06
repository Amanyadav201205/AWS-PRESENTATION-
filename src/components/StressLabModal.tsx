import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  RotateCcw, 
  ShieldAlert, 
  Activity, 
  Gauge, 
  TrendingUp, 
  TrendingDown,
  Layers,
  Flame
} from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

interface StressLabModalProps {
  onClose: () => void;
}

type IncidentType = 'traffic_spike' | 'az_failure' | 'ransomware' | 'credential_leak';

interface IncidentScenario {
  id: IncidentType;
  title: string;
  triggerDescription: string;
  naive: {
    cpu: number;
    errorRate: number;
    latencyMs: number;
    status: 'CRASHED' | 'UNRESPONSIVE' | 'COMPROMISED';
    narrative: string;
    blastRadius: string;
  };
  wellArch: {
    cpu: number;
    errorRate: number;
    latencyMs: number;
    status: 'RESILIENT' | 'AUTO-SCALED' | 'DEFENDED';
    narrative: string;
    blastRadius: string;
  };
}

const scenarios: Record<IncidentType, IncidentScenario> = {
  traffic_spike: {
    id: 'traffic_spike',
    title: '10x Flash-Crowd Traffic Surge (Black Friday / Viral Post)',
    triggerDescription: 'Traffic instantly jumps from 500 req/sec to 5,000 req/sec within 10 seconds.',
    naive: {
      cpu: 100,
      errorRate: 94,
      latencyMs: 4850,
      status: 'CRASHED',
      narrative: 'Single EC2 instance maxes at 100% CPU. Apache/Nginx worker threads are exhausted. Database connection pool maxes out. HTTP 504 Gateway Timeouts returned to 94% of users.',
      blastRadius: '100% (Entire web platform unreachable)'
    },
    wellArch: {
      cpu: 58,
      errorRate: 0,
      latencyMs: 24,
      status: 'AUTO-SCALED',
      narrative: 'CloudFront edge caches 91% of traffic at edge locations. ALB distributes remaining dynamic traffic across Auto Scaling Group instances. Target tracking launches 4 additional Graviton3 instances in 45s.',
      blastRadius: '0% (Zero dropped transactions, <25ms latency)'
    }
  },
  az_failure: {
    id: 'az_failure',
    title: 'AWS Availability Zone Power Cut (us-east-1a Outage)',
    triggerDescription: 'A regional substation transformer failure takes down all rack units in Availability Zone A.',
    naive: {
      cpu: 0,
      errorRate: 100,
      latencyMs: 0,
      status: 'UNRESPONSIVE',
      narrative: 'Single EC2 server and Single-AZ MySQL database located in us-east-1a go completely dark. No traffic can route. Requires manual intervention to rebuild from yesterday’s snapshot.',
      blastRadius: '100% Outage | MTTR: 4 - 8 hours'
    },
    wellArch: {
      cpu: 44,
      errorRate: 0.1,
      latencyMs: 31,
      status: 'RESILIENT',
      narrative: 'ALB health check fails within 5 seconds and shifts 100% traffic to healthy nodes in us-east-1b & 1c. Aurora promotes read replica to writer endpoint in 18 seconds. Zero data loss.',
      blastRadius: 'Isolated to AZ-a | MTTR: < 20 seconds automated'
    }
  },
  ransomware: {
    id: 'ransomware',
    title: 'Ransomware Deletion Script & Bucket Wipe Attack',
    triggerDescription: 'An attacker gains access to a CI/CD token and executes "aws s3 rm --recursive" across production data.',
    naive: {
      cpu: 90,
      errorRate: 100,
      latencyMs: 0,
      status: 'COMPROMISED',
      narrative: 'S3 bucket has no Object Lock and no versioning. All patient records and company media files are permanently obliterated within 45 seconds. Company suffers catastrophic loss.',
      blastRadius: 'Total Permanent Data Loss | Company Bankruptcy Risk'
    },
    wellArch: {
      cpu: 15,
      errorRate: 0,
      latencyMs: 14,
      status: 'DEFENDED',
      narrative: 'S3 Object Lock in Compliance Mode intercepts all delete requests with 403 AccessDenied. KMS CMK policies reject cryptoware re-encryption. Air-gapped AWS Backup vault retains immutable recovery points.',
      blastRadius: '0% Data Lost | 100% WORM Compliance Maintained'
    }
  },
  credential_leak: {
    id: 'credential_leak',
    title: 'Accidental IAM Secret Key Leak on Public GitHub',
    triggerDescription: 'A developer accidentally commits an AWS access key and secret key to an open GitHub repository.',
    naive: {
      cpu: 100,
      errorRate: 88,
      latencyMs: 2900,
      status: 'COMPROMISED',
      narrative: 'Static IAM user key had AdministratorAccess with no MFA. Automated bot scrapes key within 90 seconds and launches 200 GPU instances for crypto mining, incurring an $84,000 bill.',
      blastRadius: 'Total AWS Account Hijack | $84,000+ Bill'
    },
    wellArch: {
      cpu: 22,
      errorRate: 0,
      latencyMs: 16,
      status: 'DEFENDED',
      narrative: 'No static keys exist; applications use ephemeral IAM Roles via AWS STS. AWS Secrets Manager rotates credentials every 30 days. Amazon GuardDuty flags anomalous API call and isolates VPC session in 60s.',
      blastRadius: 'Zero Exposure | Automated Session Revocation'
    }
  }
};

export const StressLabModal: React.FC<StressLabModalProps> = ({ onClose }) => {
  const [selectedIncident, setSelectedIncident] = useState<IncidentType>('traffic_spike');
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  const scenario = scenarios[selectedIncident];

  const handleSelectIncident = (type: IncidentType) => {
    soundFX.playClick();
    setSelectedIncident(type);
    setIsSimulating(true);
  };

  const handleTriggerSim = () => {
    soundFX.playChaosAlarm();
    setIsSimulating(true);
  };

  const handleResetSim = () => {
    soundFX.playClick();
    setIsSimulating(false);
  };

  return (
    <div className="sheet-overlay" role="dialog" aria-modal="true" aria-label="Interactive Stress Testing & Blast Radius Lab">
      <div className="presenter-dialog stress-sheet" style={{ maxWidth: 940, maxHeight: '90vh' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--separator)', paddingBottom: 'var(--space-3)', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>⚡</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Interactive Stress & Blast Radius Simulation Lab
                </h2>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 'var(--radius-pill)', background: 'var(--status-warning-subtle)', color: 'var(--status-warning)', fontWeight: 600 }}>
                  Live Incident Comparison
                </span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                Directly compare architecture behavior under real-world catastrophic production failure scenarios
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {isSimulating ? (
              <button className="btn-action danger-quiet" onClick={handleResetSim} style={{ height: 28, fontSize: 12, gap: 5 }}>
                <RotateCcw size={13} />
                <span>Reset Baseline</span>
              </button>
            ) : (
              <button className="btn-action primary" onClick={handleTriggerSim} style={{ height: 28, fontSize: 12, gap: 5 }}>
                <Flame size={13} />
                <span>Inject Chaos</span>
              </button>
            )}

            <button
              className="btn-action btn-icon"
              onClick={() => {
                soundFX.playClick();
                onClose();
              }}
              aria-label="Close Stress Lab"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Incident Selector Tabs */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--separator-subtle)' }}>
          {(Object.keys(scenarios) as IncidentType[]).map(key => {
            const sc = scenarios[key];
            const isSelected = selectedIncident === key;
            return (
              <button
                key={key}
                onClick={() => handleSelectIncident(key)}
                className="btn-action"
                style={{
                  height: 32,
                  fontSize: 12,
                  fontWeight: isSelected ? 600 : 500,
                  background: isSelected ? 'var(--accent)' : 'var(--bg-surface)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                  borderColor: isSelected ? 'transparent' : 'var(--separator)',
                  flexShrink: 0
                }}
              >
                <span>{sc.title.split('(')[0].trim()}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div style={{ overflowY: 'auto', paddingRight: 6, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', flex: 1, marginTop: 'var(--space-3)' }}>
          {/* Incident Overview Banner */}
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--separator)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <AlertTriangle size={16} color="var(--status-warning)" />
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)' }}>
                {scenario.title}
              </h3>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              <strong>Incident Trigger:</strong> {scenario.triggerDescription}
            </p>
          </div>

          {/* Side-by-Side Incident Telemetry */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 'var(--space-4)' }}>
            {/* Naive Telemetry */}
            <div style={{ background: 'rgba(255, 69, 58, 0.06)', border: '1px solid rgba(255, 69, 58, 0.3)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--status-danger)', textTransform: 'uppercase' }}>
                  Naive Anti-Pattern Response
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: 'rgba(255, 69, 58, 0.2)', color: 'var(--status-danger)' }}>
                  {scenario.naive.status}
                </span>
              </div>

              {/* Gauges */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                {/* CPU */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 2 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>CPU Utilization</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--status-danger)' }}>{scenario.naive.cpu}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${scenario.naive.cpu}%`, background: 'var(--status-danger)' }} />
                  </div>
                </div>

                {/* Error Rate */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 2 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Error Rate (HTTP 5xx / Dropped)</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--status-danger)' }}>{scenario.naive.errorRate}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${scenario.naive.errorRate}%`, background: 'var(--status-danger)' }} />
                  </div>
                </div>

                {/* Latency */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, background: 'var(--bg-surface)', padding: '6px 10px', borderRadius: 6 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>P99 Latency</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--status-danger)' }}>
                    {scenario.naive.latencyMs > 0 ? `${scenario.naive.latencyMs} ms (Timeout)` : 'Unreachable (0ms)'}
                  </span>
                </div>
              </div>

              {/* Narrative */}
              <div style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: 'var(--space-3)', border: '1px solid var(--separator-subtle)', marginBottom: 'var(--space-2)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 2, textTransform: 'uppercase' }}>
                  Failure Mechanism:
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.45 }}>
                  {scenario.naive.narrative}
                </p>
              </div>

              <div style={{ fontSize: 11, color: 'var(--status-danger)', fontWeight: 600 }}>
                ⚠️ Blast Radius: {scenario.naive.blastRadius}
              </div>
            </div>

            {/* Well-Architected Telemetry */}
            <div style={{ background: 'rgba(48, 209, 88, 0.06)', border: '1px solid rgba(48, 209, 88, 0.3)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--status-success)', textTransform: 'uppercase' }}>
                  AWS Well-Architected Response
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: 'rgba(48, 209, 88, 0.2)', color: 'var(--status-success)' }}>
                  {scenario.wellArch.status}
                </span>
              </div>

              {/* Gauges */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                {/* CPU */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 2 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>CPU Utilization (Auto-Balanced)</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--status-success)' }}>{scenario.wellArch.cpu}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${scenario.wellArch.cpu}%`, background: 'var(--status-success)' }} />
                  </div>
                </div>

                {/* Error Rate */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 2 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Error Rate (HTTP 5xx / Dropped)</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--status-success)' }}>{scenario.wellArch.errorRate}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.max(2, scenario.wellArch.errorRate * 10)}%`, background: 'var(--status-success)' }} />
                  </div>
                </div>

                {/* Latency */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, background: 'var(--bg-surface)', padding: '6px 10px', borderRadius: 6 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>P99 Latency</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--status-success)' }}>
                    {scenario.wellArch.latencyMs} ms (Normal SLA)
                  </span>
                </div>
              </div>

              {/* Narrative */}
              <div style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: 'var(--space-3)', border: '1px solid var(--separator-subtle)', marginBottom: 'var(--space-2)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 2, textTransform: 'uppercase' }}>
                  Resilience Mechanism:
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.45 }}>
                  {scenario.wellArch.narrative}
                </p>
              </div>

              <div style={{ fontSize: 11, color: 'var(--status-success)', fontWeight: 600 }}>
                🛡️ Blast Radius: {scenario.wellArch.blastRadius}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
