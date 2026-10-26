var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/data/domains/overview.ts
var overviewDomain = {
  id: "overview-thesis",
  number: 1,
  title: "Architecture Overview",
  subtitle: "Overview: the same app built two ways.",
  category: "Framework Foundation",
  pillars: ["Operational Excellence", "Security", "Reliability", "Performance Efficiency", "Cost Optimization", "Sustainability"],
  customerRequirement: {
    clientName: "Global Enterprise Cloud Modernization",
    businessGoal: "Establish an enterprise-wide cloud modernization blueprint across 15 mission-critical architecture domains, targeting 99.99% availability, zero single points of failure, typically < 30s failover recovery, and FinOps cost governance.",
    challenges: [
      "Legacy applications deployed manually (ClickOps) with hardcoded credentials and zero automation",
      "Cascading outages: a single server or database failure crashes the entire customer-facing platform",
      "Uncontrolled cloud expenditure with over 50% of monthly AWS bills commonly wasted on idle capacity"
    ],
    budgetOrSlaTarget: "99.99% Availability | Typically < 30s Failover | 3 Critical HRIs Remediated | 59.1% Cost Reduction ($4,450 \u2192 $1,820/mo)"
  },
  normalPrescription: {
    title: "Monolithic ClickOps Deployment with Fragile Single Points of Failure",
    prescribedServices: "Single EC2 Monolith + Single-AZ Database in Public Subnet + Flat S3 + Static Access Keys",
    whyItSeemsLogical: "Fastest way to get a prototype running with minimal initial configuration overhead.",
    whyItFailsInProduction: [
      "Single Point of Failure (SPOF) at every layer: web server, database, and network gateway",
      "Zero isolation: database directly reachable on public internet (0.0.0.0/0:3306)",
      "Manual operations without IaC lead to severe configuration drift and untracked changes",
      "Hardcoded static credentials in source code guarantee catastrophic security leaks"
    ]
  },
  wafTransformationSummary: "The AWS Well-Architected Framework transforms fragile monoliths into resilient, decoupled, and cost-optimized distributed systems across 15 core syllabus domains, resolving critical High-Risk Issues while reducing monthly cloud spend by 59.1% ($4,450 to $1,820/mo).",
  naive: {
    name: "Fragile Conventional Deployment (3 Critical HRIs Shown)",
    tagline: "Single-server stack vulnerable to datacenter outages, ransomware, and traffic spikes",
    description: "All client traffic routes directly over the public internet to a single oversized EC2 instance in a public subnet, connected to an un-replicated MySQL database with public 0.0.0.0/0:3306 ingress and an un-versioned public S3 bucket.",
    bulletPoints: [
      "3 critical High Risk Issues (HRIs) shown across core architectural pillars",
      "Single EC2 instance in a single AZ with 100% blast radius during hardware failure",
      "Database directly reachable on public internet (0.0.0.0/0 :3306 ingress)",
      "Estimated downtime risk with an average MTTR of 4 to 8 hours"
    ],
    nodes: [
      {
        id: "n-ov-client",
        name: "Internet Clients",
        type: "client",
        service: "Web & Mobile Browsers",
        tier: "public",
        isSPOF: false,
        status: "healthy",
        description: "Clients making direct un-cached requests to origin",
        configDetails: {
          specs: "500 - 5,000 req/sec unbuffered traffic",
          securityPolicy: "Un-inspected HTTP/HTTPS traffic",
          costProfile: "$0 (Client side)",
          wafAdvantage: "Front with Route 53 latency routing and CloudFront edge caching"
        }
      },
      {
        id: "n-ov-ec2",
        name: "App Server",
        type: "compute",
        service: "EC2 m5.2xlarge",
        tier: "public",
        isSPOF: true,
        status: "healthy",
        description: "Single server running web, application logic, and background jobs",
        configDetails: {
          specs: "8 vCPUs, 32GB RAM, single AZ us-east-1a",
          securityPolicy: "Public IP assigned, SSH open to internet",
          costProfile: "$280/mo compute + coupled storage",
          wafAdvantage: "Replace with multi-AZ Auto Scaling Group or ECS Fargate containers"
        }
      },
      {
        id: "n-ov-db",
        name: "Primary Database",
        type: "database",
        service: "Amazon RDS MySQL (Single-AZ)",
        tier: "public",
        isSPOF: true,
        status: "healthy",
        description: "Single database engine with no replicas or automated failover",
        configDetails: {
          specs: "db.m5.large with single gp2 storage volume",
          securityPolicy: "0.0.0.0/0 :3306 open to public internet",
          costProfile: "$180/mo with zero read replica offload",
          wafAdvantage: "Migrate to Amazon Aurora Multi-AZ with typically < 30s failover"
        }
      },
      {
        id: "n-ov-s3",
        name: "Flat S3 Bucket",
        type: "storage",
        service: "Amazon S3 Standard",
        tier: "public",
        isSPOF: false,
        status: "healthy",
        description: "No lifecycle rules, no versioning, public read ACL enabled",
        configDetails: {
          specs: "S3 Standard holding cold assets at peak price",
          securityPolicy: "Block Public Access = Disabled, unencrypted",
          costProfile: "$420/mo flat storage spend",
          wafAdvantage: "Enforce S3 Intelligent-Tiering, Object Lock, and KMS encryption"
        }
      }
    ],
    connections: [
      { from: "n-ov-client", to: "n-ov-ec2", label: "Unbuffered HTTP (No WAF/CDN)", type: "sync" },
      { from: "n-ov-ec2", to: "n-ov-db", label: "Direct SQL Queries (No Pool)", type: "sync" },
      { from: "n-ov-ec2", to: "n-ov-s3", label: "Public REST Calls (No VPC Endpoint)", type: "sync" }
    ],
    monthlyCostEst: 4450,
    availabilitySLA: "98.5% (Single Point of Failure)",
    rto: "4 - 8 Hours",
    rpo: "24 Hours (Daily Snapshot)",
    scores: {
      operationalExcellence: 20,
      security: 15,
      reliability: 20,
      performanceEfficiency: 30,
      costOptimization: 25,
      sustainability: 22
    },
    iacSnippet: {
      language: "hcl",
      filename: "legacy_monolith.tf",
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
      notes: "No load balancer, no private subnets, no auto-scaling, no encryption at rest, and zero automated recovery."
    }
  },
  wellArch: {
    name: "AWS Well-Architected 15-Domain Blueprint",
    tagline: "Multi-AZ, edge-accelerated, decoupled, and self-healing cloud architecture",
    description: "Clients are served through CloudFront edge caching with AWS WAF inspection. Dynamic traffic passes through an Application Load Balancer into private subnets hosting Auto-Scaled Graviton container pools across 3 Availability Zones. The database tier runs Amazon Aurora Multi-AZ with read replicas and RDS Proxy. Storage is secured outside the VPC via Amazon S3 with Gateway VPC Endpoints.",
    bulletPoints: [
      "3 critical HRIs resolved across core architectural pillars",
      "Multi-AZ redundancy across 3 availability zones with automatic self-healing",
      "Multi-layer caching (CloudFront + ElastiCache) offloads 90%+ of backend traffic",
      "59.1% net cloud spend reduction ($4,450 \u2192 $1,820/mo) with 99.99% availability"
    ],
    nodes: [
      {
        id: "w-ov-client",
        name: "Global Clients",
        type: "client",
        service: "Route 53 Latency-Based Routing",
        tier: "edge",
        isSPOF: false,
        status: "healthy",
        description: "DNS with health-checked latency-based routing",
        configDetails: {
          specs: "100% SLA Route 53 with automated failover checks",
          securityPolicy: "DNSSEC enabled, DDoS protection via AWS Shield",
          costProfile: "$0.50/hosted zone + $0.40/million queries",
          wafAdvantage: "Global DNS directs traffic to the lowest-latency edge"
        }
      },
      {
        id: "w-ov-edge",
        name: "CloudFront & AWS WAF",
        type: "cdn",
        service: "Amazon CloudFront + AWS WAF",
        tier: "edge",
        isSPOF: false,
        status: "healthy",
        description: "Edge POPs absorbing 90%+ of traffic with Layer 7 inspection",
        configDetails: {
          specs: "TLS 1.3, HTTP/3 enabled, Origin Shield active",
          securityPolicy: "AWS Managed Rules (Core, SQLi, Known Bad Inputs)",
          costProfile: "$0.085/GB with 92% origin offload",
          wafAdvantage: "Protects compute by blocking malicious requests before they reach origin"
        }
      },
      {
        id: "w-ov-alb",
        name: "Application Load Balancer",
        type: "loadbalancer",
        service: "AWS Application Load Balancer",
        tier: "public",
        isSPOF: false,
        status: "healthy",
        description: "Multi-AZ ingress load balancer with SSL termination across 3 AZs",
        configDetails: {
          specs: "Redundant across 3 AZs (us-east-1a, 1b, 1c) with cross-zone load balancing",
          securityPolicy: "Strict HTTPS only with TLS 1.3 security policy",
          costProfile: "$22/mo + LCU usage",
          wafAdvantage: "Automatically health-checks targets and isolates failed compute instances"
        }
      },
      {
        id: "w-ov-compute",
        name: "Auto-Scaling Compute Pool",
        type: "compute",
        service: "ECS Fargate (Graviton ARM64)",
        tier: "private",
        isSPOF: false,
        status: "healthy",
        description: "Serverless container fleet distributed across 3 Availability Zones",
        configDetails: {
          specs: "Auto-scales from 2 to 20 tasks across 3 AZs based on request rate and CPU",
          securityPolicy: "Private Subnets (10.0.11-13.0/24), Security Group allows ALB ingress only",
          costProfile: "$110/mo with Graviton 25% price-performance savings",
          wafAdvantage: "Horizontal elasticity: instances terminate and spawn with zero human intervention"
        }
      },
      {
        id: "w-ov-db",
        name: "Amazon Aurora Multi-AZ",
        type: "database",
        service: "Aurora Serverless v2 + Read Replicas",
        tier: "isolated",
        isSPOF: false,
        status: "healthy",
        description: "6-way storage replication across 3 AZs with automated failover typically < 30s",
        configDetails: {
          specs: "Auto-scaling ACUs (0.5 to 16 ACUs) with dedicated read replicas",
          securityPolicy: "Isolated Subnets (10.0.21-23.0/24), KMS CMK encryption",
          costProfile: "$140/mo with RDS Proxy connection multiplexing",
          wafAdvantage: "Decoupled compute and storage: instant failover with RPO = 0"
        }
      },
      {
        id: "w-ov-s3",
        name: "Amazon S3 Regional Store",
        type: "storage",
        service: "S3 Intelligent-Tiering + VPC Gateway Endpoint",
        tier: "edge",
        // Regional AWS service outside VPC accessed via Gateway Endpoint
        isSPOF: false,
        status: "healthy",
        description: "Regional storage outside VPC accessed privately via Gateway Endpoint with Object Lock",
        configDetails: {
          specs: "Intelligent-Tiering with automated cold transitions",
          securityPolicy: "Object Lock compliance mode, Gateway VPC Endpoint (no internet routing)",
          costProfile: "$118/mo (72% savings compared to S3 Standard flat tier)",
          wafAdvantage: "Zero data loss durability with ransomware immunity"
        }
      }
    ],
    connections: [
      { from: "w-ov-client", to: "w-ov-edge", label: "Route 53 Latency-Based Routing", type: "sync" },
      { from: "w-ov-edge", to: "w-ov-alb", label: "CloudFront Origin Shield (Dynamic API)", type: "sync" },
      { from: "w-ov-alb", to: "w-ov-compute", label: "Private Subnet Target Group (3 AZs)", type: "sync" },
      { from: "w-ov-compute", to: "w-ov-db", label: "RDS Proxy Connection Pool", type: "sync" },
      { from: "w-ov-compute", to: "w-ov-s3", label: "Gateway VPC Endpoint (Private AWS Backbone)", type: "async" }
    ],
    monthlyCostEst: 1820,
    availabilitySLA: "99.99% (High Availability)",
    rto: "Typically < 30s (Aurora failover)",
    rpo: "0 Seconds (Synchronous Storage)",
    scores: {
      operationalExcellence: 95,
      security: 98,
      reliability: 96,
      performanceEfficiency: 95,
      costOptimization: 94,
      sustainability: 96
    },
    iacSnippet: {
      language: "hcl",
      filename: "well_architected_foundation.tf",
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
      notes: "Declarative, versioned Infrastructure as Code (IaC) establishing multi-tier subnet boundaries and auto-scaling."
    }
  },
  metrics: [
    { label: "High Risk Issues (HRIs)", naiveValue: "3 Critical HRIs", wellArchValue: "0 HRIs", impact: "critical", explanation: "All identified high-risk architectural failure modes resolved across all 6 pillars." },
    { label: "Workload Availability SLA", naiveValue: "98.5% (SPOF)", wellArchValue: "99.99% (HA)", impact: "positive", explanation: "Eliminating single points of failure increases uptime from days of outage to minutes per year." },
    { label: "Monthly Cloud Infrastructure Spend", naiveValue: "$4,450 / mo", wellArchValue: "$1,820 / mo", impact: "positive", explanation: "FinOps right-sizing, auto-scaling, and tiering saves 59.1% ($4,450 to $1,820/mo)." },
    { label: "Mean Time to Recovery (MTTR)", naiveValue: "4 - 8 Hours", wellArchValue: "< 30 Seconds", impact: "positive", explanation: "Automated self-healing and Aurora replica promotion restores services typically < 30s." }
  ],
  chaos: {
    id: "chaos-overview",
    title: "Cascading Availability Zone Outage & Traffic Surge",
    triggerLabel: "Simulate Enterprise Regional Outage",
    description: "A regional datacenter power failure in AZ-a strikes simultaneously with a customer traffic surge.",
    affectedNodeIds: ["n-ov-ec2", "n-ov-db", "w-ov-compute", "w-ov-db"],
    naiveConsequence: {
      statusText: "CASCADING SYSTEM COLLAPSE",
      errorRate: "100% Dropped Requests",
      latency: "N/A (Connection Refused)",
      downtime: "4+ Hours Required to Rebuild",
      narrative: "The single EC2 instance in AZ-a crashes immediately. With no auto-scaling or standby database, the entire platform goes dark. Customer transactions are lost permanently."
    },
    wellArchConsequence: {
      statusText: "AUTOMATED SELF-HEALING ACTIVE",
      errorRate: "< 0.01% Transient Retry",
      latency: "< 28ms",
      failoverTime: "< 30 Seconds",
      narrative: "ALB health check marks AZ-a compute unhealthy in 5 seconds and shifts traffic to AZ-b and AZ-c. Aurora promotes replica to writer endpoint typically < 30s. Zero customer sessions dropped."
    }
  },
  speakerNotes: {
    hook: "In cloud computing, anyone can launch an EC2 instance in five minutes. But building a cloud workload that survives catastrophic failures and cuts bills by 59.1% requires the AWS Well-Architected Framework.",
    keyPoints: [
      "The AWS Well-Architected Framework is structured across 6 Pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, and Sustainability.",
      "Our live interactive study evaluates 15 core syllabus domains, contrasting naive anti-patterns with certified production-grade solutions.",
      "Notice the quantitative transformation: Critical High-Risk Issues eliminated, MTTR slashed from hours to typically < 30s, and direct cloud spend reduced from $4,450 to $1,820/mo (59.1% savings)."
    ],
    architectTip: "Always initiate cloud modernization projects with an AWS Well-Architected Tool review to quantify HRIs and build an executive business case.",
    examQuestion: "What are the 6 Pillars of the AWS Well-Architected Framework? (Answer: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability)."
  }
};

// src/data/domains/storage.ts
var storageDomain = {
  id: "storage-layer",
  number: 2,
  title: "Storage Layer",
  subtitle: "Amazon S3 Tiering, Object Lock, & EBS gp3 Optimization vs. Un-versioned Flat EBS",
  category: "Infrastructure Core",
  pillars: ["Cost Optimization", "Reliability", "Security"],
  customerRequirement: {
    clientName: "MediCloud Health Records Inc.",
    businessGoal: "Store 50TB of medical imaging and records with HIPAA compliance, zero data loss, sub-50ms retrieval for active patient records, and maximum cost efficiency.",
    challenges: [
      "Data must remain immutable and protected against accidental deletion or ransomware for 7 years",
      "Clinical studies indicate commonly over 80% of archival medical scans are rarely accessed after 30 days",
      "High-throughput read IOPS required during surgery consultations without paying for idle disk space"
    ],
    budgetOrSlaTarget: "RPO 0 for patient records, 7-yr WORM retention | Storage budget under $150/month"
  },
  normalPrescription: {
    title: "Single 3TB EBS gp2 Volume & Flat S3 Standard Bucket",
    prescribedServices: "Amazon EBS gp2 (3TB unpartitioned) + Amazon S3 Standard with public read ACL",
    whyItSeemsLogical: "Easy to set up in 5 minutes via the AWS console without configuring complex lifecycle policies or IAM roles.",
    whyItFailsInProduction: [
      "EBS gp2 forces you to overpay for unneeded storage just to get baseline IOPS ($0.10/GB)",
      "S3 Standard retains cold files forever at peak pricing ($0.023/GB/mo) instead of moving to Glacier ($0.00099/GB/mo)",
      "No Object Lock or Versioning: ransomware or a rogue `aws s3 rm` command permanently destroys patient records",
      "Public read ACLs accidentally expose private medical scans to internet search crawlers"
    ]
  },
  wafTransformationSummary: "WAF optimizes storage by decoupling IOPS from capacity (EBS gp3), automatically migrating cold objects to Glacier via S3 Intelligent-Tiering, and enforcing WORM compliance with S3 Object Lock and KMS envelope encryption.",
  naive: {
    name: "Un-tiered S3 & Over-provisioned EBS gp2",
    tagline: "Static EBS volume with un-versioned public S3 bucket",
    description: "Data is dumped into a single EBS gp2 volume attached to one EC2 instance with no snapshots. Static assets sit in S3 Standard forever without lifecycle rules, versioning, or object locking. Public ACLs are enabled.",
    bulletPoints: [
      "Single 3TB EBS gp2 volume paying for unused capacity and coupled IOPS ($0.10/GB)",
      "S3 bucket unencrypted at rest, public read ACL enabled, zero lifecycle rules",
      "No versioning or Object Lock: accidental delete or ransomware permanently destroys assets",
      "No cross-region replication or centralized AWS Backup policy"
    ],
    nodes: [
      {
        id: "n-ec2",
        name: "Monolithic App Server",
        type: "compute",
        service: "Amazon EC2 (m5)",
        tier: "public",
        isSPOF: true,
        status: "healthy",
        description: "Single server holding active EBS attachment",
        configDetails: {
          specs: "m5.xlarge (4 vCPUs, 16GB RAM) running un-partitioned OS and storage mount",
          securityPolicy: "Public IP assigned, open to internet",
          costProfile: "$140/mo (Compute) + coupled storage spend",
          wafAdvantage: "Replace with multi-AZ container pool or auto-scaling EC2 instances"
        }
      },
      {
        id: "n-ebs",
        name: "EBS gp2 (3TB Unpartitioned)",
        type: "storage",
        service: "Amazon EBS gp2",
        tier: "public",
        isSPOF: true,
        status: "healthy",
        description: "Overprovisioned volume, IOPS locked to storage size",
        configDetails: {
          specs: "3,000 GB gp2 volume with 9,000 baseline burst IOPS",
          securityPolicy: "Unencrypted at rest, no AWS Backup snapshot plan",
          costProfile: "$300/mo ($0.10 per GB-month regardless of actual usage)",
          wafAdvantage: "Migrate to EBS gp3: 20% cheaper with 3000 baseline IOPS decoupled from volume size"
        }
      },
      {
        id: "n-s3",
        name: "Public S3 Bucket (Flat Standard)",
        type: "storage",
        service: "Amazon S3 Standard",
        tier: "public",
        isSPOF: false,
        status: "healthy",
        description: "No lifecycle, versioning OFF, public read enabled",
        configDetails: {
          specs: "Flat standard tier, all 50TB billed at $0.023/GB/mo",
          securityPolicy: "Block Public Access disabled, server-side encryption disabled",
          costProfile: "$1,150/mo for 50TB",
          wafAdvantage: "Enable Intelligent-Tiering and Glacier Deep Archive to cut monthly spend by 72%"
        }
      }
    ],
    connections: [
      { from: "n-ec2", to: "n-ebs", label: "Direct POSIX Mount", type: "sync" },
      { from: "n-ec2", to: "n-s3", label: "Unencrypted S3 Put/Get", type: "sync" }
    ],
    monthlyCostEst: 420,
    availabilitySLA: "99.5%",
    rto: "48 Hours",
    rpo: "24 Hours",
    scores: {
      operationalExcellence: 25,
      security: 20,
      reliability: 30,
      performanceEfficiency: 45,
      costOptimization: 20,
      sustainability: 35
    },
    iacSnippet: {
      language: "hcl",
      filename: "anti_pattern_storage.tf",
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
      notes: "gp2 forces you to pay for unused storage just to get baseline IOPS. S3 lacks encryption, versioning, and lifecycle management."
    }
  },
  wellArch: {
    name: "Multi-Tier S3 Intelligent-Tiering & gp3 with AWS Backup",
    tagline: "Automated lifecycle policies, WORM Object Lock, and KMS envelope encryption",
    description: "Dynamic storage decoupled by access frequency. Amazon S3 Intelligent-Tiering and Glacier Deep Archive lifecycle rules automate cost optimization. S3 Object Lock and KMS CMK enforce WORM compliance and cryptographic privacy. EBS gp3 right-sizes IOPS independently of storage capacity.",
    bulletPoints: [
      "EBS gp3 baseline decoupled from size, saving 20% while providing 3,000 baseline IOPS",
      "S3 Intelligent-Tiering moves inactive data into Archive Instant Access without performance penalties",
      "S3 Object Lock in Compliance Mode prevents accidental deletion and ransomware tampering",
      "AWS Backup orchestrates automated cross-region and cross-account vault snapshots with KMS CMKs"
    ],
    nodes: [
      {
        id: "w-ec2",
        name: "App Instance Pool",
        type: "compute",
        service: "Amazon EC2 (c7g Graviton)",
        tier: "private",
        isSPOF: false,
        status: "healthy",
        description: "Instances right-sized to application needs",
        configDetails: {
          specs: "c7g.large Graviton3 instances (2 vCPUs, 4GB RAM) in Auto Scaling Group",
          securityPolicy: "IAM Instance Profile (No hardcoded keys), VPC Private Subnet",
          costProfile: "$52/mo baseline with 20% savings over x86",
          wafAdvantage: "High price-performance, decoupled compute from persistent storage"
        }
      },
      {
        id: "w-ebs",
        name: "EBS gp3 (Right-sized 250GB)",
        type: "storage",
        service: "Amazon EBS gp3",
        tier: "private",
        isSPOF: false,
        status: "healthy",
        description: "3000 IOPS, 125 MB/s throughput independent of volume size",
        configDetails: {
          specs: "250GB gp3 with dedicated 3000 baseline IOPS and 125 MB/s throughput",
          securityPolicy: "Encrypted with AWS KMS Customer Managed Key (CMK)",
          costProfile: "$20/mo ($0.08/GB-mo, 20% cheaper than gp2)",
          wafAdvantage: "Pay only for actual data stored without sacrificing IOPS performance"
        }
      },
      {
        id: "w-s3",
        name: "S3 Intelligent-Tiering Bucket",
        type: "storage",
        service: "Amazon S3 Intelligent-Tiering",
        tier: "private",
        isSPOF: false,
        status: "healthy",
        description: "Automated 5-tier transitions + Versioning + Object Lock",
        configDetails: {
          specs: "Automatic transitions across Frequent, Infrequent, and Archive Instant tiers",
          securityPolicy: "S3 Block Public Access enabled, S3 Object Lock Compliance Mode",
          costProfile: "Up to 68% savings with zero retrieval fees",
          wafAdvantage: "No manual lifecycle tuning needed; delivers automatic savings for changing workloads"
        }
      },
      {
        id: "w-glacier",
        name: "S3 Glacier Deep Archive",
        type: "storage",
        service: "S3 Glacier Flexible/Deep",
        tier: "isolated",
        isSPOF: false,
        status: "healthy",
        description: "Long-term compliance vault ($0.00099/GB/mo)",
        configDetails: {
          specs: "Vault Lock policy for 7-year HIPAA compliance",
          securityPolicy: "WORM (Write Once, Read Many) enforced at API layer",
          costProfile: "$0.00099/GB/month ($1 per Terabyte/month)",
          wafAdvantage: "Lowest cost cloud archive for regulatory compliance records"
        }
      },
      {
        id: "w-backup",
        name: "AWS Backup Vault",
        type: "security",
        service: "AWS Backup (Cross-Region)",
        tier: "cloud",
        isSPOF: false,
        status: "healthy",
        description: "Automated immutable snapshot schedule",
        configDetails: {
          specs: "Daily automated snapshot replication to secondary region",
          securityPolicy: "Vault Lock policy prevents deletion even by AWS root account",
          costProfile: "Pay per GB backup storage",
          wafAdvantage: "Centralized policy-driven protection against disaster and ransomware"
        }
      }
    ],
    connections: [
      { from: "w-ec2", to: "w-ebs", label: "Encrypted gp3 Attachment", type: "sync" },
      { from: "w-ec2", to: "w-s3", label: "TLS 1.3 + KMS Envelope", type: "sync" },
      { from: "w-s3", to: "w-glacier", label: "Lifecycle Rule (90d+)", type: "async" },
      { from: "w-ebs", to: "w-backup", label: "Automated Snapshot Plan", type: "async" }
    ],
    monthlyCostEst: 118,
    availabilitySLA: "99.99%",
    rto: "15 Minutes",
    rpo: "1 Hour",
    scores: {
      operationalExcellence: 90,
      security: 98,
      reliability: 95,
      performanceEfficiency: 88,
      costOptimization: 92,
      sustainability: 85
    },
    iacSnippet: {
      language: "hcl",
      filename: "well_architected_storage.tf",
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
      notes: "EBS gp3 decouples storage costs from IOPS. S3 Intelligent-Tiering and Glacier reduce storage spend by 72% with zero manual operational burden."
    }
  },
  metrics: [
    { label: "Monthly Storage Spend", naiveValue: "$420/mo", wellArchValue: "$118/mo", impact: "positive", explanation: "Decoupled gp3 and automated cold object archiving saves 72% monthly." },
    { label: "Ransomware / Deletion Protection", naiveValue: "0% (Vulnerable)", wellArchValue: "100% (WORM Locked)", impact: "positive", explanation: "Object Lock in Compliance Mode prevents tampering even with root credentials." },
    { label: "Durability SLA", naiveValue: "99.8% (Single EBS disk)", wellArchValue: "99.999999999% (11 9s)", impact: "positive", explanation: "S3 distributes objects across multiple AZs automatically." },
    { label: "IOPS Guarantee", naiveValue: "Variable (gp2 credit burn)", wellArchValue: "3,000 Dedicated Baseline", impact: "positive", explanation: "gp3 guarantees IOPS without needing 1TB+ volume sizing." }
  ],
  chaos: {
    id: "chaos-storage",
    title: "Ransomware Extortion & Accidental Object Deletion",
    triggerLabel: "Simulate Ransomware Deletion Attack",
    description: "A compromised developer credential attempts to run `aws s3 rm --recursive` across production asset buckets and corrupt active EBS blocks.",
    affectedNodeIds: ["n-s3", "n-ebs", "w-s3", "w-ebs"],
    naiveConsequence: {
      statusText: "PERMANENT DATA LOSS",
      errorRate: "100% on Asset Requests",
      latency: "N/A (Broken)",
      downtime: "48+ Hours to partial restore",
      narrative: "All production objects wiped permanently. No versioning or object lock exists. Company faces catastrophic data loss and potential regulatory fine."
    },
    wellArchConsequence: {
      statusText: "ATTACK BLOCKED & OBJECTS PRESERVED",
      errorRate: "0% Dropped Requests",
      latency: "< 18ms",
      failoverTime: "Instant (No Downtime)",
      narrative: "S3 Object Lock rejects delete API calls with 403 AccessDenied. KMS CMK policies prevent unauthorized cryptoware re-encryption. AWS Backup holds immutable recovery points."
    }
  },
  speakerNotes: {
    hook: "Storage is where enterprise balance sheets bleed silently. Unattached EBS volumes and flat S3 Standard tiers are the number one hidden cost in AWS.",
    keyPoints: [
      "Migrating from gp2 to gp3 is an instant 20% cost savings with independent provisioning of IOPS and throughput.",
      "S3 Intelligent-Tiering eliminates the guesswork of lifecycle management without retrieval fees.",
      "Object Lock provides legal hold and WORM compliance against catastrophic ransomware attacks."
    ],
    architectTip: "Always audit EBS volumes with AWS Trusted Advisor or AWS Compute Optimizer to flag unattached or underutilized gp2 drives.",
    examQuestion: "A company needs to archive medical records for 7 years under HIPAA compliance where data must never be deleted or altered by any user including root. Which AWS solution satisfies this requirement? (Answer: S3 Object Lock in Compliance Mode)."
  }
};

// src/data/domains/compute.ts
var computeDomain = {
  id: "compute-layer",
  number: 3,
  title: "Compute Layer",
  subtitle: "Auto Scaling, Graviton3 ARM, & Mixed Spot Fleets vs. Static Single-AZ Monolith",
  category: "Infrastructure Core",
  pillars: ["Performance Efficiency", "Cost Optimization", "Reliability", "Sustainability"],
  customerRequirement: {
    clientName: "ShopStream Global E-Commerce",
    businessGoal: "Handle baseline traffic of 5,000 active shoppers while dynamically absorbing sudden 10x traffic bursts (50,000 shoppers) during promotional flash sales with zero downtime and low carbon footprint.",
    challenges: [
      "Traffic fluctuates wildly between 2 AM (idle) and 8 PM (flash sale bursts)",
      "Oversized static instances burn thousands of dollars in idle compute at night",
      "Instance crashes take 10+ minutes to reboot, losing millions in abandoned carts"
    ],
    budgetOrSlaTarget: "99.99% Availability | Compute budget reduced by 60%+"
  },
  normalPrescription: {
    title: "Single Oversized On-Demand EC2 Instance (m5.4xlarge)",
    prescribedServices: "Amazon EC2 (1x m5.4xlarge, 16 vCPUs, 64GB RAM) running On-Demand in single AZ",
    whyItSeemsLogical: "Guarantees the server has plenty of RAM and CPU to handle peaks without having to configure complex load balancing or AMIs.",
    whyItFailsInProduction: [
      "Single Point of Failure: hardware degradation or AZ network partition causes 100% downtime",
      "Burns $580/month 24/7 even when traffic is near zero at 3 AM (8% average CPU utilization)",
      "When viral flash sales exceed 64GB RAM, the OS out-of-memory (OOM) killer kills web processes anyway",
      "Scaling up requires stopping the instance, changing type, and restarting (10 minutes of scheduled downtime)"
    ]
  },
  wafTransformationSummary: "WAF implements an Auto Scaling Group across 3 AZs behind an ALB. It leverages energy-efficient ARM Graviton3 instances for baseline load, paired with Spot Fleets for batch/bursts, achieving 71% cost reduction with automatic self-healing.",
  naive: {
    name: "Single Oversized On-Demand EC2 Monolith",
    tagline: "Static m5.4xlarge running 24/7 in a single Availability Zone",
    description: "An application is deployed onto a single large m5.4xlarge EC2 instance. The server averages 8% CPU utilization during work hours and 2% at night, burning thousands in idle On-Demand spend. During sudden flash sales, the single instance exhausts RAM and crashes completely.",
    bulletPoints: [
      "Single Point of Failure: No Auto Scaling or Multi-AZ presence",
      "Over-provisioned x86 architecture running 24/7 at peak sizing ($580/mo)",
      "Instance restarts or underlying hypervisor maintenance cause total downtime",
      "Zero elasticity: cannot scale out when traffic spikes beyond physical limits"
    ],
    nodes: [
      {
        id: "n-user",
        name: "Web Traffic",
        type: "client",
        service: "Public Users",
        tier: "public",
        status: "healthy",
        configDetails: {
          specs: "Unbuffered HTTP/1.1 client connections",
          securityPolicy: "Direct connection to public IP address",
          costProfile: "N/A",
          wafAdvantage: "Direct ingress to single host creates a traffic bottleneck"
        }
      },
      {
        id: "n-ec2-big",
        name: "Monolith EC2 (m5.4xlarge)",
        type: "compute",
        service: "Amazon EC2 (us-east-1a)",
        tier: "public",
        isSPOF: true,
        status: "healthy",
        description: "Single VM running Web + App + Background workers",
        configDetails: {
          specs: "16 vCPUs, 64GB RAM, Intel Xeon x86 running 24/7",
          securityPolicy: "Direct public IPv4, security group open to 0.0.0.0/0",
          costProfile: "$584/mo ($0.768/hour flat rate)",
          wafAdvantage: "Replace with Auto Scaling Group spanning 3 AZs with Target Tracking"
        }
      },
      {
        id: "n-db-local",
        name: "Local App Storage",
        type: "storage",
        service: "Instance Store / EBS",
        tier: "public",
        isSPOF: true,
        status: "healthy",
        configDetails: {
          specs: "Local root volume storing session state and logs",
          securityPolicy: "Unencrypted, no automated snapshot schedule",
          costProfile: "Bundled with instance cost",
          wafAdvantage: "Decouple state into ElastiCache Redis and S3 for stateless compute"
        }
      }
    ],
    connections: [
      { from: "n-user", to: "n-ec2-big", label: "Unbuffered HTTP Direct", type: "sync" },
      { from: "n-ec2-big", to: "n-db-local", label: "Local File IO", type: "sync" }
    ],
    monthlyCostEst: 584,
    availabilitySLA: "99.0%",
    rto: "4 Hours",
    rpo: "12 Hours",
    scores: {
      operationalExcellence: 30,
      security: 40,
      reliability: 25,
      performanceEfficiency: 40,
      costOptimization: 20,
      sustainability: 25
    },
    iacSnippet: {
      language: "hcl",
      filename: "anti_pattern_compute.tf",
      code: `# ANTI-PATTERN: Single oversized EC2 instance with no redundancy
resource "aws_instance" "monolith_server" {
  ami           = "ami-0c55b159cbfafe1f0" # Custom golden image
  instance_type = "m5.4xlarge"            # 16 vCPUs, 64GB RAM ($0.768/hr)
  subnet_id     = "subnet-1a-public"      # Single AZ - major SPOF!

  tags = {
    Name = "Production-Everything-Server"
  }
}`,
      notes: "No Auto Scaling Group, no load balancer, no health check failover, and legacy expensive x86 instance type."
    }
  },
  wellArch: {
    name: "Multi-AZ Auto Scaling Group with Graviton3 & Spot Fleets",
    tagline: "Elastic, container-ready fleet spanned across 3 AZs with ALB",
    description: "Dynamic elasticity matching supply to real-time demand. An Application Load Balancer distributes requests across an Auto Scaling Group in 3 Availability Zones. Leveraging AWS Graviton3 (c7g) delivers 25% higher performance at 20% lower cost, with Spot instances absorbing batch bursts.",
    bulletPoints: [
      "Multi-AZ resilience: automatically handles loss of an entire AWS Availability Zone",
      "Target tracking scaling policy maintains optimal 60% CPU utilization",
      "AWS Graviton3 ARM processors provide industry-leading energy efficiency & price/performance",
      "Mixed Instances Policy blends On-Demand base capacity with Spot instances for 65% cost savings"
    ],
    nodes: [
      {
        id: "w-user",
        name: "Global Users",
        type: "client",
        service: "Web & Mobile Apps",
        tier: "edge",
        status: "healthy",
        configDetails: {
          specs: "TLS 1.3 HTTPS traffic from all browsers",
          securityPolicy: "Edge SSL termination at ALB",
          costProfile: "N/A",
          wafAdvantage: "Protected by AWS Shield Standard"
        }
      },
      {
        id: "w-alb",
        name: "Application Load Balancer",
        type: "loadbalancer",
        service: "AWS ALB (Multi-AZ)",
        tier: "public",
        isSPOF: false,
        status: "healthy",
        description: "TLS offloading & path-based routing",
        configDetails: {
          specs: "Spans 3 AZs with automated cross-zone load balancing",
          securityPolicy: "AWS WAF attached, TLS 1.3 only",
          costProfile: "$22/mo base + LCU usage",
          wafAdvantage: "Deep health checking, drops unhealthy nodes in < 15 seconds"
        }
      },
      {
        id: "w-asg-1",
        name: "ASG Node (AZ-1a)",
        type: "compute",
        service: "EC2 c7g.large (Graviton3)",
        tier: "private",
        isSPOF: false,
        status: "healthy",
        az: "us-east-1a",
        configDetails: {
          specs: "2 vCPUs, 4GB RAM, ARM64 architecture",
          securityPolicy: "Private Subnet, Security Group accepts traffic ONLY from ALB",
          costProfile: "$0.0725/hr On-Demand (20% lower than x86)",
          wafAdvantage: "High efficiency, automatic termination on unhealthy check"
        }
      },
      {
        id: "w-asg-2",
        name: "ASG Node (AZ-1b)",
        type: "compute",
        service: "EC2 c7g.large (Graviton3)",
        tier: "private",
        isSPOF: false,
        status: "healthy",
        az: "us-east-1b",
        configDetails: {
          specs: "2 vCPUs, 4GB RAM, ARM64 architecture",
          securityPolicy: "Private Subnet, IAM Role instance profile",
          costProfile: "$0.0725/hr On-Demand",
          wafAdvantage: "Geographic separation guarantees uptime if AZ-1a fails"
        }
      },
      {
        id: "w-asg-3",
        name: "ASG Spot Worker (AZ-1c)",
        type: "compute",
        service: "EC2 c7g.large (Spot)",
        tier: "private",
        isSPOF: false,
        status: "healthy",
        az: "us-east-1c",
        configDetails: {
          specs: "2 vCPUs, 4GB RAM, Spot allocation",
          securityPolicy: "Private Subnet, stateless job runner",
          costProfile: "$0.0218/hr (70% discount via Spot)",
          wafAdvantage: "Absorbs promotional burst spikes at minimal cost"
        }
      }
    ],
    connections: [
      { from: "w-user", to: "w-alb", label: "HTTPS / TLS 1.3", type: "sync" },
      { from: "w-alb", to: "w-asg-1", label: "Health Checked Round-Robin", type: "sync" },
      { from: "w-alb", to: "w-asg-2", label: "Health Checked Round-Robin", type: "sync" },
      { from: "w-alb", to: "w-asg-3", label: "Burstable Batch Stream", type: "async" }
    ],
    monthlyCostEst: 168,
    availabilitySLA: "99.99%",
    rto: "< 60 Seconds",
    rpo: "0 Seconds",
    scores: {
      operationalExcellence: 92,
      security: 90,
      reliability: 98,
      performanceEfficiency: 95,
      costOptimization: 94,
      sustainability: 96
    },
    iacSnippet: {
      language: "hcl",
      filename: "well_architected_compute.tf",
      code: `# WELL-ARCHITECTED: Auto Scaling, Graviton3, Multi-AZ, Target Tracking
resource "aws_autoscaling_group" "app_asg" {
  name_prefix         = "asg-production-"
  vpc_zone_identifier = [aws_subnet.private_1a.id, aws_subnet.private_1b.id, aws_subnet.private_1c.id]
  target_group_arns   = [aws_lb_target_group.app_tg.arn]
  min_size            = 2
  max_size            = 12
  desired_capacity    = 2

  mixed_instances_policy {
    instances_distribution {
      on_demand_base_capacity                  = 2
      on_demand_percentage_above_base_capacity = 30
      spot_allocation_strategy                 = "price-capacity-optimized"
    }
    launch_template {
      launch_template_specification {
        launch_template_id = aws_launch_template.graviton_template.id
      }
      override { instance_type = "c7g.large" } # Graviton3 ARM
      override { instance_type = "m7g.large" }
    }
  }
}`,
      notes: "Spans 3 AZs with Graviton3 ARM instances. Dynamically scales between 2 and 12 instances while leveraging Spot capacity."
    }
  },
  metrics: [
    { label: "Monthly Compute Bill", naiveValue: "$584/mo", wellArchValue: "$168/mo", impact: "positive", explanation: "Elastic scaling + Graviton3 + Spot instances cuts compute expenditure by 71%." },
    { label: "Workload Availability", naiveValue: "99.0% (Single AZ)", wellArchValue: "99.99% (Multi-AZ ALB)", impact: "positive", explanation: "Application survives total AZ failure or host hypervisor crashes." },
    { label: "Average CPU Utilization", naiveValue: "8% (Severe Waste)", wellArchValue: "62% (Right-sized)", impact: "positive", explanation: "Target tracking ensures servers operate at peak efficiency." },
    { label: "Carbon Intensity (Sustainability)", naiveValue: "High (x86 idle 24/7)", wellArchValue: "Low (ARM Graviton3 60% less energy)", impact: "positive", explanation: "Graviton3 processors consume up to 60% less energy for the same compute output." }
  ],
  chaos: {
    id: "chaos-compute",
    title: "10x Flash Sale Traffic Surge & AZ-1a Hard Failure",
    triggerLabel: "Simulate 10x Spike & AZ Outage",
    description: "A marketing campaign floods the compute layer with 50,000 req/s while AWS us-east-1a suffers an underlying power disruption.",
    affectedNodeIds: ["n-ec2-big", "w-asg-1"],
    naiveConsequence: {
      statusText: "OUT OF MEMORY & TOTAL SYSTEM CRASH",
      errorRate: "100% (502 / 504 Bad Gateway)",
      latency: "Timeout (> 30,000ms)",
      downtime: "Hours until manual hardware migration",
      narrative: "The single EC2 instance hits 100% CPU, exhausts RAM, and the Linux OOM killer terminates the web service. Complete application outage."
    },
    wellArchConsequence: {
      statusText: "AUTO-SCALED & SEAMLESS AZ FAILOVER",
      errorRate: "0.01% Transient (< 5 requests)",
      latency: "34ms",
      failoverTime: "Instant traffic re-route, ASG scale-out < 75s",
      narrative: "ALB health check marks AZ-1a node unhealthy within 10s and diverts 100% of traffic to healthy nodes in AZ-1b and 1c. ASG launches 4 additional Graviton instances automatically."
    }
  },
  speakerNotes: {
    hook: "In the cloud, paying for idle capacity is the architectural equivalent of throwing company money out the window.",
    keyPoints: [
      "AWS Graviton3 instances offer 25% better compute performance and up to 60% lower power consumption compared to x86.",
      "Auto Scaling Target Tracking policies allow the architecture to breathe with actual user demand.",
      "A single EC2 instance is NEVER acceptable for a production certified architecture due to lack of fault isolation."
    ],
    architectTip: "Combine Graviton with AWS Compute Optimizer recommendations to discover right-sizing opportunities across your fleet.",
    examQuestion: "A company wants to minimize compute costs for a batch processing workload that can be interrupted without losing progress. What instance purchasing option is best? (Answer: Amazon EC2 Spot Instances with Spot Fleet)."
  }
};

