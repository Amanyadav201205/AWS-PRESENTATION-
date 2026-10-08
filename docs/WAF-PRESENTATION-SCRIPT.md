# WAF Presentation: Script

About 1,281 spoken words in 32 lines: **8 to 10 minutes** at a normal pace. Fifteen modules, one simulation each. Devarsh and Aman alternate line by line.

## How each module runs

1. **Naive build:** the customer brief, then the naive design under load, then the failure.
2. **Well-Architected build:** the same surge and failure, then the packet path and the outcome.

The big screen shows only the simulation diagram. Each *Screen* note says what it shows once the line is taken.

## Keys

| Key | Does |
|---|---|
| Space, Page Down, or N | Next line, and its screen |
| B or Page Up | Previous line |

Open the deployed site and press Space. The first line turns the simulation screen on by itself.

## Script

### Opening

**1. Devarsh:** Good morning. Anyone can launch a server in five minutes; keeping a platform alive through traffic spikes and failures is architecture. Today we run fifteen simulations, one for each area of the Well-Architected Framework.

> *Screen:* Naive build at normal traffic, packets flowing.

### Module 1: Architecture Overview

**2. Aman:** The customer wants 99.99 percent availability and failover under thirty seconds. The naive build is one server, one database and one bucket, in one zone. Now we push traffic to peak and fail a zone. Nothing stands behind it, so customers are cut off.

> *Screen:* Naive: peak traffic, zone fails, stack goes dark.

**3. Devarsh:** The Well-Architected build takes the same surge and the same failure. Packets go from CloudFront and AWS WAF to a load balancer, which marks the failed zone unhealthy within seconds and moves traffic to the other two zones.

> *Screen:* WAF: same surge and failure, traffic moves to healthy zones.

### Module 2: Storage Layer

**4. Aman:** Storage. The customer keeps fifty terabytes of medical scans for seven years, unchanged. The naive build uses one three-terabyte gp2 disk, where speed is tied to size, and a flat bucket with no versioning. Now a compromised developer key runs a recursive delete.

> *Screen:* Naive: 3 TB disk and flat bucket, ransomware deletes data.

**5. Devarsh:** The fix: gp3 volumes sized for the workload, and an S3 bucket with Object Lock in compliance mode. Every delete gets a 403, even from root. Old scans move to Glacier Deep Archive, and AWS Backup keeps immutable recovery points.

> *Screen:* WAF: Object Lock rejects every delete.

### Module 3: Compute Layer

**6. Aman:** Compute. Five thousand shoppers at baseline, fifty thousand in a flash sale. The naive build is one large monolith in one zone. At ten times normal traffic it runs out of memory, and the whole system crashes.

> *Screen:* Naive: one monolith, peak traffic, system crash.

**7. Devarsh:** The Well-Architected build runs Graviton instances in an Auto Scaling group across three zones. When zone a fails, its node is marked unhealthy in about ten seconds, traffic shifts to zones b and c, and replacements launch in under 75 seconds.

> *Screen:* WAF: Auto Scaling across three zones, zone a fails.

### Module 4: Database Layer

**8. Aman:** Database. The customer needs 25,000 transactions a second with zero data loss. The naive build runs self-managed MySQL on one host. Nightly dumps lock the tables and checkouts time out. Now the primary machine kernel-panics, and there is no replica to take over.

> *Screen:* Naive: one MySQL host, primary kernel panic.

**9. Devarsh:** The Aurora build keeps the writer in zone a and read replicas in zones b and c. When the writer dies, a replica is promoted and the endpoint moves. Writes resume in about 24 seconds, with no committed transaction lost.

> *Screen:* WAF: Aurora writer fails over to a replica.

### Module 5: Networking Environment

**10. Aman:** Networking. PCI DSS level one means no database reachable from the internet. The naive build sits in a flat default VPC, with MySQL on port 3306 open to the public. A botnet finds that port and starts a dictionary attack.

> *Screen:* Naive: flat VPC, port 3306 open, botnet scan.

**11. Devarsh:** The Well-Architected build has three tiers. Only the load balancer is public. The app runs in private subnets, and Aurora sits in an isolated subnet with no internet route. The scanner cannot find the database, so its packets drop at the edge.

> *Screen:* WAF: three tiers, database unreachable from the internet.

### Module 6: Connecting Networks

**12. Aman:** Connecting networks. Twenty-five VPCs plus headquarters. The naive design peers every VPC with every other one, which means 300 links, and headquarters reaches them over one IPsec VPN on the internet. Now a fiber cut takes that link out, and headquarters is isolated.

> *Screen:* Naive: full peering mesh, fiber cut, headquarters isolated.

**13. Devarsh:** The Well-Architected build attaches all 25 VPCs to one Transit Gateway hub: 25 attachments instead of 300 links. Headquarters uses 10-gigabit Direct Connect, with a VPN over BGP as backup. When the fiber is cut, BGP reroutes in about three seconds.

> *Screen:* WAF: Transit Gateway hub, BGP fails over in seconds.

### Module 7: Securing Applications & Data Access

**14. Aman:** Security. The risk: developers commit keys to GitHub, bots inject SQL, and passwords never rotate. The naive app has keys hardcoded, and the database password is in clear text. An attacker injects a query, uses a stolen key, and downloads customer data.

> *Screen:* Naive: hardcoded keys, injection and stolen key breach.

**15. Devarsh:** The Well-Architected build has no keys in code. An IAM role issues temporary credentials, and Secrets Manager rotates the database password. AWS WAF blocks the injection at the edge with a 403. GuardDuty quarantines the stolen key.

