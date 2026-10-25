import { allDomains } from '../index';
import { FAILURE, LOAD_NORMAL, LOAD_PEAK, PACKETS_ON, RECOVER, SHOW_BOTH } from '../talkTrackCues';
import { DeckMetric, DeckSlide, DeckTable, GammaCard } from './deckTypes';
import { moduleScripts } from './moduleScripts';
import { moduleTables } from './moduleTables';
import { extractPercent } from './theoryTables';
import { agendaSlide, closingSlide, theorySlides, titleSlide } from './theorySlides';

const MODULE_COUNT = allDomains.length;

const modulePrinciples: string[] = [
  'Decouple every layer across Multi-AZ zones to eliminate single points of failure',
  'Write-Once-Read-Many (WORM) immutability & automated cold lifecycle tiering',
  'Stateless horizontal elasticity with Graviton ARM64 beats giant monoliths',
  'Multi-AZ distributed quorum storage with automated sub-30-second failover',
  'Defense-in-depth: isolated private subnets with zero public database exposure',
  'Centralized hub-and-spoke routing with automated redundant BGP failover',
  'Zero hardcoded secrets: temporary IAM role tokens and automated 30-day password rotation',
  'Automated synthetic canaries and EventBridge self-healing before users notice outages',
  'Infrastructure as Code (IaC) with automated compliance drift remediation',
  'Multi-layer caching: absorb 96% of reads at CloudFront edge & ElastiCache in RAM',
  'Asynchronous message queue buffering prevents cascading synchronous checkout crashes',
  'Event-driven serverless compute: zero idle cost, zero patching, and instant concurrency',
  'Decoupled event streaming & columnar Parquet data lakes without production DB strain',
  'Multi-region active-active synchronization with Route 53 DNS failover under 60 seconds',
  'Continuous Well-Architected governance across all 6 Pillars delivers 99.99% availability'
];

const componentTable = (index: number): DeckTable => ({
  headers: ['Component', 'Naive build', 'Well-Architected build'],
  rows: moduleTables[index]
});

const measuresTable = (index: number): DeckTable => {
  const { naive, wellArch } = allDomains[index];
  return {
    headers: ['Metric', 'Naive Anti-Pattern', 'Well-Architected Build', 'Benefit / Delta'],
    rows: [
      ['Availability SLA', extractPercent(naive.availabilitySLA), extractPercent(wellArch.availabilitySLA), '+1.49% Uptime (99.99%)'],
      ['Recovery Time (RTO)', naive.rto, wellArch.rto, 'Sub-30s Auto-Heal'],
      ['Monthly Cloud Spend', `$${naive.monthlyCostEst.toLocaleString('en-US')}`, `$${wellArch.monthlyCostEst.toLocaleString('en-US')}`, `${Math.round((1 - wellArch.monthlyCostEst / naive.monthlyCostEst) * 100)}% Cost Reduction`]
    ]
  };
};

const shortAvailability = (val: string): string => {
  const match = val.match(/\d+(\.\d+)?%/);
  if (match) return match[0];
  if (val.toLowerCase().includes('error')) return 'Unreliable';
  if (val.toLowerCase().includes('security')) return 'Breached';
  return val.split('(')[0].trim();
};

const shortRTO = (val: string): string => {
  if (val.includes('< 1 Second') || val.includes('< 1s')) return '< 1s';
  if (val.includes('< 5 Seconds') || val.includes('< 5s')) return '< 5s';
  if (val.includes('< 30 Seconds') || val.includes('< 30s')) return '< 30s';
  if (val.includes('< 45 Seconds') || val.includes('< 45s')) return '< 45s';
  if (val.includes('< 60 Seconds') || val.includes('< 60s')) return '< 60s';
  if (val.includes('< 15 Minutes') || val.includes('< 15m')) return '< 15m';
  if (val.includes('15 Minutes')) return '15m';
  if (val.includes('45 Minutes')) return '45m';
  if (val.includes('2 - 4 Hours')) return '2-4h';
  if (val.includes('4 - 6 Hours')) return '4-6h';
  if (val.includes('4 - 8 Hours') || val.includes('4-8 Hours')) return '4-8h';
  if (val.includes('48 Hours') || val.includes('48+ Hours')) return '48h';
  if (val.includes('3 Hours')) return '3h';
  if (val.includes('4 Hours')) return '4h';
  if (val.includes('Manual Incident Triage')) return 'Hours (Triage)';
  if (val.includes('Manual Reconciliation')) return 'Hours (Manual)';
  if (val.includes('Manual Python Script Rerun') || val.includes('Python Script')) return 'Hours (Rerun)';
  if (val.includes('Immune') || val.includes('N/A')) return '0s (Immune)';
  if (val.includes('Zero')) return 'Zero Loss';
  if (val.includes('Instant')) return 'Instant';
  if (val.includes('Days')) return 'Days';
  return val.split('(')[0].trim();
};

