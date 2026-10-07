import { DomainData } from '../../types';

export const overviewDomain: DomainData = {
  id: 'overview-thesis',
  number: 1,
  title: 'Architecture Overview',
  subtitle: 'Overview: the same app built two ways.',
  category: 'Framework Foundation',
  pillars: ['Operational Excellence', 'Security', 'Reliability', 'Performance Efficiency', 'Cost Optimization', 'Sustainability'],
  customerRequirement: {
    clientName: 'Global Enterprise Cloud Modernization',
    businessGoal: 'Establish an enterprise-wide cloud modernization blueprint across 15 mission-critical architecture domains, targeting 99.99% availability, zero single points of failure, typically < 30s failover recovery, and FinOps cost governance.',
    challenges: [
      'Legacy applications deployed manually (ClickOps) with hardcoded credentials and zero automation',
      'Cascading outages: a single server or database failure crashes the entire customer-facing platform',
      'Uncontrolled cloud expenditure with over 50% of monthly AWS bills commonly wasted on idle capacity'
    ],
    budgetOrSlaTarget: '99.99% Availability | Typically < 30s Failover | 3 Critical HRIs Remediated | 59.1% Cost Reduction ($4,450 → $1,820/mo)'
  },
  normalPrescription: {
    title: 'Monolithic ClickOps Deployment with Fragile Single Points of Failure',
    prescribedServices: 'Single EC2 Monolith + Single-AZ Database in Public Subnet + Flat S3 + Static Access Keys',
    whyItSeemsLogical: 'Fastest way to get a prototype running with minimal initial configuration overhead.',
    whyItFailsInProduction: [
      'Single Point of Failure (SPOF) at every layer: web server, database, and network gateway',
      'Zero isolation: database directly reachable on public internet (0.0.0.0/0:3306)',
      'Manual operations without IaC lead to severe configuration drift and untracked changes',
      'Hardcoded static credentials in source code guarantee catastrophic security leaks'
    ]
  },
  wafTransformationSummary: 'The AWS Well-Architected Framework transforms fragile monoliths into resilient, decoupled, and cost-optimized distributed systems across 15 core syllabus domains, resolving critical High-Risk Issues while reducing monthly cloud spend by 59.1% ($4,450 to $1,820/mo).',
  naive: {
    name: 'Fragile Conventional Deployment (3 Critical HRIs Shown)',
    tagline: 'Single-server stack vulnerable to datacenter outages, ransomware, and traffic spikes',
    description: 'All client traffic routes directly over the public internet to a single oversized EC2 instance in a public subnet, connected to an un-replicated MySQL database with public 0.0.0.0/0:3306 ingress and an un-versioned public S3 bucket.',
    bulletPoints: [
      '3 critical High Risk Issues (HRIs) shown across core architectural pillars',
      'Single EC2 instance in a single AZ with 100% blast radius during hardware failure',
      'Database directly reachable on public internet (0.0.0.0/0 :3306 ingress)',
      'Estimated downtime risk with an average MTTR of 4 to 8 hours'
    ],
    nodes: [
      {
        id: 'n-ov-client',
        name: 'Internet Clients',
        type: 'client',
        service: 'Web & Mobile Browsers',
        tier: 'public',
        isSPOF: false,
        status: 'healthy',
        description: 'Clients making direct un-cached requests to origin',
        configDetails: {
          specs: '500 - 5,000 req/sec unbuffered traffic',
          securityPolicy: 'Un-inspected HTTP/HTTPS traffic',
          costProfile: '$0 (Client side)',
          wafAdvantage: 'Front with Route 53 latency routing and CloudFront edge caching'
        }
      },
      {
        id: 'n-ov-ec2',
        name: 'App Server',
        type: 'compute',
        service: 'EC2 m5.2xlarge',
        tier: 'public',
        isSPOF: true,
        status: 'healthy',
        description: 'Single server running web, application logic, and background jobs',
        configDetails: {
          specs: '8 vCPUs, 32GB RAM, single AZ us-east-1a',
          securityPolicy: 'Public IP assigned, SSH open to internet',
          costProfile: '$280/mo compute + coupled storage',
          wafAdvantage: 'Replace with multi-AZ Auto Scaling Group or ECS Fargate containers'
        }
      },
      {
        id: 'n-ov-db',
        name: 'Primary Database',
        type: 'database',
        service: 'Amazon RDS MySQL (Single-AZ)',
        tier: 'public',
        isSPOF: true,
        status: 'healthy',
        description: 'Single database engine with no replicas or automated failover',
        configDetails: {
          specs: 'db.m5.large with single gp2 storage volume',
          securityPolicy: '0.0.0.0/0 :3306 open to public internet',
          costProfile: '$180/mo with zero read replica offload',
          wafAdvantage: 'Migrate to Amazon Aurora Multi-AZ with typically < 30s failover'
        }
      },
      {
        id: 'n-ov-s3',
        name: 'Flat S3 Bucket',
        type: 'storage',
        service: 'Amazon S3 Standard',
        tier: 'public',
        isSPOF: false,
        status: 'healthy',
        description: 'No lifecycle rules, no versioning, public read ACL enabled',
        configDetails: {
          specs: 'S3 Standard holding cold assets at peak price',
          securityPolicy: 'Block Public Access = Disabled, unencrypted',
          costProfile: '$420/mo flat storage spend',
          wafAdvantage: 'Enforce S3 Intelligent-Tiering, Object Lock, and KMS encryption'
        }
      }
    ],
    connections: [
      { from: 'n-ov-client', to: 'n-ov-ec2', label: 'Unbuffered HTTP (No WAF/CDN)', type: 'sync' },
      { from: 'n-ov-ec2', to: 'n-ov-db', label: 'Direct SQL Queries (No Pool)', type: 'sync' },
      { from: 'n-ov-ec2', to: 'n-ov-s3', label: 'Public REST Calls (No VPC Endpoint)', type: 'sync' }
    ],
    monthlyCostEst: 4450,
    availabilitySLA: '98.5% (Single Point of Failure)',
    rto: '4 - 8 Hours',
    rpo: '24 Hours (Daily Snapshot)',
    scores: {
      operationalExcellence: 20,
      security: 15,
      reliability: 20,
      performanceEfficiency: 30,
      costOptimization: 25,
      sustainability: 22
    },
    iacSnippet: {
      language: 'hcl',
      filename: 'legacy_monolith.tf',
      code: `// NAIVE ANTI-PATTERN: Single server in default public VPC
resource "aws_instance" "monolith" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "m5.2xlarge"
  // FLAW: Public IP assigned directly to production app server
  associate_public_ip_address = true
  
  // FLAW: 0.0.0.0/0 ingress open to the entire internet
  vpc_security_group_ids = [aws_security_group.allow_all.id]
}

resource "aws_db_instance" "single_db" {
  allocated_storage = 100
  engine            = "mysql"
  instance_class    = "db.m5.large"
  // FLAW: Single-AZ deployment; if AZ fails, total business outage
  multi_az          = false
  publicly_accessible = true
}`,
      notes: 'No load balancer, no private subnets, no auto-scaling, no encryption at rest, and zero automated recovery.'
    }
  },
  wellArch: {
    name: 'AWS Well-Architected 15-Domain Blueprint',
    tagline: 'Multi-AZ, edge-accelerated, decoupled, and self-healing cloud architecture',
    description: 'Clients are served through CloudFront edge caching with AWS WAF inspection. Dynamic traffic passes through an Application Load Balancer into private subnets hosting Auto-Scaled Graviton container pools across 3 Availability Zones. The database tier runs Amazon Aurora Multi-AZ with read replicas and RDS Proxy. Storage is secured outside the VPC via Amazon S3 with Gateway VPC Endpoints.',
    bulletPoints: [
      '3 critical HRIs resolved across core architectural pillars',
      'Multi-AZ redundancy across 3 availability zones with automatic self-healing',
      'Multi-layer caching (CloudFront + ElastiCache) offloads 90%+ of backend traffic',
      '59.1% net cloud spend reduction ($4,450 → $1,820/mo) with 99.99% availability'
    ],
    nodes: [
      {
        id: 'w-ov-client',
        name: 'Global Clients',
        type: 'client',
        service: 'Route 53 Latency-Based Routing',
        tier: 'edge',
        isSPOF: false,
        status: 'healthy',
        description: 'DNS with health-checked latency-based routing',
        configDetails: {
          specs: '100% SLA Route 53 with automated failover checks',
          securityPolicy: 'DNSSEC enabled, DDoS protection via AWS Shield',
          costProfile: '$0.50/hosted zone + $0.40/million queries',
          wafAdvantage: 'Global DNS directs traffic to the lowest-latency edge'
        }
      },
      {
        id: 'w-ov-edge',
        name: 'CloudFront & AWS WAF',
        type: 'cdn',
        service: 'Amazon CloudFront + AWS WAF',
        tier: 'edge',
        isSPOF: false,
        status: 'healthy',
        description: 'Edge POPs absorbing 90%+ of traffic with Layer 7 inspection',
        configDetails: {
          specs: 'TLS 1.3, HTTP/3 enabled, Origin Shield active',
          securityPolicy: 'AWS Managed Rules (Core, SQLi, Known Bad Inputs)',
          costProfile: '$0.085/GB with 92% origin offload',
          wafAdvantage: 'Protects compute by blocking malicious requests before they reach origin'
        }
      },
      {
        id: 'w-ov-alb',
        name: 'Application Load Balancer',
        type: 'loadbalancer',
        service: 'AWS Application Load Balancer',
        tier: 'public',
        isSPOF: false,
        status: 'healthy',
        description: 'Multi-AZ ingress load balancer with SSL termination across 3 AZs',
        configDetails: {
          specs: 'Redundant across 3 AZs (us-east-1a, 1b, 1c) with cross-zone load balancing',
          securityPolicy: 'Strict HTTPS only with TLS 1.3 security policy',
          costProfile: '$22/mo + LCU usage',
          wafAdvantage: 'Automatically health-checks targets and isolates failed compute instances'
        }
      },
      {
        id: 'w-ov-compute',
        name: 'Auto-Scaling Compute Pool',
        type: 'compute',
        service: 'ECS Fargate (Graviton ARM64)',
        tier: 'private',
        isSPOF: false,
        status: 'healthy',
        description: 'Serverless container fleet distributed across 3 Availability Zones',
        configDetails: {
          specs: 'Auto-scales from 2 to 20 tasks across 3 AZs based on request rate and CPU',
          securityPolicy: 'Private Subnets (10.0.11-13.0/24), Security Group allows ALB ingress only',
          costProfile: '$110/mo with Graviton 25% price-performance savings',
          wafAdvantage: 'Horizontal elasticity: instances terminate and spawn with zero human intervention'
        }
      },
      {
        id: 'w-ov-db',
        name: 'Amazon Aurora Multi-AZ',
        type: 'database',
        service: 'Aurora Serverless v2 + Read Replicas',
        tier: 'isolated',
        isSPOF: false,
        status: 'healthy',
        description: '6-way storage replication across 3 AZs with automated failover typically < 30s',
        configDetails: {
          specs: 'Auto-scaling ACUs (0.5 to 16 ACUs) with dedicated read replicas',
          securityPolicy: 'Isolated Subnets (10.0.21-23.0/24), KMS CMK encryption',
          costProfile: '$140/mo with RDS Proxy connection multiplexing',
          wafAdvantage: 'Decoupled compute and storage: instant failover with RPO = 0'
        }
      },
      {
        id: 'w-ov-s3',
        name: 'Amazon S3 Regional Store',
        type: 'storage',
        service: 'S3 Intelligent-Tiering + VPC Gateway Endpoint',
        tier: 'edge', // Regional AWS service outside VPC accessed via Gateway Endpoint
        isSPOF: false,
        status: 'healthy',
        description: 'Regional storage outside VPC accessed privately via Gateway Endpoint with Object Lock',
        configDetails: {
          specs: 'Intelligent-Tiering with automated cold transitions',
          securityPolicy: 'Object Lock compliance mode, Gateway VPC Endpoint (no internet routing)',
          costProfile: '$118/mo (72% savings compared to S3 Standard flat tier)',
          wafAdvantage: 'Zero data loss durability with ransomware immunity'
        }
      }
    ],
    connections: [
      { from: 'w-ov-client', to: 'w-ov-edge', label: 'Route 53 Latency-Based Routing', type: 'sync' },
      { from: 'w-ov-edge', to: 'w-ov-alb', label: 'CloudFront Origin Shield (Dynamic API)', type: 'sync' },
      { from: 'w-ov-alb', to: 'w-ov-compute', label: 'Private Subnet Target Group (3 AZs)', type: 'sync' },
      { from: 'w-ov-compute', to: 'w-ov-db', label: 'RDS Proxy Connection Pool', type: 'sync' },
      { from: 'w-ov-compute', to: 'w-ov-s3', label: 'Gateway VPC Endpoint (Private AWS Backbone)', type: 'async' }
    ],
    monthlyCostEst: 1820,
    availabilitySLA: '99.99% (High Availability)',
    rto: 'Typically < 30s (Aurora failover)',
    rpo: '0 Seconds (Synchronous Storage)',
    scores: {
      operationalExcellence: 95,
      security: 98,
      reliability: 96,
      performanceEfficiency: 95,
      costOptimization: 94,
      sustainability: 96
    },
    iacSnippet: {
      language: 'hcl',
      filename: 'well_architected_foundation.tf',
      code: `// WELL-ARCHITECTED FOUNDATION: 3-Tier Multi-AZ VPC with Aurora & ALB
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  name    = "enterprise-production-vpc"
  cidr    = "10.0.0.0/16"
  azs     = ["us-east-1a", "us-east-1b", "us-east-1c"]
  
  public_subnets   = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  private_subnets  = ["10.0.11.0/24", "10.0.12.0/24", "10.0.13.0/24"]
  database_subnets = ["10.0.21.0/24", "10.0.22.0/24", "10.0.23.0/24"]
  
  enable_nat_gateway     = true
  single_nat_gateway     = false // Redundant NAT Gateways per AZ
  enable_vpn_gateway     = false
  enable_dns_hostnames   = true
}

module "aurora" {
  source  = "terraform-aws-modules/rds-aurora/aws"
  name    = "production-aurora-cluster"
  engine  = "aurora-mysql"
  
  subnets = module.vpc.database_subnets
  storage_encrypted = true
  kms_key_id        = aws_kms_key.aurora_key.arn
  
  instances = {
    one = {}
    two = {}
  }
  instance_class = "db.serverless"
  
  serverlessv2_scaling_configuration = {
    min_capacity = 0.5
    max_capacity = 16.0
  }
}`,
      notes: 'Declarative, versioned Infrastructure as Code (IaC) establishing multi-tier subnet boundaries and auto-scaling.'
    }
  },
  metrics: [
    { label: 'High Risk Issues (HRIs)', naiveValue: '3 Critical HRIs', wellArchValue: '0 HRIs', impact: 'critical', explanation: 'All identified high-risk architectural failure modes resolved across all 6 pillars.' },
    { label: 'Workload Availability SLA', naiveValue: '98.5% (SPOF)', wellArchValue: '99.99% (HA)', impact: 'positive', explanation: 'Eliminating single points of failure increases uptime from days of outage to minutes per year.' },
    { label: 'Monthly Cloud Infrastructure Spend', naiveValue: '$4,450 / mo', wellArchValue: '$1,820 / mo', impact: 'positive', explanation: 'FinOps right-sizing, auto-scaling, and tiering saves 59.1% ($4,450 to $1,820/mo).' },
    { label: 'Mean Time to Recovery (MTTR)', naiveValue: '4 - 8 Hours', wellArchValue: '< 30 Seconds', impact: 'positive', explanation: 'Automated self-healing and Aurora replica promotion restores services typically < 30s.' }
  ],
  chaos: {
    id: 'chaos-overview',
    title: 'Cascading Availability Zone Outage & Traffic Surge',
    triggerLabel: 'Simulate Enterprise Regional Outage',
    description: 'A regional datacenter power failure in AZ-a strikes simultaneously with a customer traffic surge.',
    affectedNodeIds: ['n-ov-ec2', 'n-ov-db', 'w-ov-compute', 'w-ov-db'],
    naiveConsequence: {
      statusText: 'CASCADING SYSTEM COLLAPSE',
      errorRate: '100% Dropped Requests',
      latency: 'N/A (Connection Refused)',
      downtime: '4+ Hours Required to Rebuild',
      narrative: 'The single EC2 instance in AZ-a crashes immediately. With no auto-scaling or standby database, the entire platform goes dark. Customer transactions are lost permanently.'
    },
    wellArchConsequence: {
      statusText: 'AUTOMATED SELF-HEALING ACTIVE',
      errorRate: '< 0.01% Transient Retry',
      latency: '< 28ms',
      failoverTime: '< 30 Seconds',
      narrative: 'ALB health check marks AZ-a compute unhealthy in 5 seconds and shifts traffic to AZ-b and AZ-c. Aurora promotes replica to writer endpoint typically < 30s. Zero customer sessions dropped.'
    }
  },
  speakerNotes: {
    hook: 'In cloud computing, anyone can launch an EC2 instance in five minutes. But building a cloud workload that survives catastrophic failures and cuts bills by 59.1% requires the AWS Well-Architected Framework.',
    keyPoints: [
      'The AWS Well-Architected Framework is structured across 6 Pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, and Sustainability.',
      'Our live interactive study evaluates 15 core syllabus domains, contrasting naive anti-patterns with certified production-grade solutions.',
      'Notice the quantitative transformation: Critical High-Risk Issues eliminated, MTTR slashed from hours to typically < 30s, and direct cloud spend reduced from $4,450 to $1,820/mo (59.1% savings).'
    ],
    architectTip: 'Always initiate cloud modernization projects with an AWS Well-Architected Tool review to quantify HRIs and build an executive business case.',
    examQuestion: 'What are the 6 Pillars of the AWS Well-Architected Framework? (Answer: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability).'
  }
};
