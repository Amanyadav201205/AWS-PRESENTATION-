import { DeckSlide } from './deckTypes';
import { ENTER_DECK, RECOVER, SHOW_BOTH } from '../talkTrackCues';

export const titleSlide: DeckSlide = {
  id: 'title',
  kind: 'title',
  eyebrow: 'AWS Well-Architected Framework',
  title: 'Naive builds versus resilient builds',
  points: ['Devarsh Patel and Aman Kumar', 'Fifteen modules, each with theory and a side-by-side simulation'],
  domainIndex: 0,
  lines: [
    {
      say: 'Good morning. Anyone can launch a server in five minutes. Keeping a platform alive through traffic spikes and failures is architecture, and that is what we are here to show. We are two presenters, Devarsh and Aman, and we will take you through fifteen modules of the AWS Well-Architected Framework in about twenty minutes.',
      cues: [ENTER_DECK, SHOW_BOTH, RECOVER]
    },
    {
      say: 'Each module follows the same pattern. First a theory slide that names the principle behind the design. Then a comparison slide, with the naive build on the left and the Well-Architected build on the right, on one screen, under the same traffic and the same failure.'
    }
  ]
};

export const agendaSlide: DeckSlide = {
  id: 'agenda',
  kind: 'agenda',
  eyebrow: 'Agenda',
  title: 'Core theory, then fifteen modules',
  points: [
    'Core theory: pillars, single points of failure, availability math, blast radius',
    'Modules 1 to 15: storage through disaster recovery, then the scorecard',
    'Every comparison uses the same traffic and the same failure'
  ],
  domainIndex: 0,
  lines: [
    {
      say: 'Here is the route. We start with the core theory: the six pillars, single points of failure, the arithmetic of availability and blast radius. Then come the fifteen modules, from storage and compute through networking, security, monitoring, automation, caching, decoupling, serverless, data and disaster recovery. We finish with the scorecard.'
    }
  ]
};

export const theorySlides: DeckSlide[] = [
  {
    id: 'theory-pillars',
    kind: 'theory',
    eyebrow: 'Core theory · 1 of 5',
    title: 'Six pillars, one design',
    points: [
      'Operational excellence: run and improve systems through code',
      'Security: protect data, systems and assets in depth',
      'Reliability: recover from failure and meet demand',
      'Performance efficiency: use resources that match demand',
      'Cost optimization: pay only for what delivers value',
      'Sustainability: use the least energy the workload needs'
    ],
    domainIndex: 0,
    lines: [
      {
        say: 'The Framework rests on six pillars: operational excellence, security, reliability, performance efficiency, cost optimization and sustainability. Every module you will see maps to at least one of them. A design that wins on one pillar and loses on another is a trade-off, and we will name that trade-off every time.'
      }
    ]
  },
  {
    id: 'theory-spof',
    kind: 'theory',
    eyebrow: 'Core theory · 2 of 5',
    title: 'Single point of failure',
    points: [
      'A single point of failure is any part whose loss stops the workload',
      'Test: if this part disappears now, does a customer notice?',
      'In a serial chain, availabilities multiply and the total falls'
    ],
    formula: 'A_{\\text{chain}} = \\prod_{i=1}^{M} A_i \\quad \\Rightarrow \\quad 0.99^5 \\approx 0.951',
    formulaText: 'Availability of a serial chain is the product of each part. Five parts at 99 percent give about 95.1 percent.',
    domainIndex: 0,
    lines: [
      {
        say: 'A single point of failure is any component whose loss stops the whole workload. The test is simple: if this part disappears right now, does a customer notice? In a serial chain, availabilities multiply. Five services at 99 percent each give about 95 percent overall, which means roughly eighteen days of downtime a year. Chains are where availability goes to die.'
      }
    ]
  },
  {
    id: 'theory-nines',
    kind: 'theory',
    eyebrow: 'Core theory · 3 of 5',
    title: 'The arithmetic of availability',
    points: [
      '99.9% allows about 8 hours 45 minutes of downtime a year',
      '99.99% allows about 53 minutes; 99.999% about 5 minutes',
      'Two independent zones at 99.9% each reach 99.9999% together'
    ],
    formula: 'A_{\\text{parallel}} = 1 - \\prod_{i=1}^{N} (1 - A_i) \\quad \\Rightarrow \\quad 1 - (0.001)^2 = 0.999999',
    formulaText: 'Parallel availability is one minus the product of each part failing. Two zones at 99.9 percent give 99.9999 percent.',
    domainIndex: 0,
    lines: [
      {
        say: 'Availability is measured in nines. Ninety-nine point nine percent allows about eight hours and forty-five minutes of downtime a year. Ninety-nine point nine nine allows about fifty-three minutes. For redundant parts the rule flips. If two independent zones are each up 99.9 percent of the time, both are down together only one time in a million, so the pair reaches 99.9999 percent. That formula drives every redundancy decision in this talk.'
      }
    ]
  },
  {
    id: 'theory-blast-radius',
    kind: 'theory',
    eyebrow: 'Core theory · 4 of 5',
    title: 'Blast radius, RTO and RPO',
    points: [
      'Blast radius: how much breaks when one failure domain breaks',
      'Failure domains: instance, availability zone, region',
      'RTO: how long the business can be down',
      'RPO: how much data the business can lose'
    ],
    domainIndex: 0,
    lines: [
      {
        say: 'Blast radius is how much breaks when one thing breaks. We cut the system into failure domains: an instance, an availability zone, a region. A well-designed system loses one domain and keeps serving from the rest. Two numbers describe recovery. RTO, the recovery time objective, is how long the business can be down. RPO, the recovery point objective, is how much data it can lose. Lower values cost more, and that trade-off runs through the whole talk.'
      }
    ]
  },
  {
    id: 'theory-reading',
    kind: 'theory',
    eyebrow: 'Core theory · 5 of 5',
    title: 'How to read each comparison',
    points: [
      'Left: the naive build, single servers and flat networks',
      'Right: the Well-Architected build, with redundancy and isolation',
      'Lanes show packets: green is healthy, red is a failing path',
      'Same traffic and same failure on both sides'
    ],
    domainIndex: 0,
    lines: [
      {
        say: 'Every comparison screen has the same layout. The left column is the naive build: single servers, flat networks, manual steps. The right column is the Well-Architected build. The lanes between boxes are packets. Green means healthy traffic and red means a failing path. We run the same surge and the same failure through both, so the difference you see is the architecture, not the luck of the moment.'
      }
    ]
  }
];

export const closingSlide: DeckSlide = {
  id: 'closing',
  kind: 'closing',
  eyebrow: 'Scorecard',
  title: 'What changed across the fifteen domains',
  points: [
    'Availability: 98.5% to 99.99%',
    'Monthly cloud spend: $4,450 to $1,820 (59.1% lower)',
    'High-risk issues: 3 to 0',
    'Recovery time: hours to under 30 seconds'
  ],
  domainIndex: 14,
  lines: [
    {
      say: 'To close the scorecard. Availability moves from 98.5 to 99.99 percent. Monthly cloud spend moves from four thousand four hundred and fifty dollars to eighteen hundred and twenty dollars, a reduction of 59 percent. Three high-risk issues go to zero, and recovery time drops from hours to under thirty seconds.'
    },
    {
      say: 'That is the Well-Architected argument. Start from the failure you cannot accept, name the pillar it touches, then build the smallest design that survives it. Thank you. We will take questions now.'
    }
  ]
};
