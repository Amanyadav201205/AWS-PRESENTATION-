import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Split, 
  Eye, 
  Check, 
  X, 
  Play, 
  Pause,
  Zap,
  Activity,
  Layers,
  ShieldCheck,
  AlertOctagon,
  RefreshCw,
  Gauge,
  Sliders,
  Flame,
  ShieldAlert,
  Skull,
  DollarSign,
  TrendingDown
} from 'lucide-react';
import { ArchitectureNode, ArchitectureSpec, ChaosPhase, ViewMode } from '../types';
import { AwsServiceIcon } from './AwsServiceIcon';
import { soundFX } from '../utils/soundEffects';

interface DualStageProps {
  naive: ArchitectureSpec;
  wellArch: ArchitectureSpec;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  chaosPhase: ChaosPhase;
  affectedNodeIds: string[];
  onSelectNode: (node: ArchitectureNode, isWellArch: boolean) => void;
}

type AttackScenario = 'none' | 'az-outage' | 'ransomware' | 'ddos' | 'bill-shock';

export const DualArchitectureStage: React.FC<DualStageProps> = ({
  naive,
  wellArch,
  viewMode,
  setViewMode,
  chaosPhase,
  affectedNodeIds,
  onSelectNode
}) => {
  const [trafficActive, setTrafficActive] = useState<boolean>(true);
  const [trafficSpeed, setTrafficSpeed] = useState<number>(1);
  const [userLoad, setUserLoad] = useState<number>(2500);
  const [activeAttack, setActiveAttack] = useState<AttackScenario>('none');
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
    // If high load is applied to Well-Architected, dynamically spawn 2 new container/EC2 nodes across Multi-AZ subnets!
    if (isWellArch && (isHighLoad || activeAttack === 'ddos')) {
      effectiveNodes.push(
        {
          id: 'dyn-scale-node-1',
          name: 'App Worker 2 (Auto-Scaled)',
          type: 'compute',
          service: 'Amazon EC2 (c7g Graviton3)',
          tier: 'private',
          az: 'us-east-1a',
          status: 'healthy',
          description: 'Horizontally scaled Graviton3 worker spawned by Auto Scaling Group in response to traffic surge',
          configDetails: {
            specs: 'c7g.xlarge (Graviton3 ARM64) auto-spawned in Private Subnet A',
            securityPolicy: 'Isolated Security Group (Inbound from ALB only)',
            costProfile: 'Elastic pay-per-use (shuts down when surge recedes)',
            wafAdvantage: 'Zero dropped transactions during 100k surge'
          }
        },
        {
          id: 'dyn-scale-node-2',
          name: 'App Worker 3 (Auto-Scaled)',
          type: 'compute',
          service: 'Amazon EC2 (c7g Graviton3)',
          tier: 'private',
          az: 'us-east-1b',
          status: 'healthy',
          description: 'Horizontally scaled Graviton3 worker spawned in AZ-b for cross-zone load balancing',
          configDetails: {
            specs: 'c7g.xlarge (Graviton3 ARM64) auto-spawned in Private Subnet B',
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
      // ANTI-PATTERN CONDUIT: Single constricted line, drops packets under load or attack
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
              <>
                <circle cx="200" cy="4" r={isHighLoad ? 4 : 2.5} fill={isHighLoad ? '#FF453A' : '#FF9F0A'}>
                  <animate attributeName="cy" from="0" to="34" dur={animDuration(2.0)} repeatCount="indefinite" />
                </circle>
                {isHighLoad && (
                  <circle cx="204" cy="20" r="3" fill="#FF453A" opacity="0.9">
                    <animate attributeName="cx" from="200" to="240" dur="0.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="1" to="0" dur="0.8s" repeatCount="indefinite" />
                  </circle>
                )}
              </>
            )}

            {isDropping && (
              <g>
                <circle cx="200" cy="17" r="4.5" fill="#FF453A" />
                <text x="216" y="21" fill="#FF453A" fontSize="9" fontFamily="var(--font-mono)" fontWeight="700">
                  {isChaos ? 'DROP 100% (504)' : isHighLoad ? 'QUEUE OVERFLOW' : 'EXHAUSTED'}
                </text>
              </g>
            )}
          </svg>

          <div className="conduit-hud-label">
            <span className={isDropping ? 'text-danger' : 'text-muted'}>
              {isChaos ? 'SPOF Broken • Single Point of Failure Collapsed' : isHighLoad ? 'Queue Full • Memory Leak • Dropping 28% Requests' : 'Direct Synchronous Unbuffered Coupling'}
            </span>
          </div>
        </div>
      );
    }

    // WELL-ARCHITECTED CONDUIT: Dual Multi-AZ Parallel Lanes, Auto-Scaling
    return (
      <div className="inter-tier-conduit well-arch-conduit">
        <svg width="100%" height="34" viewBox="0 0 400 34" className="conduit-svg" preserveAspectRatio="none">
          <defs>
            <filter id="packet-glow-neon" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Lane A: AZ-a Multi-AZ Stream */}
          <path d="M 160 0 C 160 16, 140 18, 140 34" stroke="rgba(41, 151, 255, 0.45)" strokeWidth={isHighLoad ? 3 : 2} strokeDasharray="3 3" fill="none" />
          
          {/* Lane B: AZ-b Multi-AZ Stream */}
          <path d="M 240 0 C 240 16, 260 18, 260 34" stroke="rgba(48, 209, 88, 0.45)" strokeWidth={isHighLoad ? 3 : 2} strokeDasharray="3 3" fill="none" />

          {/* Center Spine */}
          <line x1="200" y1="0" x2="200" y2="34" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" strokeDasharray="2 2" />

          {/* Flowing Laser Particles Lane A */}
          {trafficActive && (
            <circle cx="0" cy="0" r={isHighLoad ? 4 : 3} fill="#2997FF" filter="url(#packet-glow-neon)">
              <animateMotion path="M 160 0 C 160 16, 140 18, 140 34" dur={animDuration(1.0)} repeatCount="indefinite" />
            </circle>
          )}

          {/* Flowing Laser Particles Lane B */}
          {trafficActive && (
            <circle cx="0" cy="0" r={isHighLoad ? 4 : 3} fill="#30D158" filter="url(#packet-glow-neon)">
              <animateMotion path="M 240 0 C 240 16, 260 18, 260 34" dur={animDuration(1.0)} begin="0.35s" repeatCount="indefinite" />
            </circle>
          )}

          {/* High Load Wave Packets */}
          {trafficActive && isHighLoad && (
            <>
              <circle cx="0" cy="0" r="3.5" fill="#FF9900" filter="url(#packet-glow-neon)">
                <animateMotion path="M 160 0 C 160 16, 140 18, 140 34" dur={animDuration(0.5)} repeatCount="indefinite" />
              </circle>
              <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" filter="url(#packet-glow-neon)">
                <animateMotion path="M 240 0 C 240 16, 260 18, 260 34" dur={animDuration(0.5)} begin="0.2s" repeatCount="indefinite" />
              </circle>
            </>
          )}

          {/* Active Auto-Heal or Resilience Tag */}
          {(isChaos || activeAttack !== 'none') && (
            <g>
              <rect x="145" y="8" width="110" height="18" rx="4" fill="rgba(48, 209, 88, 0.2)" stroke="#30D158" strokeWidth="1" />
              <text x="200" y="21" fill="#30D158" fontSize="9" fontFamily="var(--font-mono)" fontWeight="700" textAnchor="middle">
                {activeAttack === 'ransomware' ? 'OBJECT LOCK SAFE' : activeAttack === 'ddos' ? 'SHIELD PROTECTED' : 'MULTI-AZ HEALED'}
              </text>
            </g>
          )}
        </svg>

        <div className="conduit-hud-label">
          <span className="text-success">
            {isHighLoad ? 'Auto-Scaled Multi-AZ Ingress: 0 Dropped Packets • ALB Balanced' : isChaos ? 'Target Group Health-Check: Traffic Diverted to Healthy AZ (< 300ms)' : 'Multi-AZ Load Balanced Stream (Encrypted TLS 1.3)'}
          </span>
        </div>
      </div>
    );
  };

  const renderTierGroup = (
    tierGroup: { title: string; nodes: ArchitectureNode[]; tierCode: string },
    isWellArch: boolean
  ) => {
    const cidrHint = !isWellArch
      ? 'Flat Un-segmented VPC (10.0.0.0/16)'
      : tierGroup.tierCode === 'ingress'
      ? 'Public Subnets: 10.0.1.0/24 (AZ-a) & 10.0.2.0/24 (AZ-b)'
      : tierGroup.tierCode === 'compute'
      ? 'Private App Subnets: 10.0.10.0/24 (AZ-a) & 10.0.11.0/24 (AZ-b)'
      : 'Isolated Data Subnets: 10.0.20.0/24 (Multi-AZ Encrypted)';

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
                title="Click to view deep technical specs, IAM isolation & cost breakdown"
              >
                {/* Official AWS Service Icon */}
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
      {/* =========================================================================
          INTERACTIVE ARCHITECTURE STRESS-TEST & DISASTER SANDBOX (EXCITING CONTROLS)
          ========================================================================= */}
      <div className="simulation-sandbox-bar">
        {/* Top Row: User Load Slider & Presets */}
        <div className="sandbox-top-row">
          <div className="sandbox-label-group">
            <span className="sandbox-title">
              <Activity size={14} color="#2997FF" /> Live Traffic Load Simulator
            </span>
            <span className="stage-live-indicator">
              <span className="pulse-circle" /> LIVE ENGINE
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
              👥 {userLoad.toLocaleString()} Concurrent Users
            </div>
          </div>

          {/* Quick Presets */}
          <div className="sandbox-presets-row">
            <button
              className={`preset-chip ${userLoad === 1000 ? 'active' : ''}`}
              onClick={() => { soundFX.playClick(); setUserLoad(1000); setActiveAttack('none'); }}
            >
              ☕ Normal (1k)
            </button>
            <button
              className={`preset-chip ${userLoad === 25000 ? 'active' : ''}`}
              onClick={() => { soundFX.playClick(); setUserLoad(25000); }}
            >
              ⚡ Flash Sale (25k)
            </button>
            <button
              className={`preset-chip ${userLoad === 100000 ? 'danger-active' : ''}`}
              onClick={() => { soundFX.playChaosAlarm(); setUserLoad(100000); }}
            >
              🚀 Black Friday (100k)
            </button>
          </div>
        </div>

        {/* Bottom Row: Chaos Disaster Scenarios & Controls */}
        <div className="disaster-attacks-row">
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'flex', alignItems: 'center', gap: 5 }}>
            <Flame size={12} color="#FF453A" /> Inject Disaster Attack:
          </span>

          <button
            className={`disaster-attack-btn ${activeAttack === 'az-outage' ? 'active' : ''}`}
            onClick={() => triggerAttack('az-outage')}
            title="Simulate complete power outage in us-east-1a Availability Zone"
          >
            <AlertOctagon size={12} />
            <span>AZ-a Power Failure</span>
          </button>

          <button
            className={`disaster-attack-btn ${activeAttack === 'ransomware' ? 'active' : ''}`}
            onClick={() => triggerAttack('ransomware')}
            title="Simulate malicious ransomware wiper deleting S3 and EBS data"
          >
            <Skull size={12} />
            <span>Ransomware Wiper Attack</span>
          </button>

          <button
            className={`disaster-attack-btn ${activeAttack === 'ddos' ? 'active' : ''}`}
            onClick={() => triggerAttack('ddos')}
            title="Simulate 500,000 requests/sec SYN flood attack"
          >
            <ShieldAlert size={12} />
            <span>500k SYN Flood DDoS</span>
          </button>

          <button
            className={`disaster-attack-btn ${activeAttack === 'bill-shock' ? 'active' : ''}`}
            onClick={() => triggerAttack('bill-shock')}
            title="Simulate runaway over-provisioned cloud bill shock"
            style={{ color: '#FF9F0A', borderColor: 'rgba(255, 159, 10, 0.3)', background: 'rgba(255, 159, 10, 0.08)' }}
          >
            <DollarSign size={12} />
            <span>FinOps Bill Shock</span>
          </button>

          {activeAttack !== 'none' && (
            <button
              className="btn-action"
              onClick={() => { soundFX.playHealChime(); setActiveAttack('none'); }}
              style={{ fontSize: 11, height: 26, marginLeft: 'auto', gap: 4 }}
            >
              <RefreshCw size={11} /> Reset Attack State
            </button>
          )}
        </div>
      </div>

      {/* Stage Layout Bar & View Modes */}
      <div className="stage-controls-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Side-by-Side Topology Comparison (select any component to inspect)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {/* Stream Toggle */}
          <button
            className={`btn-action ${trafficActive ? 'active-quiet' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setTrafficActive(!trafficActive);
            }}
            style={{ height: 28, fontSize: 11, padding: '0 8px', gap: 5 }}
            title="Toggle live packet stream simulation"
          >
            {trafficActive ? <Pause size={11} /> : <Play size={11} />}
            <span className="btn-label-desktop">{trafficActive ? 'Stream Active' : 'Stream Paused'}</span>
          </button>

          {/* Speed Multiplier */}
          <div className="segmented-control" title="Simulation Speed">
            <button
              className={`segmented-item ${trafficSpeed === 1 ? 'active' : ''}`}
              onClick={() => { soundFX.playClick(); setTrafficSpeed(1); }}
              style={{ fontSize: 10, padding: '2px 6px' }}
            >
              1x
            </button>
            <button
              className={`segmented-item ${trafficSpeed === 2 ? 'active' : ''}`}
              onClick={() => { soundFX.playClick(); setTrafficSpeed(2); }}
              style={{ fontSize: 10, padding: '2px 6px' }}
            >
              2x
            </button>
            <button
              className={`segmented-item ${trafficSpeed === 4 ? 'active' : ''}`}
              onClick={() => { soundFX.playClick(); setTrafficSpeed(4); }}
              style={{ fontSize: 10, padding: '2px 6px' }}
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
            style={{ height: 28, fontSize: 11, padding: '0 8px' }}
            title="Show / hide VPC Subnet isolation boundaries"
          >
            <Layers size={11} />
            <span className="btn-label-desktop">Subnet Tiers</span>
          </button>

          {/* Apple Segmented View Toggle */}
          <div className="segmented-control" role="tablist">
            <button
              className={`segmented-item ${viewMode === 'split' ? 'active' : ''}`}
              onClick={() => {
                soundFX.playClick();
                setViewMode('split');
              }}
              role="tab"
              aria-selected={viewMode === 'split'}
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
            >
              <Eye size={12} />
              <span>Well-Architected</span>
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-Side Dual Stage Grid */}
      <div className={`dual-stage-grid ${viewMode === 'split' ? 'split-view' : 'single-view'}`}>
        {/* Anti-Pattern Stage Panel */}
        {(viewMode === 'split' || viewMode === 'naive-only') && (
          <div className={`stage-panel anti-pattern-panel ${isChaos ? 'failed' : ''}`}>
            {/* Header */}
            <div className="panel-header">
              <div className="panel-label-group">
                <span className="tag-pill naive">Anti-pattern</span>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {naive.name}
                </span>
              </div>
              <div className="panel-metrics-pill" style={{ color: 'var(--status-danger)' }}>
                ${naive.monthlyCostEst}/mo • SLA {naive.availabilitySLA}
              </div>
            </div>

            {/* Live Comparative Telemetry HUD */}
            <div className="stage-telemetry-hud bad-hud">
              <div className="hud-metric">
                <span className="hud-label">Server CPU Load</span>
                <span className={`hud-val ${isHighLoad ? 'text-danger' : 'text-warning'}`}>
                  {isChaos ? 'CPU 0% (OFFLINE)' : isExtremeLoad ? '99% (OVERHEATED 🔥)' : isHighLoad ? '78% (CHOKED)' : '24%'}
                </span>
              </div>
              <div className="hud-metric">
                <span className="hud-label">Live Latency</span>
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
            <div className="topology-box">
              <div className="tier-stack-container">
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
              <div className="flow-stream-bar">
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
            <ul className="calm-list">
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
          <div className="stage-panel well-arch-panel">
            {/* Header */}
            <div className="panel-header">
              <div className="panel-label-group">
                <span className="tag-pill well-arch">Well-Architected</span>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {wellArch.name}
                </span>
              </div>
              <div className="panel-metrics-pill" style={{ color: 'var(--status-success)' }}>
                ${wellArch.monthlyCostEst}/mo • SLA {wellArch.availabilitySLA}
              </div>
            </div>

            {/* Live Comparative Telemetry HUD */}
            <div className="stage-telemetry-hud good-hud">
              <div className="hud-metric">
                <span className="hud-label">Server Fleet Load</span>
                <span className="hud-val text-success">
                  {isHighLoad ? '32% (BALANCED ACROSS 3 AZs)' : '18%'}
                </span>
              </div>
              <div className="hud-metric">
                <span className="hud-label">Live Latency</span>
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
            <div className="topology-box">
              <div className="tier-stack-container">
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
              <div className="flow-stream-bar" style={{ color: 'var(--status-success)' }}>
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
            <ul className="calm-list">
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
