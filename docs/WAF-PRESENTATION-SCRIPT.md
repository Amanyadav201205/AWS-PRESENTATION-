# WAF Presentation: Speaker Script and Slide Guide

About 3,854 spoken words in 70 lines across 38 slides: about **27:21 minutes** at a steady pace (144 words per minute). Devarsh and Aman alternate line by line.

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

> Two presenters · fifteen modules · about 21 minutes

| Measure | Naive build | Well-Architected build |
|---|---|---|
| Availability | 98.5% | 99.99% |
| Monthly cloud spend | $4,450 | $1,820 |
| High-risk issues | 3 | 0 |
| Recovery time | 4 to 8 hours | under 30 seconds |

**1. Devarsh:** Good morning. Anyone can launch a server in five minutes. Keeping a platform alive through traffic spikes and failures is architecture, and that is what we are here to show. We are two presenters, Devarsh and Aman, and we will take you through fifteen modules of the AWS Well-Architected Framework in about twenty minutes.

**2. Aman:** Each module follows the same pattern. First a theory slide that names the principle behind the design. Then a comparison slide, with the naive build on the left and the Well-Architected build on the right, on one screen, under the same traffic and the same failure.

### Slide 2: Core theory, then fifteen modules

*Agenda*

> Every comparison uses the same traffic and the same failure

| # | Module | Pillars | Availability: naive to Well-Architected |
|---|---|---|---|
| 1 | Architecture Overview | Ops Excellence, Security, Reliability, Performance, Cost, Sustainability | 98.5% to 99.99% |
| 2 | Storage Layer | Cost, Reliability, Security | 99.5% to 99.99% |
| 3 | Compute Layer | Performance, Cost, Reliability, Sustainability | 99.0% to 99.99% |
| 4 | Database Layer | Reliability, Performance, Ops Excellence | 99.0% to 99.99% |
| 5 | Networking Environment | Security, Reliability, Ops Excellence | 98.5% to 99.99% |
| 6 | Connecting Networks | Reliability, Ops Excellence, Security | 98.0% to 99.99% |
| 7 | Securing Applications & Data Access | Security, Ops Excellence, Reliability | Security Compromised to 99.99% |
| 8 | Monitoring, Elasticity & High Availability | Ops Excellence, Reliability, Performance | 97.5% to 99.99% |
| 9 | Automating the Architecture | Ops Excellence, Security, Reliability | Human Error Prone to 99.99% |
| 10 | Caching Content | Performance, Cost, Reliability | 98.5% to 99.99% |
| 11 | Building Decoupled Architecture | Reliability, Performance, Ops Excellence | 97.0% to 99.99% |
| 12 | Serverless Architecture & Microservices | Performance, Cost, Sustainability | 99.0% to 99.99% |
| 13 | Data Pipelines | Performance, Cost, Ops Excellence | 85.0% to 99.99% |
| 14 | Disaster Recovery (DR) Planning & Management | Reliability, Ops Excellence, Cost | 95.0% to 99.999% |
| 15 | Executive Conclusion & Architectural Verdict | Ops Excellence, Security, Reliability, Performance, Cost, Sustainability | 98.5% to 99.99% |

**3. Devarsh:** Here is the route. We start with the core theory: the six pillars, single points of failure, the arithmetic of availability and blast radius. Then come the fifteen modules, from storage and compute through networking, security, monitoring, automation, caching, decoupling, serverless, data and disaster recovery. We finish with the scorecard.

### Slide 3: Six pillars, one design

*Core theory · 1 of 5*

> Every module maps to at least one of these pillars

| Pillar | What it asks of the design | Modules where it appears |
|---|---|---|
| Operational Excellence | Run and monitor systems to deliver business value and continually improve processes and procedures. | 1, 4, 5, 6, 7, 8, 9, 11, 13, 14, 15 |
| Security | Protect information, systems, and assets while delivering business value through risk assessments and mitigation. | 1, 2, 5, 6, 7, 9, 15 |
| Reliability | Ensure a workload performs its intended function correctly and consistently when it’s expected to. | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15 |
| Performance Efficiency | Use computing resources efficiently to meet requirements and maintain that efficiency as demand changes. | 1, 3, 4, 8, 10, 11, 12, 13, 15 |
| Cost Optimization | Avoid unnecessary costs and understand where money is spent to optimize workloads over time. | 1, 2, 3, 10, 12, 13, 14, 15 |
| Sustainability | Minimize environmental impacts of running cloud workloads through right-sizing and serverless adoption. | 1, 3, 12, 15 |

**4. Aman:** The Framework rests on six pillars: operational excellence, security, reliability, performance efficiency, cost optimization and sustainability. Every module you will see maps to at least one of them. A design that wins on one pillar and loses on another is a trade-off, and we will name that trade-off every time.

### Slide 4: Single point of failure

*Core theory · 2 of 5*

> Test: if this part disappears now, does a customer notice?

| Parts in a serial chain | Each part at 99%: combined availability | Downtime per year |
|---|---|---|
| 1 | 99.00% | 3.7 days |
| 2 | 98.01% | 7.3 days |
| 3 | 97.03% | 10.8 days |
| 5 | 95.10% | 17.9 days |

**5. Devarsh:** A single point of failure is any component whose loss stops the whole workload. The test is simple: if this part disappears right now, does a customer notice? In a serial chain, availabilities multiply. Five services at 99 percent each give about 95 percent overall, which means roughly eighteen days of downtime a year. Chains are where availability goes to die.

### Slide 5: The arithmetic of availability

*Core theory · 3 of 5*

> Two independent zones at 99.9% each are down together once in a million

| Availability | Downtime per year | Downtime per month |
|---|---|---|
| 99.9% | 8.8 h | 43.8 min |
| 99.99% | 52.6 min | 4.4 min |
| 99.999% | 5.3 min | 26 s |

