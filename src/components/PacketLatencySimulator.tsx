import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  RotateCcw, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Send, 
  Layers, 
  Activity,
  Flame,
  ArrowRight
} from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

interface PacketLatencySimulatorProps {
  onClose: () => void;
}

interface HopDetail {
  name: string;
  naiveMs: number;
  wellArchMs: number;
  naiveBottleneck: string;
  wellArchAdvantage: string;
}

const hops: HopDetail[] = [
  {
    name: '1. DNS Resolution',
    naiveMs: 95,
    wellArchMs: 10,
    naiveBottleneck: 'Un-cached public recursive ISP lookup; no anycast',
    wellArchAdvantage: 'Amazon Route 53 Anycast DNS with latency-based routing'
  },
  {
    name: '2. Ingress & Edge Shield',
    naiveMs: 180,
    wellArchMs: 12,
    naiveBottleneck: 'Cross-country public internet hops with high packet jitter',
    wellArchAdvantage: 'CloudFront 450+ Edge POPs & AWS private backbone transit'
  },
  {
    name: '3. Compute Processing',
    naiveMs: 1420,
    wellArchMs: 14,
    naiveBottleneck: 'Single EC2 instance maxed at 100% CPU; worker thread lock',
    wellArchAdvantage: 'Application Load Balancer + Auto-Scaled Graviton3 ECS tasks'
  },
  {
    name: '4. Database / Cache I/O',
    naiveMs: 2150,
    wellArchMs: 2,
    naiveBottleneck: 'Direct SQL query on single gp2 disk; burst credit starved',
    wellArchAdvantage: 'ElastiCache Redis in-memory hit (2ms) / Aurora Read Replica'
  }
];