// src/data/domains/database.ts
var databaseDomain = {
  id: "database-layer",
  number: 4,
  title: "Database Layer",
  subtitle: "Amazon Aurora Multi-AZ with Auto-scaling Replicas vs. Self-Managed EC2 MySQL",
  category: "Infrastructure Core",
  pillars: ["Reliability", "Performance Efficiency", "Operational Excellence"],
  customerRequirement: {
    clientName: "FinPulse Global Trading & CRM",
    businessGoal: "Relational database handling 25,000 transactions/sec for international financial accounts with failover typically < 30s and zero data loss guarantee.",
    challenges: [
      "Single database host crashing loses millions in active trading revenue",
      "Nightly mysqldump locks tables and causes checkout timeouts",
      "Heavy analytical queries starve transactional writes"
    ],
    budgetOrSlaTarget: "99.99% Availability | RTO < 30s | RPO = 0"
  },
  normalPrescription: {
    title: "Self-Managed MySQL 8.0 on a Single EC2 Instance",
    prescribedServices: "EC2 r5.xlarge with local storage and bash cron mysqldump to /var/backups",
    whyItSeemsLogical: "DBAs are familiar with standard Linux MySQL installation and want full root control over my.cnf configuration.",
    whyItFailsInProduction: [
      "Single point of failure: host hardware crash kills database completely",
      "Backups take hours and lock production tables",
      "Reads and writes share single CPU; reporting queries cause lock contention",
      "Storage capacity cannot expand without manual unmounting and downtime"
    ]
  },
  wafTransformationSummary: "WAF replaces self-managed MySQL with Amazon Aurora Multi-AZ with auto-scaling Read Replicas. Aurora writes 6 copies of data across 3 AZs with quorum writes, sub-second failover, and continuous Point-in-Time Recovery to S3.",
  naive: {
    name: "Self-Managed MySQL on EC2 with Bash Cron Backup",
    tagline: "Single EC2 instance running MySQL 8.0 with local storage",
    description: "Database is installed directly on an EC2 instance. All read queries, complex analytical reports, and write transactions compete for the same CPU core. Backups depend on a fragile shell script executing `mysqldump` at 2:00 AM, locking tables and writing to local disk.",
    bulletPoints: [
      "Single Point of Failure: No replication, no standby, zero fault tolerance",
      "Read and write operations share the same CPU and disk queue (read starvation)",
      "Backups lock production tables and have never been tested for point-in-time recovery",
      "Storage scaling requires unmounting disks, taking the database offline for hours"
    ],
    nodes: [
      { id: "n-app-layer", name: "App Servers", type: "compute", service: "App Instances", tier: "public", status: "healthy" },
      { id: "n-mysql-ec2", name: "Self-Managed MySQL (EC2)", type: "database", service: "MySQL 8 on Ubuntu EC2", tier: "public", isSPOF: true, status: "healthy", description: "Single writer, no standby, locks on dump" },
      { id: "n-local-dump", name: "Local Backup Script (/var/backups)", type: "storage", service: "EBS volume cron dump", tier: "public", isSPOF: true, status: "healthy" }
    ],
    connections: [
      { from: "n-app-layer", to: "n-mysql-ec2", label: "Blocking Port 3306 TCP", type: "sync" },
      { from: "n-mysql-ec2", to: "n-local-dump", label: "Nightly mysqldump", type: "async" }
    ],
    monthlyCostEst: 290,
    availabilitySLA: "99.0%",
    rto: "4 - 6 Hours",
    rpo: "24 Hours (Lost since 2 AM)",
    scores: {
      operationalExcellence: 20,
      security: 35,
      reliability: 20,
      performanceEfficiency: 35,
      costOptimization: 45,
      sustainability: 40
    },
    iacSnippet: {
      language: "hcl",
      filename: "anti_pattern_database.tf",
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
      notes: "No automated failover, manual patches, storage cannot grow dynamically, and locks during backup."
    }
  },
  wellArch: {
    name: "Amazon Aurora Multi-AZ Cluster with Auto-Scaling Read Replicas",
    tagline: "Fault-tolerant distributed storage with sub-30s failover and continuous PITR",
    description: "Amazon Aurora decouples compute and storage. Aurora replicates 6 copies of data across 3 Availability Zones with continuous backup to Amazon S3. Auto-scaling Read Replicas handle reporting and read spikes, while sub-second failover ensures continuous enterprise uptime.",
    bulletPoints: [
      "Automatic failover to a Read Replica in under 30 seconds with zero data loss",
      "Aurora distributed log-structured storage replicates 6 ways across 3 AZs with quorum writes",
      "Continuous automated backups to S3 with 1-second granularity Point-in-Time Recovery (PITR)",
      "Independent Reader and Writer endpoints eliminate read contention on primary transactions"
    ],
    nodes: [
      { id: "w-apps", name: "App Services Pool", type: "compute", service: "ECS / EC2 Cluster", tier: "private", status: "healthy" },
      { id: "w-aurora-writer", name: "Aurora Writer Node (AZ-1a)", type: "database", service: "Amazon Aurora MySQL (db.r6g)", tier: "isolated", isSPOF: false, status: "healthy", az: "us-east-1a" },
      { id: "w-aurora-reader1", name: "Aurora Read Replica (AZ-1b)", type: "database", service: "Amazon Aurora Reader (db.r6g)", tier: "isolated", isSPOF: false, status: "healthy", az: "us-east-1b" },
      { id: "w-aurora-reader2", name: "Aurora Read Replica (AZ-1c)", type: "database", service: "Amazon Aurora Reader (db.r6g)", tier: "isolated", isSPOF: false, status: "healthy", az: "us-east-1c" },
      { id: "w-aurora-storage", name: "Aurora Distributed Storage Engine", type: "storage", service: "6-Way 3-AZ Shared Volume", tier: "isolated", isSPOF: false, status: "healthy" }
    ],
    connections: [
      { from: "w-apps", to: "w-aurora-writer", label: "Cluster Writer Endpoint (ACID)", type: "sync" },
      { from: "w-apps", to: "w-aurora-reader1", label: "Reader Endpoint (Load Balanced)", type: "sync" },
      { from: "w-apps", to: "w-aurora-reader2", label: "Reader Endpoint (Load Balanced)", type: "sync" },
      { from: "w-aurora-writer", to: "w-aurora-storage", label: "Log Stream Quorum (4 of 6)", type: "sync" }
    ],
    monthlyCostEst: 340,
    availabilitySLA: "99.99%",
    rto: "< 30 Seconds",
    rpo: "0 Seconds",
    scores: {
      operationalExcellence: 95,
      security: 94,
      reliability: 99,
      performanceEfficiency: 96,
      costOptimization: 85,
      sustainability: 90
    },
    iacSnippet: {
      language: "hcl",
      filename: "well_architected_database.tf",
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
      notes: "Storage auto-scales up to 128 TiB without manual repartitioning. Read Replicas automatically serve as failover targets."
    }
  },
  metrics: [
    { label: "Database Availability SLA", naiveValue: "99.0% (Single Point of Failure)", wellArchValue: "99.99% (Aurora Multi-AZ)", impact: "positive", explanation: "Sub-30-second automated failover without manual DBA intervention." },
    { label: "Recovery Point Objective (RPO)", naiveValue: "Up to 24 Hours (Nightly dump)", wellArchValue: "0 Seconds (Continuous PITR)", impact: "positive", explanation: "Continuous write-ahead logging to S3 enables sub-second point-in-time restore." },
    { label: "Read Throughput Scaling", naiveValue: "1x (Pinned to single disk)", wellArchValue: "15x (Auto-scaling Reader Endpoint)", impact: "positive", explanation: "Aurora scales up to 15 Read Replicas across multiple AZs." },
    { label: "Storage Self-Healing", naiveValue: "Manual EBS volume expansion", wellArchValue: "Auto-grows in 10GB blocks to 128TB", impact: "positive", explanation: "Storage expands automatically without downtime or performance degradation." }
  ],
  chaos: {
    id: "chaos-database",
    title: "Primary Database Node Kernel Panic & Hardware Crash",
    triggerLabel: "Crash Primary DB Writer Node",
    description: "The physical hardware hosting the primary database writer suffers an unrecoverable kernel panic.",
    affectedNodeIds: ["n-mysql-ec2", "w-aurora-writer"],
    naiveConsequence: {
      statusText: "CATASTROPHIC OUTAGE & DATA CORRUPTION",
      errorRate: "100% of Application Transactions Fail",
      latency: "Infinite (Connection Refused)",
      downtime: "4 to 6 Hours",
      narrative: "Database process dies. File system left in dirty state with table corruption. DBA must be woken up, provision a replacement EC2, and replay old backups. Transactions from the past 14 hours are lost forever."
    },
    wellArchConsequence: {
      statusText: "AUTO-FAILOVER TO REPLICA IN 24 SECONDS",
      errorRate: "0.05% for 20 seconds during DNS flip",
      latency: "22ms post failover",
      failoverTime: "24 Seconds (Zero Data Loss)",
      narrative: "Aurora cluster detects lost heartbeat in 10s. Read Replica in AZ-1b is instantly elected primary writer. Cluster endpoint DNS flips automatically. Zero commits lost (RPO = 0)."
    }
  },
  speakerNotes: {
    hook: "Never run production databases on plain EC2 instances unless you have a dedicated 24/7 team of database administrators ready to restore corrupted disk blocks at 3:00 AM.",
    keyPoints: [
      "Amazon Aurora decouples compute from storage, writing to 6 storage nodes across 3 AZs.",
      "Aurora provides up to 5x the throughput of standard MySQL running on EC2.",
      "Continuous automated backups allow Point-in-Time Recovery down to the exact second."
    ],
    architectTip: "Always use the Aurora Reader Endpoint for read queries and analytical reporting to protect write transaction IOPS.",
    examQuestion: "An application requires a relational database with an RTO of less than 30 seconds and an RPO of 0 in the event of an Availability Zone failure. Which solution meets these requirements? (Answer: Amazon Aurora Multi-AZ with automated failover)."
  }
};

// src/data/domains/networking.ts
var networkingDomain = {
  id: "networking-environment",
  number: 5,
  title: "Networking Environment",
  subtitle: "3-Tier Multi-AZ VPC with Private/Isolated Subnets vs. Flat Public Default VPC",
  category: "Network & Connectivity",
  pillars: ["Security", "Reliability", "Operational Excellence"],
  customerRequirement: {
    clientName: "PayShield Global Payments",
    businessGoal: "Host payment gateway APIs and merchant database in AWS while meeting strict PCI-DSS Level 1 compliance for network isolation.",
    challenges: [
      "Zero public routability allowed to backend databases",
      "Must inspect all ingress and egress network traffic",
      "Developer remote access needed without exposing open internet ports"
    ],
    budgetOrSlaTarget: "PCI-DSS Compliance | 0 Public DB Endpoints | 100% Traffic Audited"
  },
  normalPrescription: {
    title: "Default AWS VPC with Flat Public Subnet & 0.0.0.0/0 SG Rules",
    prescribedServices: "AWS Default VPC (172.31.0.0/16) with all instances on public IPv4 addresses and 0.0.0.0/0 open on port 3306 for remote access",
    whyItSeemsLogical: "Fastest way to get instances communicating without configuring route tables or NAT Gateways.",
    whyItFailsInProduction: [
      "Database port 3306 directly exposed to automated Shodan port scanners and botnets",
      "Flat network has zero perimeter containment: compromising a web server gives direct access to DB",
      "No VPC Flow Logs: impossible to trace data exfiltration or prove PCI-DSS compliance"
    ]
  },
  wafTransformationSummary: "WAF establishes a strict 3-tier VPC spanning 3 AZs with Public subnets (ALB/NAT), Private subnets (App containers), and Isolated subnets (Database). Security groups enforce referential chaining, and VPC Flow Logs stream to CloudWatch.",
  naive: {
    name: "Default VPC with Flat Public Subnet & 0.0.0.0/0 Exposure",
    tagline: "All servers and databases reside on public IP addresses",
    description: "The workload is deployed inside the AWS account default VPC. Application servers and database instances are assigned public IPv4 addresses. Security groups allow port 3306 (MySQL) and port 22 (SSH) from 0.0.0.0/0 for developer convenience. VPC Flow Logs are disabled.",
    bulletPoints: [
      "Production database directly reachable over the public internet on default port 3306",
      "Flat network topology: no defense-in-depth or network boundary separation",
      "Wide open Security Groups (0.0.0.0/0) exposed to brute force password spray attacks",
      "No VPC Flow Logs: zero visibility into malicious egress or lateral movement"
    ],
    nodes: [
      { id: "n-attacker", name: "Internet Port Scanner / Botnet", type: "client", service: "Public Web Scanner", tier: "edge", status: "degraded" },
      { id: "n-flat-vpc", name: "Default Flat VPC (172.31.0.0/16)", type: "network", service: "AWS Default VPC", tier: "public", isSPOF: true, status: "healthy" },
      { id: "n-pub-db", name: "Public MySQL (Port 3306 Open)", type: "database", service: "Database with Public IPv4", tier: "public", isSPOF: true, status: "healthy", description: "0.0.0.0/0 SG rule open to the world" }
    ],
    connections: [
      { from: "n-attacker", to: "n-pub-db", label: "Direct Unrestricted TCP 3306", type: "sync" },
      { from: "n-flat-vpc", to: "n-pub-db", label: "Default Route Table (IGW direct)", type: "sync" }
    ],
    monthlyCostEst: 45,
    availabilitySLA: "98.5%",
    rto: "Manual Incident Triage",
    rpo: "Compromised Integrity",
    scores: {
      operationalExcellence: 20,
      security: 10,
      reliability: 35,
      performanceEfficiency: 50,
      costOptimization: 70,
      sustainability: 50
    },
    iacSnippet: {
      language: "hcl",
      filename: "anti_pattern_vpc.tf",
      code: `# ANTI-PATTERN: Database in public subnet with 0.0.0.0/0 ingress
resource "aws_security_group" "bad_database_sg" {
  name        = "db-public-access"
  description = "Open to world for remote dev access"

  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # CATASTROPHIC SECURITY FLAW!
  }
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Open SSH to world!
  }
}`,
      notes: "Exposing MySQL port 3306 and SSH port 22 directly to 0.0.0.0/0 is a critical compliance violation and leading cause of ransomware breaches."
    }
  },
  wellArch: {
    name: "Enterprise 3-Tier Multi-AZ VPC with Strict Isolation & Flow Logs",
    tagline: "Public (ALB/NAT), Private (App), and Isolated (DB) subnets across 3 AZs",
    description: "Rigorous network perimeter segmentation. Public subnets contain only ALBs and managed NAT Gateways. Application containers run in private subnets with egress via NAT. Database clusters reside in completely isolated subnets with zero internet gateway route. Security groups use stateful referential chaining.",
    bulletPoints: [
      "Strict 3-Tier architecture spanning 3 Availability Zones with dedicated route tables",
      "Database has ZERO public IPv4 address and no route to the Internet Gateway",
      "Security Groups enforce referential rules: Database only accepts TCP 3306 from App SG ID",
      "VPC Flow Logs capture 100% of network traffic metadata with automated anomaly detection"
    ],
    nodes: [
      { id: "w-net-users", name: "External Traffic", type: "client", service: "Legitimate Clients", tier: "edge", status: "healthy" },
      { id: "w-igw", name: "Internet Gateway (IGW)", type: "gateway", service: "AWS IGW", tier: "public", isSPOF: false, status: "healthy" },
      { id: "w-sub-pub", name: "Public Subnet (ALB + NAT GW)", type: "network", service: "Public Subnet (AZ-a/b/c)", tier: "public", isSPOF: false, status: "healthy" },
      { id: "w-sub-priv", name: "Private Subnet (App ECS/EC2)", type: "network", service: "Private Subnet (Outbound via NAT)", tier: "private", isSPOF: false, status: "healthy" },
      { id: "w-sub-iso", name: "Isolated Subnet (Aurora DB)", type: "database", service: "Isolated Subnet (No Internet Route)", tier: "isolated", isSPOF: false, status: "healthy" }
    ],
    connections: [
      { from: "w-net-users", to: "w-igw", label: "HTTPS 443 Only", type: "sync" },
      { from: "w-igw", to: "w-sub-pub", label: "Public Ingress to ALB", type: "sync" },
      { from: "w-sub-pub", to: "w-sub-priv", label: "Internal Reverse Proxy", type: "sync" },
      { from: "w-sub-priv", to: "w-sub-iso", label: "Referential SG TCP 3306 Only", type: "sync" }
    ],
    monthlyCostEst: 145,
    availabilitySLA: "99.99%",
    rto: "N/A (Immune to Direct Ingress)",
    rpo: "Zero Exposure",
    scores: {
      operationalExcellence: 95,
      security: 99,
      reliability: 98,
      performanceEfficiency: 92,
      costOptimization: 85,
      sustainability: 88
    },
    iacSnippet: {
      language: "hcl",
      filename: "well_architected_vpc.tf",
      code: `# WELL-ARCHITECTED: 3-Tier VPC with Referential Security Groups
resource "aws_security_group" "app_sg" {
  name        = "app-workload-sg"
  vpc_id      = aws_vpc.main_vpc.id
  # Ingress strictly from ALB SG:
  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }
}

resource "aws_security_group" "db_isolated_sg" {
  name        = "database-isolated-sg"
  vpc_id      = aws_vpc.main_vpc.id

  # Database ONLY accepts connections from Application SG!
  ingress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.app_sg.id]
  }
  # No egress allowed to the Internet!
}`,
      notes: "Chained referential security groups guarantee that even if an attacker knew the database private IP, direct access from outside the VPC is mathematically impossible."
    }
  },
  metrics: [
    { label: "Public Database Attack Surface", naiveValue: "100% Exposed (0.0.0.0/0)", wellArchValue: "0% (Isolated Subnet)", impact: "positive", explanation: "Eliminates direct internet routability to core stateful databases." },
    { label: "Defense-in-Depth Tiers", naiveValue: "1 (Single flat subnet)", wellArchValue: "3 Tiers across 3 AZs", impact: "positive", explanation: "Public, private, and isolated boundaries enforce least privilege networking." },
    { label: "Network Visibility & Auditability", naiveValue: "0% (Flow Logs Disabled)", wellArchValue: "100% (VPC Flow Logs to S3/CloudWatch)", impact: "positive", explanation: "All accepted and rejected network traffic is indexed for threat analysis." },
    { label: "Blast Radius Containment", naiveValue: "Zero (Full flat access)", wellArchValue: "Micro-segmented per security group", impact: "positive", explanation: "Compromise of a web server does not automatically grant database root access." }
  ],
  chaos: {
    id: "chaos-networking",
    title: "Automated Shodan Port Scan & Brute Force Botnet Assault",
    triggerLabel: "Simulate Internet Port Scan & Brute Force",
    description: "An aggressive automated scanning bot sweeps the cloud CIDR block attempting SSH and MySQL dictionary attacks.",
    affectedNodeIds: ["n-pub-db", "w-sub-iso"],
    naiveConsequence: {
      statusText: "AUTHENTICATION BREACH & DATA EXFILTRATION",
      errorRate: "Database CPU 100% locked by brute force connections",
      latency: "Application queries starved",
      downtime: "Security incident requiring emergency isolation",
      narrative: "Port 3306 is open to the globe. Botnet launches thousands of connection attempts per second, discovers weak credentials, dumps database, and leaves a ransom note."
    },
    wellArchConsequence: {
      statusText: "ATTACK REPELLED: ZERO INGRESS PACKETS REACH DB",
      errorRate: "0% Impact",
      latency: "Normal (< 25ms)",
      failoverTime: "Instant (Perimeter drops packets at IGW/Router)",
      narrative: "Port scanner cannot even locate the database because it has no public IP address and isolated subnets lack an IGW route. Attack traffic drops harmlessly at the edge."
    }
  },
  speakerNotes: {
    hook: "If your production database has a public IPv4 address, you do not have a security posture\u2014you have a ticking time bomb.",
    keyPoints: [
      "A Well-Architected VPC is always partitioned into at least 3 tiers: Public, Private, and Isolated.",
      "Security Groups should reference other Security Groups by ID rather than raw CIDR blocks.",
      "VPC Flow Logs provide crucial forensics for SOC 2, ISO 27001, and HIPAA compliance."
    ],
    architectTip: "Utilize AWS Network Access Analyzer and IAM VPC Endpoint Policies to verify that no unauthorized paths exist into your isolated data tiers.",
    examQuestion: "A company requires that its database tier have no internet connectivity while still receiving connections from an EC2 application tier. What subnet and routing setup is required? (Answer: Place the database in an isolated subnet with no route to an IGW or NAT GW, allowing ingress only from the application security group)."
  }
};

// src/data/domains/connecting.ts
var connectingDomain = {
  id: "connecting-networks",
  number: 6,
  title: "Connecting Networks",
  subtitle: "AWS Transit Gateway Hub-and-Spoke with Direct Connect & VPN Failover vs. O(N\xB2) Peering Mesh",
  category: "Network & Connectivity",
  pillars: ["Reliability", "Operational Excellence", "Security"],
  customerRequirement: {
    clientName: "OmniCorp Multi-National Enterprise",
    businessGoal: "Interconnect 25 spoke VPCs across business units with on-premises headquarters and partner data centers with centralized security inspection.",
    challenges: [
      "Point-to-point VPC peering requires 300 separate connections (O(N\xB2))",
      "Corporate headquarters needs high-bandwidth private connectivity that survives fiber cuts",
      "Need centralized egress inspection for malware and data loss prevention"
    ],
    budgetOrSlaTarget: "99.99% Connectivity SLA | < 5s Carrier Failover | Centralized Egress Firewall"
  },
  normalPrescription: {
    title: "Full Mesh of VPC Peering Connections & Single Internet IPsec VPN",
    prescribedServices: "VPC Peering mesh + single AWS Site-to-Site VPN over public broadband",
    whyItSeemsLogical: "Peering connections have no hourly charge; VPN is simple to deploy from the console.",
    whyItFailsInProduction: [
      "Peering does not support transitive routing: adding 1 VPC requires updating 24 route tables",
      "Single VPN tunnel drops during ISP brownouts, disconnecting headquarters",
      "No central inspection point: each VPC has its own unmonitored internet gateway"
    ]
  },
  wafTransformationSummary: "WAF deploys AWS Transit Gateway (TGW) as a regional hub-and-spoke router with redundant Direct Connect and BGP VPN failover, plus a Centralized Egress VPC with AWS Network Firewall.",
  naive: {
    name: "Fragile VPC Peering Mesh & Single IPsec VPN",
    tagline: "O(N\xB2) point-to-point connections with manual route tables",
    description: "Multiple VPCs across development, staging, shared services, and production are connected via individual VPC peering connections. As VPC count reaches 10, managing 45 separate peering routes becomes unmaintainable. Connectivity to on-premises relies on a single unmanaged IPsec VPN over the public internet.",
    bulletPoints: [
      "Route table sprawl: adding one new VPC requires updating route tables in every single existing VPC",
      "No transitive routing: VPC A cannot talk to VPC C through VPC B",
      "Single IPsec VPN: internet brownouts disconnect corporate headquarters entirely",
      "No centralized egress inspection or centralized Network Firewall"
    ],
    nodes: [
      { id: "n-corp-onprem", name: "Corporate HQ Data Center", type: "on-premises", service: "On-Premises Cisco Router", tier: "on-premises", status: "healthy" },
      { id: "n-single-vpn", name: "Single IPsec VPN (Internet)", type: "network", service: "AWS Site-to-Site VPN (Single tunnel)", tier: "public", isSPOF: true, status: "healthy", description: "Subject to internet routing flaps" },
      { id: "n-mesh-vpc-a", name: "Prod VPC A", type: "network", service: "VPC 10.1.0.0/16", tier: "cloud", isSPOF: false, status: "healthy" },
      { id: "n-mesh-vpc-b", name: "Staging VPC B", type: "network", service: "VPC 10.2.0.0/16", tier: "cloud", isSPOF: false, status: "healthy" },
      { id: "n-mesh-vpc-c", name: "Shared Services VPC C", type: "network", service: "VPC 10.3.0.0/16", tier: "cloud", isSPOF: false, status: "healthy" }
    ],
    connections: [
      { from: "n-corp-onprem", to: "n-single-vpn", label: "Public Internet Tunnel", type: "sync" },
      { from: "n-single-vpn", to: "n-mesh-vpc-a", label: "Static VPN Route", type: "sync" },
      { from: "n-mesh-vpc-a", to: "n-mesh-vpc-b", label: "Peering Route A-B", type: "sync" },
      { from: "n-mesh-vpc-b", to: "n-mesh-vpc-c", label: "Peering Route B-C", type: "sync" },
      { from: "n-mesh-vpc-a", to: "n-mesh-vpc-c", label: "Peering Route A-C", type: "sync" }
    ],
    monthlyCostEst: 210,
    availabilitySLA: "98.0%",
    rto: "3 Hours",
    rpo: "In-Transit Packet Drop",
    scores: {
      operationalExcellence: 25,
      security: 40,
      reliability: 30,
      performanceEfficiency: 45,
      costOptimization: 50,
      sustainability: 45
    },
    iacSnippet: {
      language: "hcl",
      filename: "anti_pattern_peering.tf",
      code: `# ANTI-PATTERN: N*(N-1)/2 mesh of VPC peering connections
resource "aws_vpc_peering_connection" "mesh_1" {
  peer_vpc_id = aws_vpc.vpc_b.id
  vpc_id      = aws_vpc.vpc_a.id
  auto_accept = true
}

resource "aws_vpc_peering_connection" "mesh_2" {
  peer_vpc_id = aws_vpc.vpc_c.id
  vpc_id      = aws_vpc.vpc_a.id
  auto_accept = true
}

# Every new VPC requires dozens of repetitive route updates:
resource "aws_route" "route_a_to_b" {
  route_table_id            = aws_route_table.rt_a.id
  destination_cidr_block    = "10.2.0.0/16"
  vpc_peering_connection_id = aws_vpc_peering_connection.mesh_1.id
}`,
      notes: "Scales with O(N\xB2) complexity. VPC peering does not support transitive routing, leading to operational gridlock."
    }
  },
  wellArch: {
    name: "AWS Transit Gateway Hub-and-Spoke with Direct Connect & VPN Failover",
    tagline: "Centralized cloud routing, AWS Network Firewall egress, and BGP resilience",
    description: "Scalable regional hub-and-spoke topology. AWS Transit Gateway (TGW) consolidates connectivity across hundreds of VPCs and corporate on-premises locations. Dedicated AWS Direct Connect links provide dedicated low-latency bandwidth with automated BGP failover to IPsec VPN. Centralized Egress VPC with AWS Network Firewall inspects all outbound internet traffic.",
    bulletPoints: [
      "Linear O(N) operational complexity: attach any new VPC in seconds without re-touching existing VPCs",
      "Full transitive routing across VPCs, on-prem, and external software partners",
      "Dual active-standby BGP routing: automatic sub-second failover from Direct Connect to VPN",
      "Centralized Egress Inspection VPC with AWS Network Firewall for intrusion prevention (IPS)"
    ],
    nodes: [
      { id: "w-corp-hybrid", name: "Corporate Data Center", type: "on-premises", service: "Redundant Edge Routers", tier: "on-premises", status: "healthy" },
      { id: "w-dx", name: "AWS Direct Connect (10 Gbps)", type: "network", service: "Dedicated Fiber Interconnect", tier: "cloud", isSPOF: false, status: "healthy" },
      { id: "w-backup-vpn", name: "Backup IPsec VPN (BGP)", type: "network", service: "Dual-Tunnel Automated Failover", tier: "cloud", isSPOF: false, status: "healthy" },
      { id: "w-tgw", name: "AWS Transit Gateway (TGW)", type: "gateway", service: "Central Regional Cloud Router", tier: "cloud", isSPOF: false, status: "healthy", description: "Transitive routing hub supporting up to 50 Gbps/attachment" },
      { id: "w-egress-fw", name: "Centralized Egress + AWS Network FW", type: "security", service: "Stateful Deep Packet Inspection", tier: "public", isSPOF: false, status: "healthy" },
      { id: "w-spoke-vpcs", name: "Spoke VPCs (Prod, Staging, Data)", type: "network", service: "Multiple Segregated Spoke VPCs", tier: "private", isSPOF: false, status: "healthy" }
    ],
    connections: [
      { from: "w-corp-hybrid", to: "w-dx", label: "Primary 10Gbps BGP Route", type: "sync" },
      { from: "w-corp-hybrid", to: "w-backup-vpn", label: "Standby BGP Path", type: "failover" },
      { from: "w-dx", to: "w-tgw", label: "Direct Connect Gateway", type: "sync" },
      { from: "w-backup-vpn", to: "w-tgw", label: "VPN Attachment", type: "sync" },
      { from: "w-tgw", to: "w-spoke-vpcs", label: "TGW VPC Attachments", type: "sync" },
      { from: "w-tgw", to: "w-egress-fw", label: "Default 0.0.0.0/0 Egress Route", type: "sync" }
    ],
    monthlyCostEst: 420,
    availabilitySLA: "99.99%",
    rto: "< 5 Seconds (BGP Keepalive)",
    rpo: "0 Packet Loss",
    scores: {
      operationalExcellence: 96,
      security: 95,
      reliability: 98,
      performanceEfficiency: 94,
      costOptimization: 86,
      sustainability: 88
    },
    iacSnippet: {
      language: "hcl",
      filename: "well_architected_transit_gateway.tf",
      code: `# WELL-ARCHITECTED: AWS Transit Gateway Hub-and-Spoke Router
resource "aws_ec2_transit_gateway" "central_tgw" {
  description                     = "Central Regional Transit Gateway"
  auto_accept_shared_attachments = "enable"
  default_route_table_association = "enable"
  default_route_table_propagation = "enable"
  dns_support                     = "enable"
  vpn_ecmp_support                = "enable" # Equal Cost Multi-Path routing
}

resource "aws_ec2_transit_gateway_vpc_attachment" "prod_attach" {
  transit_gateway_id = aws_ec2_transit_gateway.central_tgw.id
  vpc_id             = aws_vpc.production.id
  subnet_ids         = [aws_subnet.prod_tgw_1a.id, aws_subnet.prod_tgw_1b.id]
}`,
      notes: "Replaces 45+ peering links with a single central router. VPCs scale linearly with zero route table explosion."
    }
  },
  metrics: [
    { label: "Routing Complexity", naiveValue: "O(N\xB2) - 45+ Connections for 10 VPCs", wellArchValue: "O(N) - 1 TGW Attachment per VPC", impact: "positive", explanation: "Adding a 10th VPC requires 1 connection instead of 9 separate peerings." },
    { label: "Transitive Routing Support", naiveValue: "Unsupported (Hard Protocol Limit)", wellArchValue: "Fully Supported Native Routing", impact: "positive", explanation: "Allows seamless communication between on-prem, shared services, and spokes." },
    { label: "Direct Connect Failover Time", naiveValue: "Manual DNS reconfiguration (Hours)", wellArchValue: "Automatic BGP Failover (< 5 Seconds)", impact: "positive", explanation: "BGP dead-peer detection triggers automated traffic shift to VPN." },
    { label: "Central Egress Inspection", naiveValue: "None (Unfiltered direct egress)", wellArchValue: "100% Inspected via AWS Network Firewall", impact: "positive", explanation: "Enforces strict outbound domain whitelisting and threat intelligence feeds." }
  ],
  chaos: {
    id: "chaos-connecting",
    title: "Primary Direct Connect Fiber Cut & Carrier Outage",
    triggerLabel: "Sever Primary Direct Connect Circuit",
    description: "A physical fiber optic cable cut knocks out the primary 10 Gbps AWS Direct Connect link to corporate headquarters.",
    affectedNodeIds: ["n-single-vpn", "w-dx"],
    naiveConsequence: {
      statusText: "COMPLETE HEADQUARTERS ISOLATION",
      errorRate: "100% Inability to Reach Cloud Workloads",
      latency: "Infinite (Connection Dropped)",
      downtime: "6+ Hours awaiting telecom technician",
      narrative: "The single unmanaged internet VPN tunnel drops. On-prem engineering, accounting, and logistics systems completely lose connection to AWS cloud workloads."
    },
    wellArchConsequence: {
      statusText: "BGP AUTOMATIC FAILOVER TO ENCRYPTED VPN",
      errorRate: "Zero Disrupted Sessions",
      latency: "Slight increase (12ms -> 38ms)",
      failoverTime: "3.2 Seconds (BGP Keepalive)",
      narrative: "BGP router detects Direct Connect loss in 3 seconds. Traffic routes seamlessly through the backup IPsec VPN tunnel into Transit Gateway. End users experience zero interruption."
    }
  },
  speakerNotes: {
    hook: "The biggest networking mistake growing startups make is using VPC Peering until they reach 20 VPCs and their engineers are afraid to touch the routing tables.",
    keyPoints: [
      "AWS Transit Gateway turns an exponential routing nightmare into a simple hub-and-spoke model.",
      "Transitive routing is the superpower of TGW that VPC Peering physically cannot provide.",
      "Direct Connect must always be paired with a redundant Direct Connect circuit or an automated BGP IPsec VPN backup for SLA reliability."
    ],
    architectTip: "Enable Equal-Cost Multi-Path (ECMP) on Transit Gateway to aggregate throughput across multiple VPN tunnels up to 50 Gbps.",
    examQuestion: "A company has 20 VPCs and needs to enable communication between all of them while centralizing outbound internet egress. What is the most operationally efficient architecture? (Answer: AWS Transit Gateway with a centralized egress VPC)."
  }
};