| Setup (each zone 99.9%) | Availability together | Downtime per year |
|---|---|---|
| 1 zone (no redundancy) | 99.9000% | 8.8 h |
| 2 independent zones | 99.9999% | 31.5 s |
| 3 independent zones | 99.9999999% | 0.03 s |

**6. Aman:** Availability is measured in nines. Ninety-nine point nine percent allows about eight hours and forty-five minutes of downtime a year. Ninety-nine point nine nine allows about fifty-three minutes. For redundant parts the rule flips. If two independent zones are each up 99.9 percent of the time, both are down together only one time in a million, so the pair reaches 99.9999 percent. That arithmetic drives every redundancy decision in this talk.

### Slide 6: Blast radius, RTO and RPO

*Core theory · 4 of 5*

> Blast radius is how much breaks when one failure domain breaks

| Failure domain | Example | What breaks | What keeps serving |
|---|---|---|---|
| Instance | One application server | Requests on that server | The rest of the fleet, behind the load balancer |
| Availability zone | Zone a loses power | Every resource placed only in zone a | Zones b and c, if the design spans three zones |
| Region | us-east-1 is unavailable | Everything placed only in the region | A standby region, if one is kept warm |

| Term | Question it answers | Example from this talk |
|---|---|---|
| RTO: recovery time objective | How long can the business be down? | Naive 3 to 5 days; active-active under 45 seconds |
| RPO: recovery point objective | How much data can the business lose? | Naive up to 2 weeks of commits; Aurora Global under 1 second |

**7. Devarsh:** Blast radius is how much breaks when one thing breaks. We cut the system into failure domains: an instance, an availability zone, a region. A well-designed system loses one domain and keeps serving from the rest. Two numbers describe recovery. RTO, the recovery time objective, is how long the business can be down. RPO, the recovery point objective, is how much data it can lose. Lower values cost more, and that trade-off runs through the whole talk.

### Slide 7: How to read each comparison

*Core theory · 5 of 5*

> Left and right run the same traffic and the same failure

| What you see | What it means |
|---|---|
| Left column: naive build | Single servers, flat networks, manual steps |
| Right column: Well-Architected build | Redundancy across zones, isolation, automation |
| Card with a SPOF tag | A single point of failure in the naive build |
| Card with an HA tag or AZ pill | Built for high availability, and the zone it sits in |
| Red card that shakes | Failed, or overloaded at peak load (naive build) |
| Green card that pulses | Recovering or rerouted (Well-Architected build) |
| Amber or green connector with packets | Healthy traffic moving down the path |
| Red dashed connector | A failing or overloaded path; its packets stop |

**8. Aman:** Every comparison screen is the same live simulation. The left column is the naive build: single servers, flat networks, manual steps, with SPOF tags on the single points. The right column is the Well-Architected build, with HA tags and availability zones. Packets move down the connectors. At peak load and during the failure, red cards shake on the naive side and green cards pulse on the Well-Architected side, and the measures underneath show the result.

### Slide 8: Architecture Overview

*Module 1 of 15 · Theory*

On screen:
- Complex systems grow from simple ones that already work
- Every unpartitioned dependency lowers the whole
- Answer: modular, independently testable parts

> Theory: Gall’s Law · John Gall (1977)

| Component | Naive build | Well-Architected build |
|---|---|---|
| Application tier | One server, a single point of failure | Auto Scaling pool spread across three zones |
| Database | One primary with no standby | Aurora Multi-AZ with a replica in another zone |
| Edge and security | No edge layer; the origin is exposed | CloudFront and AWS WAF in front of the load balancer |
| Cost | $4,450 a month | $1,820 a month, 59.1% lower |

**9. Devarsh:** Our first theory is Gall's law, from John Gall in 1977. A complex system that works evolved from a simple system that worked, and a big design drawn from scratch rarely survives contact with production. The arithmetic shows why. Reliability multiplies down the chain, so every unpartitioned dependency lowers the total. The Framework answers with modular parts that can be tested one at a time.

### Slide 9: Overview: the same app built two ways.

*Module 1 of 15 · Naive (left) vs Well-Architected (right)*

> Failure injected: Cascading Availability Zone Outage & Traffic Surge

| Build | Availability | Recovery time | Monthly cost |
|---|---|---|---|
| Naive build | 98.5% | 4 - 8 Hours | $4,450 |
| Well-Architected | 99.99% | Typically < 30s (Aurora failover) | $1,820 |

**10. Aman:** On the left is the naive build at normal load. Four cards run top to bottom: internet clients, one App Server, one Primary Database and a flat S3 bucket. The App Server and the Primary Database carry SPOF tags. Packets move down the connectors toward a single path.

**11. Devarsh:** On the right is the Well-Architected build at the same load: six cards from global clients through CloudFront with AWS WAF, the Application Load Balancer, the Auto-Scaling compute pool, Aurora Multi-AZ and the regional S3 store. Each card carries an HA tag, and the green connectors show healthy traffic on every hop.

**12. Aman:** Now we push to one hundred thousand users and inject the regional outage. On the left, the App Server and the Primary Database shake and turn red, their connectors turn red and dashed, and the packets stop, so the stack goes dark. On the right, the compute and database cards pulse green as they recover, and the traffic stays on the healthy path. The strip below shows availability at 98.5 percent on the left and 99.99 on the right.

### Slide 10: Storage Layer

*Module 2 of 15 · Theory*

On screen:
- Split data into k pieces plus parity pieces across zones
- Rebuild from any k of the n pieces, so losing n minus k is survivable
- Eleven nines of durability without tripling every disk

> Theory: Reed-Solomon Erasure Coding & Quorum Durability · Irving S. Reed & Gustave Solomon (1960)

