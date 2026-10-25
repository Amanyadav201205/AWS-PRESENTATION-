/** Spoken text and slide bullets for one module. Index matches domainIndex in allDomains (0 to 14).
 * Tailored for college undergraduates learning AWS Well-Architected Framework:
 * Natural, smooth, storytelling speech without colons or quotes, keeping audiences engaged.
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
      'Anyone can launch a server in 5 minutes — keeping it alive is true architecture',
      'Single points of failure turn minor glitches into total company outages',
      'AWS Well-Architected decouples every layer across 3 physical Availability Zones'
    ],
    theory: "Welcome to Architecture Overview! Launching a single cloud server takes five minutes, but keeping it alive under fifty thousand shoppers is true engineering. We cater to our customer by decoupling web, compute, and database tiers across three physical Availability Zones for automated self-healing.",
    leftRest: "Notice the fragile anti-pattern on the left under normal load. All traffic funnels into one lonely server with red single point of failure tags warning of total downtime.",
    rightRest: "Over on the right, CloudFront shields the edge, an Application Load Balancer spreads requests across three zones, and Aurora maintains standby replicas with green high-availability tags.",
    underFailure: "Watch what happens when a data center loses power! The naive server shakes red and drops every customer request. But on the right, traffic reroutes in seconds, keeping four nines availability and cutting spend fifty-nine percent."
  },

  // 2. Storage Layer
  {
    points: [
      'Ransomware and accidental deletions can wipe unversioned storage in seconds',
      'Over-provisioned EBS gp2 and flat unversioned S3 buckets create massive risk',
      'S3 Object Lock enforces WORM immutability and Intelligent-Tiering saves 72%'
    ],
    theory: "Welcome to Storage. Imagine you are MediCloud, protecting fifty terabytes of patient medical scans. A rogue delete script on an unversioned bucket could wipe out years of medical history. We cater to MediCloud using S3 Object Lock for write-once immutability and Intelligent-Tiering for automatic archiving.",
    leftRest: "Look at the naive setup on the left where our server writes to expensive gp2 disks and an unversioned bucket, marked with red single point of failure tags.",
    rightRest: "Over on the right, we modernize to gp3, lock patient scans with S3 Object Lock, and automate Glacier Deep Archive transitions with green high-availability tags.",
    underFailure: "Now we inject ransomware! The naive bucket turns bright red and files are lost forever. But on the right, S3 Object Lock rejects every unauthorized delete, keeping patient records safe with four nines uptime and saving seventy-two percent."
  },

  // 3. Compute Layer
  {
    points: [
      'One giant server hits a hardware wall and wastes thousands of dollars when idle',
      'Monolithic EC2 instances in a single zone cause 100% blast radius when overloaded',
      'Stateless Graviton ARM64 instances scale horizontally across 3 zones with Spot savings'
    ],
    theory: "In Compute, meet ShopStream. Everyday traffic is five thousand shoppers, but Black Friday surges to fifty thousand. Relying on one giant server is like betting your entire business on a single overheating engine. We cater to ShopStream with auto-scaling fleets of stateless Graviton containers across three zones.",
    leftRest: "Notice the naive setup on the left where every shopper hits one monolithic virtual machine. Red single point of failure tags warn that memory exhaustion will freeze checkout.",
    rightRest: "Over on the right, an Application Load Balancer distributes requests across stateless Graviton containers, with Auto Scaling and Spot capacity delivering maximum horsepower with green high-availability tags.",
    underFailure: "Now we inject a ten-times flash surge as data center zone one-a crashes! The naive monolith locks up and dies. But on the right, the load balancer shifts traffic in ten seconds, holding four nines uptime and saving seventy-one percent."
  },

  // 4. Database Layer
  {
    points: [
      'Self-managed MySQL on EC2 means manual backup scripts and hours of downtime',
      'Single-AZ databases with table-locking cron dumps crash under transaction spikes',
      'Amazon Aurora replicates data 6 ways across 3 zones with sub-30s automated failover'
    ],
    theory: "In Database, meet FinPulse, processing twenty-five thousand stock trades every second. A single self-managed MySQL database relying on midnight backup scripts locks tables and risks millions in lost trades. We cater to FinPulse using Amazon Aurora Multi-AZ, replicating transactions six ways across three physical zones.",
    leftRest: "Look at the naive build on the left where all applications hit a single database. Red single point of failure tags show reads and writes choking the same disk with zero automated failover.",
    rightRest: "Over on the right, Aurora separates compute from storage, with a primary writer in zone one-a and read replicas in zones one-b and one-c, carrying green high-availability tags.",
    underFailure: "Now the primary database suffers a kernel panic! The naive instance freezes, halting all trading. But on the right, Aurora promotes a replica in under thirty seconds. Not a single trade is lost, holding four nines availability."
  },

  // 5. Networking Environment
  {
    points: [
      'Putting databases on public subnets with open ports invites automated botnets',
      'Flat default VPCs with port 3306 exposed to the internet invite catastrophic breaches',
      '3-Tier VPC isolation with Public ALB, Private App tier, and Isolated DB'
    ],
    theory: "Welcome to Networking. PayShield processes sensitive credit card authorizations requiring strict PCI-DSS compliance. Default VPCs that assign public IPs and open database ports to the entire world invite catastrophic breaches. We cater to PayShield using a three-tier VPC with air-gapped private subnets.",
    leftRest: "Notice the dangerous setup on the left where MySQL sits on a public subnet with port thirty-three-zero-six open to the internet, flagged with red single point of failure tags.",
    rightRest: "Over on the right, public subnets hold only load balancers, application containers live in private subnets, and the database sits isolated with green high-availability tags.",
    underFailure: "Now an automated botnet launches a massive port scan! The naive database is immediately targeted and compromised. But on the right, the attack bounces off our boundary because the database is physically unreachable from the web, delivering four nines uptime."
  },

  // 6. Connecting Networks
  {
    points: [
      'Direct VPC peering creates a tangled mess — 20 VPCs require 190 messy links',
      'Single IPsec VPN tunnels over the public internet blackout when carrier links drop',
      'AWS Transit Gateway hub with 10 Gbps Direct Connect and automated BGP VPN failover'
    ],
    theory: "In Connecting Networks, OmniCorp runs twenty-five spoke VPCs. Connecting twenty VPCs with direct peering creates a tangled spaghetti nightmare of nearly two hundred links. We cater to OmniCorp using AWS Transit Gateway as a centralized cloud router, backed by dedicated Direct Connect and automated BGP failover.",
    leftRest: "Look at the fragile network on the left where headquarters relies on a single unencrypted VPN tunnel and messy peering links, marked with red single point of failure tags.",
    rightRest: "Over on the right, headquarters connects through dedicated Direct Connect with automated VPN backup, routing through AWS Transit Gateway and Network Firewall with green high-availability tags.",
    underFailure: "Now we simulate a physical fiber cut on the Direct Connect line! The left network blackouts for hours. But on the right, BGP keepalives fail over to the backup VPN in five seconds, keeping four nines availability intact."
  },

  // 7. Securing Applications & Data Access
  {
    points: [
      'Hardcoding AWS access keys in source code leads to immediate credential theft',
      'Static root credentials and cleartext database passwords leave the perimeter naked',
      'AWS WAF shields the edge while IAM Roles and Secrets Manager rotate tokens every 30 days'
    ],
    theory: "Moving to Application Security, meet SafeVault Identity, managing sensitive user credentials. Committing hardcoded AWS root keys to GitHub lets automated bots hijack cloud accounts in seconds. We cater to SafeVault using AWS WAF to block malicious web payloads, temporary IAM Roles, and automated password rotation through Secrets Manager.",
    leftRest: "On the left, notice the dangerous anti-pattern where an application runs with permanent root keys on disk and cleartext database passwords, flagged with red single point of failure tags.",
    rightRest: "Over on the right, AWS WAF blocks malicious payloads, compute nodes use short-lived IAM tokens, and Secrets Manager rotates credentials every thirty days with green high-availability tags.",
    underFailure: "Watch as an attacker launches a SQL injection attack alongside a stolen access key! On the left, customer data is stolen. But on the right, AWS WAF intercepts the exploit and GuardDuty blocks the anomalous token instantly, holding four nines uptime."
  },

  // 8. Monitoring, Elasticity & High Availability
  {
    points: [
      'Finding out your app is broken from angry users on social media is an operational failure',
      'Unmonitored servers with no telemetry force hours of stressful manual debugging',
      'CloudWatch Synthetics canaries simulate checkouts 24/7 with EventBridge self-healing'
    ],
    theory: "Welcome to Observability with AeroBank, serving two million digital banking users. Finding out your app is down because angry users are tweeting at your CEO is an operational nightmare. We cater to AeroBank using CloudWatch Synthetics canaries that simulate logins every sixty seconds, backed by EventBridge automated self-healing.",
    leftRest: "Notice the blind architecture on the left where an unmonitored server runs without telemetry. When a thread freezes, engineers face hours of manual SSH debugging, highlighted by red single point of failure tags.",
    rightRest: "Over on the right, synthetic canaries simulate customer logins twenty-four-seven, X-Ray traces API bottlenecks, and EventBridge triggers automatic remediation Lambda functions with green high-availability tags.",
    underFailure: "Now we inject a silent memory leak causing banking APIs to hang! On the left, the server locks up and downtime drags on. But on the right, the canary sounds the alarm and EventBridge recycles the task in forty-five seconds, holding four nines uptime."
  },

  // 9. Automating the Architecture (IaC & DevOps)
  {
    points: [
      'Clicking buttons in the AWS console leads to human error and unrepeatable setups',
      'ClickOps manual changes cause silent configuration drift and days of rebuild guesswork',
      'Terraform and CDK GitOps with AWS Config continuously detect and remediate drift'
    ],
    theory: "In Architecture Automation, CloudScale operates across three AWS regions for global enterprise clients. Manually clicking buttons in the AWS console leads to untracked configuration drift where nobody remembers what settings changed. We cater to CloudScale using Terraform GitOps deployment pipelines, coupled with AWS Config for automated compliance remediation.",
    leftRest: "On the left, an engineer makes manual ClickOps adjustments directly in production. Red single point of failure tags warn that there is zero audit trail, making disaster recovery pure guesswork.",
    rightRest: "Over on the right, every infrastructure change begins as code in a pull request, deployed through AWS CodePipeline, and continuously audited by AWS Config with green high-availability tags.",
    underFailure: "Now someone manually opens SSH port twenty-two in production! On the left, that vulnerability stays open indefinitely. But on the right, AWS Config detects the drift in seconds and automatically closes the port, holding four nines uptime."
  },

  // 10. Caching Content
  {
    points: [
      '80% of reads request the same 20% of content — do not hit the database every time',
      'Direct database hammering during viral spikes exhausts connection pools and crashes apps',
      'Amazon CloudFront edge caching and ElastiCache Redis slash DB CPU load by 85%'
    ],
    theory: "In Caching Content, meet StreamByte, streaming media to ten million users worldwide. In software engineering, eighty percent of requests ask for the same twenty percent of content. Hammering your database for every read will crush it. We cater to StreamByte using CloudFront edge caching and ElastiCache Redis in-memory storage.",
    leftRest: "Notice the naive setup on the left where global users query an uncached origin server directly, forcing the database to run duplicate SQL queries, marked with red single point of failure tags.",
    rightRest: "Over on the right, CloudFront caches assets across hundreds of edge locations, while an ElastiCache Redis cluster answers database queries in microseconds, all carrying green high-availability tags.",
    underFailure: "Now a viral video sends fifty thousand requests per second to the platform! The naive database CPU spikes to ninety-six percent and crashes. But on the right, CloudFront absorbs ninety-six percent of traffic at the edge, holding database load at eleven percent and saving sixty-six percent."
  },

  // 11. Building Decoupled Architecture
  {
    points: [
      'Synchronous chains are fragile — if payment or email lags, checkout fails',
      'Tightly coupled HTTP chains cause cascading timeouts and permanent lost revenue',
      'Amazon SQS buffers spikes while SNS fans out to independent workers with DLQ protection'
    ],
    theory: "Moving into Decoupled Architecture, HyperCart processes one hundred thousand holiday orders hourly. Synchronous HTTP chains are fragile because if an external payment or email gateway stumbles, the checkout button freezes and the customer leaves. We cater to HyperCart using Amazon SQS message queues and SNS fanout for asynchronous processing.",
    leftRest: "On the left, notice how checkout synchronously waits for the web server, payment processor, and email service. Red single point of failure tags warn that one lagging vendor destroys checkout.",
    rightRest: "Over on the right, orders buffer inside Amazon SQS in eighty-five milliseconds, confirming orders immediately while SNS fans out tasks to independent workers with green high-availability tags.",
    underFailure: "Now the third-party email service crashes during peak sales! On the left, checkout threads lock up and orders are lost. But on the right, orders safely buffer in SQS with Dead Letter Queues, losing zero revenue with four nines uptime."
  },

  // 12. Serverless Architecture & Microservices
  {
    points: [
      'Running virtual machines 24/7 means paying for servers that sit idle at 3 AM',
      'Stateful virtual machines take 10+ minutes to boot new AMIs during unexpected surges',
      'AWS Lambda on Graviton ARM64 executes on-demand with DynamoDB auto-scaling'
    ],
    theory: "Welcome to Serverless with NextGen Mobility, running a smart scooter fleet. They want zero compute bills at three in the morning when scooters are parked, but instant scale to fifty thousand riders during rush hour. We cater to NextGen using event-driven AWS Lambda on Graviton processors with DynamoDB on-demand.",
    leftRest: "Look at the naive setup on the left where two virtual machines run around the clock, costing hundreds when idle and taking ten minutes to boot new instances, marked with red single point of failure tags.",
    rightRest: "Over on the right, API Gateway routes calls to lightweight AWS Lambda functions on Graviton, backed by DynamoDB on-demand auto-scaling with green high-availability tags.",
    underFailure: "Now forty thousand commuters unlock scooters simultaneously! The naive servers run out of memory and crash. But on the right, AWS Lambda scales concurrently in under one second, authorizing every ride smoothly while cutting compute costs ninety-two percent."
  },

  // 13. Data Pipelines
  {
    points: [
      'Running nightly dump scripts on production databases causes severe table locks',
      'Cron ETL workers running on single EC2 instances crash and corrupt analytics reports',
      'Amazon Kinesis streams live events into S3 Parquet lakes, queried via Athena serverless SQL'
    ],
    theory: "In Data Pipelines, DataPulse processes five hundred million clickstream events daily. Running heavy reporting queries against your live transactional database locks tables and ruins customer checkouts. We cater to DataPulse by streaming events into Amazon Kinesis Firehose, converting data into columnar Parquet files in S3, and querying with serverless Athena.",
    leftRest: "Notice the naive build on the left where a single cron worker runs heavy queries against the production database, marked with red single point of failure tags indicating severe table locks.",
    rightRest: "Over on the right, live streams flow into Kinesis Firehose, Glue partitions data into Parquet in S3, and Athena runs instant SQL queries with green high-availability tags.",
    underFailure: "Now a clickstream explosion hits with malformed records! The naive cron worker crashes and locks production tables. But on the right, Kinesis buffers the surge while Athena delivers fresh dashboards in sixty seconds, cutting monthly costs seventy-nine percent."
  },

  // 14. Disaster Recovery & Business Continuity
  {
    points: [
      'Storing database backups in the same region is not a disaster recovery strategy',
      'Single-region deployments leave companies paralyzed for days during regional blackouts',
      'Multi-Region Active-Active with Aurora Global Database and Route 53 ARC failover'
    ],
    theory: "In Disaster Recovery, GlobalPay operates international banking requiring sub-minute recovery, even if an entire AWS region goes dark. Keeping database backups in the same region is not a disaster recovery plan, because when the region floods, the backups drown too. We cater to GlobalPay with Multi-Region Active-Active architecture and Aurora Global Database.",
    leftRest: "Look at the naive deployment on the left where all servers, databases, and snapshots live solely in region us-east-one. Red single point of failure tags warn of days of total blackout during a disaster.",
    rightRest: "Over on the right, Route fifty-three Application Recovery Controller routes traffic across regions, while Aurora Global Database replicates transactions across continents with green high-availability tags.",
    underFailure: "Now we simulate a complete power blackout across the primary region! The naive setup goes dark for days. But on the right, Route fifty-three shifts global traffic to Europe in seconds, continuing operations without losing a single transaction."
  },

  // 15. Executive Conclusion & Architectural Scorecard
  {
    points: [
      'Architecture is not a one-time diagram — it is a continuous engineering culture',
      'Unmitigated technical debt and isolated monoliths guarantee expensive compliance failure',
      'Certified 99.99% availability, zero HRIs, sub-30s failover, and 59% FinOps cost reduction'
    ],
    theory: "To conclude, we present our findings to executive leadership. Great architecture is not a one-time diagram, it is a living engineering discipline. Naive single-server designs accumulate massive technical debt. We cater to leadership by delivering certified four nines availability, sub-thirty-second recovery, and fifty-nine percent FinOps cost savings across all fifteen operational domains.",
    leftRest: "On the left, notice the summary of the fragile anti-pattern with unmitigated enterprise risk, technical debt, and red single point of failure tags representing unpredictable outages.",
    rightRest: "Over on the right, see our certified production transformation, scoring ninety-six out of one hundred, governed by Service Control Policies and automated self-healing telemetry tagged with green high-availability.",
    underFailure: "Finally, we run an enterprise resilience audit! The naive architecture fails compliance checks across reliability and security. But on the right, AWS Config proves one hundred percent compliance across all six pillars, certifying four nines availability and fifty-nine percent savings."
  }
];
