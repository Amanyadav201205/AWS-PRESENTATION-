import { DomainData } from '../../types';

export const databaseDomain: DomainData = {
  id: 'database-layer',
  number: 3,
  title: 'Database Layer',
  subtitle: 'Amazon Aurora Multi-AZ with Auto-scaling Replicas vs. Self-Managed EC2 MySQL',
  category: 'Infrastructure Core',
  pillars: ['Reliability', 'Performance Efficiency', 'Operational Excellence'],
  customerRequirement: {
    clientName: 'FinPulse Global Trading & CRM',
    businessGoal: 'Relational database handling 25,000 transactions/sec for international financial accounts with sub-30s failover SLA and zero data loss guarantee.',
    challenges: [
      'Single database host crashing loses millions in active trading revenue',
      'Nightly mysqldump locks tables and causes checkout timeouts',
      'Heavy analytical queries starve transactional writes'
    ],
    budgetOrSlaTarget: '99.99% Availability | RTO < 30s | RPO = 0'
  },
  normalPrescription: {
    title: 'Self-Managed MySQL 8.0 on a Single EC2 Instance',
    prescribedServices: 'EC2 r5.xlarge with local storage and bash cron mysqldump to /var/backups',
    whyItSeemsLogical: 'DBAs are familiar with standard Linux MySQL installation and want full root control over my.cnf configuration.',
    whyItFailsInProduction: [
      'Single point of failure: host hardware crash kills database completely',
      'Backups take hours and lock production tables',
      'Reads and writes share single CPU; reporting queries cause lock contention',
      'Storage capacity cannot expand without manual unmounting and downtime'
    ]
  },
  wafTransformationSummary: 'WAF replaces self-managed MySQL with Amazon Aurora Multi-AZ with auto-scaling Read Replicas. Aurora writes 6 copies of data across 3 AZs with quorum writes, sub-second failover, and continuous Point-in-Time Recovery to S3.',

  naive: {
    name: 'Self-Managed MySQL on EC2 with Bash Cron Backup',
    tagline: 'Single EC2 instance running MySQL 8.0 with local storage',
    description: 'Database is installed directly on an EC2 instance. All read queries, complex analytical reports, and write transactions compete for the same CPU core. Backups depend on a fragile shell script executing `mysqldump` at 2:00 AM, locking tables and writing to local disk.',
    bulletPoints: [
      'Single Point of Failure: No replication, no standby, zero fault tolerance',
      'Read and write operations share the same CPU and disk queue (read starvation)',
      'Backups lock production tables and have never been tested for point-in-time recovery',
      'Storage scaling requires unmounting disks, taking the database offline for hours'
    ],
    nodes: [
      { id: 'n-app-layer', name: 'App Servers', type: 'compute', service: 'App Instances', tier: 'public', status: 'healthy' },
      { id: 'n-mysql-ec2', name: 'Self-Managed MySQL (EC2)', type: 'database', service: 'MySQL 8 on Ubuntu EC2', tier: 'public', isSPOF: true, status: 'healthy', description: 'Single writer, no standby, locks on dump' },
      { id: 'n-local-dump', name: 'Local Backup Script (/var/backups)', type: 'storage', service: 'EBS volume cron dump', tier: 'public', isSPOF: true, status: 'healthy' }
    ],
    connections: [
      { from: 'n-app-layer', to: 'n-mysql-ec2', label: 'Blocking Port 3306 TCP', type: 'sync' },
      { from: 'n-mysql-ec2', to: 'n-local-dump', label: 'Nightly mysqldump', type: 'async' }
    ],
    monthlyCostEst: 290,
    availabilitySLA: '99.0%',
    rto: '4 - 6 Hours',
    rpo: '24 Hours (Lost since 2 AM)',
    scores: {
      operationalExcellence: 20,
      security: 35,
      reliability: 20,
      performanceEfficiency: 35,
      costOptimization: 45,
      sustainability: 40
    },
    iacSnippet: {
      language: 'hcl',
      filename: 'anti_pattern_database.tf',
      code: `# ANTI-PATTERN: Self-managed database on an EC2 instance
resource "aws_instance" "mysql_database" {
  instance_type = "r5.xlarge"
  ami           = "ami-0c55b159cbfafe1f0" # Ubuntu LTS
  
  user_data = <<-EOF
              #!/bin/bash
              apt update && apt install -y mysql-server
              # Crontab for fragile backup:
              echo "0 2 * * * root mysqldump --all-databases > /var/backups/dump.sql" >> /etc/crontab
              EOF
  # Single AZ, no automated failover, no Point-in-Time recovery!
}`,
      notes: 'No automated failover, manual patches, storage cannot grow dynamically, and locks during backup.'
    }
  },
  wellArch: {
    name: 'Amazon Aurora Multi-AZ Cluster with Auto-Scaling Read Replicas',
    tagline: 'Fault-tolerant distributed storage with sub-30s failover and continuous PITR',
    description: 'Amazon Aurora decouples compute and storage. Aurora replicates 6 copies of data across 3 Availability Zones with continuous backup to Amazon S3. Auto-scaling Read Replicas handle reporting and read spikes, while sub-second failover ensures continuous enterprise uptime.',
    bulletPoints: [
      'Automatic failover to a Read Replica in under 30 seconds with zero data loss',
      'Aurora distributed log-structured storage replicates 6 ways across 3 AZs with quorum writes',
      'Continuous automated backups to S3 with 1-second granularity Point-in-Time Recovery (PITR)',
      'Independent Reader and Writer endpoints eliminate read contention on primary transactions'
    ],
    nodes: [
      { id: 'w-apps', name: 'App Services Pool', type: 'compute', service: 'ECS / EC2 Cluster', tier: 'private', status: 'healthy' },
      { id: 'w-aurora-writer', name: 'Aurora Writer Node (AZ-1a)', type: 'database', service: 'Amazon Aurora MySQL (db.r6g)', tier: 'isolated', isSPOF: false, status: 'healthy', az: 'us-east-1a' },
      { id: 'w-aurora-reader1', name: 'Aurora Read Replica (AZ-1b)', type: 'database', service: 'Amazon Aurora Reader (db.r6g)', tier: 'isolated', isSPOF: false, status: 'healthy', az: 'us-east-1b' },
      { id: 'w-aurora-reader2', name: 'Aurora Read Replica (AZ-1c)', type: 'database', service: 'Amazon Aurora Reader (db.r6g)', tier: 'isolated', isSPOF: false, status: 'healthy', az: 'us-east-1c' },
      { id: 'w-aurora-storage', name: 'Aurora Distributed Storage Engine', type: 'storage', service: '6-Way 3-AZ Shared Volume', tier: 'isolated', isSPOF: false, status: 'healthy' }
    ],
    connections: [
      { from: 'w-apps', to: 'w-aurora-writer', label: 'Cluster Writer Endpoint (ACID)', type: 'sync' },
      { from: 'w-apps', to: 'w-aurora-reader1', label: 'Reader Endpoint (Load Balanced)', type: 'sync' },
      { from: 'w-apps', to: 'w-aurora-reader2', label: 'Reader Endpoint (Load Balanced)', type: 'sync' },
      { from: 'w-aurora-writer', to: 'w-aurora-storage', label: 'Log Stream Quorum (4 of 6)', type: 'sync' }
    ],
    monthlyCostEst: 340,
    availabilitySLA: '99.99%',
    rto: '< 30 Seconds',
    rpo: '0 Seconds',
    scores: {
      operationalExcellence: 95,
      security: 94,
      reliability: 99,
      performanceEfficiency: 96,
      costOptimization: 85,
      sustainability: 90
    },
    iacSnippet: {
      language: 'hcl',
      filename: 'well_architected_database.tf',
      code: `# WELL-ARCHITECTED: Amazon Aurora Multi-AZ with Read Replicas & PITR
resource "aws_rds_cluster" "aurora_cluster" {
  cluster_identifier      = "aurora-prod-cluster"
  engine                  = "aurora-mysql"
  engine_version          = "8.0.mysql_aurora.3.04.0"
  availability_zones      = ["us-east-1a", "us-east-1b", "us-east-1c"]
  database_name           = "production_db"
  backup_retention_period = 35 # 35-day Point-in-Time Recovery
  storage_encrypted       = true
  kms_key_id              = aws_kms_key.db_key.arn
  deletion_protection     = true
}

resource "aws_rds_cluster_instance" "cluster_instances" {
  count              = 3 # 1 Primary Writer + 2 Read Replicas
  identifier         = "aurora-prod-\${count.index}"
  cluster_identifier = aws_rds_cluster.aurora_cluster.id
  instance_class     = "db.r6g.xlarge" # AWS Graviton2 DB instance
  engine             = aws_rds_cluster.aurora_cluster.engine
}`,
      notes: 'Storage auto-scales up to 128 TiB without manual repartitioning. Read Replicas automatically serve as failover targets.'
    }
  },
  metrics: [
    { label: 'Database Availability SLA', naiveValue: '99.0% (Single Point of Failure)', wellArchValue: '99.99% (Aurora Multi-AZ)', impact: 'positive', explanation: 'Sub-30-second automated failover without manual DBA intervention.' },
    { label: 'Recovery Point Objective (RPO)', naiveValue: 'Up to 24 Hours (Nightly dump)', wellArchValue: '0 Seconds (Continuous PITR)', impact: 'positive', explanation: 'Continuous write-ahead logging to S3 enables sub-second point-in-time restore.' },
    { label: 'Read Throughput Scaling', naiveValue: '1x (Pinned to single disk)', wellArchValue: '15x (Auto-scaling Reader Endpoint)', impact: 'positive', explanation: 'Aurora scales up to 15 Read Replicas across multiple AZs.' },
    { label: 'Storage Self-Healing', naiveValue: 'Manual EBS volume expansion', wellArchValue: 'Auto-grows in 10GB blocks to 128TB', impact: 'positive', explanation: 'Storage expands automatically without downtime or performance degradation.' }
  ],
  chaos: {
    id: 'chaos-database',
    title: 'Primary Database Node Kernel Panic & Hardware Crash',
    triggerLabel: 'Crash Primary DB Writer Node',
    description: 'The physical hardware hosting the primary database writer suffers an unrecoverable kernel panic.',
    affectedNodeIds: ['n-mysql-ec2', 'w-aurora-writer'],
    naiveConsequence: {
      statusText: 'CATASTROPHIC OUTAGE & DATA CORRUPTION',
      errorRate: '100% of Application Transactions Fail',
      latency: 'Infinite (Connection Refused)',
      downtime: '4 to 6 Hours',
      narrative: 'Database process dies. File system left in dirty state with table corruption. DBA must be woken up, provision a replacement EC2, and replay old backups. Transactions from the past 14 hours are lost forever.'
    },
    wellArchConsequence: {
      statusText: 'AUTO-FAILOVER TO REPLICA IN 24 SECONDS',
      errorRate: '0.05% for 20 seconds during DNS flip',
      latency: '22ms post failover',
      failoverTime: '24 Seconds (Zero Data Loss)',
      narrative: 'Aurora cluster detects lost heartbeat in 10s. Read Replica in AZ-1b is instantly elected primary writer. Cluster endpoint DNS flips automatically. Zero commits lost (RPO = 0).'
    }
  },
  speakerNotes: {
    hook: 'Never run production databases on plain EC2 instances unless you have a dedicated 24/7 team of database administrators ready to restore corrupted disk blocks at 3:00 AM.',
    keyPoints: [
      'Amazon Aurora decouples compute from storage, writing to 6 storage nodes across 3 AZs.',
      'Aurora provides up to 5x the throughput of standard MySQL running on EC2.',
      'Continuous automated backups allow Point-in-Time Recovery down to the exact second.'
    ],
    architectTip: 'Always use the Aurora Reader Endpoint for read queries and analytical reporting to protect write transaction IOPS.',
    examQuestion: 'An application requires a relational database with an RTO of less than 30 seconds and an RPO of 0 in the event of an Availability Zone failure. Which solution meets these requirements? (Answer: Amazon Aurora Multi-AZ with automated failover).'
  }
};