// src/data/domains/security.ts
var securityDomain = {
  id: "securing-applications",
  number: 7,
  title: "Securing Applications & Data Access",
  subtitle: "IAM Roles (STS), AWS Secrets Manager, KMS CMK, & AWS WAF vs. Root Keys & Hardcoded Secrets",
  category: "Security & Governance",
  pillars: ["Security", "Operational Excellence", "Reliability"],
  customerRequirement: {
    clientName: "SafeVault Identity & FinTech",
    businessGoal: "Zero Trust architecture protecting customer PII and API endpoints against OWASP Top 10 vulnerabilities, unauthorized privilege escalation, and credential theft.",
    challenges: [
      "Prevent credential leaks from developers pushing access keys to GitHub",
      "Protect APIs against automated SQL injection and credential stuffing bots",
      "Automate database password rotation without taking applications offline"
    ],
    budgetOrSlaTarget: "Zero Hardcoded Secrets | 100% OWASP Mitigation at Edge | Automated 30-Day Rotation"
  },
  normalPrescription: {
    title: "Permanent IAM Access Keys & Hardcoded Root Secrets in App Code",
    prescribedServices: "Permanent AKIA IAM access keys, plain-text environment variables, root account login",
    whyItSeemsLogical: "Avoids having to configure IAM roles, STS tokens, or external secret stores during initial development.",
    whyItFailsInProduction: [
      "Hardcoded access keys in code repositories lead to automated credential theft and cryptojacking",
      "No Web Application Firewall: SQL injection queries directly execute against databases",
      "Passwords never rotated because changing them requires redeploying the application"
    ]
  },
  wafTransformationSummary: "WAF enforces IAM Roles with temporary STS tokens, AWS Secrets Manager for automated 30-day credential rotation, AWS KMS envelope encryption, and AWS WAF with Managed Rule sets at the edge.",
  naive: {
    name: "Hardcoded Root Keys, Static Passwords & No WAF",
    tagline: "Permanent AKIA keys committed to GitHub with wide-open root privileges",
    description: "Application code contains hardcoded AWS IAM access keys with AdministratorAccess. Database credentials are plain text environment variables. Port 22 is open to the internet. There is no Web Application Firewall to shield HTTP endpoints from common web exploits.",
    bulletPoints: [
      "Hardcoded permanent IAM credentials in git repo: zero key rotation or expiry",
      "AdministratorAccess policy granted indiscriminately to developers and machines",
      "Plain text database passwords stored directly in configuration files",
      "No Web Application Firewall (WAF): vulnerable to SQL injection, XSS, and layer 7 DDoS"
    ],
    nodes: [
      { id: "n-hacker", name: "Malicious Attacker", type: "client", service: "Dark Web Botnet", tier: "edge", status: "degraded" },
      { id: "n-app-vuln", name: "App with Hardcoded Keys", type: "compute", service: "EC2 with AKIA... in config.json", tier: "public", isSPOF: true, status: "healthy", description: "Hardcoded root secrets in application bundle" },
      { id: "n-db-raw", name: "Database (Cleartext Password)", type: "database", service: "DB with root/password123", tier: "public", isSPOF: true, status: "healthy" }
    ],
    connections: [
      { from: "n-hacker", to: "n-app-vuln", label: "SQL Injection / XSS Ingress", type: "sync" },
      { from: "n-app-vuln", to: "n-db-raw", label: "Cleartext Unencrypted Wire", type: "sync" }
    ],
    monthlyCostEst: 0,
    availabilitySLA: "Security Compromised",
    rto: "Forensic Investigation Days",
    rpo: "Total Data Breach",
    scores: {
      operationalExcellence: 15,
      security: 5,
      reliability: 25,
      performanceEfficiency: 50,
      costOptimization: 80,
      sustainability: 50
    },
    iacSnippet: {
      language: "hcl",
      filename: "anti_pattern_security.tf",
      code: `# ANTI-PATTERN: Wildcard Administrator Access & Hardcoded Credentials
resource "aws_iam_user_policy" "wildcard_admin" {
  name = "god_mode_policy"
  user = "app_deployer"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = "*" # Over-privileged God Mode!
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}

# Static access keys that never expire:
resource "aws_iam_access_key" "permanent_key" {
  user = "app_deployer" # Downloaded to developer laptops
}`,
      notes: 'Wildcard Action="*" and Resource="*" grants full administrative control over the entire AWS account with permanent credentials.'
    }
  },
  wellArch: {
    name: "IAM Roles (Temporary STS), Secrets Manager, KMS CMK & AWS WAF",
    tagline: "Zero hardcoded secrets, automated 30-day rotation, and Edge WAF inspection",
    description: "Zero Trust architectural posture. EC2/ECS instances assume temporary STS credentials via IAM Instance Profiles with strict Least Privilege policies. Database credentials rotate automatically every 30 days via AWS Secrets Manager and Lambda. AWS WAF blocks OWASP Top 10 exploits at the edge, and AWS KMS Customer Managed Keys provide envelope encryption.",
    bulletPoints: [
      "Zero static credentials: IAM Roles deliver temporary 1-hour credentials via STS",
      "AWS Secrets Manager automatically rotates database credentials every 30 days without downtime",
      "AWS WAF Managed Rules actively inspect and block SQL Injection, XSS, and malicious scrapers",
      "Envelope encryption with KMS Customer Managed Keys (CMK) featuring cryptographic auditing in CloudTrail"
    ],
    nodes: [
      { id: "w-waf", name: "AWS WAF (OWASP Managed Rules)", type: "waf", service: "AWS WAF + Shield Standard", tier: "edge", isSPOF: false, status: "healthy", description: "Blocks SQLi, XSS, and rate limits bad actors" },
      { id: "w-iam-role", name: "IAM Role (Least Privilege STS)", type: "security", service: "Instance Profile (No hardcoded keys)", tier: "cloud", isSPOF: false, status: "healthy" },
      { id: "w-sec-mgr", name: "AWS Secrets Manager", type: "security", service: "Automated 30-Day Rotation Engine", tier: "cloud", isSPOF: false, status: "healthy", description: "Lambda auto-rotates database passwords" },
      { id: "w-kms", name: "AWS KMS (Customer Managed Key)", type: "security", service: "Envelope Encryption CMK", tier: "cloud", isSPOF: false, status: "healthy", description: "Audited in CloudTrail" },
      { id: "w-guardduty", name: "Amazon GuardDuty", type: "security", service: "ML Threat Detection Engine", tier: "cloud", isSPOF: false, status: "healthy", description: "Continuous VPC Flow & CloudTrail anomaly scanning" }
    ],
    connections: [
      { from: "w-waf", to: "w-iam-role", label: "Sanitized Clean Traffic", type: "sync" },
      { from: "w-iam-role", to: "w-sec-mgr", label: "Encrypted Credential Fetch", type: "sync" },
      { from: "w-sec-mgr", to: "w-kms", label: "Envelope Decrypt CMK", type: "sync" },
      { from: "w-iam-role", to: "w-guardduty", label: "Continuous Telemetry Stream", type: "async" }
    ],
    monthlyCostEst: 68,
    availabilitySLA: "99.99%",
    rto: "Instant Threat Neutralization",
    rpo: "Zero Exposure",
    scores: {
      operationalExcellence: 96,
      security: 99,
      reliability: 96,
      performanceEfficiency: 92,
      costOptimization: 88,
      sustainability: 90
    },
    iacSnippet: {
      language: "hcl",
      filename: "well_architected_security.tf",
      code: `# WELL-ARCHITECTED: Least Privilege IAM Role, Secrets Manager & WAF
resource "aws_iam_role" "app_role" {
  name = "app-least-privilege-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
}

resource "aws_wafv2_web_acl" "edge_shield" {
  name        = "production-edge-waf"
  scope       = "REGIONAL"
  default_action { allow {} }

  rule {
    name     = "AWSManagedRulesSQLiRuleSet"
    priority = 1
    override_action { none {} }
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesSQLiRuleSet"
        vendor_name = "AWS"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "WAF-SQLi-Blocks"
      sampled_requests_enabled   = true
    }
  }
}`,
      notes: "No long-term credentials anywhere. Web ACL blocks OWASP exploits before they ever reach application compute."
    }
  },
  metrics: [
    { label: "Static Credential Exposure", naiveValue: "100% (Hardcoded in Git/VM)", wellArchValue: "0% (Temporary STS Tokens)", impact: "positive", explanation: "Eliminates permanent credentials that can be leaked or stolen." },
    { label: "Credential Rotation Cadence", naiveValue: "Never (Until Breached)", wellArchValue: "Automated Every 30 Days (Zero Downtime)", impact: "positive", explanation: "AWS Secrets Manager automates password rotation via Lambda." },
    { label: "OWASP Exploit Protection", naiveValue: "0% (No WAF Inspection)", wellArchValue: "100% Managed WAF Rule Sets", impact: "positive", explanation: "SQLi, XSS, and malicious bot scraping blocked at the CDN/ALB edge." },
    { label: "Data Encryption Standard", naiveValue: "Cleartext / Unaudited Keys", wellArchValue: "KMS Envelope Encryption CMK", impact: "positive", explanation: "All data at rest is encrypted with customer-managed keys audited in CloudTrail." }
  ],
  chaos: {
    id: "chaos-security",
    title: "SQL Injection Attack & Stolen Access Key Exploit",
    triggerLabel: "Simulate SQLi Attack & Stolen Key Exploit",
    description: "An attacker attempts to inject ' OR 1=1 -- into customer search inputs while using a stolen access key to download S3 data.",
    affectedNodeIds: ["n-app-vuln", "w-waf", "w-guardduty"],
    naiveConsequence: {
      statusText: "MASSIVE DATA BREACH & REPUTATIONAL DISASTER",
      errorRate: "100% of User Data Dumped",
      latency: "N/A",
      downtime: "Subpoena & Emergency Shutdown",
      narrative: "SQL injection bypasses auth, exposing 500,000 credit card records. The stolen permanent IAM key is used to spin up unauthorized GPU crypto mining instances."
    },
    wellArchConsequence: {
      statusText: "EXPLOIT BLOCKED AT EDGE: HTTP 403 FORBIDDEN",
      errorRate: "0% Legitimate Impact",
      latency: "< 15ms",
      failoverTime: "Instant (Edge Rejection)",
      narrative: "AWS WAF matches the SQLi pattern and drops the request with HTTP 403 Forbidden. GuardDuty detects anomalous API attempts and triggers automated IAM quarantine via EventBridge."
    }
  },
  speakerNotes: {
    hook: "In the cloud, identity is the new network perimeter. If you are using permanent IAM access keys in production, you are failing the AWS Security Pillar on day one.",
    keyPoints: [
      "Always use IAM Roles with STS temporary credentials instead of long-lived access keys.",
      "AWS Secrets Manager takes the human factor out of database password rotation.",
      "AWS WAF provides immediate perimeter defense against zero-day vulnerabilities like Log4j and OWASP Top 10."
    ],
    architectTip: "Enforce AWS Organizations Service Control Policies (SCPs) to deny the creation of access keys in production accounts altogether.",
    examQuestion: "A company needs to store database credentials securely and rotate them automatically without modifying application code. What service should they use? (Answer: AWS Secrets Manager with automatic rotation enabled)."
  }
};

// src/data/domains/monitoring.ts
var monitoringDomain = {
  id: "monitoring-elasticity",
  number: 8,
  title: "Monitoring, Elasticity & High Availability",
  subtitle: "CloudWatch Synthetics, Composite Alarms, & EventBridge Self-Healing vs. Silent Failures",
  category: "Operations & Reliability",
  pillars: ["Operational Excellence", "Reliability", "Performance Efficiency"],
  customerRequirement: {
    clientName: "AeroBank Online Operations",
    businessGoal: "Achieve 99.99% availability for 2 million active banking customers with autonomous anomaly detection and self-healing.",
    challenges: [
      "Engineers find out about outages only when users post on social media",
      "Individual metric alarms cause pager fatigue and false alarms",
      "Debugging distributed microservice latency takes hours of log grepping"
    ],
    budgetOrSlaTarget: "MTTD < 15 seconds | MTTR < 45 seconds | Zero Alert Fatigue"
  },
  normalPrescription: {
    title: "Basic 5-Minute CloudWatch Metrics & Manual SSH Terminal Logging",
    prescribedServices: "Default EC2 metrics (5-min intervals) with engineers running tail -f /var/log/syslog",
    whyItSeemsLogical: "Saves a few dollars on CloudWatch custom metrics and detailed monitoring.",
    whyItFailsInProduction: [
      "5-minute metrics mean outages persist for 15+ minutes before basic thresholds trip",
      "No synthetic user transaction testing: APIs fail silently while server CPU looks normal",
      "Manual remediation requires waking engineers up at night, prolonging MTTR to hours"
    ]
  },
  wafTransformationSummary: "WAF deploys CloudWatch Synthetics canaries running 24/7, Composite Alarms to eliminate noise, AWS X-Ray for distributed tracing, and EventBridge rules triggering automated Lambda self-healing.",
  naive: {
    name: "Zero Telemetry & Manual SSH `tail -f` Log Debugging",
    tagline: "Outages discovered only when customers complain on social media",
    description: "No centralized logging or performance metrics. When servers slow down, engineers SSH into individual instances to run `top` and `grep /var/log/nginx/error.log`. Outages linger for hours undetected because there are no synthetic canaries or automated alerts.",
    bulletPoints: [
      "Zero proactive alerting: Mean Time to Detect (MTTD) exceeds 45 minutes",
      "Engineers debug via risky interactive SSH sessions on live production instances",
      "No correlation between frontend latency, backend microservices, and database queries",
      "Manual remediation: requires waking engineers up at night to restart hung processes"
    ],
    nodes: [
      { id: "n-unmonitored-srv", name: "Unmonitored EC2 Instance", type: "compute", service: "Amazon EC2 (Silent Crash)", tier: "public", isSPOF: true, status: "healthy", description: "No CloudWatch agent installed" },
      { id: "n-angry-user", name: "Angry Customers on Twitter", type: "client", service: "Social Media Complaints", tier: "edge", status: "degraded", description: "De facto monitoring system" },
      { id: "n-ssh-dev", name: "Manual SSH Terminal", type: "compute", service: "Engineer running tail -f", tier: "edge", status: "healthy" }
    ],
    connections: [
      { from: "n-unmonitored-srv", to: "n-angry-user", label: "HTTP 500 Silent Failures", type: "sync" },
      { from: "n-ssh-dev", to: "n-unmonitored-srv", label: "Emergency SSH Triage", type: "sync" }
    ],
    monthlyCostEst: 0,
    availabilitySLA: "97.5%",
    rto: "2 - 4 Hours",
    rpo: "Unbounded Telemetry Void",
    scores: {
      operationalExcellence: 10,
      security: 30,
      reliability: 20,
      performanceEfficiency: 35,
      costOptimization: 75,
      sustainability: 40
    },
    iacSnippet: {
      language: "hcl",
      filename: "anti_pattern_monitoring.tf",
      code: `# ANTI-PATTERN: No CloudWatch alarms, no metrics, no canaries
resource "aws_instance" "blind_node" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.medium"
  # monitoring is false by default (basic 5-min intervals)
  monitoring    = false
  # No CloudWatch Agent installed via SSM
  # No composite alarms configured!
}`,
      notes: "Basic 5-minute metric resolution is too slow for production SLAs. No log centralization or synthetic monitoring."
    }
  },
  wellArch: {
    name: "CloudWatch Synthetics, Composite Alarms, X-Ray & EventBridge Auto-Healing",
    tagline: "Sub-minute anomaly detection, distributed tracing, and automated self-healing",
    description: "Autonomous operational observability. CloudWatch Synthetics canaries simulate end-user transactions 24/7 across multiple regions. Composite Alarms combine CPU, memory, and p99 latency to eliminate alert fatigue. AWS X-Ray traces distributed microservice hops. EventBridge listens to threshold breaches and triggers automated Lambda remediation.",
    bulletPoints: [
      "CloudWatch Synthetics canaries detect user-facing regressions before customers notice",
      "CloudWatch Composite Alarms combine multiple signals to eliminate alert noise and pager fatigue",
      "AWS X-Ray distributed tracing isolates database query bottlenecks down to the exact millisecond",
      "EventBridge automatically triggers Lambda self-healing scripts (restarting unhealthy containers, cycling tasks)"
    ],
    nodes: [
      { id: "w-synthetic", name: "CloudWatch Synthetics Canary", type: "analytics", service: "Puppeteer Browser Canaries (24/7)", tier: "edge", isSPOF: false, status: "healthy", description: "Simulates checkout flow every 60s" },
      { id: "w-composite", name: "CloudWatch Composite Alarms", type: "analytics", service: "Multi-Metric Logic Gate Alarm", tier: "cloud", isSPOF: false, status: "healthy", description: "Latency > 500ms AND ErrorRate > 2%" },
      { id: "w-xray", name: "AWS X-Ray Distributed Tracing", type: "analytics", service: "End-to-End Latency Trace Map", tier: "cloud", isSPOF: false, status: "healthy" },
      { id: "w-eventbridge", name: "Amazon EventBridge Rule", type: "queue", service: "Event Router for Alarms", tier: "cloud", isSPOF: false, status: "healthy" },
      { id: "w-selfheal", name: "Self-Healing Lambda Function", type: "compute", service: "AWS Lambda Auto-Remediation", tier: "cloud", isSPOF: false, status: "healthy", description: "Graceful blue/green task recycle" }
    ],
    connections: [
      { from: "w-synthetic", to: "w-composite", label: "Continuous Telemetry Feed", type: "sync" },
      { from: "w-composite", to: "w-eventbridge", label: "Alarm State Change Event", type: "async" },
      { from: "w-eventbridge", to: "w-selfheal", label: "Target Invocation", type: "async" },
      { from: "w-xray", to: "w-composite", label: "Trace Metric Filter", type: "sync" }
    ],
    monthlyCostEst: 54,
    availabilitySLA: "99.99%",
    rto: "< 45 Seconds (Autonomous)",
    rpo: "Continuous Metrics Stream",
    scores: {
      operationalExcellence: 98,
      security: 92,
      reliability: 98,
      performanceEfficiency: 95,
      costOptimization: 85,
      sustainability: 90
    },
    iacSnippet: {
      language: "hcl",
      filename: "well_architected_monitoring.tf",
      code: `# WELL-ARCHITECTED: Composite Alarms and EventBridge Automated Remediation
resource "aws_cloudwatch_composite_alarm" "high_severity_outage" {
  alarm_name        = "HighSeverityCheckoutDegradation"
  alarm_description = "Fires only when Canaries fail AND Backend latency exceeds 500ms"

  alarm_rule = "ALARM(\${aws_cloudwatch_metric_alarm.canary_failure.alarm_name}) AND ALARM(\${aws_cloudwatch_metric_alarm.api_p99_latency.alarm_name})"
  alarm_actions = [aws_sns_topic.pagerduty.arn, aws_cloudwatch_event_rule.self_heal.arn]
}

resource "aws_cloudwatch_event_rule" "self_heal" {
  name        = "trigger-auto-healing-lambda"
  event_pattern = jsonencode({
    source      = ["aws.cloudwatch"],
    detail_type = ["CloudWatch Alarm State Change"],
    detail      = { state = { value = ["ALARM"] } }
  })
}`,
      notes: "Composite alarms prevent false positives. EventBridge triggers remediation instantly without waiting for human intervention."
    }
  },
  metrics: [
    { label: "Mean Time to Detect (MTTD)", naiveValue: "45+ Minutes (Customer complaints)", wellArchValue: "< 15 Seconds (Synthetics + Alarms)", impact: "positive", explanation: "Automated synthetic canaries run continuous browser checks." },
    { label: "Mean Time to Remediate (MTTR)", naiveValue: "2 to 4 Hours (Manual SSH)", wellArchValue: "< 45 Seconds (Autonomous Lambda)", impact: "positive", explanation: "EventBridge initiates container task replacement immediately." },
    { label: "Distributed Trace Visibility", naiveValue: "0% (Black Box)", wellArchValue: "100% (AWS X-Ray Waterfall)", impact: "positive", explanation: "Every request traced from browser to database query." },
    { label: "Alert Noise / False Positives", naiveValue: "Frequent or Ignored", wellArchValue: "< 2% (Composite Alarms Filtered)", impact: "positive", explanation: "Composite alarms require multiple correlating factors before alerting." }
  ],
  chaos: {
    id: "chaos-monitoring",
    title: "Silent Memory Leak Causing Cascading API Hangs",
    triggerLabel: "Inject Silent Application Memory Leak",
    description: "A bad deployment introduces a memory leak in the core API, pushing heap usage to 98% and freezing worker threads.",
    affectedNodeIds: ["n-unmonitored-srv", "w-composite", "w-selfheal"],
    naiveConsequence: {
      statusText: "PROTRACTED SILENT OUTAGE",
      errorRate: "85% Timeout Rate",
      latency: "> 15,000ms",
      downtime: "Hours until someone notices Twitter rage",
      narrative: "No alerts fire because basic CPU utilization looks normal. Customers abandon carts in droves. Operations team spends hours guessing which instance is stuck."
    },
    wellArchConsequence: {
      statusText: "AUTONOMOUS HEALING IN 38 SECONDS",
      errorRate: "0.05% Transient",
      latency: "24ms post-heal",
      failoverTime: "38 Seconds (Zero Pager Escalation)",
      narrative: "Synthetic canary spots checkout timeout. Composite alarm triggers EventBridge. Lambda initiates rolling task recycling to clean state. Incident remediated before engineers wake up."
    }
  },
  speakerNotes: {
    hook: "If your users are the first ones to tell you your site is down, you do not have an architecture\u2014you have an accidental service.",
    keyPoints: [
      "CloudWatch Synthetics test the actual user experience, not just server ping or CPU.",
      "Composite alarms prevent alert fatigue by requiring multiple symptoms before triggering pagers.",
      "Close the loop by connecting alarms to EventBridge for automated self-healing."
    ],
    architectTip: "Embed AWS X-Ray SDK in your backend clients to generate real-time service maps showing hidden latency bottlenecks.",
    examQuestion: "A company needs to reduce alert fatigue by triggering notifications only when both CPU utilization exceeds 85% and the error rate exceeds 5%. Which AWS feature supports this? (Answer: Amazon CloudWatch Composite Alarms)."
  }
};

// src/data/domains/automation.ts
var automationDomain = {
  id: "automating-architecture",
  number: 9,
  title: "Automating the Architecture",
  subtitle: '100% Terraform/CDK GitOps with Drift Detection vs. Manual "ClickOps" Console Changes',
  category: "Operations & Reliability",
  pillars: ["Operational Excellence", "Security", "Reliability"],
  customerRequirement: {
    clientName: "CloudScale Global SaaS",
    businessGoal: "Standardize cloud environments across production, staging, and disaster recovery with 100% reproducible Infrastructure as Code and automated drift detection.",
    challenges: [
      "Configuration drift between staging and production causes unexpected deployment crashes",
      "Manual changes made in the AWS console leave undocumented security holes",
      "Rebuilding the entire infrastructure after a disaster takes days of guesswork"
    ],
    budgetOrSlaTarget: "100% IaC Versioned | Drift Detected & Reverted < 60s | Full Rebuild < 15m"
  },
  normalPrescription: {
    title: 'Manual "ClickOps" Provisioning via AWS Management Console',
    prescribedServices: "Engineers manually click buttons in the AWS Console to launch servers, VPCs, and SGs",
    whyItSeemsLogical: "Intuitive graphical interface allows launching infrastructure without learning Terraform or CloudFormation.",
    whyItFailsInProduction: [
      "Zero version control or peer review: anyone with console access can make breaking changes",
      "Snowflake environments: staging and production differ in subtle, undocumented ways",
      "Disaster recovery requires manual recreation from memory, taking days"
    ]
  },
  wafTransformationSummary: "WAF mandates 100% declarative IaC via Terraform/AWS CDK in GitOps pipelines, paired with AWS Config rules that continuously detect drift and trigger Systems Manager automated rollbacks.",
  naive: {
    name: 'Manual "ClickOps" in AWS Console with Snowflake Drift',
    tagline: "Ad-hoc console clicks, undocumented ports, and un-reproducible staging",
    description: "Infrastructure is provisioned by hand through the AWS Management Console. Staging and production environments have subtle differing versions, unrecorded security group changes, and manual SSH patch work. When disaster strikes, no one knows how to rebuild the environment.",
    bulletPoints: [
      "Zero version control: changes cannot be code-reviewed, tested, or rolled back",
      "Configuration drift: staging does not match production, causing deployment failures",
      "Undocumented security modifications left permanently active by tired developers",
      "Disaster recovery requires days of guesswork reading fragmented wiki notes"
    ],
    nodes: [
      { id: "n-dev-click", name: "Developer in AWS Console", type: "client", service: "Manual Web Browser Sessions", tier: "edge", status: "healthy", description: "Clicking buttons in AWS Management Console" },
      { id: "n-snowflake-prod", name: "Snowflake Production VPC", type: "network", service: "Manually Configured Infrastructure", tier: "cloud", isSPOF: true, status: "healthy", description: "Nobody knows the full configuration state" },
      { id: "n-drifted-sg", name: "Drifted Security Group", type: "security", service: "Manually Opened Ports (SSH/DB)", tier: "cloud", isSPOF: true, status: "degraded" }
    ],
    connections: [
      { from: "n-dev-click", to: "n-snowflake-prod", label: "Manual Console Modifications", type: "sync" },
      { from: "n-snowflake-prod", to: "n-drifted-sg", label: "Undocumented State Drift", type: "sync" }
    ],
    monthlyCostEst: 0,
    availabilitySLA: "Human Error Prone",
    rto: "Days to Reconstruct",
    rpo: "Lost Configuration State",
    scores: {
      operationalExcellence: 12,
      security: 25,
      reliability: 30,
      performanceEfficiency: 40,
      costOptimization: 45,
      sustainability: 40
    },
    iacSnippet: {
      language: "hcl",
      filename: "anti_pattern_clickops.txt",
      code: `# ANTI-PATTERN: "ClickOps" - NO CODE EXISTS!
#
# Steps taken by engineers last year:
# 1. Logged into AWS Console using root credentials
# 2. Clicked "Launch Instance" -> clicked Next 10 times
# 3. Manually added SG rule allowing port 8080 and 22
# 4. Forgot to document which AMI was used
# 5. Staging environment created 6 months later with different kernel
# RESULT: Zero reproducibility, zero audit log, massive drift!`,
      notes: "No IaC exists. Disaster recovery means re-clicking through hundreds of AWS console menus."
    }
  },
  wellArch: {
    name: "100% Infrastructure as Code (IaC) with GitOps CI/CD & Drift Detection",
    tagline: "Terraform/CDK pipelines, automated security scanning, and AWS Config self-rollback",
    description: "Deterministic infrastructure automation. All AWS resources are declared in modular Terraform/CDK and managed via Git pull requests. Pre-commit hooks run Checkov security analysis. AWS CodePipeline automatically runs `plan` and `apply`. AWS Config continuously scans for configuration drift and triggers automated remediation if manual changes occur.",
    bulletPoints: [
      "Declarative code: every VPC, route, and IAM policy is version-controlled and peer-reviewed",
      "Automated security scanning via Checkov and tfsec blocks insecure code before deployment",
      "AWS Config rules monitor resources and automatically remediate unauthorized drift",
      "Complete disaster reconstruction: spin up an entire production region in 15 minutes"
    ],
    nodes: [
      { id: "w-git-pr", name: "Git Repo (Pull Request)", type: "client", service: "GitHub / CodeCommit", tier: "edge", status: "healthy", description: "Peer reviewed code changes" },
      { id: "w-cicd-pipeline", name: "AWS CodePipeline / CI Runner", type: "compute", service: "Checkov + Terraform Plan/Apply", tier: "cloud", isSPOF: false, status: "healthy" },
      { id: "w-iac-vpc", name: "Immutable Multi-AZ VPC", type: "network", service: "Deterministic IaC Environment", tier: "cloud", isSPOF: false, status: "healthy" },
      { id: "w-aws-config", name: "AWS Config Drift Detector", type: "security", service: "Continuous Compliance Rules", tier: "cloud", isSPOF: false, status: "healthy", description: "Detects unauthorized console clicks" },
      { id: "w-ssm-auto", name: "SSM Remediation Playbook", type: "compute", service: "Automated Drift Rollback", tier: "cloud", isSPOF: false, status: "healthy" }
    ],
    connections: [
      { from: "w-git-pr", to: "w-cicd-pipeline", label: "PR Automated Test & Scan", type: "sync" },
      { from: "w-cicd-pipeline", to: "w-iac-vpc", label: "Terraform Apply (Zero Downtime)", type: "sync" },
      { from: "w-aws-config", to: "w-ssm-auto", label: "Non-Compliant Drift Alert", type: "async" },
      { from: "w-ssm-auto", to: "w-iac-vpc", label: "Auto-Revert Unauthorized Change", type: "sync" }
    ],
    monthlyCostEst: 28,
    availabilitySLA: "99.99%",
    rto: "< 15 Minutes (Full Region Rebuild)",
    rpo: "100% Versioned State",
    scores: {
      operationalExcellence: 99,
      security: 96,
      reliability: 96,
      performanceEfficiency: 90,
      costOptimization: 92,
      sustainability: 92
    },
    iacSnippet: {
      language: "hcl",
      filename: "well_architected_automation.tf",
      code: `# WELL-ARCHITECTED: AWS Config Rule with Automated Remediation
resource "aws_config_config_rule" "deny_public_ssh" {
  name        = "restricted-ssh-ingress"
  description = "Checks whether security groups permit unrestricted incoming SSH"

  source {
    owner             = "AWS"
    source_identifier = "INCOMING_SSH_DISABLED"
  }
}

resource "aws_config_remediation_configuration" "auto_close_ssh" {
  config_rule_name = aws_config_config_rule.deny_public_ssh.name
  target_type      = "SSM_DOCUMENT"
  target_id        = "AWS-DisableIncomingSSHOnPort22"
  target_version   = "1"
  automatic        = true # Automatically closes rogue ports within 60 seconds!

  parameter {
    name         = "SecurityGroupId"
    resource_value = "RESOURCE_ID"
  }
}`,
      notes: "AWS Config catches unauthorized console edits and uses Systems Manager to automatically revert security groups to their compliant state."
    }
  },
  metrics: [
    { label: "Environment Reproduction Speed", naiveValue: "3 to 5 Days (Manual Guesswork)", wellArchValue: "< 15 Minutes (1-Click Terraform Apply)", impact: "positive", explanation: "Entire infrastructure can be redeployed into any region in minutes." },
    { label: "Configuration Drift Frequency", naiveValue: "Continuous & Uncontrolled", wellArchValue: "Zero (Continuous Config Remediation)", impact: "positive", explanation: "AWS Config alerts and auto-reverts manual out-of-band changes." },
    { label: "Deployment Failure Rate", naiveValue: "High (Differences between environments)", wellArchValue: "< 0.5% (Pre-tested IaC Pipelines)", impact: "positive", explanation: "Staging and production share identical, parameter-driven code." },
    { label: "Audit & Compliance Proof", naiveValue: "Manual screenshots and hope", wellArchValue: "100% Git Commit Log & CloudTrail", impact: "positive", explanation: "Every change is tied to a specific developer PR and cryptographic commit." }
  ],
  chaos: {
    id: "chaos-automation",
    title: "Rogue Engineer Manually Opens Port 22 in Console",
    triggerLabel: "Simulate Manual Console Port Exposure",
    description: "An engineer debugs an issue after hours, opens port 22 to 0.0.0.0/0 in the AWS console, and forgets to remove it.",
    affectedNodeIds: ["n-drifted-sg", "w-aws-config", "w-ssm-auto"],
    naiveConsequence: {
      statusText: "PERMANENT EXPOSURE TO BOTNET EXPLOITS",
      errorRate: "Security vulnerability score critical",
      latency: "N/A",
      downtime: "Undetected for months until security audit",
      narrative: "Port 22 stays open permanently. Internet botnets discover it within hours and launch automated credential stuffing attacks against production instances."
    },
    wellArchConsequence: {
      statusText: "AUTOMATIC DRIFT DETECTED & REVERTED IN 42s",
      errorRate: "0% Impact",
      latency: "N/A",
      failoverTime: "42 Seconds to Auto-Remediation",
      narrative: "AWS Config flags the non-compliant security group within 30 seconds. Systems Manager Automation triggers immediately, strips the 0.0.0.0/0 rule, and sends a Slack alert to the security team."
    }
  },
  speakerNotes: {
    hook: "If you build your infrastructure using ClickOps in the AWS console, you do not own your infrastructure\u2014you are renting a set of temporary accidents.",
    keyPoints: [
      "Infrastructure as Code (IaC) is the bedrock of Pillar 1: Operational Excellence.",
      "AWS Config rules combined with Systems Manager provide automated guardrails against human error.",
      "With modular Terraform or AWS CDK, spinning up a Disaster Recovery region takes minutes instead of days."
    ],
    architectTip: "Remove write permissions to the AWS Console in production for everyone except CI/CD service roles.",
    examQuestion: "A company needs to detect and automatically remediate security group configurations that allow unrestricted SSH access. What is the most effective approach? (Answer: AWS Config rule with an automated AWS Systems Manager remediation document)."
  }
};