const buildModuleSlides = (index: number): DeckSlide[] => {
  const domain = allDomains[index];
  const script = moduleScripts[index];
  const moduleLabel = `Module ${String(index + 1).padStart(2, '0')} of ${MODULE_COUNT}`;
  const principle = modulePrinciples[index] ?? 'AWS Well-Architected architectural best practice';

  const cards: GammaCard[] = [
    {
      tag: '🎯 Real-World Context',
      title: 'The Challenge',
      desc: script.points[0],
      variant: 'scenario'
    },
    {
      tag: '⚠️ Naive Anti-Pattern',
      title: 'The Single Point of Failure',
      desc: script.points[1],
      variant: 'spof'
    },
    {
      tag: '🚀 Well-Architected',
      title: 'The Resilient Solution',
      desc: script.points[2],
      variant: 'waf'
    }
  ];

  const metrics: DeckMetric[] = [
    {
      label: 'Availability',
      naiveVal: shortAvailability(domain.naive.availabilitySLA),
      wafVal: shortAvailability(domain.wellArch.availabilitySLA),
      benefit: 'Certified High Availability'
    },
    {
      label: 'Recovery (RTO)',
      naiveVal: shortRTO(domain.naive.rto),
      wafVal: shortRTO(domain.wellArch.rto),
      benefit: 'Automated Failover'
    },
    {
      label: 'Monthly Spend',
      naiveVal: `$${domain.naive.monthlyCostEst.toLocaleString('en-US')}`,
      wafVal: `$${domain.wellArch.monthlyCostEst.toLocaleString('en-US')}`,
      benefit: `${Math.round((1 - domain.wellArch.monthlyCostEst / domain.naive.monthlyCostEst) * 100)}% FinOps Savings`
    }
  ];

  const theorySlide: DeckSlide = {
    id: `module-${index + 1}-theory`,
    kind: 'module-theory',
    eyebrow: `${moduleLabel} · ${domain.category}`,
    title: domain.title,
    banner: `Core Principle · ${principle}`,
    points: [...script.points],
    tables: [componentTable(index)],
    domainIndex: index,
    lines: [{ say: script.theory }],
    cards,
    pillars: domain.pillars.map((p) => String(p)),
    metrics,
    category: domain.category
  };

  const comparisonSlide: DeckSlide = {
    id: `module-${index + 1}-comparison`,
    kind: 'comparison',
    eyebrow: `${moduleLabel} · Interactive Live Simulation Stage`,
    title: domain.subtitle,
    banner: `Disaster Scenario Tested · ${domain.chaos.title}`,
    points: [],
    tables: [measuresTable(index)],
    domainIndex: index,
    lines: [
      { say: script.leftRest, cues: [SHOW_BOTH, LOAD_NORMAL, RECOVER, PACKETS_ON] },
      { say: script.rightRest, cues: [SHOW_BOTH, LOAD_NORMAL, RECOVER, PACKETS_ON] },
      { say: script.underFailure, cues: [LOAD_PEAK, FAILURE, PACKETS_ON] }
    ],
    pillars: domain.pillars.map((p) => String(p)),
    metrics,
    category: domain.category
  };

  return [theorySlide, comparisonSlide];
};

/** The full presentation, in the order it is spoken. */
export const deckSlides: DeckSlide[] = [
  titleSlide,
  agendaSlide,
  ...theorySlides,
  ...Array.from({ length: MODULE_COUNT }, (_, index) => buildModuleSlides(index)).flat(),
  closingSlide
];

export const DECK_SLIDE_COUNT = deckSlides.length;
