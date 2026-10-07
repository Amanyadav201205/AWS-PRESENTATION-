import { RemoteCommand } from '../services/presentationRemoteSync';

export interface DomainScriptActionDef {
  id: string;
  label: string;
  description: string;
  icon:
    | 'zap'
    | 'shield'
    | 'flame'
    | 'sparkles'
    | 'sliders'
    | 'compass'
    | 'rotate'
    | 'eye'
    | 'play'
    | 'database'
    | 'lock'
    | 'radar'
    | 'dollar';
  badge: 'Live Sim' | 'Spotlight' | 'Outage' | 'View Mode' | 'Deep Dive' | 'SLA Proof' | 'IaC' | 'FinOps';
  color: string;
  getCommand: (primaryNodeId?: string, primaryNodeName?: string) => Omit<RemoteCommand, 'timestamp'>;
}

export const domainScriptActionsMap: Record<number, DomainScriptActionDef[]> = {
  // 0: Overview & Thesis
  0: [
    {
      id: 'ov-split',
      label: '⚖️ Split View Comparison',
      description: 'Side-by-side Monolith vs Well-Architected',
      icon: 'eye',
      badge: 'View Mode',
      color: 'var(--accent)',
      getCommand: () => ({ type: 'SET_VIEW_MODE', mode: 'split' })
    },
    {
      id: 'ov-waf-only',
      label: '🛡️ Focus Well-Architected Defense',
      description: 'Highlight 6-pillar defense in depth',
      icon: 'shield',
      badge: 'View Mode',
      color: '#30d158',
      getCommand: () => ({ type: 'SET_VIEW_MODE', mode: 'well-arch-only' })
    },
    {
      id: 'ov-naive-only',
      label: '⚠️ Focus Naive Monolith Flaws',
      description: 'Expose single public subnet anti-pattern',
      icon: 'flame',
      badge: 'View Mode',
      color: '#ff453a',
      getCommand: () => ({ type: 'SET_VIEW_MODE', mode: 'naive-only' })
    },
    {
      id: 'ov-pulse',
      label: '🌊 Run Live Traffic Pulse',
      description: 'Pulse live request stream across topology',
      icon: 'play',
      badge: 'Live Sim',
      color: 'var(--accent)',
      getCommand: () => ({ type: 'RUN_SLIDE_SIM' })
    },
    {
      id: 'ov-roi',
      label: '💰 Focus 59% FinOps Savings & ROI',
      description: 'Scroll big screen to verified cost transitions',
      icon: 'dollar',
      badge: 'FinOps',
      color: '#30d158',
      getCommand: () => ({ type: 'SCROLL_TO', target: 'metrics' })
    },
    {
      id: 'ov-advisor',
      label: '🧠 Launch Architecture Advisor Q&A',
      description: 'Open interactive WAF review evaluator modal',
      icon: 'sparkles',
      badge: 'Deep Dive',
      color: 'var(--accent)',
      getCommand: () => ({ type: 'OPEN_MODAL', modal: 'advisor', label: 'Architecture Advisor' })
    }
  ],

  // 1: Storage Layer
  1: [
    {
      id: 'st-ransomware',
      label: '🔒 Simulate Ransomware Attack',
      description: 'Test S3 Object Lock WORM compliance (403 AccessDenied)',
      icon: 'flame',
      badge: 'Outage',
      color: '#ff453a',
      getCommand: () => ({ type: 'TRIGGER_ATTACK', attackScenario: 'ransomware', label: 'Ransomware Attack' })
    },
    {
      id: 'st-spotlight-s3',
      label: '🛡️ Spotlight S3 Object Lock & Glacier',
      description: 'Pulse gold ring on S3 compliance bucket',
      icon: 'sparkles',
      badge: 'Spotlight',
      color: 'var(--accent)',
      getCommand: () => ({ type: 'SPOTLIGHT', targetId: 's3-bucket', label: 'S3 Object Lock Bucket' })
    },
    {
      id: 'st-spotlight-ebs',
      label: '⚡ Spotlight EBS gp3 Decoupling',
      description: 'Demonstrate IOPS decoupled from capacity',
      icon: 'database',
      badge: 'Spotlight',
      color: '#5ac8fa',
      getCommand: () => ({ type: 'SPOTLIGHT', targetId: 'ebs-gp3', label: 'EBS gp3 Volume' })
    },
    {
      id: 'st-subtopic-ebs',
      label: '🔬 Launch EBS gp3 vs io2 Lab',
      description: 'Open interactive EBS performance & cost lab',
      icon: 'sliders',
      badge: 'Deep Dive',
      color: 'var(--accent)',
      getCommand: () => ({ type: 'OPEN_MODAL', modal: 'subtopics', label: 'EBS Storage Lab' })
    },
    {
      id: 'st-metrics',
      label: '📊 Focus Storage FinOps Savings',
      description: 'Inspect 72% cold archive cost reductions',
      icon: 'dollar',
      badge: 'FinOps',
      color: '#30d158',
      getCommand: () => ({ type: 'SCROLL_TO', target: 'metrics' })
    }
  ],

  // 2: Compute Layer
  2: [
    {
      id: 'cp-surge',
      label: '📈 Surge Traffic to 100k req/s',
      description: 'Trigger horizontal Auto Scaling across 3 AZs',
      icon: 'sliders',
      badge: 'Live Sim',
      color: 'var(--accent)',
      getCommand: () => ({ type: 'SET_TRAFFIC', trafficLoad: 100000 })
    },
    {
      id: 'cp-az-outage',
      label: '💥 Inject AZ-1 Failure Disaster',
      description: 'Simulate datacenter blackout, test ALB rerouting',
      icon: 'flame',
      badge: 'Outage',
      color: '#ff453a',
      getCommand: () => ({ type: 'TRIGGER_ATTACK', attackScenario: 'az-outage', label: 'AZ-1 Outage Disaster' })
    },
    {
      id: 'cp-heal',
      label: '🔄 Heal & Rebalance Auto Scaling',
      description: 'Restore nominal Graviton3 instances across AZs',
      icon: 'rotate',
      badge: 'Live Sim',
      color: '#30d158',
      getCommand: () => ({ type: 'RESET_CHAOS' })
    },
    {
      id: 'cp-spotlight-asg',
      label: '🔦 Spotlight Auto Scaling Group',
      description: 'Laser focus on multi-AZ target tracking group',
      icon: 'sparkles',
      badge: 'Spotlight',
      color: 'var(--accent)',
      getCommand: (pId, pName) => ({ type: 'SPOTLIGHT', targetId: pId || 'asg-group', label: pName || 'Auto Scaling Group' })
    },
    {
      id: 'cp-stresslab',
      label: '🧪 Open Incident Stress Lab',
      description: 'Multi-vector outage and failure stress lab',
      icon: 'zap',
      badge: 'Deep Dive',
      color: '#ff9f0a',
      getCommand: () => ({ type: 'OPEN_MODAL', modal: 'stresslab', label: 'Incident Stress Lab' })
    }
  ],

  // 3: Database Layer
  3: [
    {
      id: 'db-failover',
      label: '💥 Trigger Aurora Crash & Failover',
      description: 'Crash primary writer, watch sub-18s promotion',
      icon: 'zap',
      badge: 'Outage',
      color: '#ff453a',
      getCommand: () => ({ type: 'TRIGGER_CHAOS' })
    },
    {
      id: 'db-heal',
      label: '🔄 Verify Quorum Health & Replication',
      description: 'Restore 6-way peer-repaired Aurora cluster',
      icon: 'rotate',
      badge: 'Live Sim',
      color: '#30d158',
      getCommand: () => ({ type: 'RESET_CHAOS' })
    },
    {
      id: 'db-spotlight-aurora',
      label: '🔦 Spotlight Aurora Multi-AZ Cluster',
      description: 'Laser focus on 6-way distributed storage',
      icon: 'database',
      badge: 'Spotlight',
      color: 'var(--accent)',
      getCommand: (pId, pName) => ({ type: 'SPOTLIGHT', targetId: pId || 'aurora-cluster', label: pName || 'Aurora Multi-AZ Cluster' })
    },
    {
      id: 'db-spotlight-proxy',
      label: '🛡️ Spotlight RDS Proxy Connection Pool',
      description: 'Inspect multiplexed connection pooling',
      icon: 'sparkles',
      badge: 'Spotlight',
      color: '#5ac8fa',
      getCommand: () => ({ type: 'SPOTLIGHT', targetId: 'rds-proxy', label: 'Amazon RDS Proxy' })
    },
    {
      id: 'db-quorum-lab',
      label: '🔬 Open Aurora Quorum 4/6 Lab',
      description: 'Inspect distributed disk segment quorum failure',
      icon: 'sliders',
      badge: 'Deep Dive',
      color: 'var(--accent)',
      getCommand: () => ({ type: 'OPEN_MODAL', modal: 'subtopics', label: 'Aurora Quorum Lab' })
    }
  ],

  // 4: Networking Environment
  4: [
    {
      id: 'net-spotlight-subnets',
      label: '🛡️ Spotlight 3-Tier Subnet Isolation',
      description: 'Show strict Public -> Private -> Isolated DB tiers',
      icon: 'shield',
      badge: 'Spotlight',
      color: 'var(--accent)',
      getCommand: () => ({ type: 'SPOTLIGHT', targetId: 'vpc-isolated-db', label: 'Isolated Database Subnet' })
    },
    {
      id: 'net-spotlight-endpoints',
      label: '🌐 Spotlight Gateway VPC Endpoints',
      description: 'Direct private routing to S3 & DynamoDB',
      icon: 'sparkles',
      badge: 'Spotlight',
      color: '#30d158',
      getCommand: () => ({ type: 'SPOTLIGHT', targetId: 'vpc-endpoint-s3', label: 'Gateway VPC Endpoint' })
    },
    {
      id: 'net-latency-sim',
      label: '✈️ Launch Packet Latency Simulator',
      description: 'Edge-to-database routing & hops benchmark',
      icon: 'sliders',
      badge: 'Deep Dive',
      color: '#5ac8fa',
      getCommand: () => ({ type: 'OPEN_MODAL', modal: 'latency', label: 'Packet Latency Simulator' })
    },
    {
      id: 'net-scroll-topology',
      label: '🗺️ Auto-Scroll to Network Topology',
      description: 'Center stage camera on interactive VPC map',
      icon: 'compass',
      badge: 'SLA Proof',
      color: 'var(--accent)',
      getCommand: () => ({ type: 'SCROLL_TO', target: 'topology' })
    }
  ],

  // 5: Connecting Networks
  5: [
    {
      id: 'cn-spotlight-tgw',
      label: '🔗 Spotlight AWS Transit Gateway Hub',
      description: 'Demonstrate hub-and-spoke multi-VPC routing',
      icon: 'compass',
      badge: 'Spotlight',
      color: 'var(--accent)',
      getCommand: () => ({ type: 'SPOTLIGHT', targetId: 'tgw-hub', label: 'AWS Transit Gateway' })
    },
    {
      id: 'cn-spotlight-dx',
      label: '🛡️ Spotlight Direct Connect Link',
      description: 'Dedicated 10Gbps enterprise hybrid fiber link',
      icon: 'sparkles',
      badge: 'Spotlight',
      color: '#5ac8fa',
      getCommand: () => ({ type: 'SPOTLIGHT', targetId: 'direct-connect', label: 'AWS Direct Connect Link' })
    },
    {
      id: 'cn-ddos',
      label: '🌊 Simulate DDoS Network Flood',
      description: 'Test AWS Shield Advanced edge scrubbing',
      icon: 'flame',
      badge: 'Outage',
      color: '#ff9f0a',
      getCommand: () => ({ type: 'TRIGGER_ATTACK', attackScenario: 'ddos', label: 'DDoS Network Flood' })
    },
    {
      id: 'cn-workloads',
      label: '💼 Launch Client Workload Solutions',
      description: 'Explore fintech, healthcare & SaaS architectures',
      icon: 'sliders',
      badge: 'Deep Dive',
      color: 'var(--accent)',
      getCommand: () => ({ type: 'OPEN_MODAL', modal: 'workloads', label: 'Client Workload Solutions' })
    }
  ],

  // 6: IAM & Security Governance
  6: [
    {
      id: 'sec-spotlight-iam',
      label: '🔑 Spotlight IAM Roles & STS Tokens',
      description: 'Eliminate hardcoded access keys via temporary tokens',
      icon: 'shield',
      badge: 'Spotlight',
      color: 'var(--accent)',
      getCommand: () => ({ type: 'SPOTLIGHT', targetId: 'iam-role', label: 'IAM Roles & STS' })
    },
    {
      id: 'sec-spotlight-kms',
      label: '🔐 Spotlight Secrets Manager & KMS',
      description: 'Envelope encryption & automatic 30-day rotation',
      icon: 'lock',
      badge: 'Spotlight',
      color: '#30d158',
      getCommand: () => ({ type: 'SPOTLIGHT', targetId: 'secrets-manager', label: 'Secrets Manager & KMS' })
    },
    {
      id: 'sec-6pillars',
      label: '🏛️ Open 6 Pillars: Security Pillar',
      description: 'Inspect full defense-in-depth compliance checklist',
      icon: 'sparkles',
      badge: 'Deep Dive',
      color: 'var(--accent)',
      getCommand: () => ({ type: 'OPEN_MODAL', modal: '6pillars', label: '6 Pillars Explorer (Security)' })
    },
    {
      id: 'sec-ransomware',
      label: '🔒 Test Credential Compromise Defense',
      description: 'Demonstrate GuardDuty anomaly detection',
      icon: 'flame',
      badge: 'Outage',
      color: '#ff453a',
      getCommand: () => ({ type: 'TRIGGER_ATTACK', attackScenario: 'ransomware', label: 'Compromise Defense Test' })
    }
  ],

  // 7: Monitoring & Observability
  7: [
    {
      id: 'mon-spotlight-cw',
      label: '👁️ Spotlight CloudWatch Synthetics',
      description: 'Canary probes and OpenSearch distributed traces',
      icon: 'sparkles',
      badge: 'Spotlight',
      color: 'var(--accent)',
      getCommand: () => ({ type: 'SPOTLIGHT', targetId: 'cloudwatch', label: 'CloudWatch Synthetics' })
    },
    {
      id: 'mon-scroll-metrics',
      label: '📊 Focus SLA & Observability Metrics',
      description: 'Scroll big screen to 99.99% availability dashboard',
      icon: 'sliders',
      badge: 'SLA Proof',
      color: '#30d158',
      getCommand: () => ({ type: 'SCROLL_TO', target: 'metrics' })
    },
    {
      id: 'mon-stresslab',
      label: '🧪 Launch Incident Stress Matrix',
      description: 'Simulate cascading alerts and automated triage',
      icon: 'zap',
      badge: 'Deep Dive',
      color: '#ff9f0a',
      getCommand: () => ({ type: 'OPEN_MODAL', modal: 'stresslab', label: 'Incident Stress Lab' })
    },
    {
      id: 'mon-surge-50k',
      label: '⚡ Surge Traffic to 50k req/s',
      description: 'Verify sub-millisecond p99 latency under load',
      icon: 'sliders',
      badge: 'Live Sim',
      color: 'var(--accent)',
      getCommand: () => ({ type: 'SET_TRAFFIC', trafficLoad: 50000 })
    }
  ],

  // 8: Operations & DevOps
  8: [
    {
      id: 'ops-scroll-iac',
      label: '📜 Focus 100% Terraform IaC Blueprint',
      description: 'Scroll big screen to verified infrastructure code',
      icon: 'sparkles',
      badge: 'IaC',
      color: '#bf5af2',
      getCommand: () => ({ type: 'SCROLL_TO', target: 'iac' })
    },
    {
      id: 'ops-spotlight-ssm',
      label: '🛡️ Spotlight Systems Manager (No SSH)',
      description: 'Zero open port 22 with immutable audit logs',
      icon: 'shield',
      badge: 'Spotlight',
      color: 'var(--accent)',
      getCommand: () => ({ type: 'SPOTLIGHT', targetId: 'systems-manager', label: 'AWS Systems Manager' })
    },
    {
      id: 'ops-spotlight-cicd',
      label: '🔄 Spotlight CodePipeline CI/CD',
      description: 'Canary deployments with automated rollback',
      icon: 'compass',
      badge: 'Spotlight',
      color: '#5ac8fa',
      getCommand: () => ({ type: 'SPOTLIGHT', targetId: 'codepipeline', label: 'AWS CodePipeline' })
    },
    {
      id: 'ops-advisor',
      label: '🧠 Launch Architecture Advisor Q&A',
      description: 'Review operational readiness checklists',
      icon: 'sparkles',
      badge: 'Deep Dive',
      color: 'var(--accent)',
      getCommand: () => ({ type: 'OPEN_MODAL', modal: 'advisor', label: 'Architecture Advisor' })
    }
  ],

  // 9: Performance Optimization & Caching
  9: [
    {
      id: 'perf-surge-500k',
      label: '⚡ Surge Traffic to 500,000 req/s Peak',
      description: 'Stress-test edge caching & in-memory read tier',
      icon: 'sliders',
      badge: 'Live Sim',
      color: 'var(--accent)',
      getCommand: () => ({ type: 'SET_TRAFFIC', trafficLoad: 500000 })
    },
    {
      id: 'perf-spotlight-redis',
      label: '🚀 Spotlight ElastiCache Redis Cluster',
      description: 'In-memory read-aside cluster with sub-ms responses',
      icon: 'database',
      badge: 'Spotlight',
      color: '#30d158',
      getCommand: () => ({ type: 'SPOTLIGHT', targetId: 'elasticache', label: 'ElastiCache Redis Cluster' })
    },
    {
      id: 'perf-latency-sim',
      label: '✈️ Launch Packet Latency Benchmark',
      description: 'Demonstrate CDN edge caching 4ms response times',
      icon: 'sliders',
      badge: 'Deep Dive',
      color: '#5ac8fa',
      getCommand: () => ({ type: 'OPEN_MODAL', modal: 'latency', label: 'Latency Simulator' })
    },
    {
      id: 'perf-spotlight-cf',
      label: '🌐 Spotlight CloudFront Edge Network',
      description: 'Global Points of Presence with TLS 1.3 termination',
      icon: 'sparkles',
      badge: 'Spotlight',
      color: 'var(--accent)',
      getCommand: () => ({ type: 'SPOTLIGHT', targetId: 'cloudfront', label: 'CloudFront Edge Anycast' })
    }
  ],

  // 10: Cost Optimization & FinOps
  10: [
    {
      id: 'fin-bill-shock',
      label: '💸 Simulate FinOps Bill Shock Alert',
      description: 'Simulate zombie instance cost overrun alert',
      icon: 'flame',
      badge: 'Outage',
      color: '#ff453a',
      getCommand: () => ({ type: 'TRIGGER_ATTACK', attackScenario: 'bill-shock', label: 'FinOps Bill Shock' })
    },
    {
      id: 'fin-executive-calc',
      label: '📊 Launch Executive FinOps Calculator',
      description: 'Interactive cloud savings and 59% ROI modeler',
      icon: 'dollar',
      badge: 'FinOps',
      color: '#30d158',
      getCommand: () => ({ type: 'OPEN_MODAL', modal: 'executive', label: 'Executive FinOps Calculator' })
    },
    {
      id: 'fin-scroll-breakdown',
      label: '💰 Scroll to Cost Transition Table',
      description: 'Side-by-side $4,450 to $1,820/mo breakdown',
      icon: 'dollar',
      badge: 'FinOps',
      color: 'var(--accent)',
      getCommand: () => ({ type: 'SCROLL_TO', target: 'metrics' })
    },
    {
      id: 'fin-spotlight-sqs',
      label: '📬 Spotlight SQS Dead-Letter Queue',
      description: 'Asynchronous decoupling preventing compute waste',
      icon: 'sparkles',
      badge: 'Spotlight',
      color: '#5ac8fa',
      getCommand: () => ({ type: 'SPOTLIGHT', targetId: 'sqs', label: 'SQS FIFO Queue' })
    }
  ],

  // 11: Serverless & Modern Architectures
  11: [
    {
      id: 'srv-spotlight-lambda',
      label: '⚡ Spotlight EventBridge & Lambda',
      description: 'Event-driven architecture with zero idle compute cost',
      icon: 'sparkles',
      badge: 'Spotlight',
      color: 'var(--accent)',
      getCommand: () => ({ type: 'SPOTLIGHT', targetId: 'lambda', label: 'AWS Lambda & EventBridge' })
    },
    {
      id: 'srv-spotlight-sfn',
      label: '🧩 Spotlight Step Functions Orchestration',
      description: 'Resilient state machine with distributed retries',
      icon: 'compass',
      badge: 'Spotlight',
      color: '#bf5af2',
      getCommand: () => ({ type: 'SPOTLIGHT', targetId: 'step-functions', label: 'AWS Step Functions' })
    },
    {
      id: 'srv-pulse',
      label: '🌊 Run Live Serverless Event Stream',
      description: 'Pulse asynchronous events through the mesh',
      icon: 'play',
      badge: 'Live Sim',
      color: 'var(--accent)',
      getCommand: () => ({ type: 'RUN_SLIDE_SIM' })
    },
    {
      id: 'srv-subtopics',
      label: '🔬 Open Serverless Patterns Lab',
      description: 'Deep-dive EventBridge bus and SQS FIFO DLQ lab',
      icon: 'sliders',
      badge: 'Deep Dive',
      color: '#30d158',
      getCommand: () => ({ type: 'OPEN_MODAL', modal: 'subtopics', label: 'Serverless Patterns Lab' })
    }
  ],

  // 12: AI/ML & Advanced Data Pipelines
  12: [
    {
      id: 'ai-spotlight-sagemaker',
      label: '🤖 Spotlight SageMaker Inference Endpoint',
      description: 'Autoscaling multi-model real-time endpoint',
      icon: 'sparkles',
      badge: 'Spotlight',
      color: 'var(--accent)',
      getCommand: () => ({ type: 'SPOTLIGHT', targetId: 'sagemaker', label: 'Amazon SageMaker Endpoint' })
    },
    {
      id: 'ai-governance',
      label: '⚖️ Launch AI Governance & Safety Modal',
      description: 'Hallucination bounds, PII masking & compliance',
      icon: 'shield',
      badge: 'Deep Dive',
      color: '#5ac8fa',
      getCommand: () => ({ type: 'OPEN_MODAL', modal: 'governance', label: 'AI Governance Inspector' })
    },
    {
      id: 'ai-spotlight-bedrock',
      label: '🧠 Spotlight Amazon Bedrock Guardrails',
      description: 'Managed generative AI safety & vector search',
      icon: 'database',
      badge: 'Spotlight',
      color: '#bf5af2',
      getCommand: () => ({ type: 'SPOTLIGHT', targetId: 'bedrock', label: 'Amazon Bedrock Guardrails' })
    },
    {
      id: 'ai-advisor',
      label: '🧠 Open Guided Architecture Advisor',
      description: 'Review architectural recommendations with AI',
      icon: 'sparkles',
      badge: 'Deep Dive',
      color: 'var(--accent)',
      getCommand: () => ({ type: 'OPEN_MODAL', modal: 'advisor', label: 'Architecture Advisor' })
    }
  ],

  // 13: Reliability & Disaster Recovery
  13: [
    {
      id: 'dr-chaos-outage',
      label: '🚨 Simulate Multi-AZ Regional Blackout',
      description: 'Test automated active-active multi-region failover',
      icon: 'flame',
      badge: 'Outage',
      color: '#ff453a',
      getCommand: () => ({ type: 'TRIGGER_CHAOS' })
    },
    {
      id: 'dr-spotlight-r53',
      label: '🌐 Spotlight Route 53 ARC Routing Control',
      description: 'Application Recovery Controller with health gates',
      icon: 'compass',
      badge: 'Spotlight',
      color: 'var(--accent)',
      getCommand: () => ({ type: 'SPOTLIGHT', targetId: 'route53', label: 'Route 53 ARC Controller' })
    },
    {
      id: 'dr-heal',
      label: '🔄 Restore & Re-route All Regions',
      description: 'Verify 0 data loss (RPO = 0, RTO < 30s)',
      icon: 'rotate',
      badge: 'Live Sim',
      color: '#30d158',
      getCommand: () => ({ type: 'RESET_CHAOS' })
    },
    {
      id: 'dr-stresslab',
      label: '🧪 Launch Incident Stress Lab',
      description: 'Multi-region disaster recovery simulation',
      icon: 'zap',
      badge: 'Deep Dive',
      color: '#ff9f0a',
      getCommand: () => ({ type: 'OPEN_MODAL', modal: 'stresslab', label: 'Incident Stress Lab' })
    }
  ],

  // 14: Executive Synthesis & Capstone
  14: [
    {
      id: 'cap-radar',
      label: '🕸️ Auto-Scroll to 6-Pillar Radar Chart',
      description: 'Center stage on cross-pillar compliance radar',
      icon: 'radar',
      badge: 'SLA Proof',
      color: 'var(--accent)',
      getCommand: () => ({ type: 'SCROLL_TO', target: 'radar' })
    },
    {
      id: 'cap-metrics',
      label: '📈 Focus Verified FinOps 59% Savings',
      description: 'Present final quantitative audit to the jury',
      icon: 'dollar',
      badge: 'FinOps',
      color: '#30d158',
      getCommand: () => ({ type: 'SCROLL_TO', target: 'metrics' })
    },
    {
      id: 'cap-theory-slide',
      label: '📖 Switch Slide to Theoretical Proof',
      description: 'Display formal theorems (CAP, PACELC, Gall\'s Law)',
      icon: 'sparkles',
      badge: 'View Mode',
      color: '#5ac8fa',
      getCommand: () => ({ type: 'SET_SLIDE_MODE', slideMode: 'theory' })
    },
    {
      id: 'cap-6pillars',
      label: '🏛️ Launch 6 Pillars Master Explorer',
      description: 'Holistic framework reference for evaluator review',
      icon: 'sparkles',
      badge: 'Deep Dive',
      color: 'var(--accent)',
      getCommand: () => ({ type: 'OPEN_MODAL', modal: '6pillars', label: '6 Pillars Master Explorer' })
    },
    {
      id: 'cap-footer',
      label: '✍️ Presenter Sign-Off Footer ("Devarsh & Aman")',
      description: 'Scroll directly to Author Credits & Evaluator Sign-off',
      icon: 'compass',
      badge: 'SLA Proof',
      color: 'var(--accent)',
      getCommand: () => ({ type: 'SCROLL_TO', target: 'footer' })
    }
  ]
};
