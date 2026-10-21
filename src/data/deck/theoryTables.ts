import { allDomains, allPillars } from '../index';
import type { DeckTable } from './deckTypes';

const SECONDS_PER_YEAR = 365 * 24 * 60 * 60;
const SHORT_PILLAR_NAMES: Record<string, string> = {
  'Operational Excellence': 'Ops Excellence',
  Security: 'Security',
  Reliability: 'Reliability',
  'Performance Efficiency': 'Performance',
  'Cost Optimization': 'Cost',
  Sustainability: 'Sustainability'
};

/** Downtime per year for an availability in percent, in the unit a person would say aloud. */
export const formatYearlyDowntime = (availabilityPercent: number): string => {
  const seconds = (1 - availabilityPercent / 100) * SECONDS_PER_YEAR;
  if (seconds < 1) return `${seconds.toFixed(2)} s`;
  if (seconds < 60) return `${seconds.toFixed(1)} s`;
  if (seconds < 3600) return `${(seconds / 60).toFixed(1)} min`;
  if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} h`;
  return `${(seconds / 86400).toFixed(1)} days`;
};

/** The first percentage found in a label such as "99.99% (High Availability)". */
export const extractPercent = (label: string): string => {
  const match = label.match(/\d+(\.\d+)?%/);
  return match ? match[0] : label;
};

export const pillarTable: DeckTable = {
  headers: ['Pillar', 'What it asks of the design', 'Modules where it appears'],
  rows: allPillars.map((pillar) => {
    const modules = allDomains
      .map((domain, index) => (domain.pillars.includes(pillar.name) ? index + 1 : null))
      .filter((value): value is number => value !== null);
    return [
      pillar.name,
      pillar.description.split('.')[0] + '.',
      modules.join(', ')
    ];
  })
};

export const spofTable: DeckTable = {
  headers: ['Parts in a serial chain', 'Each part at 99%: combined availability', 'Downtime per year'],
  rows: [1, 2, 3, 5].map((count) => {
    const combined = Math.pow(0.99, count) * 100;
    return [String(count), `${combined.toFixed(2)}%`, formatYearlyDowntime(combined)];
  })
};

export const ninesTable: DeckTable = {
  headers: ['Availability', 'Downtime per year', 'Downtime per month'],
  rows: [99.9, 99.99, 99.999].map((value) => {
    const monthlySeconds = (1 - value / 100) * (SECONDS_PER_YEAR / 12);
    const monthly = monthlySeconds < 60 ? `${monthlySeconds.toFixed(0)} s` : `${(monthlySeconds / 60).toFixed(1)} min`;
    return [`${value}%`, formatYearlyDowntime(value), monthly];
  })
};

export const redundancyTable: DeckTable = {
  headers: ['Setup (each zone 99.9%)', 'Availability together', 'Downtime per year'],
  rows: [1, 2, 3].map((zones) => {
    const together = (1 - Math.pow(0.001, zones)) * 100;
    const label = zones === 1 ? '1 zone (no redundancy)' : `${zones} independent zones`;
    return [label, `${together.toFixed(zones === 3 ? 7 : 4)}%`, formatYearlyDowntime(together)];
  })
};

export const blastRadiusTable: DeckTable = {
  headers: ['Failure domain', 'Example', 'What breaks', 'What keeps serving'],
  rows: [
    ['Instance', 'One application server', 'Requests on that server', 'The rest of the fleet, behind the load balancer'],
    ['Availability zone', 'Zone a loses power', 'Every resource placed only in zone a', 'Zones b and c, if the design spans three zones'],
    ['Region', 'us-east-1 is unavailable', 'Everything placed only in the region', 'A standby region, if one is kept warm']
  ]
};

export const recoveryTable: DeckTable = {
  headers: ['Term', 'Question it answers', 'Example from this talk'],
  rows: [
    ['RTO: recovery time objective', 'How long can the business be down?', 'Naive 3 to 5 days; active-active under 45 seconds'],
    ['RPO: recovery point objective', 'How much data can the business lose?', 'Naive up to 2 weeks of commits; Aurora Global under 1 second']
  ]
};

export const readingTable: DeckTable = {
  headers: ['What you see', 'What it means'],
  rows: [
    ['Left column: naive build', 'Single servers, flat networks, manual steps'],
    ['Right column: Well-Architected build', 'Redundancy across zones, isolation, automation'],
    ['Red lane', 'A packet on a failing or blocked path'],
    ['Green lane', 'Healthy traffic on the resilient path'],
    ['SPOF tag', 'A single point of failure in the naive design'],
    ['HA tag', 'A component built for high availability']
  ]
};

export const agendaTable: DeckTable = {
  headers: ['#', 'Module', 'Pillars', 'Availability: naive to Well-Architected'],
  rows: allDomains.map((domain, index) => [
    String(index + 1),
    domain.title,
    domain.pillars.map((pillar) => SHORT_PILLAR_NAMES[pillar] ?? pillar).join(', '),
    `${extractPercent(domain.naive.availabilitySLA)} to ${extractPercent(domain.wellArch.availabilitySLA)}`
  ])
};

export const keyNumbersTable: DeckTable = {
  headers: ['Measure', 'Naive build', 'Well-Architected build'],
  rows: [
    ['Availability', '98.5%', '99.99%'],
    ['Monthly cloud spend', '$4,450', '$1,820'],
    ['High-risk issues', '3', '0'],
    ['Recovery time', '4 to 8 hours', 'under 30 seconds']
  ]
};

export const scorecardTable: DeckTable = {
  headers: ['Measure', 'Naive build', 'Well-Architected build', 'Change'],
  rows: [
    ['Availability', '98.5%', '99.99%', '+1.49 points'],
    ['Monthly cloud spend', '$4,450', '$1,820', '59.1% lower'],
    ['Annual cloud spend', '$53,400', '$21,840', '$31,560 saved a year'],
    ['High-risk issues', '3', '0', 'All remediated'],
    ['Recovery time', 'hours', 'under 30 seconds', 'Hours to seconds']
  ]
};
