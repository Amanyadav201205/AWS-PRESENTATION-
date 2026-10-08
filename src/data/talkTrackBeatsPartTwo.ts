import { ARCHITECTURE_SLIDE, INJECT_OUTAGE, PROOF_SLIDE, TRAFFIC_PULSE } from './talkTrackCues';
import { TalkLineDraft } from './talkTrackTypes';

// Modules 7 to 15 and the closing. Lines keep alternating, so each speaker picks up exactly where the other stops.
export const talkLinesPartTwo: TalkLineDraft[] = [
  {
    domainIndex: 6,
    say: 'Security: naive means hardcoded keys; WAF uses IAM roles with temporary credentials.',
    show: 'Architecture slide: hardcoded keys versus IAM roles and Secrets Manager.',
    cues: [ARCHITECTURE_SLIDE]
  },
  {
    domainIndex: 6,
    say: 'An attacker injects SQL and steals a key. WAF blocks the payload; the credentials expire.',
    show: 'Outage: SQL injection plus stolen key, WAF blocks.',
    cues: [INJECT_OUTAGE]
  },
  {
    domainIndex: 6,
    say: 'Envelope encryption: a data key encrypts the data, and KMS encrypts that key.',
    show: 'Proof slide: envelope encryption formulas.',
    cues: [PROOF_SLIDE],
    formula: 'C = E(K_DEK, P)   and   K_enc = E(K_CMK, K_DEK)'
  },
  {
    domainIndex: 7,
    say: 'Naive monitoring: users report the outage first, and fixes are manual SSH.',
    show: 'Architecture slide: unmonitored server versus canaries and alarms.',
    cues: [ARCHITECTURE_SLIDE]
  },
  {
    domainIndex: 7,
    say: 'A memory leak hangs the API. Canaries catch it in seconds; self-healing restarts it.',
    show: 'Outage: memory leak, canary alarm fires, self-heal runs.',
    cues: [INJECT_OUTAGE]
  },
  {
    domainIndex: 7,
    say: 'Parallel redundancy: three zones at 99.9 percent each give nine nines.',
    show: 'Proof slide: parallel availability formula.',
    cues: [PROOF_SLIDE],
    formula: 'A = 1 − ∏ᵢ(1 − Aᵢ) = 1 − (0.001)³ = 0.999999999'
  },
  {
    domainIndex: 8,
    say: 'Naive infrastructure is clicked together in the console. WAF is declared in Git.',
    show: 'Architecture slide: console clicking versus GitOps pipeline.',
    cues: [ARCHITECTURE_SLIDE]
  },
  {
    domainIndex: 8,
    say: 'A rogue engineer opens port 22 by hand. Config flags it; Systems Manager reverts it.',
    show: 'Outage: rogue port-22 change, drift detected and reverted.',
    cues: [INJECT_OUTAGE]
  },
  {
    domainIndex: 8,
    say: 'Declarative convergence: the pipeline keeps pushing live state toward the Git state.',
    show: 'Proof slide: convergence to the desired state.',
    cues: [PROOF_SLIDE],
    formula: 'lim (t→∞) Δ(S_desired, S_actual) = 0'
  },
  {
    domainIndex: 9,
    say: 'Naive: every visitor hits the origin. WAF: CloudFront and ElastiCache absorb traffic.',
    show: 'Architecture slide: direct origin versus CloudFront and Redis.',
    cues: [ARCHITECTURE_SLIDE]
  },
  {
    domainIndex: 9,
    say: 'A TV advert drives 50,000 requests a second. The edge takes them, not the database.',
    show: 'Outage: 50k requests per second flash sale, edge absorbs it.',
    cues: [INJECT_OUTAGE]
  },
  {
    domainIndex: 9,
    say: 'With 95 percent hits, average latency falls from 80 to under 6 milliseconds.',
    show: 'Proof slide: effective latency formula.',
    cues: [PROOF_SLIDE],
    formula: 'T_eff = H · T_cache + (1 − H) · T_origin = 0.95 × 2 + 0.05 × 80 = 5.9 ms'
  },
  {
    domainIndex: 10,
    say: 'Naive checkout waits on every third party. WAF queues the order and replies.',
    show: 'Architecture slide: blocking HTTP chain versus SQS-buffered checkout.',
    cues: [ARCHITECTURE_SLIDE]
  },
  {
    domainIndex: 10,
    say: 'The email vendor fails during 20,000 orders. Naive checkout crashes; WAF queues everything.',
    show: 'Outage: email vendor down during 20,000 orders, SQS buffers.',
    cues: [INJECT_OUTAGE]
  },
  {
    domainIndex: 10,
    say: 'A synchronous chain multiplies failure: five 99 percent services give 95 percent.',
    show: 'Proof slide: chain availability formula.',
    cues: [PROOF_SLIDE],
    formula: 'A_chain = ∏ᵢ Aᵢ   →   0.99⁵ = 0.951'
  },
  {
    domainIndex: 11,
    say: 'Naive runs two VMs all day, patched by hand. WAF uses API Gateway, Lambda, DynamoDB.',
    show: 'Architecture slide: always-on VMs versus serverless stack.',
    cues: [ARCHITECTURE_SLIDE]
  },
  {
    domainIndex: 11,
    say: 'Traffic jumps from zero to forty thousand calls. Lambda scales at once; VMs lag.',
    show: 'Outage: zero to 40k invocations, Lambda scales, VMs lag.',
    cues: [INJECT_OUTAGE]
  },
  {
    domainIndex: 11,
    say: 'Little’s Law: concurrency equals arrival rate times time in system, so idle costs nothing.',
    show: 'Proof slide: Little’s Law and pay-per-use cost.',
    cues: [PROOF_SLIDE],
    formula: 'L = λ · W   (concurrency = arrival rate × time in system)   Cost = Σₖ RAMₖ × Timeₖ'
  },
  {
    domainIndex: 12,
    say: 'Data pipelines: naive runs nightly dumps that lock production; WAF streams into S3.',
    show: 'Architecture slide: cron dump versus streaming lake and Athena.',
    cues: [ARCHITECTURE_SLIDE]
  },
  {
    domainIndex: 12,
    say: 'Event volume jumps a hundred times, with malformed records. Production stays untouched.',
    show: 'Outage: 100x payload surge with malformed records.',
    cues: [INJECT_OUTAGE]
  },
  {
    domainIndex: 12,
    say: 'Parquet reads only needed columns; in our model that cuts query cost about 85 percent.',
    show: 'Proof slide: pipeline latency decomposition.',
    cues: [PROOF_SLIDE],
    formula: 'T_pipeline = T_ingest + T_transform + T_load   (columnar Parquet cuts bytes scanned)'
  },
  {
    domainIndex: 13,
    say: 'Disaster recovery: naive has one region and an untested snapshot. WAF has a second region.',
    show: 'Architecture slide: single region versus two-region DR.',
    cues: [ARCHITECTURE_SLIDE]
  },
  {
    domainIndex: 13,
    say: 'A regional blackout hits us-east-1. WAF shifts traffic in under a minute.',
    show: 'Outage: us-east-1 blackout, traffic fails over.',
    cues: [INJECT_OUTAGE]
  },
  {
    domainIndex: 13,
    say: 'Lower recovery time and data loss cost more. Pick the DR tier you can afford.',
    show: 'Proof slide: RTO and RPO cost trade-off.',
    cues: [PROOF_SLIDE],
    formula: 'Lower RTO and RPO ⇒ higher standby cost   (Backup 1x, Pilot Light ~2.5x, Warm Standby ~4x, Active-Active ~7x)'
  },
  {
    domainIndex: 14,
    say: 'Across fifteen domains, the health score rises from 22 to 96.',
    show: 'Keynote: review health score and cost metrics.',
    cues: [ARCHITECTURE_SLIDE]
  },
  {
    domainIndex: 14,
    say: 'Annual spend falls from 53,400 to 21,840 dollars. Downtime exposure drops to zero.',
    show: 'Live traffic pulse on the WAF architecture.',
    cues: [TRAFFIC_PULSE]
  },
  {
    domainIndex: 14,
    say: 'So the framework turns fragile deployments into resilient, cost-efficient systems.',
    show: 'Proof slide: fitness formula for the health score.',
    cues: [PROOF_SLIDE],
    formula: 'Fitness(A) = Σⱼ wⱼ · PillarScoreⱼ   (weighted across the six pillars)'
  },
  {
    domainIndex: 14,
    say: 'Thank you for listening.',
    show: 'Keynote closing slide.',
    cues: [ARCHITECTURE_SLIDE]
  }
];