// src/data/domains/caching.ts
var cachingDomain = {
  id: "caching-content",
  number: 10,
  title: "Caching Content",
  subtitle: "CloudFront Edge Caching & ElastiCache Redis vs. Direct Origin & Database Overload",
  category: "Performance & Scale",
  pillars: ["Performance Efficiency", "Cost Optimization", "Reliability"],
  customerRequirement: {
    clientName: "StreamByte Global Media",
    businessGoal: "Deliver video catalogs, streaming metadata, and image assets to 10 million global viewers with sub-20ms latency and minimal origin database load.",
    challenges: [
      "Global viewers experience 800ms+ latency traversing transatlantic network routes",
      "Repetitive database queries for popular movies push database CPU to 98%",
      "Origin servers collapse during viral show releases"
    ],
    budgetOrSlaTarget: "95%+ Cache Hit Ratio | Sub-20ms Global Latency | Database CPU < 15%"
  },
  normalPrescription: {
    title: "Direct Origin Hits with No Content Delivery Network",
    prescribedServices: "Direct Route 53 A-record pointing to origin EC2 instance and RDS database",
    whyItSeemsLogical: "Avoids setting up CloudFront distributions or Redis clusters during early MVP development.",
    whyItFailsInProduction: [
      "Origin servers spend 85% of CPU cycles serving static images and CSS",
      "Database connection pools exhaust instantly during traffic spikes, throwing 500 errors",
      "International users suffer severe latency and slow buffering"
    ]
  },
  wafTransformationSummary: "WAF introduces Amazon CloudFront edge caching with Origin Access Control (OAC) across 600+ PoPs, alongside an Amazon ElastiCache (Redis) cluster, absorbing 96% of traffic with sub-15ms response times.",
  naive: {
    name: "Zero Caching: Direct Database & Web Origin Hammering",
    tagline: "Every static image, stylesheet, and repetitive SQL query hits origin DB directly",
    description: "No Content Delivery Network (CDN) or in-memory caching layer. Every incoming visitor request for homepage images, product catalog listings, and user authentication tokens triggers direct disk I/O and SQL queries on the primary database.",
    bulletPoints: [
      "Origin web servers spend 80% of CPU cycles serving static CSS, JS, and image files",
      "Identical database queries (e.g., top 10 products) executed tens of thousands of times per minute",
      "Global users suffer high network latency (400ms - 900ms) traversing transatlantic hops",
      "Database connection pool exhausts during traffic surges, taking down the entire website"
    ],
    nodes: [
      { id: "n-cache-users", name: "Global Website Visitors", type: "client", service: "Users Worldwide", tier: "edge", status: "healthy" },
      { id: "n-origin-srv", name: "Uncached Origin Server", type: "compute", service: "Apache / Nginx EC2 (Overwhelmed)", tier: "public", isSPOF: true, status: "healthy", description: "Serving both static assets & APIs" },
      { id: "n-origin-db", name: "Primary SQL Database", type: "database", service: "Overloaded Database (100% CPU)", tier: "public", isSPOF: true, status: "healthy", description: "Hammered by repetitive queries" }
    ],
    connections: [
      { from: "n-cache-users", to: "n-origin-srv", label: "Slow Transatlantic HTTP/1.1", type: "sync" },
      { from: "n-origin-srv", to: "n-origin-db", label: "Repetitive SQL Selects", type: "sync" }
    ],
    monthlyCostEst: 490,
    availabilitySLA: "98.5%",
    rto: "45 Minutes",
    rpo: "Connection Pool Lock",
    scores: {
      operationalExcellence: 30,
      security: 45,
      reliability: 25,
      performanceEfficiency: 15,
      costOptimization: 30,
      sustainability: 35
    },
    iacSnippet: {
      language: "hcl",
      filename: "anti_pattern_caching.tf",
      code: `# ANTI-PATTERN: No CloudFront CDN, no Redis, direct origin routing
resource "aws_route53_record" "naked_domain" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = "example.com"
  type    = "A"
  ttl     = 300
  records = [aws_instance.single_origin.public_ip]
  # Direct A-record pointing directly to EC2 public IP!
  # No CDN edge POPs, no TLS termination at the edge!
}`,
      notes: "Lacks CloudFront edge caching, causing origin servers and databases to absorb 100% of traffic directly."
    }
  },
  wellArch: {
    name: "Multi-Tier Edge & In-Memory Caching (CloudFront + ElastiCache Redis)",
    tagline: "Amazon CloudFront (600+ PoPs) with sub-15ms edge latency and ElastiCache in-memory Redis",
    description: "Tiered caching architecture. Amazon CloudFront caches static content and API responses at 600+ Points of Presence worldwide with HTTP/3. Dynamic database query results are cached in an Amazon ElastiCache (Redis) cluster using Cache-Aside strategy, offloading 95% of reads from the database.",
    bulletPoints: [
      "CloudFront absorbs 96% of static requests at the edge with sub-15ms latency worldwide",
      "Amazon ElastiCache Redis serves sub-millisecond query responses with automated failover",
      "Database CPU utilization plummets from 95% to under 12%, extending hardware headroom",
      "AWS Shield Standard at CloudFront edge automatically mitigates Layer 3/4 DDoS attacks"
    ],
    nodes: [
      { id: "w-cache-clients", name: "Global Users (Any Device)", type: "client", service: "Global Web & Mobile Users", tier: "edge", status: "healthy" },
      { id: "w-cloudfront", name: "Amazon CloudFront CDN (600+ PoPs)", type: "cdn", service: "Edge Cache + TLS 1.3 + HTTP/3", tier: "edge", isSPOF: false, status: "healthy", description: "96% Cache Hit Ratio at edge" },
      { id: "w-s3-origin", name: "S3 Static Origin (Private OAC)", type: "storage", service: "Amazon S3 via Origin Access Control", tier: "private", isSPOF: false, status: "healthy" },
      { id: "w-redis", name: "Amazon ElastiCache (Redis Cluster)", type: "cache", service: "Multi-AZ In-Memory Cache (< 1ms)", tier: "private", isSPOF: false, status: "healthy", description: "Sub-millisecond query response" },
      { id: "w-app-cached", name: "Application Microservices", type: "compute", service: "Elastic App Layer", tier: "private", isSPOF: false, status: "healthy" },
      { id: "w-aurora-protected", name: "Aurora Database (Protected)", type: "database", service: "Amazon Aurora Multi-AZ", tier: "isolated", isSPOF: false, status: "healthy", description: "CPU under 12% utilization" }
    ],
    connections: [
      { from: "w-cache-clients", to: "w-cloudfront", label: "Anycast DNS Sub-15ms", type: "sync" },
      { from: "w-cloudfront", to: "w-s3-origin", label: "Cache Miss Static (4%)", type: "sync" },
      { from: "w-cloudfront", to: "w-app-cached", label: "Dynamic API Passthrough", type: "sync" },
      { from: "w-app-cached", to: "w-redis", label: "Redis Cache-Aside (< 1ms)", type: "sync" },
      { from: "w-app-cached", to: "w-aurora-protected", label: "Only on Redis Cache Miss (< 5%)", type: "sync" }
    ],
    monthlyCostEst: 165,
    availabilitySLA: "99.99%",
    rto: "Instant (Edge Shielded)",
    rpo: "Zero Exposure",
    scores: {
      operationalExcellence: 94,
      security: 96,
      reliability: 98,
      performanceEfficiency: 99,
      costOptimization: 94,
      sustainability: 95
    },
    iacSnippet: {
      language: "hcl",
      filename: "well_architected_caching.tf",
      code: `# WELL-ARCHITECTED: CloudFront with Origin Access Control (OAC) & ElastiCache
resource "aws_cloudfront_distribution" "cdn" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100"

  origin {
    domain_name              = aws_s3_bucket.static_assets.bucket_regional_domain_name
    origin_id                = "S3-Static-Assets"
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-Static-Assets"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
  }
}`,
      notes: "CloudFront OAC restricts bucket access so only the CDN can read files. Compresses responses and serves worldwide in milliseconds."
    }
  },
  metrics: [
    { label: "Edge Cache Hit Ratio", naiveValue: "0% (Every request hits origin)", wellArchValue: "96.2% (Absorbed at CloudFront)", impact: "positive", explanation: "Static assets and common APIs never touch the origin server." },
    { label: "Global p95 Latency", naiveValue: "850ms (Traverses global WAN)", wellArchValue: "18ms (Served from local Edge PoP)", impact: "positive", explanation: "Anycast DNS routes users to the geographically nearest edge location." },
    { label: "Primary DB CPU Load", naiveValue: "96% (Constant near-crash)", wellArchValue: "11% (Protected by ElastiCache Redis)", impact: "positive", explanation: "Cache-Aside offloads repeated read queries completely." },
    { label: "Monthly Compute/DB Spend", naiveValue: "$490/mo (Requires large instances)", wellArchValue: "$165/mo (Right-sized origin + CDN)", impact: "positive", explanation: "CDN bandwidth is significantly cheaper than oversized EC2/RDS instances." }
  ],
  chaos: {
    id: "chaos-caching",
    title: "50,000 Req/s Flash Sale Traffic Spike",
    triggerLabel: "Simulate 50,000 Req/s Flash Sale Spike",
    description: "A national television advertisement airs, driving 50,000 requests per second to the product catalog homepage simultaneously.",
    affectedNodeIds: ["n-origin-srv", "n-origin-db", "w-cloudfront", "w-redis"],
    naiveConsequence: {
      statusText: "ORIGIN COLLAPSE & 504 GATEWAY TIMEOUT",
      errorRate: "92% Error Rate (500 / 504 Failures)",
      latency: "Exceeds 30,000ms Timeout",
      downtime: "Complete outage for duration of spike",
      narrative: "Database connection pool is depleted within 2 seconds. Nginx origin worker processes queue up and crash. Potential millions in lost revenue."
    },
    wellArchConsequence: {
      statusText: "TRAFFIC ABSORBED SEAMLESSLY AT EDGE",
      errorRate: "0.00% Dropped Requests",
      latency: "14ms",
      failoverTime: "Instant (Zero Origin Degradation)",
      narrative: "CloudFront absorbs 96.5% of requests across global PoPs without touching origin. Redis absorbs remaining query read bursts. Database CPU barely flickers to 14%."
    }
  },
  speakerNotes: {
    hook: "The fastest and cheapest database query is the one you never execute. Caching is the ultimate performance superpower in the cloud.",
    keyPoints: [
      "Amazon CloudFront has over 600 Points of Presence, bringing data within milliseconds of 99% of global internet users.",
      "Always use Origin Access Control (OAC) to ensure users cannot bypass CloudFront to access your S3 origin.",
      "Amazon ElastiCache Redis provides microsecond latency for session management and hot product catalogs."
    ],
    architectTip: "Configure CloudFront with stale-while-revalidate cache headers to keep content blazing fast even during origin refreshes.",
    examQuestion: "A web application requires low-latency delivery of static images globally while keeping origin S3 buckets private. Which configuration is required? (Answer: Amazon CloudFront with Origin Access Control (OAC) and an S3 bucket policy allowing only the CloudFront distribution)."
  }
};

// src/data/domains/decoupled.ts
var decoupledDomain = {
  id: "decoupled-architecture",
  number: 11,
  title: "Building Decoupled Architecture",
  subtitle: "Amazon SQS FIFO, SNS Fan-Out, & Dead-Letter Queues (DLQ) vs. Blocking Synchronous HTTP Chains",
  category: "Performance & Scale",
  pillars: ["Reliability", "Performance Efficiency", "Operational Excellence"],
  customerRequirement: {
    clientName: "HyperCart Retail Logistics",
    businessGoal: "Process 100,000 orders per hour during Black Friday flash sales with sub-100ms checkout acknowledgment and zero dropped orders during partner outages.",
    challenges: [
      "Third-party payment gateways and shipping webhooks frequently timeout under load",
      "Synchronous HTTP chains hold open client connections for 4+ seconds",
      "If any downstream vendor fails, customer checkout fails completely"
    ],
    budgetOrSlaTarget: "Sub-100ms Checkout Acknowledgment | Zero Dropped Orders | 14-Day Resilient Buffer"
  },
  normalPrescription: {
    title: "Tightly Coupled Synchronous Blocking HTTP Microservices Chain",
    prescribedServices: "Monolithic application server synchronously calling Payment API, Inventory DB, and SMTP email vendor",
    whyItSeemsLogical: "Simple sequential programming logic: charge card, update DB, send email, return status.",
    whyItFailsInProduction: [
      "Cascading failure: a slow email server holds web worker threads open until the entire server crashes",
      "High latency: user waits 4+ seconds for 3 sequential network hops",
      "No retry buffer: failed transactions are permanently lost"
    ]
  },
  wafTransformationSummary: "WAF decouples the architecture using Amazon SQS FIFO with Dead-Letter Queues (DLQs) and Amazon SNS fan-out. The checkout responds in 85ms with HTTP 202, while worker fleets process orders asynchronously with zero data loss.",
  naive: {
    name: "Tightly Coupled Synchronous HTTP Chained Monolith",
    tagline: "Frontend -> Backend -> Payment API -> Inventory -> Third-Party Email in single blocking thread",
    description: "Every checkout request executes as a synchronous serial chain. The frontend waits while the backend calls a payment gateway, updates database inventory, and communicates with a third-party email provider over HTTP. If the email provider or payment webhook experiences a 10-second delay, the customer browser times out and the order is lost.",
    bulletPoints: [
      "Cascading failure: a minor outage in a non-critical notification vendor kills core checkout revenue",
      "High latency: customer browser waits 3,500ms+ for 4 sequential external HTTP handshakes",
      "No retry buffering: if payment drops connection, transactions are lost with zero replay ability",
      "No backpressure handling: traffic spikes crush downstream services"
    ],
    nodes: [
      { id: "n-buyer", name: "Checkout Customer", type: "client", service: "E-commerce Shopper", tier: "edge", status: "healthy" },
      { id: "n-sync-checkout", name: "Monolithic Web Server", type: "compute", service: "Synchronous Checkout Thread", tier: "public", isSPOF: true, status: "healthy", description: "Blocking thread holding open socket" },
      { id: "n-slow-payment", name: "Payment Gateway", type: "compute", service: "External Bank API", tier: "edge", isSPOF: true, status: "healthy" },
      { id: "n-flaky-email", name: "Third-Party Email Vendor", type: "compute", service: "External SMTP Webhook", tier: "edge", isSPOF: true, status: "degraded", description: "Subject to 10s timeouts & 503 outages" }
    ],
    connections: [
      { from: "n-buyer", to: "n-sync-checkout", label: "Blocking HTTPS Checkout", type: "sync" },
      { from: "n-sync-checkout", to: "n-slow-payment", label: "Blocking Step 1: Charge Card", type: "sync" },
      { from: "n-sync-checkout", to: "n-flaky-email", label: "Blocking Step 2: Send Email Receipt", type: "sync" }
    ],
    monthlyCostEst: 320,
    availabilitySLA: "97.0%",
    rto: "Manual Reconciliation",
    rpo: "Lost In-Flight Orders",
    scores: {
      operationalExcellence: 25,
      security: 50,
      reliability: 20,
      performanceEfficiency: 25,
      costOptimization: 50,
      sustainability: 45
    },
    iacSnippet: {
      language: "hcl",
      filename: "anti_pattern_synchronous.py",
      code: `# ANTI-PATTERN: Synchronous blocking execution in application handler
@app.route("/api/order", methods=["POST"])
def place_order():
    order = create_order_in_db(request.json)
    
    # BLOCKING HTTP CALL #1:
    charge = requests.post("https://payment-gateway/charge", json=order, timeout=10)
    
    # BLOCKING HTTP CALL #2 (If this times out, checkout crashes!):
    email = requests.post("https://vendor-smtp/send-email", json=order, timeout=15)
    
    # Result: Client waits 8 seconds. If email fails, customer gets error 500!
    return jsonify({"status": "complete"})`,
      notes: "Cascading failure trap. The health of your primary revenue flow depends on the uptime of third-party vendors."
    }
  },
  wellArch: {
    name: "Asynchronous Event-Driven Architecture with Amazon SQS & EventBridge",
    tagline: "Amazon SQS FIFO, Dead-Letter Queues (DLQ), and SNS Fan-Out with sub-100ms checkout confirmation",
    description: "Decoupled event-driven choreography. When an order is submitted, the API validates the payload, enqueues an event into Amazon SQS / EventBridge, and returns HTTP 202 Accepted to the user in 85ms. Asynchronous worker microservices process billing, inventory, and emails independently. Dead-Letter Queues (DLQ) safely capture failed events with exponential backoff and redrive.",
    bulletPoints: [
      "Checkout responds in 85ms: customer never waits for slow email or fulfillment microservices",
      "Failure isolation: a total outage in the email provider has zero impact on revenue checkout",
      "Amazon SQS buffers spikes: downstream services process workloads at their own sustainable pace",
      "Dead-Letter Queues (DLQ) with AWS CloudWatch alarms ensure zero messages are ever lost"
    ],
    nodes: [
      { id: "w-buyer-decoupled", name: "Happy Shopper", type: "client", service: "Instant Checkout App", tier: "edge", status: "healthy" },
      { id: "w-api-fast", name: "Fast Ingestion API", type: "compute", service: "AWS Lambda / API Gateway", tier: "public", isSPOF: false, status: "healthy", description: "Returns HTTP 202 in 85ms" },
      { id: "w-sqs-orders", name: "Amazon SQS (Orders Queue + DLQ)", type: "queue", service: "Durable Message Buffer (14-day retention)", tier: "cloud", isSPOF: false, status: "healthy", description: "Buffers 100k messages safely" },
      { id: "w-sns-fanout", name: "Amazon SNS Fan-Out Topic", type: "queue", service: "Pub/Sub Event Broadcaster", tier: "cloud", isSPOF: false, status: "healthy" },
      { id: "w-worker-payment", name: "Payment Microservice Worker", type: "compute", service: "Auto-Scaling Consumer Fleet", tier: "private", isSPOF: false, status: "healthy" },
      { id: "w-worker-email", name: "Notification Worker (with DLQ)", type: "compute", service: "Decoupled Async Worker", tier: "private", isSPOF: false, status: "healthy" }
    ],
    connections: [
      { from: "w-buyer-decoupled", to: "w-api-fast", label: "HTTP 202 Accepted in 85ms", type: "sync" },
      { from: "w-api-fast", to: "w-sqs-orders", label: "Enqueue Message", type: "sync" },
      { from: "w-sqs-orders", to: "w-sns-fanout", label: "Broadcast OrderPlaced Event", type: "async" },
      { from: "w-sns-fanout", to: "w-worker-payment", label: "Billing Subscription", type: "async" },
      { from: "w-sns-fanout", to: "w-worker-email", label: "Notification Subscription (DLQ Guarded)", type: "async" }
    ],
    monthlyCostEst: 42,
    availabilitySLA: "99.99%",
    rto: "Zero (Buffer Absorbs Outages)",
    rpo: "Zero (Messages Retained up to 14 Days)",
    scores: {
      operationalExcellence: 97,
      security: 94,
      reliability: 99,
      performanceEfficiency: 98,
      costOptimization: 95,
      sustainability: 95
    },
    iacSnippet: {
      language: "hcl",
      filename: "well_architected_sqs_dlq.tf",
      code: `# WELL-ARCHITECTED: Amazon SQS with Dead-Letter Queue (DLQ) & Redrive Policy
resource "aws_sqs_queue" "orders_dlq" {
  name                      = "orders-dead-letter-queue"
  message_retention_seconds = 1209600 # 14 days retention for inspection
}

resource "aws_sqs_queue" "orders_queue" {
  name                      = "orders-primary-queue"
  visibility_timeout_seconds = 300
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.orders_dlq.arn
    maxReceiveCount     = 5 # Retry 5 times with backoff before DLQ
  })
}

resource "aws_sns_topic" "order_events" {
  name = "order-events-fanout"
}`,
      notes: "Decouples order intake from processing. DLQ captures poison pill messages without interrupting the primary message flow."
    }
  },
  metrics: [
    { label: "Customer Checkout Response Latency", naiveValue: "3,800ms (Waits for all 3rd parties)", wellArchValue: "85ms (Async SQS Acknowledgment)", impact: "positive", explanation: "Customer gets instant confirmation; heavy processing handled asynchronously." },
    { label: "Impact of Downstream Vendor Outage", naiveValue: "100% Checkout Crash", wellArchValue: "0% Checkout Impact (Buffered in SQS)", impact: "positive", explanation: "Orders sit safely in SQS queue for up to 14 days until downstream recovers." },
    { label: "Data Loss During Traffic Spikes", naiveValue: "Dropped Requests (HTTP 504)", wellArchValue: "0 Dropped Messages (DLQ Protected)", impact: "positive", explanation: "Queue automatically absorbs traffic surges with zero packet loss." },
    { label: "Cost of Idle Queues", naiveValue: "Constant server overhead", wellArchValue: "$0.40 per 1,000,000 messages", impact: "positive", explanation: "Amazon SQS charges purely per API call with zero idle server instances." }
  ],
  chaos: {
    id: "chaos-decoupled",
    title: "Downstream Email Vendor Down & 20,000 Black Friday Orders",
    triggerLabel: "Kill Email Vendor & Flood 20k Orders",
    description: "The third-party email notification provider suffers a complete worldwide DNS blackout while shoppers submit 20,000 orders.",
    affectedNodeIds: ["n-flaky-email", "n-sync-checkout", "w-worker-email", "w-sqs-orders"],
    naiveConsequence: {
      statusText: "CASCADING SYSTEM FAILURE & ABANDONED CARTS",
      errorRate: "100% of Checkouts Timeout with HTTP 504",
      latency: "Infinite (Thread Starvation)",
      downtime: "Ongoing for 45 minutes until vendor recovers",
      narrative: "Because the email step is synchronous in the main thread, all web worker processes lock waiting for TCP socket timeouts. Entire checkout crashes."
    },
    wellArchConsequence: {
      statusText: "ALL 20,000 ORDERS ACCEPTED IN < 90ms",
      errorRate: "0.00% Order Failures",
      latency: "78ms average checkout",
      failoverTime: "Instant (SQS buffers email backlog)",
      narrative: "Shoppers receive immediate order confirmation. SQS buffers all notification tasks. Worker retires with exponential backoff. Once vendor restores, backlog drains in 3 minutes with zero lost orders."
    }
  },
  speakerNotes: {
    hook: "If your frontend checkout crashes because your email receipt server is slow, you do not have a microservice architecture\u2014you have a distributed monolith with network latency.",
    keyPoints: [
      "Decoupling with Amazon SQS converts unpredictable spikes into a smooth, manageable stream.",
      "Always configure a Dead-Letter Queue (DLQ) with a maxReceiveCount and CloudWatch alarm.",
      "SNS Fan-Out allows adding new consumers (e.g., fraud analysis, audit) without touching the checkout codebase."
    ],
    architectTip: "Set your SQS visibility timeout to 6 times the timeout of your processing Lambda function to prevent duplicate deliveries.",
    examQuestion: "An application needs to process order transactions asynchronously and ensure that messages that fail processing after 3 attempts are isolated for manual review. Which combination should be used? (Answer: Amazon SQS queue with a Dead-Letter Queue and redrive policy maxReceiveCount set to 3)."
  }
};

// src/data/domains/serverless.ts
var serverlessDomain = {
  id: "serverless-microservices",
  number: 12,
  title: "Serverless Architecture & Microservices",
  subtitle: "API Gateway, Lambda ARM64, Step Functions, & DynamoDB vs. Stateful VM Monolith",
  category: "Modern Application Design",
  pillars: ["Performance Efficiency", "Cost Optimization", "Sustainability"],
  customerRequirement: {
    clientName: "NextGen Mobility AI",
    businessGoal: "Build an event-driven mobile backend that costs $0 when idle at night, scales instantly from 0 to 50,000 concurrent requests, and requires zero OS management.",
    challenges: [
      "Traffic is almost zero from 1 AM to 6 AM, but explodes during morning rush hour",
      "Scaling virtual machines takes 8 to 15 minutes to boot AMIs",
      "Engineering team spends 20% of their time on Linux security patches and kernel upgrades"
    ],
    budgetOrSlaTarget: "$0 Idle Spend | Sub-second Scale-Out | 0 OS Maintenance Hours"
  },
  normalPrescription: {
    title: "Stateful Virtual Machine Cluster Running 24/7 on EC2",
    prescribedServices: "24/7 EC2 c5.2xlarge instances running Node.js with sticky sessions and local memory state",
    whyItSeemsLogical: "Standard VM deployment pattern familiar to traditional system administrators.",
    whyItFailsInProduction: [
      "Paying for idle peak capacity 24/7 costs $450+/month even with zero traffic",
      "Scaling lag: new instances take 10 minutes to initialize and join the load balancer",
      "Continuous operational overhead for OS patching, AMI maintenance, and security hardening"
    ]
  },
  wafTransformationSummary: "WAF transitions to serverless microservices with Amazon API Gateway, AWS Lambda running on energy-efficient ARM64 Graviton, AWS Step Functions for state workflows, and DynamoDB On-Demand, achieving true pay-per-use and instant scaling.",
  naive: {
    name: "Stateful Monolithic VM Cluster with Manual Patching",
    tagline: "Paying 24/7 for idle Linux VMs, 15-minute AMI scaling, and stateful session traps",
    description: "A traditional stateful monolith running inside EC2 virtual machines. Sessions are pinned to local instance memory. Scaling up during traffic bursts requires spinning up new AMIs, taking 8 to 15 minutes. At 3:00 AM when traffic is zero, the business still pays full hourly price for idle VMs and EBS disks.",
    bulletPoints: [
      "Zero traffic at night still costs $400+/month in continuous idle VM and EBS fees",
      "Scaling lag: takes 8 to 15 minutes to boot, initialize, and warm up a new virtual machine",
      "Session affinity / sticky sessions: single instance crashes log out thousands of active users",
      "Continuous operational burden: OS patching, kernel upgrades, and CVE remediation"
    ],
    nodes: [
      { id: "n-mono-vm1", name: "Monolith VM 1 (us-east-1a)", type: "compute", service: "EC2 Linux Stateful VM", tier: "public", isSPOF: true, status: "healthy", description: "Local memory session state" },
      { id: "n-mono-vm2", name: "Monolith VM 2 (us-east-1b)", type: "compute", service: "EC2 Linux Stateful VM", tier: "public", isSPOF: true, status: "healthy" },
      { id: "n-patching", name: "Manual OS Patching Window", type: "compute", service: "Midnight SSH Maintenance", tier: "public", isSPOF: false, status: "degraded" }
    ],
    connections: [
      { from: "n-mono-vm1", to: "n-mono-vm2", label: "Fragile Session Sync", type: "sync" },
      { from: "n-patching", to: "n-mono-vm1", label: "Reboot Required for Kernel", type: "sync" }
    ],
    monthlyCostEst: 460,
    availabilitySLA: "99.0%",
    rto: "15 Minutes (AMI Boot Time)",
    rpo: "Local Session Loss",
    scores: {
      operationalExcellence: 30,
      security: 45,
      reliability: 35,
      performanceEfficiency: 40,
      costOptimization: 25,
      sustainability: 25
    },
    iacSnippet: {
      language: "hcl",
      filename: "anti_pattern_monolith.tf",
      code: `# ANTI-PATTERN: Heavy stateful VM requiring constant OS maintenance
resource "aws_instance" "monolithic_app" {
  ami                  = "ami-0c55b159cbfafe1f0"
  instance_type        = "c5.2xlarge" # 8 vCPUs, 16GB RAM ($0.34/hr 24/7)
  associate_public_ip_address = true
  # No serverless scaling, constant power draw at night!
}`,
      notes: "Stateful VM architecture costs money 24/7 regardless of traffic and requires continuous operating system maintenance."
    }
  },
  wellArch: {
    name: "Event-Driven Serverless Microservices with Graviton ARM64 Lambda",
    tagline: "Amazon API Gateway, Lambda ARM, Step Functions state machines & DynamoDB On-Demand",
    description: "Cloud-native serverless architecture. Amazon API Gateway provides managed routing, rate limiting, and authorization. AWS Lambda functions run on energy-efficient ARM64 Graviton architecture, scaling to thousands of concurrent executions in milliseconds and dropping to $0 cost when idle. AWS Step Functions orchestrates multi-step workflows with compensating transactions (Saga Pattern), and Amazon DynamoDB provides single-digit millisecond performance at any scale.",
    bulletPoints: [
      "True pay-per-use: $0 compute cost when idle at night, scales to 10,000 requests in milliseconds",
      "AWS Lambda Graviton2/3 (ARM64) delivers 34% better price/performance and 60% less energy",
      "AWS Step Functions manages distributed transactions, retries, and error handling visually",
      "Zero server management: no operating systems to patch, no AMIs to bake, no SSH bastions"
    ],
    nodes: [
      { id: "w-apigw", name: "Amazon API Gateway", type: "gateway", service: "Managed REST / HTTP API", tier: "edge", isSPOF: false, status: "healthy", description: "Throttling, Auth, OpenAPI validation" },
      { id: "w-lambda-auth", name: "Auth Lambda (ARM64)", type: "compute", service: "AWS Lambda (JWT Validator)", tier: "cloud", isSPOF: false, status: "healthy" },
      { id: "w-step-fn", name: "AWS Step Functions", type: "queue", service: "Visual State Machine Orchestrator", tier: "cloud", isSPOF: false, status: "healthy", description: "Handles Saga pattern & retries" },
      { id: "w-lambda-exec", name: "Order Processing Lambda", type: "compute", service: "AWS Lambda Graviton3", tier: "cloud", isSPOF: false, status: "healthy", description: "Sub-second horizontal scale" },
      { id: "w-dynamodb", name: "Amazon DynamoDB On-Demand", type: "database", service: "Serverless NoSQL (Single-digit ms)", tier: "isolated", isSPOF: false, status: "healthy" }
    ],
    connections: [
      { from: "w-apigw", to: "w-lambda-auth", label: "Lambda Authorizer", type: "sync" },
      { from: "w-apigw", to: "w-step-fn", label: "Direct Service Integration", type: "sync" },
      { from: "w-step-fn", to: "w-lambda-exec", label: "Parallel Task State", type: "sync" },
      { from: "w-lambda-exec", to: "w-dynamodb", label: "Encrypted PutItem (< 3ms)", type: "sync" }
    ],
    monthlyCostEst: 38,
    availabilitySLA: "99.99%",
    rto: "< 1 Second (Stateless Re-invocation)",
    rpo: "Zero (DynamoDB Multi-AZ Commit)",
    scores: {
      operationalExcellence: 98,
      security: 97,
      reliability: 98,
      performanceEfficiency: 96,
      costOptimization: 98,
      sustainability: 99
    },
    iacSnippet: {
      language: "hcl",
      filename: "well_architected_serverless.tf",
      code: `# WELL-ARCHITECTED: Serverless Lambda ARM64 with API Gateway & DynamoDB
resource "aws_lambda_function" "order_handler" {
  function_name = "process-order"
  runtime       = "nodejs20.x"
  architectures = ["arm64"] # AWS Graviton: 34% better price/perf!
  memory_size   = 1024
  timeout       = 10

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.orders.name
    }
  }
}

resource "aws_dynamodb_table" "orders" {
  name         = "Orders"
  billing_mode = "PAY_PER_REQUEST" # True serverless on-demand billing!
  hash_key     = "OrderId"

  attribute {
    name = "OrderId"
    type = "S"
  }
  point_in_time_recovery { enabled = true }
}`,
      notes: "No EC2 instances, zero idle costs, sub-millisecond cold starts, and built-in continuous point-in-time recovery."
    }
  },
  metrics: [
    { label: "Idle Compute Cost (3:00 AM)", naiveValue: "$18.40 / day ($550/mo)", wellArchValue: "$0.00 (True Pay-per-Use)", impact: "positive", explanation: "Serverless Lambda and DynamoDB charge $0 when zero requests are being executed." },
    { label: "Scale-Out Latency (0 to 10k RPS)", naiveValue: "8 to 15 Minutes (Booting AMIs)", wellArchValue: "< 500 Milliseconds (Instant concurrency)", impact: "positive", explanation: "Lambda scales up concurrency immediately without waiting for OS boots." },
    { label: "OS Patching / Maintenance Burden", naiveValue: "Weekly SSH Patch Windows", wellArchValue: "Zero (Fully Managed by AWS)", impact: "positive", explanation: "AWS manages OS security updates, hypervisors, and runtimes transparently." },
    { label: "Carbon Efficiency (Sustainability)", naiveValue: "Continuous wasted kilowatt-hours", wellArchValue: "Maximum: Executes only when needed on ARM", impact: "positive", explanation: "High-density multi-tenant hardware eliminates unused thermal waste." }
  ],
  chaos: {
    id: "chaos-serverless",
    title: "Instant 0 to 40,000 Invocations Surge",
    triggerLabel: "Simulate 0 to 40k Invocations Burst",
    description: "Traffic spikes instantly from zero to 40,000 concurrent API calls due to an unexpected viral notification.",
    affectedNodeIds: ["n-mono-vm1", "n-mono-vm2", "w-apigw", "w-lambda-exec", "w-dynamodb"],
    naiveConsequence: {
      statusText: "INSTANCES FREEZE & CRASH UNDER LOAD",
      errorRate: "98% HTTP 503 Service Unavailable",
      latency: "Connections Dropped",
      downtime: "15 Minutes until Auto Scaling catches up",
      narrative: "Existing VM connections saturate instantly. New instances take 12 minutes to download packages and join load balancer. Viral moment completely squandered."
    },
    wellArchConsequence: {
      statusText: "100% EXECUTED WITH ZERO PROVISIONING LAG",
      errorRate: "0.00% Dropped Requests",
      latency: "26ms median execution",
      failoverTime: "Sub-second automatic concurrency scale",
      narrative: "API Gateway absorbs and validates requests. Lambda scales to thousands of concurrent executions in milliseconds. DynamoDB On-Demand handles 40,000 writes without throttling."
    }
  },
  speakerNotes: {
    hook: "The greenest and most cost-effective line of code is the server that is turned off when nobody is using it.",
    keyPoints: [
      "Serverless represents the pinnacle of the Sustainability and Cost Optimization pillars.",
      "AWS Graviton ARM64 architecture on Lambda delivers 34% better price/performance than x86.",
      "AWS Step Functions allows modeling complex business transactions visually with automatic retries and catch blocks."
    ],
    architectTip: "Use API Gateway payload validation to reject malformed requests at the edge before invoking Lambda, saving execution costs.",
    examQuestion: "An application requires intermittent processing of unpredictable events with zero compute cost when no events are received. Which architecture meets this requirement? (Answer: AWS Lambda with Amazon API Gateway and DynamoDB On-Demand)."
  }
};

