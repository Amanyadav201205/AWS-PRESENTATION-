/** Spoken text and slide bullets for one module. Index matches domainIndex in allDomains (0 to 14). */
export interface ModuleScript {
  /** Three short bullets printed on the module's theory slide. */
  points: [string, string, string];
  /** Spoken on the theory slide: the named principle and what it means for this design. */
  theory: string;
  /** Spoken at normal load: the naive build on the left, card by card. */
  leftRest: string;
  /** Spoken at normal load: the Well-Architected build on the right, card by card. */
  rightRest: string;
  /** Spoken at peak load with the failure injected: what changes on both sides. */
  underFailure: string;
}

export const moduleScripts: ModuleScript[] = [
  {
    points: [
      'Complex systems grow from simple ones that already work',
      'Every unpartitioned dependency lowers the whole',
      'Answer: modular, independently testable parts'
    ],
    theory: 'Our first theory is Gall\'s law, from John Gall in 1977. A complex system that works evolved from a simple system that worked, and a big design drawn from scratch rarely survives contact with production. The arithmetic shows why. Reliability multiplies down the chain, so every unpartitioned dependency lowers the total. The Framework answers with modular parts that can be tested one at a time.',
    leftRest: 'On the left is the naive build at normal load. Four cards run top to bottom: internet clients, one App Server, one Primary Database and a flat S3 bucket. The App Server and the Primary Database carry SPOF tags. Packets move down the connectors toward a single path.',
    rightRest: 'On the right is the Well-Architected build at the same load: six cards from global clients through CloudFront with AWS WAF, the Application Load Balancer, the Auto-Scaling compute pool, Aurora Multi-AZ and the regional S3 store. Each card carries an HA tag, and the green connectors show healthy traffic on every hop.',
    underFailure: 'Now we push to one hundred thousand users and inject the regional outage. On the left, the App Server and the Primary Database shake and turn red, their connectors turn red and dashed, and the packets stop, so the stack goes dark. On the right, the compute and database cards pulse green as they recover, and the traffic stays on the healthy path. The strip below shows availability at 98.5 percent on the left and 99.99 on the right.',
  },
  {
    points: [
      'Split data into k pieces plus parity pieces across zones',
      'Rebuild from any k of the n pieces, so losing n minus k is survivable',
      'Eleven nines of durability without tripling every disk'
    ],
    theory: 'The theory here is Reed-Solomon erasure coding, published by Irving Reed and Gustave Solomon in 1960. Split data into k pieces, add parity pieces, and you can rebuild the original from any k of the n. That is how S3 claims eleven nines of durability without keeping three full copies of every disk. The math gives the chance of losing data as a binomial tail. Spread enough independent shards across zones and that chance becomes vanishingly small.',
    leftRest: 'On the left, the naive storage build at normal load. Three cards: a monolithic App Server, one 3 TB gp2 volume and a public, flat S3 bucket. The App Server and the volume carry SPOF tags, so losing either one takes the scans offline. Packets flow down the connectors.',
    rightRest: 'On the right, the Well-Architected storage layout: five cards. The app instance pool, a right-sized gp3 volume, S3 Intelligent-Tiering, Glacier Deep Archive for old scans and an AWS Backup vault. Each card carries an HA tag, and the green connectors show data moving from hot to cold tiers.',
    underFailure: 'Now the ransomware wiper runs at peak load. On the left, the public bucket and the 3 TB volume shake and turn red as the data is deleted, and the packets stop. On the right, the storage cards pulse green: Object Lock rejects every delete and AWS Backup keeps the immutable recovery points. The strip shows the monthly bill, 420 dollars on the left and 118 on the right.',
  },
  {
    points: [
      'Speedup is capped by the serial share of the work',
      'Bigger single machines hit a hardware wall',
      'Stateless instances scale out across zones'
    ],
    theory: 'Our theory is Amdahl\'s law, from Gene Amdahl in 1967, with Gustafson\'s later view of scaled workloads. The speedup from more processors is capped by the serial fraction of the work. A monolith keeps a large serial part, so buying a bigger machine hits a wall. Horizontal scaling wins because stateless instances split the parallel part across many machines. Elasticity then matches supply to demand, instead of buying for one peak a year.',
    leftRest: 'On the left, the naive compute build at normal load. Web traffic enters one Monolith EC2 instance, an m5.4xlarge, with local app storage behind it. Both carry SPOF tags. Packets run down a single path, and the monolith is the only thing serving them.',
    rightRest: 'On the right, the Well-Architected compute layout. The load balancer fans out to three Auto Scaling nodes, one in each zone, one of them a Spot worker. Each node shows its AZ pill and an HA tag, and green connectors show the traffic spread across all three zones.',
    underFailure: 'Now the flash sale hits: one hundred thousand users. On the left, the monolith overloads, shakes and turns red, its connector turns red and dashed, and the packets stop, so the system goes down. On the right, the zone a node fails and pulses green as the load balancer routes around it, while replacement instances launch. The strip shows the bill falling from 584 to 168 dollars a month.',
  },
  {
    points: [
      'Partition: choose availability or consistency',
      'Else: choose latency or consistency',
      'Quorum of 4 writes and 3 reads out of 6 copies'
    ],
    theory: 'The theory for databases is the CAP theorem from Eric Brewer in 2000, and its extension PACELC from Daniel Abadi in 2012. During a partition you trade availability against consistency. Otherwise you trade latency against consistency. Aurora resolves this with a quorum of six copies across three zones. Writes need four of the six and reads need three, so every read overlaps the latest committed write.',
    leftRest: 'On the left, the naive database build at normal load. The app servers feed one self-managed MySQL host on EC2, with a local backup script beside it. Both carry SPOF tags. Every packet queues behind the same single host.',
    rightRest: 'On the right, the Aurora cluster: a writer node in zone a, read replicas in zones b and c, and the distributed storage engine underneath. Each node shows its AZ pill and an HA tag, and the green connectors show the path from the app pool through the cluster.',
    underFailure: 'Now the writer node crashes at peak load. On the left, the MySQL host goes red and shakes, the packets stop, and there is no replica to take over, so recovery means hours of manual work. On the right, the Aurora writer pulses green as the cluster promotes a read replica in zone b. The strip shows recovery in under 30 seconds on the right, against four to six hours on the left.',
  },
  {
    points: [
      'Trust zones so one breach cannot reach the rest',
      'Independent layers multiply the attacker\'s odds down',
      'Private and isolated subnets with no internet route'
    ],
    theory: 'Our theory is the Saltzer and Schroeder principle of least privilege and compartmentalization, from 1975. Split the system into trust zones so that a breach in one cannot compromise the others. If three independent layers each stop ten percent of attacks, the attacker must beat all three, which is one chance in a thousand. The database sits in a subnet with no route to the internet at all.',
    leftRest: 'On the left, the naive network. A port scanner and botnet sit at the top, then the default flat VPC, then the public MySQL database. The database carries a SPOF tag and a 0.0.0.0/0 port 3306 tag, so anyone on the internet can reach it.',
    rightRest: 'On the right, five tiers: external traffic, the internet gateway, the public subnet with the load balancer and NAT gateway, the private application subnet, and the isolated subnet holding Aurora. Only the top two cards face the internet, and the isolated subnet has no route to the gateway.',
    underFailure: 'Now the scanner and botnet attack the network. On the left, the public MySQL card shakes and turns red, its connector turns red and dashed, and the scanner reaches the database through the open port. On the right, the attack stops at the top of the chain, and the isolated subnet pulses green because nothing outside can reach it. The strip shows the same gap in availability: 98.5 percent against 99.99.',
  },
  {
    points: [
      'A full mesh of N networks needs N(N-1)/2 links',
      'A hub needs one attachment per network',
      'Transitive routing comes with the hub'
    ],
    theory: 'The theory is the count of connections in a full mesh. With N networks, peering every pair takes N times N minus one over two links. Twenty VPCs means one hundred and ninety peering links, each with routes kept by hand. A hub such as Transit Gateway needs one attachment per network. That moves the cost from quadratic to linear, and it gives transitive routing for free.',
    leftRest: 'On the left, the naive connectivity: corporate HQ at the top, then one IPsec VPN over the internet tagged SPOF, then three VPCs wired by peering. Every packet from headquarters funnels through that single VPN.',
    rightRest: 'On the right, the Well-Architected connectivity: headquarters, a 10 gigabit Direct Connect circuit and a backup VPN running BGP, into a Transit Gateway hub. Egress passes a central firewall, and the spoke VPCs hang off the hub. Green connectors show the hub carrying the traffic.',
    underFailure: 'Now the primary Direct Connect fibre is cut. On the left, the single IPsec VPN shakes and turns red, its connector goes red and dashed, and the packets stop, so engineering, accounting and logistics lose the cloud. On the right, the Direct Connect card pulses green as BGP moves traffic to the backup VPN within seconds. The strip shows 98.0 percent on the left and 99.99 on the right.',
  },
  {
    points: [
      'Assume the attacker knows the system; only the key is secret',
      'Short-lived credentials from IAM roles',
      'Secrets rotated automatically, data encrypted under KMS keys'
    ],
    theory: 'Kerckhoffs\'s principle, stated in 1883, and Shannon\'s maxim from 1949 say the same thing: assume the enemy knows the system, so only the key is secret. Hardcoded credentials break that rule at the root. The fix is short-lived identity from IAM roles, secrets in Secrets Manager rotated every thirty days, and envelope encryption under a KMS customer managed key.',
    leftRest: 'On the left, the naive security build. The malicious attacker sits at the top, then an app with hardcoded keys and a database with a cleartext password, both tagged SPOF. Nothing stands between the attacker and the database.',
    rightRest: 'On the right, the Well-Architected security layout. The WAF with OWASP managed rules sits at the edge, then an IAM role with least-privilege temporary credentials, Secrets Manager, the KMS customer managed key and GuardDuty. Every card carries an HA tag, and each request passes the WAF first.',
    underFailure: 'Now the SQL injection and the stolen key arrive together. On the left, the app with hardcoded keys shakes and turns red, its connector goes red and dashed, and the packets reach the database. On the right, the WAF blocks the injection with a 403 at the edge, and GuardDuty flags the anomalous calls, and their cards pulse green. The strip sets the two builds side by side.',
  },
  {
    points: [
      'Series availabilities multiply, parallel ones reinforce',
      'Redundancy pays only when failures are detected fast',
      'Health checks are part of the availability maths'
    ],
    theory: 'This module\'s theory is the availability rule for parallel systems. Availability in series multiplies. Availability in parallel is one minus the product of the failure probabilities. Three independent zones at 99.9 percent each give one minus one in a billion, which is nine nines for the compute tier. Redundancy only pays if failures are detected quickly, so health checks and monitoring belong in the calculation.',
    leftRest: 'On the left, the naive monitoring build. An unmonitored EC2 instance tagged SPOF, then angry customers on Twitter, then a manual SSH terminal. Packets reach the instance, and nothing watches it.',
    rightRest: 'On the right, the Well-Architected monitoring chain: a Synthetics canary, composite alarms, X-Ray tracing, an EventBridge rule and a self-healing Lambda. Green connectors show the signal travelling from the canary to the Lambda that recovers the task.',
    underFailure: 'Now a silent memory leak builds at peak load. On the left, the unmonitored instance shakes and turns red, and the packets stop while customers find the outage first. On the right, the composite alarm and the self-healing Lambda pulse green as the canary catches the checkout timeout and the task is recycled. The strip shows recovery going from two to four hours down to under 45 seconds.',
  },
  {
    points: [
      'Systems mirror the organization that builds them',
      'Describe the desired state in code under version control',
      'A pipeline converges reality back to the code'
    ],
    theory: 'Conway\'s law, from Melvin Conway in 1968, says a system mirrors the communication structure of the organization that builds it. Declarative infrastructure counters the drift that follows. Describe the desired state in code, keep it in version control, and let a pipeline converge the real environment to it. The gap between desired and actual state shrinks to zero, because nothing changes outside the pipeline.',
    leftRest: 'On the left, the naive automation build. A developer works in the console, the production VPC and a drifted security group follow, both tagged SPOF. Hand-made changes go straight to production with no record.',
    rightRest: 'On the right, the Well-Architected automation chain. A Git pull request feeds the CI runner, which builds an immutable multi-AZ VPC. The AWS Config drift detector and the Systems Manager playbook sit at the end. Green connectors show every change passing through the pipeline.',
    underFailure: 'Now someone opens port 22 to the world from the console. On the left, the drifted security group shakes and turns red, and nothing reports it. On the right, AWS Config flags the rule and the Systems Manager playbook pulses green as it removes the open rule automatically. The strip shows recovery: days to reconstruct on the left, under 15 minutes on the right.',
  },
  {
    points: [
      'About 80 percent of reads hit about 20 percent of items',
      'Cache that slice at the edge and in memory',
      'Effective latency falls as the hit ratio rises'
    ],
    theory: 'The theory here is Zipf\'s law and the 80-20 rule that Pareto observed. A small slice of the content draws most of the reads. Caching that slice at the edge and in memory changes the average latency. The effective time is the hit ratio times the cache time, plus the miss ratio times the origin time. At a 95 percent hit ratio, a two-millisecond cache and an eighty-millisecond origin give about six milliseconds.',
    leftRest: 'On the left, the naive caching build. Global visitors go straight to an uncached origin server, then to the primary SQL database. Both carry SPOF tags, and every image and repeated query lands on them.',
    rightRest: 'On the right, the Well-Architected caching chain: the CloudFront CDN with more than 600 edge locations, the private S3 origin, ElastiCache Redis, the application microservices and the protected Aurora database. Each card takes load off the next, and the green connectors show it.',
    underFailure: 'Now the flash sale hits the cache layer at 50,000 requests a second. On the left, the origin server and the SQL database shake and turn red, the packets stop, and the connection pool runs dry. On the right, CloudFront and ElastiCache pulse green as they absorb the spike, and the database behind them stays in service. The strip shows the monthly bill: 490 dollars on the left, 165 on the right.',
  },
  {
    points: [
      'A blocking chain multiplies availabilities together',
      'Over an unreliable link, delivery needs retries and idempotency',
      'A queue lets each service run at its own availability'
    ],
    theory: 'The theory is that a synchronous chain multiplies availability. Five services at 99 percent each, called in a blocking chain, give about 95 percent. The two generals problem adds a warning: over an unreliable link you can never be certain the other side received a message, so you need retries and idempotent handlers. A queue breaks the chain. The producer hands off the message and moves on, and each consumer runs at its own availability.',
    leftRest: 'On the left, the naive checkout. The customer goes to a monolithic web server, then the payment gateway, then the third-party email vendor. All three carry SPOF tags, so one slow step holds up the whole checkout.',
    rightRest: 'On the right, the Well-Architected checkout. The shopper goes to a fast ingestion API, then the Amazon SQS orders queue with its dead-letter queue, then SNS fans out to the payment worker and the notification worker. Green connectors show the order handed to the queue.',
    underFailure: 'Now the email vendor goes down during 20,000 Black Friday orders. On the left, the email vendor and the monolithic web server shake and turn red, the packets stop, and checkout fails. On the right, the orders queue and the notification worker pulse green. Shoppers still get confirmation, the backlog waits in SQS, and the dead-letter queue catches anything that keeps failing.',
  },
  {
    points: [
      'Average items in a system equal arrival rate times time in system',
      'Capacity that follows arrivals removes idle cost',
      'Zero requests means near-zero spend'
    ],
    theory: 'The theory here is Little\'s law, from John Little in 1961. The average number of items in a system equals the arrival rate multiplied by the average time each item spends inside. If capacity follows arrivals instead of a fixed fleet, idle cost goes to zero. At three in the morning the arrival rate is close to zero, so the bill is close to zero too.',
    leftRest: 'On the left, the naive serverless build. Two monolith virtual machines, one in zone a and one in zone b, both tagged SPOF, and a manual OS patching window. Both VMs are paid for around the clock.',
    rightRest: 'On the right, the Well-Architected serverless chain: API Gateway, the ARM64 auth Lambda, Step Functions, the order-processing Lambda and DynamoDB on demand. The cards are services rather than servers, and green connectors show each request passing through them.',
    underFailure: 'Now a burst of 40,000 invocations hits. On the left, both virtual machines shake and turn red, the packets stop, and new instances take minutes to boot. On the right, API Gateway, the Lambdas and DynamoDB pulse green as they scale out at once, and the request keeps flowing. The strip shows recovery time: 15 minutes for AMI boot on the left, under a second on the right.',
  },
  {
    points: [
      'Lambda architecture: a batch layer and a speed layer',
      'Kappa architecture: one stream for both',
      'Columnar Parquet on S3 scans only the columns a query needs'
    ],
    theory: 'The theory is the split between the Lambda architecture, proposed by Nathan Marz around 2011, and the Kappa architecture, proposed by Jay Kreps in 2014. Lambda runs a batch layer and a speed layer side by side. Kappa unifies them into one stream. AWS favors the streaming side for freshness, and columnar Parquet on S3 for cost, because a query reads only the columns it needs.',
    leftRest: 'On the left, the naive data pipeline. The production relational database, a cron worker on EC2 and a local CSV on disk, all tagged SPOF. The nightly job reads the live database, so it competes with customers for the same tables.',
    rightRest: 'On the right, the Well-Architected data pipeline. Live event producers feed Kinesis Firehose, Glue converts the stream, the S3 data lake stores it, and Athena queries it in place. The production database is not on this path at all.',
    underFailure: 'Now a 100x payload spike arrives with corrupted records. On the left, the cron worker runs out of memory, the local disk shakes and turns red, the packets stop, and the dashboards show stale zeros. On the right, Kinesis Firehose and Glue pulse green, route the bad records to a quarantine bucket, and Athena keeps answering queries. The strip shows a manual rerun on the left and delivery in under 60 seconds on the right.',
  },
  {
    points: [
      'Four strategies: backup, pilot light, warm standby, active-active',
      'Lower RTO and RPO raise standby cost',
      'Choose by the cost of downtime, not by fear'
    ],
    theory: 'The theory is the cost of recovery. As RTO and RPO approach zero, the cost of standby capacity rises. AWS describes four strategies: backup and restore, pilot light, warm standby, and multi-region active-active. In our model, backup and restore costs one unit with a twenty-four hour RTO. Active-active costs about seven units and recovers in under thirty seconds. Pick the strategy that matches the cost of downtime.',
    leftRest: 'On the left, the naive disaster recovery. The primary region us-east-1, an untested snapshot in the same region, and the panicked ops team, with SPOF tags on the region and the snapshot. Everything sits in one region.',
    rightRest: 'On the right, the Well-Architected disaster recovery. Route 53 Application Recovery Controller at the top, the primary region, a secondary region in eu-west-1, the Aurora Global Database and cross-region S3 replication. Green connectors show traffic and data running to both regions.',
    underFailure: 'Now the whole us-east-1 region goes dark. On the left, the primary region and the untested snapshot shake and turn red, the packets stop, and the ops team rebuilds by hand. On the right, the primary region card pulses green as Route 53 ARC shifts traffic to eu-west-1 and Aurora promotes the secondary cluster. The strip shows recovery: three to five days on the left, under a minute on the right.',
  },
  {
    points: [
      'Architecture is a continuous practice, not a one-time sign-off',
      'Fitness functions protect qualities as the system changes',
      'The six pillars are the fitness checks'
    ],
    theory: 'The last theory is evolutionary architecture, set out by Neal Ford, Rebecca Parsons and Patrick Kua in 2017. An architecture is guided, incremental change, protected by fitness functions that check its qualities after every change. The six pillars act as those fitness checks. A Well-Architected review scores the system across them, and the score is a weighted sum of the pillars.',
    leftRest: 'On the left, the naive verdict. The technical debt backlog and the uncontained blast radius, both tagged SPOF. Two cards, no guardrails, and the packets run into both.',
    rightRest: 'On the right, the Well-Architected governance: AWS Organizations with service control policies, the GitOps CI/CD pipelines, and proactive telemetry with auto-healing. Every card carries an HA tag, and the green connectors show the governance path.',
    underFailure: 'Now the unannounced audit stress test. On the left, the backlog and the blast radius shake and turn red, the packets stop, and the audit finds unencrypted data and public credentials. On the right, the governance and pipeline cards pulse green as Config and Security Hub report compliance and the telemetry heals the disruption. The final slide sums up the change.',
  }
];
