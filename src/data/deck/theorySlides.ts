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
    'Engineered for college undergrads and real-world cloud practitioners',
    'From fragile single-point-of-failure servers to self-healing multi-AZ clusters',
    'Interactive live traffic simulation with real-time disaster injection'
  ],
  domainIndex: 0,
  lines: [
    {
      say: "Welcome everyone! Launching a single cloud server takes five minutes, but keeping it alive under fifty thousand shoppers is true engineering. We are Devarsh and Aman, breaking down fifteen mission-critical modules of the AWS Well-Architected Framework.",
      cues: [ENTER_DECK, SHOW_BOTH, RECOVER]
    },
    {
      say: "Our targets today are ambitious — boosting availability from ninety-eight point five percent to four nines, while cutting cloud spend by fifty-nine percent. Every module pairs real customer requirements with live interactive traffic and disaster injection."
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
    'Part 1 — Foundational Cloud Laws (Pillars, SPOF, Availability Nines, Blast Radius)',
    'Part 2 — Core Infrastructure (Compute, Storage, Database, 3-Tier Networking)',
    'Part 3 — Enterprise Cloud Operations (Security, Automation, Caching, Decoupling, Serverless, Disaster Recovery)'
  ],
  domainIndex: 0,
  lines: [
    {
      say: "Here is our flight plan. First we explore foundational cloud laws, covering the six pillars, single points of failure, availability math, and blast radius. Next we dive into storage, Graviton compute, Aurora databases, and isolated subnets. Finally we tackle zero-trust security, proactive observability, message decoupling, serverless compute, and multi-region disaster recovery."
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
      'Operational Excellence — Automate processes and continually improve',
      'Security — Protect data, identities, and systems with defense-in-depth',
      'Reliability — Recover dynamically from failures and mitigate disruptions',
      'Performance Efficiency — Right-size compute and scale with demand',
      'Cost Optimization — Avoid unnecessary cloud spend with FinOps',
      'Sustainability — Minimize carbon footprint with efficient architectures'
    ],
    domainIndex: 0,
    lines: [
      {
        say: "If a customer demands the fastest app in the world and you spin up a hundred massive servers without budget guardrails, you instantly fail cost optimization. Every AWS decision balances across the six pillars on screen — Operational Excellence, Security, Reliability, Performance, Cost, and Sustainability. Great architecture is about deliberate trade-offs to meet the business mission."
      }
    ]
  },
  {
    id: 'theory-spof',
    kind: 'theory',
    eyebrow: 'Core Cloud Foundations · 2 of 5',
    banner: 'Golden Test — If this single component dies right now, does your entire business vanish?',
    tables: [spofTable],
    title: 'Single Point of Failure — The Killer of Apps',
    points: [
      'The Serial Chain Hazard — Five 99% services in a single line yield only 95% total combined uptime',
      'The Compounding Downtime — 95% availability means your company suffers nearly 18 days of unplanned outages per year',
      'Decoupling Remedy — Eliminate single points of failure by decoupling dependencies and introducing automated redundancy'
    ],
    domainIndex: 0,
    lines: [
      {
        say: "A Single Point of Failure is just like holiday string lights where one broken bulb leaves the whole house dark. In cloud systems, chaining five services with ninety-nine percent uptime drops your total availability down to ninety-five percent, equaling eighteen days of downtime yearly. Our remedy is decoupling dependencies with multi-zone redundancy."
      }
    ]
  },
  {
    id: 'theory-nines',
    kind: 'theory',
    eyebrow: 'Core Cloud Foundations · 3 of 5',
    banner: 'Two independent data centers at 99.9% uptime fail together only once in a million',
    tables: [ninesTable, redundancyTable],
    title: 'The Reality of Availability — What 99.9% Actually Means',
    points: [
      'Three Nines (99.9%) — Allows almost 9 hours of unplanned customer-facing downtime every year',
      'Four Nines (99.99%) — Drastically cuts annual downtime to under 53 minutes across all services',
      'Multi-AZ Multiplier — Two independent 99.9% zones achieve 99.9999% combined availability'
    ],
    domainIndex: 0,
    lines: [
      {
        say: "Three nines sounds great, but ninety-nine point nine percent uptime still allows nearly nine hours of unexpected downtime yearly, costing millions. Four nines cuts annual downtime to under fifty-three minutes. We achieve this by spreading redundant nodes across independent Availability Zones where two zones fail together only once in a million attempts."
      }
    ]
  },
  {
    id: 'theory-blast-radius',
    kind: 'theory',
    eyebrow: 'Core Cloud Foundations · 4 of 5',
    banner: 'Blast Radius is how much of your business breaks when a single component catches fire',
    tables: [blastRadiusTable, recoveryTable],
    title: 'Containing the Blast Radius — RTO and RPO',
    points: [
      'Watertight bulkheads — If one compartment floods, the ship still stays afloat',
      'Recovery Time Objective (RTO) — How long your business can tolerate being down',
      'Recovery Point Objective (RPO) — How much transactional data you can afford to lose'
    ],
    domainIndex: 0,
    lines: [
      {
        say: "Think of blast radius like watertight bulkheads on a ship, where one flooded compartment will not sink the vessel. If a component fails, we isolate it so the application stays fast. We define recovery time objective for downtime, and recovery point objective for data loss, reducing recovery from hours down to seconds."
      }
    ]
  },
  {
    id: 'theory-reading',
    kind: 'theory',
    eyebrow: 'Core Cloud Foundations · 5 of 5',
    banner: 'Identical real-time traffic, identical disaster failure, dramatically different outcomes',
    tables: [readingTable],
    title: 'Reading the Live Simulation — Left vs Right',
    points: [
      'Left Side (Anti-Pattern) — Monolithic servers, flat subnets, manual recovery, SPOF tags',
      'Right Side (Well-Architected) — CloudFront CDN, ALB, multi-AZ auto-scaling, Aurora clusters',
      'Dynamic Packet Flight — Real-time animated data streams show healthy flow vs failure drops'
    ],
    domainIndex: 0,
    lines: [
      {
        say: "Here is how to follow every simulation today. The left side shows the fragile anti-pattern with single instances and bright red single point of failure tags. The right side shows AWS Well-Architected with load balancers, multi-zone clusters, and green high-availability tags. Watch the left collapse under disaster while the right heals itself automatically."
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
  title: 'Executive Conclusion and Architectural Scorecard',
  points: [
    'Availability increased from 98.5% to 99.99% across all 15 operational domains',
    'Monthly cloud spend reduced from $4,450 to $1,820 (59% FinOps cost reduction)',
    'Three critical high-risk issues eliminated with automated sub-30-second recovery'
  ],
  domainIndex: 14,
  lines: [
    {
      say: "Across all fifteen domains, our executive scorecard proves system availability jumps from ninety-eight point five percent to ninety-nine point nine nine percent. Monthly cloud spend drops from forty-four hundred dollars to eighteen hundred dollars, saving fifty-nine percent with sub-thirty-second automated recovery."
    },
    {
      say: "That is the core philosophy of AWS Well-Architected. Start from the failure your business cannot afford to accept, identify its pillar, and build the most resilient design that survives it. Thank you so much, and Devarsh and Aman are excited to open the floor for questions."
    }
  ]
};
