/** Spoken text and slide bullets for one module. Index matches domainIndex in allDomains (0 to 14). */
export interface ModuleScript {
  /** Three short bullets printed on the module's theory slide. */
  points: [string, string, string];
  /** Spoken during the theory slide. The formula is read from the theory data. */
  theory: string;
  /** Spoken first on the comparison slide: the naive build on the left. */
  naive: string;
  /** Spoken second on the comparison slide: the Well-Architected build on the right. */
  resilient: string;
}

export const moduleScripts: ModuleScript[] = [
  {
    points: [
      'Complex systems grow from simple ones that already work',
      'Every unpartitioned dependency lowers the whole',
      'Answer: modular, independently testable parts'
    ],
    theory: 'Our first theory is Gall\'s law, from John Gall in 1977. A complex system that works evolved from a simple system that worked, and a big design drawn from scratch rarely survives contact with production. The arithmetic shows why. Reliability multiplies down the chain, so every unpartitioned dependency lowers the total. The Framework answers with modular parts that can be tested one at a time.',
    naive: 'On the left is the overview build: one application server and one primary database, both single points of failure, plus a flat bucket. Under the peak surge and the zone failure the stack goes dark. Its stated availability is 98.5 percent, with a recovery of four to eight hours.',
    resilient: 'On the right is the same surge and the same failure. CloudFront and the web application firewall sit at the edge, a load balancer spans three zones, and Aurora keeps a standby. The failed zone leaves rotation within seconds. The design states 99.99 percent availability, failover in under thirty seconds, and monthly cloud spend down from four thousand four hundred and fifty dollars to eighteen hundred and twenty.'
  },
  {
    points: [
      'Split data into k pieces plus parity pieces across zones',
      'Rebuild from any k of the n pieces, so losing n minus k is survivable',
      'Eleven nines of durability without tripling every disk'
    ],
    theory: 'The theory here is Reed-Solomon erasure coding, published by Irving Reed and Gustave Solomon in 1960. Split data into k pieces, add parity pieces, and you can rebuild the original from any k of the n. That is how S3 claims eleven nines of durability without keeping three full copies of every disk. The math gives the chance of losing data as a binomial tail. Spread enough independent shards across zones and that chance becomes vanishingly small.',
    naive: 'Storage on the left. Fifty terabytes of medical scans, kept for seven years, sit on one three-terabyte gp2 disk, where speed is tied to size, in a flat bucket with no versioning. A compromised developer key runs a recursive delete, and the scans are gone.',
    resilient: 'On the right: gp3 volumes sized for the workload, an S3 bucket with Object Lock in compliance mode, and Glacier Deep Archive for old scans. Every delete now returns a 403, even for the root user, and AWS Backup keeps immutable recovery points. Monthly storage spend falls from four hundred and twenty dollars to one hundred and eighteen.'
  },
  {
    points: [
      'Speedup is capped by the serial share of the work',
      'Bigger single machines hit a hardware wall',
      'Stateless instances scale out across zones'
    ],
    theory: 'Our theory is Amdahl\'s law, from Gene Amdahl in 1967, with Gustafson\'s later view of scaled workloads. The speedup from more processors is capped by the serial fraction of the work. A monolith keeps a large serial part, so buying a bigger machine hits a wall. Horizontal scaling wins because stateless instances split the parallel part across many machines. Elasticity then matches supply to demand, instead of buying for one peak a year.',
    naive: 'Compute on the left. One oversized monolith in one zone, running around the clock. Five thousand shoppers at baseline and fifty thousand in a flash sale. At ten times normal traffic it runs out of memory, the kernel stops the service, and the whole system goes down.',
    resilient: 'On the right, an Auto Scaling group of Graviton instances spans three zones behind a load balancer. When zone a fails, its node is marked unhealthy within about ten seconds, traffic shifts to zones b and c, and replacements launch in under seventy-five seconds. Monthly compute falls from five hundred and eighty-four dollars to one hundred and sixty-eight.'
  },
  {
    points: [
      'Partition: choose availability or consistency',
      'Else: choose latency or consistency',
      'Quorum of 4 writes and 3 reads out of 6 copies'
    ],
    theory: 'The theory for databases is the CAP theorem from Eric Brewer in 2000, and its extension PACELC from Daniel Abadi in 2012. During a partition you trade availability against consistency. Otherwise you trade latency against consistency. Aurora resolves this with a quorum of six copies across three zones. Writes need four of the six and reads need three, so every read overlaps the latest committed write.',
    naive: 'Database on the left. Self-managed MySQL on one virtual machine, backed up by a cron script. Nightly dumps lock the tables and checkouts time out. When the primary machine kernel-panics there is no replica, so the database is down for hours and up to a day of commits is lost.',
    resilient: 'On the right, an Aurora cluster: the writer in zone a, read replicas in zones b and c, and storage replicated six ways. If the writer dies, a replica is promoted and the cluster endpoint moves in under thirty seconds, with no committed transaction lost. Continuous backups allow point-in-time recovery to the second.'
  },
  {
    points: [
      'Trust zones so one breach cannot reach the rest',
      'Independent layers multiply the attacker\'s odds down',
      'Private and isolated subnets with no internet route'
    ],
    theory: 'Our theory is the Saltzer and Schroeder principle of least privilege and compartmentalization, from 1975. Split the system into trust zones so that a breach in one cannot compromise the others. If three independent layers each stop ten percent of attacks, the attacker must beat all three, which is one chance in a thousand. The database sits in a subnet with no route to the internet at all.',
    naive: 'Networking on the left. A default VPC with every server on a public address, and MySQL listening on port 3306 to the whole internet. A botnet scanner finds the port within hours, runs a dictionary attack, and dumps the database.',
    resilient: 'On the right, three tiers across three zones: public for the load balancer and NAT, private for the application, and isolated for the database. The database has no public address and no route to the internet gateway. The scanner cannot even locate it, so its packets are dropped at the edge. VPC flow logs record every connection for audit.'
  },
  {
    points: [
      'A full mesh of N networks needs N(N-1)/2 links',
      'A hub needs one attachment per network',
      'Transitive routing comes with the hub'
    ],
    theory: 'The theory is the count of connections in a full mesh. With N networks, peering every pair takes N times N minus one over two links. Twenty VPCs means one hundred and ninety peering links, each with routes kept by hand. A hub such as Transit Gateway needs one attachment per network. That moves the cost from quadratic to linear, and it gives transitive routing for free.',
    naive: 'Connectivity on the left: a mesh of VPC peering links, and one IPsec VPN over the public internet as the only path to headquarters. Every new account needs routes on every other account. When the tunnel drops, engineering, accounting and logistics lose the cloud.',
    resilient: 'On the right, a Transit Gateway hub with spokes for production, staging and data. Direct Connect carries the main link, and a backup VPN with BGP takes over in a few seconds when the fiber is cut. All internet egress passes through a central inspection firewall.'
  },
  {
    points: [
      'Assume the attacker knows the system; only the key is secret',
      'Short-lived credentials from IAM roles',
      'Secrets rotated automatically, data encrypted under KMS keys'
    ],
    theory: 'Kerckhoffs\'s principle, stated in 1883, and Shannon\'s maxim from 1949 say the same thing: assume the enemy knows the system, so only the key is secret. Hardcoded credentials break that rule at the root. The fix is short-lived identity from IAM roles, secrets in Secrets Manager rotated every thirty days, and envelope encryption under a KMS customer managed key.',
    naive: 'Security on the left. Permanent access keys committed to a repository, a root-level account used by the application, and a database password in clear text. One SQL injection exposes five hundred thousand card records, and the stolen key starts GPU instances for crypto mining the same night.',
    resilient: 'On the right, IAM roles issue temporary credentials that expire after an hour. Secrets Manager rotates the database password every thirty days with no downtime. The web application firewall blocks SQL injection with a 403 at the edge, and GuardDuty flags the anomalous API calls. Monthly security spend is sixty-eight dollars.'
  },
  {
    points: [
      'Series availabilities multiply, parallel ones reinforce',
      'Redundancy pays only when failures are detected fast',
      'Health checks are part of the availability maths'
    ],
    theory: 'This module\'s theory is the availability rule for parallel systems. Availability in series multiplies. Availability in parallel is one minus the product of the failure probabilities. Three independent zones at 99.9 percent each give one minus one in a billion, which is nine nines for the compute tier. Redundancy only pays if failures are detected quickly, so health checks and monitoring belong in the calculation.',
    naive: 'Monitoring on the left: an unmonitored instance, a manual SSH session running tail -f, and customers reporting the outage on social media. Basic CPU looks normal while checkouts hang, and the team spends hours guessing which instance is stuck.',
    resilient: 'On the right: CloudWatch Synthetics canaries that exercise the real checkout path, composite alarms that need several signals before paging anyone, and X-Ray tracing. When a canary fails, EventBridge starts a Lambda that recycles the unhealthy tasks. Detection takes under fifteen seconds and remediation about forty-five.'
  },
  {
    points: [
      'Systems mirror the organization that builds them',
      'Describe the desired state in code under version control',
      'A pipeline converges reality back to the code'
    ],
    theory: 'Conway\'s law, from Melvin Conway in 1968, says a system mirrors the communication structure of the organization that builds it. Declarative infrastructure counters the drift that follows. Describe the desired state in code, keep it in version control, and let a pipeline converge the real environment to it. The gap between desired and actual state shrinks to zero, because nothing changes outside the pipeline.',
    naive: 'Automation on the left is ClickOps. Engineers change the console by hand, leave undocumented ports open, and staging never matches production. Port 22 stays open to the world for weeks, and rebuilding the environment after a disaster takes days of guesswork.',
    resilient: 'On the right, every VPC, route and policy is Terraform or CDK code, reviewed in a pull request and scanned by Checkov before deployment. AWS Config flags a non-compliant security group within a minute, and Systems Manager removes the rule automatically. A full production region can be rebuilt in about fifteen minutes.'
  },
  {
    points: [
      'About 80 percent of reads hit about 20 percent of items',
      'Cache that slice at the edge and in memory',
      'Effective latency falls as the hit ratio rises'
    ],
    theory: 'The theory here is Zipf\'s law and the 80-20 rule that Pareto observed. A small slice of the content draws most of the reads. Caching that slice at the edge and in memory changes the average latency. The effective time is the hit ratio times the cache time, plus the miss ratio times the origin time. At a 95 percent hit ratio, a two-millisecond cache and an eighty-millisecond origin give about six milliseconds.',
    naive: 'Caching on the left. Every image, stylesheet and repeated query goes straight to the origin. Global viewers wait on long routes, and the database runs near ninety-six percent CPU. At the flash-sale spike the connection pool runs dry within seconds.',
    resilient: 'On the right, CloudFront serves most static requests from more than six hundred edge locations and absorbs about ninety-six percent of them. ElastiCache Redis answers hot queries from memory. Database CPU falls to about eleven percent, and the p95 latency drops from around 850 milliseconds to about 18.'
  },
  {
    points: [
      'A blocking chain multiplies availabilities together',
      'Over an unreliable link, delivery needs retries and idempotency',
      'A queue lets each service run at its own availability'
    ],
    theory: 'The theory is that a synchronous chain multiplies availability. Five services at 99 percent each, called in a blocking chain, give about 95 percent. The two generals problem adds a warning: over an unreliable link you can never be certain the other side received a message, so you need retries and idempotent handlers. A queue breaks the chain. The producer hands off the message and moves on, and each consumer runs at its own availability.',
    naive: 'Decoupling on the left: a blocking chain. Checkout waits for the payment gateway, then inventory, then the email vendor. When the email vendor stalls, every web worker waits on a socket timeout and checkout crashes. Each order takes around three thousand eight hundred milliseconds.',
    resilient: 'On the right, checkout returns in about eighty-five milliseconds after writing to Amazon SQS. Workers pull messages at their own pace. If the email vendor is down, messages wait in the queue for up to fourteen days, and any message that keeps failing moves to a dead-letter queue with an alarm.'
  },
  {
    points: [
      'Average items in a system equal arrival rate times time in system',
      'Capacity that follows arrivals removes idle cost',
      'Zero requests means near-zero spend'
    ],
    theory: 'The theory here is Little\'s law, from John Little in 1961. The average number of items in a system equals the arrival rate multiplied by the average time each item spends inside. If capacity follows arrivals instead of a fixed fleet, idle cost goes to zero. At three in the morning the arrival rate is close to zero, so the bill is close to zero too.',
    naive: 'Serverless on the left: stateful virtual machines, paid for around the clock. At three in the morning they cost about eighteen dollars a day. New instances take roughly twelve minutes to boot, install packages and join the load balancer, so the viral moment is wasted. Patching happens in a weekly window.',
    resilient: 'On the right: API Gateway, Lambda on Graviton, Step Functions and DynamoDB on demand. Idle compute cost is zero. Scaling from nothing to ten thousand requests per second takes under half a second, and there are no operating systems to patch.'
  },
  {
    points: [
      'Lambda architecture: a batch layer and a speed layer',
      'Kappa architecture: one stream for both',
      'Columnar Parquet on S3 scans only the columns a query needs'
    ],
    theory: 'The theory is the split between the Lambda architecture, proposed by Nathan Marz around 2011, and the Kappa architecture, proposed by Jay Kreps in 2014. Lambda runs a batch layer and a speed layer side by side. Kappa unifies them into one stream. AWS favors the streaming side for freshness, and columnar Parquet on S3 for cost, because a query reads only the columns it needs.',
    naive: 'Data pipelines on the left: a nightly cron job on one EC2 instance. It runs mysqldump against the production database and writes to local disk, and a Python script runs out of memory on large files. Executives see numbers that are a day old.',
    resilient: 'On the right, events stream through Kinesis Data Firehose into an S3 data lake. Glue converts them to Parquet, and Athena queries them in place. Data is available for analysis in under a minute, production databases are untouched, and scanning Parquet cuts query cost by around 85 percent.'
  },
  {
    points: [
      'Four strategies: backup, pilot light, warm standby, active-active',
      'Lower RTO and RPO raise standby cost',
      'Choose by the cost of downtime, not by fear'
    ],
    theory: 'The theory is the cost of recovery. As RTO and RPO approach zero, the cost of standby capacity rises. AWS describes four strategies: backup and restore, pilot light, warm standby, and multi-region active-active. In our model, backup and restore costs one unit with a twenty-four hour RTO. Active-active costs about seven units and recovers in under thirty seconds. Pick the strategy that matches the cost of downtime.',
    naive: 'Disaster recovery on the left is backup and hope. Snapshots live in the same region as production. If us-east-1 goes dark, everything is trapped there. The runbook has never been tested, recovery takes three to five days, and up to two weeks of commits are lost.',
    resilient: 'On the right, active-active across us-east-1 and eu-west-1. Aurora Global Database replicates in under a second, Route 53 Application Recovery Controller shifts traffic in under a minute, and drills run continuously. The design costs about five hundred and twenty dollars a month, and it is rehearsed.'
  },
  {
    points: [
      'Architecture is a continuous practice, not a one-time sign-off',
      'Fitness functions protect qualities as the system changes',
      'The six pillars are the fitness checks'
    ],
    theory: 'The last theory is evolutionary architecture, set out by Neal Ford, Rebecca Parsons and Patrick Kua in 2017. An architecture is guided, incremental change, protected by fitness functions that check its qualities after every change. The six pillars act as those fitness checks. A Well-Architected review scores the system across them, and the score is a weighted sum of the pillars.',
    naive: 'The verdict on the left is an unmitigated risk profile. Ninety-eight point five percent availability, unplanned downtime, a backlog of technical debt, and a blast radius nobody has contained. Annual infrastructure spend is fifty-three thousand four hundred dollars, and an audit would fail.',
    resilient: 'On the right, the certified workload: 99.99 percent availability, failover under thirty seconds, zero high-risk issues, and annual spend of twenty-one thousand eight hundred and forty dollars. Organizational guardrails, policy as code and GitOps pipelines keep it that way, and it scores 96 out of 100 in review.'
  }
];