| Component | Naive build | Well-Architected build |
|---|---|---|
| Block storage | 3 TB gp2 disk, speed tied to size | gp3 sized to the workload, 3,000 baseline IOPS |
| Archive | Old scans stay on hot storage | S3 Intelligent-Tiering, then Glacier Deep Archive |
| Deletion protection | Flat bucket with no versioning | S3 Object Lock in compliance mode: every delete returns 403 |
| Recovery points | None that cannot be changed | AWS Backup vault with immutable recovery points |

**13. Devarsh:** The theory here is Reed-Solomon erasure coding, published by Irving Reed and Gustave Solomon in 1960. Split data into k pieces, add parity pieces, and you can rebuild the original from any k of the n. That is how S3 claims eleven nines of durability without keeping three full copies of every disk. The math gives the chance of losing data as a binomial tail. Spread enough independent shards across zones and that chance becomes vanishingly small.

### Slide 11: Amazon S3 Tiering, Object Lock, & EBS gp3 Optimization vs. Un-versioned Flat EBS

*Module 2 of 15 · Naive (left) vs Well-Architected (right)*

> Failure injected: Ransomware Extortion & Accidental Object Deletion

| Build | Availability | Recovery time | Monthly cost |
|---|---|---|---|
| Naive build | 99.5% | 48 Hours | $420 |
| Well-Architected | 99.99% | 15 Minutes | $118 |

**14. Aman:** On the left, the naive storage build at normal load. Three cards: a monolithic App Server, one 3 TB gp2 volume and a public, flat S3 bucket. The App Server and the volume carry SPOF tags, so losing either one takes the scans offline. Packets flow down the connectors.

**15. Devarsh:** On the right, the Well-Architected storage layout: five cards. The app instance pool, a right-sized gp3 volume, S3 Intelligent-Tiering, Glacier Deep Archive for old scans and an AWS Backup vault. Each card carries an HA tag, and the green connectors show data moving from hot to cold tiers.

**16. Aman:** Now the ransomware wiper runs at peak load. On the left, the public bucket and the 3 TB volume shake and turn red as the data is deleted, and the packets stop. On the right, the storage cards pulse green: Object Lock rejects every delete and AWS Backup keeps the immutable recovery points. The strip shows the monthly bill, 420 dollars on the left and 118 on the right.

### Slide 12: Compute Layer

*Module 3 of 15 · Theory*

On screen:
- Speedup is capped by the serial share of the work
- Bigger single machines hit a hardware wall
- Stateless instances scale out across zones

> Theory: Amdahl’s Law & Gustafson’s Law of Parallel Scalability · Gene Amdahl / John Gustafson (1967 / 1988)

| Component | Naive build | Well-Architected build |
|---|---|---|
| Instance | One large monolith, 24/7 | Graviton instances sized by target tracking at 60% CPU |
| Zones | One zone | Three zones behind an Application Load Balancer |
| Zone failure | Out-of-memory crash, full outage | Node unhealthy in about 10 s; replacements in under 75 s |
| Capacity model | Static size running 24/7 for the peak | On-Demand base plus Spot; $584 to $168 a month |

**17. Devarsh:** Our theory is Amdahl's law, from Gene Amdahl in 1967, with Gustafson's later view of scaled workloads. The speedup from more processors is capped by the serial fraction of the work. A monolith keeps a large serial part, so buying a bigger machine hits a wall. Horizontal scaling wins because stateless instances split the parallel part across many machines. Elasticity then matches supply to demand, instead of buying for one peak a year.

### Slide 13: Auto Scaling, Graviton3 ARM, & Mixed Spot Fleets vs. Static Single-AZ Monolith

*Module 3 of 15 · Naive (left) vs Well-Architected (right)*

> Failure injected: 10x Flash Sale Traffic Surge & AZ-1a Hard Failure

| Build | Availability | Recovery time | Monthly cost |
|---|---|---|---|
| Naive build | 99.0% | 4 Hours | $584 |
| Well-Architected | 99.99% | < 60 Seconds | $168 |

**18. Aman:** On the left, the naive compute build at normal load. Web traffic enters one Monolith EC2 instance, an m5.4xlarge, with local app storage behind it. Both carry SPOF tags. Packets run down a single path, and the monolith is the only thing serving them.

**19. Devarsh:** On the right, the Well-Architected compute layout. The load balancer fans out to three Auto Scaling nodes, one in each zone, one of them a Spot worker. Each node shows its AZ pill and an HA tag, and green connectors show the traffic spread across all three zones.

**20. Aman:** Now the flash sale hits: one hundred thousand users. On the left, the monolith overloads, shakes and turns red, its connector turns red and dashed, and the packets stop, so the system goes down. On the right, the zone a node fails and pulses green as the load balancer routes around it, while replacement instances launch. The strip shows the bill falling from 584 to 168 dollars a month.

### Slide 14: Database Layer

*Module 4 of 15 · Theory*

On screen:
- Partition: choose availability or consistency
- Else: choose latency or consistency
- Quorum of 4 writes and 3 reads out of 6 copies

> Theory: CAP Theorem & PACELC Theorem · Eric Brewer (2000) / Daniel Abadi (2012) (2000 / 2012)

| Component | Naive build | Well-Architected build |
|---|---|---|
| Engine | Self-managed MySQL on one EC2 host | Aurora cluster with a writer and read replicas |
| Backups | Bash cron dump that locks tables | Continuous backup with point-in-time recovery to the second |
| Failover | Rebuild by hand, hours of downtime | Replica promoted; endpoint moves in under 30 s |
| Durability | One disk, up to 24 hours of lost commits | Six copies across three zones; writes need 4 of 6 |

**21. Devarsh:** The theory for databases is the CAP theorem from Eric Brewer in 2000, and its extension PACELC from Daniel Abadi in 2012. During a partition you trade availability against consistency. Otherwise you trade latency against consistency. Aurora resolves this with a quorum of six copies across three zones. Writes need four of the six and reads need three, so every read overlaps the latest committed write.

### Slide 15: Amazon Aurora Multi-AZ with Auto-scaling Replicas vs. Self-Managed EC2 MySQL

