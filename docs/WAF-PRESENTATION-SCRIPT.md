# WAF Presentation: Speaker Script and Slide Guide

About 3,014 spoken words in 55 lines across 38 slides: about **21:23 minutes** at a steady pace (144 words per minute). Devarsh and Aman alternate line by line.

The deck is in the site (`?present=1`) and can be downloaded as a PowerPoint file from the presentation screen. Each PowerPoint slide carries its script in the speaker notes.

## Keys

| Key | Does |
|---|---|
| Space, Page Down, or N | Next line, and its slide |
| B or Page Up | Previous line |
| Esc | Exit the deck |

Open a given line directly with `?present=1&line=N`, where N starts at 0.

## Slides and script

### Slide 1: Naive builds versus resilient builds

*AWS Well-Architected Framework*

On screen:
- Devarsh Patel and Aman Kumar
- Fifteen modules, each with theory and a side-by-side simulation

**1. Devarsh:** Good morning. Anyone can launch a server in five minutes. Keeping a platform alive through traffic spikes and failures is architecture, and that is what we are here to show. We are two presenters, Devarsh and Aman, and we will take you through fifteen modules of the AWS Well-Architected Framework in about twenty minutes.

**2. Aman:** Each module follows the same pattern. First a theory slide that names the principle behind the design. Then a comparison slide, with the naive build on the left and the Well-Architected build on the right, on one screen, under the same traffic and the same failure.

### Slide 2: Core theory, then fifteen modules

*Agenda*

On screen:
- Core theory: pillars, single points of failure, availability math, blast radius
- Modules 1 to 15: storage through disaster recovery, then the scorecard
- Every comparison uses the same traffic and the same failure

**3. Devarsh:** Here is the route. We start with the core theory: the six pillars, single points of failure, the arithmetic of availability and blast radius. Then come the fifteen modules, from storage and compute through networking, security, monitoring, automation, caching, decoupling, serverless, data and disaster recovery. We finish with the scorecard.

### Slide 3: Six pillars, one design

*Core theory · 1 of 5*

On screen:
- Operational excellence: run and improve systems through code
- Security: protect data, systems and assets in depth
- Reliability: recover from failure and meet demand
- Performance efficiency: use resources that match demand
- Cost optimization: pay only for what delivers value
- Sustainability: use the least energy the workload needs

**4. Aman:** The Framework rests on six pillars: operational excellence, security, reliability, performance efficiency, cost optimization and sustainability. Every module you will see maps to at least one of them. A design that wins on one pillar and loses on another is a trade-off, and we will name that trade-off every time.

### Slide 4: Single point of failure

*Core theory · 2 of 5*

On screen:
- A single point of failure is any part whose loss stops the workload
- Test: if this part disappears now, does a customer notice?
- In a serial chain, availabilities multiply and the total falls

Formula: Availability of a serial chain is the product of each part. Five parts at 99 percent give about 95.1 percent.

**5. Devarsh:** A single point of failure is any component whose loss stops the whole workload. The test is simple: if this part disappears right now, does a customer notice? In a serial chain, availabilities multiply. Five services at 99 percent each give about 95 percent overall, which means roughly eighteen days of downtime a year. Chains are where availability goes to die.

### Slide 5: The arithmetic of availability

*Core theory · 3 of 5*

On screen:
- 99.9% allows about 8 hours 45 minutes of downtime a year
- 99.99% allows about 53 minutes; 99.999% about 5 minutes
- Two independent zones at 99.9% each reach 99.9999% together

Formula: Parallel availability is one minus the product of each part failing. Two zones at 99.9 percent give 99.9999 percent.

**6. Aman:** Availability is measured in nines. Ninety-nine point nine percent allows about eight hours and forty-five minutes of downtime a year. Ninety-nine point nine nine allows about fifty-three minutes. For redundant parts the rule flips. If two independent zones are each up 99.9 percent of the time, both are down together only one time in a million, so the pair reaches 99.9999 percent. That formula drives every redundancy decision in this talk.

### Slide 6: Blast radius, RTO and RPO

*Core theory · 4 of 5*

On screen:
- Blast radius: how much breaks when one failure domain breaks
- Failure domains: instance, availability zone, region
- RTO: how long the business can be down
- RPO: how much data the business can lose

