import { DeckSlide } from './deckTypes';
import { agendaTable, blastRadiusTable, keyNumbersTable, ninesTable, pillarTable, readingTable, recoveryTable, redundancyTable, scorecardTable, spofTable } from './theoryTables';
import { ENTER_DECK, RECOVER, SHOW_BOTH } from '../talkTrackCues';

export const titleSlide: DeckSlide = {
  id: 'title',
  kind: 'title',
  eyebrow: 'AWS Well-Architected Framework',
  banner: 'Two presenters · fifteen modules · about 21 minutes',
  tables: [keyNumbersTable],
  title: 'Naive builds versus resilient builds',
  points: [],
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
  banner: 'Every comparison uses the same traffic and the same failure',
  tables: [agendaTable],
  title: 'Core theory, then fifteen modules',
  points: [],
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
    banner: 'Every module maps to at least one of these pillars',
    tables: [pillarTable],
    title: 'Six pillars, one design',
    points: [],
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
    banner: 'Test: if this part disappears now, does a customer notice?',
    tables: [spofTable],
    title: 'Single point of failure',
    points: [],
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
    banner: 'Two independent zones at 99.9% each are down together once in a million',
    tables: [ninesTable, redundancyTable],
    title: 'The arithmetic of availability',
    points: [],
    domainIndex: 0,
    lines: [
      {
        say: 'Availability is measured in nines. Ninety-nine point nine percent allows about eight hours and forty-five minutes of downtime a year. Ninety-nine point nine nine allows about fifty-three minutes. For redundant parts the rule flips. If two independent zones are each up 99.9 percent of the time, both are down together only one time in a million, so the pair reaches 99.9999 percent. That arithmetic drives every redundancy decision in this talk.'
      }
    ]
  },
  {
    id: 'theory-blast-radius',
    kind: 'theory',
    eyebrow: 'Core theory · 4 of 5',
    banner: 'Blast radius is how much breaks when one failure domain breaks',
    tables: [blastRadiusTable, recoveryTable],
    title: 'Blast radius, RTO and RPO',
    points: [],
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
    banner: 'Left and right run the same traffic and the same failure',
    tables: [readingTable],
    title: 'How to read each comparison',
    points: [],
    domainIndex: 0,
    lines: [
      {
        say: 'Every comparison screen is the same live simulation. The left column is the naive build: single servers, flat networks, manual steps, with SPOF tags on the single points. The right column is the Well-Architected build, with HA tags and availability zones. Packets move down the connectors. At peak load and during the failure, red cards shake on the naive side and green cards pulse on the Well-Architected side, and the measures underneath show the result.'
      }
    ]
  }
];

export const closingSlide: DeckSlide = {
  id: 'closing',
  kind: 'closing',
  eyebrow: 'Scorecard',
  banner: 'Start from the failure you cannot accept, then build the smallest design that survives it',
  tables: [scorecardTable],
  title: 'What changed across the fifteen domains',
  points: [],
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