*Module 4 of 15 · Naive (left) vs Well-Architected (right)*

> Failure injected: Primary Database Node Kernel Panic & Hardware Crash

| Build | Availability | Recovery time | Monthly cost |
|---|---|---|---|
| Naive build | 99.0% | 4 - 6 Hours | $290 |
| Well-Architected | 99.99% | < 30 Seconds | $340 |

**22. Aman:** On the left, the naive database build at normal load. The app servers feed one self-managed MySQL host on EC2, with a local backup script beside it. Both carry SPOF tags. Every packet queues behind the same single host.

**23. Devarsh:** On the right, the Aurora cluster: a writer node in zone a, read replicas in zones b and c, and the distributed storage engine underneath. Each node shows its AZ pill and an HA tag, and the green connectors show the path from the app pool through the cluster.

**24. Aman:** Now the writer node crashes at peak load. On the left, the MySQL host goes red and shakes, the packets stop, and there is no replica to take over, so recovery means hours of manual work. On the right, the Aurora writer pulses green as the cluster promotes a read replica in zone b. The strip shows recovery in under 30 seconds on the right, against four to six hours on the left.

### Slide 16: Networking Environment

*Module 5 of 15 · Theory*

On screen:
- Trust zones so one breach cannot reach the rest
- Independent layers multiply the attacker's odds down
- Private and isolated subnets with no internet route

> Theory: Saltzer & Schroeder’s Compartmentalization & Defense in Depth · Jerome Saltzer & Michael Schroeder (1975)

| Component | Naive build | Well-Architected build |
|---|---|---|
| Network layout | Default VPC, every server public | Three tiers across three zones: public, private, isolated |
| Database exposure | MySQL on port 3306 open to 0.0.0.0/0 | No public address and no route to the internet gateway |
| Access rules | Open ports, shared credentials | Security groups reference other security groups by ID |
| Visibility | No flow logs | VPC Flow Logs capture every connection for audit |

**25. Devarsh:** Our theory is the Saltzer and Schroeder principle of least privilege and compartmentalization, from 1975. Split the system into trust zones so that a breach in one cannot compromise the others. If three independent layers each stop ten percent of attacks, the attacker must beat all three, which is one chance in a thousand. The database sits in a subnet with no route to the internet at all.

### Slide 17: 3-Tier Multi-AZ VPC with Private/Isolated Subnets vs. Flat Public Default VPC

*Module 5 of 15 · Naive (left) vs Well-Architected (right)*

> Failure injected: Automated Shodan Port Scan & Brute Force Botnet Assault

| Build | Availability | Recovery time | Monthly cost |
|---|---|---|---|
| Naive build | 98.5% | Manual Incident Triage | $45 |
| Well-Architected | 99.99% | N/A (Immune to Direct Ingress) | $145 |

**26. Aman:** On the left, the naive network. A port scanner and botnet sit at the top, then the default flat VPC, then the public MySQL database. The database carries a SPOF tag and a 0.0.0.0/0 port 3306 tag, so anyone on the internet can reach it.

**27. Devarsh:** On the right, five tiers: external traffic, the internet gateway, the public subnet with the load balancer and NAT gateway, the private application subnet, and the isolated subnet holding Aurora. Only the top two cards face the internet, and the isolated subnet has no route to the gateway.

**28. Aman:** Now the scanner and botnet attack the network. On the left, the public MySQL card shakes and turns red, its connector turns red and dashed, and the scanner reaches the database through the open port. On the right, the attack stops at the top of the chain, and the isolated subnet pulses green because nothing outside can reach it. The strip shows the same gap in availability: 98.5 percent against 99.99.

### Slide 18: Connecting Networks

*Module 6 of 15 · Theory*

On screen:
- A full mesh of N networks needs N(N-1)/2 links
- A hub needs one attachment per network
- Transitive routing comes with the hub

> Theory: Complete-Graph Edge Count: Full-Mesh Peering vs Hub-and-Spoke · Robert Metcalfe (1980)

| Component | Naive build | Well-Architected build |
|---|---|---|
| Routing model | Peering mesh: 190 links for 20 VPCs | Transit Gateway hub: one attachment per VPC |
| Corporate link | One IPsec VPN over the internet | Direct Connect with a backup VPN over BGP |
| Link failure | Tunnel drops; manual recovery | BGP fails over in a few seconds |
| Egress | Direct and unfiltered | Central inspection with AWS Network Firewall |

**29. Devarsh:** The theory is the count of connections in a full mesh. With N networks, peering every pair takes N times N minus one over two links. Twenty VPCs means one hundred and ninety peering links, each with routes kept by hand. A hub such as Transit Gateway needs one attachment per network. That moves the cost from quadratic to linear, and it gives transitive routing for free.

### Slide 19: AWS Transit Gateway Hub-and-Spoke with Direct Connect & VPN Failover vs. O(N²) Peering Mesh

*Module 6 of 15 · Naive (left) vs Well-Architected (right)*

> Failure injected: Primary Direct Connect Fiber Cut & Carrier Outage

| Build | Availability | Recovery time | Monthly cost |
|---|---|---|---|
| Naive build | 98.0% | 3 Hours | $210 |
| Well-Architected | 99.99% | < 5 Seconds (BGP Keepalive) | $420 |

**30. Aman:** On the left, the naive connectivity: corporate HQ at the top, then one IPsec VPN over the internet tagged SPOF, then three VPCs wired by peering. Every packet from headquarters funnels through that single VPN.

**31. Devarsh:** On the right, the Well-Architected connectivity: headquarters, a 10 gigabit Direct Connect circuit and a backup VPN running BGP, into a Transit Gateway hub. Egress passes a central firewall, and the spoke VPCs hang off the hub. Green connectors show the hub carrying the traffic.