**7. Devarsh:** Blast radius is how much breaks when one thing breaks. We cut the system into failure domains: an instance, an availability zone, a region. A well-designed system loses one domain and keeps serving from the rest. Two numbers describe recovery. RTO, the recovery time objective, is how long the business can be down. RPO, the recovery point objective, is how much data it can lose. Lower values cost more, and that trade-off runs through the whole talk.

### Slide 7: How to read each comparison

*Core theory · 5 of 5*

On screen:
- Left: the naive build, single servers and flat networks
- Right: the Well-Architected build, with redundancy and isolation
- Lanes show packets: green is healthy, red is a failing path
- Same traffic and same failure on both sides

**8. Aman:** Every comparison screen has the same layout. The left column is the naive build: single servers, flat networks, manual steps. The right column is the Well-Architected build. The lanes between boxes are packets. Green means healthy traffic and red means a failing path. We run the same surge and the same failure through both, so the difference you see is the architecture, not the luck of the moment.

### Slide 8: Architecture Overview

*Module 1 of 15 · Theory*

On screen:
- Complex systems grow from simple ones that already work
- Every unpartitioned dependency lowers the whole
- Answer: modular, independently testable parts

Formula: System reliability S(t) degrades exponentially as unpartitioned interdependent components (p_i) increase.

**9. Devarsh:** Our first theory is Gall's law, from John Gall in 1977. A complex system that works evolved from a simple system that worked, and a big design drawn from scratch rarely survives contact with production. The formula shows why. Reliability multiplies down the chain, so every unpartitioned dependency lowers the total. The Framework answers with modular parts that can be tested one at a time.

### Slide 9: Overview: the same app built two ways.

*Module 1 of 15 · Naive (left) vs Well-Architected (right)*

On screen:
- Naive: 98.5% (Single Point of Failure), recovery 4 - 8 Hours
- Well-Architected: 99.99% (High Availability), recovery Typically < 30s (Aurora failover)

**10. Aman:** On the left is the overview build: one application server and one primary database, both single points of failure, plus a flat bucket. Under the peak surge and the zone failure the stack goes dark. Its stated availability is 98.5 percent, with a recovery of four to eight hours.

**11. Devarsh:** On the right is the same surge and the same failure. CloudFront and the web application firewall sit at the edge, a load balancer spans three zones, and Aurora keeps a standby. The failed zone leaves rotation within seconds. The design states 99.99 percent availability, failover in under thirty seconds, and monthly cloud spend down from four thousand four hundred and fifty dollars to eighteen hundred and twenty.

### Slide 10: Storage Layer

*Module 2 of 15 · Theory*

On screen:
- Split data into k pieces plus parity pieces across zones
- Rebuild from any k of the n pieces, so losing n minus k is survivable
- Eleven nines of durability without tripling every disk

Formula: Where n=encoded shards, m=tolerated parity failures, and p=annual drive failure rate (~1.5%). Yields P(loss) < 10^{-11}.

**12. Aman:** The theory here is Reed-Solomon erasure coding, published by Irving Reed and Gustave Solomon in 1960. Split data into k pieces, add parity pieces, and you can rebuild the original from any k of the n. That is how S3 claims eleven nines of durability without keeping three full copies of every disk. The formula gives the chance of losing data as a binomial tail. Spread enough independent shards across zones and that chance becomes vanishingly small.

### Slide 11: Amazon S3 Tiering, Object Lock, & EBS gp3 Optimization vs. Un-versioned Flat EBS

*Module 2 of 15 · Naive (left) vs Well-Architected (right)*

On screen:
- Naive: 99.5%, recovery 48 Hours
- Well-Architected: 99.99%, recovery 15 Minutes

**13. Devarsh:** Storage on the left. Fifty terabytes of medical scans, kept for seven years, sit on one three-terabyte gp2 disk, where speed is tied to size, in a flat bucket with no versioning. A compromised developer key runs a recursive delete, and the scans are gone.

**14. Aman:** On the right: gp3 volumes sized for the workload, an S3 bucket with Object Lock in compliance mode, and Glacier Deep Archive for old scans. Every delete now returns a 403, even for the root user, and AWS Backup keeps immutable recovery points. Monthly storage spend falls from four hundred and twenty dollars to one hundred and eighteen.

### Slide 12: Compute Layer

*Module 3 of 15 · Theory*

On screen:
- Speedup is capped by the serial share of the work
- Bigger single machines hit a hardware wall
- Stateless instances scale out across zones

