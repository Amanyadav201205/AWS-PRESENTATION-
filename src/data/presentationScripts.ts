export interface DomainPresentationScript {
  domainId: string;
  domainNumber: number;
  domainTitle: string;
  openingHook: string;
  verbatimScript: string;
  screenActionCue: string;
  architectDefense: string;
  juryQuestions: {
    question: string;
    answer: string;
  }[];
  keyTakeaway: string;
}

export const generalKeynoteIntro = {
  title: 'AWS Well-Architected Framework: Introduction & Thesis',
  verbatimScript: `Good morning, respected professors, evaluators, and fellow engineers. Today, I am proud to present our comprehensive architectural study and live simulation of the AWS Well-Architected Framework.

In cloud computing, anyone can spin up an EC2 instance and connect it to a database in five minutes. But creating a cloud workload that survives datacenter outages, defends against ransomware, scales to millions of users without latency spikes, and saves up to 60% on infrastructure bills requires architectural discipline.

Over the next few minutes, as our live simulation runs automatically behind me across 13 core syllabus domains, we will contrast the standard "naive" anti-patterns that plague real-world startups with the certified AWS Well-Architected standard. Let us begin with Domain 1: the Storage Layer.`,
  timeEstimate: '60 seconds'
};

export const generalKeynoteOutro = {
  title: 'AWS Well-Architected Framework: Executive Conclusion',
  verbatimScript: `To conclude our evaluation: across all 13 domains we examined today, the AWS Well-Architected Framework is not merely a set of best-practice checklists. It is a measurable business transformation.

In our side-by-side quantitative audit, the naive infrastructure suffered from 13 High Risk Issues, over 48 hours of estimated recovery time during catastrophic failures, and over $53,000 in annual wasted spend. By applying the 6 Pillars of the AWS Well-Architected Framework, we eliminated all 13 High-Risk Issues, brought Mean Time to Recovery from hours down to seconds, achieved 99.99% availability, and cut net cloud expenditure by 59%.

Thank you for your time and attention. I am now open to any technical or architectural questions from the jury.`,
  timeEstimate: '60 seconds'
};