**32. Aman:** Now the primary Direct Connect fibre is cut. On the left, the single IPsec VPN shakes and turns red, its connector goes red and dashed, and the packets stop, so engineering, accounting and logistics lose the cloud. On the right, the Direct Connect card pulses green as BGP moves traffic to the backup VPN within seconds. The strip shows 98.0 percent on the left and 99.99 on the right.

### Slide 20: Securing Applications & Data Access

*Module 7 of 15 · Theory*

On screen:
- Assume the attacker knows the system; only the key is secret
- Short-lived credentials from IAM roles
- Secrets rotated automatically, data encrypted under KMS keys

> Theory: Kerckhoffs’s Principle & Shannon’s Maxim · Auguste Kerckhoffs / Claude Shannon (1883 / 1949)

| Component | Naive build | Well-Architected build |
|---|---|---|
| Credentials | Permanent access keys committed to Git | IAM roles issue temporary credentials for one hour |
| Database password | Clear text and never rotated | Secrets Manager rotates every 30 days with no downtime |
| Web attacks | No WAF; SQL injection reaches the database | AWS WAF managed rules block SQL injection with a 403 |
| Encryption | Unmanaged keys | KMS customer managed keys with envelope encryption |

**33. Devarsh:** Kerckhoffs's principle, stated in 1883, and Shannon's maxim from 1949 say the same thing: assume the enemy knows the system, so only the key is secret. Hardcoded credentials break that rule at the root. The fix is short-lived identity from IAM roles, secrets in Secrets Manager rotated every thirty days, and envelope encryption under a KMS customer managed key.

### Slide 21: IAM Roles (STS), AWS Secrets Manager, KMS CMK, & AWS WAF vs. Root Keys & Hardcoded Secrets

*Module 7 of 15 · Naive (left) vs Well-Architected (right)*

> Failure injected: SQL Injection Attack & Stolen Access Key Exploit

| Build | Availability | Recovery time | Monthly cost |
|---|---|---|---|
| Naive build | Security Compromised | Forensic Investigation Days | $0 |
| Well-Architected | 99.99% | Instant Threat Neutralization | $68 |

**34. Aman:** On the left, the naive security build. The malicious attacker sits at the top, then an app with hardcoded keys and a database with a cleartext password, both tagged SPOF. Nothing stands between the attacker and the database.

**35. Devarsh:** On the right, the Well-Architected security layout. The WAF with OWASP managed rules sits at the edge, then an IAM role with least-privilege temporary credentials, Secrets Manager, the KMS customer managed key and GuardDuty. Every card carries an HA tag, and each request passes the WAF first.

**36. Aman:** Now the SQL injection and the stolen key arrive together. On the left, the app with hardcoded keys shakes and turns red, its connector goes red and dashed, and the packets reach the database. On the right, the WAF blocks the injection with a 403 at the edge, and GuardDuty flags the anomalous calls, and their cards pulse green. The strip sets the two builds side by side.

### Slide 22: Monitoring, Elasticity & High Availability

*Module 8 of 15 · Theory*

On screen:
- Series availabilities multiply, parallel ones reinforce
- Redundancy pays only when failures are detected fast
- Health checks are part of the availability maths

> Theory: High Availability Probability Formula (Parallel vs Series Systems) · Reliability Engineering Principles (1965)

| Component | Naive build | Well-Architected build |
|---|---|---|
| Detection | Customers report the outage on social media | CloudWatch Synthetics canaries detect it in under 15 s |
| Alerting | Single-metric alarms, constant noise | Composite alarms need several signals before paging |
| Tracing | Log grep over SSH | AWS X-Ray traces the slow query to the millisecond |
| Remediation | Manual SSH, 2 to 4 hours | EventBridge and Lambda recycle the task in about 45 s |

**37. Devarsh:** This module's theory is the availability rule for parallel systems. Availability in series multiplies. Availability in parallel is one minus the product of the failure probabilities. Three independent zones at 99.9 percent each give one minus one in a billion, which is nine nines for the compute tier. Redundancy only pays if failures are detected quickly, so health checks and monitoring belong in the calculation.

### Slide 23: CloudWatch Synthetics, Composite Alarms, & EventBridge Self-Healing vs. Silent Failures

*Module 8 of 15 · Naive (left) vs Well-Architected (right)*

> Failure injected: Silent Memory Leak Causing Cascading API Hangs

| Build | Availability | Recovery time | Monthly cost |
|---|---|---|---|
| Naive build | 97.5% | 2 - 4 Hours | $0 |
| Well-Architected | 99.99% | < 45 Seconds (Autonomous) | $54 |

**38. Aman:** On the left, the naive monitoring build. An unmonitored EC2 instance tagged SPOF, then angry customers on Twitter, then a manual SSH terminal. Packets reach the instance, and nothing watches it.

**39. Devarsh:** On the right, the Well-Architected monitoring chain: a Synthetics canary, composite alarms, X-Ray tracing, an EventBridge rule and a self-healing Lambda. Green connectors show the signal travelling from the canary to the Lambda that recovers the task.

**40. Aman:** Now a silent memory leak builds at peak load. On the left, the unmonitored instance shakes and turns red, and the packets stop while customers find the outage first. On the right, the composite alarm and the self-healing Lambda pulse green as the canary catches the checkout timeout and the task is recycled. The strip shows recovery going from two to four hours down to under 45 seconds.

### Slide 24: Automating the Architecture

*Module 9 of 15 · Theory*

On screen:
- Systems mirror the organization that builds them
- Describe the desired state in code under version control
- A pipeline converges reality back to the code

> Theory: Conway’s Law & The Declarative Infrastructure Convergence Principle · Melvin Conway (1968)

| Component | Naive build | Well-Architected build |
|---|---|---|
| Changes | Console clicks, no record | Terraform or CDK changes through pull requests |
| Security scanning | None before deployment | Checkov and tfsec block insecure code |
| Drift | Silent and continuous | AWS Config flags drift; Systems Manager remediates it |
| Rebuild a region | 3 to 5 days of guesswork | About 15 minutes with one pipeline run |