Formula: Where p is parallelizable request execution fraction and N is the number of stateless EC2/Fargate containers.

**15. Devarsh:** Our theory is Amdahl's law, from Gene Amdahl in 1967, with Gustafson's later view of scaled workloads. The speedup from more processors is capped by the serial fraction of the work. A monolith keeps a large serial part, so buying a bigger machine hits a wall. Horizontal scaling wins because stateless instances split the parallel part across many machines. Elasticity then matches supply to demand, instead of buying for one peak a year.

### Slide 13: Auto Scaling, Graviton3 ARM, & Mixed Spot Fleets vs. Static Single-AZ Monolith

*Module 3 of 15 · Naive (left) vs Well-Architected (right)*

On screen:
- Naive: 99.0%, recovery 4 Hours
- Well-Architected: 99.99%, recovery < 60 Seconds

**16. Aman:** Compute on the left. One oversized monolith in one zone, running around the clock. Five thousand shoppers at baseline and fifty thousand in a flash sale. At ten times normal traffic it runs out of memory, the kernel stops the service, and the whole system goes down.

**17. Devarsh:** On the right, an Auto Scaling group of Graviton instances spans three zones behind a load balancer. When zone a fails, its node is marked unhealthy within about ten seconds, traffic shifts to zones b and c, and replacements launch in under seventy-five seconds. Monthly compute falls from five hundred and eighty-four dollars to one hundred and sixty-eight.

### Slide 14: Database Layer

*Module 4 of 15 · Theory*

On screen:
- Partition: choose availability or consistency
- Else: choose latency or consistency
- Quorum of 4 writes and 3 reads out of 6 copies

Formula: Gifford Quorum condition: Total votes V=6, Write quorum V_w=4, Read quorum V_r=3 ensures read and write sets always overlap by at least one node.

**18. Aman:** The theory for databases is the CAP theorem from Eric Brewer in 2000, and its extension PACELC from Daniel Abadi in 2012. During a partition you trade availability against consistency. Otherwise you trade latency against consistency. Aurora resolves this with a quorum of six copies across three zones. Writes need four of the six and reads need three, so every read overlaps the latest committed write.

### Slide 15: Amazon Aurora Multi-AZ with Auto-scaling Replicas vs. Self-Managed EC2 MySQL

*Module 4 of 15 · Naive (left) vs Well-Architected (right)*

On screen:
- Naive: 99.0%, recovery 4 - 6 Hours
- Well-Architected: 99.99%, recovery < 30 Seconds

**19. Devarsh:** Database on the left. Self-managed MySQL on one virtual machine, backed up by a cron script. Nightly dumps lock the tables and checkouts time out. When the primary machine kernel-panics there is no replica, so the database is down for hours and up to a day of commits is lost.

**20. Aman:** On the right, an Aurora cluster: the writer in zone a, read replicas in zones b and c, and storage replicated six ways. If the writer dies, a replica is promoted and the cluster endpoint moves in under thirty seconds, with no committed transaction lost. Continuous backups allow point-in-time recovery to the second.

### Slide 16: Networking Environment

*Module 5 of 15 · Theory*

On screen:
- Trust zones so one breach cannot reach the rest
- Independent layers multiply the attacker's odds down
- Private and isolated subnets with no internet route

Formula: Where p_k is the chance an attacker bypasses layer k (Security Groups, NACLs, Private Subnets) and the layers fail independently. The attacker must beat every layer, so with three layers at 10% each the breach chance is 0.1%.

**21. Devarsh:** Our theory is the Saltzer and Schroeder principle of least privilege and compartmentalization, from 1975. Split the system into trust zones so that a breach in one cannot compromise the others. If three independent layers each stop ten percent of attacks, the attacker must beat all three, which is one chance in a thousand. The database sits in a subnet with no route to the internet at all.

### Slide 17: 3-Tier Multi-AZ VPC with Private/Isolated Subnets vs. Flat Public Default VPC

*Module 5 of 15 · Naive (left) vs Well-Architected (right)*

On screen:
- Naive: 98.5%, recovery Manual Incident Triage
- Well-Architected: 99.99%, recovery N/A (Immune to Direct Ingress)

**22. Aman:** Networking on the left. A default VPC with every server on a public address, and MySQL listening on port 3306 to the whole internet. A botnet scanner finds the port within hours, runs a dictionary attack, and dumps the database.

