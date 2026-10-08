# WAF Presentation: Script and Run Sheet

Two presenters, one conversation. 48 lines, about **4:47** planned, hard limit 8:00. Devarsh and Aman alternate line by line; there are no handovers, just the next line.

## Before you present (do this on the day)

1. **Open the deployed site on the laptop** (the same address you tested). Press Space once: the bottom-left pill should move from "Talk ready" to "line 1 of 48", and the deck should open. Press B to go back, then Space again.
2. **Pair the phones, but do not depend on them.** Each phone opens the same site with `?mode=remote&room=WAF-XXXX`. A phone shows **Linked** on the Talk tab when it reaches the laptop. Test both phones once on the network they will use (mobile data or venue Wi-Fi).
3. **If a phone says "Not linked"**, nothing is wrong with the talk. Keep going from the laptop. The phone still shows the full script, and the pill on the big screen shows the line number.
4. **Run the whole talk once** from the laptop keys, about five minutes, to check the timing.
5. **Laptop settings:** full-screen Chrome, sleep and display off turned off, notifications off. Keep the charger plugged in.
6. **Print this page** as a backup. The script reads from top to bottom in order.

## Controls

| Key or button | Does |
|---|---|
| Space, Page Down, or N | Next line (shows its screen) |
| B or Page Up | Previous line |
| P | Presenter deck (the talk turns it on by itself at line 1) |
| C / R | Start or stop the outage in the current module / reset |
| Arrow keys | Previous or next module (not the talk) |

The phone's **Talk** tab shows the same line. Its button sends the next line to the laptop when linked.

## Network: what can and cannot be guaranteed

- The talk itself needs **only the laptop**. Keys and the pill work offline.
- Phones connect to the laptop over the internet, peer to peer. That usually works across different networks, but it can fail behind some mobile carriers or strict firewalls. The app cannot guarantee it without a relay server.
- If you want a guaranteed phone link, you need a **TURN relay** account from a provider. Then set `VITE_TURN_URL`, `VITE_TURN_USERNAME`, and `VITE_TURN_CREDENTIAL` in the Vercel project settings and redeploy. Those values are compiled into the app at build time, so the redeploy is required.

## Script

### Opening and Architecture Overview

**1. Devarsh:** Good morning. Anyone can launch a server in five minutes; keeping it alive takes architecture.

> **On the big screen:** Deck opens on the architecture slide.

**2. Aman:** So we built one application two ways, judged against the six pillars.

> **On the big screen:** Live traffic pulse across the WAF stack.

**3. Devarsh:** Left: one server, one database, one public subnet. Right: three zones.

> **On the big screen:** Architecture slide: naive monolith versus multi-zone WAF.

**4. Aman:** Now we fail a zone under surge. The naive stack dies; WAF fails over.

> **On the big screen:** Outage: naive goes dark, WAF fails over.

**5. Devarsh:** Series parts multiply risk; redundancy restores it. Availability goes from 98.5 to 99.99.

> **On the big screen:** Proof slide: series and redundant formulas.
>
> **Formula:** `Series: R = R₁ × R₂ × … × Rₙ   |   Redundant: A = 1 − ∏ᵢ(1 − Aᵢ)`

### 2. Storage Layer

**6. Aman:** Storage next. Naive disks tie speed to size; the flat bucket has no versioning.

> **On the big screen:** Architecture slide: gp2 disk and flat S3 versus gp3 and tiered S3.

**7. Devarsh:** Now ransomware hits. Compliance-mode Object Lock refuses every delete, even from root.

> **On the big screen:** Outage: ransomware, naive data lost, WAF returns 403.

**8. Aman:** Erasure coding gives the durability. gp3 decouples speed from size, about 20 percent cheaper.

> **On the big screen:** Proof slide: erasure-coding loss formula.
>
> **Formula:** `P(loss) = Σ_{j=m+1}^{n} C(n,j) · pʲ · (1 − p)ⁿ⁻ʲ`

### 3. Compute Layer

**9. Devarsh:** Compute: one oversized server, versus Graviton instances in an Auto Scaling group.

> **On the big screen:** Architecture slide: one big server versus Auto Scaling group.

**10. Aman:** A surge hits as zone a fails. The big server overheats; healthy zones scale out.

> **On the big screen:** Outage: zone a fails under surge, group scales out.

**11. Devarsh:** Amdahl’s Law: extra workers only speed up the parallel share, so gains are capped.

> **On the big screen:** Proof slide: Amdahl’s Law.
>
> **Formula:** `S = 1 / ((1 − p) + p / N)`

### 4. Database Layer

**12. Aman:** The database: naive is MySQL on one disk; WAF is Aurora across three zones.

> **On the big screen:** Architecture slide: single MySQL versus Aurora cluster.