**41. Devarsh:** Conway's law, from Melvin Conway in 1968, says a system mirrors the communication structure of the organization that builds it. Declarative infrastructure counters the drift that follows. Describe the desired state in code, keep it in version control, and let a pipeline converge the real environment to it. The gap between desired and actual state shrinks to zero, because nothing changes outside the pipeline.

### Slide 25: 100% Terraform/CDK GitOps with Drift Detection vs. Manual "ClickOps" Console Changes

*Module 9 of 15 · Naive (left) vs Well-Architected (right)*

> Failure injected: Rogue Engineer Manually Opens Port 22 in Console

| Build | Availability | Recovery time | Monthly cost |
|---|---|---|---|
| Naive build | Human Error Prone | Days to Reconstruct | $0 |
| Well-Architected | 99.99% | < 15 Minutes (Full Region Rebuild) | $28 |

**42. Aman:** On the left, the naive automation build. A developer works in the console, the production VPC and a drifted security group follow, both tagged SPOF. Hand-made changes go straight to production with no record.

**43. Devarsh:** On the right, the Well-Architected automation chain. A Git pull request feeds the CI runner, which builds an immutable multi-AZ VPC. The AWS Config drift detector and the Systems Manager playbook sit at the end. Green connectors show every change passing through the pipeline.

**44. Aman:** Now someone opens port 22 to the world from the console. On the left, the drifted security group shakes and turns red, and nothing reports it. On the right, AWS Config flags the rule and the Systems Manager playbook pulses green as it removes the open rule automatically. The strip shows recovery: days to reconstruct on the left, under 15 minutes on the right.

### Slide 26: Caching Content

*Module 10 of 15 · Theory*

On screen:
- About 80 percent of reads hit about 20 percent of items
- Cache that slice at the edge and in memory
- Effective latency falls as the hit ratio rises

> Theory: Zipf’s Law & The 80/20 Pareto Principle of Workload Data Access · George Kingsley Zipf / Vilfredo Pareto (1935 / 1906)

| Component | Naive build | Well-Architected build |
|---|---|---|
| Static content | Every request reaches the origin | CloudFront at 600+ edge locations absorbs about 96% |
| Hot queries | Repeated reads hit the database | ElastiCache Redis answers from memory |
| Database CPU | About 96%, near collapse | About 11%, with headroom for spikes |
| Global p95 latency | About 850 ms | About 18 ms from the nearest edge location |

**45. Devarsh:** The theory here is Zipf's law and the 80-20 rule that Pareto observed. A small slice of the content draws most of the reads. Caching that slice at the edge and in memory changes the average latency. The effective time is the hit ratio times the cache time, plus the miss ratio times the origin time. At a 95 percent hit ratio, a two-millisecond cache and an eighty-millisecond origin give about six milliseconds.

### Slide 27: CloudFront Edge Caching & ElastiCache Redis vs. Direct Origin & Database Overload

*Module 10 of 15 · Naive (left) vs Well-Architected (right)*

> Failure injected: 50,000 Req/s Flash Sale Traffic Spike

| Build | Availability | Recovery time | Monthly cost |
|---|---|---|---|
| Naive build | 98.5% | 45 Minutes | $490 |
| Well-Architected | 99.99% | Instant (Edge Shielded) | $165 |

**46. Aman:** On the left, the naive caching build. Global visitors go straight to an uncached origin server, then to the primary SQL database. Both carry SPOF tags, and every image and repeated query lands on them.

**47. Devarsh:** On the right, the Well-Architected caching chain: the CloudFront CDN with more than 600 edge locations, the private S3 origin, ElastiCache Redis, the application microservices and the protected Aurora database. Each card takes load off the next, and the green connectors show it.

**48. Aman:** Now the flash sale hits the cache layer at 50,000 requests a second. On the left, the origin server and the SQL database shake and turn red, the packets stop, and the connection pool runs dry. On the right, CloudFront and ElastiCache pulse green as they absorb the spike, and the database behind them stays in service. The strip shows the monthly bill: 490 dollars on the left, 165 on the right.

### Slide 28: Building Decoupled Architecture

*Module 11 of 15 · Theory*

On screen:
- A blocking chain multiplies availabilities together
- Over an unreliable link, delivery needs retries and idempotency
- A queue lets each service run at its own availability

> Theory: The Two Generals’ Problem & Asynchronous Loose Coupling · Distributed Computing Theory (1975)

| Component | Naive build | Well-Architected build |
|---|---|---|
| Checkout path | Waits for payment, inventory and email | Acknowledged in about 85 ms after the SQS write |
| Vendor outage | Checkout fails with the vendor | Messages wait in SQS for up to 14 days |
| Failed messages | Lost with the request | Dead-letter queue with a CloudWatch alarm |
| New consumers | Edit the checkout code | SNS fan-out to fraud, audit or any new service |

**49. Devarsh:** The theory is that a synchronous chain multiplies availability. Five services at 99 percent each, called in a blocking chain, give about 95 percent. The two generals problem adds a warning: over an unreliable link you can never be certain the other side received a message, so you need retries and idempotent handlers. A queue breaks the chain. The producer hands off the message and moves on, and each consumer runs at its own availability.

### Slide 29: Amazon SQS FIFO, SNS Fan-Out, & Dead-Letter Queues (DLQ) vs. Blocking Synchronous HTTP Chains

*Module 11 of 15 · Naive (left) vs Well-Architected (right)*

> Failure injected: Downstream Email Vendor Down & 20,000 Black Friday Orders

| Build | Availability | Recovery time | Monthly cost |
|---|---|---|---|
| Naive build | 97.0% | Manual Reconciliation | $320 |
| Well-Architected | 99.99% | Zero (Buffer Absorbs Outages) | $42 |

