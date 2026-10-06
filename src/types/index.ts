export type PillarType = 
  | 'Operational Excellence'
  | 'Security'
  | 'Reliability'
  | 'Performance Efficiency'
  | 'Cost Optimization'
  | 'Sustainability';

export interface PillarScore {
  operationalExcellence: number; // 0 - 100
  security: number;
  reliability: number;
  performanceEfficiency: number;
  costOptimization: number;
  sustainability: number;
}

export interface MetricComparison {
  label: string;
  naiveValue: string | number;
  wellArchValue: string | number;
  unit?: string;
  impact: 'positive' | 'critical' | 'neutral';
  explanation: string;
}

export interface NodeConfigDetails {
  specs: string;
  securityPolicy: string;
  costProfile: string;
  wafAdvantage: string;
}

export interface ArchitectureNode {
  id: string;
  name: string;
  type: 'client' | 'dns' | 'cdn' | 'waf' | 'loadbalancer' | 'compute' | 'storage' | 'database' | 'queue' | 'cache' | 'analytics' | 'security' | 'gateway' | 'network' | 'on-premises';
  service: string;
  tier?: 'edge' | 'public' | 'private' | 'isolated' | 'on-premises' | 'cloud';
  az?: string;
  isSPOF?: boolean;
  status?: 'healthy' | 'degraded' | 'failed' | 'recovering';
  description?: string;
  configDetails?: NodeConfigDetails;
}

export interface ArchitectureConnection {
  from: string;
  to: string;
  label?: string;
  type?: 'sync' | 'async' | 'blocked' | 'failover';
}

export interface ArchitectureSpec {
  name: string;
  tagline: string;
  description: string;
  bulletPoints: string[];
  nodes: ArchitectureNode[];
  connections: ArchitectureConnection[];
  monthlyCostEst: number;
  availabilitySLA: string;
  rto: string;
  rpo: string;
  scores: PillarScore;
  iacSnippet: {
    language: 'hcl' | 'yaml';
    filename: string;
    code: string;
    notes: string;
  };
}

export interface CustomerRequirement {
  clientName: string;
  businessGoal: string;
  challenges: string[];
  budgetOrSlaTarget: string;
}

export interface NormalPrescription {
  title: string;
  prescribedServices: string;
  whyItSeemsLogical: string;
  whyItFailsInProduction: string[];
}

export interface ChaosScenario {
  id: string;
  title: string;
  triggerLabel: string;
  description: string;
  affectedNodeIds: string[];
  naiveConsequence: {
    statusText: string;
    errorRate: string;
    latency: string;
    downtime: string;
    narrative: string;
  };
  wellArchConsequence: {
    statusText: string;
    errorRate: string;
    latency: string;
    failoverTime: string;
    narrative: string;
  };
}

export interface SpeakerNotes {
  hook: string;
  keyPoints: string[];
  architectTip: string;
  examQuestion: string;
}

export interface DomainData {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  category: string;
  pillars: PillarType[];
  customerRequirement: CustomerRequirement;
  normalPrescription: NormalPrescription;
  wafTransformationSummary: string;
  naive: ArchitectureSpec;
  wellArch: ArchitectureSpec;
  metrics: MetricComparison[];
  chaos: ChaosScenario;
  speakerNotes: SpeakerNotes;
}

export type ViewMode = 'split' | 'naive-only' | 'well-arch-only';
export type AppDisplayMode = 'studio' | 'presenter' | 'chaos-lab';
export type ChaosPhase = 'idle' | 'injected' | 'healing' | 'resolved';
export type StorylineStage = 'requirement' | 'prescription' | 'waf-solution' | 'theory';
