import {
  ENTER_DECK,
  FAILURE,
  LOAD_BUSY,
  LOAD_NORMAL,
  LOAD_PEAK,
  PACKETS_ON,
  RECOVER,
  SHOW_NAIVE,
  SHOW_WAF
} from './talkTrackCues';
import { TalkLineDraft } from './talkTrackTypes';

// Opening, then modules 1 to 6 (overview through connecting networks).
// Every module gets two lines: the naive build under load and failure, then the fix and the packet path.
export const talkLinesPartOne: TalkLineDraft[] = [
  {
    domainIndex: 0,
    say: "Good morning. Anyone can launch a server in five minutes; keeping a platform alive through traffic spikes and failures is architecture. Today we run fifteen simulations, one for each area of the Well-Architected Framework.",
    show: "Naive build at normal traffic, packets flowing.",
    cues: [ENTER_DECK, SHOW_NAIVE, LOAD_NORMAL, RECOVER, PACKETS_ON]
  },
  {
    domainIndex: 0,
    say: "The customer wants 99.99 percent availability and failover under thirty seconds. The naive build is one server, one database and one bucket, in one zone. Now we push traffic to peak and fail a zone. Nothing stands behind it, so customers are cut off.",
    show: "Naive: peak traffic, zone fails, stack goes dark.",
    cues: [SHOW_NAIVE, LOAD_PEAK, FAILURE, PACKETS_ON]
  },
  {
    domainIndex: 0,
    say: "The Well-Architected build takes the same surge and the same failure. Packets go from CloudFront and AWS WAF to a load balancer, which marks the failed zone unhealthy within seconds and moves traffic to the other two zones.",
    show: "WAF: same surge and failure, traffic moves to healthy zones.",
    cues: [SHOW_WAF, LOAD_PEAK, FAILURE, PACKETS_ON]
  },
  {
    domainIndex: 1,
    say: "Storage. The customer keeps fifty terabytes of medical scans for seven years, unchanged. The naive build uses one three-terabyte gp2 disk, where speed is tied to size, and a flat bucket with no versioning. Now a compromised developer key runs a recursive delete.",
    show: "Naive: 3 TB disk and flat bucket, ransomware deletes data.",
    cues: [SHOW_NAIVE, LOAD_BUSY, FAILURE]
  },
  {
    domainIndex: 1,
    say: "The fix: gp3 volumes sized for the workload, and an S3 bucket with Object Lock in compliance mode. Every delete gets a 403, even from root. Old scans move to Glacier Deep Archive, and AWS Backup keeps immutable recovery points.",
    show: "WAF: Object Lock rejects every delete.",
    cues: [SHOW_WAF, FAILURE, PACKETS_ON]
  },
  {
    domainIndex: 2,
    say: "Compute. Five thousand shoppers at baseline, fifty thousand in a flash sale. The naive build is one large monolith in one zone. At ten times normal traffic it runs out of memory, and the whole system crashes.",
    show: "Naive: one monolith, peak traffic, system crash.",
    cues: [SHOW_NAIVE, LOAD_PEAK, FAILURE]
  },
  {
    domainIndex: 2,
    say: "The Well-Architected build runs Graviton instances in an Auto Scaling group across three zones. When zone a fails, its node is marked unhealthy in about ten seconds, traffic shifts to zones b and c, and replacements launch in under 75 seconds.",
    show: "WAF: Auto Scaling across three zones, zone a fails.",
    cues: [SHOW_WAF, LOAD_PEAK, FAILURE, PACKETS_ON]
  },
  {
    domainIndex: 3,
    say: "Database. The customer needs 25,000 transactions a second with zero data loss. The naive build runs self-managed MySQL on one host. Nightly dumps lock the tables and checkouts time out. Now the primary machine kernel-panics, and there is no replica to take over.",
    show: "Naive: one MySQL host, primary kernel panic.",
    cues: [SHOW_NAIVE, LOAD_BUSY, FAILURE]
  },
  {
    domainIndex: 3,
    say: "The Aurora build keeps the writer in zone a and read replicas in zones b and c. When the writer dies, a replica is promoted and the endpoint moves. Writes resume in about 24 seconds, with no committed transaction lost.",
    show: "WAF: Aurora writer fails over to a replica.",
    cues: [SHOW_WAF, LOAD_BUSY, FAILURE, PACKETS_ON]
  },
  {
    domainIndex: 4,
    say: "Networking. PCI DSS level one means no database reachable from the internet. The naive build sits in a flat default VPC, with MySQL on port 3306 open to the public. A botnet finds that port and starts a dictionary attack.",
    show: "Naive: flat VPC, port 3306 open, botnet scan.",
    cues: [SHOW_NAIVE, FAILURE, PACKETS_ON]
  },
  {
    domainIndex: 4,
    say: "The Well-Architected build has three tiers. Only the load balancer is public. The app runs in private subnets, and Aurora sits in an isolated subnet with no internet route. The scanner cannot find the database, so its packets drop at the edge.",
    show: "WAF: three tiers, database unreachable from the internet.",
    cues: [SHOW_WAF, FAILURE, PACKETS_ON]
  },
  {
    domainIndex: 5,
    say: "Connecting networks. Twenty-five VPCs plus headquarters. The naive design peers every VPC with every other one, which means 300 links, and headquarters reaches them over one IPsec VPN on the internet. Now a fiber cut takes that link out, and headquarters is isolated.",
    show: "Naive: full peering mesh, fiber cut, headquarters isolated.",
    cues: [SHOW_NAIVE, LOAD_NORMAL, FAILURE, PACKETS_ON]
  },
  {
    domainIndex: 5,
    say: "The Well-Architected build attaches all 25 VPCs to one Transit Gateway hub: 25 attachments instead of 300 links. Headquarters uses 10-gigabit Direct Connect, with a VPN over BGP as backup. When the fiber is cut, BGP reroutes in about three seconds.",
    show: "WAF: Transit Gateway hub, BGP fails over in seconds.",
    cues: [SHOW_WAF, FAILURE, PACKETS_ON]
  }
];