**50. Aman:** On the left, the naive checkout. The customer goes to a monolithic web server, then the payment gateway, then the third-party email vendor. All three carry SPOF tags, so one slow step holds up the whole checkout.

**51. Devarsh:** On the right, the Well-Architected checkout. The shopper goes to a fast ingestion API, then the Amazon SQS orders queue with its dead-letter queue, then SNS fans out to the payment worker and the notification worker. Green connectors show the order handed to the queue.

**52. Aman:** Now the email vendor goes down during 20,000 Black Friday orders. On the left, the email vendor and the monolithic web server shake and turn red, the packets stop, and checkout fails. On the right, the orders queue and the notification worker pulse green. Shoppers still get confirmation, the backlog waits in SQS, and the dead-letter queue catches anything that keeps failing.

### Slide 30: Serverless Architecture & Microservices

*Module 12 of 15 · Theory*

On screen:
- Average items in a system equal arrival rate times time in system
- Capacity that follows arrivals removes idle cost
- Zero requests means near-zero spend

> Theory: Little’s Law & Zero Idle Capacity Economics · John D. C. Little (1961)

| Component | Naive build | Well-Architected build |
|---|---|---|
| Compute | Stateful VMs running 24/7 | Lambda on Graviton ARM64, paid per request |
| Idle cost | About $18 a day at 3 AM | $0 when nobody is calling |
| Scale-out | 8 to 15 minutes to boot AMIs | Under half a second to thousands of concurrent calls |
| Operations | Weekly OS patch windows | No servers, no AMIs, no SSH bastions |

**53. Devarsh:** The theory here is Little's law, from John Little in 1961. The average number of items in a system equals the arrival rate multiplied by the average time each item spends inside. If capacity follows arrivals instead of a fixed fleet, idle cost goes to zero. At three in the morning the arrival rate is close to zero, so the bill is close to zero too.

### Slide 31: API Gateway, Lambda ARM64, Step Functions, & DynamoDB vs. Stateful VM Monolith

*Module 12 of 15 · Naive (left) vs Well-Architected (right)*

> Failure injected: Instant 0 to 40,000 Invocations Surge

| Build | Availability | Recovery time | Monthly cost |
|---|---|---|---|
| Naive build | 99.0% | 15 Minutes (AMI Boot Time) | $460 |
| Well-Architected | 99.99% | < 1 Second (Stateless Re-invocation) | $38 |

**54. Aman:** On the left, the naive serverless build. Two monolith virtual machines, one in zone a and one in zone b, both tagged SPOF, and a manual OS patching window. Both VMs are paid for around the clock.

**55. Devarsh:** On the right, the Well-Architected serverless chain: API Gateway, the ARM64 auth Lambda, Step Functions, the order-processing Lambda and DynamoDB on demand. The cards are services rather than servers, and green connectors show each request passing through them.

**56. Aman:** Now a burst of 40,000 invocations hits. On the left, both virtual machines shake and turn red, the packets stop, and new instances take minutes to boot. On the right, API Gateway, the Lambdas and DynamoDB pulse green as they scale out at once, and the request keeps flowing. The strip shows recovery time: 15 minutes for AMI boot on the left, under a second on the right.

### Slide 32: Data Pipelines

*Module 13 of 15 · Theory*

On screen:
- Lambda architecture: a batch layer and a speed layer
- Kappa architecture: one stream for both
- Columnar Parquet on S3 scans only the columns a query needs

> Theory: Lambda Architecture vs Kappa Architecture (Nathan Marz / Jay Kreps) · Nathan Marz / Jay Kreps (2011 / 2014)

| Component | Naive build | Well-Architected build |
|---|---|---|
| Ingestion | Nightly mysqldump on production | Kinesis Data Firehose streams events continuously |
| Transform | Python script that runs out of memory | AWS Glue serverless ETL writes Parquet |
| Storage | Raw CSV on local disk | S3 data lake with columnar Parquet |
| Query | Reports 24 hours behind; full raw scans cost more | Athena reads only needed Parquet columns; about 85% lower cost |

**57. Devarsh:** The theory is the split between the Lambda architecture, proposed by Nathan Marz around 2011, and the Kappa architecture, proposed by Jay Kreps in 2014. Lambda runs a batch layer and a speed layer side by side. Kappa unifies them into one stream. AWS favors the streaming side for freshness, and columnar Parquet on S3 for cost, because a query reads only the columns it needs.

### Slide 33: Kinesis Streaming, AWS Glue Serverless ETL, S3 Lake & Athena vs. Cron EC2 Bash Dumps

*Module 13 of 15 · Naive (left) vs Well-Architected (right)*

> Failure injected: 100x Payload Explosion & Corrupted Data Ingestion

| Build | Availability | Recovery time | Monthly cost |
|---|---|---|---|
| Naive build | 85.0% | Manual Python Script Rerun | $310 |
| Well-Architected | 99.99% | < 60 Seconds Delivery | $64 |

**58. Aman:** On the left, the naive data pipeline. The production relational database, a cron worker on EC2 and a local CSV on disk, all tagged SPOF. The nightly job reads the live database, so it competes with customers for the same tables.

**59. Devarsh:** On the right, the Well-Architected data pipeline. Live event producers feed Kinesis Firehose, Glue converts the stream, the S3 data lake stores it, and Athena queries it in place. The production database is not on this path at all.

**60. Aman:** Now a 100x payload spike arrives with corrupted records. On the left, the cron worker runs out of memory, the local disk shakes and turns red, the packets stop, and the dashboards show stale zeros. On the right, Kinesis Firehose and Glue pulse green, route the bad records to a quarantine bucket, and Athena keeps answering queries. The strip shows a manual rerun on the left and delivery in under 60 seconds on the right.

### Slide 34: Disaster Recovery (DR) Planning & Management

*Module 14 of 15 · Theory*

