import { DomainData, PillarType } from '../types';
import { overviewDomain } from './domains/overview';
import { storageDomain } from './domains/storage';
import { computeDomain } from './domains/compute';
import { databaseDomain } from './domains/database';
import { networkingDomain } from './domains/networking';
import { connectingDomain } from './domains/connecting';
import { securityDomain } from './domains/security';
import { monitoringDomain } from './domains/monitoring';
import { automationDomain } from './domains/automation';
import { cachingDomain } from './domains/caching';
import { decoupledDomain } from './domains/decoupled';
import { serverlessDomain } from './domains/serverless';
import { dataPipelinesDomain } from './domains/datapipelines';
import { disasterRecoveryDomain } from './domains/disasterrecovery';
import { conclusionDomain } from './domains/conclusion';

export const allDomains: DomainData[] = [
  overviewDomain,
  storageDomain,
  computeDomain,
  databaseDomain,
  networkingDomain,
  connectingDomain,
  securityDomain,
  monitoringDomain,
  automationDomain,
  cachingDomain,
  decoupledDomain,
  serverlessDomain,
  dataPipelinesDomain,
  disasterRecoveryDomain,
  conclusionDomain
];

export const allPillars: { name: PillarType; color: string; icon: string; description: string }[] = [
  {
    name: 'Operational Excellence',
    color: '#3B82F6',
    icon: 'Activity',
    description: 'Run and monitor systems to deliver business value and continually improve processes and procedures.'
  },
  {
    name: 'Security',
    color: '#EF4444',
    icon: 'Shield',
    description: 'Protect information, systems, and assets while delivering business value through risk assessments and mitigation.'
  },
  {
    name: 'Reliability',
    color: '#10B981',
    icon: 'RefreshCw',
    description: 'Ensure a workload performs its intended function correctly and consistently when it’s expected to.'
  },
  {
    name: 'Performance Efficiency',
    color: '#F59E0B',
    icon: 'Zap',
    description: 'Use computing resources efficiently to meet requirements and maintain that efficiency as demand changes.'
  },
  {
    name: 'Cost Optimization',
    color: '#8B5CF6',
    icon: 'DollarSign',
    description: 'Avoid unnecessary costs and understand where money is spent to optimize workloads over time.'
  },
  {
    name: 'Sustainability',
    color: '#14B8A6',
    icon: 'Leaf',
    description: 'Minimize environmental impacts of running cloud workloads through right-sizing and serverless adoption.'
  }
];

export function getDomainById(id: string): DomainData | undefined {
  return allDomains.find(d => d.id === id);
}

export function getDomainByNumber(num: number): DomainData | undefined {
  return allDomains.find(d => d.number === num);
}

export interface DRStrategy {
  id: string;
  name: string;
  rpo: string;
  rto: string;
  costMultiplier: string;
  costEstimate: string;
  description: string;
  architectureNotes: string;
}

export const drStrategies: DRStrategy[] = [
  {
    id: 'backup-restore',
    name: 'Backup & Restore',
    rpo: '24 Hours',
    rto: '24 Hours',
    costMultiplier: '1x ($)',
    costEstimate: '$80 / mo',
    description: 'Data is backed up to S3 and replicated to a secondary region. Compute is provisioned only after disaster strikes.',
    architectureNotes: 'Lowest cost. Suitable for non-critical workloads, internal dev environments, and batch workloads.'
  },
  {
    id: 'pilot-light',
    name: 'Pilot Light',
    rpo: '10 Minutes',
    rto: '2 Hours',
    costMultiplier: '2.5x ($$)',
    costEstimate: '$240 / mo',
    description: 'Core databases are continuously replicated and kept running live in the secondary region. App servers exist as AMIs ready to scale.',
    architectureNotes: 'The database "pilot flame" is always on. Rapidly scales out compute via Auto Scaling when failover is invoked.'
  },
  {
    id: 'warm-standby',
    name: 'Warm Standby',
    rpo: 'Seconds',
    rto: '10 Minutes',
    costMultiplier: '4x ($$$)',
    costEstimate: '$450 / mo',
    description: 'A scaled-down, minimum functional copy of the entire stack is always running in the secondary region.',
    architectureNotes: 'Can take live traffic immediately in a degraded state while Auto Scaling ramps up to 100% capacity.'
  },
  {
    id: 'multi-region-active',
    name: 'Multi-Region Active-Active',
    rpo: '< 1 Second',
    rto: '< 30 Seconds',
    costMultiplier: '7x ($$$$)',
    costEstimate: '$980 / mo',
    description: 'Workloads run simultaneously in 2+ AWS regions with Route 53 latency routing and Aurora Global Database.',
    architectureNotes: 'Near-zero downtime. Survives catastrophic regional blackouts with automatic failover and zero human intervention.'
  }
];
