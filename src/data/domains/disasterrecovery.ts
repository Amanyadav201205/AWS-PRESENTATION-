import { DomainData } from '../../types';

export const disasterRecoveryDomain: DomainData = {
  id: 'disaster-recovery',
  number: 13,
  title: 'Disaster Recovery (DR) Planning & Management',
  subtitle: '4 AWS DR Strategies (Backup/Restore -> Pilot Light -> Warm Standby -> Multi-Region Active-Active) vs. "Backup & Hope"',
  category: 'Operations & Reliability',
  pillars: ['Reliability', 'Operational Excellence', 'Cost Optimization'],
  customerRequirement: {
    clientName: 'GlobalPay Financial Services',
    businessGoal: 'Guarantee business continuity for critical banking services with an RTO of under 1 minute and an RPO of under 1 second, even if an entire AWS primary region suffers a total outage.',
    challenges: [
      'Single-region dependency in us-east-1 leaves entire company vulnerable to regional blackouts',
      'Manual disaster recovery runbooks take 4 to 6 days to execute and have never been tested',
      'Cross-region database replication must not introduce application latency'
    ],
    budgetOrSlaTarget: 'RTO < 60 seconds | RPO < 1 second | 99.999% Regional Availability'
  },
  normalPrescription: {
    title: '"Backup and Hope" Single-Region Manual EBS Snapshots',
    prescribedServices: 'Occasional manual EBS and RDS snapshots saved inside the same AWS region (us-east-1)',
    whyItSeemsLogical: 'Lowest upfront cost with no secondary infrastructure to maintain.',
    whyItFailsInProduction: [
      'A regional power or network outage destroys both live workloads and their backups simultaneously',
      'RTO is measured in days: recreating VPCs, databases, and servers manually is error-prone',
      'Untested runbooks mean recovery invariably fails during an actual emergency'
    ]
  },
  wafTransformationSummary: 'WAF implements a Multi-Region Active-Active DR architecture using Amazon Route 53 Application Recovery Controller, Amazon Aurora Global Database with sub-second replication, and S3 Cross-Region Replication, enabling automated regional failover in under 45 seconds.',

  naive: {
    name: '"Backup and Hope" Single-Region Vulnerability',
    tagline: 'Intermittent manual snapshots saved inside the same region with zero DR runbooks',
    description: 'The organization relies on "Backup and Hope". Occasional manual snapshots are created, but they are stored in the same AWS region (`us-east-1`). No secondary region exists, recovery has never been rehearsed, and restoring requires manually spinning up VPCs, subnets, and instances from memory over several days.',
    bulletPoints: [
      'Same-region dependency: catastrophic outage in us-east-1 destroys both production and backups',
      'RTO measured in days: no automation or IaC exists to recreate infrastructure in a secondary region',
      'RPO measured in weeks: manual snapshots are irregular and frequently forgotten',
      'Zero rehearsal: runbooks are outdated Google Docs that have never been tested in a simulated drill'
    ],
    nodes: [
      { id: 'n-single-region', name: 'Primary Region (us-east-1)', type: 'network', service: 'us-east-1 Sole Production Region', tier: 'cloud', isSPOF: true, status: 'healthy' },
      { id: 'n-untested-snap', name: 'Untested Snapshot (us-east-1)', type: 'storage', service: 'Manual EBS Snapshot in same region', tier: 'cloud', isSPOF: true, status: 'healthy', description: 'Subject to regional blast radius' },
      { id: 'n-panicked-team', name: 'Panicked Ops Team', type: 'compute', service: 'Emergency Manual Rebuild Team', tier: 'edge', status: 'degraded' }
    ],
    connections: [
      { from: 'n-single-region', to: 'n-untested-snap', label: 'Infrequent Manual Snapshot', type: 'async' },
      { from: 'n-panicked-team', to: 'n-single-region', label: 'Manual Emergency SSH', type: 'sync' }
    ],
    monthlyCostEst: 180,
    availabilitySLA: '95.0% Regional Risk',
    rto: '3 to 5 Days',
    rpo: '2 Weeks of Lost Commits',
    scores: {
      operationalExcellence: 15,
      security: 35,
      reliability: 10,
      performanceEfficiency: 40,
      costOptimization: 70,
      sustainability: 45
    },
    iacSnippet: {
      language: 'hcl',
      filename: 'anti_pattern_dr.tf',
      code: `# ANTI-PATTERN: No cross-region replication or multi-region failover
resource "aws_ebs_snapshot" "infrequent_manual_snapshot" {
  volume_id   = aws_ebs_volume.primary.id
  description = "Manual snapshot taken 3 weeks ago"
  # Stored in us-east-1 only!
  # If us-east-1 has a catastrophic event, snapshot is inaccessible!
}`,
      notes: 'No automated cross-region replication. Recovery Point Objective (RPO) is weeks out of date.'
    }
  },
  wellArch: {
    name: 'Multi-Region Active-Active with Aurora Global DB & Route 53 ARC',
    tagline: 'Amazon Route 53 Application Recovery Controller, Aurora Global DB & S3 CRR',
    description: 'Enterprise multi-region resilience with predictable RTO and RPO. Route 53 Application Recovery Controller continuously monitors regional health and routes users via latency-based routing. Amazon Aurora Global Database uses dedicated storage replication with lag under 1 second to a secondary region. S3 Cross-Region Replication (CRR) synchronizes object stores in real time.',
    bulletPoints: [
      'Multi-Region Active-Active: traffic served simultaneously from us-east-1 and eu-west-1',
      'Aurora Global Database replicates transactions across regions in under 1 second without app overhead',
      'Route 53 Application Recovery Controller executes sub-minute regional failovers with routing controls',
      'S3 Cross-Region Replication (CRR) with S3 Versioning ensures complete object immutability'
    ],
    nodes: [
      { id: 'w-r53-arc', name: 'Amazon Route 53 ARC', type: 'dns', service: 'Application Recovery Controller', tier: 'edge', isSPOF: false, status: 'healthy', description: 'Automated regional health routing' },
      { id: 'w-region-primary', name: 'Primary Region (us-east-1)', type: 'network', service: 'Full Active Stack (us-east-1)', tier: 'cloud', isSPOF: false, status: 'healthy' },
      { id: 'w-region-secondary', name: 'Secondary Region (eu-west-1)', type: 'network', service: 'Full Active Stack (eu-west-1)', tier: 'cloud', isSPOF: false, status: 'healthy' },
      { id: 'w-aurora-global', name: 'Aurora Global Database', type: 'database', service: 'Cross-Region Storage Replication (< 1s)', tier: 'isolated', isSPOF: false, status: 'healthy', description: 'Sub-second cross-region replication' },
      { id: 'w-s3-crr', name: 'S3 Cross-Region Replication', type: 'storage', service: 'Asynchronous S3 CRR Bucket', tier: 'cloud', isSPOF: false, status: 'healthy' }
    ],
    connections: [
      { from: 'w-r53-arc', to: 'w-region-primary', label: 'Primary Latency Flow (50%)', type: 'sync' },
      { from: 'w-r53-arc', to: 'w-region-secondary', label: 'Secondary Latency Flow (50%)', type: 'sync' },
      { from: 'w-region-primary', to: 'w-aurora-global', label: 'Local Read/Write', type: 'sync' },
      { from: 'w-aurora-global', to: 'w-region-secondary', label: 'Dedicated HW Replication (< 1s)', type: 'async' },
      { from: 'w-region-primary', to: 'w-s3-crr', label: 'Automated S3 CRR', type: 'async' }
    ],
    monthlyCostEst: 520,
    availabilitySLA: '99.999% (Five 9s)',
    rto: '< 45 Seconds (Route 53 Shift)',
    rpo: '< 1 Second (Aurora Global Replication)',
    scores: {
      operationalExcellence: 98,
      security: 97,
      reliability: 99,
      performanceEfficiency: 96,
      costOptimization: 84,
      sustainability: 86
    },
    iacSnippet: {
      language: 'hcl',
      filename: 'well_architected_multi_region_dr.tf',
      code: `# WELL-ARCHITECTED: Aurora Global Database spanning us-east-1 & eu-west-1
resource "aws_rds_global_cluster" "global_db" {
  global_cluster_identifier = "enterprise-global-db"
  engine                    = "aurora-mysql"
  engine_version            = "8.0.mysql_aurora.3.04.0"
  database_name             = "production"
  storage_encrypted         = true
}

resource "aws_rds_cluster" "primary_cluster" {
  provider                  = aws.us_east_1
  cluster_identifier        = "prod-primary-cluster"
  global_cluster_identifier = aws_rds_global_cluster.global_db.id
  # Replicates to secondary in under 1 second!
}

resource "aws_rds_cluster" "secondary_cluster" {
  provider                  = aws.eu_west_1
  cluster_identifier        = "prod-secondary-cluster"
  global_cluster_identifier = aws_rds_global_cluster.global_db.id
}`,
      notes: 'Aurora Global Database uses dedicated storage infrastructure for replication with typical latency under 1 second.'
    }
  },
  metrics: [
    { label: 'Recovery Time Objective (RTO)', naiveValue: '3 to 5 Days (Manual Rebuild)', wellArchValue: '< 45 Seconds (Automated DNS Shift)', impact: 'positive', explanation: 'Route 53 ARC shifts 100% of user traffic to secondary region in seconds.' },
    { label: 'Recovery Point Objective (RPO)', naiveValue: '2 Weeks (Outdated Snapshots)', wellArchValue: '< 1 Second (Aurora Global Replication)', impact: 'positive', explanation: 'Storage-level replication keeps the secondary database current to within milliseconds.' },
    { label: 'Disaster Rehearsal Feasibility', naiveValue: 'Never Tested (Fear of Breaking Prod)', wellArchValue: 'Continuous Automated GameDay Drills', impact: 'positive', explanation: 'Teams can simulate regional evacuation using ARC routing controls with zero downtime.' },
    { label: 'Multi-Region High Availability', naiveValue: '95.0% (Single Region Outage Vulnerable)', wellArchValue: '99.999% (Resilient against AWS Region Down)', impact: 'positive', explanation: 'Survives a complete data center or regional power failure.' }
  ],
  chaos: {
    id: 'chaos-dr',
    title: 'Catastrophic AWS Primary Region (`us-east-1`) Blackout',
    triggerLabel: 'Simulate Total us-east-1 Regional Failure',
    description: 'A major regional utility substation failure and fiber optic severance takes down all services in `us-east-1`.',
    affectedNodeIds: ['n-single-region', 'n-untested-snap', 'w-region-primary'],
    naiveConsequence: {
      statusText: 'TOTAL BUSINESS EXTINCTION LEVEL EVENT',
      errorRate: '100% Global Outage',
      latency: 'Infinite (Unreachable)',
      downtime: 'Estimated 4 to 6 Days',
      narrative: 'All servers, databases, and un-replicated backups are trapped in the down region. Stockholders panic; executive team forced to issue breach notifications.'
    },
    wellArchConsequence: {
      statusText: 'TRAFFIC SHIFTED TO eu-west-1 IN 36 SECONDS',
      errorRate: '0.02% during initial 30s DNS propagation',
      latency: 'Normal European latency (< 45ms)',
      failoverTime: '36 Seconds (Aurora promotes to writer)',
      narrative: 'Route 53 ARC marks us-east-1 unhealthy and shifts all global traffic to eu-west-1. Aurora Global Database promotes secondary cluster to standalone writer. Zero transactions lost (RPO < 1s).'
    }
  },
  speakerNotes: {
    hook: 'Disaster recovery is not an IT ticket you fill out after an earthquake. It is a mathematical trade-off between RTO, RPO, and budget.',
    keyPoints: [
      'AWS defines 4 distinct DR strategies: Backup & Restore, Pilot Light, Warm Standby, and Multi-Region Active-Active.',
      'Aurora Global Database delivers sub-second replication latency across continents using dedicated AWS storage hardware.',
      'Route 53 Application Recovery Controller (ARC) gives you a big red button to evacuate an entire AWS region safely.'
    ],
    architectTip: 'Conduct monthly GameDays using AWS Fault Injection Simulator (FIS) to prove your failover automation actually works.',
    examQuestion: 'An enterprise requires an RPO of less than 1 second and an RTO of less than 1 minute across AWS regions for a mission-critical relational database. What solution should be selected? (Answer: Amazon Aurora Global Database with Amazon Route 53 Application Recovery Controller).'
  }
};