**13. Devarsh:** Now the primary writer crashes. Aurora promotes a replica in under thirty seconds.

> **On the big screen:** Outage: primary database crash, Aurora fails over.

**14. Aman:** Quorum keeps data safe: four write and three read votes out of six always overlap.

> **On the big screen:** Proof slide: quorum conditions.
>
> **Formula:** `Vᵣ + V_w > V   and   V_w > V / 2   (V = 6, V_w = 4, Vᵣ = 3)`

### 5. Networking Environment

**15. Devarsh:** Naive: the database sits in a public subnet, port 3306 open. WAF: three isolated tiers.

> **On the big screen:** Architecture slide: flat public VPC versus three-tier VPC.

**16. Aman:** A botnet scans the internet and finds the naive database. The isolated one is unreachable.

> **On the big screen:** Outage: port-scan botnet, naive database exposed.

**17. Devarsh:** That is defense in depth: an attacker must beat every layer, so breach odds multiply.

> **On the big screen:** Proof slide: layered breach probability.
>
> **Formula:** `P(breach) = ∏ₖ pₖ   (pₖ = chance of bypassing layer k; layers independent)`

### 6. Connecting Networks

**18. Aman:** Naive: a full peering mesh. WAF: a Transit Gateway hub with Direct Connect.

> **On the big screen:** Architecture slide: peering mesh versus Transit Gateway hub.

**19. Devarsh:** A fiber cut kills the primary link. BGP fails over in seconds.

> **On the big screen:** Outage: Direct Connect fiber cut, BGP fails over.

**20. Aman:** Twenty VPCs as a full mesh need 190 links; a hub needs only 20 attachments.

> **On the big screen:** Proof slide: complete-graph edge count.
>
> **Formula:** `Mesh links = N(N − 1) / 2   vs   Transit Gateway attachments = N   (N = 20: 190 vs 20)`

### 7. Securing Applications & Data Access

**21. Devarsh:** Security: naive means hardcoded keys; WAF uses IAM roles with temporary credentials.

> **On the big screen:** Architecture slide: hardcoded keys versus IAM roles and Secrets Manager.

**22. Aman:** An attacker injects SQL and steals a key. WAF blocks the payload; the credentials expire.

> **On the big screen:** Outage: SQL injection plus stolen key, WAF blocks.

**23. Devarsh:** Envelope encryption: a data key encrypts the data, and KMS encrypts that key.

> **On the big screen:** Proof slide: envelope encryption formulas.
>
> **Formula:** `C = E(K_DEK, P)   and   K_enc = E(K_CMK, K_DEK)`

### 8. Monitoring, Elasticity & High Availability

**24. Aman:** Naive monitoring: users report the outage first, and fixes are manual SSH.

> **On the big screen:** Architecture slide: unmonitored server versus canaries and alarms.

**25. Devarsh:** A memory leak hangs the API. Canaries catch it in seconds; self-healing restarts it.

> **On the big screen:** Outage: memory leak, canary alarm fires, self-heal runs.

**26. Aman:** Parallel redundancy: three zones at 99.9 percent each give nine nines.

> **On the big screen:** Proof slide: parallel availability formula.
>
> **Formula:** `A = 1 − ∏ᵢ(1 − Aᵢ) = 1 − (0.001)³ = 0.999999999`

### 9. Automating the Architecture

**27. Devarsh:** Naive infrastructure is clicked together in the console. WAF is declared in Git.

> **On the big screen:** Architecture slide: console clicking versus GitOps pipeline.

**28. Aman:** A rogue engineer opens port 22 by hand. Config flags it; Systems Manager reverts it.

> **On the big screen:** Outage: rogue port-22 change, drift detected and reverted.

**29. Devarsh:** Declarative convergence: the pipeline keeps pushing live state toward the Git state.

> **On the big screen:** Proof slide: convergence to the desired state.
>
> **Formula:** `lim (t→∞) Δ(S_desired, S_actual) = 0`

### 10. Caching Content

**30. Aman:** Naive: every visitor hits the origin. WAF: CloudFront and ElastiCache absorb traffic.

> **On the big screen:** Architecture slide: direct origin versus CloudFront and Redis.

**31. Devarsh:** A TV advert drives 50,000 requests a second. The edge takes them, not the database.

> **On the big screen:** Outage: 50k requests per second flash sale, edge absorbs it.

**32. Aman:** With 95 percent hits, average latency falls from 80 to under 6 milliseconds.

> **On the big screen:** Proof slide: effective latency formula.
>
> **Formula:** `T_eff = H · T_cache + (1 − H) · T_origin = 0.95 × 2 + 0.05 × 80 = 5.9 ms`

### 11. Building Decoupled Architecture

**33. Devarsh:** Naive checkout waits on every third party. WAF queues the order and replies.

