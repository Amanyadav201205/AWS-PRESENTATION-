import { ARCHITECTURE_SLIDE, ENTER_DECK, INJECT_OUTAGE, PROOF_SLIDE, TRAFFIC_PULSE } from './talkTrackCues';
import { TalkLineDraft } from './talkTrackTypes';

// Opening and modules 1 to 8. Lines alternate between Devarsh and Aman, and each one flows into the next.
export const talkLinesPartOne: TalkLineDraft[] = [
  {
    domainIndex: 0,
    say: 'Good morning. Anyone can launch a server in five minutes; keeping it alive takes architecture.',
    show: 'Deck opens on the architecture slide.',
    cues: [ENTER_DECK, ARCHITECTURE_SLIDE]
  },
  {
    domainIndex: 0,
    say: 'So we built one application two ways, judged against the six pillars.',
    show: 'Live traffic pulse across the WAF stack.',
    cues: [TRAFFIC_PULSE]
  },
  {
    domainIndex: 0,
    say: 'Left: one server, one database, one public subnet. Right: three zones.',
    show: 'Architecture slide: naive monolith versus multi-zone WAF.',
    cues: [ARCHITECTURE_SLIDE]
  },
  {
    domainIndex: 0,
    say: 'Now we fail a zone under surge. The naive stack dies; WAF fails over.',
    show: 'Outage: naive goes dark, WAF fails over.',
    cues: [INJECT_OUTAGE]
  },
  {
    domainIndex: 0,
    say: 'Series parts multiply risk; redundancy restores it. Availability goes from 98.5 to 99.99.',
    show: 'Proof slide: series and redundant formulas.',
    cues: [PROOF_SLIDE],
    formula: 'Series: R = R₁ × R₂ × … × Rₙ   |   Redundant: A = 1 − ∏ᵢ(1 − Aᵢ)'
  },
  {
    domainIndex: 1,
    say: 'Storage next. Naive disks tie speed to size; the flat bucket has no versioning.',
    show: 'Architecture slide: gp2 disk and flat S3 versus gp3 and tiered S3.',
    cues: [ARCHITECTURE_SLIDE]
  },
  {
    domainIndex: 1,
    say: 'Now ransomware hits. Compliance-mode Object Lock refuses every delete, even from root.',
    show: 'Outage: ransomware, naive data lost, WAF returns 403.',
    cues: [INJECT_OUTAGE]
  },
  {
    domainIndex: 1,
    say: 'Erasure coding gives the durability. gp3 decouples speed from size, about 20 percent cheaper.',
    show: 'Proof slide: erasure-coding loss formula.',
    cues: [PROOF_SLIDE],
    formula: 'P(loss) = Σ_{j=m+1}^{n} C(n,j) · pʲ · (1 − p)ⁿ⁻ʲ'
  },
  {
    domainIndex: 2,
    say: 'Compute: one oversized server, versus Graviton instances in an Auto Scaling group.',
    show: 'Architecture slide: one big server versus Auto Scaling group.',
    cues: [ARCHITECTURE_SLIDE]
  },
  {
    domainIndex: 2,
    say: 'A surge hits as zone a fails. The big server overheats; healthy zones scale out.',
    show: 'Outage: zone a fails under surge, group scales out.',
    cues: [INJECT_OUTAGE]
  },
  {
    domainIndex: 2,
    say: 'Amdahl’s Law: extra workers only speed up the parallel share, so gains are capped.',
    show: 'Proof slide: Amdahl’s Law.',
    cues: [PROOF_SLIDE],
    formula: 'S = 1 / ((1 − p) + p / N)'
  },
  {
    domainIndex: 3,
    say: 'The database: naive is MySQL on one disk; WAF is Aurora across three zones.',
    show: 'Architecture slide: single MySQL versus Aurora cluster.',
    cues: [ARCHITECTURE_SLIDE]
  },
  {
    domainIndex: 3,
    say: 'Now the primary writer crashes. Aurora promotes a replica in under thirty seconds.',
    show: 'Outage: primary database crash, Aurora fails over.',
    cues: [INJECT_OUTAGE]
  },
  {
    domainIndex: 3,
    say: 'Quorum keeps data safe: four write and three read votes out of six always overlap.',
    show: 'Proof slide: quorum conditions.',
    cues: [PROOF_SLIDE],
    formula: 'Vᵣ + V_w > V   and   V_w > V / 2   (V = 6, V_w = 4, Vᵣ = 3)'
  },
  {
    domainIndex: 4,
    say: 'Naive: the database sits in a public subnet, port 3306 open. WAF: three isolated tiers.',
    show: 'Architecture slide: flat public VPC versus three-tier VPC.',
    cues: [ARCHITECTURE_SLIDE]
  },
  {
    domainIndex: 4,
    say: 'A botnet scans the internet and finds the naive database. The isolated one is unreachable.',
    show: 'Outage: port-scan botnet, naive database exposed.',
    cues: [INJECT_OUTAGE]
  },
  {
    domainIndex: 4,
    say: 'That is defense in depth: an attacker must beat every layer, so breach odds multiply.',
    show: 'Proof slide: layered breach probability.',
    cues: [PROOF_SLIDE],
    formula: 'P(breach) = ∏ₖ pₖ   (pₖ = chance of bypassing layer k; layers independent)'
  },
  {
    domainIndex: 5,
    say: 'Naive: a full peering mesh. WAF: a Transit Gateway hub with Direct Connect.',
    show: 'Architecture slide: peering mesh versus Transit Gateway hub.',
    cues: [ARCHITECTURE_SLIDE]
  },
  {
    domainIndex: 5,
    say: 'A fiber cut kills the primary link. BGP fails over in seconds.',
    show: 'Outage: Direct Connect fiber cut, BGP fails over.',
    cues: [INJECT_OUTAGE]
  },
  {
    domainIndex: 5,
    say: 'Twenty VPCs as a full mesh need 190 links; a hub needs only 20 attachments.',
    show: 'Proof slide: complete-graph edge count.',
    cues: [PROOF_SLIDE],
    formula: 'Mesh links = N(N − 1) / 2   vs   Transit Gateway attachments = N   (N = 20: 190 vs 20)'
  }
];
