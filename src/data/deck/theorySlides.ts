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
      say: "Welcome everyone! Anyone can launch a cloud server in five minutes following a YouTube tutorial. But keeping a real platform alive when fifty thousand eager customers hit your checkout simultaneously is true cloud engineering. We are your presenters, Devarsh and Aman, and today we're taking you through fifteen mission-critical modules of the AWS Well-Architected Framework.",
      cues: [ENTER_DECK, SHOW_BOTH, RECOVER]
    },
    {
      say: "Look at the four scorecard targets on screen: across fifteen live domains and all six core pillars, our mission today is to elevate system availability from a fragile 98.5% up to a certified 99.99%, while cutting monthly cloud spend by 59%—from $4,450 down to $1,820. Every module pairs real-world customer requirements with live interactive traffic and disaster injection!"
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
      say: "Here is our twenty-minute flight plan on screen. Phase 1 covers the fundamental cloud laws: the six pillars, the myth of the single server, the mathematics of availability, and blast radius. Phase 2 dives straight into core infrastructure: storage immutability, Graviton compute, Aurora database clusters, and 3-tier isolated VPCs. Then Phase 3 tackles advanced enterprise modernization: zero-trust security, synthetic canaries, SQS decoupling, serverless Lambda, and multi-region disaster recovery!"
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
        say: "Imagine a customer comes to you saying: 'Build me the fastest app in the world!' If you spin up a hundred massive servers with zero budget guardrails, you just failed the Cost Optimization pillar. As cloud engineers, we never make arbitrary guesses. Everything in AWS balances across these six pillars on screen: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, and Sustainability. Good architecture is knowing how to make deliberate trade-offs to satisfy the customer's exact business goals."
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
        say: "What is a Single Point of Failure? Think of old-school Christmas tree lights: if one tiny bulb blows out, the entire string goes completely dark. In software, look at Rule 1 on the left: if your customer journey requires five independent services in a serial chain, each with 99% uptime, your combined availability drops to 95.1%! Look at the table on the right: that means nearly 18 full days of customer downtime every year! Chains are where availability goes to die. Rule 3 is our remedy: decouple dependencies and engineer automated multi-AZ redundancy."
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
        say: "When a customer asks for three nines—99.9% uptime—it sounds like an A+ grade. But look at the table on screen: 99.9% actually permits almost nine full hours of unplanned outage every year! If an e-commerce store loses $100,000 an hour, that's nearly a million dollars gone. Look at Rule 2: Four nines—99.99%—slashes annual downtime to under 53 minutes. And the secret to getting there isn't buying a more expensive machine; it's Rule 3: redundancy across independent Availability Zones. Two 99.9% zones fail together only once in a million attempts!"
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
        say: "Think of blast radius like watertight bulkheads on a ship: if one compartment floods, the bulkheads seal off the water so the ship stays afloat. In cloud systems, if one microservice catches fire, we contain the blast radius so customers can still use the rest of the app. When you interview a customer, you ask two golden questions: What is your RTO—Recovery Time Objective—how long can you tolerate being down? And what is your RPO—Recovery Point Objective—how much transactional data can you afford to lose? Our goal across all fifteen modules is to take RTO from hours down to seconds."
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
        say: "Here is how to read every live simulation stage today. The left column shows the naive anti-pattern: single instances, flat networks, labeled with bright red SPOF tags. The right column shows the AWS Well-Architected build with load balancers, multi-AZ clusters, and green HA tags. Notice the animated packet streams: green dots mean healthy data flow. When we inject flash traffic and regional disasters, watch the left cards violently shake and collapse into red failure, while the AWS cluster heals automatically and maintains uninterrupted customer flow!"
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
      say: "Looking at our final executive scorecard on screen across all fifteen domains: system availability jumps from 98.5% up to 99.99%. Monthly cloud spend drops from $4,450 down to $1,820—delivering a massive 59% FinOps savings. Recovery time plummets from 4-8 hours down to under thirty seconds, and three critical high-risk enterprise issues drop to zero!"
    },
    {
      say: "That is the ultimate value we deliver to customers through the AWS Well-Architected Framework: start from the failure your business cannot afford to accept, name the pillar it touches, and build the smallest, most resilient design that survives it. Thank you so much for your time, and Aman and I are excited to open the floor for your questions!"
    }
  ]
};