On screen:
- Four strategies: backup, pilot light, warm standby, active-active
- Lower RTO and RPO raise standby cost
- Choose by the cost of downtime, not by fear

> Theory: The RTO/RPO Cost Trade-off (Qualitative Heuristic) · AWS Well-Architected Reliability Pillar (2021)

| Component | Naive build | Well-Architected build |
|---|---|---|
| Strategy | Backup and hope, in the same region | Active-active across us-east-1 and eu-west-1 |
| Recovery time | 3 to 5 days to rebuild by hand | Route 53 ARC shifts traffic in under a minute |
| Data loss | Up to 2 weeks of commits | Aurora Global Database replicates in under a second |
| Testing | Never tested | Automated game-day drills run continuously |

**61. Devarsh:** The theory is the cost of recovery. As RTO and RPO approach zero, the cost of standby capacity rises. AWS describes four strategies: backup and restore, pilot light, warm standby, and multi-region active-active. In our model, backup and restore costs one unit with a twenty-four hour RTO. Active-active costs about seven units and recovers in under thirty seconds. Pick the strategy that matches the cost of downtime.

### Slide 35: 4 AWS DR Strategies (Backup/Restore -> Pilot Light -> Warm Standby -> Multi-Region Active-Active) vs. "Backup & Hope"

*Module 14 of 15 · Naive (left) vs Well-Architected (right)*

> Failure injected: Catastrophic AWS Primary Region (`us-east-1`) Blackout

| Build | Availability | Recovery time | Monthly cost |
|---|---|---|---|
| Naive build | 95.0% | 3 to 5 Days | $180 |
| Well-Architected | 99.999% | < 45 Seconds (Route 53 Shift) | $520 |

**62. Aman:** On the left, the naive disaster recovery. The primary region us-east-1, an untested snapshot in the same region, and the panicked ops team, with SPOF tags on the region and the snapshot. Everything sits in one region.

**63. Devarsh:** On the right, the Well-Architected disaster recovery. Route 53 Application Recovery Controller at the top, the primary region, a secondary region in eu-west-1, the Aurora Global Database and cross-region S3 replication. Green connectors show traffic and data running to both regions.

**64. Aman:** Now the whole us-east-1 region goes dark. On the left, the primary region and the untested snapshot shake and turn red, the packets stop, and the ops team rebuilds by hand. On the right, the primary region card pulses green as Route 53 ARC shifts traffic to eu-west-1 and Aurora promotes the secondary cluster. The strip shows recovery: three to five days on the left, under a minute on the right.

### Slide 36: Executive Conclusion & Architectural Verdict

*Module 15 of 15 · Theory*

On screen:
- Architecture is a continuous practice, not a one-time sign-off
- Fitness functions protect qualities as the system changes
- The six pillars are the fitness checks

> Theory: The Law of Demeter & Evolutionary Architecture Principle · Ian Holland / Neal Ford, Rebecca Parsons (1987 / 2017)

| Component | Naive build | Well-Architected build |
|---|---|---|
| Availability | 98.5%, frequent unplanned downtime | 99.99%, certified high availability |
| Recovery | 48+ hours after an incident | Under 30 seconds with automatic failover |
| Annual spend | $53,400 a year | $21,840 a year |
| Governance | Failing audit, unmitigated risk | AWS Organizations, guardrails and GitOps pipelines |

**65. Devarsh:** The last theory is evolutionary architecture, set out by Neal Ford, Rebecca Parsons and Patrick Kua in 2017. An architecture is guided, incremental change, protected by fitness functions that check its qualities after every change. The six pillars act as those fitness checks. A Well-Architected review scores the system across them, and the score is a weighted sum of the pillars.

### Slide 37: The 15-Domain Transformation Matrix, 10 Golden Rules, & Architecture Sign-Off

*Module 15 of 15 · Naive (left) vs Well-Architected (right)*

> Failure injected: Enterprise Audit Validation & Resiliency Certification

| Build | Availability | Recovery time | Monthly cost |
|---|---|---|---|
| Naive build | 98.5% | 48+ Hours | $4,450 |
| Well-Architected | 99.99% | < 30 Seconds | $1,820 |

**66. Aman:** On the left, the naive verdict. The technical debt backlog and the uncontained blast radius, both tagged SPOF. Two cards, no guardrails, and the packets run into both.

**67. Devarsh:** On the right, the Well-Architected governance: AWS Organizations with service control policies, the GitOps CI/CD pipelines, and proactive telemetry with auto-healing. Every card carries an HA tag, and the green connectors show the governance path.

**68. Aman:** Now the unannounced audit stress test. On the left, the backlog and the blast radius shake and turn red, the packets stop, and the audit finds unencrypted data and public credentials. On the right, the governance and pipeline cards pulse green as Config and Security Hub report compliance and the telemetry heals the disruption. The final slide sums up the change.

### Slide 38: What changed across the fifteen domains

*Scorecard*

> Start from the failure you cannot accept, then build the smallest design that survives it

| Measure | Naive build | Well-Architected build | Change |
|---|---|---|---|
| Availability | 98.5% | 99.99% | +1.49 points |
| Monthly cloud spend | $4,450 | $1,820 | 59.1% lower |
| Annual cloud spend | $53,400 | $21,840 | $31,560 saved a year |
| High-risk issues | 3 | 0 | All remediated |
| Recovery time | hours | under 30 seconds | Hours to seconds |

**69. Devarsh:** To close the scorecard. Availability moves from 98.5 to 99.99 percent. Monthly cloud spend moves from four thousand four hundred and fifty dollars to eighteen hundred and twenty dollars, a reduction of 59 percent. Three high-risk issues go to zero, and recovery time drops from hours to under thirty seconds.

**70. Aman:** That is the Well-Architected argument. Start from the failure you cannot accept, name the pillar it touches, then build the smallest design that survives it. Thank you. We will take questions now.

---

Word count: 3854. Planned time: 27:21.
