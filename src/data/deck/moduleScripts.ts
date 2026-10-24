/** Spoken text and slide bullets for one module. Index matches domainIndex in allDomains (0 to 14).
 * Tailored for college undergraduates learning AWS Well-Architected Framework:
 * Scenario-driven, engaging, practical analogies, with zero dry formulas or academic citations.
 */
export interface ModuleScript {
  /** Three short bullets printed on the module's theory slide. */
  points: [string, string, string];
  /** Spoken on the theory slide: the real-world scenario and what students should learn. */
  theory: string;
  /** Spoken at normal load: the naive build on the left, card by card. */
  leftRest: string;
  /** Spoken at normal load: the Well-Architected build on the right, card by card. */
  rightRest: string;
  /** Spoken at peak load with the failure injected: what changes on both sides. */
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
    theory: "Welcome everyone! Here is the golden rule of cloud computing: anyone can follow a 5-minute tutorial to deploy a web app. But what happens when 50,000 students try to register for classes at the exact same second? In a naive build, your web app, business logic, and database all sit on one single machine. When that machine glitches, your entire business vanishes. AWS Well-Architected solves this by splitting your application into independent, auto-scaling tiers across multiple physical data centers.",
    leftRest: "Look at the naive build on the left at normal load. Traffic flows directly from the internet into one lonely App Server, which connects to a single Primary Database and a flat S3 bucket. Notice the bright red SPOF tags. If either that server or that database has a hardware glitch, the entire platform goes dark.",
    rightRest: "Now look at the AWS Well-Architected build on the right. Global users hit AWS CloudFront CDN with AWS WAF shielding the perimeter. An Application Load Balancer distributes requests across an Auto Scaling fleet of EC2 instances across three Availability Zones, backed by Amazon Aurora Multi-AZ. Every component carries an HA tag, and traffic flows smoothly through healthy redundant paths.",
    underFailure: "Now we crank traffic to one hundred thousand users and inject a catastrophic regional data center outage! On the left, the naive server chokes, shakes violently, turns red, and the whole site collapses with 504 timeouts. On the right, AWS instantly detects the failed zone, routes traffic to healthy nodes, and auto-scales replacement workers in seconds. Availability holds at 99.99%!"
  },

  // 2. Storage Layer
  {
    points: [
      'Ransomware and accidental deletions can wipe unversioned buckets in seconds',
      'S3 Object Lock enforces write-once-read-many (WORM) immutability',
      'Intelligent-Tiering cuts monthly storage bills by 70% automatically'
    ],
    theory: "Think about storage like this: what happens if an intern accidentally runs a delete script, or ransomware gets hold of your AWS credentials? In a naive setup, your files sit in a flat, unversioned S3 bucket—once deleted, they are gone forever. AWS Well-Architected protects your data with S3 Object Lock, making files physically impossible to delete or overwrite even by root admins, while Intelligent-Tiering automatically moves cold files to Glacier Deep Archive to slash storage costs.",
    leftRest: "On the left is the standard storage setup: an App Server writing directly to an unmonitored 3-terabyte gp2 disk and a flat, public S3 bucket. There is zero versioning, zero encryption lifecycle, and both carry SPOF tags. One ransomware payload or disk failure means permanent data loss.",
    rightRest: "On the right is the Well-Architected storage fortress. We use high-performance gp3 volumes sized specifically for current IOPS, S3 Intelligent-Tiering that automatically transitions old scans to Glacier Deep Archive, and an isolated AWS Backup vault protected by Object Lock in strict compliance mode.",
    underFailure: "Now we simulate a malicious ransomware attack trying to purge all company records. On the left, the naive storage disk and bucket turn bright red and data is wiped out completely. On the right, S3 Object Lock returns a hard 403 Forbidden to every delete request, and AWS Backup retains pristine immutable snapshots. Notice the monthly bill: 420 dollars on the left drops to 118 dollars on the right!"
  },

  // 3. Compute Layer
  {
    points: [
      'One giant server hits a hardware wall and wastes thousands of dollars when idle',
      'Horizontal scaling beats vertical scaling: small stateless workers across zones',
      'AWS Graviton processors deliver 40% better price-performance with zero waste'
    ],
    theory: "Imagine college course registration opens at 9 AM. 10,000 students hit submit simultaneously. If you try to survive by buying one giant, expensive 64-core EC2 machine, that's called vertical scaling—and it always hits a hardware ceiling. Even worse, at 3 AM when students are asleep, you're paying for that giant monster to sit completely idle. The AWS Well-Architected way is horizontal scaling: small, stateless Graviton instances that dynamically multiply when traffic surges and disappear when it quiets down.",
    leftRest: "On the left, the naive compute build: all traffic funnels into one giant Monolith EC2 instance running 24/7 with local storage. It carries a prominent SPOF tag. If that single operating system freezes or exhausts its memory, every single customer is locked out.",
    rightRest: "On the right, the Well-Architected compute pool. An Application Load Balancer distributes traffic evenly across stateless EC2 instances powered by energy-efficient AWS Graviton processors, spread across Availability Zones A, B, and C, including Spot instances for massive cost savings.",
    underFailure: "Now a sudden flash sale hits with 100,000 concurrent requests! The left monolith instantly maxes out at 99% CPU, overheats, shakes, and crashes completely. On the right, when one zone experiences high load, the Application Load Balancer routes traffic to the remaining zones while Auto Scaling spins up new instances. The system never drops a beat, and monthly compute costs drop from 584 dollars down to 168 dollars!"
  },

  // 4. Database Layer
  {
    points: [
      'Self-managed MySQL on EC2 means manual backup scripts and hours of downtime',
      'Amazon Aurora replicates data 6 ways across 3 Availability Zones',
      'Automated failover promotes a healthy read replica in under 30 seconds'
    ],
    theory: "Every student has experienced this: your college exam results are published, you refresh the page, and the database crashes! Why? Because the university put MySQL on a single virtual machine with a naive cron backup script. When the writer node crashes, someone has to wake up at 2 AM and manually restore yesterday's backup. Amazon Aurora solves this with storage that continuously replicates six copies across three availability zones. If the master database dies, Aurora promotes a standby replica in under 30 seconds with zero data loss.",
    leftRest: "On the left is the fragile database build: a self-managed MySQL database running on an EC2 host, backed up by a midnight bash script that locks database tables. It has a SPOF tag, and every query queues up behind a single disk.",
    rightRest: "On the right is the Aurora Multi-AZ cluster. We have a dedicated writer instance in Zone A, high-speed read replicas in Zones B and C, and a distributed cloud storage engine underneath. Read traffic is offloaded to replicas so the writer never chokes on report queries.",
    underFailure: "Now we simulate a sudden hardware crash on the primary database writer! On the left, the MySQL server shakes, crashes to red, and leaves the app completely broken for four to six hours. On the right, Aurora detects the crash immediately and promotes the Zone B replica to primary writer in under 30 seconds. Zero transactions lost, and the application keeps humming!"
  },

  // 5. Networking Environment
  {
    points: [
      'Putting databases on public subnets with open ports invites automated botnets',
      '3-Tier VPC isolation: Public (ALB), Private (App), and Isolated (Database)',
      'Security groups act as strict firewalls referencing other tiers by security group ID'
    ],
    theory: "When beginners start on AWS, they often make a terrifying mistake: they deploy their database in a default VPC with a public IP address and port 3306 wide open to 0.0.0.0/0. Within minutes, automated port scanners in Eastern Europe detect it and start brute-forcing passwords. The Well-Architected rule is Defense in Depth: you build a 3-tier VPC. Only the load balancer touches the internet. Your application servers sit in private subnets, and your database sits in an isolated subnet with zero internet route.",
    leftRest: "On the left is the naive network topology: external botnets and scanners have direct access to a flat, default VPC where the MySQL database has a public IP address and open port 3306. There are no firewalls, no private routing, and a massive SPOF tag.",
    rightRest: "On the right is the 3-Tier Multi-AZ VPC: the Internet Gateway only connects to public subnets holding the Application Load Balancer and NAT Gateways. Application servers live in private subnets, and Aurora lives in an isolated subnet with no route to the internet. Security groups enforce strict least-privilege traffic flow.",
    underFailure: "Now an automated botnet initiates a massive port scan and brute-force attack! On the left, the scanner hits port 3306 directly, compromises the database, and the red connector indicates an active breach. On the right, the attack is stopped dead at the perimeter: the database is physically unreachable from the public internet, and availability stays at 99.99%!"
  },

  // 6. Connecting Networks
  {
    points: [
      'Direct VPC peering creates a spaghetti nightmare: 20 VPCs require 190 messy links',
      'AWS Transit Gateway acts as a central cloud router with one attachment per VPC',
      'Redundant Direct Connect plus automated BGP VPN failover prevents link blackouts'
    ],
    theory: "Imagine your university or company grows to have 20 different departments and cloud environments. If you connect them using direct VPC peering, every VPC must be linked to every other VPC. That requires 190 separate peering connections! If one cable breaks or someone misconfigures a route table, troubleshooting is impossible. AWS Transit Gateway replaces that spaghetti mess with a central hub-and-spoke router: each network connects once to the hub, and routing happens automatically with enterprise-grade firewalls.",
    leftRest: "On the left, the naive enterprise connection: corporate headquarters connects to three VPCs using a single unencrypted IPsec VPN over the public internet, cross-wired with direct peering links. That single VPN tunnel is a massive single point of failure.",
    rightRest: "On the right is the Well-Architected hub: headquarters connects via a high-speed 10 Gbps AWS Direct Connect circuit with an automatic BGP IPsec VPN backup. Both terminate at AWS Transit Gateway, which routes cleanly to spoke VPCs through an AWS Network Firewall.",
    underFailure: "Now a physical backhoe severs the primary fiber line! On the left, the single VPN fails, turns red, and engineering, accounting, and logistics lose all access to the cloud. On the right, BGP automatically shifts traffic to the backup VPN within three seconds. Nobody on campus even notices a hiccup!"
  },

  // 7. Securing Applications & Data Access
  {
    points: [
      'Hardcoding AWS access keys in source code leads to immediate GitHub credential theft',
      'IAM roles provide temporary 1-hour credentials with zero secrets stored on disk',
      'AWS Secrets Manager rotates database passwords every 30 days automatically'
    ],
    theory: "Here is a nightmare scenario every computer science student should know: you push your project to GitHub, and inside config.js you accidentally left your AWS root access key and database password. Within 30 seconds, automated scraper bots steal that key and spin up $10,000 worth of crypto miners! AWS Well-Architected enforces zero hardcoded secrets: applications use IAM Roles that generate short-lived temporary tokens, while AWS Secrets Manager rotates database passwords automatically without dropping connections.",
    leftRest: "On the left is the security nightmare: a malicious attacker targets an application server running with permanent root credentials hardcoded in plain text files, connecting to a database with an unrotated password. Zero encryption at rest and zero perimeter defense.",
    rightRest: "On the right is the Well-Architected security posture: AWS WAF inspects incoming HTTP traffic for OWASP Top 10 vulnerabilities, IAM Roles grant short-lived least-privilege tokens, Secrets Manager rotates passwords every 30 days, and AWS KMS encrypts all data with customer-managed keys.",
    underFailure: "Now an attacker launches a SQL injection attack paired with stolen API credentials! On the left, the server shakes, data is exfiltrated, and the database is compromised. On the right, AWS WAF immediately blocks the SQL injection with a 403 Forbidden, and Amazon GuardDuty flags the anomalous credential call in real time!"
  },

  // 8. Monitoring, Elasticity & High Availability
  {
    points: [
      'Finding out your app is broken from angry users on Twitter is an operational failure',
      'CloudWatch Synthetics canaries simulate real user checkouts 24/7/365',
      'EventBridge and Lambda automatically restart unhealthy services in 45 seconds'
    ],
    theory: "How do you know if your website is down? In amateur companies, you find out when angry customers start tweeting at your CEO! You then spend four hours frantically SSH-ing into servers reading giant log files trying to find the bug. In AWS Well-Architected, CloudWatch Synthetics canaries act as automated robot users clicking through your login and checkout buttons every minute. If latency spikes, composite alarms page the on-call engineer and EventBridge triggers an automatic Lambda function to self-heal the server in 45 seconds.",
    leftRest: "On the left, the blind monitoring setup: an unmonitored EC2 instance with no alarms, waiting for angry customer complaints on social media, followed by stressful manual SSH terminal debugging. Downtime stretches for hours.",
    rightRest: "On the right is automated observability: CloudWatch Synthetics canaries run simulated user journeys every 60 seconds, AWS X-Ray traces request latencies to the exact line of code, and EventBridge hooks into a self-healing Lambda worker.",
    underFailure: "Now a silent memory leak causes the application to slowly choke! On the left, the server crashes, packets stop, and nobody knows until customer support is flooded with complaints. On the right, the canary detects the timeout in 15 seconds, and Lambda automatically replaces the unhealthy task in 45 seconds. Mean Time to Recovery drops from 4 hours to under a minute!"
  },

  // 9. Automating the Architecture (IaC & DevOps)
  {
    points: [
      'Clicking buttons in the AWS console leads to human error and unrepeatable setups',
      'Infrastructure as Code (Terraform & AWS CDK) turns architectures into reviewable code',
      'AWS Config continuously detects manual configuration drift and auto-remediates it'
    ],
    theory: "When you build a project for class, you click around in the AWS console creating servers and VPCs. But in production, 'ClickOps' is a catastrophe. If a server dies, nobody remembers which buttons they clicked three months ago. If someone accidentally deletes a firewall rule on Friday evening, production goes dark. AWS Well-Architected requires Infrastructure as Code: your entire cloud architecture is written in Terraform or AWS CDK, checked into GitHub, tested in automated CI/CD pipelines, and deployed identically across staging and production.",
    leftRest: "On the left is manual ClickOps: a developer makes unrecorded changes directly in the AWS production console, leading to security group configuration drift and zero audit trail. If disaster strikes, rebuilding takes days of guesswork.",
    rightRest: "On the right is automated GitOps: every infrastructure change is proposed in a pull request, scanned by security linters, and deployed via a continuous delivery pipeline. AWS Config constantly audits the environment, backed by AWS Systems Manager remediation runbooks.",
    underFailure: "Now someone accidentally opens SSH port 22 to the world directly from the console! On the left, the vulnerability sits undetected indefinitely. On the right, AWS Config detects the compliance violation within seconds, and Systems Manager automatically closes the unauthorized port. Recovery takes 15 minutes instead of 5 days!"
  },

  // 10. Caching Content
  {
    points: [
      "80% of reads request the same 20% of content—don't hit the database every time",
      'Amazon CloudFront delivers static assets in 18ms from 600+ edge locations',
      'ElastiCache Redis serves hot database queries from RAM, reducing CPU load by 85%'
    ],
    theory: "Imagine an influencer with 10 million followers tweets a link to your e-commerce store. 100,000 people click the link at the exact same second. If your server queries the MySQL database 100,000 times for the exact same product photo and description, your database will melt. In computer science, 80% of user traffic asks for the exact same 20% of data. By placing CloudFront at the edge and ElastiCache Redis in front of the database, you serve requests in 18 milliseconds directly from RAM and reduce database load by 85%.",
    leftRest: "On the left, the uncached disaster: every single visitor request travels thousands of miles to hit an uncached origin server, which repeatedly queries the primary SQL database for the same images and product data. CPU sits dangerously high.",
    rightRest: "On the right, multi-tiered caching: Amazon CloudFront with 600+ edge locations caches static images and HTML near the user. ElastiCache Redis holds hot session data and query results in microsecond-fast memory, shielding the Aurora database behind it.",
    underFailure: "Now a viral traffic spike hits with 50,000 requests per second! On the left, the database connection pool exhausts, the server shakes, turns red, and the site goes offline. On the right, CloudFront absorbs 96% of the traffic at the edge, Redis handles the rest, and database CPU barely rises above 11%. Monthly cost drops from 490 to 165 dollars!"
  },

  // 11. Building Decoupled Architecture
  {
    points: [
      'Synchronous chains are fragile: if your payment or email service lags, checkout fails',
      'Amazon SQS acts as a shock absorber, safely storing messages for up to 14 days',
      'Dead Letter Queues (DLQ) ensure not a single customer order is ever dropped'
    ],
    theory: "Here is why tight coupling kills apps: suppose you're building DoorDash or Uber Eats. When a user taps 'Place Order', your app synchronously charges their card, alerts the restaurant, assigns a driver, and sends a receipt email. If the third-party email service takes 10 seconds to respond or crashes, the user's order fails! In a decoupled architecture, the order is dropped into an Amazon SQS message queue in 85 milliseconds. The user gets instant confirmation, and background workers process payment, restaurant alerts, and emails independently at their own pace.",
    leftRest: "On the left is the fragile synchronous chain: the web server calls the payment processor, which synchronously waits for a third-party email API. All three components are tightly coupled with SPOF tags. If any single service stalls, the entire checkout fails.",
    rightRest: "On the right is the asynchronous decoupled architecture: the checkout API drops the order into an Amazon SQS queue in under 85 milliseconds. Amazon SNS fans out the message to payment workers and notification workers. A Dead Letter Queue captures any failed message for safe retries.",
    underFailure: "Now the external email vendor goes offline during a massive Black Friday rush! On the left, checkout threads freeze, servers shake red, and thousands of customer orders are lost. On the right, orders safely queue up in SQS. Customers receive instant checkout confirmations, and messages are processed seamlessly once the vendor recovers!"
  },

  // 12. Serverless Architecture & Microservices
  {
    points: [
      'Running virtual machines 24/7 means paying for servers that sit idle at 3 AM',
      'AWS Lambda executes code on-demand with zero servers, zero OS patches, and zero idle cost',
      'Instantly scales from zero to tens of thousands of concurrent requests in milliseconds'
    ],
    theory: "If you rent a fleet of Linux virtual machines, you pay for them 24 hours a day, 365 days a year—even at 3 AM when zero users are visiting your app. Plus, your engineering team has to spend weekends patching Linux operating systems and upgrading security libraries. Serverless flips this model completely: with AWS Lambda and API Gateway, you write pure business logic code. When an HTTP request arrives, AWS spins up a container in milliseconds, runs your function, and shuts it down. When nobody is using your app, your bill is literally zero dollars.",
    leftRest: "On the left, traditional server-based infrastructure: two monolithic virtual machines running around the clock in Zones A and B, requiring constant OS security patches and costing money every second even when idle.",
    rightRest: "On the right, the modern serverless microservices stack: Amazon API Gateway routes incoming REST calls directly to AWS Lambda functions powered by ARM64 Graviton, orchestrated by AWS Step Functions, with data stored in Amazon DynamoDB on-demand.",
    underFailure: "Now a massive surge of 40,000 invocations arrives in 5 seconds! On the left, both virtual machines hit out-of-memory errors, shake red, and fail because booting replacement AMIs takes 10 minutes. On the right, AWS Lambda scales out concurrently in milliseconds, DynamoDB automatically adjusts capacity, and every request succeeds with sub-second response times!"
  },

  // 13. Data Pipelines
  {
    points: [
      'Running nightly mysqldump scripts on production databases causes severe table locks',
      'Amazon Kinesis Firehose streams live clickstream events into an S3 Data Lake',
      'Serverless AWS Glue and Amazon Athena query columnar Parquet data at 85% lower cost'
    ],
    theory: "In many companies, analytics is an afterthought. Every midnight, an engineer sets up a cron script that runs a giant SQL query across the live production database. What happens? The production database locks up, real users experience timeouts, and the Python script runs out of memory. AWS Well-Architected separates analytics from transactions: live user clickstream data is streamed continuously into Amazon Kinesis, transformed into columnar Parquet format by serverless AWS Glue, and queried in seconds using Amazon Athena without putting a single ounce of load on production databases.",
    leftRest: "On the left is the fragile legacy pipeline: a nightly cron script queries the production database directly, competing with live customers for disk IOPS and dumping raw CSV files onto a local disk. Reports are 24 hours out of date.",
    rightRest: "On the right is the serverless streaming data lake: live event producers publish to Amazon Kinesis Data Firehose, AWS Glue cleans and partitions the data into columnar Parquet format on Amazon S3, and Amazon Athena runs instant serverless SQL queries.",
    underFailure: "Now an unexpected 100x spike of clickstream data arrives with corrupted records! On the left, the cron worker runs out of memory, crashes red, and leaves company dashboards showing blank zeros. On the right, Kinesis Firehose buffers the surge, routes corrupted records to an S3 quarantine bucket, and Athena delivers analytics in under 60 seconds!"
  },

  // 14. Disaster Recovery & Business Continuity
  {
    points: [
      'Storing database backups in the same region is not a disaster recovery strategy',
      'Multi-Region Active-Active ensures business survival even if an entire region goes dark',
      'Amazon Route 53 ARC shifts global DNS traffic to a secondary region in under 60 seconds'
    ],
    theory: "Ask any IT manager about their disaster recovery plan, and they'll say: 'Oh, we take daily backups.' But where are those backups stored? In the same AWS data center region! What happens if a massive natural disaster, hurricane, or power grid failure knocks out the entire Northern Virginia region? Your backups go down with it! AWS Well-Architected provides multi-region disaster recovery: using Aurora Global Database, your data is replicated to Europe or Oregon in under one second. If a region goes dark, Route 53 Application Recovery Controller flips global traffic in under a minute.",
    leftRest: "On the left is 'backup and pray': all production workloads, storage, and unverified backups sit in a single region, us-east-1. If that region experiences a major outage, the ops team faces days of manual reconstruction.",
    rightRest: "On the right is Multi-Region Active-Active: Route 53 ARC sits at the top, routing traffic across us-east-1 and eu-west-1. Aurora Global Database continuously synchronizes data across continents in under one second, paired with cross-region S3 replication.",
    underFailure: "Now the worst-case scenario happens: the entire us-east-1 region loses power! On the left, the primary region collapses, the team panics, and the business faces 3 to 5 days of total downtime. On the right, Route 53 ARC immediately shifts 100% of global traffic to eu-west-1, Aurora promotes the secondary cluster, and the entire business is fully operational in under 30 seconds!"
  },

  // 15. Executive Conclusion & Architectural Scorecard
  {
    points: [
      'Architecture is not a one-time diagram—it is a continuous engineering culture',
      'Availability jumps from 98.5% to 99.99%, eliminating 3 critical high-risk issues',
      'Monthly spend drops from $4,450 to $1,820—a massive 59% FinOps cost reduction'
    ],
    theory: "To wrap up our defense: building cloud architectures is not about drawing pretty boxes on a whiteboard once and forgetting about them. It is an ongoing discipline grounded in the six pillars of the AWS Well-Architected Framework: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, and Sustainability. As you've seen across all fifteen domains, applying these principles transforms fragile, stressful single-point-of-failure systems into resilient, self-healing platforms that scale effortlessly.",
    leftRest: "On the left, the final verdict of the naive architecture: an uncontained blast radius, technical debt, security vulnerabilities, and unpredictable downtime that costs companies tens of thousands of dollars and ruins developer sleep.",
    rightRest: "On the right, the Well-Architected verdict: enterprise guardrails via AWS Organizations, automated GitOps CI/CD pipelines, end-to-end observability, and self-healing infrastructure that delivers certified 99.99% high availability.",
    underFailure: "Now we run the ultimate unannounced enterprise compliance audit! On the left, the naive system fails completely: auditors find unencrypted data, leaked credentials, and unmitigated single points of failure. On the right, AWS Config and Security Hub prove 100% compliance across all six pillars. Availability jumps from 98.5% to 99.99%, recovery drops from days to 30 seconds, and monthly spend drops by 59%. Thank you, and we're ready for your questions!"
  }
];
