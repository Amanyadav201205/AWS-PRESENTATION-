import { DomainData } from '../../types';

export const storageDomain: DomainData = {
  id: 'storage-layer',
  number: 1,
  title: 'Storage Layer',
  subtitle: 'Amazon S3 Tiering, Object Lock, & EBS gp3 Optimization vs. Un-versioned Flat EBS',
  category: 'Infrastructure Core',
  pillars: ['Cost Optimization', 'Reliability', 'Security'],
  customerRequirement: {
    clientName: 'MediCloud Health Records Inc.',
    businessGoal: 'Store 50TB of medical imaging and records with HIPAA compliance, zero data loss, sub-50ms retrieval for active patient records, and maximum cost efficiency.',
    challenges: [
      'Data must remain immutable and protected against accidental deletion or ransomware for 7 years',
      'Over 85% of medical images are never accessed after 30 days, yet cost thousands to store',
      'High-throughput read IOPS required during surgery consultations without paying for idle disk space'
    ],
    budgetOrSlaTarget: '99.999999999% (11 9s) Durability | Storage budget under $150/month'
  },
  normalPrescription: {
    title: 'Single 3TB EBS gp2 Volume & Flat S3 Standard Bucket',
    prescribedServices: 'Amazon EBS gp2 (3TB unpartitioned) + Amazon S3 Standard with public read ACL',
    whyItSeemsLogical: 'Easy to set up in 5 minutes via the AWS console without configuring complex lifecycle policies or IAM roles.',
    whyItFailsInProduction: [
      'EBS gp2 forces you to overpay for unneeded storage just to get baseline IOPS ($0.10/GB)',
      'S3 Standard retains cold files forever at peak pricing ($0.023/GB/mo) instead of moving to Glacier ($0.00099/GB/mo)',
      'No Object Lock or Versioning: ransomware or a rogue `aws s3 rm` command permanently destroys patient records',
      'Public read ACLs accidentally expose private medical scans to internet search crawlers'
    ]
  },
  wafTransformationSummary: 'WAF optimizes storage by decoupling IOPS from capacity (EBS gp3), automatically migrating cold objects to Glacier via S3 Intelligent-Tiering, and enforcing WORM compliance with S3 Object Lock and KMS envelope encryption.',
  naive: {
    name: 'Un-tiered S3 & Over-provisioned EBS gp2',
    tagline: 'Static EBS volume with un-versioned public S3 bucket',
    description: 'Data is dumped into a single EBS gp2 volume attached to one EC2 instance with no snapshots. Static assets sit in S3 Standard forever without lifecycle rules, versioning, or object locking. Public ACLs are enabled.',
    bulletPoints: [
      'Single 3TB EBS gp2 volume paying for unused capacity and coupled IOPS ($0.10/GB)',
      'S3 bucket unencrypted at rest, public read ACL enabled, zero lifecycle rules',
      'No versioning or Object Lock: accidental delete or ransomware permanently destroys assets',
      'No cross-region replication or centralized AWS Backup policy'
    ],
    nodes: [
      { 
        id: 'n-ec2', 
        name: 'Monolithic App Server', 
        type: 'compute', 
        service: 'Amazon EC2 (m5)', 
        tier: 'public', 
        isSPOF: true, 
        status: 'healthy', 
        description: 'Single server holding active EBS attachment',
        configDetails: {
          specs: 'm5.xlarge (4 vCPUs, 16GB RAM) running un-partitioned OS and storage mount',
          securityPolicy: 'Public IP assigned, open to internet',
          costProfile: '$140/mo (Compute) + coupled storage spend',
          wafAdvantage: 'Replace with multi-AZ container pool or auto-scaling EC2 instances'
        }
      },
      { 
        id: 'n-ebs', 
        name: 'EBS gp2 (3TB Unpartitioned)', 
        type: 'storage', 
        service: 'Amazon EBS gp2', 
        tier: 'public', 
        isSPOF: true, 
        status: 'healthy', 
        description: 'Overprovisioned volume, IOPS locked to storage size',
        configDetails: {
          specs: '3,000 GB gp2 volume with 9,000 baseline burst IOPS',
          securityPolicy: 'Unencrypted at rest, no AWS Backup snapshot plan',
          costProfile: '$300/mo ($0.10 per GB-month regardless of actual usage)',
          wafAdvantage: 'Migrate to EBS gp3: 20% cheaper with 3000 baseline IOPS decoupled from volume size'
        }
      },
      { 
        id: 'n-s3', 
        name: 'Public S3 Bucket (Flat Standard)', 
        type: 'storage', 
        service: 'Amazon S3 Standard', 
        tier: 'public', 
        isSPOF: false, 
        status: 'healthy', 
        description: 'No lifecycle, versioning OFF, public read enabled',
        configDetails: {
          specs: 'Flat standard tier, all 50TB billed at $0.023/GB/mo',
          securityPolicy: 'Block Public Access disabled, server-side encryption disabled',
          costProfile: '$1,150/mo for 50TB',
          wafAdvantage: 'Enable Intelligent-Tiering and Glacier Deep Archive to cut monthly spend by 72%'
        }
      }
    ],
    connections: [
      { from: 'n-ec2', to: 'n-ebs', label: 'Direct POSIX Mount', type: 'sync' },
      { from: 'n-ec2', to: 'n-s3', label: 'Unencrypted S3 Put/Get', type: 'sync' }
    ],
    monthlyCostEst: 420,
    availabilitySLA: '99.5%',
    rto: '48 Hours',
    rpo: '24 Hours',
    scores: {
      operationalExcellence: 25,
      security: 20,
      reliability: 30,
      performanceEfficiency: 45,
      costOptimization: 20,
      sustainability: 35
    },
    iacSnippet: {
      language: 'hcl',
      filename: 'anti_pattern_storage.tf',
      code: `# ANTI-PATTERN: Over-provisioned EBS and unencrypted public S3
resource "aws_ebs_volume" "monolith_disk" {
  availability_zone = "us-east-1a"
  size              = 3000 # 3TB allocated, only 200GB used!
  type              = "gp2"  # Outdated gp2: IOPS coupled to disk size
  encrypted         = false  # Unencrypted at rest!
}

resource "aws_s3_bucket" "unsecured_bucket" {
  bucket = "company-core-assets-prod"
  # No versioning, no object lock, no lifecycle rules!
}

resource "aws_s3_bucket_public_access_block" "bad" {
  bucket                  = aws_s3_bucket.unsecured_bucket.id
  block_public_acls       = false # Open to public leaks!
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}`,
      notes: 'gp2 forces you to pay for unused storage just to get baseline IOPS. S3 lacks encryption, versioning, and lifecycle management.'
    }
  },
  wellArch: {
    name: 'Multi-Tier S3 Intelligent-Tiering & gp3 with AWS Backup',
    tagline: 'Automated lifecycle policies, WORM Object Lock, and KMS envelope encryption',
    description: 'Dynamic storage decoupled by access frequency. Amazon S3 Intelligent-Tiering and Glacier Deep Archive lifecycle rules automate cost optimization. S3 Object Lock and KMS CMK enforce WORM compliance and cryptographic privacy. EBS gp3 right-sizes IOPS independently of storage capacity.',
    bulletPoints: [
      'EBS gp3 baseline decoupled from size, saving 20% while providing 3,000 baseline IOPS',
      'S3 Intelligent-Tiering moves inactive data into Archive Instant Access without performance penalties',
      'S3 Object Lock in Compliance Mode prevents accidental deletion and ransomware tampering',
      'AWS Backup orchestrates automated cross-region and cross-account vault snapshots with KMS CMKs'
    ],
    nodes: [
      { 
        id: 'w-ec2', 
        name: 'App Instance Pool', 
        type: 'compute', 
        service: 'Amazon EC2 (c7g Graviton)', 
        tier: 'private', 
        isSPOF: false, 
        status: 'healthy', 
        description: 'Instances right-sized to application needs',
        configDetails: {
          specs: 'c7g.large Graviton3 instances (2 vCPUs, 4GB RAM) in Auto Scaling Group',
          securityPolicy: 'IAM Instance Profile (No hardcoded keys), VPC Private Subnet',
          costProfile: '$52/mo baseline with 20% savings over x86',
          wafAdvantage: 'High price-performance, decoupled compute from persistent storage'
        }
      },
      { 
        id: 'w-ebs', 
        name: 'EBS gp3 (Right-sized 250GB)', 
        type: 'storage', 
        service: 'Amazon EBS gp3', 
        tier: 'private', 
        isSPOF: false, 
        status: 'healthy', 
        description: '3000 IOPS, 125 MB/s throughput independent of volume size',
        configDetails: {
          specs: '250GB gp3 with dedicated 3000 baseline IOPS and 125 MB/s throughput',
          securityPolicy: 'Encrypted with AWS KMS Customer Managed Key (CMK)',
          costProfile: '$20/mo ($0.08/GB-mo, 20% cheaper than gp2)',
          wafAdvantage: 'Pay only for actual data stored without sacrificing IOPS performance'
        }
      },
      { 
        id: 'w-s3', 
        name: 'S3 Intelligent-Tiering Bucket', 
        type: 'storage', 
        service: 'Amazon S3 Intelligent-Tiering', 
        tier: 'private', 
        isSPOF: false, 
        status: 'healthy', 
        description: 'Automated 5-tier transitions + Versioning + Object Lock',
        configDetails: {
          specs: 'Automatic transitions across Frequent, Infrequent, and Archive Instant tiers',
          securityPolicy: 'S3 Block Public Access enabled, S3 Object Lock Compliance Mode',
          costProfile: 'Up to 68% savings with zero retrieval fees',
          wafAdvantage: 'No manual lifecycle tuning needed; delivers automatic savings for changing workloads'
        }
      },
      { 
        id: 'w-glacier', 
        name: 'S3 Glacier Deep Archive', 
        type: 'storage', 
        service: 'S3 Glacier Flexible/Deep', 
        tier: 'isolated', 
        isSPOF: false, 
        status: 'healthy', 
        description: 'Long-term compliance vault ($0.00099/GB/mo)',
        configDetails: {
          specs: 'Vault Lock policy for 7-year HIPAA compliance',
          securityPolicy: 'WORM (Write Once, Read Many) enforced at API layer',
          costProfile: '$0.00099/GB/month ($1 per Terabyte/month)',
          wafAdvantage: 'Lowest cost cloud archive for regulatory compliance records'
        }
      },
      { 
        id: 'w-backup', 
        name: 'AWS Backup Vault', 
        type: 'security', 
        service: 'AWS Backup (Cross-Region)', 
        tier: 'cloud', 
        isSPOF: false, 
        status: 'healthy', 
        description: 'Automated immutable snapshot schedule',
        configDetails: {
          specs: 'Daily automated snapshot replication to secondary region',
          securityPolicy: 'Vault Lock policy prevents deletion even by AWS root account',
          costProfile: 'Pay per GB backup storage',
          wafAdvantage: 'Centralized policy-driven protection against disaster and ransomware'
        }
      }
    ],
    connections: [
      { from: 'w-ec2', to: 'w-ebs', label: 'Encrypted gp3 Attachment', type: 'sync' },
      { from: 'w-ec2', to: 'w-s3', label: 'TLS 1.3 + KMS Envelope', type: 'sync' },
      { from: 'w-s3', to: 'w-glacier', label: 'Lifecycle Rule (90d+)', type: 'async' },
      { from: 'w-ebs', to: 'w-backup', label: 'Automated Snapshot Plan', type: 'async' }
    ],
    monthlyCostEst: 118,
    availabilitySLA: '99.99%',
    rto: '15 Minutes',
    rpo: '1 Hour',
    scores: {
      operationalExcellence: 90,
      security: 98,
      reliability: 95,
      performanceEfficiency: 88,
      costOptimization: 92,
      sustainability: 85
    },
    iacSnippet: {
      language: 'hcl',
      filename: 'well_architected_storage.tf',
      code: `# WELL-ARCHITECTED: gp3 right-sizing, Intelligent-Tiering, KMS CMK, Object Lock
resource "aws_ebs_volume" "app_disk" {
  availability_zone = "us-east-1a"
  size              = 250   # Right-sized to active 200GB payload
  type              = "gp3"  # 20% cheaper than gp2 with guaranteed 3000 IOPS
  iops              = 3000
  throughput        = 125
  encrypted         = true
  kms_key_id        = aws_kms_key.storage_key.arn
}

resource "aws_s3_bucket" "secure_lake" {
  bucket = "company-core-assets-prod-immutable"
  object_lock_enabled = true # WORM protection against ransomware
}

resource "aws_s3_bucket_lifecycle_configuration" "tiering" {
  bucket = aws_s3_bucket.secure_lake.id
  rule {
    id     = "smart-tiering-and-archive"
    status = "Enabled"
    transition {
      days          = 0
      storage_class = "INTELLIGENT_TIERING"
    }
    transition {
      days          = 90
      storage_class = "GLACIER"
    }
  }
}`,
      notes: 'EBS gp3 decouples storage costs from IOPS. S3 Intelligent-Tiering and Glacier reduce storage spend by 72% with zero manual operational burden.'
    }
  },
  metrics: [
    { label: 'Monthly Storage Spend', naiveValue: '$420/mo', wellArchValue: '$118/mo', impact: 'positive', explanation: 'Decoupled gp3 and automated cold object archiving saves 72% monthly.' },
    { label: 'Ransomware / Deletion Protection', naiveValue: '0% (Vulnerable)', wellArchValue: '100% (WORM Locked)', impact: 'positive', explanation: 'Object Lock in Compliance Mode prevents tampering even with root credentials.' },
    { label: 'Durability SLA', naiveValue: '99.8% (Single EBS disk)', wellArchValue: '99.999999999% (11 9s)', impact: 'positive', explanation: 'S3 distributes objects across multiple AZs automatically.' },
    { label: 'IOPS Guarantee', naiveValue: 'Variable (gp2 credit burn)', wellArchValue: '3,000 Dedicated Baseline', impact: 'positive', explanation: 'gp3 guarantees IOPS without needing 1TB+ volume sizing.' }
  ],
  chaos: {
    id: 'chaos-storage',
    title: 'Ransomware Extortion & Accidental Object Deletion',
    triggerLabel: 'Simulate Ransomware Deletion Attack',
    description: 'A compromised developer credential attempts to run `aws s3 rm --recursive` across production asset buckets and corrupt active EBS blocks.',
    affectedNodeIds: ['n-s3', 'n-ebs', 'w-s3', 'w-ebs'],
    naiveConsequence: {
      statusText: 'PERMANENT DATA LOSS',
      errorRate: '100% on Asset Requests',
      latency: 'N/A (Broken)',
      downtime: '48+ Hours to partial restore',
      narrative: 'All production objects wiped permanently. No versioning or object lock exists. Company faces catastrophic data loss and potential regulatory fine.'
    },
    wellArchConsequence: {
      statusText: 'ATTACK BLOCKED & OBJECTS PRESERVED',
      errorRate: '0% Dropped Requests',
      latency: '< 18ms',
      failoverTime: 'Instant (No Downtime)',
      narrative: 'S3 Object Lock rejects delete API calls with 403 AccessDenied. KMS CMK policies prevent unauthorized cryptoware re-encryption. AWS Backup holds immutable recovery points.'
    }
  },
  speakerNotes: {
    hook: 'Storage is where enterprise balance sheets bleed silently. Unattached EBS volumes and flat S3 Standard tiers are the number one hidden cost in AWS.',
    keyPoints: [
      'Migrating from gp2 to gp3 is an instant 20% cost savings with independent provisioning of IOPS and throughput.',
      'S3 Intelligent-Tiering eliminates the guesswork of lifecycle management without retrieval fees.',
      'Object Lock provides legal hold and WORM compliance against catastrophic ransomware attacks.'
    ],
    architectTip: 'Always audit EBS volumes with AWS Trusted Advisor or AWS Compute Optimizer to flag unattached or underutilized gp2 drives.',
    examQuestion: 'A company needs to archive medical records for 7 years under HIPAA compliance where data must never be deleted or altered by any user including root. Which AWS solution satisfies this requirement? (Answer: S3 Object Lock in Compliance Mode).'
  }
};