**23. Devarsh:** On the right, three tiers across three zones: public for the load balancer and NAT, private for the application, and isolated for the database. The database has no public address and no route to the internet gateway. The scanner cannot even locate it, so its packets are dropped at the edge. VPC flow logs record every connection for audit.

### Slide 18: Connecting Networks

*Module 6 of 15 · Theory*

On screen:
- A full mesh of N networks needs N(N-1)/2 links
- A hub needs one attachment per network
- Transitive routing comes with the hub

Formula: For 20 VPCs: Full mesh requires 190 peering links and route entries. AWS Transit Gateway requires only 20 attachments.

**24. Aman:** The theory is the count of connections in a full mesh. With N networks, peering every pair takes N times N minus one over two links. Twenty VPCs means one hundred and ninety peering links, each with routes kept by hand. A hub such as Transit Gateway needs one attachment per network. That moves the cost from quadratic to linear, and it gives transitive routing for free.

### Slide 19: AWS Transit Gateway Hub-and-Spoke with Direct Connect & VPN Failover vs. O(N²) Peering Mesh

*Module 6 of 15 · Naive (left) vs Well-Architected (right)*

On screen:
- Naive: 98.0%, recovery 3 Hours
- Well-Architected: 99.99%, recovery < 5 Seconds (BGP Keepalive)

**25. Devarsh:** Connectivity on the left: a mesh of VPC peering links, and one IPsec VPN over the public internet as the only path to headquarters. Every new account needs routes on every other account. When the tunnel drops, engineering, accounting and logistics lose the cloud.

**26. Aman:** On the right, a Transit Gateway hub with spokes for production, staging and data. Direct Connect carries the main link, and a backup VPN with BGP takes over in a few seconds when the fiber is cut. All internet egress passes through a central inspection firewall.

### Slide 20: Securing Applications & Data Access

*Module 7 of 15 · Theory*

On screen:
- Assume the attacker knows the system; only the key is secret
- Short-lived credentials from IAM roles
- Secrets rotated automatically, data encrypted under KMS keys

Formula: Envelope Encryption: Data P is encrypted by Data Encryption Key (DEK). The DEK is encrypted under AWS KMS Customer Master Key (CMK) inside FIPS-validated hardware security modules.

**27. Devarsh:** Kerckhoffs's principle, stated in 1883, and Shannon's maxim from 1949 say the same thing: assume the enemy knows the system, so only the key is secret. Hardcoded credentials break that rule at the root. The fix is short-lived identity from IAM roles, secrets in Secrets Manager rotated every thirty days, and envelope encryption under a KMS customer managed key.

### Slide 21: IAM Roles (STS), AWS Secrets Manager, KMS CMK, & AWS WAF vs. Root Keys & Hardcoded Secrets

*Module 7 of 15 · Naive (left) vs Well-Architected (right)*

On screen:
- Naive: Security Compromised, recovery Forensic Investigation Days
- Well-Architected: 99.99%, recovery Instant Threat Neutralization

**28. Aman:** Security on the left. Permanent access keys committed to a repository, a root-level account used by the application, and a database password in clear text. One SQL injection exposes five hundred thousand card records, and the stolen key starts GPU instances for crypto mining the same night.

**29. Devarsh:** On the right, IAM roles issue temporary credentials that expire after an hour. Secrets Manager rotates the database password every thirty days with no downtime. The web application firewall blocks SQL injection with a 403 at the edge, and GuardDuty flags the anomalous API calls. Monthly security spend is sixty-eight dollars.

### Slide 22: Monitoring, Elasticity & High Availability

*Module 8 of 15 · Theory*

On screen:
- Series availabilities multiply, parallel ones reinforce
- Redundancy pays only when failures are detected fast
- Health checks are part of the availability maths

Formula: For N=3 AZs each with 99.9% availability: A = 1 - (0.001)^3 = 0.999999999 (Nine 9s availability for compute tier redundancy).

**30. Aman:** This module's theory is the availability formula for parallel systems. Availability in series multiplies. Availability in parallel is one minus the product of the failure probabilities. Three independent zones at 99.9 percent each give one minus one in a billion, which is nine nines for the compute tier. Redundancy only pays if failures are detected quickly, so health checks and monitoring belong in the calculation.

### Slide 23: CloudWatch Synthetics, Composite Alarms, & EventBridge Self-Healing vs. Silent Failures

*Module 8 of 15 · Naive (left) vs Well-Architected (right)*

