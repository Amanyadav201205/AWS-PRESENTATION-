/** Spoken text and slide bullets for one module. Index matches domainIndex in allDomains (0 to 14).
 * Tailored for college undergraduates learning AWS Well-Architected Framework:
 * Scenario-driven, engaging, customer-centric problem solving with explicit slide references,
 * highlighting real customer wants, how naive builds fail them, and how AWS caters to their needs.
 * Formatted for concise, high-impact spoken delivery strictly under 20 minutes total.
 */
export interface ModuleScript {
  /** Three short bullets printed on the module's theory slide cards. */
  points: [string, string, string];
  /** Spoken on the theory slide: the real customer scenario, what they want, and how AWS caters to them. */
  theory: string;
  /** Spoken at normal load: the naive build on the left lane, card by card with SPOF tags. */
  leftRest: string;
  /** Spoken at normal load: the Well-Architected build on the right lane, card by card with HA tags. */
  rightRest: string;
  /** Spoken at peak load with disaster injected: chaos title, visual collapse vs auto-healing, and bottom metrics. */
  underFailure: string;
}

export const moduleScripts: ModuleScript[] = [
  // 1. Architecture Overview
  {
    points: [
      'Anyone can launch a server in 5 minutes; keeping it alive is architecture',
      'Single points of failure turn minor glitches into total company outages',
      'AWS Well-Architected decouples every layer across 3 Availability Zones'
    ],
    theory: "Module 1: Architecture Overview! Our customer, Global Enterprise Modernization, demands 99.99% availability and sub-30-second recovery while cutting cloud spend. Naive single-server setups collapse under minor glitches. We cater to them by decoupling web, app, and database tiers across three Availability Zones for self-healing resilience.",
    leftRest: "On the left at normal load, traffic hits one lonely App Server, a single Database, and flat S3 with red SPOF tags. One glitch takes down the business.",
    rightRest: "On the right, Route 53 and CloudFront WAF route through an ALB to an Auto-Scaling Graviton pool across three zones, backed by Aurora Multi-AZ with green HA tags.",
    underFailure: "Under chaos: 'Cascading AZ Outage & Traffic Surge.' The naive server collapses into 100% dropped requests. But AWS auto-heals in seconds! Availability jumps from 98.5% to 99.99%, recovery drops to under 30 seconds, and spend drops 59%."
  },

  // 2. Storage Layer
  {
    points: [
      'Ransomware and accidental deletions can wipe unversioned buckets in seconds',
      'Over-provisioned EBS gp2 and flat unversioned S3 buckets create massive risk',
      'S3 Object Lock enforces WORM immutability and Intelligent-Tiering saves 72%'
    ],
    theory: "Module 2: Storage Layer! Customer MediCloud Health Records needs strict HIPAA compliance, zero data loss, and fast scan retrieval. Flat unversioned buckets leave records vulnerable to ransomware. We cater to MediCloud using S3 Object Lock for WORM immutability and Intelligent-Tiering to archive cold scans automatically.",
    leftRest: "On the left, an App Server connects to a static gp2 volume and un-versioned S3 bucket with red SPOF tags. One rogue script wipes patient histories forever.",
    rightRest: "On the right, we use cost-efficient gp3 and S3 Intelligent-Tiering with Glacier Deep Archive, protected by S3 Object Lock and immutable AWS Backup vaults with green HA tags.",
    underFailure: "Disaster strikes: 'Ransomware Extortion & Accidental Deletion.' The naive bucket turns red and files are wiped. The AWS build blocks deletions with 403 Forbidden! Availability hits 99.99%, recovery drops under 30 seconds, saving 72% in FinOps storage spend."
  },

  // 3. Compute Layer
  {
    points: [
      'One giant server hits a hardware wall and wastes thousands of dollars when idle',
      'Monolithic EC2 instances in a single zone cause 100% blast radius when overloaded',
      'Stateless Graviton ARM64 instances scale horizontally across 3 zones with Spot savings'
    ],
    theory: "Module 3: Compute Layer! Customer ShopStream Global E-Commerce must handle 5,000 normal shoppers and surge to 50,000 during Black Friday. A giant vertical monolith crashes under peak load and wastes idle spend. We cater to ShopStream with stateless Graviton ARM64 instances that scale horizontally across three zones.",
    leftRest: "On the left, all traffic funnels into one oversized Monolith EC2 instance with local storage and red SPOF tags. When CPU maxes out, every shopper gets a 502 error.",
    rightRest: "On the right, an ALB balances traffic across stateless Graviton ARM64 instances spread over three zones, using Auto Scaling and Spot instances for green HA redundancy.",
    underFailure: "Chaos hits: '10x Flash Sale Traffic Surge & AZ-1a Failure.' The naive monolith crashes into a 4-hour outage. But AWS shifts traffic to healthy zones instantly! Availability rises to 99.99%, recovery drops under 60 seconds, saving 71% in costs."
  },

  // 4. Database Layer
  {
    points: [
      'Self-managed MySQL on EC2 means manual backup scripts and hours of downtime',
      'Single-AZ databases with table-locking cron dumps crash under transaction spikes',
      'Amazon Aurora replicates data 6 ways across 3 zones with sub-30s automated failover'
    ],
    theory: "Module 4: Database Layer! Customer FinPulse Global Trading processes 25,000 transactions per second, requiring zero data loss and sub-30-second failover. Self-managed MySQL with manual backup scripts locks tables and crashes. We cater to FinPulse using Amazon Aurora Multi-AZ, replicating data six ways across three zones.",
    leftRest: "On the left, a single self-managed MySQL EC2 instance relies on bash backup cron dumps with red SPOF tags. Reads and writes compete, causing disk bottlenecks and zero failover.",
    rightRest: "On the right, an Aurora Multi-AZ cluster separates compute from storage, with an active writer in zone 1a and dedicated read replicas across zones with green HA tags.",
    underFailure: "Disaster strikes: 'Primary DB Kernel Panic & Hardware Crash.' The naive database locks for 4-6 hours. Aurora detects the crash in five seconds, promoting a replica in under 30 seconds! Availability reaches 99.99% with zero lost transactions."
  },

  // 5. Networking Environment
  {
    points: [
      'Putting databases on public subnets with open ports invites automated botnets',
      'Flat default VPCs with port 3306 exposed to 0.0.0.0/0 invite catastrophic breaches',
      '3-Tier VPC isolation: Public ALB, Private App tier, and Isolated DB with security groups'
    ],
    theory: "Module 5: Networking Environment! Customer PayShield Global Payments requires strict PCI-DSS compliance: payment databases must have zero public internet access. Naive default VPCs assign public IPs and open port 3306 to the world. We cater to PayShield using 3-tier VPC isolation: public load balancers, private apps, and isolated database subnets.",
    leftRest: "On the left, a flat default VPC exposes MySQL port 3306 directly to the internet with red SPOF tags. Automated botnet scanners can brute-force credentials in minutes.",
    rightRest: "On the right, public subnets host ALBs and NAT gateways, apps live in private subnets, and Aurora sits in air-gapped isolated subnets protected by chained security groups with green HA tags.",
    underFailure: "Attack incoming: 'Automated Port Scan & Brute Force Botnet.' The naive database suffers active intrusion. But the AWS network blocks attacks at the perimeter—the database is physically unreachable! Availability holds at 99.99% with instant zero-second recovery."
  },

  // 6. Connecting Networks
  {
    points: [
      'Direct VPC peering creates a spaghetti nightmare: 20 VPCs require 190 messy links',
      'Single IPsec VPN tunnels over the public internet blackout when carrier links drop',
      'AWS Transit Gateway hub with 10 Gbps Direct Connect and automated BGP VPN failover'
    ],
    theory: "Module 6: Connecting Networks! Customer OmniCorp has 25 spoke VPCs across departments requiring centralized inspection and redundant corporate connectivity. Direct peering creates a tangled 190-link nightmare, while single VPN tunnels blackout during carrier outages. We cater to OmniCorp using AWS Transit Gateway with 10 Gbps Direct Connect and automated BGP failover.",
    leftRest: "On the left, Corporate HQ connects over a single unencrypted VPN tunnel and direct peering mesh with red SPOF tags. Any link outage causes widespread company blackout.",
    rightRest: "On the right, Direct Connect feeds an AWS Transit Gateway hub with automatic BGP VPN backup and centralized Network Firewall inspection, all carrying green HA tags.",
    underFailure: "Disaster strikes: 'Direct Connect Fiber Cut & Carrier Outage.' The naive VPN goes dark for hours. But BGP automatically shifts traffic to backup tunnels in under 5 seconds! Availability stays at 99.99% with uninterrupted employee connectivity."
  },

  // 7. Securing Applications & Data Access
  {
    points: [
      'Hardcoding AWS access keys in source code leads to immediate GitHub credential theft',
      'Static root credentials and cleartext database passwords leave the perimeter naked',
      'AWS WAF shields the edge while IAM Roles and Secrets Manager rotate tokens every 30 days'
    ],
    theory: "Module 7: Security & Data Access! Customer SafeVault Identity protects financial PII, requiring Zero Trust defense against web attacks and eliminated hardcoded credentials. Leaking static keys to GitHub exposes root infrastructure to theft. We cater to SafeVault with AWS WAF, IAM Roles with temporary STS tokens, and automated 30-day Secrets Manager rotation.",
    leftRest: "On the left, apps run with hardcoded root keys, cleartext database passwords, and red SPOF tags. There is zero WAF protection and zero encryption at rest.",
    rightRest: "On the right, AWS WAF blocks OWASP threats, IAM Roles issue temporary STS tokens, Secrets Manager auto-rotates passwords every 30 days, and GuardDuty analyzes telemetry with green HA tags.",
    underFailure: "Attack launched: 'SQL Injection Attack & Stolen Access Key.' The naive system leaks data for days of forensic triage. AWS WAF intercepts the SQL injection with 403 Forbidden, and GuardDuty alerts instantly! Availability remains 99.99% for just $68 a month."
  },

  // 8. Monitoring, Elasticity & High Availability
  {
    points: [
      'Finding out your app is broken from angry users on Twitter is an operational failure',
      'Unmonitored servers with no telemetry force hours of stressful manual SSH debugging',
      'CloudWatch Synthetics canaries simulate checkouts 24/7 with EventBridge self-healing'
    ],
    theory: "Module 8: Monitoring & High Availability! Customer AeroBank serves two million digital banking users expecting 24/7 uptime. Unmonitored servers force engineers to learn of outages from angry customer tweets, followed by hours of manual SSH debugging. We cater to AeroBank with CloudWatch Synthetics canaries and EventBridge-triggered self-healing Lambdas.",
    leftRest: "On the left, an unmonitored EC2 instance runs blind with red SPOF tags. When it stalls, engineers waste hours grepping server logs over manual SSH sessions.",
    rightRest: "On the right, CloudWatch Synthetics tests user flows every 60 seconds, Composite Alarms track health, X-Ray traces latency, and EventBridge triggers automated Lambda recycling with green HA tags.",
    underFailure: "Defect simulated: 'Silent Memory Leak Causing Cascading API Hangs.' The naive server freezes. But the CloudWatch canary alerts in 15 seconds, and EventBridge auto-recycles the task in 45 seconds! Availability jumps to 99.99%, without users noticing."
  },

  // 9. Automating the Architecture (IaC & DevOps)
  {
    points: [
      'Clicking buttons in the AWS console leads to human error and unrepeatable setups',
      'ClickOps manual changes cause silent configuration drift and days of rebuild guesswork',
      'Terraform/CDK GitOps with AWS Config continuously detects and remediates drift'
    ],
    theory: "Module 9: Automation & DevOps! Customer CloudScale Global SaaS runs multi-tenant systems across three regions requiring 100% code reproducibility. ClickOps—manually tweaking settings in the AWS console—causes untracked configuration drift and unrepeatable environments. We cater to CloudScale with Terraform and CDK GitOps pipelines, enforced by continuous AWS Config drift remediation.",
    leftRest: "On the left, an engineer manually edits production in the console, creating drifted security groups with red SPOF tags. There is zero version control or audit trail.",
    rightRest: "On the right, changes deploy via Git pull requests and AWS CodePipeline into immutable VPCs, while AWS Config and Systems Manager playbooks enforce compliance with green HA tags.",
    underFailure: "Human error injected: 'Rogue Engineer Opens Port 22 in Console.' The naive VPC stays dangerously exposed. But AWS Config detects drift in seconds and automatically closes the unauthorized port! Availability holds at 99.99%, with full 15-minute rebuild capability."
  },

  // 10. Caching Content
  {
    points: [
      "80% of reads request the same 20% of content—don't hit the database every time",
      'Direct database hammering during viral spikes exhausts connection pools and crashes apps',
      'Amazon CloudFront edge caching and ElastiCache Redis slash DB CPU load by 85%'
    ],
    theory: "Module 10: Caching Content! Customer StreamByte Global Media streams rich content to ten million users worldwide, requiring sub-20ms latency. Direct database hammering during viral surges exhausts connection pools and crashes origin servers. We cater to StreamByte with CloudFront CDN edge caching and ElastiCache Redis in-memory storage, absorbing 96% of reads.",
    leftRest: "On the left, global visitors query an uncached origin server and database directly with red SPOF tags. Latency averages 850 milliseconds and CPU sits dangerously high.",
    rightRest: "On the right, CloudFront caches static media at 600+ edge locations with Origin Access Control, while ElastiCache Redis serves hot queries in RAM with green HA tags.",
    underFailure: "Traffic spike: '50,000 Req/s Flash Sale Spike.' The naive database hits 96% CPU and crashes for 45 minutes. But CloudFront absorbs 96% at the edge, keeping database CPU at 11%! Availability stays 99.99%, saving 66% in spend."
  },

  // 11. Building Decoupled Architecture
  {
    points: [
      'Synchronous chains are fragile: if your payment or email service lags, checkout fails',
      'Tightly coupled HTTP chains cause cascading timeouts and permanent lost revenue',
      'Amazon SQS buffers spikes while SNS fans out to independent workers with DLQ protection'
    ],
    theory: "Module 11: Decoupled Architecture! Customer HyperCart Retail processes 100,000 orders hourly during flash sales, requiring sub-100ms checkout confirmation with zero lost orders. Tightly coupled HTTP chains freeze checkout whenever payment or email vendors lag. We cater to HyperCart using Amazon SQS queues and SNS fanout to decouple workflows asynchronously.",
    leftRest: "On the left, checkout synchronously calls web, payment, and email services in a fragile chain with red SPOF tags. If one vendor lags, the entire checkout fails.",
    rightRest: "On the right, orders buffer into an Amazon SQS queue in 85 milliseconds with Dead Letter Queues, while SNS fans out to independent payment and notification workers with green HA tags.",
    underFailure: "Vendor outage: 'Downstream Email Vendor Down Under 20,000 Orders.' The naive checkout crashes with lost orders. But SQS safely buffers every order for asynchronous processing! Availability holds at 99.99% with zero data loss, saving 87% in spend."
  },

  // 12. Serverless Architecture & Microservices
  {
    points: [
      'Running virtual machines 24/7 means paying for servers that sit idle at 3 AM',
      'Stateful virtual machines take 10+ minutes to boot new AMIs during unexpected surges',
      'AWS Lambda on Graviton ARM64 executes on-demand with DynamoDB auto-scaling'
    ],
    theory: "Module 12: Serverless Architecture! Customer NextGen Mobility operates smart bike-sharing apps. They need zero compute spend at 3 AM when riders sleep, but instant scaling to 50,000 requests during morning rush hour. Paying for 24/7 VMs wastes thousands on idle compute. We cater to NextGen with event-driven AWS Lambda on Graviton and DynamoDB on-demand.",
    leftRest: "On the left, two stateful monolith VMs run 24/7 requiring manual OS patching with red SPOF tags. The customer pays $460 monthly even when traffic is zero.",
    rightRest: "On the right, API Gateway routes calls to AWS Lambda functions on Graviton ARM64, orchestrated by Step Functions and backed by DynamoDB on-demand auto-scaling with green HA tags.",
    underFailure: "Morning surge: 'Instant 0 to 40,000 Invocations Surge.' The naive VMs run out of memory and crash. But AWS Lambda scales concurrently in under a second! Availability holds at 99.99%, recovery is instant, and spend drops 92% to $38."
  },

  // 13. Data Pipelines
  {
    points: [
      'Running nightly mysqldump scripts on production databases causes severe table locks',
      'Cron ETL workers running on single EC2 instances crash and corrupt analytics reports',
      'Amazon Kinesis streams live events into S3 Parquet lakes, queried via Athena serverless SQL'
    ],
    theory: "Module 13: Data Pipelines! Customer DataPulse Analytics processes 500 million clickstream events daily, requiring sub-minute BI dashboards without slowing live customer databases. Running nightly mysqldump cron jobs directly on production locks tables and causes checkout timeouts. We cater to DataPulse with Amazon Kinesis streaming, Glue ETL, and Athena serverless SQL over S3 data lakes.",
    leftRest: "On the left, an EC2 cron worker runs heavy queries against the production database, writing CSVs to local disk with red SPOF tags, causing stale reports and table locks.",
    rightRest: "On the right, Kinesis Firehose ingests live events, AWS Glue transforms data into partitioned columnar Parquet in S3, and analysts query via Athena with green HA tags.",
    underFailure: "Data surge: '100x Payload Explosion & Corrupted Ingestion.' The naive worker crashes and corrupts reports. But Kinesis buffers the surge and quarantines bad records while Athena queries in seconds! Availability rises to 99.99%, saving 79% in costs."
  },

  // 14. Disaster Recovery & Business Continuity
  {
    points: [
      'Storing database backups in the same region is not a disaster recovery strategy',
      'Single-region deployments leave companies paralyzed for days during regional blackouts',
      'Multi-Region Active-Active with Aurora Global Database and Route 53 ARC failover'
    ],
    theory: "Module 14: Disaster Recovery! Customer GlobalPay Financial runs international banking services requiring under-45-second RTO and sub-second RPO, even if an entire AWS region goes dark. Keeping backups in the same region leaves companies paralyzed for days during disasters. We cater to GlobalPay with Multi-Region Active-Active, Aurora Global Database, and Route 53 ARC failover.",
    leftRest: "On the left, all compute, databases, and snapshots reside solely in region us-east-1 with red SPOF tags. A regional outage causes 3 to 5 days of downtime.",
    rightRest: "On the right, Route 53 ARC routes global traffic between us-east-1 and eu-west-1, with Aurora Global Database replicating data cross-continent in under one second with green HA tags.",
    underFailure: "Catastrophe strikes: 'Complete AWS Region Blackout in us-east-1.' The naive setup goes dark for days. But Route 53 shifts traffic to Europe and Aurora promotes in seconds! Availability hits 99.999%, cutting RTO under 45 seconds."
  },

  // 15. Executive Conclusion & Architectural Scorecard
  {
    points: [
      'Architecture is not a one-time diagram—it is a continuous engineering culture',
      'Unmitigated technical debt and isolated monoliths guarantee expensive compliance failure',
      'Certified 99.99% availability, zero HRIs, sub-30s failover, and 59% FinOps cost reduction'
    ],
    theory: "Module 15: Executive Conclusion! Our stakeholder, the Board of Directors, requires certified proof that our workloads satisfy the six pillars: zero high-risk issues, 99.99% availability, and disciplined FinOps governance. Naive builds accumulate technical debt and compliance failures. We cater to leadership by replacing fragile SPOFs with multi-AZ decoupling, automated IaC, and proactive observability.",
    leftRest: "On the left, the fragile anti-pattern shows unmitigated cloud risk, technical debt, and uncontained blast radius with red SPOF tags, resulting in expensive downtime.",
    rightRest: "On the right, the Well-Architected build achieves a 96 out of 100 score, governed by SCPs, GitOps pipelines, and self-healing telemetry with green HA tags.",
    underFailure: "Executive challenge: 'Enterprise Audit Validation & Resiliency Test.' The naive architecture fails compliance audits. But the AWS build proves 100% compliance across all six pillars! Availability is certified at 99.99%, RTO drops under 30 seconds, saving 59% in spend!"
  }
];