export const domainPresentationScripts: DomainPresentationScript[] = [
  {
    domainId: 'overview-thesis',
    domainNumber: 0,
    domainTitle: 'Executive Architecture Overview',
    openingHook: 'In cloud computing, anyone can launch an EC2 instance in five minutes. But building a cloud workload that survives catastrophic failures and cuts bills by 60% requires architectural discipline.',
    verbatimScript: `Respected professors, evaluators, and colleagues, welcome to our interactive masterclass and simulation on the AWS Well-Architected Framework.

Behind me is the comprehensive blueprint of our entire study. On the left is the standard monolithic anti-pattern that over 80% of organizations mistakenly build: an oversized EC2 monolith connected to an un-replicated database and flat S3 bucket in a single public subnet. This architecture carries 13 High-Risk Issues, an estimated downtime liability of nearly $140,000 per year, and an MTTR of four to eight hours.

On the right side is the AWS Well-Architected solution. By applying the 6 core pillars, we establish defense in depth: Route 53 Anycast latency routing, CloudFront edge caching, multi-AZ Auto Scaling compute, Aurora multi-AZ databases with sub-30 second failover, and decoupled asynchronous queues. Over the course of our presentation, we will walk through each of the 13 syllabus domains side-by-side to prove how the Well-Architected Framework eliminates every single failure mode.`,
    screenActionCue: 'Point to the side-by-side end-to-end architectures. Notice the 13 High Risk Issues flagged in red on the naive stack vs 0 HRIs on the Well-Architected stack.',
    architectDefense: 'Establishes the systemic foundation of the AWS Well-Architected Framework across all 6 Pillars, setting the quantitative baseline for our 13-domain evaluation.',
    juryQuestions: [
      {
        question: 'What is the primary difference between a well-architected cloud review and a traditional security audit?',
        answer: 'A traditional security audit focuses strictly on vulnerability scanning and compliance checkmarks. An AWS Well-Architected review evaluates the entire workload holistic ecosystem: operational procedures, reliability, cost optimization, performance efficiency, and sustainability.'
      },
      {
        question: 'What does AWS define as a High Risk Issue (HRI)?',
        answer: 'An HRI is an architectural decision that has a high likelihood of causing significant business harm, such as data loss, unrecoverable outages, or severe security breach.'
      }
    ],
    keyTakeaway: 'The AWS Well-Architected Framework transforms fragile cloud deployments into predictable, resilient, and cost-efficient engines.'
  },
  {
    domainId: 'storage-layer',
    domainNumber: 1,
    domainTitle: 'Storage Layer',
    openingHook: 'Storage is where enterprise balance sheets bleed silently, and where ransomware strikes hardest.',
    verbatimScript: `Respected evaluators, look at the architecture behind me. On the left is the standard naive anti-pattern: an unpartitioned 3TB EBS gp2 disk attached to a single EC2 instance, with static files dumped into an un-versioned S3 bucket.

Notice the fatal flaw: EBS gp2 couples IOPS to disk size, forcing the company to pay for gigabytes of empty storage just to get baseline disk performance. Worse, S3 Standard retains cold files forever at peak cost. When ransomware strikes or a rogue engineer executes 'aws s3 rm', the naive bucket has no versioning or Object Lock—data is permanently wiped.

Now examine the right side: the AWS Well-Architected solution. We migrate to EBS gp3, decoupling IOPS from capacity and saving 20% instantly. We introduce S3 Intelligent-Tiering with automated transitions to Glacier, cutting cold storage spend by 72%. Crucially, S3 Object Lock in Compliance Mode enforces WORM compliance—even AWS root account credentials cannot tamper with or delete archived records for 7 years.`,
    screenActionCue: 'Point to the S3 bucket node. During chaos injection, watch the naive bucket fail permanently while Well-Architected rejects delete APIs with 403 AccessDenied.',
    architectDefense: 'Implements Pillar 3 (Reliability) and Pillar 5 (Cost Optimization). Decoupling IOPS via gp3 ensures SLA compliance without over-provisioning.',
    juryQuestions: [
      {
        question: 'Why choose S3 Intelligent-Tiering over conventional lifecycle policies?',
        answer: 'Intelligent-Tiering automatically monitors access patterns at the object level with zero retrieval fees. Unlike rigid lifecycle rules, if an archived medical record is suddenly needed, it is served immediately without surprise egress penalty fees.'
      },
      {
        question: 'Can an AWS Root account delete an S3 bucket protected by Object Lock in Compliance Mode?',
        answer: 'No. In Compliance Mode, the retention period cannot be shortened or bypassed by any user, including the root account or AWS Support, until the retention period expires.'
      }
    ],
    keyTakeaway: 'Storage optimization is not just saving pennies; it is ransomware immunity and 11 9s durability.'
  },
  {
    domainId: 'compute-layer',
    domainNumber: 2,
    domainTitle: 'Compute Layer',
    openingHook: 'A single oversized server is not high availability—it is a single point of failure waiting to take your company down.',
    verbatimScript: `In Domain 2, Compute Layer, the naive architecture relies on a single vertically scaled m5.2xlarge EC2 instance. It handles traffic until a traffic spike or hardware failure hits, causing an immediate 100% outage.

In the Well-Architected Framework, we replace this single monolith with an Auto Scaling Group spanning 3 Availability Zones, fronted by an Application Load Balancer. Under normal load, we run right-sized Graviton3 instances (c7g) which deliver 25% better price-performance than x86.

When demand surges, target tracking auto-scales our capacity horizontally in under 60 seconds. If an entire AWS Availability Zone goes dark, the ALB automatically health-checks and reroutes traffic to healthy instances in remaining AZs without dropping a single active customer session.`,
    screenActionCue: 'Watch the Auto Scaling Group dynamically spawn replacement instances in AZ-b and AZ-c when AZ-a is degraded.',
    architectDefense: 'Aligns with Pillar 3 (Reliability) and Pillar 4 (Performance Efficiency). Graviton ARM architecture also directly advances Pillar 6 (Sustainability) by reducing compute watt-hours.',
    juryQuestions: [
      {
        question: 'What metric do you use for Auto Scaling target tracking?',
        answer: 'We use ALBRequestCountPerTarget and Average CPU Utilization (target 65%). This prevents aggressive thrashing while maintaining headroom for sudden 3x traffic spikes.'
      },
      {
        question: 'Why Graviton c7g over standard x86 c6i?',
        answer: 'Graviton3 processors utilize ARM Neoverse cores designed specifically for cloud workloads, offering up to 25% higher compute performance and consuming up to 60% less energy.'
      }
    ],
    keyTakeaway: 'Never scale vertically when you can scale horizontally across multiple fault domains.'
  },
  {
    domainId: 'database-layer',
    domainNumber: 3,
    domainTitle: 'Database Layer',
    openingHook: 'Your database is the crown jewel of your architecture. If it fails, your business ceases to exist.',
    verbatimScript: `Here we evaluate the Database Layer. The naive prescription puts MySQL on an unmanaged EC2 disk, or a single-AZ RDS instance. Every maintenance patch, disk corruption, or OS crash brings the entire business to a standstill, taking hours to restore from daily snapshots.

The Well-Architected design deploys Amazon Aurora Multi-AZ with automated Read Replicas and RDS Proxy. Aurora replicates its 6-way storage volume across 3 Availability Zones with continuous peer repair.

Notice the live failover: when the primary writer instance crashes, Aurora promotes a read replica to master in under 18 seconds. Meanwhile, RDS Proxy pools database connections, preventing connection exhaustion attacks from sudden traffic bursts.`,
    screenActionCue: 'Observe the Aurora failover arrow: the standby replica seamlessly assumes the writer endpoint while read requests continue uninterrupted.',
    architectDefense: 'Pillar 3 (Reliability) and Pillar 4 (Performance Efficiency). 6-way synchronous storage replication guarantees RPO = 0 and RTO < 30 seconds.',
    juryQuestions: [
      {
        question: 'How does Aurora achieve sub-30 second failover compared to standard RDS MySQL?',
        answer: 'Aurora decouples compute from storage. The shared distributed storage volume does not need to be replicated during failover; the secondary compute instance simply points to the same underlying 6-way replicated storage cluster.'
      },
      {
        question: 'What specific problem does Amazon RDS Proxy solve?',
        answer: 'Serverless functions or microservices opening thousands of concurrent TCP connections can crash a relational database connection pool. RDS Proxy pools and multiplexes connections, reducing database memory overhead by up to 80%.'
      }
    ],
    keyTakeaway: 'Decoupling database compute from storage enables instant failover with zero data loss.'
  },
  {
    domainId: 'networking-environment',
    domainNumber: 4,
    domainTitle: 'Networking Environment',
    openingHook: 'Placing databases in a public subnet is the equivalent of leaving your bank vault unlocked on the street.',
    verbatimScript: `In the Networking Environment, naive designs put every server, database, and backend service directly into a single public subnet with 0.0.0.0/0 ingress to save time. Any zero-day vulnerability allows port scanners to access internal ports directly.

The Well-Architected approach establishes a 3-tier VPC architecture across multiple Availability Zones: Public Subnets for Internet-facing ALBs, Private Application Subnets with NAT Gateways for compute, and completely Isolated Database Subnets with no internet route.

Furthermore, communication between our compute and S3 or DynamoDB never traverses the public internet; it uses AWS Gateway VPC Endpoints, saving NAT Gateway data processing fees while guaranteeing absolute private network isolation.`,
    screenActionCue: 'Highlight the multi-tier subnet boundaries: Public -> Private -> Isolated. Traffic flows only through strict security groups.',
    architectDefense: 'Pillar 2 (Security) and Pillar 5 (Cost Optimization). VPC Endpoints keep traffic on the AWS private backbone, cutting NAT data transit fees.',
    juryQuestions: [
      {
        question: 'What is the difference between a Gateway VPC Endpoint and an Interface VPC Endpoint (PrivateLink)?',
        answer: 'Gateway VPC Endpoints are free route table targets for S3 and DynamoDB. Interface VPC Endpoints use Elastic Network Interfaces (ENIs) with private IPs powered by AWS PrivateLink for services like SQS, KMS, and Secrets Manager.'
      },
      {
        question: 'Why use NAT Gateways across multiple AZs rather than a single NAT Gateway?',
        answer: 'A single NAT Gateway in AZ-a is a single point of failure. If AZ-a fails, private subnets in AZ-b lose outbound connectivity. Placing redundant NAT Gateways in each AZ ensures AZ-independent fault domains.'
      }
    ],
    keyTakeaway: 'True network defense in depth requires multi-tier subnet isolation and private VPC endpoints.'
  },
  {
    domainId: 'connecting-network',
    domainNumber: 5,
    domainTitle: 'Connecting Networks',
    openingHook: 'Point-to-point VPC peering creates an unmanageable N-squared spiderweb that collapses under scale.',
    verbatimScript: `When connecting hybrid on-premises datacenters and multiple cloud VPCs, naive architectures configure point-to-point VPC peering connections and single internet-facing IPsec tunnels. At 20 VPCs, you need 190 manual peering connections!

The Well-Architected Framework deploys AWS Transit Gateway as a centralized cloud hub-and-spoke router, connected to on-premises via redundant AWS Direct Connect with automated BGP IPsec VPN failover.

With Transit Gateway route domains, we can enforce micro-segmentation: dev VPCs can never reach prod VPCs, while centralized egress inspection VPCs inspect all internet outbound traffic through AWS Network Firewall.`,
    screenActionCue: 'Point to the Transit Gateway hub node: note how all VPC spokes terminate cleanly into the central routing plane with zero peering mesh.',
    architectDefense: 'Pillar 1 (Operational Excellence) and Pillar 3 (Reliability). BGP dynamic routing automatically reroutes packets across backup tunnels in <3 seconds without manual intervention.',
    juryQuestions: [
      {
        question: 'Does AWS Transit Gateway support transitive routing?',
        answer: 'Yes! Unlike standard VPC Peering which strictly prohibits transitive routing (A cannot talk to C through B), Transit Gateway natively supports transitive routing across all attached VPCs and VPN/Direct Connect connections.'
      },
      {
        question: 'How do you prevent Direct Connect failure from taking down the hybrid connection?',
        answer: 'We configure dual Direct Connect virtual interfaces (DX VIFs) terminated on diverse customer routers, backed by an active Site-to-Site VPN with dynamic BGP routing using AS path prepending.'
      }
    ],
    keyTakeaway: 'Hub-and-spoke routing with Transit Gateway scales linearly and provides centralized traffic governance.'
  },
  {
    domainId: 'securing-application',
    domainNumber: 6,
    domainTitle: 'Securing Application & Data Access',
    openingHook: 'Hardcoded credentials in Git repositories account for over 60% of catastrophic AWS account compromises.',
    verbatimScript: `In Security, naive applications hardcode static IAM user access keys into application config files, grant AdministratorAccess, and leave S3 buckets publicly readable. When credentials leak, the blast radius is total account takeover.

The Well-Architected Framework enforces the Principle of Least Privilege. No EC2 or Lambda instance ever holds static credentials; they assume IAM Roles via the AWS Security Token Service with temporary 15-minute credentials.

All sensitive secrets—such as database passwords and API tokens—are stored in AWS Secrets Manager with automated 30-day rotation. At the perimeter, AWS WAF with Managed Rule Sets blocks SQL injections and cross-site scripting before malicious packets reach our web servers.`,
    screenActionCue: 'Observe the perimeter WAF node blocking malicious exploit payloads with 403 Forbidden before reaching compute.',
    architectDefense: 'Pillar 2 (Security). GuardDuty uses machine learning on VPC flow logs and CloudTrail to detect compromised credentials within seconds.',
    juryQuestions: [
      {
        question: 'How does AWS Secrets Manager perform zero-downtime database password rotation?',
        answer: 'It invokes an AWS Lambda rotation function that executes a two-step handshake: generates a new password, tests authentication against the database, updates the master secret, and retires the old password gracefully.'
      },
      {
        question: 'What is the AWS Well-Architected recommendation for root account usage?',
        answer: 'Root credentials must have hardware MFA enabled and be locked in a physical safe. Root credentials should never be used for daily tasks, and all administrative work must use IAM Identity Center (SSO) with short-lived sessions.'
      }
    ],
    keyTakeaway: 'Eliminate static credentials entirely; security must be continuous, automated, and ephemeral.'
  },
  {
    domainId: 'monitoring-elasticity',
    domainNumber: 7,
    domainTitle: 'Monitoring & Elasticity',
    openingHook: 'If your customer is the first person to tell you your site is down, your monitoring is broken.',
    verbatimScript: `In Monitoring, naive architectures log application errors to local text files on server hard drives. When an instance crashes, all log files are lost. System administrators discover outages only when angry customer emails arrive.

Well-Architected transforms observability into proactive telemetry. We deploy CloudWatch Container Insights, X-Ray distributed tracing, and custom CloudWatch Metrics.

Crucially, CloudWatch Alarms are integrated directly into EventBridge and Lambda for automated remediation. If average latency exceeds 200ms, the system does not just send an email—it automatically adjusts auto-scaling thresholds, clears cache locks, and triggers AWS Systems Manager self-healing playbooks.`,
    screenActionCue: 'Watch the latency and alarm meters: when chaos is injected, CloudWatch immediately flags high error rates and dispatches automated self-healing events.',
    architectDefense: 'Pillar 1 (Operational Excellence). MTTR (Mean Time to Resolution) drops from 4 hours to under 45 seconds through automated event-driven remediation.',
    juryQuestions: [
      {
        question: 'What are the 4 golden signals of monitoring defined by Google SRE and adopted by AWS WAF?',
        answer: 'Latency, Traffic, Errors, and Saturation. Monitoring these four signals provides complete operational visibility into system health.'
      },
      {
        question: 'How does AWS X-Ray assist in microservice troubleshooting?',
        answer: 'X-Ray generates a service graph by injecting trace header tokens (X-Amzn-Trace-Id) into HTTP requests, isolating the exact downstream microservice or database query causing bottlenecks.'
      }
    ],
    keyTakeaway: 'Observability without automated remediation is merely passive bystander monitoring.'
  },
  {
    domainId: 'automating-architecture',
    domainNumber: 8,
    domainTitle: 'Automating Architecture (IaC)',
    openingHook: 'ClickOps—building infrastructure by hand in the AWS management console—is the mother of all configuration drift.',
    verbatimScript: `In Domain 8, Automating Architecture, naive teams manually click through the AWS Console to create resources. When an environment must be replicated or restored in a disaster, nobody remembers the configuration settings.

The Well-Architected Framework mandates 100% Infrastructure as Code using Terraform and AWS CloudFormation, managed via automated CI/CD pipelines.

Environments are version-controlled, audited in Git, and validated through pre-commit security linters like tfsec and Checkov. If an accidental manual change occurs, AWS Config flags the drift instantly and triggers automated rollbacks.`,
    screenActionCue: 'Inspect the IaC tab: compare the fragile 10-line naive config with the declarative, modular Well-Architected Terraform blueprint.',
    architectDefense: 'Pillar 1 (Operational Excellence). Zero manual changes in production prevents human error and enables repeatable environment provisioning in minutes.',
    juryQuestions: [
      {
        question: 'How does AWS Config detect and remediate configuration drift?',
        answer: 'AWS Config continuously monitors resource configurations against predefined rules. If an S3 bucket is made public, an EventBridge rule triggers an AWS Systems Manager Automation document to immediately restore private ACLs.'
      },
      {
        question: 'What is GitOps and how does it fit into Well-Architected Automation?',
        answer: 'GitOps uses Git repositories as the single source of truth for declared infrastructure. Automated agents continuously reconcile live cloud state with Git commits, eliminating manual deployment keys.'
      }
    ],
    keyTakeaway: 'Treat infrastructure identically to software: versioned, tested, linted, and deployed via pipelines.'
  },
  {
    domainId: 'caching-content',
    domainNumber: 9,
    domainTitle: 'Caching Content',
    openingHook: 'The fastest and cheapest database query is the one that never hits your database.',
    verbatimScript: `In Caching Content, naive architectures force every single user request—even for static images and identical database lookups—to travel all the way back to origin EC2 servers and MySQL. Under 50,000 users, CPU hits 100% and crashes the database.

Well-Architected implements multi-layer caching: Amazon CloudFront at the global edge with over 450 Edge Locations, backed by an in-memory ElastiCache Redis cluster for application queries.

CloudFront offloads 92% of static and dynamic asset traffic directly at edge POPs with sub-15ms latency worldwide. For database lookups, Redis cache-aside eliminates 85% of relational read queries, allowing the database to operate at a fraction of the provisioned size.`,
    screenActionCue: 'Look at the Edge tier: CloudFront intercepts user traffic, serving cached responses instantly without touching the backend.',
    architectDefense: 'Pillar 4 (Performance Efficiency) and Pillar 5 (Cost Optimization). Offloading 90%+ of traffic to edge caching reduces compute and database tier costs by over 60%.',
    juryQuestions: [
      {
        question: 'What is the Cache Stampede (Thundering Herd) problem and how do you prevent it?',
        answer: 'When a popular cache key expires, thousands of simultaneous requests hammer the database. We prevent it using probabilistic early expiration, mutex locking in ElastiCache, or Redis cache warming.'
      },
      {
        question: 'How do you handle CloudFront cache invalidation efficiently?',
        answer: 'Instead of costly wildcard invalidations, we use versioned filenames (cache-busting hashes like app.a8f9c.js) allowing us to set 1-year Cache-Control headers with instant zero-cost deployments.'
      }
    ],
    keyTakeaway: 'Push content closer to users: edge caching dramatically increases speed while slashing infrastructure costs.'
  },
  {
    domainId: 'decoupled-architectures',
    domainNumber: 10,
    domainTitle: 'Decoupled Architectures',
    openingHook: 'Synchronous REST calls between microservices create a domino effect: when one service fails, the entire application dies.',
    verbatimScript: `In Decoupled Architectures, naive systems use synchronous HTTP calls from web servers directly to billing, inventory, and notification services. When the email provider slows down, web worker threads hang and reject new shopping cart checkouts.

The Well-Architected Framework decouples services asynchronously using Amazon SQS queues and Amazon SNS topics.

Web servers accept orders in 20 milliseconds, deposit the payload into an SQS queue, and return an immediate confirmation. Worker fleets process jobs from the queue at their own pace. If a downstream worker crashes, messages remain safely buffered in the queue for up to 14 days with Dead Letter Queues (DLQs) preserving unprocessable messages for forensic analysis.`,
    screenActionCue: 'Watch the SQS buffer absorbing sudden spikes: even if downstream consumers slow down, client requests succeed instantly.',
    architectDefense: 'Pillar 3 (Reliability). Asynchronous message queuing breaks the temporal dependency between producers and consumers.',
    juryQuestions: [
      {
        question: 'What is the difference between SQS Standard and SQS FIFO queues?',
        answer: 'Standard queues provide nearly unlimited throughput with at-least-once delivery and best-effort ordering. FIFO queues guarantee exactly-once processing and strict ordering, up to 300 TPS (or 3,000 TPS with high-throughput batching).'
      },
      {
        question: 'What purpose does a Dead Letter Queue (DLQ) serve?',
        answer: 'A DLQ isolates poisonous messages that fail processing after a set number of retries (maxReceiveCount), preventing them from blocking consumer threads while alerting engineers.'
      }
    ],
    keyTakeaway: 'Decouple tightly bound systems: asynchronous buffers turn catastrophic spikes into manageable steady-state workloads.'
  },
  {
    domainId: 'serverless-microservices',
    domainNumber: 11,
    domainTitle: 'Serverless & Microservices',
    openingHook: 'Paying for idle virtual servers at 3 AM when zero customers are on your site is an architectural sin.',
    verbatimScript: `In Serverless & Microservices, naive setups pay $200 per month for always-on EC2 instances that sit at 3% CPU utilization 80% of the day. Upgrading, patching Linux kernels, and scaling them takes hours of manual effort.

Well-Architected transitions to an event-driven serverless architecture powered by AWS Lambda, Amazon API Gateway, and Amazon DynamoDB with on-demand capacity.

You pay strictly per 1-millisecond of execution time. When zero users visit at night, the infrastructure cost is literally $0.00. When 100,000 concurrent requests arrive, Lambda automatically spins up thousands of isolated execution containers in parallel within milliseconds.`,
    screenActionCue: 'Observe the API Gateway to Lambda invocation: zero idle compute overhead, scaling instantaneously with demand.',
    architectDefense: 'Pillar 5 (Cost Optimization) and Pillar 6 (Sustainability). Serverless maximizes hardware density and completely eliminates idle energy consumption.',
    juryQuestions: [
      {
        question: 'How do you mitigate Lambda cold starts in latency-critical production applications?',
        answer: 'We configure Lambda Provisioned Concurrency for core endpoints, utilize lightweight runtime bundles (Go/Rust or ARM64 Node.js), and enable SnapStart for Java workloads.'
      },
      {
        question: 'How do you prevent a Lambda function from exhausting downstream relational database connections?',
        answer: 'We either use Amazon RDS Proxy to pool connections, or transition the persistence tier to Amazon DynamoDB which scales natively with HTTP requests.'
      }
    ],
    keyTakeaway: 'Pay only for the value you generate: true serverless scales to zero and scales to infinity on demand.'
  },
  {
    domainId: 'data-pipelines',
    domainNumber: 12,
    domainTitle: 'Data Pipelines & Analytics',
    openingHook: 'Running heavy analytic SQL queries on your live production transactional database will lock tables and take your business down.',
    verbatimScript: `In Data Pipelines, naive architectures run complex analytical reporting scripts directly against the production OLTP database during business hours, causing table locks, 100% CPU spikes, and dropped customer transactions.

The Well-Architected Framework establishes a modern decoupled serverless data lake. Streaming data is ingested continuously through Amazon Kinesis Data Streams and Firehose, validated, transformed via AWS Glue, and written in Apache Parquet format to S3.

Analysts query petabytes of historical data on-demand using Amazon Athena or Redshift Serverless without ever touching production transactional systems. Business intelligence dashboards in Amazon QuickSight refresh continuously with zero operational blast radius.`,
    screenActionCue: 'Trace the data stream: Kinesis -> Firehose -> S3 Data Lake -> Athena. Notice complete isolation from the production transactional database.',
    architectDefense: 'Pillar 4 (Performance Efficiency) and Pillar 3 (Reliability). Decoupling OLTP from OLAP prevents analytical queries from cannibalizing operational capacity.',
    juryQuestions: [
      {
        question: 'Why convert CSV or JSON raw data into Apache Parquet columnar format in S3?',
        answer: 'Parquet is a columnar storage format with snappy compression. Queries scan only the specific columns requested rather than entire rows, reducing Athena query scan bytes and query costs by over 90%.'
      },
      {
        question: 'What is the role of the AWS Glue Data Catalog?',
        answer: 'The Glue Data Catalog serves as a centralized metadata repository, storing table definitions and schema evolutions so services like Athena, EMR, and Redshift Spectrum can query raw S3 files using standard SQL.'
      }
    ],
    keyTakeaway: 'Never mix operational transactions with analytics: build an isolated, serverless data lake.'
  },
  {
    domainId: 'disaster-recovery',
    domainNumber: 13,
    domainTitle: 'Disaster Planning & Recovery',
    openingHook: 'Hope is not a disaster recovery strategy. The only question is when your primary region will experience an outage.',
    verbatimScript: `Finally, Domain 13: Disaster Planning and Recovery. The naive anti-pattern has no off-site backups, no tested playbooks, and an estimated RTO of 48 hours and RPO of 24 hours. A major regional fiber cut or hurricane means total business bankruptcy.

The AWS Well-Architected Framework provides four distinct DR strategies based on business impact: Backup and Restore, Pilot Light, Warm Standby, and Multi-Region Active-Active.

In our production deployment, we demonstrate Warm Standby and Multi-Region Active-Active using Route 53 Application Recovery Controller and Aurora Global Database with sub-second replication latency across regions. When the primary region us-east-1 suffers a total blackout, health checks trigger automated DNS failover to us-west-2 in under 30 seconds with near-zero data loss.`,
    screenActionCue: 'Inspect the 4-tier DR Strategy Explorer: compare RTO and RPO trade-offs from Backup & Restore down to Multi-Region Active-Active.',
    architectDefense: 'Pillar 3 (Reliability). Demonstrates rigorous RTO (<30 seconds) and RPO (<1 second) compliance with zero single-region dependencies.',
    juryQuestions: [
      {
        question: 'What is the difference between RPO (Recovery Point Objective) and RTO (Recovery Time Objective)?',
        answer: 'RPO defines maximum acceptable data loss measured in time (how much data can we afford to lose). RTO defines maximum acceptable downtime (how quickly must the service be restored to operational status).'
      },
      {
        question: 'How does Amazon Aurora Global Database achieve cross-region replication latency under 1 second?',
        answer: 'Aurora uses dedicated physical storage-level replication across AWS backbone infrastructure, completely bypassing compute engines. Replicas in secondary regions can be promoted to standalone read/write clusters in under 1 minute.'
      }
    ],
    keyTakeaway: 'Disaster recovery must be automated, continuously tested with chaos engineering, and aligned with business RTO/RPO targets.'
  },
  {
    domainId: 'executive-conclusion',
    domainNumber: 14,
    domainTitle: 'Executive Conclusion & Architectural Verdict',
    openingHook: 'Architecture is not just about what you build; it is about what you prevent from breaking.',
    verbatimScript: `To conclude our comprehensive architectural defense: across all 13 domains we examined today, the AWS Well-Architected Framework has delivered a measurable business transformation.

In our quantitative audit, the naive infrastructure suffered from 13 High-Risk Issues, an estimated downtime liability of over $139,000 per year, and an unacceptably fragile MTTR of four to eight hours. By applying the 6 Pillars of the AWS Well-Architected Framework, we have eliminated all 13 High-Risk Issues, brought Mean Time to Recovery down from hours to under 25 seconds, achieved a certified 99.99% availability SLA, and cut net cloud expenditure by 59%.

The 10 Golden Rules of the AWS Well-Architected Framework—performing operations as code, applying security at every layer, scaling horizontally to absorb demand, and continuously measuring cloud financial ROI—stand as our permanent engineering charter. Thank you for your time, and I am now ready for all technical questions from the evaluators.`,
    screenActionCue: 'Display the Final Executive Sign-Off Certificate and the 13-domain transformation matrix showing 100% green compliance.',
    architectDefense: 'Demonstrates boardroom-level architectural maturity: quantifying risk reduction, regulatory audit readiness, and measurable FinOps savings.',
    juryQuestions: [
      {
        question: 'How do you sustain AWS Well-Architected Framework compliance as the engineering team grows?',
        answer: 'We establish organizational guardrails with AWS Organizations Service Control Policies (SCPs), enforce pre-commit Terraform security linters (Checkov), and schedule automated quarterly reviews using the AWS Well-Architected Tool.'
      },
      {
        question: 'What is the single most impactful architectural change between naive and Well-Architected?',
        answer: 'Decoupling compute from state. Decoupling storage IOPS via gp3, stateful database replication via Aurora, and asynchronous service communication via SQS breaks the cascading domino effect of component failure.'
      }
    ],
    keyTakeaway: 'The AWS Well-Architected Framework turns cloud chaos into predictable, resilient, and cost-optimized engineering excellence.'
  }
];