On screen:
- Naive: 97.5%, recovery 2 - 4 Hours
- Well-Architected: 99.99%, recovery < 45 Seconds (Autonomous)

**31. Devarsh:** Monitoring on the left: an unmonitored instance, a manual SSH session running tail -f, and customers reporting the outage on social media. Basic CPU looks normal while checkouts hang, and the team spends hours guessing which instance is stuck.

**32. Aman:** On the right: CloudWatch Synthetics canaries that exercise the real checkout path, composite alarms that need several signals before paging anyone, and X-Ray tracing. When a canary fails, EventBridge starts a Lambda that recycles the unhealthy tasks. Detection takes under fifteen seconds and remediation about forty-five.

### Slide 24: Automating the Architecture

*Module 9 of 15 · Theory*

On screen:
- Systems mirror the organization that builds them
- Describe the desired state in code under version control
- A pipeline converges reality back to the code

Formula: Automated CI/CD git-ops engines continuously converge actual infrastructure state towards desired version-controlled code specifications.

**33. Devarsh:** Conway's law, from Melvin Conway in 1968, says a system mirrors the communication structure of the organization that builds it. Declarative infrastructure counters the drift that follows. Describe the desired state in code, keep it in version control, and let a pipeline converge the real environment to it. The gap between desired and actual state shrinks to zero, because nothing changes outside the pipeline.

### Slide 25: 100% Terraform/CDK GitOps with Drift Detection vs. Manual "ClickOps" Console Changes

*Module 9 of 15 · Naive (left) vs Well-Architected (right)*

On screen:
- Naive: Human Error Prone, recovery Days to Reconstruct
- Well-Architected: 99.99%, recovery < 15 Minutes (Full Region Rebuild)

**34. Aman:** Automation on the left is ClickOps. Engineers change the console by hand, leave undocumented ports open, and staging never matches production. Port 22 stays open to the world for weeks, and rebuilding the environment after a disaster takes days of guesswork.

**35. Devarsh:** On the right, every VPC, route and policy is Terraform or CDK code, reviewed in a pull request and scanned by Checkov before deployment. AWS Config flags a non-compliant security group within a minute, and Systems Manager removes the rule automatically. A full production region can be rebuilt in about fifteen minutes.

### Slide 26: Caching Content

*Module 10 of 15 · Theory*

On screen:
- About 80 percent of reads hit about 20 percent of items
- Cache that slice at the edge and in memory
- Effective latency falls as the hit ratio rises

Formula: Effective latency: With 95% cache hit ratio (H=0.95), T_cache=2ms, and T_origin=80ms: T_eff = 0.95(2) + 0.05(80) = 5.9ms (a 92.6% reduction in latency).

**36. Aman:** The theory here is Zipf's law and the 80-20 rule that Pareto observed. A small slice of the content draws most of the reads. Caching that slice at the edge and in memory changes the average latency. The effective time is the hit ratio times the cache time, plus the miss ratio times the origin time. At a 95 percent hit ratio, a two-millisecond cache and an eighty-millisecond origin give about six milliseconds.

### Slide 27: CloudFront Edge Caching & ElastiCache Redis vs. Direct Origin & Database Overload

*Module 10 of 15 · Naive (left) vs Well-Architected (right)*

On screen:
- Naive: 98.5%, recovery 45 Minutes
- Well-Architected: 99.99%, recovery Instant (Edge Shielded)

**37. Devarsh:** Caching on the left. Every image, stylesheet and repeated query goes straight to the origin. Global viewers wait on long routes, and the database runs near ninety-six percent CPU. At the flash-sale spike the connection pool runs dry within seconds.

**38. Aman:** On the right, CloudFront serves most static requests from more than six hundred edge locations and absorbs about ninety-six percent of them. ElastiCache Redis answers hot queries from memory. Database CPU falls to about eleven percent, and the p95 latency drops from around 850 milliseconds to about 18.

### Slide 28: Building Decoupled Architecture

*Module 11 of 15 · Theory*

On screen:
- A blocking chain multiplies availabilities together
- Over an unreliable link, delivery needs retries and idempotency
- A queue lets each service run at its own availability

Formula: A synchronous chain of 5 microservices each at 99% SLA drops composite availability to 95.1%. Asynchronous queueing decouples them to independent isolated SLAs.