// src/data/domains/datapipelines.ts
var dataPipelinesDomain = {
  id: "data-pipelines",
  number: 13,
  title: "Data Pipelines",
  subtitle: "Kinesis Streaming, AWS Glue Serverless ETL, S3 Lake & Athena vs. Cron EC2 Bash Dumps",
  category: "Modern Application Design",
  pillars: ["Performance Efficiency", "Cost Optimization", "Operational Excellence"],
  customerRequirement: {
    clientName: "DataPulse Analytics Corp",
    businessGoal: "Ingest and analyze 500 million clickstream and IoT telemetry events per day, providing real-time dashboards with sub-minute latency without impacting production databases.",
    challenges: [
      "Analytics reports are currently delayed by 24 hours due to nightly batch jobs",
      "Nightly mysqldump scripts lock production tables, disrupting live customer transactions",
      "Monolithic Python pandas scripts crash with Out-of-Memory (OOM) errors as datasets grow"
    ],
    budgetOrSlaTarget: "Sub-60s Data Ingestion | Zero Impact on OLTP DB | Pay-per-Query SQL"
  },
  normalPrescription: {
    title: "Nightly Bash Cron Script Executing mysqldump on Production DB",
    prescribedServices: "Single EC2 instance running a midnight bash script that dumps SQL to local disk and runs pandas",
    whyItSeemsLogical: "Simple script written in an afternoon without provisioning big data infrastructure.",
    whyItFailsInProduction: [
      "Production database locks during the dump, causing timeouts for active users",
      "Single-server RAM limit (OOM crash) when data volume exceeds instance memory",
      "Reports are always 24 hours stale, preventing real-time business decisions"
    ]
  },
  wafTransformationSummary: "WAF implements a modern serverless data lake with Amazon Kinesis Data Firehose for real-time streaming, AWS Glue serverless ETL for columnar Parquet conversion, Amazon S3 for durable storage, and Amazon Athena for serverless SQL.",
  naive: {
    name: "Fragile Nightly Bash Cron Job on Single EC2",
    tagline: "`mysqldump` dumped to local disk, python script crashes on Out-of-Memory, 24h data lag",
    description: "Analytics and reporting rely on a midnight cron script running on a lone EC2 instance. The script locks production tables, exports raw CSVs to local disk, runs a monolithic Python pandas script that consumes all RAM, and FTPs files to an external server. When data volume grows, the script crashes silently and stakeholders see yesterday's stale data.",
    bulletPoints: [
      "24-hour latency: business intelligence reports are always one day behind reality",
      "Table locking: midnight `mysqldump` locks production transactions, causing user timeouts",
      "Out of Memory (OOM) crashes: scaling requires continuously upsizing the EC2 instance",
      "No data lake or schema catalog: raw, un-partitioned CSVs stored without optimization"
    ],
    nodes: [
      { id: "n-prod-db-hit", name: "Production Relational DB", type: "database", service: "Live OLTP Database", tier: "public", isSPOF: true, status: "healthy", description: "Locked by nightly mysqldump" },
      { id: "n-cron-ec2", name: "Cron Worker EC2", type: "compute", service: "EC2 Running Python Pandas", tier: "public", isSPOF: true, status: "degraded", description: "Regularly crashes with OOM error" },
      { id: "n-flat-csv", name: "Local Disk /mnt/data.csv", type: "storage", service: "Unpartitioned Raw Text CSV", tier: "public", isSPOF: true, status: "healthy" }
    ],
    connections: [
      { from: "n-prod-db-hit", to: "n-cron-ec2", label: "Blocking mysqldump Lock", type: "sync" },
      { from: "n-cron-ec2", to: "n-flat-csv", label: "Memory-bound Pandas Transformation", type: "sync" }
    ],
    monthlyCostEst: 310,
    availabilitySLA: "85.0% Pipeline Reliability",
    rto: "Manual Python Script Rerun",
    rpo: "24 Hours of Data Lag",
    scores: {
      operationalExcellence: 20,
      security: 35,
      reliability: 25,
      performanceEfficiency: 20,
      costOptimization: 40,
      sustainability: 35
    },
    iacSnippet: {
      language: "hcl",
      filename: "anti_pattern_etl.sh",
      code: `#!/bin/bash
# ANTI-PATTERN: Fragile midnight cron script
echo "Starting ETL export at 00:00..."
mysqldump -u root -p password123 --all-databases > /tmp/backup.sql # Locks production!

# Fragile Python script that loads 80GB into 16GB RAM:
python3 /opt/scripts/transform_pandas.py /tmp/backup.sql
# If data grows 10%, script dies with MemoryError!
echo "Upload complete"`,
      notes: "No streaming capabilities, locks live production databases, and cannot scale beyond single-instance memory limits."
    }
  },
  wellArch: {
    name: "Modern Serverless Data Lake & Streaming Pipeline",
    tagline: "Amazon Kinesis Data Firehose, AWS Glue Serverless ETL, S3 Parquet Lake & Athena SQL",
    description: "Real-time analytics without operational overhead. Microservices stream clickstream and transactional events directly to Amazon Kinesis Data Firehose. AWS Glue processes and transforms incoming data into partitioned Apache Parquet format. Analysts query petabytes of data on demand using Amazon Athena serverless SQL without provisioning clusters.",
    bulletPoints: [
      "Real-time streaming: data available for analytics in under 60 seconds (instead of 24 hours)",
      "Zero impact on production OLTP: streaming events decoupled from relational databases",
      "AWS Glue serverless distributed Spark scales automatically across petabytes without OOM crashes",
      "Amazon Athena queries Amazon S3 columnar Parquet files directly, paying only $5 per TB scanned"
    ],
    nodes: [
      { id: "w-stream-sources", name: "Live Event Producers", type: "client", service: "IoT, Web, & Microservices", tier: "edge", status: "healthy" },
      { id: "w-kinesis", name: "Amazon Kinesis Firehose", type: "analytics", service: "Serverless Real-Time Ingestion", tier: "cloud", isSPOF: false, status: "healthy", description: "Buffers, compresses & converts format" },
      { id: "w-glue-etl", name: "AWS Glue Serverless ETL", type: "analytics", service: "Auto-Scaling Apache Spark Jobs", tier: "cloud", isSPOF: false, status: "healthy", description: "Glue Data Catalog + Partitioning" },
      { id: "w-s3-lake", name: "Amazon S3 Modern Data Lake", type: "storage", service: "Tiered Parquet Lake (Raw/Curated)", tier: "cloud", isSPOF: false, status: "healthy", description: "11 9s durability, partitioned by date" },
      { id: "w-athena", name: "Amazon Athena (Presto SQL)", type: "analytics", service: "Serverless Interactive Analytics", tier: "cloud", isSPOF: false, status: "healthy", description: "Pay-per-query ad-hoc SQL" }
    ],
    connections: [
      { from: "w-stream-sources", to: "w-kinesis", label: "Real-Time Streaming PutRecord", type: "sync" },
      { from: "w-kinesis", to: "w-s3-lake", label: "Micro-Batch Buffer Delivery", type: "async" },
      { from: "w-s3-lake", to: "w-glue-etl", label: "Automated Spark Transformation", type: "async" },
      { from: "w-s3-lake", to: "w-athena", label: "Columnar Parquet Pushdown", type: "sync" }
    ],
    monthlyCostEst: 64,
    availabilitySLA: "99.99%",
    rto: "< 60 Seconds Delivery",
    rpo: "Real-Time Streaming Commit",
    scores: {
      operationalExcellence: 97,
      security: 95,
      reliability: 98,
      performanceEfficiency: 98,
      costOptimization: 94,
      sustainability: 96
    },
    iacSnippet: {
      language: "hcl",
      filename: "well_architected_data_lake.tf",
      code: `# WELL-ARCHITECTED: Kinesis Firehose directly into S3 Parquet Data Lake
resource "aws_kinesis_firehose_delivery_stream" "lake_stream" {
  name        = "clickstream-lake-ingestion"
  destination = "extended_s3"

  extended_s3_configuration {
    role_arn   = aws_iam_role.firehose_role.arn
    bucket_arn = aws_s3_bucket.data_lake.arn
    prefix     = "curated/year=!{timestamp:yyyy}/month=!{timestamp:MM}/"

    # Serverless format conversion to Columnar Parquet:
    data_format_conversion_configuration {
      output_format_configuration {
        serializer {
          parquet_ser_de {}
        }
      }
      schema_configuration {
        database_name = aws_glue_catalog_database.lake_db.name
        table_name    = aws_glue_catalog_table.events.name
        role_arn      = aws_iam_role.firehose_role.arn
      }
    }
  }
}`,
      notes: "Firehose converts JSON to Parquet on the fly, saving up to 80% on query scanning costs with Athena."
    }
  },
  metrics: [
    { label: "Data Freshness / Analytics Latency", naiveValue: "24 Hours (Nightly Batch)", wellArchValue: "< 60 Seconds (Real-Time Ingestion)", impact: "positive", explanation: "Kinesis Firehose buffers and lands data in S3 within 60 seconds." },
    { label: "Impact on Live Production DB", naiveValue: "Table Locks during mysqldump", wellArchValue: "Zero Impact (Decoupled Stream)", impact: "positive", explanation: "Analytics queries run against S3 via Athena without touching production databases." },
    { label: "Query Performance & Cost", naiveValue: "Scanning whole raw CSVs ($$$)", wellArchValue: "85% Cost Drop via Parquet Columnar Pushdown", impact: "positive", explanation: "Parquet format only reads columns referenced in the SQL SELECT statement." },
    { label: "Max Dataset Scalability", naiveValue: "Limited by single server RAM (80GB)", wellArchValue: "Petabyte-scale distributed execution", impact: "positive", explanation: "S3 and Glue scale compute and storage independently to petabytes." }
  ],
  chaos: {
    id: "chaos-data-pipeline",
    title: "100x Payload Explosion & Corrupted Data Ingestion",
    triggerLabel: "Simulate 100x Data Spike & Schema Drift",
    description: "During a marketing campaign, event telemetry surges by 100x while an update sends malformed JSON records into the pipeline.",
    affectedNodeIds: ["n-cron-ec2", "n-flat-csv", "w-kinesis", "w-glue-etl"],
    naiveConsequence: {
      statusText: "OUT OF MEMORY HARD CRASH & MISSING REPORTS",
      errorRate: "100% Pipeline Stoppage",
      latency: "Data frozen indefinitely",
      downtime: "48 Hours until manual script modification",
      narrative: "The Python script runs out of memory, corrupts the local CSV file, and leaves executive dashboards displaying stale zeroes."
    },
    wellArchConsequence: {
      statusText: "AUTO-SCALED INGESTION & MALFORMED ISOLATION",
      errorRate: "0.00% Streaming Data Loss",
      latency: "< 45s to Lake",
      failoverTime: "Instant (Firehose scales shards dynamically)",
      narrative: "Kinesis Firehose dynamically scales buffer limits. Malformed records are safely routed to an S3 quarantine error bucket for inspection. Athena queries continue executing smoothly."
    }
  },
  speakerNotes: {
    hook: "If your business has to wait until tomorrow morning to see what your customers did today, you are competing in slow motion.",
    keyPoints: [
      "Modern data architectures decouple operational transactional systems (OLTP) from analytics (OLAP).",
      "Converting data to columnar Parquet via Glue or Firehose reduces Athena scan costs by up to 90%.",
      "Amazon Athena allows SQL queries directly on S3 data lakes without managing any database clusters."
    ],
    architectTip: "Always partition your S3 data lake by date (year/month/day) to prevent full-bucket scans in Athena.",
    examQuestion: "A company needs to ingest streaming clickstream data, convert it to Apache Parquet format, and load it into Amazon S3 for ad-hoc SQL querying. What serverless combination is best? (Answer: Amazon Kinesis Data Firehose with format conversion enabled and Amazon Athena)."
  }
};

// src/data/domains/disasterrecovery.ts
var disasterRecoveryDomain = {
  id: "disaster-recovery",
  number: 14,
  title: "Disaster Recovery (DR) Planning & Management",
  subtitle: '4 AWS DR Strategies (Backup/Restore -> Pilot Light -> Warm Standby -> Multi-Region Active-Active) vs. "Backup & Hope"',
  category: "Operations & Reliability",
  pillars: ["Reliability", "Operational Excellence", "Cost Optimization"],
  customerRequirement: {
    clientName: "GlobalPay Financial Services",
    businessGoal: "Guarantee business continuity for critical banking services with an RTO of under 1 minute and an RPO of under 1 second, even if an entire AWS primary region suffers a total outage.",
    challenges: [
      "Single-region dependency in us-east-1 leaves entire company vulnerable to regional blackouts",
      "Manual disaster recovery runbooks take 4 to 6 days to execute and have never been tested",
      "Cross-region database replication must not introduce application latency"
    ],
    budgetOrSlaTarget: "RTO < 60 seconds | RPO < 1 second | 99.999% Regional Availability"
  },
  normalPrescription: {
    title: '"Backup and Hope" Single-Region Manual EBS Snapshots',
    prescribedServices: "Occasional manual EBS and RDS snapshots saved inside the same AWS region (us-east-1)",
    whyItSeemsLogical: "Lowest upfront cost with no secondary infrastructure to maintain.",
    whyItFailsInProduction: [
      "A regional power or network outage destroys both live workloads and their backups simultaneously",
      "RTO is measured in days: recreating VPCs, databases, and servers manually is error-prone",
      "Untested runbooks mean recovery invariably fails during an actual emergency"
    ]
  },
  wafTransformationSummary: "WAF implements a Multi-Region Active-Active DR architecture using Amazon Route 53 Application Recovery Controller, Amazon Aurora Global Database with sub-second replication, and S3 Cross-Region Replication, enabling automated regional failover in under 45 seconds.",
  naive: {
    name: '"Backup and Hope" Single-Region Vulnerability',
    tagline: "Intermittent manual snapshots saved inside the same region with zero DR runbooks",
    description: 'The organization relies on "Backup and Hope". Occasional manual snapshots are created, but they are stored in the same AWS region (`us-east-1`). No secondary region exists, recovery has never been rehearsed, and restoring requires manually spinning up VPCs, subnets, and instances from memory over several days.',
    bulletPoints: [
      "Same-region dependency: catastrophic outage in us-east-1 destroys both production and backups",
      "RTO measured in days: no automation or IaC exists to recreate infrastructure in a secondary region",
      "RPO measured in weeks: manual snapshots are irregular and frequently forgotten",
      "Zero rehearsal: runbooks are outdated Google Docs that have never been tested in a simulated drill"
    ],
    nodes: [
      { id: "n-single-region", name: "Primary Region (us-east-1)", type: "network", service: "us-east-1 Sole Production Region", tier: "cloud", isSPOF: true, status: "healthy" },
      { id: "n-untested-snap", name: "Untested Snapshot (us-east-1)", type: "storage", service: "Manual EBS Snapshot in same region", tier: "cloud", isSPOF: true, status: "healthy", description: "Subject to regional blast radius" },
      { id: "n-panicked-team", name: "Panicked Ops Team", type: "compute", service: "Emergency Manual Rebuild Team", tier: "edge", status: "degraded" }
    ],
    connections: [
      { from: "n-single-region", to: "n-untested-snap", label: "Infrequent Manual Snapshot", type: "async" },
      { from: "n-panicked-team", to: "n-single-region", label: "Manual Emergency SSH", type: "sync" }
    ],
    monthlyCostEst: 180,
    availabilitySLA: "95.0% Regional Risk",
    rto: "3 to 5 Days",
    rpo: "2 Weeks of Lost Commits",
    scores: {
      operationalExcellence: 15,
      security: 35,
      reliability: 10,
      performanceEfficiency: 40,
      costOptimization: 70,
      sustainability: 45
    },
    iacSnippet: {
      language: "hcl",
      filename: "anti_pattern_dr.tf",
      code: `# ANTI-PATTERN: No cross-region replication or multi-region failover
resource "aws_ebs_snapshot" "infrequent_manual_snapshot" {
  volume_id   = aws_ebs_volume.primary.id
  description = "Manual snapshot taken 3 weeks ago"
  # Stored in us-east-1 only!
  # If us-east-1 has a catastrophic event, snapshot is inaccessible!
}`,
      notes: "No automated cross-region replication. Recovery Point Objective (RPO) is weeks out of date."
    }
  },
  wellArch: {
    name: "Multi-Region Active-Active with Aurora Global DB & Route 53 ARC",
    tagline: "Amazon Route 53 Application Recovery Controller, Aurora Global DB & S3 CRR",
    description: "Enterprise multi-region resilience with predictable RTO and RPO. Route 53 Application Recovery Controller continuously monitors regional health and routes users via latency-based routing. Amazon Aurora Global Database uses dedicated storage replication with lag under 1 second to a secondary region. S3 Cross-Region Replication (CRR) synchronizes object stores in real time.",
    bulletPoints: [
      "Multi-Region Active-Active: traffic served simultaneously from us-east-1 and eu-west-1",
      "Aurora Global Database replicates transactions across regions in under 1 second without app overhead",
      "Route 53 Application Recovery Controller executes sub-minute regional failovers with routing controls",
      "S3 Cross-Region Replication (CRR) with S3 Versioning ensures complete object immutability"
    ],
    nodes: [
      { id: "w-r53-arc", name: "Amazon Route 53 ARC", type: "dns", service: "Application Recovery Controller", tier: "edge", isSPOF: false, status: "healthy", description: "Automated regional health routing" },
      { id: "w-region-primary", name: "Primary Region (us-east-1)", type: "network", service: "Full Active Stack (us-east-1)", tier: "cloud", isSPOF: false, status: "healthy" },
      { id: "w-region-secondary", name: "Secondary Region (eu-west-1)", type: "network", service: "Full Active Stack (eu-west-1)", tier: "cloud", isSPOF: false, status: "healthy" },
      { id: "w-aurora-global", name: "Aurora Global Database", type: "database", service: "Cross-Region Storage Replication (< 1s)", tier: "isolated", isSPOF: false, status: "healthy", description: "Sub-second cross-region replication" },
      { id: "w-s3-crr", name: "S3 Cross-Region Replication", type: "storage", service: "Asynchronous S3 CRR Bucket", tier: "cloud", isSPOF: false, status: "healthy" }
    ],
    connections: [
      { from: "w-r53-arc", to: "w-region-primary", label: "Primary Latency Flow (50%)", type: "sync" },
      { from: "w-r53-arc", to: "w-region-secondary", label: "Secondary Latency Flow (50%)", type: "sync" },
      { from: "w-region-primary", to: "w-aurora-global", label: "Local Read/Write", type: "sync" },
      { from: "w-aurora-global", to: "w-region-secondary", label: "Dedicated HW Replication (< 1s)", type: "async" },
      { from: "w-region-primary", to: "w-s3-crr", label: "Automated S3 CRR", type: "async" }
    ],
    monthlyCostEst: 520,
    availabilitySLA: "99.999% (Five 9s)",
    rto: "< 45 Seconds (Route 53 Shift)",
    rpo: "< 1 Second (Aurora Global Replication)",
    scores: {
      operationalExcellence: 98,
      security: 97,
      reliability: 99,
      performanceEfficiency: 96,
      costOptimization: 84,
      sustainability: 86
    },
    iacSnippet: {
      language: "hcl",
      filename: "well_architected_multi_region_dr.tf",
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
      notes: "Aurora Global Database uses dedicated storage infrastructure for replication with typical latency under 1 second."
    }
  },
  metrics: [
    { label: "Recovery Time Objective (RTO)", naiveValue: "3 to 5 Days (Manual Rebuild)", wellArchValue: "< 45 Seconds (Automated DNS Shift)", impact: "positive", explanation: "Route 53 ARC shifts 100% of user traffic to secondary region in seconds." },
    { label: "Recovery Point Objective (RPO)", naiveValue: "2 Weeks (Outdated Snapshots)", wellArchValue: "< 1 Second (Aurora Global Replication)", impact: "positive", explanation: "Storage-level replication keeps the secondary database current to within milliseconds." },
    { label: "Disaster Rehearsal Feasibility", naiveValue: "Never Tested (Fear of Breaking Prod)", wellArchValue: "Continuous Automated GameDay Drills", impact: "positive", explanation: "Teams can simulate regional evacuation using ARC routing controls with zero downtime." },
    { label: "Multi-Region High Availability", naiveValue: "95.0% (Single Region Outage Vulnerable)", wellArchValue: "99.999% (Resilient against AWS Region Down)", impact: "positive", explanation: "Survives a complete data center or regional power failure." }
  ],
  chaos: {
    id: "chaos-dr",
    title: "Catastrophic AWS Primary Region (`us-east-1`) Blackout",
    triggerLabel: "Simulate Total us-east-1 Regional Failure",
    description: "A major regional utility substation failure and fiber optic severance takes down all services in `us-east-1`.",
    affectedNodeIds: ["n-single-region", "n-untested-snap", "w-region-primary"],
    naiveConsequence: {
      statusText: "TOTAL BUSINESS EXTINCTION LEVEL EVENT",
      errorRate: "100% Global Outage",
      latency: "Infinite (Unreachable)",
      downtime: "Estimated 4 to 6 Days",
      narrative: "All servers, databases, and un-replicated backups are trapped in the down region. Stockholders panic; executive team forced to issue breach notifications."
    },
    wellArchConsequence: {
      statusText: "TRAFFIC SHIFTED TO eu-west-1 IN 36 SECONDS",
      errorRate: "0.02% during initial 30s DNS propagation",
      latency: "Normal European latency (< 45ms)",
      failoverTime: "36 Seconds (Aurora promotes to writer)",
      narrative: "Route 53 ARC marks us-east-1 unhealthy and shifts all global traffic to eu-west-1. Aurora Global Database promotes secondary cluster to standalone writer. Zero transactions lost (RPO < 1s)."
    }
  },
  speakerNotes: {
    hook: "Disaster recovery is not an IT ticket you fill out after an earthquake. It is a mathematical trade-off between RTO, RPO, and budget.",
    keyPoints: [
      "AWS defines 4 distinct DR strategies: Backup & Restore, Pilot Light, Warm Standby, and Multi-Region Active-Active.",
      "Aurora Global Database delivers sub-second replication latency across continents using dedicated AWS storage hardware.",
      "Route 53 Application Recovery Controller (ARC) gives you a big red button to evacuate an entire AWS region safely."
    ],
    architectTip: "Conduct monthly GameDays using AWS Fault Injection Simulator (FIS) to prove your failover automation actually works.",
    examQuestion: "An enterprise requires an RPO of less than 1 second and an RTO of less than 1 minute across AWS regions for a mission-critical relational database. What solution should be selected? (Answer: Amazon Aurora Global Database with Amazon Route 53 Application Recovery Controller)."
  }
};

// src/data/domains/conclusion.ts
var conclusionDomain = {
  id: "executive-conclusion",
  number: 15,
  title: "Executive Conclusion & Architectural Verdict",
  subtitle: "The 15-Domain Transformation Matrix, 10 Golden Rules, & Architecture Sign-Off",
  category: "Executive Verdict",
  pillars: ["Operational Excellence", "Security", "Reliability", "Performance Efficiency", "Cost Optimization", "Sustainability"],
  customerRequirement: {
    clientName: "Board of Directors & Executive Architecture Review",
    businessGoal: "Deliver definitive architectural verification confirming that all 15 syllabus domains comply with AWS Well-Architected Framework guidelines, with certified risk mitigation and FinOps ROI.",
    challenges: [
      "Validating that critical High-Risk Issues (HRIs) have been completely remediated",
      "Demonstrating audit readiness for enterprise compliance standards (SOC2, HIPAA, ISO 27001)",
      "Ensuring operational self-sufficiency through Infrastructure as Code and automated event-driven playbooks"
    ],
    budgetOrSlaTarget: "Executive Sign-Off | Zero HRIs | 59.1% Cost Reduction ($4,450 \u2192 $1,820/mo) | 99.99% Enterprise SLA"
  },
  normalPrescription: {
    title: "Unreviewed Technical Debt & Fragmented Cloud Silos",
    prescribedServices: "Disparate Un-audited Cloud Workloads with No Continuous Compliance or FinOps Controls",
    whyItSeemsLogical: 'Engineering teams often assume their cloud deployment is "fine" until an unexpected regional blackout or a $100k AWS bill occurs.',
    whyItFailsInProduction: [
      "Silent accumulation of architectural drift and untracked security loopholes",
      "Sudden regulatory audit failure resulting in catastrophic compliance fines and loss of enterprise licenses",
      "Executive leadership has zero visibility into true blast radius risk or cloud financial waste",
      "No disaster recovery runbooks: first test of recovery happens during an actual catastrophic outage"
    ]
  },
  wafTransformationSummary: "The AWS Well-Architected Framework is not merely a technical checklist; it is an executive operating model. It establishes continuous compliance via AWS Config, least privilege security boundaries via IAM Identity Center, sub-30s disaster recovery, and permanent cloud financial optimization.",
  naive: {
    name: "Unmitigated Enterprise Cloud Risk (Post-Mortem State)",
    tagline: "Legacy architecture plagued by unaddressed single points of failure and uncontrolled spending",
    description: "An enterprise cloud environment left without Well-Architected Framework governance. Infrastructure consists of manual ClickOps resources, un-rotated static access keys, public database endpoints, and unmonitored storage tiers. During outages, recovery depends entirely on frantic manual human debugging.",
    bulletPoints: [
      "13 High Risk Issues (HRIs) and 28 Medium Risk Issues (MRIs) persisting across all workloads",
      "$139,400/yr in estimated business loss exposure due to unplanned downtime and SLA breach penalties",
      "Zero Infrastructure as Code: replication of environments or disaster recovery is virtually impossible",
      "Failed compliance audits for SOC2, HIPAA, and PCI-DSS due to lack of encryption and audit trails"
    ],
    nodes: [
      {
        id: "n-conc-debt",
        name: "Technical Debt Backlog",
        type: "compute",
        service: "13 Unmitigated High Risk Issues",
        tier: "public",
        isSPOF: true,
        status: "degraded",
        description: "Compounding vulnerabilities across storage, compute, database, and security",
        configDetails: {
          specs: "13 HRIs identified in AWS Well-Architected Tool audit",
          securityPolicy: "Static IAM root keys, public subnets, unencrypted EBS",
          costProfile: "$53,400 / yr in un-optimized cloud spend",
          wafAdvantage: "Execute the 13-domain Well-Architected modernization roadmap"
        }
      },
      {
        id: "n-conc-blast",
        name: "Uncontained Blast Radius",
        type: "database",
        service: "Single Point of Failure Dependencies",
        tier: "public",
        isSPOF: true,
        status: "degraded",
        description: "Cascading failures between tightly coupled microservices and single-AZ databases",
        configDetails: {
          specs: "Synchronous REST chaining without queues or circuit breakers",
          securityPolicy: "Zero VPC peering segmentation or network isolation",
          costProfile: "$8,500 / hr in business outage losses",
          wafAdvantage: "Decouple with SQS/SNS and multi-AZ Aurora with read replicas"
        }
      }
    ],
    connections: [
      { from: "n-conc-debt", to: "n-conc-blast", label: "Cascading Failure Propagation", type: "blocked" }
    ],
    monthlyCostEst: 4450,
    availabilitySLA: "98.5% (Frequent Unplanned Downtime)",
    rto: "48+ Hours",
    rpo: "24 Hours",
    scores: {
      operationalExcellence: 22,
      security: 18,
      reliability: 20,
      performanceEfficiency: 28,
      costOptimization: 24,
      sustainability: 20
    },
    iacSnippet: {
      language: "hcl",
      filename: "audit_failure_summary.txt",
      code: `=== AWS WELL-ARCHITECTED TOOL REVIEW AUDIT FINDINGS ===
Workload: Enterprise Production Core
Overall Status: CRITICAL RISK DETECTED

HIGH RISK ISSUES (HRI): 13 Identified
- OPS: Workload does not implement operations as code (IaC)
- SEC: IAM users with static access keys and AdministratorAccess
- SEC: Production databases located in public subnets with 0.0.0.0/0 ingress
- REL: Workload relies on single-AZ compute and single-AZ database
- REL: No disaster recovery plan or tested RTO/RPO objectives
- PERF: No caching tier; all static and dynamic queries hit origin DB
- COST: 3TB EBS gp2 volumes over-provisioned; un-tiered S3 storage
- SUS: Always-on x86 instances with 3% CPU utilization overnight

VERDICT: Workload fails enterprise security and reliability certification.`,
      notes: "Audit summary reflecting unmanaged cloud environments before applying the Well-Architected Framework."
    }
  },
  wellArch: {
    name: "Certified AWS Well-Architected Workload (Exemplary 96/100)",
    tagline: "Fully governed, multi-AZ, compliant, and continuously audited enterprise cloud",
    description: "The completed Well-Architected workload. Managed under AWS Organizations with Service Control Policies (SCPs), 100% Terraform Infrastructure as Code in automated CI/CD pipelines, automated 30-day Secrets Manager rotation, multi-AZ Aurora with read replicas, CloudFront edge caching, asynchronous SQS buffers, serverless data pipelines, and sub-30s Route 53 ARC multi-region disaster recovery.",
    bulletPoints: [
      "100% Remediation: Zero High Risk Issues (HRIs) and only 2 acceptable Medium Risk Issues",
      "59% Net Cloud Savings ($21,840/yr vs $53,400/yr) with guaranteed 99.99% availability SLA",
      "Continuous compliance automation via AWS Config and Security Hub with automated drift remediation",
      "Definitive architect certification: compliant with SOC2, HIPAA, PCI-DSS, and ISO 27001"
    ],
    nodes: [
      {
        id: "w-conc-gov",
        name: "AWS Organizations & SCPs",
        type: "security",
        service: "Centralized Multi-Account Governance",
        tier: "edge",
        isSPOF: false,
        status: "healthy",
        description: "Service Control Policies enforcing encryption, private subnets, and region restrictions",
        configDetails: {
          specs: "Multi-account AWS Landing Zone with IAM Identity Center SSO",
          securityPolicy: "SCPs prohibit public S3 buckets and unencrypted EBS volumes",
          costProfile: "$0 (AWS Organizations native governance)",
          wafAdvantage: "Prevents security configuration drift at the root organizational level"
        }
      },
      {
        id: "w-conc-iac",
        name: "100% GitOps CI/CD Pipelines",
        type: "compute",
        service: "Terraform & AWS Config Automation",
        tier: "private",
        isSPOF: false,
        status: "healthy",
        description: "Declarative Infrastructure as Code with automated security linting and drift detection",
        configDetails: {
          specs: "All 13 domains managed via versioned Git repositories with pre-commit Checkov linters",
          securityPolicy: "Ephemeral CI/CD deployment roles via OIDC federation (Zero static credentials)",
          costProfile: "Negligible pipeline execution costs",
          wafAdvantage: "Enables 100% reproducible environments and disaster recovery failover in minutes"
        }
      },
      {
        id: "w-conc-telemetry",
        name: "Proactive Telemetry & Auto-Healing",
        type: "analytics",
        service: "CloudWatch Insights + EventBridge",
        tier: "private",
        isSPOF: false,
        status: "healthy",
        description: "Comprehensive observability with automated event-driven self-healing playbooks",
        configDetails: {
          specs: "Distributed X-Ray tracing, Container Insights, and anomaly detection alarms",
          securityPolicy: "GuardDuty ML threat detection analyzing CloudTrail and VPC Flow Logs in real time",
          costProfile: "$45/mo for centralized telemetry",
          wafAdvantage: "Reduces Mean Time to Resolution (MTTR) from hours to under 25 seconds"
        }
      }
    ],
    connections: [
      { from: "w-conc-gov", to: "w-conc-iac", label: "Mandated Organizational Guardrails", type: "sync" },
      { from: "w-conc-iac", to: "w-conc-telemetry", label: "Continuous Compliance & Telemetry", type: "sync" }
    ],
    monthlyCostEst: 1820,
    availabilitySLA: "99.99% (Certified High Availability)",
    rto: "< 30 Seconds",
    rpo: "< 1 Second",
    scores: {
      operationalExcellence: 97,
      security: 98,
      reliability: 97,
      performanceEfficiency: 96,
      costOptimization: 95,
      sustainability: 96
    },
    iacSnippet: {
      language: "hcl",
      filename: "certified_architecture_signoff.tf",
      code: `=== CERTIFIED ARCHITECT EXECUTIVE SIGN-OFF ===
Workload: Enterprise Production Core
Framework Standard: AWS Well-Architected Framework (6 Pillars)
Review Status: PASSED - CERTIFIED ARCHITECT COMPLIANT

QUANTITATIVE AUDIT COMPARISON:
- High Risk Issues (HRI): Reduced from 13 down to 0 (100% Elimination)
- Medium Risk Issues (MRI): Reduced from 28 down to 2 (93% Reduction)
- Workload Availability SLA: Upgraded from 98.5% (SPOF) to 99.99% (Multi-AZ HA)
- Mean Time to Recovery (MTTR): Slashed from 4-8 Hours down to < 25 Seconds
- Total Cloud Infrastructure Spend: Reduced by 59.1% ($21,840/yr vs $53,400/yr)
- Unplanned Downtime Risk: Eliminated $139,400/yr in business loss liability

ARCHITECTURAL VERDICT:
The architecture satisfies all requirements across Storage, Compute, Database,
Networking, Hybrid Connectivity, Security, Monitoring, Automation, Caching,
Decoupled Queues, Serverless Microservices, Data Pipelines, and Disaster Recovery.
Signed: Presenter Lead`,
      notes: "Official executive certification and sign-off document for boardroom review."
    }
  },
  metrics: [
    { label: "Overall WAF Review Health Score", naiveValue: "22 / 100 (Critical Risk)", wellArchValue: "96 / 100 (Exemplary)", impact: "positive", explanation: "Comprehensive transformation across all 6 AWS Pillars." },
    { label: "Total Annual Infrastructure Spend", naiveValue: "$53,400 / yr", wellArchValue: "$21,840 / yr", impact: "positive", explanation: "Net annual savings of $31,560 through rightsizing, tiering, and serverless scale-to-zero." },
    { label: "Annual Downtime Loss Exposure", naiveValue: "$139,400 / yr", wellArchValue: "$0 / yr (Eliminated)", impact: "positive", explanation: "Multi-AZ fault tolerance and automated failover eliminate catastrophic unplanned outages." },
    { label: "Compliance Audit Posture", naiveValue: "Failing (Audit Penalties)", wellArchValue: "Certified (SOC2, HIPAA, PCI)", impact: "positive", explanation: "Automated governance, encryption at rest/transit, and immutable audit logging." }
  ],
  chaos: {
    id: "chaos-conclusion",
    title: "Enterprise Audit Validation & Resiliency Certification",
    triggerLabel: "Simulate Unannounced Audit Stress Test",
    description: "An unannounced compliance audit and simulated infrastructure chaos test verifies that the system automatically detects, isolates, and self-heals.",
    affectedNodeIds: ["n-conc-debt", "n-conc-blast", "w-conc-gov", "w-conc-iac"],
    naiveConsequence: {
      statusText: "AUDIT FAILURE & SERVICE CRASH",
      errorRate: "100% Exposure",
      latency: "N/A (Failed)",
      downtime: "Enterprise Audit Sanctions Imposed",
      narrative: "The audit reveals unencrypted medical data, public database credentials, and lack of automated recovery. The system fails compliance checks and suffers immediate operational sanctions."
    },
    wellArchConsequence: {
      statusText: "CERTIFIED COMPLIANT & RESILIENT",
      errorRate: "0% Non-Compliance",
      latency: "< 20ms",
      failoverTime: "< 15 Seconds",
      narrative: "AWS Config and Security Hub report 100% compliance across all CIS AWS Foundations benchmarks. Automated self-healing remediates the simulated disruption with zero dropped sessions."
    }
  },
  speakerNotes: {
    hook: "Architecture is not just about what you build; it is about what you prevent from breaking.",
    keyPoints: [
      "Across all 15 domains evaluated today, the AWS Well-Architected Framework delivered a measurable 59.1% reduction in cloud costs ($4,450 to $1,820/mo) while increasing availability from 98.5% to 99.99%.",
      "We eliminated critical High-Risk Issues and reduced disaster recovery time from 48 hours down to typically under 30 seconds.",
      "The 10 Golden Rules of AWS Well-Architected (Operations as Code, Apply Security Everywhere, Stop Guessing Capacity, Decouple Components, etc.) provide a permanent blueprint for engineering excellence."
    ],
    architectTip: "Schedule continuous quarterly Well-Architected reviews to ensure that architecture evolves proactively alongside business growth.",
    examQuestion: "What is the recommended frequency for conducting an AWS Well-Architected Framework Review on production workloads? (Answer: At least once every major milestone or release cycle, and periodically at least once every 6 to 12 months)."
  }
};