> *Screen:* WAF: IAM roles, WAF blocks injection, GuardDuty quarantines.

### Module 8: Monitoring, Elasticity & High Availability

**16. Aman:** Monitoring and self-healing. The bank has two million customers and needs 99.99 percent. The naive server has no monitoring. A bad deployment leaks memory, requests hang for over fifteen seconds, and the first alert is a customer posting on social media.

> *Screen:* Naive: unmonitored server, memory leak, silent outage.

**17. Devarsh:** The Well-Architected build runs a synthetic canary on checkout, and a composite alarm fires only when the pattern is real. EventBridge triggers a Lambda that recycles the tasks, and X-Ray shows where the time went. The service heals in about 38 seconds, before anyone is paged.

> *Screen:* WAF: canary, composite alarm, self-healing in 38 seconds.

### Module 9: Automating the Architecture

**18. Aman:** Automation. At two in the morning an engineer opens port 22 to the whole internet in the console to debug, then forgets. Nothing records the change, so nobody knows the door is open. This is ClickOps, and it is how drift starts.

> *Screen:* Naive: console change opens port 22, nothing records it.

**19. Devarsh:** The Well-Architected build keeps every change in Git and builds it through pipelines. AWS Config flags the open port within 30 seconds, and a Systems Manager runbook removes the rule and alerts the security team. The same code rebuilds production and disaster recovery.

> *Screen:* WAF: AWS Config reverts the rule in 42 seconds.

### Module 10: Caching Content

**20. Aman:** Caching. The customer serves ten million viewers worldwide with sub-20-millisecond latency. The naive build sends every request to one origin and its database. A national advertisement airs, 50,000 requests a second arrive, and the origin collapses.

> *Screen:* Naive: origin collapses under 50,000 requests a second.

**21. Devarsh:** CloudFront runs across more than 600 edge locations, so most requests are answered there and never reach the origin. Misses go to Redis. In the simulation, about 96 percent of requests stay at the edge, and database CPU stays near 14 percent.

> *Screen:* WAF: CloudFront and Redis absorb the spike.

### Module 11: Building Decoupled Architecture

**22. Aman:** Decoupling. Black Friday brings 100,000 orders an hour. The naive checkout calls the payment and email vendors synchronously and holds the shopper's connection open. The email vendor goes dark worldwide, every checkout thread waits, and checkout fails for everyone.

> *Screen:* Naive: synchronous checkout, email vendor down, threads starve.

**23. Devarsh:** The Well-Architected build puts each order into an SQS queue and confirms it in under 90 milliseconds. SNS fans the work out, and workers retry with backoff. When the vendor returns, the backlog drains in three minutes, with no lost orders.

> *Screen:* WAF: SQS and SNS keep checkout up, backlog drains.

### Module 12: Serverless Architecture & Microservices

**24. Aman:** Serverless. The mobile backend is nearly idle overnight, then explodes at rush hour. The naive build uses two monolith VMs that need manual patching and take eight to fifteen minutes to boot. A jump from zero to forty thousand calls freezes them.

> *Screen:* Naive: VMs freeze at forty thousand calls.

**25. Devarsh:** The Well-Architected build uses API Gateway, Lambda on ARM64, Step Functions, and DynamoDB on demand. Nothing needs patching, and nothing runs or bills while idle. Lambda scales to thousands of concurrent executions in milliseconds, and all forty thousand calls complete.

> *Screen:* WAF: API Gateway and Lambda scale with no servers.

### Module 13: Data Pipelines

**26. Aman:** Data pipelines. 500 million events a day, with dashboards under a minute. The naive build dumps production to a local CSV, and a pandas script reads it. A campaign surge and a malformed update arrive together, and the script runs out of memory.

> *Screen:* Naive: cron dump to CSV, pandas runs out of memory.

**27. Devarsh:** The Well-Architected build streams events through Kinesis Firehose, which scales with volume. Glue transforms them serverlessly into an S3 data lake. Malformed records go to a quarantine bucket, and the stream keeps moving. Athena queries the lake with SQL.

> *Screen:* WAF: Firehose, Glue, S3 lake, quarantine for bad records.

### Module 14: Disaster Recovery (DR) Planning & Management

**28. Aman:** Disaster recovery. The bank needs recovery under one minute and data loss under one second, even if a whole region fails. The naive build keeps everything in us-east-1, with an untested snapshot beside it. When the region goes dark, a manual runbook takes days.

> *Screen:* Naive: single region, untested snapshot, region blackout.

**29. Devarsh:** The Well-Architected build runs a second region, eu-west-1, with Aurora Global Database replicating continuously. Route 53 Application Recovery Controller shifts traffic away from us-east-1, and Aurora promotes the secondary cluster. Traffic moves in about 36 seconds, with no transactions lost.

> *Screen:* WAF: Route 53 ARC and Aurora Global shift to eu-west-1.

### Module 15: Executive Conclusion & Architectural Verdict

**30. Aman:** Executive conclusion. Here is the same surge and the same failure, side by side. The naive design carries a technical debt backlog and an uncontained blast radius. The Well-Architected design has organizational guardrails, pipelines for every change, and telemetry that heals itself.

> *Screen:* Both builds side by side under the same surge.

**31. Devarsh:** Across all six pillars the pattern repeats. The naive design fails under load, and one mistake can cause a breach. The Well-Architected design stays up, recovers on its own, and keeps cost and carbon under control.

> *Screen:* WAF: the full picture, six pillars held.

**32. Aman:** Thank you. Each of these fifteen simulations can be replayed from the laptop, and we are happy to take questions.

> *Screen:* Both builds side by side.