**39. Devarsh:** The theory is that a synchronous chain multiplies availability. Five services at 99 percent each, called in a blocking chain, give about 95 percent. The two generals problem adds a warning: over an unreliable link you can never be certain the other side received a message, so you need retries and idempotent handlers. A queue breaks the chain. The producer hands off the message and moves on, and each consumer runs at its own availability.

### Slide 29: Amazon SQS FIFO, SNS Fan-Out, & Dead-Letter Queues (DLQ) vs. Blocking Synchronous HTTP Chains

*Module 11 of 15 · Naive (left) vs Well-Architected (right)*

On screen:
- Naive: 97.0%, recovery Manual Reconciliation
- Well-Architected: 99.99%, recovery Zero (Buffer Absorbs Outages)

**40. Aman:** Decoupling on the left: a blocking chain. Checkout waits for the payment gateway, then inventory, then the email vendor. When the email vendor stalls, every web worker waits on a socket timeout and checkout crashes. Each order takes around three thousand eight hundred milliseconds.

**41. Devarsh:** On the right, checkout returns in about eighty-five milliseconds after writing to Amazon SQS. Workers pull messages at their own pace. If the email vendor is down, messages wait in the queue for up to fourteen days, and any message that keeps failing moves to a dead-letter queue with an alarm.

### Slide 30: Serverless Architecture & Microservices

*Module 12 of 15 · Theory*

On screen:
- Average items in a system equal arrival rate times time in system
- Capacity that follows arrivals removes idle cost
- Zero requests means near-zero spend

Formula: Compute expenditure scales strictly with executed transactions rather than paying 24/7 for overprovisioned idle EC2 cores.

**42. Aman:** The theory here is Little's law, from John Little in 1961. The average number of items in a system equals the arrival rate multiplied by the average time each item spends inside. If capacity follows arrivals instead of a fixed fleet, idle cost goes to zero. At three in the morning the arrival rate is close to zero, so the bill is close to zero too.

### Slide 31: API Gateway, Lambda ARM64, Step Functions, & DynamoDB vs. Stateful VM Monolith

*Module 12 of 15 · Naive (left) vs Well-Architected (right)*

On screen:
- Naive: 99.0%, recovery 15 Minutes (AMI Boot Time)
- Well-Architected: 99.99%, recovery < 1 Second (Stateless Re-invocation)

**43. Devarsh:** Serverless on the left: stateful virtual machines, paid for around the clock. At three in the morning they cost about eighteen dollars a day. New instances take roughly twelve minutes to boot, install packages and join the load balancer, so the viral moment is wasted. Patching happens in a weekly window.

**44. Aman:** On the right: API Gateway, Lambda on Graviton, Step Functions and DynamoDB on demand. Idle compute cost is zero. Scaling from nothing to ten thousand requests per second takes under half a second, and there are no operating systems to patch.

### Slide 32: Data Pipelines

*Module 13 of 15 · Theory*

On screen:
- Lambda architecture: a batch layer and a speed layer
- Kappa architecture: one stream for both
- Columnar Parquet on S3 scans only the columns a query needs

Formula: Serverless event-driven ingestion decouples ingestion time from analytical query runtimes, enabling petabyte analytics without cluster sizing constraints.

**45. Devarsh:** The theory is the split between the Lambda architecture, proposed by Nathan Marz around 2011, and the Kappa architecture, proposed by Jay Kreps in 2014. Lambda runs a batch layer and a speed layer side by side. Kappa unifies them into one stream. AWS favors the streaming side for freshness, and columnar Parquet on S3 for cost, because a query reads only the columns it needs.

### Slide 33: Kinesis Streaming, AWS Glue Serverless ETL, S3 Lake & Athena vs. Cron EC2 Bash Dumps

*Module 13 of 15 · Naive (left) vs Well-Architected (right)*

On screen:
- Naive: 85.0% Pipeline Reliability, recovery Manual Python Script Rerun
- Well-Architected: 99.99%, recovery < 60 Seconds Delivery

**46. Aman:** Data pipelines on the left: a nightly cron job on one EC2 instance. It runs mysqldump against the production database and writes to local disk, and a Python script runs out of memory on large files. Executives see numbers that are a day old.

**47. Devarsh:** On the right, events stream through Kinesis Data Firehose into an S3 data lake. Glue converts them to Parquet, and Athena queries them in place. Data is available for analysis in under a minute, production databases are untouched, and scanning Parquet cuts query cost by around 85 percent.