// src/data/index.ts
var allDomains = [
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
var allPillars = [
  {
    name: "Operational Excellence",
    color: "#0066cc",
    icon: "Activity",
    description: "Run and monitor systems to deliver business value and continually improve processes and procedures."
  },
  {
    name: "Security",
    color: "#c9302c",
    icon: "Shield",
    description: "Protect information, systems, and assets while delivering business value through risk assessments and mitigation."
  },
  {
    name: "Reliability",
    color: "#1e7e34",
    icon: "RefreshCw",
    description: "Ensure a workload performs its intended function correctly and consistently when it\u2019s expected to."
  },
  {
    name: "Performance Efficiency",
    color: "#9a5b00",
    icon: "Zap",
    description: "Use computing resources efficiently to meet requirements and maintain that efficiency as demand changes."
  },
  {
    name: "Cost Optimization",
    color: "#6b3fd6",
    icon: "DollarSign",
    description: "Avoid unnecessary costs and understand where money is spent to optimize workloads over time."
  },
  {
    name: "Sustainability",
    color: "#0f766e",
    icon: "Leaf",
    description: "Minimize environmental impacts of running cloud workloads through right-sizing and serverless adoption."
  }
];
var drStrategies = [
  {
    id: "backup-restore",
    name: "Backup & Restore",
    rpo: "24 Hours",
    rto: "24 Hours",
    costMultiplier: "1x ($)",
    costEstimate: "$80 / mo",
    description: "Data is backed up to S3 and replicated to a secondary region. Compute is provisioned only after disaster strikes.",
    architectureNotes: "Lowest cost. Suitable for non-critical workloads, internal dev environments, and batch workloads."
  },
  {
    id: "pilot-light",
    name: "Pilot Light",
    rpo: "10 Minutes",
    rto: "2 Hours",
    costMultiplier: "2.5x ($$)",
    costEstimate: "$240 / mo",
    description: "Core databases are continuously replicated and kept running live in the secondary region. App servers exist as AMIs ready to scale.",
    architectureNotes: 'The database "pilot flame" is always on. Rapidly scales out compute via Auto Scaling when failover is invoked.'
  },
  {
    id: "warm-standby",
    name: "Warm Standby",
    rpo: "Seconds",
    rto: "10 Minutes",
    costMultiplier: "4x ($$$)",
    costEstimate: "$450 / mo",
    description: "A scaled-down, minimum functional copy of the entire stack is always running in the secondary region.",
    architectureNotes: "Can take live traffic immediately in a degraded state while Auto Scaling ramps up to 100% capacity."
  },
  {
    id: "multi-region-active",
    name: "Multi-Region Active-Active",
    rpo: "< 1 Second",
    rto: "< 30 Seconds",
    costMultiplier: "7x ($$$$)",
    costEstimate: "$980 / mo",
    description: "Workloads run simultaneously in 2+ AWS regions with Route 53 latency routing and Aurora Global Database.",
    architectureNotes: "Near-zero downtime. Survives catastrophic regional blackouts with automatic failover and zero human intervention."
  }
];

// src/data/theoreticalFoundations.ts
var theoreticalFoundations = {
  "overview-thesis": {
    domainId: "overview-thesis",
    domainNumber: 0,
    domainTitle: "Executive Architecture Overview",
    lawOrTheorem: {
      name: "Gall\u2019s Law",
      founder: "John Gall",
      year: "1977",
      formalStatement: "A complex system that works is invariably found to have evolved from a simple system that worked. A complex system designed from scratch never works and cannot be patched up to make it work.",
      architecturalApplication: "The AWS Well-Architected Framework operationalizes Gall\u2019s Law by enforcing modular, decoupled, and incrementally testable components rather than unmanageable monolithic constructs.",
      mathematicalFormula: "S(t) = S_0 \\prod_{i=1}^n (1 - p_i)",
      formulaExplanation: "System reliability S(t) degrades exponentially as unpartitioned interdependent components (p_i) increase."
    },
    awsWhitepaper: {
      title: "AWS Well-Architected Framework: General Design Principles",
      docCode: "AWS-WAF-2024-GEN",
      pillarBestPracticeCode: "OPS01, REL01, SEC01",
      canonicalQuote: "Stop guessing your capacity needs. Test systems at production scale. Automate to make architectural experimentation easier. Allow for evolutionary architectures."
    },
    buildersLibrary: {
      title: "Reliability, constant work, and static stability",
      author: "Becky Weiss",
      role: "VP and Distinguished Engineer, AWS",
      coreInsight: "Architectures that survive catastrophic load do so by remaining statically stable\u2014operating predictably without relying on external control planes or sudden synchronous re-allocations during failure."
    },
    complianceStandard: {
      standard: "ISO/IEC 27001 / SOC 2 Type II",
      controlId: "CC6.1 - System Boundaries & Architecture",
      requirement: "The entity implements logical boundaries and formal architectural reviews to protect sensitive infrastructure from systemic collapse."
    }
  },
  "storage-layer": {
    domainId: "storage-layer",
    domainNumber: 1,
    domainTitle: "Storage Layer",
    lawOrTheorem: {
      name: "Reed-Solomon Erasure Coding & Quorum Durability",
      founder: "Irving S. Reed & Gustave Solomon",
      year: "1960",
      formalStatement: "An (n, k) Reed-Solomon code over Galois Field GF(2^w) reconstructs original data of k blocks from any k subset of n encoded blocks, tolerating (n - k) simultaneous disk/node losses.",
      architecturalApplication: "Amazon S3 uses advanced erasure coding across at least three physical Availability Zones, delivering 99.999999999% (11 9\u2019s) durability without tripling raw hardware footprints.",
      mathematicalFormula: "P(\\text{loss}) = \\sum_{j=m+1}^{n} \\binom{n}{j} p^j (1-p)^{n-j}",
      formulaExplanation: "Where n=encoded shards, m=tolerated parity failures, and p=annual drive failure rate (~1.5%). Yields P(loss) < 10^{-11}."
    },
    awsWhitepaper: {
      title: "Amazon S3 Architecture & Durability Whitepaper",
      docCode: "AWS-S3-ARCH-11NINES",
      pillarBestPracticeCode: "REL09 - Back up data; COST04 - Decommission or tier storage",
      canonicalQuote: "S3 Standard is designed for 11 9\u2019s of durability by automatically dispersing data across multiple independent facilities with real-time proactive cyclic checksum validation."
    },
    buildersLibrary: {
      title: "Workload isolation using shuffle sharding",
      author: "Marc Brooker",
      role: "VP and Distinguished Engineer, AWS",
      coreInsight: "Isolating customer data across orthogonal shards limits the blast radius of any individual hardware or network degradation to a mathematically negligible slice."
    },
    complianceStandard: {
      standard: "NIST SP 800-53 Rev. 5",
      controlId: "CP-9 - Information System Backup",
      requirement: "Conduct automated incremental backups with continuous cryptographic hash validation and cross-facility geographic redundancy."
    }
  },
  "compute-layer": {
    domainId: "compute-layer",
    domainNumber: 2,
    domainTitle: "Compute Layer",
    lawOrTheorem: {
      name: "Amdahl\u2019s Law & Gustafson\u2019s Law of Parallel Scalability",
      founder: "Gene Amdahl / John Gustafson",
      year: "1967 / 1988",
      formalStatement: "The maximum speedup of a program using n processors is limited by the serial fraction s: Speedup = 1 / (s + (1-s)/n). Horizontal scale beats vertical scale as scale n approaches infinity.",
      architecturalApplication: "Monolithic single-server compute hits vertical hardware walls ($s \\to 1$). Well-Architected Auto Scaling groups leverage stateless horizontal scaling across multiple AZs, maximizing parallel compute efficiency.",
      mathematicalFormula: "S_{\\text{latency}} = \\frac{1}{(1-p) + \\frac{p}{N}}",
      formulaExplanation: "Where p is parallelizable request execution fraction and N is the number of stateless EC2/Fargate containers."
    },
    awsWhitepaper: {
      title: "Performance Efficiency Pillar - AWS Well-Architected Framework",
      docCode: "AWS-WAF-PERF-2024",
      pillarBestPracticeCode: "PERF01 - Evaluate compute resources; PERF02 - Select right compute",
      canonicalQuote: "Use elasticity to match supply with demand. Do not over-provision static instances to survive rare peak workloads; instead, use dynamic or predictive horizontal scaling."
    },
    buildersLibrary: {
      title: "Avoiding fallback in distributed systems",
      author: "David Yanacek",
      role: "Senior Principal Engineer, AWS",
      coreInsight: "When compute fleets face sudden traffic spikes, hard limits and shedding work early protects core processing engines from entering unrecoverable brownout loops."
    },
    complianceStandard: {
      standard: "SOC 2 Type II",
      controlId: "A1.2 - Capacity and Availability Management",
      requirement: "Capacity requirements are monitored and dynamically scaled to prevent service denial and maintain performance SLAs."
    }
  },
  "database-layer": {
    domainId: "database-layer",
    domainNumber: 3,
    domainTitle: "Database Layer",
    lawOrTheorem: {
      name: "CAP Theorem & PACELC Theorem",
      founder: "Eric Brewer (2000) / Daniel Abadi (2012)",
      year: "2000 / 2012",
      formalStatement: "If there is a Partition (P), how does the system trade off Availability (A) and Consistency (C); Else (E), when normal, how does it trade off Latency (L) and Consistency (C)?",
      architecturalApplication: "Amazon Aurora uses a multi-master or read-replica quorum (PC/EC for writes, PA/EL for reads), while DynamoDB offers tunable read consistency (Eventual vs Strong), allowing architects to tune PACELC trade-offs per access pattern.",
      mathematicalFormula: "V_w > V/2 \\quad \\text{and} \\quad V_r + V_w > V",
      formulaExplanation: "Gifford Quorum condition: Total votes V=6, Write quorum V_w=4, Read quorum V_r=3 ensures read and write sets always overlap by at least one node."
    },
    awsWhitepaper: {
      title: "Amazon Aurora: Design Considerations for High Throughput Cloud-Native Relational Databases",
      docCode: "SIGMOD-AURORA-PAPER",
      pillarBestPracticeCode: "REL07 - Design interactions in distributed systems to mitigate failures",
      canonicalQuote: "The log is the database. Storage nodes independently apply redo log records in parallel, offloading database engine CPU and eliminating write latency bottlenecks."
    },
    buildersLibrary: {
      title: "Leader election in distributed systems",
      author: "Marc Brooker",
      role: "VP and Distinguished Engineer, AWS",
      coreInsight: "Distributed consensus mechanisms such as Raft or Paxos prevent split-brain scenarios and allow automated sub-30 second failover across availability zones."
    },
    complianceStandard: {
      standard: "PCI-DSS v4.0",
      controlId: "Req 3.4 & Req 10.2 - Database Protection & Audit Trails",
      requirement: "All cardholder database storage must be encrypted at rest with hardware HSM-managed keys and all administrative transactions logged immutably."
    }
  },
  "networking-environment": {
    domainId: "networking-environment",
    domainNumber: 4,
    domainTitle: "Networking Environment",
    lawOrTheorem: {
      name: "Saltzer & Schroeder\u2019s Compartmentalization & Defense in Depth",
      founder: "Jerome Saltzer & Michael Schroeder",
      year: "1975",
      formalStatement: "Every program and every privileged user of the system should operate using the least amount of privilege necessary to complete the job. Compartmentalize trust zones so that breach of one cannot compromise the whole.",
      architecturalApplication: "Multi-tier VPC topologies enforce this by isolating databases in private, non-routable subnets with NAT Gateways for egress only and no ingress internet routes.",
      mathematicalFormula: "P(\\text{breach}) = \\prod_{k=1}^m p_k",
      formulaExplanation: "Where p_k is the chance an attacker bypasses layer k (Security Groups, NACLs, Private Subnets) and the layers fail independently. The attacker must beat every layer, so with three layers at 10% each the breach chance is 0.1%."
    },
    awsWhitepaper: {
      title: "Building a Modular and Scalable Virtual Private Cloud (VPC) Architecture",
      docCode: "AWS-VPC-REFERENCE-2024",
      pillarBestPracticeCode: "SEC05 - Protect network resources; SEC06 - Protect compute resources",
      canonicalQuote: "Create layered security controls at perimeter, VPC, subnet, and host interfaces. Never place production databases in public subnets with direct 0.0.0.0/0 route table entries."
    },
    buildersLibrary: {
      title: "Network isolation and VPC peering architectures",
      author: "Colm MacC\xE1rthaigh",
      role: "VP and Distinguished Engineer, AWS",
      coreInsight: "Isolating control planes from data planes at the network layer prevents lateral movement during host-level security compromises."
    },
    complianceStandard: {
      standard: "NIST SP 800-207",
      controlId: "Zero Trust Architecture (ZTA)",
      requirement: "No network implicitly carries trust based solely on physical or IP perimeter location; per-packet verification and microsegmentation are required."
    }
  },
  "connecting-networks": {
    domainId: "connecting-networks",
    domainNumber: 5,
    domainTitle: "Connecting Networks",
    lawOrTheorem: {
      name: "Complete-Graph Edge Count: Full-Mesh Peering vs Hub-and-Spoke",
      founder: "Robert Metcalfe",
      year: "1980",
      formalStatement: "The number of peer-to-peer connections in an n-node mesh network grows quadratically as n(n - 1) / 2, leading to exponential routing table bloat and failure overhead.",
      architecturalApplication: "AWS Transit Gateway replaces complex full-mesh VPC peering meshes (O(n^2)) with a centralized hub-and-spoke model (O(n)), drastically simplifying route propagation and security audits.",
      mathematicalFormula: "\\text{Peering Edges} = \\frac{N(N-1)}{2} \\quad \\implies \\quad \\text{Transit Gateway} = N",
      formulaExplanation: "For 20 VPCs: Full mesh requires 190 peering links and route entries. AWS Transit Gateway requires only 20 attachments."
    },
    awsWhitepaper: {
      title: "Hybrid Connectivity & AWS Transit Gateway Architecture",
      docCode: "AWS-TGW-HYBRID-2024",
      pillarBestPracticeCode: "REL03 - Design service architecture with resilient connectivity",
      canonicalQuote: "Transit Gateway acts as a cloud router, simplifying network topologies and eliminating complex peering matrices while enabling centralized network inspection appliances."
    },
    buildersLibrary: {
      title: "Managing network traffic spikes with AWS Direct Connect",
      author: "Peter Vosshall",
      role: "Vice President & Distinguished Engineer, AWS",
      coreInsight: "Redundant hybrid uplinks with BGP multipath routing (ECMP) guarantee active-active failover without human intervention during optical fiber cuts."
    },
    complianceStandard: {
      standard: "CIS AWS Foundations Benchmark",
      controlId: "Sec 4.1 - Monitoring and Gateway Transit Inspections",
      requirement: "Centralized egress firewalls and routing hubs must be established to monitor all east-west and north-south corporate communications."
    }
  },
  "securing-applications": {
    domainId: "securing-applications",
    domainNumber: 6,
    domainTitle: "Securing Applications & Data Access",
    lawOrTheorem: {
      name: "Kerckhoffs\u2019s Principle & Shannon\u2019s Maxim",
      founder: "Auguste Kerckhoffs / Claude Shannon",
      year: "1883 / 1949",
      formalStatement: 'A cryptographic system should be secure even if everything about the system, except the key, is public knowledge ("The enemy knows the system").',
      architecturalApplication: "Hardcoding credentials in source code or environment variables violates this principle. AWS Secrets Manager with AWS KMS envelope encryption protects secrets with automated key rotation and hardware HSM root-of-trust.",
      mathematicalFormula: "C = E(K_{\\text{DEK}}, P) \\quad \\text{and} \\quad K_{\\text{enc}} = E(K_{\\text{CMK}}, K_{\\text{DEK}})",
      formulaExplanation: "Envelope Encryption: Data P is encrypted by Data Encryption Key (DEK). The DEK is encrypted under AWS KMS Customer Master Key (CMK) inside FIPS-validated hardware security modules."
    },
    awsWhitepaper: {
      title: "AWS Security Pillar - Well-Architected Framework",
      docCode: "AWS-WAF-SEC-2024",
      pillarBestPracticeCode: "SEC01 - Separate workloads; SEC02 - Manage identities; SEC03 - Permissions",
      canonicalQuote: "Apply security at all layers. Protect data in transit and at rest. Keep people away from data. Automate security best practices and incident response mechanisms."
    },
    buildersLibrary: {
      title: "Automating safe credential rotation at scale",
      author: "Becky Weiss",
      role: "VP and Distinguished Engineer, AWS",
      coreInsight: "Human-managed credentials are an architectural anti-pattern. IAM Roles for EC2/ECS and Secrets Manager Lambdas completely eliminate permanent static credentials."
    },
    complianceStandard: {
      standard: "NIST SP 800-53 Rev. 5",
      controlId: "AC-6 - Least Privilege & SC-13 Cryptographic Protection",
      requirement: "Employ cryptographic mechanisms with automated lifecycle rotation and attribute-based access control (ABAC)."
    }
  },
  "monitoring-elasticity": {
    domainId: "monitoring-elasticity",
    domainNumber: 7,
    domainTitle: "Monitoring, Elasticity & High Availability",
    lawOrTheorem: {
      name: "High Availability Probability Formula (Parallel vs Series Systems)",
      founder: "Reliability Engineering Principles",
      year: "1965",
      formalStatement: "System availability in series multiplies: A = A_1 * A_2. System availability in parallel redundancy increases exponentially: A = 1 - (1 - A_1)^n.",
      architecturalApplication: "A single server with 99.0% SLA provides 3.65 days of annual downtime. Deploying 3 parallel instances across independent Availability Zones with Application Load Balancers raises availability to 99.9999% (31 seconds annual downtime).",
      mathematicalFormula: "A_{\\text{parallel}} = 1 - \\prod_{i=1}^{N} (1 - A_i)",
      formulaExplanation: "For N=3 AZs each with 99.9% availability: A = 1 - (0.001)^3 = 0.999999999 (Nine 9s availability for compute tier redundancy)."
    },
    awsWhitepaper: {
      title: "Reliability Pillar - High Availability and Elasticity in AWS",
      docCode: "AWS-WAF-REL-HA-2024",
      pillarBestPracticeCode: "REL06 - Monitor system health; REL07 - Design to mitigate failures",
      canonicalQuote: "Workload components must monitor health continuously. If an instance fails its health check, the load balancer stops routing traffic immediately and Auto Scaling automatically replaces it."
    },
    buildersLibrary: {
      title: "Health checks in distributed systems",
      author: "David Yanacek",
      role: "Senior Principal Engineer, AWS",
      coreInsight: "Deep health checks that verify downstream database dependencies can trigger cascading outages if downstream services stutter. Use shallow health checks for routing and deep health checks for alerting."
    },
    complianceStandard: {
      standard: "ISO/IEC 27001",
      controlId: "A.12.1.3 - Capacity Management & Monitoring",
      requirement: "The use of resources shall be monitored, tuned, and projections made of future capacity requirements to ensure the required system performance."
    }
  },
  "automating-architecture": {
    domainId: "automating-architecture",
    domainNumber: 8,
    domainTitle: "Automating the Architecture",
    lawOrTheorem: {
      name: "Conway\u2019s Law & The Declarative Infrastructure Convergence Principle",
      founder: "Melvin Conway",
      year: "1968",
      formalStatement: "Organizations which design systems are constrained to produce designs which are copies of the communication structures of these organizations. Automated declarative state convergence prevents manual drift and divergence.",
      architecturalApplication: "Infrastructure as Code (Terraform / AWS CloudFormation) codifies architectural best practices, version-controls state, and guarantees identical, immutable deployments across testing and production environments.",
      mathematicalFormula: "\\lim_{t \\to \\infty} \\Delta(S_{\\text{desired}}, S_{\\text{actual}}) = 0",
      formulaExplanation: "Automated CI/CD git-ops engines continuously converge actual infrastructure state towards desired version-controlled code specifications."
    },
    awsWhitepaper: {
      title: "Operational Excellence Pillar - AWS Well-Architected Framework",
      docCode: "AWS-WAF-OPS-2024",
      pillarBestPracticeCode: "OPS04 - Implement observability; OPS05 - Use Infrastructure as Code",
      canonicalQuote: "Perform operations as code. Make small, frequent, reversible changes. Anticipate failure and evolve operations procedures continuously."
    },
    buildersLibrary: {
      title: "Automating safe, hands-off deployments",
      author: "Clare Liguori",
      role: "Senior Principal Engineer, AWS",
      coreInsight: "Rollouts must use fractional canary deployments with automated rollback alarms triggered by p99 latency spikes or elevated 5xx error responses."
    },
    complianceStandard: {
      standard: "SOC 2 Type II",
      controlId: "CC8.1 - Change Management & Version Control",
      requirement: "All changes to infrastructure components must be authorized, tested, and tracked in immutable source control logs."
    }
  },
  "caching-content": {
    domainId: "caching-content",
    domainNumber: 9,
    domainTitle: "Caching Content",
    lawOrTheorem: {
      name: "Zipf\u2019s Law & The 80/20 Pareto Principle of Workload Data Access",
      founder: "George Kingsley Zipf / Vilfredo Pareto",
      year: "1935 / 1906",
      formalStatement: "In most distributed applications, frequency of access to content follows a power-law distribution where roughly 80% of read requests target 20% of the data items.",
      architecturalApplication: "Amazon CloudFront and Amazon ElastiCache intercept this top 20% slice at edge and in-memory tiers, shielding database origins from 90%+ of repetitive read query load.",
      mathematicalFormula: "T_{\\text{eff}} = H \\cdot T_{\\text{cache}} + (1 - H) \\cdot T_{\\text{origin}}",
      formulaExplanation: "Effective latency: With 95% cache hit ratio (H=0.95), T_cache=2ms, and T_origin=80ms: T_eff = 0.95(2) + 0.05(80) = 5.9ms (a 92.6% reduction in latency)."
    },
    awsWhitepaper: {
      title: "Caching Strategies with Amazon ElastiCache and CloudFront",
      docCode: "AWS-CACHE-STRATEGIES-2024",
      pillarBestPracticeCode: "PERF03 - Fast data storage; COST06 - Reduce data transfer fees",
      canonicalQuote: "Implement caching across every tier: at edge locations (CloudFront), in-memory compute (ElastiCache), and within application execution caches to eliminate redundant computation."
    },
    buildersLibrary: {
      title: "Caching made simple and robust",
      author: "Marc Brooker",
      role: "VP and Distinguished Engineer, AWS",
      coreInsight: "Cache stampedes and dogpiling occur when cached keys expire simultaneously under load. Use probabilistic early expiration or distributed locks to protect origin databases."
    },
    complianceStandard: {
      standard: "PCI-DSS v4.0",
      controlId: "Req 3.2 - Sensitive Authentication Data Storage",
      requirement: "Ensure in-memory caching tiers (Redis/Memcached) do not inadvertently persist unencrypted CVV or primary account numbers in volatile memory dumps."
    }
  },
  "decoupled-architecture": {
    domainId: "decoupled-architecture",
    domainNumber: 10,
    domainTitle: "Building Decoupled Architecture",
    lawOrTheorem: {
      name: "The Two Generals\u2019 Problem & Asynchronous Loose Coupling",
      founder: "Distributed Computing Theory",
      year: "1975",
      formalStatement: "Two entities communicating over an unreliable link cannot reach 100% certainty of agreement with bounded messages. Synchronous RPC chains multiply unreliability: Availability = Product of all intermediate service availabilities.",
      architecturalApplication: "Amazon SQS and Amazon SNS decouple sender and receiver components. If downstream inventory services stutter or crash, SQS buffers messages safely with zero data loss.",
      mathematicalFormula: "A_{\\text{chain}} = \\prod_{i=1}^M A_i \\quad \\implies \\quad (0.99)^5 = 0.951",
      formulaExplanation: "A synchronous chain of 5 microservices each at 99% SLA drops composite availability to 95.1%. Asynchronous queueing decouples them to independent isolated SLAs."
    },
    awsWhitepaper: {
      title: "Microservices and Decoupled Messaging Architecture on AWS",
      docCode: "AWS-MESSAGING-DECOUPLE-2024",
      pillarBestPracticeCode: "REL04 - Segment your workload; REL05 - Design to withstand component failure",
      canonicalQuote: "Decouple components to reduce dependencies. If one component fails, other components can continue to operate and buffer requests using message queues."
    },
    buildersLibrary: {
      title: "Timeouts, retries, and backoff with jitter",
      author: "Marc Brooker",
      role: "VP and Distinguished Engineer, AWS",
      coreInsight: "Without exponential backoff and randomized jitter, retrying clients synchronize their traffic waves, creating destructive harmonic retry storms that keep failing systems down."
    },
    complianceStandard: {
      standard: "NIST SP 800-53 Rev. 5",
      controlId: "SC-5 - Denial of Service Protection",
      requirement: "The information system protects against or limits the effects of denial of service attacks by employing queuing and rate limiting mechanisms."
    }
  },
  "serverless-microservices": {
    domainId: "serverless-microservices",
    domainNumber: 11,
    domainTitle: "Serverless Architecture & Microservices",
    lawOrTheorem: {
      name: "Little\u2019s Law & Zero Idle Capacity Economics",
      founder: "John D. C. Little",
      year: "1961",
      formalStatement: "The average number of items L in a stationary queueing system equals the long-term average arrival rate \u03BB multiplied by the average time W that an item spends in the system: L = \u03BBW.",
      architecturalApplication: "Serverless architectures (AWS Lambda, API Gateway) scale capacity dynamically to match Little\u2019s Law ($L = \\lambda W$) per millisecond, reducing idle server waste to literally $0.00 when traffic drops to zero.",
      mathematicalFormula: "L = \\lambda \\cdot W \\quad \\implies \\quad \\text{Cost} = \\sum_{k=1}^N (\\text{RAM}_k \\times \\text{Time}_k)",
      formulaExplanation: "Compute expenditure scales strictly with executed transactions rather than paying 24/7 for overprovisioned idle EC2 cores."
    },
    awsWhitepaper: {
      title: "Serverless Applications Lens - AWS Well-Architected Framework",
      docCode: "AWS-WAF-SERVERLESS-LENS-2024",
      pillarBestPracticeCode: "PERF01 - Select compute resources; COST02 - Evaluate governance",
      canonicalQuote: "Build with serverless-first architectures. Remove operational overhead of server management, patch management, and idle provisioning."
    },
    buildersLibrary: {
      title: "Operating serverless architectures in production",
      author: "Julian Wood",
      role: "Principal Developer Advocate, Serverless, AWS",
      coreInsight: "Optimize function cold starts using Lambda SnapStart for Java or light container runtimes, keeping memory sizing tuned for execution speed rather than raw cost."
    },
    complianceStandard: {
      standard: "SOC 2 Type II",
      controlId: "CC6.6 - Boundary Protection and Serverless Run-time Isolation",
      requirement: "Compute workloads run inside hardened, ephemeral micro-VM execution boundaries (such as AWS Firecracker) with per-function IAM role isolation."
    }
  },
  "data-pipelines": {
    domainId: "data-pipelines",
    domainNumber: 12,
    domainTitle: "Data Pipelines",
    lawOrTheorem: {
      name: "Lambda Architecture vs Kappa Architecture (Nathan Marz / Jay Kreps)",
      founder: "Nathan Marz / Jay Kreps",
      year: "2011 / 2014",
      formalStatement: "Data processing can be unified into a single stream processing system (Kappa) or bifurcated into speed-layer and batch-layer pipelines (Lambda) to balance real-time freshness against comprehensive batch accuracy.",
      architecturalApplication: "AWS offers streaming ingestion via Amazon Kinesis and MSK (Kafka) for sub-second dashboards, with Amazon S3 data lake storage queried directly by AWS Glue and Amazon Athena serverless SQL.",
      mathematicalFormula: "T_{\\text{pipeline}} = T_{\\text{ingest}} + T_{\\text{transform}} + T_{\\text{load}}",
      formulaExplanation: "Serverless event-driven ingestion decouples ingestion time from analytical query runtimes, enabling petabyte analytics without cluster sizing constraints."
    },
    awsWhitepaper: {
      title: "Data Analytics Lens - AWS Well-Architected Framework",
      docCode: "AWS-WAF-ANALYTICS-2024",
      pillarBestPracticeCode: "PERF05 - Optimize data storage; SUS02 - Align resource usage with demand",
      canonicalQuote: "Adopt columnar formats like Apache Parquet and partition datasets by date and category to minimize query scan volume and maximize analytical throughput."
    },
    buildersLibrary: {
      title: "Building resilient real-time streaming architectures",
      author: "Ian Meyers",
      role: "Principal Solutions Architect, AWS",
      coreInsight: "Decoupling streaming shards from consumer worker processing fleets prevents checkpoint lag and guarantees idempotent reprocessing upon transient node reboots."
    },
    complianceStandard: {
      standard: "HIPAA & GDPR",
      controlId: "Right to Be Forgotten & PHI Audit Records",
      requirement: "Data pipelines must provide cryptographic pseudonymization and automated lifecycle deletion policies for sensitive personal data records."
    }
  },
  "disaster-recovery": {
    domainId: "disaster-recovery",
    domainNumber: 13,
    domainTitle: "Disaster Recovery (DR) Planning & Management",
    lawOrTheorem: {
      name: "The RTO/RPO Cost Trade-off (Qualitative Heuristic)",
      founder: "AWS Well-Architected Reliability Pillar",
      year: "2021",
      formalStatement: "Anything that can go wrong will go wrong. The cost of disaster recovery increases asymptotically as RTO (Recovery Time Objective) and RPO (Recovery Point Objective) approach zero.",
      architecturalApplication: "The AWS Well-Architected Framework categorizes DR into 4 distinct strategies (Backup & Restore, Pilot Light, Warm Standby, Multi-Region Active-Active), letting businesses align engineering spend directly with downtime cost impact.",
      mathematicalFormula: "\\text{Lower RTO and RPO} \\Rightarrow \\text{Higher Standby Cost}",
      formulaExplanation: "A trade-off, not a fitted equation. Backup & Restore (24h RTO) costs 1x; Pilot Light (2h RTO, 10 min RPO) about 2.5x; Warm Standby (10 min RTO) about 4x; Multi-Region Active-Active (under 30s RTO) about 7x in this model."
    },
    awsWhitepaper: {
      title: "Disaster Recovery of Workloads on AWS: Recovery in the Cloud",
      docCode: "AWS-DR-WHITE-2024",
      pillarBestPracticeCode: "REL13 - Plan for disaster recovery; REL14 - Automate recovery",
      canonicalQuote: "Test your disaster recovery strategies regularly. Automatically simulate outages and validate that systems recover within defined RTO and RPO boundaries."
    },
    buildersLibrary: {
      title: "Continuous resilience testing with Chaos Engineering",
      author: "Adrian Hornsby",
      role: "Principal Technical Evangelist, Architecture, AWS",
      coreInsight: "If you have not tested your failover runbook in the last 30 days under synthetic failure conditions, your failover system will not work during a real regional catastrophe."
    },
    complianceStandard: {
      standard: "NIST SP 800-34 Rev. 1",
      controlId: "Contingency Planning (CP) & Business Continuity",
      requirement: "Maintain documented and validated disaster recovery capabilities with measurable RTO and RPO metrics tested semi-annually."
    }
  },
  "executive-conclusion": {
    domainId: "executive-conclusion",
    domainNumber: 14,
    domainTitle: "Executive Conclusion & Architectural Verdict",
    lawOrTheorem: {
      name: "The Law of Demeter & Evolutionary Architecture Principle",
      founder: "Ian Holland / Neal Ford, Rebecca Parsons",
      year: "1987 / 2017",
      formalStatement: "An evolutionary architecture supports guided, incremental change across multiple dimensions. Architectural fitness functions protect core qualities from degrading over time.",
      architecturalApplication: "The AWS Well-Architected Framework acts as the definitive set of continuous architectural fitness functions, ensuring long-term maintainability, security, and financial viability.",
      mathematicalFormula: "\\text{Fitness}(A) = \\sum_{j=1}^{6} w_j \\cdot \\text{PillarScore}_j",
      formulaExplanation: "Composite architectural health is a weighted optimization function across all 6 Well-Architected pillars."
    },
    awsWhitepaper: {
      title: "AWS Well-Architected Framework: Continuous Improvement Cycle",
      docCode: "AWS-WAF-EXEC-SIGN-OFF",
      pillarBestPracticeCode: "OPS11 - Evolve operations; COST11 - Be a cost-effective organization",
      canonicalQuote: "Architecture is not a static one-time sign-off; it is a continuous evolution driven by data, testing, and periodic Well-Architected Reviews."
    },
    buildersLibrary: {
      title: "Building evolutionary architectures at Amazon",
      author: "Werner Vogels",
      role: "Chief Technology Officer, Amazon.com",
      coreInsight: "Systems change constantly. Build architectures that assume failure will happen, decouple every dependency, and treat security and operational excellence as continuous cultural disciplines."
    },
    complianceStandard: {
      standard: "NIST / ISO / SOC 2 Continuous Compliance",
      controlId: "Annual Executive Review & Architecture Re-certification",
      requirement: "Formal architectural re-evaluations must occur annually or upon major topology revisions."
    }
  }
};

// src/data/clientWorkloads.ts
var clientWorkloads = [
  {
    id: "ecommerce-cart",
    title: "High-Traffic E-Commerce & Shopping Cart Platform",
    category: "Retail & Consumer Web",
    iconName: "ShoppingCart",
    badge: "Flash-Sale Resilient",
    customerProfile: {
      clientType: "Fast-growing Direct-to-Consumer (DTC) Fashion Retailer",
      trafficScale: "20,000 daily active buyers with sudden 15x spikes during Black Friday & influencer drops (up to 300,000 concurrent shoppers)",
      businessNeed: "Seamless shopping cart state persistence, instant sub-50ms checkout responses, zero cart abandonment due to timeouts, and PCI-DSS compliant credit card handling.",
      criticalConstraints: [
        "Cart sessions must never drop even if backend servers crash or scale out",
        "Database write deadlocks during limited inventory drops must be 100% prevented",
        "Must cut idle server costs during non-peak midnight hours"
      ]
    },
    naiveApproach: {
      title: "Monolithic PHP/Node Server with Local Session Files & Single MySQL Instance",
      prescribedStack: "2x Over-provisioned m5.4xlarge EC2 instances + Single-AZ MySQL on gp2 storage + Local Apache sessions",
      flaws: [
        "Session affinity (sticky sessions) pins shoppers to a single EC2 instance; when that instance crashes, thousands lose their active carts",
        "Direct synchronous DB writes during flash checkout lock inventory rows, causing HTTP 504 timeouts and lost sales",
        "Over-provisioned $1,800/mo server capacity sits at 5% CPU 90% of the year"
      ],
      monthlyCost: 3850,
      annualWaste: 28400,
      failureRisk: "Cart session wipe on instance death; database connection saturation during flash drops"
    },
    wellArchSolution: {
      title: "Serverless Event-Driven E-Commerce with ElastiCache Redis & SQS Checkout",
      prescribedStack: "CloudFront Edge Caching + ALB + Auto-Scaled Fargate Graviton3 + ElastiCache Redis Cluster + Aurora Serverless v2 + SQS Order Queue",
      architectureHighlights: [
        "Active shopping carts stored in Redis with DynamoDB TTL backup: sub-2ms cart updates and zero session loss",
        "Asynchronous checkout via Amazon SQS: shoppers receive instant 200 OK order confirmation in 28ms while worker fleets process inventory smoothly",
        "CloudFront caches 94% of product catalog pages and product images at edge locations, preventing database strain"
      ],
      monthlyCost: 1420,
      netSavingsPercent: 63,
      annualCost: 17040,
      availabilitySLA: "99.99%",
      rto: "< 20 Seconds",
      rpo: "0 Seconds (Multi-AZ Replicated)"
    },
    costCuttingLevers: [
      {
        lever: "Edge Catalog Offload",
        description: "CloudFront absorbs 94% of product browsing hits, reducing compute cluster size from 8 instances to 2 baseline containers.",
        monthlySavings: "$1,200 / mo"
      },
      {
        lever: "Serverless Auto-Scaling",
        description: "Compute scales down to minimum baseline outside flash sales and scales out within 45 seconds during drops.",
        monthlySavings: "$780 / mo"
      },
      {
        lever: "Aurora Serverless v2 Rightsizing",
        description: "Database automatically scales ACUs from 0.5 to 16 dynamically instead of paying for always-on max provisioning.",
        monthlySavings: "$450 / mo"
      }
    ],
    simulatedFlow: [
      {
        stepName: "1. Catalog Browsing",
        service: "Amazon CloudFront & S3",
        latency: "12 ms",
        description: "Shopper browses product pages and images",
        naiveBehavior: "Every request hits EC2 and query joins relational MySQL tables (480ms latency)",
        wellArchBehavior: "CloudFront edge location serves cached HTML and WebP images with sub-15ms response"
      },
      {
        stepName: "2. Add to Cart",
        service: "Amazon ElastiCache Redis",
        latency: "2 ms",
        description: "Shopper adds item to cart; state stored in-memory",
        naiveBehavior: "Session stored on local EC2 disk; lost if server crashes or load-balancer reroutes",
        wellArchBehavior: "Multi-AZ Redis cluster stores encrypted cart object with cross-AZ replica in 2ms"
      },
      {
        stepName: "3. Checkout Submission",
        service: "Amazon SQS & API Gateway",
        latency: "24 ms",
        description: "Shopper clicks Buy Now; order submitted",
        naiveBehavior: "Synchronous DB transaction blocks web worker thread; crashes if inventory lock contention occurs",
        wellArchBehavior: "API Gateway places order into FIFO SQS queue; returns instant confirmation with order ID in 24ms"
      },
      {
        stepName: "4. Order Processing & Inventory",
        service: "AWS Lambda & Aurora Multi-AZ",
        latency: "45 ms (Background)",
        description: "Worker consumes queue and updates ledger",
        naiveBehavior: "Database connection pool exhausted by thousands of simultaneous checkout attempts",
        wellArchBehavior: "Serverless worker fleet consumes queue at steady rate; Aurora processes batch commits safely"
      }
    ],
    pillarsApplied: [
      { pillar: "Reliability", implementation: "Decoupled SQS queuing absorbs flash sale traffic surges without dropping orders" },
      { pillar: "Performance Efficiency", implementation: "In-memory Redis cart storage delivers sub-2ms response times" },
      { pillar: "Cost Optimization", implementation: "Serverless scale-to-zero compute eliminates idle night-time server bills (63% savings)" }
    ]
  },
  {
    id: "saas-multitenant",
    title: "Dynamic Web Application & Multi-Tenant B2B SaaS",
    category: "Enterprise SaaS",
    iconName: "Building",
    badge: "Tenant-Isolated & Scalable",
    customerProfile: {
      clientType: "B2B CRM & Workflow Automation SaaS Startup",
      trafficScale: "450 enterprise business clients (each with 50-500 employees), fluctuating heavily during business hours (9 AM - 5 PM)",
      businessNeed: "Strict tenant data isolation, sub-30ms dynamic API responses, role-based access control (RBAC), and rapid automated tenant onboarding.",
      criticalConstraints: [
        "Tenant data breach or cross-tenant data leakage is fatal to business existence",
        "Predictable cost per tenant: infrastructure spend must correlate directly with subscriber revenue",
        "High availability during global business hours across US and European timezones"
      ]
    },
    naiveApproach: {
      title: "Single Shared EC2 Server with Tenant ID in Query String",
      prescribedStack: "Single m5.2xlarge EC2 instance + Shared MySQL database with tenant_id column filtering + Hardcoded DB credentials",
      flaws: [
        "A single missing WHERE tenant_id = X in software leaks confidential corporate data across competitors",
        "No noisy neighbor protection: a single tenant running heavy exports saturates the CPU for all other 449 tenants",
        "Single point of failure: an OS patch or disk corruption brings all paying corporate clients down simultaneously"
      ],
      monthlyCost: 2950,
      annualWaste: 21600,
      failureRisk: "Cross-tenant data exposure liability; noisy neighbor resource exhaustion"
    },
    wellArchSolution: {
      title: "Containerized Multi-Tenant SaaS with IAM Tenant Isolation & Aurora Serverless",
      prescribedStack: "Route 53 Path Routing + ALB + ECS Fargate Microservices + AWS Cognito + Aurora Serverless v2 with Row-Level Security (RLS) + Secrets Manager",
      architectureHighlights: [
        "PostgreSQL Row-Level Security (RLS) and IAM Session Policies enforce hardware-level tenant isolation",
        "ECS Fargate container tasks auto-scale dynamically; noisy tenants are capped by API Gateway throttling limits",
        "AWS Secrets Manager rotates database passwords every 30 days automatically with zero downtime"
      ],
      monthlyCost: 1180,
      netSavingsPercent: 60,
      annualCost: 14160,
      availabilitySLA: "99.99%",
      rto: "< 30 Seconds",
      rpo: "0 Seconds (Aurora Synchronous Storage)"
    },
    costCuttingLevers: [
      {
        lever: "Fargate Container Density",
        description: "Pack microservice containers densely on Fargate ARM64 instead of over-provisioning dedicated virtual machines.",
        monthlySavings: "$950 / mo"
      },
      {
        lever: "Compute Scaling Outside Business Hours",
        description: "Auto-scaling reduces container task count from 18 during daytime to 2 baseline tasks overnight.",
        monthlySavings: "$520 / mo"
      },
      {
        lever: "Cognito Managed Authentication",
        description: "Replaces custom identity servers with AWS Cognito, eliminating server maintenance and patch cycles.",
        monthlySavings: "$300 / mo"
      }
    ],
    simulatedFlow: [
      {
        stepName: "1. Tenant Ingress & Auth",
        service: "Amazon Route 53 & Cognito",
        latency: "15 ms",
        description: "User visits tenant1.app.com and authenticates",
        naiveBehavior: "Plain username/password verified against unencrypted database table with static session token",
        wellArchBehavior: "Cognito issues short-lived JWT token containing tenant claims and IAM scoped permissions"
      },
      {
        stepName: "2. API Routing & WAF",
        service: "AWS Application Load Balancer & WAF",
        latency: "8 ms",
        description: "ALB inspects token and routes to microservice",
        naiveBehavior: "Direct public access to EC2 port 80 with zero rate-limiting or Layer 7 inspection",
        wellArchBehavior: "ALB validates SSL, terminates TLS 1.3, and applies tenant rate-limiting rules"
      },
      {
        stepName: "3. Isolated Compute Execution",
        service: "AWS ECS Fargate (Graviton3)",
        latency: "14 ms",
        description: "Microservice runs business logic in private subnet",
        naiveBehavior: "Heavy background task from Tenant A starves CPU for Tenant B",
        wellArchBehavior: "Container CPU quotas ensure complete performance isolation across tenant workloads"
      },
      {
        stepName: "4. Tenant-Isolated Data Query",
        service: "Aurora Serverless v2 (PostgreSQL RLS)",
        latency: "11 ms",
        description: "Database query executed with tenant filter",
        naiveBehavior: "Developer bug can query without WHERE tenant_id, leaking customer records",
        wellArchBehavior: "Postgres Row-Level Security automatically enforces tenant filter at kernel DB level"
      }
    ],
    pillarsApplied: [
      { pillar: "Security", implementation: "PostgreSQL Row-Level Security and short-lived Cognito JWT tokens guarantee tenant isolation" },
      { pillar: "Operational Excellence", implementation: "Infrastructure as Code provisions new tenant environments in under 3 minutes via Terraform" },
      { pillar: "Cost Optimization", implementation: "Dynamic auto-scaling matches cloud spend directly to active tenant usage (60% savings)" }
    ]
  },
  {
    id: "media-streaming",
    title: "Global Video Streaming & Media Content Delivery",
    category: "Media & Entertainment",
    iconName: "Video",
    badge: "Low-Latency CDN",
    customerProfile: {
      clientType: "Online Education & Video On Demand (VOD) Platform",
      trafficScale: "150,000 global students streaming high-definition video lessons across 40 countries",
      businessNeed: "Buffer-free video playback, fast global start times (<1 second), secure DRM tokenized access to prevent piracy, and minimal bandwidth egress fees.",
      criticalConstraints: [
        "Egress bandwidth bills can easily bankrupt media companies if traffic traverses origin servers",
        "Video chunks must stream with zero rebuffering even on mobile cellular connections",
        "Cold video archives (thousands of legacy lectures) must not incur premium storage costs"
      ]
    },
    naiveApproach: {
      title: "Origin EC2 Servers Streaming Directly from S3 Standard",
      prescribedStack: "4x c5.2xlarge streaming EC2 instances + S3 Standard bucket without CloudFront or Origin Shield",
      flaws: [
        "Paying peak S3 data transfer out ($0.09/GB) for all video playback across the globe ($7,200/mo just in bandwidth)",
        "Students in Europe or Asia experience 350ms+ latency and frequent buffering because all files stream from us-east-1",
        "Old lectures watched once a year cost the same $0.023/GB/mo as today\u2019s viral courses"
      ],
      monthlyCost: 8900,
      annualWaste: 64800,
      failureRisk: "Origin server collapse under concurrent streams; exorbitant egress bandwidth bills"
    },
    wellArchSolution: {
      title: "Edge-Accelerated Video Distribution with S3 Intelligent-Tiering & CloudFront",
      prescribedStack: "Amazon CloudFront (Origin Shield) + S3 Intelligent-Tiering + AWS Elemental MediaConvert + Lambda@Edge Signed URLs",
      architectureHighlights: [
        "CloudFront Origin Shield absorbs 96% of video chunk requests at edge locations worldwide, slashing egress bills by 68%",
        "S3 Intelligent-Tiering auto-archives unwatched lectures to Glacier Deep Archive, reducing storage costs from $1,150 to $310/mo",
        "Lambda@Edge generates cryptographically signed cookies in 4ms, preventing unauthorized link sharing and video piracy"
      ],
      monthlyCost: 2850,
      netSavingsPercent: 68,
      annualCost: 34200,
      availabilitySLA: "99.99%",
      rto: "< 15 Seconds",
      rpo: "0 Seconds (Multi-Region S3 Replication)"
    },
    costCuttingLevers: [
      {
        lever: "CloudFront Egress Discount Tiers",
        description: "Routing video traffic through CloudFront saves over 40% compared to raw S3 data transfer out fees.",
        monthlySavings: "$3,800 / mo"
      },
      {
        lever: "S3 Cold Object Archiving",
        description: "Automatically transitions untouched video files to Glacier Instant Retrieval and Deep Archive ($0.00099/GB).",
        monthlySavings: "$1,450 / mo"
      },
      {
        lever: "Eliminating Origin EC2 Streaming Fleet",
        description: "Videos stream directly from edge POPs; origin EC2 instances are eliminated entirely in favor of serverless APIs.",
        monthlySavings: "$800 / mo"
      }
    ],
    simulatedFlow: [
      {
        stepName: "1. Playback Request & Auth",
        service: "Lambda@Edge & CloudFront",
        latency: "8 ms",
        description: "Student clicks Play on 4K lecture",
        naiveBehavior: "Hits origin EC2 web server to validate session cookie against central database (220ms)",
        wellArchBehavior: "Lambda@Edge validates signed token at nearest edge POP in 8ms with zero origin traffic"
      },
      {
        stepName: "2. Video Chunk Retrieval",
        service: "CloudFront Origin Shield",
        latency: "14 ms",
        description: "Player requests video HLS stream chunks",
        naiveBehavior: "Requests travel cross-ocean to S3 us-east-1; high packet loss and video stuttering",
        wellArchBehavior: "Edge POP serves cached HLS chunks directly with 96% cache hit ratio"
      },
      {
        stepName: "3. Adaptive Bitrate Transcoding",
        service: "AWS Elemental MediaConvert",
        latency: "Automated",
        description: "Source videos encoded to 1080p, 720p, 480p",
        naiveBehavior: "Expensive GPU EC2 instances run FFmpeg manually and sit idle between uploads",
        wellArchBehavior: "Event-driven serverless MediaConvert pays only per minute of video transcoded"
      },
      {
        stepName: "4. Cold Archive Migration",
        service: "S3 Intelligent-Tiering",
        latency: "Automated",
        description: "Videos older than 90 days tiered down",
        naiveBehavior: "Unwatched lectures sit on S3 Standard forever at peak price",
        wellArchBehavior: "Zero-effort automated transition to Glacier saves 72% with instant retrieval"
      }
    ],
    pillarsApplied: [
      { pillar: "Performance Efficiency", implementation: "CloudFront edge distribution brings video streaming sub-15ms from users worldwide" },
      { pillar: "Cost Optimization", implementation: "Origin Shield caching and Glacier archiving reduce monthly bills by 68%" },
      { pillar: "Sustainability", implementation: "Eliminating idle origin streaming servers reduces server kilowatt-hour consumption" }
    ]
  },
  {
    id: "fintech-payments",
    title: "Financial FinTech & Payment Gateway Platform",
    category: "Financial Services",
    iconName: "CreditCard",
    badge: "Zero Data Loss (RPO=0)",
    customerProfile: {
      clientType: "Digital Neobank & Real-Time Payment Settlement Gateway",
      trafficScale: "12,000 payment authorizations per minute ($45M daily settlement volume)",
      businessNeed: "Guaranteed RPO = 0 (zero lost transaction cents), sub-40ms ledger authorization, strict PCI-DSS Level 1 compliance, and multi-region disaster recovery.",
      criticalConstraints: [
        "A single transaction lost during a datacenter failure causes regulatory investigation and immediate license revocation",
        "Cryptographic keys (HSMs) must protect card numbers with hardware-enforced isolation",
        "End-to-end TLS 1.3 encryption with strict immutable audit logging"
      ]
    },
    naiveApproach: {
      title: "Single-Region PostgreSQL with Nightly Backups & App-Level Encryption Keys",
      prescribedStack: "2x EC2 instances running payment app + RDS PostgreSQL Single-AZ + Keys saved in application .env files",
      flaws: [
        "Encryption keys stored on application filesystem violate PCI-DSS compliance; a single server compromise leaks all cardholder data",
        "Single-AZ database: if the availability zone fails, hours of pending transactions are lost (RPO = 24 hours)",
        "Synchronous REST chaining to third-party bank partners causes ledger timeouts and double-charge errors"
      ],
      monthlyCost: 5400,
      annualWaste: 38e3,
      failureRisk: "PCI-DSS decertification; double-charging transactions; catastrophic data loss on AZ failure"
    },
    wellArchSolution: {
      title: "Multi-Region Active-Active Ledger with AWS KMS HSMs & Aurora Global Database",
      prescribedStack: "Route 53 ARC + AWS WAF + ECS Fargate (Private Subnet) + AWS KMS (Custom Key Store / CloudHSM) + Aurora Global Database + EventBridge Audit Ledger",
      architectureHighlights: [
        "AWS KMS Customer Managed Keys backed by FIPS 140-3 Level 3 HSMs encrypt all card data at rest and in flight",
        "Amazon Aurora Global Database provides physical storage-level replication across 2 AWS regions in under 1 second",
        "Amazon EventBridge captures every authorization event into an immutable S3 Object Lock audit bucket for 7-year regulatory retention"
      ],
      monthlyCost: 2450,
      netSavingsPercent: 55,
      annualCost: 29400,
      availabilitySLA: "99.999% (5 Nines)",
      rto: "< 15 Seconds",
      rpo: "0 Seconds (Storage Quorum)"
    },
    costCuttingLevers: [
      {
        lever: "KMS Envelope Encryption Caching",
        description: "Local KMS data key caching reduces redundant KMS API calls from millions to thousands, slashing API fees.",
        monthlySavings: "$1,600 / mo"
      },
      {
        lever: "Right-Sized Aurora Global Replication",
        description: "Dedicated storage-level replication eliminates the need for expensive cross-region compute bridge servers.",
        monthlySavings: "$850 / mo"
      },
      {
        lever: "Serverless Compliance Auditing",
        description: "Serverless EventBridge & Athena replace heavy third-party SIEM virtual appliances ($500/mo server cost avoided).",
        monthlySavings: "$500 / mo"
      }
    ],
    simulatedFlow: [
      {
        stepName: "1. Ingress & TLS Handshake",
        service: "AWS WAF & ALB",
        latency: "6 ms",
        description: "Payment authorization request enters VPC",
        naiveBehavior: "Old TLS 1.0/1.1 accepted; vulnerable to MITM attacks and fails PCI audit",
        wellArchBehavior: "Strict TLS 1.3 with AWS WAF payload inspection rejects SQL injection and tampering in 6ms"
      },
      {
        stepName: "2. Card Tokenization",
        service: "AWS KMS (CloudHSM)",
        latency: "4 ms",
        description: "PAN card number tokenized with HSM key",
        naiveBehavior: "Symmetric key saved in application memory; stolen if memory dump is captured",
        wellArchBehavior: "FIPS 140-3 Level 3 hardware HSM generates token; plaintext PAN never touches application disk"
      },
      {
        stepName: "3. Ledger Debit Transaction",
        service: "Amazon Aurora Multi-AZ (Quorum)",
        latency: "18 ms",
        description: "Transaction recorded in balance ledger",
        naiveBehavior: "Single database disk write; vulnerable to power loss before flush",
        wellArchBehavior: "Aurora 6-way storage writes synchronously across 3 AZs; 4/6 quorum confirmation in 18ms"
      },
      {
        stepName: "4. Immutable Audit Ledger",
        service: "Amazon EventBridge & S3 Object Lock",
        latency: "10 ms (Async)",
        description: "Event streamed to immutable compliance vault",
        naiveBehavior: "Logs stored on local disk; admin can tamper with or delete audit logs",
        wellArchBehavior: "S3 Object Lock in Compliance Mode prevents modification or deletion even by root for 7 years"
      }
    ],
    pillarsApplied: [
      { pillar: "Security", implementation: "FIPS 140-3 HSM key management and PCI-DSS Level 1 compliance guardrails" },
      { pillar: "Reliability", implementation: "Aurora Global Database achieves RPO = 0 and sub-15s regional failover" },
      { pillar: "Operational Excellence", implementation: "Immutable EventBridge audit trails provide 100% forensic visibility" }
    ]
  },
  {
    id: "healthcare-hipaa",
    title: "Healthcare & Telemedicine Patient Records (HIPAA)",
    category: "Healthcare & Life Sciences",
    iconName: "Activity",
    badge: "HIPAA WORM Compliant",
    customerProfile: {
      clientType: "National Telehealth Provider & Digital Health Record System",
      trafficScale: "85,000 daily doctor-patient video consultations and 2.5TB of daily medical imaging (DICOM/MRI)",
      businessNeed: "HIPAA compliance certification, permanent protection against ransomware deletion, sub-100ms retrieval of historical patient charts during surgery, and strict least-privilege doctor access.",
      criticalConstraints: [
        "Patient Protected Health Information (PHI) must be encrypted at rest and in transit",
        "Records must remain immutable for 7 years under HIPAA rule; accidental deletion or cryptoware is illegal",
        "Database must reside in private isolated subnets with zero internet ingress routes"
      ]
    },
    naiveApproach: {
      title: "Flat S3 Bucket with Public ACLs & Un-partitioned EBS Storage",
      prescribedStack: "Unmanaged EC2 instance holding patient database + S3 Standard bucket without Object Lock + Static IAM user credentials",
      flaws: [
        'Ransomware can execute "aws s3 rm --recursive" and permanently wipe medical histories',
        "Static developer credentials leaked on GitHub expose private patient charts to internet crawlers",
        "Paying peak storage pricing ($0.023/GB) for millions of 5-year-old medical scans that are never viewed"
      ],
      monthlyCost: 6200,
      annualWaste: 44e3,
      failureRisk: "Catastrophic HIPAA violation fines ($50,000 per record); permanent loss of patient medical records"
    },
    wellArchSolution: {
      title: "HIPAA-Compliant Encrypted Vault with S3 Object Lock & Private isolated Subnets",
      prescribedStack: "Private VPC (3-Tier) + S3 Object Lock (Compliance Mode) + S3 Intelligent-Tiering + AWS KMS CMK + Aurora Multi-AZ + AWS Backup",
      architectureHighlights: [
        "S3 Object Lock enforces WORM (Write Once, Read Many): objects cannot be deleted even by root credentials",
        "S3 Intelligent-Tiering automatically archives scans older than 30 days to Glacier, cutting monthly storage costs by 74%",
        "All compute communicates with S3 via Gateway VPC Endpoints, keeping private medical scans off the public internet"
      ],
      monthlyCost: 1650,
      netSavingsPercent: 73,
      annualCost: 19800,
      availabilitySLA: "99.999%",
      rto: "< 30 Seconds",
      rpo: "0 Seconds (11 9s Durability)"
    },
    costCuttingLevers: [
      {
        lever: "Intelligent Storage Tiering",
        description: "Medical scans older than 30 days automatically move to Glacier Deep Archive ($0.00099/GB) saving 74% on storage.",
        monthlySavings: "$3,100 / mo"
      },
      {
        lever: "Gateway VPC Endpoints",
        description: "Traffic to S3 routes via free Gateway Endpoints instead of paying NAT Gateway per-GB processing fees.",
        monthlySavings: "$850 / mo"
      },
      {
        lever: "Automated Snapshot Lifecycle",
        description: "AWS Backup moves database snapshots to cold storage after 14 days, preventing snapshot sprawl.",
        monthlySavings: "$600 / mo"
      }
    ],
    simulatedFlow: [
      {
        stepName: "1. Doctor Chart Lookup",
        service: "Private Subnet ALB & ECS",
        latency: "18 ms",
        description: "Physician accesses patient record in surgery",
        naiveBehavior: "Requests travel over public internet to server public IP; unencrypted in transit",
        wellArchBehavior: "Requests route through private TLS 1.3 ALB inside private application subnet"
      },
      {
        stepName: "2. DICOM Image Retrieval",
        service: "S3 via Gateway VPC Endpoint",
        latency: "25 ms",
        description: "50MB MRI scan loaded into viewer",
        naiveBehavior: "Data routes through NAT Gateway incurring $0.045/GB bandwidth penalty fees",
        wellArchBehavior: "Traffic stays on private AWS network backbone via Gateway Endpoint with zero transit fees"
      },
      {
        stepName: "3. Ransomware Attempt Block",
        service: "S3 Object Lock Compliance Mode",
        latency: "2 ms",
        description: "Malicious script attempts to wipe bucket",
        naiveBehavior: "Bucket wiped completely; ransomware operator extorts hospital for millions",
        wellArchBehavior: "S3 Object Lock rejects delete API call with 403 AccessDenied; alert dispatched to GuardDuty"
      },
      {
        stepName: "4. Immutable Recovery Point",
        service: "AWS Backup Vault Lock",
        latency: "Continuous",
        description: "Air-gapped immutable backup created",
        naiveBehavior: "No backups exist or backups stored in same account accessible by compromised admin key",
        wellArchBehavior: "Air-gapped secondary AWS account holds immutable backup recovery points"
      }
    ],
    pillarsApplied: [
      { pillar: "Security", implementation: "S3 Object Lock WORM compliance and private Gateway VPC Endpoints prevent breaches" },
      { pillar: "Cost Optimization", implementation: "Automated Glacier cold tiering cuts storage spend by 74% while maintaining 11 9s durability" },
      { pillar: "Reliability", implementation: "AWS Backup Vault Lock ensures ransomware recovery within 30 seconds" }
    ]
  },
  {
    id: "iot-streaming",
    title: "Real-Time Connected Fleet IoT & Telemetry Platform",
    category: "IoT & Connected Devices",
    iconName: "Cpu",
    badge: "100k TPS Ingestion",
    customerProfile: {
      clientType: "Autonomous Fleet Management & Smart Logistics Enterprise",
      trafficScale: "50,000 delivery vehicles streaming GPS, engine temperature, and accelerometer telemetry every 3 seconds (~100,000 transactions/sec)",
      businessNeed: "Continuous real-time anomaly detection (engine overheating), geofencing alerts in <1 second, and petabyte-scale historical analytics for route optimization.",
      criticalConstraints: [
        "Burst traffic from all vehicles cannot crash ingestion endpoints",
        "Storing raw sensor logs in relational databases will exhaust disk IOPS and balloon costs",
        "Cost per sensor event must remain under $0.000001 to maintain business profitability"
      ]
    },
    naiveApproach: {
      title: "HTTP REST Endpoints Inserting Directly into MongoDB/MySQL on EC2",
      prescribedStack: "Cluster of 6x c5.xlarge ingestion servers + MongoDB on unpartitioned EBS gp2 disks",
      flaws: [
        "Vehicles reconnecting after cellular dead zones trigger massive thundering herds that crash HTTP web servers",
        "High disk I/O write locks freeze database queries; queries for live vehicle locations take 12+ seconds",
        "Massive $4,500/mo server cluster runs 24/7 paying for peak capacity even when vehicles are parked overnight"
      ],
      monthlyCost: 5800,
      annualWaste: 42e3,
      failureRisk: "Ingestion pipeline dropped events; database storage exhaustion; unmanageable fleet bills"
    },
    wellArchSolution: {
      title: "Serverless Streaming Lakehouse with AWS IoT Core, Kinesis, & Athena Parquet",
      prescribedStack: "AWS IoT Core (MQTT) + Amazon Kinesis Data Streams + AWS Lambda + Amazon DynamoDB (On-Demand) + Kinesis Firehose + S3 Parquet Data Lake",
      architectureHighlights: [
        "AWS IoT Core terminates lightweight MQTT connections, consuming 90% less cellular data bandwidth than HTTP",
        "Amazon Kinesis buffers up to 100,000 events/sec smoothly with zero dropped packets during cellular reconnect bursts",
        "Kinesis Firehose converts raw JSON telemetry into compressed Apache Parquet format in S3, reducing query scan costs by 92%"
      ],
      monthlyCost: 1520,
      netSavingsPercent: 74,
      annualCost: 18240,
      availabilitySLA: "99.99%",
      rto: "< 30 Seconds",
      rpo: "0 Seconds (Stream Replicated)"
    },
    costCuttingLevers: [
      {
        lever: "Columnar Parquet Compression",
        description: "Compressing sensor logs from JSON to Parquet in S3 reduces query data scanned by Amazon Athena from 10TB to 800GB.",
        monthlySavings: "$2,300 / mo"
      },
      {
        lever: "MQTT Lightweight Protocol",
        description: "Binary MQTT over IoT Core eliminates heavy HTTP header overhead, slashing device data transmission fees.",
        monthlySavings: "$1,100 / mo"
      },
      {
        lever: "DynamoDB On-Demand Live State",
        description: "Stores current vehicle locations in DynamoDB with sub-5ms lookups, paying strictly per write instead of provisioned capacity.",
        monthlySavings: "$880 / mo"
      }
    ],
    simulatedFlow: [
      {
        stepName: "1. MQTT Telemetry Ping",
        service: "AWS IoT Core",
        latency: "4 ms",
        description: "Vehicle streams GPS & engine diagnostics",
        naiveBehavior: "Heavy HTTP POST headers consume cellular data; web server thread blocked per connection",
        wellArchBehavior: "Lightweight binary MQTT payload validated and ingested by managed AWS IoT Core in 4ms"
      },
      {
        stepName: "2. Stream Ingestion Buffer",
        service: "Amazon Kinesis Data Streams",
        latency: "6 ms",
        description: "Stream buffered across resilient shards",
        naiveBehavior: "Database disk writes hit IOPS limit; incoming telemetry dropped permanently",
        wellArchBehavior: "Kinesis buffers 100,000 events/sec across shards; decouples ingestion from storage"
      },
      {
        stepName: "3. Real-Time Alert Evaluation",
        service: "AWS Lambda & Amazon DynamoDB",
        latency: "15 ms",
        description: "Engine temperature checked for overheat",
        naiveBehavior: "Batch script runs every 10 minutes; driver alerted too late after engine breaks down",
        wellArchBehavior: "Lambda triggers in 15ms; if temperature > 105\xB0C, SNS dispatches instant push alert"
      },
      {
        stepName: "4. Columnar Data Lake Archiving",
        service: "Kinesis Firehose & S3 Athena",
        latency: "60 s (Batch)",
        description: "Historical telemetry compressed to Parquet",
        naiveBehavior: "Raw JSON text files accumulate in expensive relational tables, bloating queries",
        wellArchBehavior: "Firehose buffers, batches, and writes snappy-compressed Parquet files to S3 data lake"
      }
    ],
    pillarsApplied: [
      { pillar: "Performance Efficiency", implementation: "Kinesis stream processing processes 100k events/sec in real time" },
      { pillar: "Cost Optimization", implementation: "Apache Parquet columnar conversion reduces analytics query costs by 92%" },
      { pillar: "Reliability", implementation: "Stream buffers eliminate packet drop when thousands of vehicles reconnect simultaneously" }
    ]
  }
];

// src/data/pillarsData.ts
var pillarDetails = [
  {
    id: "Operational Excellence",
    name: "Operational Excellence",
    tagline: "Run workloads effectively, understand operations, and continuously improve processes.",
    officialDefinition: "The Operational Excellence pillar focuses on executing and monitoring systems, continually improving processes and procedures, and delivering business value.",
    color: "#0066cc",
    iconName: "Activity",
    designPrinciples: [
      {
        title: "Perform operations as code",
        explanation: "Define entire workloads as code (IaC) and update them using automated deployment procedures to eliminate configuration drift."
      },
      {
        title: "Make frequent, small, reversible changes",
        explanation: "Design workloads so that components can be updated regularly in small increments that can be quickly rolled back if failure occurs."
      },
      {
        title: "Refine operations procedures frequently",
        explanation: "Regularly schedule game days to review operational procedures and verify that all team members are familiar with recovery workflows."
      },
      {
        title: "Anticipate failure",
        explanation: "Perform pre-mortems to identify potential failure sources and test disaster recovery scenarios with simulated chaos injection."
      },
      {
        title: "Learn from all operational failures",
        explanation: "Conduct blameless post-incident reviews (COEs) and automate preventive measures so the same failure never recurs."
      }
    ],
    keyQuestions: [
      {
        code: "OPS 1",
        question: "How do you determine what your priorities are for operational excellence?",
        bestPractice: "Align operational focus with customer needs and organizational business drivers."
      },
      {
        code: "OPS 4",
        question: "How do you implement observability in your workload?",
        bestPractice: "Capture distributed traces, centralize structured logs, and compute business-level KPIs with CloudWatch Container Insights & X-Ray."
      },
      {
        code: "OPS 7",
        question: "How do you evolve your workload using automated delivery?",
        bestPractice: "Use automated CI/CD pipelines with rollback triggers driven by automated metric alarms."
      }
    ],
    antiPatternVsBestPractice: [
      {
        antiPattern: "Manual configuration via AWS Console (ClickOps)",
        bestPractice: "100% Terraform / CloudFormation with automated GitOps pipelines"
      },
      {
        antiPattern: "Inspecting local text log files on individual servers after customer complaints",
        bestPractice: "Centralized streaming logs, X-Ray traces, and automated EventBridge self-healing alarms"
      }
    ],
    relatedDomainIds: ["monitoring-elasticity", "automating-architecture", "connecting-network"]
  },
  {
    id: "Security",
    name: "Security",
    tagline: "Protect information, systems, and assets through defense in depth and automated guardrails.",
    officialDefinition: "The Security pillar focuses on protecting data, systems, and assets while taking advantage of cloud technologies to improve your security posture.",
    color: "#c9302c",
    iconName: "Shield",
    designPrinciples: [
      {
        title: "Implement a strong identity foundation",
        explanation: "Enforce principle of least privilege, eliminate static IAM keys, and require multi-factor authentication with short-lived tokens via AWS STS."
      },
      {
        title: "Enable traceability",
        explanation: "Log, monitor, and audit all actions in real-time with AWS CloudTrail, VPC Flow Logs, and Amazon GuardDuty ML anomaly detection."
      },
      {
        title: "Apply security at all layers",
        explanation: "Defense in depth: deploy edge WAF, VPC security groups, private subnets, and host-level container firewalls rather than relying on a single perimeter."
      },
      {
        title: "Automate security best practices",
        explanation: "Use software-based security mechanisms that analyze code and auto-remediate policy violations in real time."
      },
      {
        title: "Protect data in transit and at rest",
        explanation: "Enforce TLS 1.3 encryption across all communication and use AWS KMS Customer Managed Keys (CMK) with automated key rotation."
      },
      {
        title: "Keep people away from data",
        explanation: "Create tools and automated pipelines to reduce direct manual database and server console access, preventing human error."
      }
    ],
    keyQuestions: [
      {
        code: "SEC 1",
        question: "How do you securely operate your workload?",
        bestPractice: "Apply strict least-privilege IAM policies, AWS Organizations SCPs, and continuous compliance checks via AWS Config."
      },
      {
        code: "SEC 3",
        question: "How do you manage human and machine identities?",
        bestPractice: "Use IAM Identity Center for SSO and IAM Roles with temporary STS credentials for EC2 and Lambda execution."
      },
      {
        code: "SEC 8",
        question: "How do you protect your data at rest?",
        bestPractice: "Enforce default bucket encryption with KMS CMK, enable S3 Object Lock, and verify that public ACLs are blocked by SCP."
      }
    ],
    antiPatternVsBestPractice: [
      {
        antiPattern: "Hardcoded static IAM Access Keys in code with AdministratorAccess",
        bestPractice: "IAM Roles with ephemeral STS tokens, automated 30-day Secrets Manager rotation, and least-privilege boundaries"
      },
      {
        antiPattern: "Databases and backend servers residing in public subnets with 0.0.0.0/0 ingress",
        bestPractice: "3-tier VPC architecture with completely isolated private subnets and VPC Endpoints"
      }
    ],
    relatedDomainIds: ["securing-application", "networking-environment", "storage-layer"]
  },
  {
    id: "Reliability",
    name: "Reliability",
    tagline: "Recover from disruptions, dynamically adapt to demand, and mitigate failure blast radiuses.",
    officialDefinition: "The Reliability pillar ensures that a workload performs its intended function correctly and consistently when expected to, and quickly recovers from failures.",
    color: "#1e7e34",
    iconName: "RefreshCw",
    designPrinciples: [
      {
        title: "Automatically recover from failure",
        explanation: "Monitor workload KPIs and automate self-healing workflows (such as Auto Scaling replacement and Aurora replica promotion) when thresholds breach."
      },
      {
        title: "Test recovery procedures",
        explanation: "Simulate disaster scenarios with Chaos Engineering to validate automatic failover paths before real outages occur."
      },
      {
        title: "Scale horizontally to increase aggregate workload availability",
        explanation: "Replace single large resources with multiple small instances to reduce the impact of any individual failure."
      },
      {
        title: "Stop guessing capacity",
        explanation: "Monitor demand and automate resource provisioning with predictive Auto Scaling to prevent saturation failures."
      },
      {
        title: "Manage change in automation",
        explanation: "Changes to infrastructure should be made using automation and tracked in version control."
      }
    ],
    keyQuestions: [
      {
        code: "REL 1",
        question: "How do you manage service quotas and constraints?",
        bestPractice: "Use AWS Service Quotas with proactive CloudWatch alarms to prevent hitting hard API limits."
      },
      {
        code: "REL 6",
        question: "How do you design your workload to withstand component failures?",
        bestPractice: "Deploy multi-AZ topologies, eliminate single points of failure (SPOFs), and implement circuit breakers and retries with exponential backoff."
      },
      {
        code: "REL 13",
        question: "How do you plan for disaster recovery (DR)?",
        bestPractice: "Define RTO and RPO targets, replicate critical data across AWS regions, and test failover with automated game days."
      }
    ],
    antiPatternVsBestPractice: [
      {
        antiPattern: "Single EC2 instance and single-AZ database (Single Point of Failure)",
        bestPractice: "Multi-AZ Auto Scaling compute with Aurora Multi-AZ automatic failover in <30 seconds"
      },
      {
        antiPattern: "Synchronous REST chaining where one service outage takes down the entire site",
        bestPractice: "Loosely coupled event-driven queuing with Amazon SQS, SNS, and Dead Letter Queues"
      }
    ],
    relatedDomainIds: ["compute-layer", "database-layer", "decoupled-architectures", "disaster-recovery"]
  },
  {
    id: "Performance Efficiency",
    name: "Performance Efficiency",
    tagline: "Use computing resources efficiently to meet requirements and maintain efficiency as demand evolves.",
    officialDefinition: "The Performance Efficiency pillar focuses on using computing resources efficiently to meet system requirements, and maintaining that efficiency as demand changes and technologies evolve.",
    color: "#9a5b00",
    iconName: "Zap",
    designPrinciples: [
      {
        title: "Democratize advanced technologies",
        explanation: "Use managed and serverless technologies (like Aurora, DynamoDB, and Kinesis) rather than asking teams to host and maintain complex database clusters."
      },
      {
        title: "Go global in minutes",
        explanation: "Deploy workloads in multiple AWS Regions and Edge Locations worldwide using CloudFront to reduce latency for global customers."
      },
      {
        title: "Use serverless architectures",
        explanation: "Serverless architectures remove the operational burden of managing physical or virtual servers, scaling automatically with request demand."
      },
      {
        title: "Experiment more often",
        explanation: "With virtual and automatable resources, quickly carry out comparative performance testing using different instance types or configurations."
      },
      {
        title: "Consider mechanical sympathy",
        explanation: "Understand how cloud services work to select the optimal technology for your workload (e.g., in-memory Redis vs SSD relational queries)."
      }
    ],
    keyQuestions: [
      {
        code: "PERF 1",
        question: "How do you select the best performing architecture?",
        bestPractice: "Benchmark workload characteristics against compute, storage, database, and networking options."
      },
      {
        code: "PERF 2",
        question: "How do you select your compute solution?",
        bestPractice: "Choose Graviton ARM instances or serverless Lambda functions matched to workload profile."
      },
      {
        code: "PERF 4",
        question: "How do you evolve your data architecture for high performance?",
        bestPractice: "Implement multi-tier caching with CloudFront and ElastiCache Redis, and offload read queries to read replicas."
      }
    ],
    antiPatternVsBestPractice: [
      {
        antiPattern: "Directly querying relational databases for every static asset and repeated lookup",
        bestPractice: "CloudFront edge caching with 90%+ offload and ElastiCache Redis in-memory cache-aside"
      },
      {
        antiPattern: "Running heavy analytic SQL queries on live production transactional OLTP database",
        bestPractice: "Decoupled serverless data lake with Kinesis streaming, S3 Parquet storage, and Athena queries"
      }
    ],
    relatedDomainIds: ["caching-content", "compute-layer", "datapipelines"]
  },
  {
    id: "Cost Optimization",
    name: "Cost Optimization",
    tagline: "Avoid unnecessary costs, understand spending trends, and scale costs proportionally to business value.",
    officialDefinition: "The Cost Optimization pillar focuses on avoiding unnecessary costs, analyzing and attributing spend, and picking the most cost-effective resources at the right scale.",
    color: "#6b3fd6",
    iconName: "DollarSign",
    designPrinciples: [
      {
        title: "Implement cloud financial management (FinOps)",
        explanation: "Establish organizational commitment to cost awareness, automated budget alerts, and resource tagging governance."
      },
      {
        title: "Adopt a consumption model",
        explanation: "Pay only for what you use by shutting down idle development resources and adopting auto-scaling or serverless scale-to-zero."
      },
      {
        title: "Measure overall efficiency",
        explanation: "Measure the business output of the workload against infrastructure spend to ensure cost correlates directly with revenue."
      },
      {
        title: "Stop spending money on undifferentiated heavy lifting",
        explanation: "Let AWS manage operating system patching, database replication, and networking hardware so engineers can focus on business logic."
      },
      {
        title: "Analyze and attribute expenditure",
        explanation: "Enforce granular cost allocation tags to identify which microservices, teams, or environments generate costs."
      }
    ],
    keyQuestions: [
      {
        code: "COST 1",
        question: "How do you implement cloud financial management?",
        bestPractice: "Integrate AWS Cost Explorer, Budgets, and Cost Anomaly Detection with Slack or email alerts."
      },
      {
        code: "COST 5",
        question: "How do you optimize resource costs over time?",
        bestPractice: "Leverage Savings Plans, Compute Optimizer recommendations, and migrate legacy gp2 to gp3."
      },
      {
        code: "COST 7",
        question: "How do you optimize data transfer and storage costs?",
        bestPractice: "Use S3 Intelligent-Tiering, Gateway VPC Endpoints, and CloudFront egress discount tiers."
      }
    ],
    antiPatternVsBestPractice: [
      {
        antiPattern: "Over-provisioning 3TB EBS gp2 disks and keeping static files in S3 Standard forever",
        bestPractice: "EBS gp3 decoupled IOPS + S3 Intelligent-Tiering with automated Glacier cold storage archiving (72% savings)"
      },
      {
        antiPattern: "Paying 24/7 for idle EC2 servers sitting at 3% CPU utilization overnight",
        bestPractice: "Event-driven serverless with AWS Lambda, API Gateway, and DynamoDB paying strictly per millisecond"
      }
    ],
    relatedDomainIds: ["storage-layer", "serverless-microservices", "caching-content"]
  },
  {
    id: "Sustainability",
    name: "Sustainability",
    tagline: "Minimize environmental impact, maximize resource utilization, and eliminate idle energy waste.",
    officialDefinition: "The Sustainability pillar focuses on minimizing environmental impacts of running cloud workloads through right-sizing, modern silicon, and serverless adoption.",
    color: "#0f766e",
    iconName: "Leaf",
    designPrinciples: [
      {
        title: "Understand your impact",
        explanation: "Measure the carbon emissions and resource consumption of your workloads using the AWS Customer Carbon Footprint Tool."
      },
      {
        title: "Establish sustainability goals",
        explanation: "Set measurable targets to increase compute density and decrease idle kilowatt-hours per user transaction."
      },
      {
        title: "Maximize utilization",
        explanation: "Right-size compute instances, pack containers densely on AWS Fargate/ECS, and use auto-scaling to match actual customer demand."
      },
      {
        title: "Anticipate and adopt new, more efficient hardware and software",
        explanation: "Migrate legacy x86 workloads to AWS Graviton processors, which deliver up to 60% better energy efficiency."
      },
      {
        title: "Use managed services",
        explanation: "Managed services share infrastructure across multiple customers, drastically increasing physical server utilization and energy efficiency."
      },
      {
        title: "Reduce the downstream impact of your cloud workloads",
        explanation: "Compress static assets, implement edge caching, and reduce network data transmission to lower energy usage on client devices."
      }
    ],
    keyQuestions: [
      {
        code: "SUS 1",
        question: "How do you select Region and service architectures to support sustainability?",
        bestPractice: "Choose AWS Regions powered by renewable energy and leverage managed serverless architectures."
      },
      {
        code: "SUS 2",
        question: "How do you take advantage of user behavior to improve sustainability?",
        bestPractice: "Scale down test and staging environments outside of business hours and optimize retention periods."
      },
      {
        code: "SUS 4",
        question: "How do you optimize your data storage to reduce carbon footprint?",
        bestPractice: "Archive or expire cold data using S3 lifecycle rules and compress files with modern snappy/gzip algorithms."
      }
    ],
    antiPatternVsBestPractice: [
      {
        antiPattern: "Over-provisioned x86 servers running 24/7 with 95% idle compute cycles",
        bestPractice: "Energy-efficient AWS Graviton3 ARM silicon and scale-to-zero serverless architectures"
      },
      {
        antiPattern: "Storing uncompressed raw data indefinitely across multiple unneeded availability zones",
        bestPractice: "Parquet columnar compression and automated lifecycle expiration of transient logs"
      }
    ],
    relatedDomainIds: ["compute-layer", "serverless-microservices", "storage-layer"]
  }
];

// src/data/deck/moduleScripts.ts
var moduleScripts = [
  // 1. Architecture Overview
  {
    points: [
      "Anyone can launch a server in 5 minutes \u2014 keeping it alive is true architecture",
      "Single points of failure turn minor glitches into total company outages",
      "AWS Well-Architected decouples every layer across 3 physical Availability Zones"
    ],
    theory: "Welcome to Architecture Overview! Launching a single cloud server takes five minutes, but keeping it alive under fifty thousand shoppers is true engineering. We cater to our customer by decoupling web, compute, and database tiers across three physical Availability Zones for automated self-healing.",
    leftRest: "Notice the fragile anti-pattern on the left under normal load. All traffic funnels into one lonely server with red single point of failure tags warning of total downtime.",
    rightRest: "Over on the right, CloudFront shields the edge, an Application Load Balancer spreads requests across three zones, and Aurora maintains standby replicas with green high-availability tags.",
    underFailure: "Watch what happens when a data center loses power! The naive server shakes red and drops every customer request. But on the right, traffic reroutes in seconds, keeping four nines availability and cutting spend fifty-nine percent."
  },
  // 2. Storage Layer
  {
    points: [
      "Ransomware and accidental deletions can wipe unversioned storage in seconds",
      "Over-provisioned EBS gp2 and flat unversioned S3 buckets create massive risk",
      "S3 Object Lock enforces WORM immutability and Intelligent-Tiering saves 72%"
    ],
    theory: "Welcome to Storage. Imagine you are MediCloud, protecting fifty terabytes of patient medical scans. A rogue delete script on an unversioned bucket could wipe out years of medical history. We cater to MediCloud using S3 Object Lock for write-once immutability and Intelligent-Tiering for automatic archiving.",
    leftRest: "Look at the naive setup on the left where our server writes to expensive gp2 disks and an unversioned bucket, marked with red single point of failure tags.",
    rightRest: "Over on the right, we modernize to gp3, lock patient scans with S3 Object Lock, and automate Glacier Deep Archive transitions with green high-availability tags.",
    underFailure: "Now we inject ransomware! The naive bucket turns bright red and files are lost forever. But on the right, S3 Object Lock rejects every unauthorized delete, keeping patient records safe with four nines uptime and saving seventy-two percent."
  },
  // 3. Compute Layer
  {
    points: [
      "One giant server hits a hardware wall and wastes thousands of dollars when idle",
      "Monolithic EC2 instances in a single zone cause 100% blast radius when overloaded",
      "Stateless Graviton ARM64 instances scale horizontally across 3 zones with Spot savings"
    ],
    theory: "In Compute, meet ShopStream. Everyday traffic is five thousand shoppers, but Black Friday surges to fifty thousand. Relying on one giant server is like betting your entire business on a single overheating engine. We cater to ShopStream with auto-scaling fleets of stateless Graviton containers across three zones.",
    leftRest: "Notice the naive setup on the left where every shopper hits one monolithic virtual machine. Red single point of failure tags warn that memory exhaustion will freeze checkout.",
    rightRest: "Over on the right, an Application Load Balancer distributes requests across stateless Graviton containers, with Auto Scaling and Spot capacity delivering maximum horsepower with green high-availability tags.",
    underFailure: "Now we inject a ten-times flash surge as data center zone one-a crashes! The naive monolith locks up and dies. But on the right, the load balancer shifts traffic in ten seconds, holding four nines uptime and saving seventy-one percent."
  },
  // 4. Database Layer
  {
    points: [
      "Self-managed MySQL on EC2 means manual backup scripts and hours of downtime",
      "Single-AZ databases with table-locking cron dumps crash under transaction spikes",
      "Amazon Aurora replicates data 6 ways across 3 zones with sub-30s automated failover"
    ],
    theory: "In Database, meet FinPulse, processing twenty-five thousand stock trades every second. A single self-managed MySQL database relying on midnight backup scripts locks tables and risks millions in lost trades. We cater to FinPulse using Amazon Aurora Multi-AZ, replicating transactions six ways across three physical zones.",
    leftRest: "Look at the naive build on the left where all applications hit a single database. Red single point of failure tags show reads and writes choking the same disk with zero automated failover.",
    rightRest: "Over on the right, Aurora separates compute from storage, with a primary writer in zone one-a and read replicas in zones one-b and one-c, carrying green high-availability tags.",
    underFailure: "Now the primary database suffers a kernel panic! The naive instance freezes, halting all trading. But on the right, Aurora promotes a replica in under thirty seconds. Not a single trade is lost, holding four nines availability."
  },
  // 5. Networking Environment
  {
    points: [
      "Putting databases on public subnets with open ports invites automated botnets",
      "Flat default VPCs with port 3306 exposed to the internet invite catastrophic breaches",
      "3-Tier VPC isolation with Public ALB, Private App tier, and Isolated DB"
    ],
    theory: "Welcome to Networking. PayShield processes sensitive credit card authorizations requiring strict PCI-DSS compliance. Default VPCs that assign public IPs and open database ports to the entire world invite catastrophic breaches. We cater to PayShield using a three-tier VPC with air-gapped private subnets.",
    leftRest: "Notice the dangerous setup on the left where MySQL sits on a public subnet with port thirty-three-zero-six open to the internet, flagged with red single point of failure tags.",
    rightRest: "Over on the right, public subnets hold only load balancers, application containers live in private subnets, and the database sits isolated with green high-availability tags.",
    underFailure: "Now an automated botnet launches a massive port scan! The naive database is immediately targeted and compromised. But on the right, the attack bounces off our boundary because the database is physically unreachable from the web, delivering four nines uptime."
  },
  // 6. Connecting Networks
  {
    points: [
      "Direct VPC peering creates a tangled mess \u2014 20 VPCs require 190 messy links",
      "Single IPsec VPN tunnels over the public internet blackout when carrier links drop",
      "AWS Transit Gateway hub with 10 Gbps Direct Connect and automated BGP VPN failover"
    ],
    theory: "In Connecting Networks, OmniCorp runs twenty-five spoke VPCs. Connecting twenty VPCs with direct peering creates a tangled spaghetti nightmare of nearly two hundred links. We cater to OmniCorp using AWS Transit Gateway as a centralized cloud router, backed by dedicated Direct Connect and automated BGP failover.",
    leftRest: "Look at the fragile network on the left where headquarters relies on a single unencrypted VPN tunnel and messy peering links, marked with red single point of failure tags.",
    rightRest: "Over on the right, headquarters connects through dedicated Direct Connect with automated VPN backup, routing through AWS Transit Gateway and Network Firewall with green high-availability tags.",
    underFailure: "Now we simulate a physical fiber cut on the Direct Connect line! The left network blackouts for hours. But on the right, BGP keepalives fail over to the backup VPN in five seconds, keeping four nines availability intact."
  },
  // 7. Securing Applications & Data Access
  {
    points: [
      "Hardcoding AWS access keys in source code leads to immediate credential theft",
      "Static root credentials and cleartext database passwords leave the perimeter naked",
      "AWS WAF shields the edge while IAM Roles and Secrets Manager rotate tokens every 30 days"
    ],
    theory: "Moving to Application Security, meet SafeVault Identity, managing sensitive user credentials. Committing hardcoded AWS root keys to GitHub lets automated bots hijack cloud accounts in seconds. We cater to SafeVault using AWS WAF to block malicious web payloads, temporary IAM Roles, and automated password rotation through Secrets Manager.",
    leftRest: "On the left, notice the dangerous anti-pattern where an application runs with permanent root keys on disk and cleartext database passwords, flagged with red single point of failure tags.",
    rightRest: "Over on the right, AWS WAF blocks malicious payloads, compute nodes use short-lived IAM tokens, and Secrets Manager rotates credentials every thirty days with green high-availability tags.",
    underFailure: "Watch as an attacker launches a SQL injection attack alongside a stolen access key! On the left, customer data is stolen. But on the right, AWS WAF intercepts the exploit and GuardDuty blocks the anomalous token instantly, holding four nines uptime."
  },
  // 8. Monitoring, Elasticity & High Availability
  {
    points: [
      "Finding out your app is broken from angry users on social media is an operational failure",
      "Unmonitored servers with no telemetry force hours of stressful manual debugging",
      "CloudWatch Synthetics canaries simulate checkouts 24/7 with EventBridge self-healing"
    ],
    theory: "Welcome to Observability with AeroBank, serving two million digital banking users. Finding out your app is down because angry users are tweeting at your CEO is an operational nightmare. We cater to AeroBank using CloudWatch Synthetics canaries that simulate logins every sixty seconds, backed by EventBridge automated self-healing.",
    leftRest: "Notice the blind architecture on the left where an unmonitored server runs without telemetry. When a thread freezes, engineers face hours of manual SSH debugging, highlighted by red single point of failure tags.",
    rightRest: "Over on the right, synthetic canaries simulate customer logins twenty-four-seven, X-Ray traces API bottlenecks, and EventBridge triggers automatic remediation Lambda functions with green high-availability tags.",
    underFailure: "Now we inject a silent memory leak causing banking APIs to hang! On the left, the server locks up and downtime drags on. But on the right, the canary sounds the alarm and EventBridge recycles the task in forty-five seconds, holding four nines uptime."
  },
  // 9. Automating the Architecture (IaC & DevOps)
  {
    points: [
      "Clicking buttons in the AWS console leads to human error and unrepeatable setups",
      "ClickOps manual changes cause silent configuration drift and days of rebuild guesswork",
      "Terraform and CDK GitOps with AWS Config continuously detect and remediate drift"
    ],
    theory: "In Architecture Automation, CloudScale operates across three AWS regions for global enterprise clients. Manually clicking buttons in the AWS console leads to untracked configuration drift where nobody remembers what settings changed. We cater to CloudScale using Terraform GitOps deployment pipelines, coupled with AWS Config for automated compliance remediation.",
    leftRest: "On the left, an engineer makes manual ClickOps adjustments directly in production. Red single point of failure tags warn that there is zero audit trail, making disaster recovery pure guesswork.",
    rightRest: "Over on the right, every infrastructure change begins as code in a pull request, deployed through AWS CodePipeline, and continuously audited by AWS Config with green high-availability tags.",
    underFailure: "Now someone manually opens SSH port twenty-two in production! On the left, that vulnerability stays open indefinitely. But on the right, AWS Config detects the drift in seconds and automatically closes the port, holding four nines uptime."
  },
  // 10. Caching Content
  {
    points: [
      "80% of reads request the same 20% of content \u2014 do not hit the database every time",
      "Direct database hammering during viral spikes exhausts connection pools and crashes apps",
      "Amazon CloudFront edge caching and ElastiCache Redis slash DB CPU load by 85%"
    ],
    theory: "In Caching Content, meet StreamByte, streaming media to ten million users worldwide. In software engineering, eighty percent of requests ask for the same twenty percent of content. Hammering your database for every read will crush it. We cater to StreamByte using CloudFront edge caching and ElastiCache Redis in-memory storage.",
    leftRest: "Notice the naive setup on the left where global users query an uncached origin server directly, forcing the database to run duplicate SQL queries, marked with red single point of failure tags.",
    rightRest: "Over on the right, CloudFront caches assets across hundreds of edge locations, while an ElastiCache Redis cluster answers database queries in microseconds, all carrying green high-availability tags.",
    underFailure: "Now a viral video sends fifty thousand requests per second to the platform! The naive database CPU spikes to ninety-six percent and crashes. But on the right, CloudFront absorbs ninety-six percent of traffic at the edge, holding database load at eleven percent and saving sixty-six percent."
  },
  // 11. Building Decoupled Architecture
  {
    points: [
      "Synchronous chains are fragile \u2014 if payment or email lags, checkout fails",
      "Tightly coupled HTTP chains cause cascading timeouts and permanent lost revenue",
      "Amazon SQS buffers spikes while SNS fans out to independent workers with DLQ protection"
    ],
    theory: "Moving into Decoupled Architecture, HyperCart processes one hundred thousand holiday orders hourly. Synchronous HTTP chains are fragile because if an external payment or email gateway stumbles, the checkout button freezes and the customer leaves. We cater to HyperCart using Amazon SQS message queues and SNS fanout for asynchronous processing.",
    leftRest: "On the left, notice how checkout synchronously waits for the web server, payment processor, and email service. Red single point of failure tags warn that one lagging vendor destroys checkout.",
    rightRest: "Over on the right, orders buffer inside Amazon SQS in eighty-five milliseconds, confirming orders immediately while SNS fans out tasks to independent workers with green high-availability tags.",
    underFailure: "Now the third-party email service crashes during peak sales! On the left, checkout threads lock up and orders are lost. But on the right, orders safely buffer in SQS with Dead Letter Queues, losing zero revenue with four nines uptime."
  },
  // 12. Serverless Architecture & Microservices
  {
    points: [
      "Running virtual machines 24/7 means paying for servers that sit idle at 3 AM",
      "Stateful virtual machines take 10+ minutes to boot new AMIs during unexpected surges",
      "AWS Lambda on Graviton ARM64 executes on-demand with DynamoDB auto-scaling"
    ],
    theory: "Welcome to Serverless with NextGen Mobility, running a smart scooter fleet. They want zero compute bills at three in the morning when scooters are parked, but instant scale to fifty thousand riders during rush hour. We cater to NextGen using event-driven AWS Lambda on Graviton processors with DynamoDB on-demand.",
    leftRest: "Look at the naive setup on the left where two virtual machines run around the clock, costing hundreds when idle and taking ten minutes to boot new instances, marked with red single point of failure tags.",
    rightRest: "Over on the right, API Gateway routes calls to lightweight AWS Lambda functions on Graviton, backed by DynamoDB on-demand auto-scaling with green high-availability tags.",
    underFailure: "Now forty thousand commuters unlock scooters simultaneously! The naive servers run out of memory and crash. But on the right, AWS Lambda scales concurrently in under one second, authorizing every ride smoothly while cutting compute costs ninety-two percent."
  },
  // 13. Data Pipelines
  {
    points: [
      "Running nightly dump scripts on production databases causes severe table locks",
      "Cron ETL workers running on single EC2 instances crash and corrupt analytics reports",
      "Amazon Kinesis streams live events into S3 Parquet lakes, queried via Athena serverless SQL"
    ],
    theory: "In Data Pipelines, DataPulse processes five hundred million clickstream events daily. Running heavy reporting queries against your live transactional database locks tables and ruins customer checkouts. We cater to DataPulse by streaming events into Amazon Kinesis Firehose, converting data into columnar Parquet files in S3, and querying with serverless Athena.",
    leftRest: "Notice the naive build on the left where a single cron worker runs heavy queries against the production database, marked with red single point of failure tags indicating severe table locks.",
    rightRest: "Over on the right, live streams flow into Kinesis Firehose, Glue partitions data into Parquet in S3, and Athena runs instant SQL queries with green high-availability tags.",
    underFailure: "Now a clickstream explosion hits with malformed records! The naive cron worker crashes and locks production tables. But on the right, Kinesis buffers the surge while Athena delivers fresh dashboards in sixty seconds, cutting monthly costs seventy-nine percent."
  },
  // 14. Disaster Recovery & Business Continuity
  {
    points: [
      "Storing database backups in the same region is not a disaster recovery strategy",
      "Single-region deployments leave companies paralyzed for days during regional blackouts",
      "Multi-Region Active-Active with Aurora Global Database and Route 53 ARC failover"
    ],
    theory: "In Disaster Recovery, GlobalPay operates international banking requiring sub-minute recovery, even if an entire AWS region goes dark. Keeping database backups in the same region is not a disaster recovery plan, because when the region floods, the backups drown too. We cater to GlobalPay with Multi-Region Active-Active architecture and Aurora Global Database.",
    leftRest: "Look at the naive deployment on the left where all servers, databases, and snapshots live solely in region us-east-one. Red single point of failure tags warn of days of total blackout during a disaster.",
    rightRest: "Over on the right, Route fifty-three Application Recovery Controller routes traffic across regions, while Aurora Global Database replicates transactions across continents with green high-availability tags.",
    underFailure: "Now we simulate a complete power blackout across the primary region! The naive setup goes dark for days. But on the right, Route fifty-three shifts global traffic to Europe in seconds, continuing operations without losing a single transaction."
  },
  // 15. Executive Conclusion & Architectural Scorecard
  {
    points: [
      "Architecture is not a one-time diagram \u2014 it is a continuous engineering culture",
      "Unmitigated technical debt and isolated monoliths guarantee expensive compliance failure",
      "Certified 99.99% availability, zero HRIs, sub-30s failover, and 59% FinOps cost reduction"
    ],
    theory: "To conclude, we present our findings to executive leadership. Great architecture is not a one-time diagram, it is a living engineering discipline. Naive single-server designs accumulate massive technical debt. We cater to leadership by delivering certified four nines availability, sub-thirty-second recovery, and fifty-nine percent FinOps cost savings across all fifteen operational domains.",
    leftRest: "On the left, notice the summary of the fragile anti-pattern with unmitigated enterprise risk, technical debt, and red single point of failure tags representing unpredictable outages.",
    rightRest: "Over on the right, see our certified production transformation, scoring ninety-six out of one hundred, governed by Service Control Policies and automated self-healing telemetry tagged with green high-availability.",
    underFailure: "Finally, we run an enterprise resilience audit! The naive architecture fails compliance checks across reliability and security. But on the right, AWS Config proves one hundred percent compliance across all six pillars, certifying four nines availability and fifty-nine percent savings."
  }
];

// src/data/deck/moduleTables.ts
var moduleTables = [
  // 1. Architecture overview
  [
    ["Application tier", "One server, a single point of failure", "Auto Scaling pool spread across three zones"],
    ["Database", "One primary with no standby", "Aurora Multi-AZ with a replica in another zone"],
    ["Edge and security", "No edge layer; the origin is exposed", "CloudFront and AWS WAF in front of the load balancer"],
    ["Cost", "$4,450 a month", "$1,820 a month, 59.1% lower"]
  ],
  // 2. Storage layer
  [
    ["Block storage", "3 TB gp2 disk, speed tied to size", "gp3 sized to the workload, 3,000 baseline IOPS"],
    ["Archive", "Old scans stay on hot storage", "S3 Intelligent-Tiering, then Glacier Deep Archive"],
    ["Deletion protection", "Flat bucket with no versioning", "S3 Object Lock in compliance mode: every delete returns 403"],
    ["Recovery points", "None that cannot be changed", "AWS Backup vault with immutable recovery points"]
  ],
  // 3. Compute layer
  [
    ["Instance", "One large monolith, 24/7", "Graviton instances sized by target tracking at 60% CPU"],
    ["Zones", "One zone", "Three zones behind an Application Load Balancer"],
    ["Zone failure", "Out-of-memory crash, full outage", "Node unhealthy in about 10 s; replacements in under 75 s"],
    ["Capacity model", "Static size running 24/7 for the peak", "On-Demand base plus Spot; $584 to $168 a month"]
  ],
  // 4. Database layer
  [
    ["Engine", "Self-managed MySQL on one EC2 host", "Aurora cluster with a writer and read replicas"],
    ["Backups", "Bash cron dump that locks tables", "Continuous backup with point-in-time recovery to the second"],
    ["Failover", "Rebuild by hand, hours of downtime", "Replica promoted; endpoint moves in under 30 s"],
    ["Durability", "One disk, up to 24 hours of lost commits", "Six copies across three zones; writes need 4 of 6"]
  ],
  // 5. Networking environment
  [
    ["Network layout", "Default VPC, every server public", "Three tiers across three zones: public, private, isolated"],
    ["Database exposure", "MySQL on port 3306 open to 0.0.0.0/0", "No public address and no route to the internet gateway"],
    ["Access rules", "Open ports, shared credentials", "Security groups reference other security groups by ID"],
    ["Visibility", "No flow logs", "VPC Flow Logs capture every connection for audit"]
  ],
  // 6. Connecting networks
  [
    ["Routing model", "Peering mesh: 190 links for 20 VPCs", "Transit Gateway hub: one attachment per VPC"],
    ["Corporate link", "One IPsec VPN over the internet", "Direct Connect with a backup VPN over BGP"],
    ["Link failure", "Tunnel drops; manual recovery", "BGP fails over in a few seconds"],
    ["Egress", "Direct and unfiltered", "Central inspection with AWS Network Firewall"]
  ],
  // 7. Securing applications and data access
  [
    ["Credentials", "Permanent access keys committed to Git", "IAM roles issue temporary credentials for one hour"],
    ["Database password", "Clear text and never rotated", "Secrets Manager rotates every 30 days with no downtime"],
    ["Web attacks", "No WAF; SQL injection reaches the database", "AWS WAF managed rules block SQL injection with a 403"],
    ["Encryption", "Unmanaged keys", "KMS customer managed keys with envelope encryption"]
  ],
  // 8. Monitoring, elasticity and high availability
  [
    ["Detection", "Customers report the outage on social media", "CloudWatch Synthetics canaries detect it in under 15 s"],
    ["Alerting", "Single-metric alarms, constant noise", "Composite alarms need several signals before paging"],
    ["Tracing", "Log grep over SSH", "AWS X-Ray traces the slow query to the millisecond"],
    ["Remediation", "Manual SSH, 2 to 4 hours", "EventBridge and Lambda recycle the task in about 45 s"]
  ],
  // 9. Automating the architecture
  [
    ["Changes", "Console clicks, no record", "Terraform or CDK changes through pull requests"],
    ["Security scanning", "None before deployment", "Checkov and tfsec block insecure code"],
    ["Drift", "Silent and continuous", "AWS Config flags drift; Systems Manager remediates it"],
    ["Rebuild a region", "3 to 5 days of guesswork", "About 15 minutes with one pipeline run"]
  ],
  // 10. Caching content
  [
    ["Static content", "Every request reaches the origin", "CloudFront at 600+ edge locations absorbs about 96%"],
    ["Hot queries", "Repeated reads hit the database", "ElastiCache Redis answers from memory"],
    ["Database CPU", "About 96%, near collapse", "About 11%, with headroom for spikes"],
    ["Global p95 latency", "About 850 ms", "About 18 ms from the nearest edge location"]
  ],
  // 11. Building decoupled architecture
  [
    ["Checkout path", "Waits for payment, inventory and email", "Acknowledged in about 85 ms after the SQS write"],
    ["Vendor outage", "Checkout fails with the vendor", "Messages wait in SQS for up to 14 days"],
    ["Failed messages", "Lost with the request", "Dead-letter queue with a CloudWatch alarm"],
    ["New consumers", "Edit the checkout code", "SNS fan-out to fraud, audit or any new service"]
  ],
  // 12. Serverless architecture and microservices
  [
    ["Compute", "Stateful VMs running 24/7", "Lambda on Graviton ARM64, paid per request"],
    ["Idle cost", "About $18 a day at 3 AM", "$0 when nobody is calling"],
    ["Scale-out", "8 to 15 minutes to boot AMIs", "Under half a second to thousands of concurrent calls"],
    ["Operations", "Weekly OS patch windows", "No servers, no AMIs, no SSH bastions"]
  ],
  // 13. Data pipelines
  [
    ["Ingestion", "Nightly mysqldump on production", "Kinesis Data Firehose streams events continuously"],
    ["Transform", "Python script that runs out of memory", "AWS Glue serverless ETL writes Parquet"],
    ["Storage", "Raw CSV on local disk", "S3 data lake with columnar Parquet"],
    ["Query", "Reports 24 hours behind; full raw scans cost more", "Athena reads only needed Parquet columns; about 85% lower cost"]
  ],
  // 14. Disaster recovery
  [
    ["Strategy", "Backup and hope, in the same region", "Active-active across us-east-1 and eu-west-1"],
    ["Recovery time", "3 to 5 days to rebuild by hand", "Route 53 ARC shifts traffic in under a minute"],
    ["Data loss", "Up to 2 weeks of commits", "Aurora Global Database replicates in under a second"],
    ["Testing", "Never tested", "Automated game-day drills run continuously"]
  ],
  // 15. Executive conclusion
  [
    ["Availability", "98.5%, frequent unplanned downtime", "99.99%, certified high availability"],
    ["Recovery", "48+ hours after an incident", "Under 30 seconds with automatic failover"],
    ["Annual spend", "$53,400 a year", "$21,840 a year"],
    ["Governance", "Failing audit, unmitigated risk", "AWS Organizations, guardrails and GitOps pipelines"]
  ]
];

// src/data/deck/theoryTables.ts
var SECONDS_PER_YEAR = 365 * 24 * 60 * 60;
var SHORT_PILLAR_NAMES = {
  "Operational Excellence": "Ops Excellence",
  Security: "Security",
  Reliability: "Reliability",
  "Performance Efficiency": "Performance",
  "Cost Optimization": "Cost",
  Sustainability: "Sustainability"
};
var formatYearlyDowntime = (availabilityPercent) => {
  const seconds = (1 - availabilityPercent / 100) * SECONDS_PER_YEAR;
  if (seconds < 1) return `${seconds.toFixed(2)} s`;
  if (seconds < 60) return `${seconds.toFixed(1)} s`;
  if (seconds < 3600) return `${(seconds / 60).toFixed(1)} min`;
  if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} h`;
  return `${(seconds / 86400).toFixed(1)} days`;
};
var extractPercent = (label) => {
  const match = label.match(/\d+(\.\d+)?%/);
  return match ? match[0] : label;
};
var pillarTable = {
  headers: ["Pillar", "What it asks of the design", "Modules where it appears"],
  rows: allPillars.map((pillar) => {
    const modules = allDomains.map((domain, index) => domain.pillars.includes(pillar.name) ? index + 1 : null).filter((value) => value !== null);
    return [
      pillar.name,
      pillar.description.split(".")[0] + ".",
      modules.join(", ")
    ];
  })
};
var spofTable = {
  headers: ["Parts in a serial chain", "Each part at 99%: combined availability", "Downtime per year"],
  rows: [1, 2, 3, 5].map((count) => {
    const combined = Math.pow(0.99, count) * 100;
    return [String(count), `${combined.toFixed(2)}%`, formatYearlyDowntime(combined)];
  })
};
var ninesTable = {
  headers: ["Availability", "Downtime per year", "Downtime per month"],
  rows: [99.9, 99.99, 99.999].map((value) => {
    const monthlySeconds = (1 - value / 100) * (SECONDS_PER_YEAR / 12);
    const monthly = monthlySeconds < 60 ? `${monthlySeconds.toFixed(0)} s` : `${(monthlySeconds / 60).toFixed(1)} min`;
    return [`${value}%`, formatYearlyDowntime(value), monthly];
  })
};
var redundancyTable = {
  headers: ["Setup (each zone 99.9%)", "Availability together", "Downtime per year"],
  rows: [1, 2, 3].map((zones) => {
    const together = (1 - Math.pow(1e-3, zones)) * 100;
    const label = zones === 1 ? "1 zone (no redundancy)" : `${zones} independent zones`;
    return [label, `${together.toFixed(zones === 3 ? 7 : 4)}%`, formatYearlyDowntime(together)];
  })
};
var blastRadiusTable = {
  headers: ["Failure domain", "Example", "What breaks", "What keeps serving"],
  rows: [
    ["Instance", "One application server", "Requests on that server", "The rest of the fleet, behind the load balancer"],
    ["Availability zone", "Zone a loses power", "Every resource placed only in zone a", "Zones b and c, if the design spans three zones"],
    ["Region", "us-east-1 is unavailable", "Everything placed only in the region", "A standby region, if one is kept warm"]
  ]
};
var recoveryTable = {
  headers: ["Term", "Question it answers", "Example from this talk"],
  rows: [
    ["RTO: recovery time objective", "How long can the business be down?", "Naive 3 to 5 days; active-active under 45 seconds"],
    ["RPO: recovery point objective", "How much data can the business lose?", "Naive up to 2 weeks of commits; Aurora Global under 1 second"]
  ]
};
var readingTable = {
  headers: ["What you see", "What it means"],
  rows: [
    ["Left column: naive build", "Single servers, flat networks, manual steps"],
    ["Right column: Well-Architected build", "Redundancy across zones, isolation, automation"],
    ["Card with a SPOF tag", "A single point of failure in the naive build"],
    ["Card with an HA tag or AZ pill", "Built for high availability, and the zone it sits in"],
    ["Red card that shakes", "Failed, or overloaded at peak load (naive build)"],
    ["Green card that pulses", "Recovering or rerouted (Well-Architected build)"],
    ["Amber or green connector with packets", "Healthy traffic moving down the path"],
    ["Red dashed connector", "A failing or overloaded path; its packets stop"]
  ]
};
var agendaTable = {
  headers: ["#", "Module", "Pillars", "Availability: naive to Well-Architected"],
  rows: allDomains.map((domain, index) => [
    String(index + 1),
    domain.title,
    domain.pillars.map((pillar) => SHORT_PILLAR_NAMES[pillar] ?? pillar).join(", "),
    `${extractPercent(domain.naive.availabilitySLA)} to ${extractPercent(domain.wellArch.availabilitySLA)}`
  ])
};
var keyNumbersTable = {
  headers: ["Measure", "Naive build", "Well-Architected build"],
  rows: [
    ["Availability", "98.5%", "99.99%"],
    ["Monthly cloud spend", "$4,450", "$1,820"],
    ["High-risk issues", "3", "0"],
    ["Recovery time", "4 to 8 hours", "under 30 seconds"]
  ]
};
var scorecardTable = {
  headers: ["Measure", "Naive build", "Well-Architected build", "Change"],
  rows: [
    ["Availability", "98.5%", "99.99%", "+1.49 points"],
    ["Monthly cloud spend", "$4,450", "$1,820", "59.1% lower"],
    ["Annual cloud spend", "$53,400", "$21,840", "$31,560 saved a year"],
    ["High-risk issues", "3", "0", "All remediated"],
    ["Recovery time", "hours", "under 30 seconds", "Hours to seconds"]
  ]
};

// src/data/talkTrackCues.ts
var ENTER_DECK = { type: "ENTER_PRESENTER_MODE" };
var SHOW_BOTH = { type: "SET_VIEW_MODE", mode: "split" };
var RECOVER = { type: "RESET_CHAOS" };

// src/data/deck/theorySlides.ts
var titleSlide = {
  id: "title",
  kind: "title",
  eyebrow: "AWS Well-Architected Framework",
  banner: "Two presenters \xB7 15 modules \xB7 Real-world cloud defense blueprint",
  tables: [keyNumbersTable],
  title: "Naive builds versus resilient builds",
  points: [
    "Engineered for college undergrads and real-world cloud practitioners",
    "From fragile single-point-of-failure servers to self-healing multi-AZ clusters",
    "Interactive live traffic simulation with real-time disaster injection"
  ],
  domainIndex: 0,
  lines: [
    {
      say: "Welcome everyone! Launching a single cloud server takes five minutes, but keeping it alive under fifty thousand shoppers is true engineering. We are Devarsh and Aman, breaking down fifteen mission-critical modules of the AWS Well-Architected Framework.",
      cues: [ENTER_DECK, SHOW_BOTH, RECOVER]
    },
    {
      say: "Our targets today are ambitious \u2014 boosting availability from ninety-eight point five percent to four nines, while cutting cloud spend by fifty-nine percent. Every module pairs real customer requirements with live interactive traffic and disaster injection."
    }
  ]
};
var agendaSlide = {
  id: "agenda",
  kind: "agenda",
  eyebrow: "Agenda",
  banner: "From foundational cloud principles to 15 live architectural simulations",
  tables: [agendaTable],
  title: "Core cloud theory, then fifteen live domains",
  points: [
    "Part 1 \u2014 Foundational Cloud Laws (Pillars, SPOF, Availability Nines, Blast Radius)",
    "Part 2 \u2014 Core Infrastructure (Compute, Storage, Database, 3-Tier Networking)",
    "Part 3 \u2014 Enterprise Cloud Operations (Security, Automation, Caching, Decoupling, Serverless, Disaster Recovery)"
  ],
  domainIndex: 0,
  lines: [
    {
      say: "Here is our flight plan. First we explore foundational cloud laws, covering the six pillars, single points of failure, availability math, and blast radius. Next we dive into storage, Graviton compute, Aurora databases, and isolated subnets. Finally we tackle zero-trust security, proactive observability, message decoupling, serverless compute, and multi-region disaster recovery."
    }
  ]
};
var theorySlides = [
  {
    id: "theory-pillars",
    kind: "theory",
    eyebrow: "Core Cloud Foundations \xB7 1 of 5",
    banner: "Every architectural decision is a deliberate trade-off across these six pillars",
    tables: [pillarTable],
    title: "The Six Pillars of Cloud Architecture",
    points: [
      "Operational Excellence \u2014 Automate processes and continually improve",
      "Security \u2014 Protect data, identities, and systems with defense-in-depth",
      "Reliability \u2014 Recover dynamically from failures and mitigate disruptions",
      "Performance Efficiency \u2014 Right-size compute and scale with demand",
      "Cost Optimization \u2014 Avoid unnecessary cloud spend with FinOps",
      "Sustainability \u2014 Minimize carbon footprint with efficient architectures"
    ],
    domainIndex: 0,
    lines: [
      {
        say: "If a customer demands the fastest app in the world and you spin up a hundred massive servers without budget guardrails, you instantly fail cost optimization. Every AWS decision balances across the six pillars on screen \u2014 Operational Excellence, Security, Reliability, Performance, Cost, and Sustainability. Great architecture is about deliberate trade-offs to meet the business mission."
      }
    ]
  },
  {
    id: "theory-spof",
    kind: "theory",
    eyebrow: "Core Cloud Foundations \xB7 2 of 5",
    banner: "Golden Test \u2014 If this single component dies right now, does your entire business vanish?",
    tables: [spofTable],
    title: "Single Point of Failure \u2014 The Killer of Apps",
    points: [
      "The Serial Chain Hazard \u2014 Five 99% services in a single line yield only 95% total combined uptime",
      "The Compounding Downtime \u2014 95% availability means your company suffers nearly 18 days of unplanned outages per year",
      "Decoupling Remedy \u2014 Eliminate single points of failure by decoupling dependencies and introducing automated redundancy"
    ],
    domainIndex: 0,
    lines: [
      {
        say: "A Single Point of Failure is just like holiday string lights where one broken bulb leaves the whole house dark. In cloud systems, chaining five services with ninety-nine percent uptime drops your total availability down to ninety-five percent, equaling eighteen days of downtime yearly. Our remedy is decoupling dependencies with multi-zone redundancy."
      }
    ]
  },
  {
    id: "theory-nines",
    kind: "theory",
    eyebrow: "Core Cloud Foundations \xB7 3 of 5",
    banner: "Two independent data centers at 99.9% uptime fail together only once in a million",
    tables: [ninesTable, redundancyTable],
    title: "The Reality of Availability \u2014 What 99.9% Actually Means",
    points: [
      "Three Nines (99.9%) \u2014 Allows almost 9 hours of unplanned customer-facing downtime every year",
      "Four Nines (99.99%) \u2014 Drastically cuts annual downtime to under 53 minutes across all services",
      "Multi-AZ Multiplier \u2014 Two independent 99.9% zones achieve 99.9999% combined availability"
    ],
    domainIndex: 0,
    lines: [
      {
        say: "Three nines sounds great, but ninety-nine point nine percent uptime still allows nearly nine hours of unexpected downtime yearly, costing millions. Four nines cuts annual downtime to under fifty-three minutes. We achieve this by spreading redundant nodes across independent Availability Zones where two zones fail together only once in a million attempts."
      }
    ]
  },
  {
    id: "theory-blast-radius",
    kind: "theory",
    eyebrow: "Core Cloud Foundations \xB7 4 of 5",
    banner: "Blast Radius is how much of your business breaks when a single component catches fire",
    tables: [blastRadiusTable, recoveryTable],
    title: "Containing the Blast Radius \u2014 RTO and RPO",
    points: [
      "Watertight bulkheads \u2014 If one compartment floods, the ship still stays afloat",
      "Recovery Time Objective (RTO) \u2014 How long your business can tolerate being down",
      "Recovery Point Objective (RPO) \u2014 How much transactional data you can afford to lose"
    ],
    domainIndex: 0,
    lines: [
      {
        say: "Think of blast radius like watertight bulkheads on a ship, where one flooded compartment will not sink the vessel. If a component fails, we isolate it so the application stays fast. We define recovery time objective for downtime, and recovery point objective for data loss, reducing recovery from hours down to seconds."
      }
    ]
  },
  {
    id: "theory-reading",
    kind: "theory",
    eyebrow: "Core Cloud Foundations \xB7 5 of 5",
    banner: "Identical real-time traffic, identical disaster failure, dramatically different outcomes",
    tables: [readingTable],
    title: "Reading the Live Simulation \u2014 Left vs Right",
    points: [
      "Left Side (Anti-Pattern) \u2014 Monolithic servers, flat subnets, manual recovery, SPOF tags",
      "Right Side (Well-Architected) \u2014 CloudFront CDN, ALB, multi-AZ auto-scaling, Aurora clusters",
      "Dynamic Packet Flight \u2014 Real-time animated data streams show healthy flow vs failure drops"
    ],
    domainIndex: 0,
    lines: [
      {
        say: "Here is how to follow every simulation today. The left side shows the fragile anti-pattern with single instances and bright red single point of failure tags. The right side shows AWS Well-Architected with load balancers, multi-zone clusters, and green high-availability tags. Watch the left collapse under disaster while the right heals itself automatically."
      }
    ]
  }
];
var closingSlide = {
  id: "closing",
  kind: "closing",
  eyebrow: "Executive Scorecard",
  banner: "From fragile single points of failure to resilient, self-healing cloud ecosystems",
  tables: [scorecardTable],
  title: "Executive Conclusion and Architectural Scorecard",
  points: [
    "Availability increased from 98.5% to 99.99% across all 15 operational domains",
    "Monthly cloud spend reduced from $4,450 to $1,820 (59% FinOps cost reduction)",
    "Three critical high-risk issues eliminated with automated sub-30-second recovery"
  ],
  domainIndex: 14,
  lines: [
    {
      say: "Across all fifteen domains, our executive scorecard proves system availability jumps from ninety-eight point five percent to ninety-nine point nine nine percent. Monthly cloud spend drops from forty-four hundred dollars to eighteen hundred dollars, saving fifty-nine percent with sub-thirty-second automated recovery."
    },
    {
      say: "That is the core philosophy of AWS Well-Architected. Start from the failure your business cannot afford to accept, identify its pillar, and build the most resilient design that survives it. Thank you so much, and Devarsh and Aman are excited to open the floor for questions."
    }
  ]
};

// scratch/export_all_data.ts
var fs = __toESM(require("fs"), 1);
var fullData = {
  allDomains,
  allPillars,
  drStrategies,
  theoreticalFoundations,
  clientWorkloads,
  pillarDetails,
  moduleScripts,
  moduleTables,
  theorySlides,
  titleSlide,
  agendaSlide,
  closingSlide
};
fs.writeFileSync("scratch/all_presentation_data.json", JSON.stringify(fullData, null, 2));
console.log("Successfully exported all_presentation_data.json. Size:", fs.statSync("scratch/all_presentation_data.json").size, "bytes");
