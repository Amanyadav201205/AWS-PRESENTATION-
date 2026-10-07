import React, { useState } from 'react';
import {
  ArrowRight,
  Split,
  Eye,
  Check,
  X,
  Play,
  Pause,
  Activity,
  Layers,
  ShieldCheck,
  AlertOctagon,
  RefreshCw,
  Flame,
  ShieldAlert,
  Skull,
  DollarSign
} from 'lucide-react';
import {
  ArchitectureNode,
  ArchitectureSpec,
  ChaosPhase,
  ViewMode
} from '../types';
import {
  AwsServiceIcon
} from './AwsServiceIcon';
import {
  soundFX
} from '../utils/soundEffects';

interface DualStageProps {
  naive: ArchitectureSpec;
  wellArch: ArchitectureSpec;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  chaosPhase: ChaosPhase;
  affectedNodeIds: string[];
  onSelectNode: (node: ArchitectureNode, isWellArch: boolean) => void;
  externalUserLoad?: number;
  onUserLoadChange?: (val: number) => void;
  externalAttack?: AttackScenario;
  onAttackChange?: (attack: AttackScenario) => void;
}

export type AttackScenario = 'none' | 'az-outage' | 'ransomware' | 'ddos' | 'bill-shock';

export const DualArchitectureStage: React.FC<DualStageProps> = ({
  naive,
  wellArch,
  viewMode,
  setViewMode,
  chaosPhase,
  affectedNodeIds,
  onSelectNode,
  externalUserLoad,
  onUserLoadChange,
  externalAttack,
  onAttackChange
}) => {
  const [trafficActive, setTrafficActive] = useState<boolean>(true);
  const [trafficSpeed, setTrafficSpeed] = useState<number>(1);
  const [internalUserLoad, setInternalUserLoad] = useState<number>(2500);
  const userLoad = externalUserLoad !== undefined ? externalUserLoad : internalUserLoad;
  const setUserLoad = (val: number | ((prev: number) => number)) => {
    const nextVal = typeof val === 'function' ? val(userLoad) : val;
    if (onUserLoadChange) onUserLoadChange(nextVal);
    setInternalUserLoad(nextVal);
  };

  const [internalActiveAttack, setInternalActiveAttack] = useState<AttackScenario>('none');
  const activeAttack = externalAttack !== undefined ? externalAttack : internalActiveAttack;
  const setActiveAttack = (att: AttackScenario) => {
    if (onAttackChange) onAttackChange(att);
    setInternalActiveAttack(att);
  };

  const [showSubnetBoundaries, setShowSubnetBoundaries] = useState<boolean>(true);
  
  const isChaos = chaosPhase !== 'idle' || activeAttack === 'az-outage';
  const isHighLoad = userLoad >= 20000;
  const isExtremeLoad = userLoad >= 80000;

  // Handle attack trigger
  const triggerAttack = (scenario: AttackScenario) => {
    soundFX.playClick();
    if (activeAttack === scenario) {
      setActiveAttack('none');
    } else {
      setActiveAttack(scenario);
      if (scenario === 'az-outage' || scenario === 'ddos' || scenario === 'ransomware') {
        soundFX.playChaosAlarm();
      } else if (scenario === 'bill-shock') {
        soundFX.playClick();
      }
    }
  };

  // Group nodes into Architectural Tiers with dynamic auto-scaling in Well-Arch
  const groupNodesByTier = (nodes: ArchitectureNode[], isWellArch: boolean) => {
    let effectiveNodes = [...nodes];

    // DYNAMIC AUTO-SCALING DEMO:
    if (isWellArch && (isHighLoad || activeAttack === 'ddos')) {
      effectiveNodes.push(
        {
          id: 'dyn-scale-node-1',
          name: 'App Worker 2 (Auto-Scaled)',
          type: 'compute',
          service: 'Amazon EC2 (c7g Graviton ARM)',
          tier: 'private',
          az: 'us-east-1a',
          status: 'healthy',
          description: 'Horizontally scaled Graviton worker spawned by Auto Scaling Group in response to traffic surge',
          configDetails: {
            specs: 'c7g.xlarge (Graviton ARM64) auto-spawned in Private Subnet A',
            securityPolicy: 'Isolated Security Group (Inbound from ALB only)',
            costProfile: 'Elastic pay-per-use (shuts down when surge recedes)',
            wafAdvantage: 'Zero dropped transactions during surge'
          }
        },
        {
          id: 'dyn-scale-node-2',
          name: 'App Worker 3 (Auto-Scaled)',
          type: 'compute',
          service: 'Amazon EC2 (c7g Graviton ARM)',
          tier: 'private',
          az: 'us-east-1b',
          status: 'healthy',
          description: 'Horizontally scaled Graviton worker spawned in AZ-b for cross-zone load balancing',
          configDetails: {
            specs: 'c7g.xlarge (Graviton ARM64) auto-spawned in Private Subnet B',
            securityPolicy: 'Isolated Security Group (Inbound from ALB only)',
            costProfile: 'Elastic pay-per-use',
            wafAdvantage: 'High-availability cross-zone survivability'
          }
        }
      );
    }

    const ingress = effectiveNodes.filter(n => 
      n.tier === 'edge' || n.tier === 'public' || 
      ['client', 'dns', 'cdn', 'waf', 'loadbalancer', 'gateway'].includes(n.type)
    );
    const compute = effectiveNodes.filter(n => 
      !ingress.includes(n) && (n.tier === 'private' || ['compute', 'queue', 'network'].includes(n.type))
    );
    const data = effectiveNodes.filter(n => 
      !ingress.includes(n) && !compute.includes(n)
    );

    if (ingress.length === 0 && compute.length === 0) {
      return [{ title: 'All Workload Components', nodes: effectiveNodes, tierCode: 'unified' }];
    }

    const tiers = [];
    if (ingress.length > 0) {
      tiers.push({ title: 'Ingress & Edge Tier', nodes: ingress, tierCode: 'ingress' });
    }
    if (compute.length > 0) {
      tiers.push({ title: 'Application & Compute Tier', nodes: compute, tierCode: 'compute' });
    }
    if (data.length > 0) {
      tiers.push({ title: 'Persistence & Data Tier', nodes: data, tierCode: 'data' });
    }
    return tiers;
  };

  // Speed multiplier for animations
  const animDuration = (base: number) => `${(base / (trafficSpeed * (isHighLoad ? 1.8 : 1))).toFixed(2)}s`;

  // Render dynamic animated packet conduits between tiers
  const renderInterTierConduit = (isWellArch: boolean, tierCode: string) => {
    if (!isWellArch) {
      const isDropping = isChaos || isHighLoad || activeAttack !== 'none';
      return (
        <div className="inter-tier-conduit anti-pattern-conduit">
          <svg width="100%" height="34" viewBox="0 0 400 34" className="conduit-svg" preserveAspectRatio="none">
            <line 
              x1="200" y1="0" x2="200" y2="34" 
              stroke={isDropping ? '#FF453A' : '#FF9F0A'} 
              strokeWidth={isDropping ? 3.5 : 2} 
              strokeDasharray={isDropping ? '4 3' : '2 2'} 
            />
            {trafficActive && !isChaos && (
              <circle cx="200" cy="17" r={isHighLoad ? 3 : 2.5} fill="#FF9F0A">
                <animate attributeName="cy" from="0" to="34" dur={animDuration(1.4)} repeatCount="indefinite" />
              </circle>
            )}
            {isDropping && (
              <text x="215" y="20" fill="#FF453A" fontSize="10" fontFamily="var(--font-mono)" fontWeight="700">
                {isChaos ? 'DROP (0%)' : 'CONGESTED'}
              </text>
            )}
          </svg>
        </div>
      );
    }

    return (
      <div className="inter-tier-conduit well-arch-conduit">
        <svg width="100%" height="34" viewBox="0 0 400 34" className="conduit-svg" preserveAspectRatio="none">
          <path d="M 120 0 L 120 34" stroke="rgba(48, 209, 88, 0.45)" strokeWidth="1.5" strokeDasharray="3 2" />
          <path d="M 200 0 L 200 34" stroke="rgba(48, 209, 88, 0.75)" strokeWidth="2" />
          <path d="M 280 0 L 280 34" stroke="rgba(48, 209, 88, 0.45)" strokeWidth="1.5" strokeDasharray="3 2" />

          {trafficActive && (
            <>
              <circle cx="120" cy="17" r="2.5" fill="#30D158">
                <animate attributeName="cy" from="0" to="34" dur={animDuration(0.9)} repeatCount="indefinite" />
              </circle>
              <circle cx="200" cy="17" r="2.5" fill="#30D158">
                <animate attributeName="cy" from="0" to="34" dur={animDuration(0.7)} repeatCount="indefinite" />
              </circle>
              <circle cx="280" cy="17" r="2.5" fill="#30D158">
                <animate attributeName="cy" from="0" to="34" dur={animDuration(1.1)} repeatCount="indefinite" />
              </circle>
            </>
          )}

          <text x="212" y="20" fill="#30D158" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">
            {tierCode === 'ingress' ? 'TLS 1.3 · VPC BACKBONE' : 'PRIVATE BACKBONE'}
          </text>
        </svg>
      </div>
    );
  };

  const renderTierGroup = (
    tierGroup: { title: string; nodes: ArchitectureNode[]; tierCode: string },
    isWellArch: boolean
  ) => {
    // Exactly match Terraform CIDRs & 3 AZs (P0 Fix 2.4 & 2.5)
    const cidrHint = !isWellArch
      ? 'Flat Un-segmented VPC (10.0.0.0/16)'
      : tierGroup.tierCode === 'ingress'
      ? 'Public Subnets: 10.0.1.0/24 (AZ-a), 10.0.2.0/24 (AZ-b), 10.0.3.0/24 (AZ-c)'
      : tierGroup.tierCode === 'compute'
      ? 'Private App Subnets: 10.0.11.0/24 (AZ-a), 10.0.12.0/24 (AZ-b), 10.0.13.0/24 (AZ-c)'
      : 'Isolated Data Subnets: 10.0.21.0/24 (AZ-a), 10.0.22.0/24 (AZ-b), 10.0.23.0/24 (AZ-c)';

    return (
      <div 
        key={tierGroup.tierCode} 
        className={`architecture-tier-block ${showSubnetBoundaries ? 'with-boundary' : ''} ${isWellArch ? 'well-arch-tier' : 'naive-tier'}`}
      >
        {showSubnetBoundaries && (
          <div className="tier-header-badge">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="tier-pill-label">{tierGroup.title}</span>
              {isWellArch && (
                <span className="tier-secure-badge">
                  <ShieldCheck size={10} color="#30D158" /> Multi-AZ Active
                </span>
              )}
            </div>
            <span className="tier-cidr-hint">{cidrHint}</span>
          </div>
        )}

        <div className="node-flow-row">
          {tierGroup.nodes.map((node) => {
            const isFailed = (!isWellArch && isChaos && affectedNodeIds.includes(node.id)) || (!isWellArch && activeAttack === 'az-outage');
            const isHealedWellArch = isWellArch && (isChaos || activeAttack !== 'none');
            const isOverloaded = !isWellArch && (isHighLoad || activeAttack === 'ddos');
            const isDynamicScaled = isWellArch && node.id.startsWith('dyn-scale');
            const isExposedDb = !isWellArch && (node.type === 'database' || node.service?.includes('MySQL') || node.configDetails?.securityPolicy?.includes('3306'));

            return (
              <div
                key={node.id}
                className={`apple-node ${node.isSPOF ? 'spof' : ''} ${isFailed ? 'node-failed' : ''} ${isOverloaded ? 'node-overloaded' : ''} ${isHealedWellArch ? 'node-resilient-pulse' : ''} ${isDynamicScaled ? 'dynamic-scaled-node' : ''}`}
                onClick={() => {
                  soundFX.playClick();
                  onSelectNode(node, isWellArch);
                }}
                role="button"
                tabIndex={0}
                title="Click to view technical specs, IAM isolation & cost breakdown"
              >
                {/* AWS Service Icon */}
                <div className="node-icon-wrapper">
                  <AwsServiceIcon service={node.service || node.name} size={30} />
                  <span className={`node-status-dot ${isFailed ? 'dot-failed' : isHealedWellArch ? 'dot-healed' : ''}`} />
                </div>

                <div className="node-info-text">
                  <div className="node-text-name">{node.name}</div>
                  <div className="node-text-svc">{node.service}</div>
                </div>

                {/* Subnet / AZ Badge */}
                {node.az && (
                  <span className="node-az-pill">{node.az}</span>
                )}

                {/* SPOF Alert Badge */}
                {node.isSPOF && (
                  <span className="node-spof-badge">
                    <AlertOctagon size={10} /> SPOF
                  </span>
                )}

                {/* Database Public Ingress Security Group Tag (P1 Fix 2.9) */}
                {isExposedDb && (
                  <span 
                    className="node-spof-badge" 
                    style={{ background: 'rgba(255, 69, 58, 0.22)', color: '#FF453A', borderColor: 'rgba(255, 69, 58, 0.45)' }}
                    title="Security Group allows direct 0.0.0.0/0 ingress on port 3306"
                  >
                    0.0.0.0/0 :3306
                  </span>
                )}

                {/* Dynamic Auto-Scaled Tag */}
                {isDynamicScaled && (
                  <span className="node-ha-badge" style={{ background: 'rgba(48, 209, 88, 0.25)', color: '#30D158' }}>
                    +AUTO-SCALED
                  </span>
                )}

                {/* Well-Arch Resiliency Tag */}
                {isWellArch && !node.isSPOF && !isDynamicScaled && (
                  <span className="node-ha-badge">HA</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="stage-master-container" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {/* Simulation Sandbox Bar */}
      <div className="simulation-sandbox-bar">
        {/* Top Row: User Load Slider & Presets */}
        <div className="sandbox-top-row">
          <div className="sandbox-label-group">
            <span className="sandbox-title">
              <Activity size={14} color="#2997FF" /> Live Traffic Load Simulator
            </span>
            <span className="stage-live-indicator">
              <span className="pulse-circle" /> Simulated
            </span>
          </div>

          {/* Interactive User Load Slider */}
          <div className="sandbox-traffic-slider-wrap">
            <input 
              type="range"
              min="500"
              max="100000"
              step="500"
              value={userLoad}
              onChange={(e) => {
                const val = Number(e.target.value);
                setUserLoad(val);
                if (val > 50000) soundFX.playChaosAlarm();
              }}
              className="traffic-slider"
              aria-label="Adjust concurrent user traffic load"
            />
            <div className="traffic-readout">
              {userLoad.toLocaleString()} Concurrent Users
            </div>
          </div>

          {/* Quick Presets with min 32px height and no raw emojis (P1 Fix 1.21 & 3a) */}
          <div className="sandbox-presets-row">
            <button
              className={`preset-chip ${userLoad === 1000 ? 'active' : ''}`}
              onClick={() => { soundFX.playClick(); setUserLoad(1000); setActiveAttack('none'); }}
              style={{ minHeight: 32 }}
            >
              Baseline (1k)
            </button>
            <button
              className={`preset-chip ${userLoad === 25000 ? 'active' : ''}`}
              onClick={() => { soundFX.playClick(); setUserLoad(25000); }}
              style={{ minHeight: 32 }}
            >
              Surge (25k)
            </button>
            <button
              className={`preset-chip ${userLoad === 100000 ? 'danger-active' : ''}`}
              onClick={() => { soundFX.playChaosAlarm(); setUserLoad(100000); }}
              style={{ minHeight: 32 }}
            >
              Peak Load (100k)
            </button>
          </div>
        </div>

        {/* Bottom Row: Chaos Disaster Scenarios */}
        <div className="disaster-attacks-row">
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'flex', alignItems: 'center', gap: 5 }}>
            <Flame size={12} color="#FF453A" /> Inject Disaster Event:
          </span>

          <button
            className={`disaster-attack-btn ${activeAttack === 'az-outage' ? 'active' : ''}`}
            onClick={() => triggerAttack('az-outage')}
            title="Simulate complete power outage in us-east-1a Availability Zone"
            style={{ minHeight: 32 }}
          >
            <AlertOctagon size={12} />
            <span>AZ-a Power Failure</span>
          </button>

          <button
            className={`disaster-attack-btn ${activeAttack === 'ransomware' ? 'active' : ''}`}
            onClick={() => triggerAttack('ransomware')}
            title="Simulate malicious ransomware wiper deleting S3 and EBS data"
            style={{ minHeight: 32 }}
          >
            <Skull size={12} />
            <span>Ransomware Wiper Attack</span>
          </button>

          <button
            className={`disaster-attack-btn ${activeAttack === 'ddos' ? 'active' : ''}`}
            onClick={() => triggerAttack('ddos')}
            title="Simulate 500,000 requests/sec SYN flood attack"
            style={{ minHeight: 32 }}
          >
            <ShieldAlert size={12} />
            <span>500k SYN Flood DDoS</span>
          </button>

          <button
            className={`disaster-attack-btn ${activeAttack === 'bill-shock' ? 'active' : ''}`}
            onClick={() => triggerAttack('bill-shock')}
            title="Simulate runaway over-provisioned cloud bill shock"
            style={{ color: '#FF9F0A', borderColor: 'rgba(255, 159, 10, 0.3)', background: 'rgba(255, 159, 10, 0.08)', minHeight: 32 }}
          >
            <DollarSign size={12} />
            <span>FinOps Bill Shock</span>
          </button>

          {activeAttack !== 'none' && (
            <button
              className="btn-action"
              onClick={() => { soundFX.playHealChime(); setActiveAttack('none'); }}
              style={{ fontSize: 11, minHeight: 32, marginLeft: 'auto', gap: 4, borderRadius: 'var(--radius-pill)', boxShadow: 'inset 0 1px 0 var(--hairline-top)' }}
            >
              <RefreshCw size={11} /> Reset Attack State
            </button>
          )}
        </div>
      </div>

      {/* Stage Layout Bar & View Modes (Clean concise label per 3a) */}
      <div className="stage-controls-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h2 style={{ fontSize: 'var(--text-base)', color: 'var(--text-primary)', fontWeight: 600 }}>
            Architecture
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {/* Stream Toggle */}
          <button
            className={`btn-action ${trafficActive ? 'active-quiet' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setTrafficActive(!trafficActive);
            }}
            style={{ minHeight: 32, fontSize: 11, padding: '0 12px', gap: 5, borderRadius: 'var(--radius-pill)', boxShadow: 'inset 0 1px 0 var(--hairline-top)' }}
            title="Toggle live packet stream simulation"
          >
            {trafficActive ? <Pause size={11} /> : <Play size={11} />}
            <span className="btn-label-desktop">{trafficActive ? 'Stream Active' : 'Stream Paused'}</span>
          </button>

          {/* Speed Multiplier - Min 32px height */}
          <div className="segmented-control" title="Simulation Speed" style={{ height: 32, padding: 2 }}>
            <button
              className={`segmented-item ${trafficSpeed === 1 ? 'active' : ''}`}
              onClick={() => { soundFX.playClick(); setTrafficSpeed(1); }}
              style={{ fontSize: 11, padding: '0 8px', minHeight: 28 }}
            >
              1x
            </button>
            <button
              className={`segmented-item ${trafficSpeed === 2 ? 'active' : ''}`}
              onClick={() => { soundFX.playClick(); setTrafficSpeed(2); }}
              style={{ fontSize: 11, padding: '0 8px', minHeight: 28 }}
            >
              2x
            </button>
            <button
              className={`segmented-item ${trafficSpeed === 4 ? 'active' : ''}`}
              onClick={() => { soundFX.playClick(); setTrafficSpeed(4); }}
              style={{ fontSize: 11, padding: '0 8px', minHeight: 28 }}
            >
              4x
            </button>
          </div>

          {/* Subnet Boundary Toggle */}
          <button
            className={`btn-action ${showSubnetBoundaries ? 'active-quiet' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setShowSubnetBoundaries(!showSubnetBoundaries);
            }}
            style={{ minHeight: 32, fontSize: 11, padding: '0 12px', borderRadius: 'var(--radius-pill)', boxShadow: 'inset 0 1px 0 var(--hairline-top)' }}
            title="Show / hide VPC Subnet isolation boundaries"
          >
            <Layers size={11} />
            <span className="btn-label-desktop">Subnet Tiers</span>
          </button>

          {/* View Toggle */}
          <div className="segmented-control" role="tablist" style={{ height: 32, padding: 2 }}>
            <button
              className={`segmented-item ${viewMode === 'split' ? 'active' : ''}`}
              onClick={() => {
                soundFX.playClick();
                setViewMode('split');
              }}
              role="tab"
              aria-selected={viewMode === 'split'}
              style={{ minHeight: 28 }}
            >
              <Split size={12} />
              <span>Side-by-side</span>
            </button>
            <button
              className={`segmented-item ${viewMode === 'naive-only' ? 'active' : ''}`}
              onClick={() => {
                soundFX.playClick();
                setViewMode('naive-only');
              }}
              role="tab"
              aria-selected={viewMode === 'naive-only'}
              style={{ minHeight: 28 }}
            >
              <Eye size={12} />
              <span>Anti-pattern</span>
            </button>
            <button
              className={`segmented-item ${viewMode === 'well-arch-only' ? 'active' : ''}`}
              onClick={() => {
                soundFX.playClick();
                setViewMode('well-arch-only');
              }}
              role="tab"
              aria-selected={viewMode === 'well-arch-only'}
              style={{ minHeight: 28 }}
            >
              <Eye size={12} />
              <span>Well-Architected</span>
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-Side Dual Stage Grid with Equal Heights (P2 Fix 1.22) */}
      <div className={`dual-stage-grid ${viewMode === 'split' ? 'split-view' : 'single-view'}`} style={{ alignItems: 'stretch' }}>
        {/* Anti-Pattern Stage Panel */}
        {(viewMode === 'split' || viewMode === 'naive-only') && (
          <div className={`stage-panel anti-pattern-panel ${isChaos ? 'failed' : ''}`} style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div className="panel-header">
              <div className="panel-label-group">
                <span className="tag-pill naive">Anti-pattern</span>
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {naive.name}
                </h3>
              </div>
              <div className="panel-metrics-pill" style={{ color: 'var(--status-danger)' }}>
                ${naive.monthlyCostEst}/mo • SLA {naive.availabilitySLA}
              </div>
            </div>

            {/* Simulated Comparative Telemetry HUD */}
            <div className="stage-telemetry-hud bad-hud">
              <div className="hud-metric">
                <span className="hud-label">Server CPU (Simulated)</span>
                <span className={`hud-val ${isHighLoad ? 'text-danger' : 'text-warning'}`}>
                  {isChaos ? 'CPU 0% (OFFLINE)' : isExtremeLoad ? '99% (OVERHEATED)' : isHighLoad ? '78% (CHOKED)' : '24%'}
                </span>
              </div>
              <div className="hud-metric">
                <span className="hud-label">Latency (Simulated)</span>
                <span className="hud-val text-danger">
                  {isChaos ? 'TIMEOUT (∞)' : isExtremeLoad ? '4,800 ms (504)' : isHighLoad ? '1,840 ms' : '385 ms'}
                </span>
              </div>
              <div className="hud-metric">
                <span className="hud-label">Packet Loss</span>
                <span className="hud-val text-danger">
                  {isChaos ? '100% DROP' : isExtremeLoad ? '48.2% DROP' : isHighLoad ? '24.6%' : '4.2%'}
                </span>
              </div>
              <div className="hud-metric">
                <span className="hud-label">Health State</span>
                <span className={`hud-badge ${isChaos ? 'badge-failed' : isHighLoad ? 'badge-warn' : 'badge-subtle'}`}>
                  {isChaos ? 'SPOF SEVERED' : isHighLoad ? 'QUEUE SATURATED' : 'UNBUFFERED'}
                </span>
              </div>
            </div>

            {/* Dynamic Incident Log when stressed */}
            {(isHighLoad || activeAttack !== 'none') && (
              <div className="live-incident-log">
                <Flame size={12} />
                <span>
                  {activeAttack === 'ransomware' ? 'CRITICAL: Data wiped! Zero snapshots found! $50,000 ransom demanded!'
                    : activeAttack === 'az-outage' ? 'OUTAGE: us-east-1a offline! Monolith instance unreachable (502 Bad Gateway)!'
                    : activeAttack === 'ddos' ? 'DDOS: 500k SYN flood! Thread pool depleted, server kernel panic!'
                    : activeAttack === 'bill-shock' ? 'FINOPS BLEED: Paying $4,500/mo for overprovisioned idle disks!'
                    : 'INCIDENT: High load bottleneck! MySQL max_connections (1040) depleted!'}
                </span>
              </div>
            )}

            {/* Topology Box with Multi-Tier Architectural Lanes */}
            <div className="topology-box" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div className="tier-stack-container" style={{ flex: 1 }}>
                {groupNodesByTier(naive.nodes, false).map((tierGroup, idx) => (
                  <React.Fragment key={tierGroup.tierCode}>
                    {renderTierGroup(tierGroup, false)}
                    {idx < groupNodesByTier(naive.nodes, false).length - 1 && (
                      renderInterTierConduit(false, tierGroup.tierCode)
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Data Stream Status Bar */}
              <div className="flow-stream-bar" style={{ marginTop: 'auto' }}>
                <span>{isChaos ? 'Connection timeout / server uncontactable' : isHighLoad ? 'Queue saturated • Dropping transactions' : 'Direct unbuffered connection'}</span>
                <svg width="60" height="12" viewBox="0 0 60 12">
                  <line x1="0" y1="6" x2="60" y2="6" stroke="var(--separator)" strokeWidth="1" strokeDasharray="3 3" />
                  {trafficActive && !isChaos && (
                    <circle cx="10" cy="6" r="2.5" fill="var(--status-warning)">
                      <animate attributeName="cx" from="0" to="60" dur={animDuration(2.2)} repeatCount="indefinite" />
                    </circle>
                  )}
                  {isChaos && (
                    <circle cx="30" cy="6" r="3" fill="var(--status-danger)" />
                  )}
                </svg>
                <ArrowRight size={11} color="var(--text-tertiary)" />
              </div>

              {/* Recovery SLA info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', borderTop: '1px solid var(--separator-subtle)', paddingTop: 8 }}>
                <span>RTO: {naive.rto}</span>
                <span>RPO: {naive.rpo}</span>
              </div>
            </div>

            {/* Checklist */}
            <ul className="calm-list" style={{ marginTop: 'auto' }}>
              {naive.bulletPoints.map((pt, i) => (
                <li key={i} className="calm-item">
                  <X size={14} color="var(--status-danger)" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Well-Architected Stage Panel */}
        {(viewMode === 'split' || viewMode === 'well-arch-only') && (
          <div className="stage-panel well-arch-panel" style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div className="panel-header">
              <div className="panel-label-group">
                <span className="tag-pill well-arch">Well-Architected</span>
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {wellArch.name}
                </h3>
              </div>
              <div className="panel-metrics-pill" style={{ color: 'var(--status-success)' }}>
                ${wellArch.monthlyCostEst}/mo • SLA {wellArch.availabilitySLA}
              </div>
            </div>

            {/* Simulated Comparative Telemetry HUD */}
            <div className="stage-telemetry-hud good-hud">
              <div className="hud-metric">
                <span className="hud-label">Server Fleet (Simulated)</span>
                <span className="hud-val text-success">
                  {isHighLoad ? '32% (BALANCED ACROSS 3 AZs)' : '18%'}
                </span>
              </div>
              <div className="hud-metric">
                <span className="hud-label">Latency (Simulated)</span>
                <span className="hud-val text-success">
                  {isChaos ? '21 ms (HEALED)' : isHighLoad ? '18 ms' : '15 ms'}
                </span>
              </div>
              <div className="hud-metric">
                <span className="hud-label">Packet Loss</span>
                <span className="hud-val text-success">0.00% (ZERO DROPS)</span>
              </div>
              <div className="hud-metric">
                <span className="hud-label">Health State</span>
                <span className="hud-badge badge-success">
                  {isChaos ? 'MULTI-AZ HEALED' : isHighLoad ? 'AUTO-SCALED' : 'OPTIMAL & RESILIENT'}
                </span>
              </div>
            </div>

            {/* Dynamic Auto-Scale & Resilience Banner */}
            {(isHighLoad || activeAttack !== 'none') && (
              <div className="live-autoscale-banner">
                <ShieldCheck size={12} color="#30D158" />
                <span>
                  {activeAttack === 'ransomware' ? 'PROTECTED: S3 Object Lock (WORM) rejected DELETE! AWS Backup continuous recovery ready.'
                    : activeAttack === 'az-outage' ? 'RESILIENT: Target group health-check rerouted 100% of traffic to healthy AZ in 220ms!'
                    : activeAttack === 'ddos' ? 'SHIELDED: AWS WAF & Shield dropped 99.8% of flood vectors at 600+ Edge POPs!'
                    : activeAttack === 'bill-shock' ? 'FINOPS EFFICIENCY: S3 Intelligent-Tiering automatically saved 68% by archiving cold data!'
                    : `ELASTIC ASG: Auto-Scaled +2 instances across Multi-AZ subnets! Zero dropped requests!`}
                </span>
              </div>
            )}

            {/* Topology Box with Multi-Tier Architectural Lanes */}
            <div className="topology-box" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div className="tier-stack-container" style={{ flex: 1 }}>
                {groupNodesByTier(wellArch.nodes, true).map((tierGroup, idx) => (
                  <React.Fragment key={tierGroup.tierCode}>
                    {renderTierGroup(tierGroup, true)}
                    {idx < groupNodesByTier(wellArch.nodes, true).length - 1 && (
                      renderInterTierConduit(true, tierGroup.tierCode)
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Data Stream Status Bar */}
              <div className="flow-stream-bar" style={{ color: 'var(--status-success)', marginTop: 'auto' }}>
                <span>{isChaos ? 'Health check failover active' : isHighLoad ? 'Horizontal auto-scale across Multi-AZ subnets' : 'Multi-AZ encrypted request stream'}</span>
                <svg width="60" height="12" viewBox="0 0 60 12">
                  <line x1="0" y1="6" x2="60" y2="6" stroke="var(--separator)" strokeWidth="1" strokeDasharray="3 3" />
                  {trafficActive && (
                    <circle cx="10" cy="6" r="2.5" fill="var(--status-success)">
                      <animate attributeName="cx" from="0" to="60" dur={animDuration(1.2)} repeatCount="indefinite" />
                    </circle>
                  )}
                </svg>
                <ArrowRight size={11} color="var(--status-success)" />
              </div>

              {/* Recovery SLA info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--status-success)', borderTop: '1px solid var(--separator-subtle)', paddingTop: 8 }}>
                <span>RTO: {wellArch.rto}</span>
                <span>RPO: {wellArch.rpo}</span>
              </div>
            </div>

            {/* Checklist */}
            <ul className="calm-list" style={{ marginTop: 'auto' }}>
              {wellArch.bulletPoints.map((pt, i) => (
                <li key={i} className="calm-item">
                  <Check size={14} color="var(--status-success)" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DualArchitectureStage;
