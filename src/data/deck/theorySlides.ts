import { DeckSlide } from './deckTypes';
import { agendaTable, blastRadiusTable, keyNumbersTable, ninesTable, pillarTable, readingTable, recoveryTable, redundancyTable, scorecardTable, spofTable } from './theoryTables';
import { ENTER_DECK, RECOVER, SHOW_BOTH } from '../talkTrackCues';

export const titleSlide: DeckSlide = {
  id: 'title',
  kind: 'title',
  eyebrow: 'AWS Well-Architected Framework',
  banner: 'Two presenters · 15 modules · Real-world cloud defense blueprint',
  tables: [keyNumbersTable],
  title: 'Naive builds versus resilient builds',
  points: [
    'Engineered for college undergrads & real-world cloud practitioners',
    'From fragile single-point-of-failure servers to self-healing multi-AZ clusters',
    'Interactive live traffic simulation with real-time disaster injection'
  ],
  domainIndex: 0,
  lines: [
    {
      say: "Good morning everyone! Anyone can launch a server in five minutes following a YouTube tutorial. But keeping a platform alive through real-world traffic spikes, hardware outages, and cyberattacks is true cloud architecture. We are your presenters, Devarsh and Aman, and today we're taking you through fifteen mission-critical modules of the AWS Well-Architected Framework in about twenty minutes.",
      cues: [ENTER_DECK, SHOW_BOTH, RECOVER]
    },
    {
      say: "Every single module follows a clear, powerful pattern. First, we break down the real-world problem and the architectural principle behind it. Then, we flip directly to the live simulation stage: the fragile naive build on the left and the resilient AWS Well-Architected build on the right, under the exact same traffic load and the exact same disaster failure!"
    }
  ]
};

export const agendaSlide: DeckSlide = {
  id: 'agenda',
  kind: 'agenda',
  eyebrow: 'Agenda',
  banner: 'From foundational cloud principles to 15 live architectural simulations',
  tables: [agendaTable],
  title: 'Core cloud theory, then fifteen live domains',
  points: [
    'Part 1: Foundational Cloud Laws (Pillars, SPOF, Availability Nines, Blast Radius)',
    'Part 2: Core Infrastructure (Compute, Storage, Database, 3-Tier Networking)',
    'Part 3: Enterprise Cloud Operations (Security, Automation, Caching, Decoupling, Serverless, Disaster Recovery)'
  ],
  domainIndex: 0,
  lines: [
    {
      say: "Here is our flight plan today. We begin with the core foundations: the six pillars, the myth of the single server, the truth about availability, and blast radius. Then, we dive into the fifteen domains—from compute and storage to database clusters, zero-trust networking, caching, serverless, and disaster recovery. Finally, we finish with the executive scorecard!"
    }
  ]
};