export const PacketLatencySimulator: React.FC<PacketLatencySimulatorProps> = ({ onClose }) => {
  const [simulationState, setSimulationState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [packetProgress, setPacketProgress] = useState<{ naive: number; wellArch: number }>({ naive: 0, wellArch: 0 });
  const [burstActive, setBurstActive] = useState<boolean>(false);
  const [burstPackets, setBurstPackets] = useState<{ id: number; status: 'naive-dropped' | 'well-success' | 'pending' }[]>([]);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1); // 0.5, 1, 2

  const animRef = useRef<number | null>(null);

  const totalNaiveMs = hops.reduce((acc, h) => acc + h.naiveMs, 0); // 3,845 ms
  const totalWellArchMs = hops.reduce((acc, h) => acc + h.wellArchMs, 0); // 38 ms (or 24ms cached)

  // Trigger Single Request Simulation
  const handleStartSimulation = () => {
    soundFX.playClick();
    setSimulationState('running');
    setBurstActive(false);
    setPacketProgress({ naive: 0, wellArch: 0 });

    const startTime = performance.now();
    // Scaled simulation duration: Well-Arch finishes in ~800ms, Naive finishes in ~3500ms
    const naiveDuration = 3800 / speedMultiplier;
    const wellArchDuration = 600 / speedMultiplier;

    let wellArchDone = false;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const wellArchP = Math.min(100, (elapsed / wellArchDuration) * 100);
      const naiveP = Math.min(100, (elapsed / naiveDuration) * 100);

      if (wellArchP >= 100 && !wellArchDone) {
        wellArchDone = true;
        soundFX.playHealChime();
      }

      setPacketProgress({ naive: naiveP, wellArch: wellArchP });

      if (naiveP < 100 || wellArchP < 100) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        setSimulationState('completed');
      }
    };

    animRef.current = requestAnimationFrame(tick);
  };

  // Trigger 20x Burst Test
  const handleStartBurst = () => {
    soundFX.playChaosAlarm();
    setSimulationState('running');
    setBurstActive(true);
    setPacketProgress({ naive: 100, wellArch: 100 });

    // Generate 20 simulated burst packets
    const packets = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      // In Naive, packets 9-20 drop with HTTP 504 / 429
      status: i >= 8 ? ('naive-dropped' as const) : ('well-success' as const)
    }));
    setBurstPackets(packets);
    setSimulationState('completed');
  };

  const handleReset = () => {
    soundFX.playClick();
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setSimulationState('idle');
    setPacketProgress({ naive: 0, wellArch: 0 });
    setBurstActive(false);
    setBurstPackets([]);
  };

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div className="sheet-overlay" role="dialog" aria-modal="true" aria-label="Interactive Packet Latency & Flight Simulator">
      <div className="presenter-dialog packet-sheet" style={{ maxWidth: 960, maxHeight: '92vh' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--separator)', paddingBottom: 'var(--space-3)', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>⏱️</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Interactive Packet Latency & Flight Benchmark
                </h2>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 'var(--radius-pill)', background: 'var(--accent-subtle)', color: 'var(--accent)', fontWeight: 600 }}>
                  Real-World Transit Simulation
                </span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                Visual packet propagation: compare round-trip network & processing time across Naive vs. Well-Architected pipelines
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Speed Presets */}
            <div className="segmented-control" style={{ height: 26, padding: 1 }}>
              {[0.5, 1, 2].map(s => (
                <button
                  key={s}
                  className={`segmented-item ${speedMultiplier === s ? 'active' : ''}`}
                  onClick={() => setSpeedMultiplier(s)}
                  style={{ padding: '2px 7px', fontSize: 11, minHeight: 22 }}
                  title={`${s}x simulation playback speed`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Play single request */}
            <button
              className="btn-action primary"
              onClick={handleStartSimulation}
              disabled={simulationState === 'running'}
              style={{ height: 28, fontSize: 12, gap: 5 }}
            >
              <Send size={12} />
              <span>Send Single Request</span>
            </button>

            {/* Send 20x burst */}
            <button
              className="btn-action danger-quiet"
              onClick={handleStartBurst}
              style={{ height: 28, fontSize: 12, gap: 5 }}
              title="Simulate sudden concurrent traffic burst (shows dropped packets in bad architecture)"
            >
              <Flame size={12} color="var(--status-danger)" />
              <span>Send 20x Burst</span>
            </button>

            <button
              className="btn-action btn-icon"
              onClick={handleReset}
              title="Reset simulation"
              aria-label="Reset simulation"
            >
              <RotateCcw size={13} />
            </button>

            <button
              className="btn-action btn-icon"
              onClick={() => {
                soundFX.playClick();
                onClose();
              }}
              aria-label="Close Packet Simulator"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ overflowY: 'auto', paddingRight: 6, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', flex: 1, marginTop: 'var(--space-3)' }}>
          {/* Side-by-Side Physical Packet Wire Animation */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-3)' }}>
            {/* Pipeline 1: Bad Architecture Track */}
            <div style={{ background: 'rgba(255, 69, 58, 0.06)', border: '1px solid rgba(255, 69, 58, 0.3)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--status-danger)', textTransform: 'uppercase' }}>
                    🔴 Bad Architecture Track (Naive Monolith)
                  </span>
                  <span style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4, background: 'rgba(255, 69, 58, 0.2)', color: 'var(--status-danger)', fontFamily: 'var(--font-mono)' }}>
                    Total: ~3,845 ms
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--status-danger)', fontWeight: 600 }}>
                  {packetProgress.naive >= 100 
                    ? '🐌 SEVERE BOTTLENECK (Timeout Hazard)' 
                    : simulationState === 'running' ? `In Flight (${Math.round((packetProgress.naive / 100) * totalNaiveMs)} ms)` : 'Ready to Send'}
                </div>
              </div>

              {/* Physical Wire & Packet Animation */}
              <div style={{ position: 'relative', height: 48, background: 'rgba(0, 0, 0, 0.6)', borderRadius: 8, border: '1px solid var(--separator)', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
                {/* 4 Hops Markers */}
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', position: 'relative', zIndex: 2 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>Client (0ms)</div>
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>DNS (95ms)</div>
                  <div style={{ fontSize: 10, color: 'var(--status-warning)' }}>Transit (275ms)</div>
                  <div style={{ fontSize: 10, color: 'var(--status-danger)' }}>EC2 Lock (1.7s)</div>
                  <div style={{ fontSize: 10, color: 'var(--status-danger)' }}>gp2 Disk (3.8s)</div>
                </div>

                {/* Progress Track Line */}
                <div 
                  style={{
                    position: 'absolute',
                    left: 16,
                    right: 16,
                    height: 4,
                    background: 'rgba(255, 69, 58, 0.2)',
                    borderRadius: 2
                  }}
                >
                  <div 
                    style={{
                      height: '100%',
                      width: `${packetProgress.naive}%`,
                      background: 'var(--status-danger)',
                      borderRadius: 2,
                      transition: simulationState === 'running' ? 'none' : 'width 0.3s'
                    }}
                  />
                  {/* Animated Moving Packet Dot */}
                  {simulationState === 'running' && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: `${packetProgress.naive}%`,
                        transform: 'translate(-50%, -50%)',
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        background: 'var(--status-danger)',
                        boxShadow: '0 0 12px var(--status-danger)',
                        zIndex: 5
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Explanation of Bottlenecks */}
              <div style={{ marginTop: 'var(--space-2)', fontSize: 12, color: 'var(--text-secondary)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <span>• No CDN: Public internet packet jitter</span>
                <span>• Single EC2: 100% CPU queue contention</span>
                <span>• gp2 Disk: Burst credit exhaustion</span>
              </div>
            </div>

            {/* Pipeline 2: Well-Architected Track */}
            <div style={{ background: 'rgba(48, 209, 88, 0.06)', border: '1px solid rgba(48, 209, 88, 0.3)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--status-success)', textTransform: 'uppercase' }}>
                    🟢 AWS Well-Architected Track (Edge-Accelerated & Decoupled)
                  </span>
                  <span style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4, background: 'rgba(48, 209, 88, 0.2)', color: 'var(--status-success)', fontFamily: 'var(--font-mono)' }}>
                    Total: ~24 ms (160x Faster)
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--status-success)', fontWeight: 600 }}>
                  {packetProgress.wellArch >= 100 
                    ? '⚡ SUB-30MS RESPONSIVE (160x Acceleration)' 
                    : simulationState === 'running' ? `In Flight (${Math.round((packetProgress.wellArch / 100) * totalWellArchMs)} ms)` : 'Ready to Send'}
                </div>
              </div>

              {/* Physical Wire & Packet Animation */}
              <div style={{ position: 'relative', height: 48, background: 'rgba(0, 0, 0, 0.6)', borderRadius: 8, border: '1px solid var(--separator)', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
                {/* 4 Hops Markers */}
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', position: 'relative', zIndex: 2 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>Client (0ms)</div>
                  <div style={{ fontSize: 10, color: 'var(--status-success)' }}>Route 53 (10ms)</div>
                  <div style={{ fontSize: 10, color: 'var(--status-success)' }}>CloudFront (12ms)</div>
                  <div style={{ fontSize: 10, color: 'var(--status-success)' }}>ALB + ECS (18ms)</div>
                  <div style={{ fontSize: 10, color: 'var(--status-success)' }}>Redis Cache (24ms)</div>
                </div>

                {/* Progress Track Line */}
                <div 
                  style={{
                    position: 'absolute',
                    left: 16,
                    right: 16,
                    height: 4,
                    background: 'rgba(48, 209, 88, 0.2)',
                    borderRadius: 2
                  }}
                >
                  <div 
                    style={{
                      height: '100%',
                      width: `${packetProgress.wellArch}%`,
                      background: 'var(--status-success)',
                      borderRadius: 2,
                      transition: simulationState === 'running' ? 'none' : 'width 0.3s'
                    }}
                  />
                  {/* Animated Moving Packet Dot */}
                  {simulationState === 'running' && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: `${packetProgress.wellArch}%`,
                        transform: 'translate(-50%, -50%)',
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        background: 'var(--status-success)',
                        boxShadow: '0 0 12px var(--status-success)',
                        zIndex: 5
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Explanation of Advantages */}
              <div style={{ marginTop: 'var(--space-2)', fontSize: 12, color: 'var(--text-secondary)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <span>• CloudFront Anycast: Sub-15ms edge hits</span>
                <span>• Auto-Scaled ECS: Multi-AZ load balanced</span>
                <span>• ElastiCache: In-memory sub-2ms lookups</span>
              </div>
            </div>
          </div>

          {/* Burst Traffic Packet Loss Matrix (Active on Burst Test) */}
          {burstActive && (
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--separator)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                  20x Concurrent Traffic Burst Telemetry
                </span>
                <span style={{ fontSize: 12, color: 'var(--status-danger)', fontWeight: 600 }}>
                  Naive: 60% Dropped (12/20) • Well-Architected: 0% Dropped (20/20 Success)
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))', gap: 6 }}>
                {burstPackets.map(p => (
                  <div 
                    key={p.id}
                    style={{
                      padding: '6px 4px',
                      borderRadius: 6,
                      textAlign: 'center',
                      fontSize: 10,
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      background: p.status === 'naive-dropped' ? 'rgba(255, 69, 58, 0.2)' : 'rgba(48, 209, 88, 0.2)',
                      color: p.status === 'naive-dropped' ? 'var(--status-danger)' : 'var(--status-success)',
                      border: `1px solid ${p.status === 'naive-dropped' ? 'var(--status-danger)' : 'var(--status-success)'}40`
                    }}
                    title={p.status === 'naive-dropped' ? `Packet #${p.id}: Dropped on Naive (HTTP 504 / Connection Refused) | Handled smoothly on Well-Architected` : `Packet #${p.id}: Processed in 22ms on Well-Architected`}
                  >
                    #{p.id}
                    <div style={{ fontSize: 8 }}>{p.status === 'naive-dropped' ? '504' : '200'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step-by-Step Hop-by-Hop Breakdown Table */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--separator)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 'var(--space-3)' }}>
              Hop-by-Hop Architecture Latency Breakdown
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {hops.map((hop, idx) => (
                <div key={idx} style={{ background: 'var(--bg-elevated)', borderRadius: 8, padding: 'var(--space-3)', border: '1px solid var(--separator-subtle)', display: 'grid', gridTemplateColumns: '160px 1fr 1fr', gap: 12, alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{hop.name}</div>
                  </div>

                  <div style={{ borderLeft: '2px solid var(--status-danger)', paddingLeft: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--status-danger)' }}>
                      {hop.naiveMs} ms
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                      {hop.naiveBottleneck}
                    </div>
                  </div>

                  <div style={{ borderLeft: '2px solid var(--status-success)', paddingLeft: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--status-success)' }}>
                      {hop.wellArchMs} ms
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                      {hop.wellArchAdvantage}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
