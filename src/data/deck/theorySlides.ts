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
      say: "Welcome everyone! Launching a cloud server takes five minutes, but keeping it alive under fifty thousand concurrent shoppers is true cloud engineering. We are your presenters, Devarsh and Aman, covering fifteen mission-critical modules of the AWS Well-Architected Framework.",
      cues: [ENTER_DECK, SHOW_BOTH, RECOVER]
    },
    {
      say: "Our scorecard targets today: elevate system availability from 98.5% to 99.99%, while cutting monthly cloud spend by 59%—from $4,450 down to $1,820. Every module pairs real-world customer requirements with live interactive traffic and disaster injection!"
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
      say: "Here is our twenty-minute flight plan: Phase 1 covers core cloud laws—pillars, SPOF, availability mathematics, and blast radius. Phase 2 dives into storage immutability, Graviton compute, Aurora databases, and 3-tier VPCs. Phase 3 tackles zero-trust security, observability, decoupling, serverless, and multi-region recovery."
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
        say: "If a customer asks for the world's fastest app and you launch a hundred giant servers without guardrails, you fail Cost Optimization. Good cloud architecture balances all six pillars on screen—Operational Excellence, Security, Reliability, Performance, Cost, and Sustainability—making deliberate trade-offs for business goals."
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
        say: "A Single Point of Failure is like old Christmas lights: one dead bulb darkens the entire string. In software, chaining five 99% services together drops combined availability to 95.1%—nearly 18 days of downtime per year! Our golden remedy: decouple dependencies with automated multi-AZ redundancy."
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
        say: "Three nines—99.9% uptime—sounds great, but permits almost nine hours of downtime annually, costing millions. Four nines—99.99%—slashes downtime to under 53 minutes. We don't buy bigger machines; we engineer redundancy across independent Availability Zones. Two 99.9% zones fail together only once in a million!"
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
        say: "Blast radius is like watertight bulkheads: if one compartment floods, the ship stays afloat. When designing for customers, we define two metrics: RTO—how long you can tolerate being down, and RPO—how much data you can afford to lose. We reduce RTO from hours to seconds."
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
        say: "On every simulation stage: the left column shows the fragile anti-pattern with red SPOF tags. The right column shows the AWS Well-Architected build with load balancers and green HA tags. When we inject disasters, watch the left side collapse while AWS auto-heals seamlessly!"
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
      say: "Our final executive scorecard across all fifteen domains: availability jumps from 98.5% to 99.99%. Monthly cloud spend drops from $4,450 down to $1,820—saving 59% in cloud costs. Recovery time plummets from hours to under thirty seconds, eliminating all high-risk vulnerabilities."
    },
    {
      say: "That is the true value of the AWS Well-Architected Framework: design backward from failure, honor the six pillars, and build self-healing systems. Thank you so much, and Devarsh and Aman are excited to open the floor for your questions!"
    }
  ]
};