> **On the big screen:** Architecture slide: blocking HTTP chain versus SQS-buffered checkout.

**34. Aman:** The email vendor fails during 20,000 orders. Naive checkout crashes; WAF queues everything.

> **On the big screen:** Outage: email vendor down during 20,000 orders, SQS buffers.

**35. Devarsh:** A synchronous chain multiplies failure: five 99 percent services give 95 percent.

> **On the big screen:** Proof slide: chain availability formula.
>
> **Formula:** `A_chain = ∏ᵢ Aᵢ   →   0.99⁵ = 0.951`

### 12. Serverless Architecture & Microservices

**36. Aman:** Naive runs two VMs all day, patched by hand. WAF uses API Gateway, Lambda, DynamoDB.

> **On the big screen:** Architecture slide: always-on VMs versus serverless stack.

**37. Devarsh:** Traffic jumps from zero to forty thousand calls. Lambda scales at once; VMs lag.

> **On the big screen:** Outage: zero to 40k invocations, Lambda scales, VMs lag.

**38. Aman:** Little’s Law: concurrency equals arrival rate times time in system, so idle costs nothing.

> **On the big screen:** Proof slide: Little’s Law and pay-per-use cost.
>
> **Formula:** `L = λ · W   (concurrency = arrival rate × time in system)   Cost = Σₖ RAMₖ × Timeₖ`

### 13. Data Pipelines

**39. Devarsh:** Data pipelines: naive runs nightly dumps that lock production; WAF streams into S3.

> **On the big screen:** Architecture slide: cron dump versus streaming lake and Athena.

**40. Aman:** Event volume jumps a hundred times, with malformed records. Production stays untouched.

> **On the big screen:** Outage: 100x payload surge with malformed records.

**41. Devarsh:** Parquet reads only needed columns; in our model that cuts query cost about 85 percent.

> **On the big screen:** Proof slide: pipeline latency decomposition.
>
> **Formula:** `T_pipeline = T_ingest + T_transform + T_load   (columnar Parquet cuts bytes scanned)`

### 14. Disaster Recovery (DR) Planning & Management

**42. Aman:** Disaster recovery: naive has one region and an untested snapshot. WAF has a second region.

> **On the big screen:** Architecture slide: single region versus two-region DR.

**43. Devarsh:** A regional blackout hits us-east-1. WAF shifts traffic in under a minute.

> **On the big screen:** Outage: us-east-1 blackout, traffic fails over.

**44. Aman:** Lower recovery time and data loss cost more. Pick the DR tier you can afford.

> **On the big screen:** Proof slide: RTO and RPO cost trade-off.
>
> **Formula:** `Lower RTO and RPO ⇒ higher standby cost   (Backup 1x, Pilot Light ~2.5x, Warm Standby ~4x, Active-Active ~7x)`

### 15. Executive Conclusion & Architectural Verdict

**45. Devarsh:** Across fifteen domains, the health score rises from 22 to 96.

> **On the big screen:** Keynote: review health score and cost metrics.

**46. Aman:** Annual spend falls from 53,400 to 21,840 dollars. Downtime exposure drops to zero.

> **On the big screen:** Live traffic pulse on the WAF architecture.

**47. Devarsh:** So the framework turns fragile deployments into resilient, cost-efficient systems.

> **On the big screen:** Proof slide: fitness formula for the health score.
>
> **Formula:** `Fitness(A) = Σⱼ wⱼ · PillarScoreⱼ   (weighted across the six pillars)`

**48. Aman:** Thank you for listening.

> **On the big screen:** Keynote closing slide.

## Numbers to say (from the simulation)

- Overview: 3 critical risks to 0; availability 98.5% to 99.99%; $4,450 to $1,820 a month; recovery from 4 to 8 hours to under 30 seconds.
- Storage: $420 to $118 a month; 11 nines durability; gp3 about 20% cheaper per GB than gp2.
- Compute: $584 to $168 a month; average CPU 8% to 62%.
- Database: failover typically under 30 seconds; quorum 4 write and 3 read out of 6 copies.
- Networking: public database exposure 100% to 0%; three tiers across three zones.
- Connecting: a 20-VPC full mesh needs 190 links; a hub needs 20 attachments.
- Monitoring: detection under 15 seconds; remediation under 45 seconds.
- Caching: 96% edge hit ratio; p95 latency 850 ms to 18 ms.
- Decoupling: checkout 3,800 ms to 85 ms.
- Serverless: scale-out from 8 to 15 minutes down to under 500 ms.
- DR: RPO 2 weeks to under 1 second; RTO 3 to 5 days to under 45 seconds.
- Conclusion: health score 22 to 96; annual spend $53,400 to $21,840.

These are the simulation's model figures, not measured production results.