### Slide 34: Disaster Recovery (DR) Planning & Management

*Module 14 of 15 · Theory*

On screen:
- Four strategies: backup, pilot light, warm standby, active-active
- Lower RTO and RPO raise standby cost
- Choose by the cost of downtime, not by fear

Formula: A trade-off, not a fitted equation. Backup & Restore (24h RTO) costs 1x; Pilot Light (2h RTO, 10 min RPO) about 2.5x; Warm Standby (10 min RTO) about 4x; Multi-Region Active-Active (under 30s RTO) about 7x in this model.

**48. Aman:** The theory is the cost of recovery. As RTO and RPO approach zero, the cost of standby capacity rises. AWS describes four strategies: backup and restore, pilot light, warm standby, and multi-region active-active. In our model, backup and restore costs one unit with a twenty-four hour RTO. Active-active costs about seven units and recovers in under thirty seconds. Pick the strategy that matches the cost of downtime.

### Slide 35: 4 AWS DR Strategies (Backup/Restore -> Pilot Light -> Warm Standby -> Multi-Region Active-Active) vs. "Backup & Hope"

*Module 14 of 15 · Naive (left) vs Well-Architected (right)*

On screen:
- Naive: 95.0% Regional Risk, recovery 3 to 5 Days
- Well-Architected: 99.999% (Five 9s), recovery < 45 Seconds (Route 53 Shift)

**49. Devarsh:** Disaster recovery on the left is backup and hope. Snapshots live in the same region as production. If us-east-1 goes dark, everything is trapped there. The runbook has never been tested, recovery takes three to five days, and up to two weeks of commits are lost.

**50. Aman:** On the right, active-active across us-east-1 and eu-west-1. Aurora Global Database replicates in under a second, Route 53 Application Recovery Controller shifts traffic in under a minute, and drills run continuously. The design costs about five hundred and twenty dollars a month, and it is rehearsed.

### Slide 36: Executive Conclusion & Architectural Verdict

*Module 15 of 15 · Theory*

On screen:
- Architecture is a continuous practice, not a one-time sign-off
- Fitness functions protect qualities as the system changes
- The six pillars are the fitness checks

Formula: Composite architectural health is a weighted optimization function across all 6 Well-Architected pillars.

**51. Devarsh:** The last theory is evolutionary architecture, set out by Neal Ford, Rebecca Parsons and Patrick Kua in 2017. An architecture is guided, incremental change, protected by fitness functions that check its qualities after every change. The six pillars act as those fitness checks. A Well-Architected review scores the system across them, and the score is a weighted sum of the pillars.

### Slide 37: The 15-Domain Transformation Matrix, 10 Golden Rules, & Architecture Sign-Off

*Module 15 of 15 · Naive (left) vs Well-Architected (right)*

On screen:
- Naive: 98.5% (Frequent Unplanned Downtime), recovery 48+ Hours
- Well-Architected: 99.99% (Certified High Availability), recovery < 30 Seconds

**52. Aman:** The verdict on the left is an unmitigated risk profile. Ninety-eight point five percent availability, unplanned downtime, a backlog of technical debt, and a blast radius nobody has contained. Annual infrastructure spend is fifty-three thousand four hundred dollars, and an audit would fail.

**53. Devarsh:** On the right, the certified workload: 99.99 percent availability, failover under thirty seconds, zero high-risk issues, and annual spend of twenty-one thousand eight hundred and forty dollars. Organizational guardrails, policy as code and GitOps pipelines keep it that way, and it scores 96 out of 100 in review.

### Slide 38: What changed across the fifteen domains

*Scorecard*

On screen:
- Availability: 98.5% to 99.99%
- Monthly cloud spend: $4,450 to $1,820 (59.1% lower)
- High-risk issues: 3 to 0
- Recovery time: hours to under 30 seconds

**54. Aman:** To close the scorecard. Availability moves from 98.5 to 99.99 percent. Monthly cloud spend moves from four thousand four hundred and fifty dollars to eighteen hundred and twenty dollars, a reduction of 59 percent. Three high-risk issues go to zero, and recovery time drops from hours to under thirty seconds.

**55. Devarsh:** That is the Well-Architected argument. Start from the failure you cannot accept, name the pillar it touches, then build the smallest design that survives it. Thank you. We will take questions now.

---

Word count: 3014. Planned time: 21:23.