export const theorySlides: DeckSlide[] = [
  {
    id: 'theory-pillars',
    kind: 'theory',
    eyebrow: 'Core Cloud Foundations · 1 of 5',
    banner: 'Every architectural decision is a deliberate trade-off across these six pillars',
    tables: [pillarTable],
    title: 'The Six Pillars of Cloud Architecture',
    points: [
      'Operational Excellence: Automate processes and continually improve',
      'Security: Protect data, identities, and systems with defense-in-depth',
      'Reliability: Recover dynamically from failures and mitigate disruptions',
      'Performance Efficiency: Right-size compute and scale with demand',
      'Cost Optimization: Avoid unnecessary cloud spend with FinOps',
      'Sustainability: Minimize carbon footprint with efficient architectures'
    ],
    domainIndex: 0,
    lines: [
      {
        say: "Everything in AWS rests upon six foundational pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, and Sustainability. As cloud engineers, we never make arbitrary guesses. When you design a system, if you prioritize raw performance without thinking about cost, that's a FinOps trade-off. The Well-Architected Framework teaches you how to balance all six."
      }
    ]
  },
  {
    id: 'theory-spof',
    kind: 'theory',
    eyebrow: 'Core Cloud Foundations · 2 of 5',
    banner: 'Golden Test: If this single component dies right now, does your entire business vanish?',
    tables: [spofTable],
    title: 'Single Point of Failure: The Killer of Apps',
    points: [
      'The Serial Chain Hazard: Five 99% services in a single line yield only 95% total combined uptime',
      'The Compounding Downtime: 95% availability means your company suffers nearly 18 days of unplanned outages per year',
      'Decoupling Remedy: Eliminate single points of failure by decoupling dependencies and introducing automated redundancy'
    ],
    domainIndex: 0,
    lines: [
      {
        say: "What is a Single Point of Failure? Think of old-school Christmas tree lights: if one tiny bulb blows out, the entire string goes completely dark. In software, if your entire app depends on one EC2 instance or one single database, you have a Single Point of Failure. If five independent services each have a 99% uptime and sit in a single chain, your combined availability drops to 95%, meaning nearly eighteen days of downtime a year! Chains are where availability goes to die."
      }
    ]
  },
  {
    id: 'theory-nines',
    kind: 'theory',
    eyebrow: 'Core Cloud Foundations · 3 of 5',
    banner: 'Two independent data centers at 99.9% uptime fail together only once in a million',
    tables: [ninesTable, redundancyTable],
    title: 'The Reality of Availability: What 99.9% Actually Means',
    points: [
      'Three Nines (99.9%): Allows almost 9 hours of unplanned customer-facing downtime every year',
      'Four Nines (99.99%): Drastically cuts annual downtime to under 53 minutes across all services',
      'Multi-AZ Multiplier: Two independent 99.9% zones achieve 99.9999% combined availability'
    ],
    domainIndex: 0,
    lines: [
      {
        say: "In the cloud, uptime is measured in 'nines'. Three nines—99.9%—sounds impressive to beginners, but it actually allows nearly nine hours of unplanned downtime every year! Four nines—99.99%—cuts that down to just 52 minutes. And the secret to achieving high availability isn't buying a more expensive machine; it's redundancy across independent Availability Zones. If two data centers are each up 99.9% of the time, the chance of both failing at the same millisecond is one in a million. That simple concept powers every multi-AZ architecture you will see today."
      }
    ]
  },
  {
    id: 'theory-blast-radius',
    kind: 'theory',
    eyebrow: 'Core Cloud Foundations · 4 of 5',
    banner: 'Blast Radius is how much of your business breaks when a single component catches fire',
    tables: [blastRadiusTable, recoveryTable],
    title: 'Containing the Blast Radius: RTO & RPO',
    points: [
      'Watertight bulkheads: if one compartment floods, the ship still stays afloat',
      'RTO (Recovery Time Objective): How long your business can tolerate being down',
      'RPO (Recovery Point Objective): How much transactional data you can afford to lose'
    ],
    domainIndex: 0,
    lines: [
      {
        say: "Think of blast radius like watertight bulkheads on a ship or submarine: if one compartment floods, the bulkheads seal off the water so the ship doesn't sink. In cloud architecture, if one zone or microservice catches fire, we contain the blast radius so the rest of the application keeps serving customers. Two key business metrics govern recovery: RTO—Recovery Time Objective—is how long your business can tolerate being down, and RPO—Recovery Point Objective—is how much data you can afford to lose. Our goal today is to take RTO from hours down to seconds."
      }
    ]
  },
  {
    id: 'theory-reading',
    kind: 'theory',
    eyebrow: 'Core Cloud Foundations · 5 of 5',
    banner: 'Identical real-time traffic, identical disaster failure, dramatically different outcomes',
    tables: [readingTable],
    title: 'Reading the Live Simulation: Left vs Right',
    points: [
      'Left Side (Anti-Pattern): Monolithic servers, flat subnets, manual recovery, SPOF tags',
      'Right Side (Well-Architected): CloudFront CDN, ALB, multi-AZ auto-scaling, Aurora clusters',
      'Dynamic Packet Flight: Real-time animated data streams show healthy flow vs failure drops'
    ],
    domainIndex: 0,
    lines: [
      {
        say: "Every comparison screen in this presentation runs a real-time live simulation. The left column shows the naive anti-pattern: single instances, flat networks, manual steps, labeled with red SPOF tags. The right column shows the AWS Well-Architected build with load balancers, multi-AZ clusters, and auto-scaling. Watch the animated packet streams: when we inject flash traffic and hardware failures, watch the naive cards violently shake and collapse, while the AWS cluster automatically heals and maintains uninterrupted flow!"
      }
    ]
  }
];

export const closingSlide: DeckSlide = {
  id: 'closing',
  kind: 'closing',
  eyebrow: 'Executive Scorecard',
  banner: 'From fragile single points of failure to resilient, self-healing cloud ecosystems',
  tables: [scorecardTable],
  title: 'Executive Conclusion & Architectural Scorecard',
  points: [
    'Availability increased from 98.5% to 99.99% across all 15 operational domains',
    'Monthly cloud spend reduced from $4,450 to $1,820 (59% FinOps cost reduction)',
    'Three critical high-risk issues eliminated with automated sub-30-second recovery'
  ],
  domainIndex: 14,
  lines: [
    {
      say: "Looking at the final scorecard across all fifteen domains: availability moves from 98.5% to 99.99%. Monthly cloud spend drops from 4,450 dollars to 1,820 dollars—a massive 59% FinOps savings. Three critical enterprise risk flags drop to zero, and disaster recovery time plummets from 48 hours to under thirty seconds."
    },
    {
      say: "That is the ultimate power of the AWS Well-Architected Framework. You identify the failures you cannot accept, name the pillar it touches, and build the smallest, most resilient design that survives it. Thank you so much for your time, and Devarsh and I are excited to take your questions!"
    }
  ]
};
