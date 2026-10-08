import {
  FAILURE,
  LOAD_BUSY,
  LOAD_PEAK,
  PACKETS_ON,
  SHOW_BOTH,
  SHOW_NAIVE,
  SHOW_WAF
} from './talkTrackCues';
import { TalkLineDraft } from './talkTrackTypes';

// Modules 7 to 15 (security through the executive conclusion). Same pattern as part one.
export const talkLinesPartTwo: TalkLineDraft[] = [
  {
    domainIndex: 6,
    say: "Security. The risk: developers commit keys to GitHub, bots inject SQL, and passwords never rotate. The naive app has keys hardcoded, and the database password is in clear text. An attacker injects a query, uses a stolen key, and downloads customer data.",
    show: "Naive: hardcoded keys, injection and stolen key breach.",
    cues: [SHOW_NAIVE, FAILURE, PACKETS_ON]
  },
  {
    domainIndex: 6,
    say: "The Well-Architected build has no keys in code. An IAM role issues temporary credentials, and Secrets Manager rotates the database password. AWS WAF blocks the injection at the edge with a 403. GuardDuty quarantines the stolen key.",
    show: "WAF: IAM roles, WAF blocks injection, GuardDuty quarantines.",
    cues: [SHOW_WAF, FAILURE, PACKETS_ON]
  },
  {
    domainIndex: 7,
    say: "Monitoring and self-healing. The bank has two million customers and needs 99.99 percent. The naive server has no monitoring. A bad deployment leaks memory, requests hang for over fifteen seconds, and the first alert is a customer posting on social media.",
    show: "Naive: unmonitored server, memory leak, silent outage.",
    cues: [SHOW_NAIVE, FAILURE, PACKETS_ON]
  },
  {
    domainIndex: 7,
    say: "The Well-Architected build runs a synthetic canary on checkout, and a composite alarm fires only when the pattern is real. EventBridge triggers a Lambda that recycles the tasks, and X-Ray shows where the time went. The service heals in about 38 seconds, before anyone is paged.",
    show: "WAF: canary, composite alarm, self-healing in 38 seconds.",
    cues: [SHOW_WAF, FAILURE, PACKETS_ON]
  },
  {
    domainIndex: 8,
    say: "Automation. At two in the morning an engineer opens port 22 to the whole internet in the console to debug, then forgets. Nothing records the change, so nobody knows the door is open. This is ClickOps, and it is how drift starts.",
    show: "Naive: console change opens port 22, nothing records it.",
    cues: [SHOW_NAIVE, FAILURE, PACKETS_ON]
  },
  {
    domainIndex: 8,
    say: "The Well-Architected build keeps every change in Git and builds it through pipelines. AWS Config flags the open port within 30 seconds, and a Systems Manager runbook removes the rule and alerts the security team. The same code rebuilds production and disaster recovery.",
    show: "WAF: AWS Config reverts the rule in 42 seconds.",
    cues: [SHOW_WAF, FAILURE, PACKETS_ON]
  },
  {
    domainIndex: 9,
    say: "Caching. The customer serves ten million viewers worldwide with sub-20-millisecond latency. The naive build sends every request to one origin and its database. A national advertisement airs, 50,000 requests a second arrive, and the origin collapses.",
    show: "Naive: origin collapses under 50,000 requests a second.",
    cues: [SHOW_NAIVE, LOAD_PEAK, FAILURE]
  },
  {
    domainIndex: 9,
    say: "CloudFront runs across more than 600 edge locations, so most requests are answered there and never reach the origin. Misses go to Redis. In the simulation, about 96 percent of requests stay at the edge, and database CPU stays near 14 percent.",
    show: "WAF: CloudFront and Redis absorb the spike.",
    cues: [SHOW_WAF, LOAD_PEAK, FAILURE, PACKETS_ON]
  },
  {
    domainIndex: 10,
    say: "Decoupling. Black Friday brings 100,000 orders an hour. The naive checkout calls the payment and email vendors synchronously and holds the shopper's connection open. The email vendor goes dark worldwide, every checkout thread waits, and checkout fails for everyone.",
    show: "Naive: synchronous checkout, email vendor down, threads starve.",
    cues: [SHOW_NAIVE, LOAD_BUSY, FAILURE, PACKETS_ON]
  },
  {
    domainIndex: 10,
    say: "The Well-Architected build puts each order into an SQS queue and confirms it in under 90 milliseconds. SNS fans the work out, and workers retry with backoff. When the vendor returns, the backlog drains in three minutes, with no lost orders.",
    show: "WAF: SQS and SNS keep checkout up, backlog drains.",
    cues: [SHOW_WAF, LOAD_BUSY, FAILURE, PACKETS_ON]
  },
  {
    domainIndex: 11,
    say: "Serverless. The mobile backend is nearly idle overnight, then explodes at rush hour. The naive build uses two monolith VMs that need manual patching and take eight to fifteen minutes to boot. A jump from zero to forty thousand calls freezes them.",
    show: "Naive: VMs freeze at forty thousand calls.",
    cues: [SHOW_NAIVE, LOAD_PEAK, FAILURE]
  },
  {
    domainIndex: 11,
    say: "The Well-Architected build uses API Gateway, Lambda on ARM64, Step Functions, and DynamoDB on demand. Nothing needs patching, and nothing runs or bills while idle. Lambda scales to thousands of concurrent executions in milliseconds, and all forty thousand calls complete.",
    show: "WAF: API Gateway and Lambda scale with no servers.",
    cues: [SHOW_WAF, LOAD_PEAK, FAILURE, PACKETS_ON]
  },
  {
    domainIndex: 12,
    say: "Data pipelines. 500 million events a day, with dashboards under a minute. The naive build dumps production to a local CSV, and a pandas script reads it. A campaign surge and a malformed update arrive together, and the script runs out of memory.",
    show: "Naive: cron dump to CSV, pandas runs out of memory.",
    cues: [SHOW_NAIVE, LOAD_BUSY, FAILURE]
  },
  {
    domainIndex: 12,
    say: "The Well-Architected build streams events through Kinesis Firehose, which scales with volume. Glue transforms them serverlessly into an S3 data lake. Malformed records go to a quarantine bucket, and the stream keeps moving. Athena queries the lake with SQL.",
    show: "WAF: Firehose, Glue, S3 lake, quarantine for bad records.",
    cues: [SHOW_WAF, LOAD_PEAK, FAILURE, PACKETS_ON]
  },
  {
    domainIndex: 13,
    say: "Disaster recovery. The bank needs recovery under one minute and data loss under one second, even if a whole region fails. The naive build keeps everything in us-east-1, with an untested snapshot beside it. When the region goes dark, a manual runbook takes days.",
    show: "Naive: single region, untested snapshot, region blackout.",
    cues: [SHOW_NAIVE, FAILURE, PACKETS_ON]
  },
  {
    domainIndex: 13,
    say: "The Well-Architected build runs a second region, eu-west-1, with Aurora Global Database replicating continuously. Route 53 Application Recovery Controller shifts traffic away from us-east-1, and Aurora promotes the secondary cluster. Traffic moves in about 36 seconds, with no transactions lost.",
    show: "WAF: Route 53 ARC and Aurora Global shift to eu-west-1.",
    cues: [SHOW_WAF, FAILURE, PACKETS_ON]
  },
  {
    domainIndex: 14,
    say: "Executive conclusion. Here is the same surge and the same failure, side by side. The naive design carries a technical debt backlog and an uncontained blast radius. The Well-Architected design has organizational guardrails, pipelines for every change, and telemetry that heals itself.",
    show: "Both builds side by side under the same surge.",
    cues: [SHOW_BOTH, LOAD_PEAK, FAILURE, PACKETS_ON]
  },
  {
    domainIndex: 14,
    say: "Across all six pillars the pattern repeats. The naive design fails under load, and one mistake can cause a breach. The Well-Architected design stays up, recovers on its own, and keeps cost and carbon under control.",
    show: "WAF: the full picture, six pillars held.",
    cues: [SHOW_WAF, LOAD_PEAK, PACKETS_ON]
  },
  {
    domainIndex: 14,
    say: "Thank you. Each of these fifteen simulations can be replayed from the laptop, and we are happy to take questions.",
    show: "Both builds side by side.",
    cues: [SHOW_BOTH]
  }
];
