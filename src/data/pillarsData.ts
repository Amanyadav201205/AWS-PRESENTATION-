import { PillarType } from '../types';

export interface PillarDetail {
  id: PillarType;
  name: string;
  tagline: string;
  officialDefinition: string;
  color: string;
  iconName: string;
  designPrinciples: {
    title: string;
    explanation: string;
  }[];
  keyQuestions: {
    code: string;
    question: string;
    bestPractice: string;
  }[];
  antiPatternVsBestPractice: {
    antiPattern: string;
    bestPractice: string;
  }[];
  relatedDomainIds: string[];
}

export const pillarDetails: PillarDetail[] = [
  {
    id: 'Operational Excellence',
    name: 'Operational Excellence',
    tagline: 'Run workloads effectively, understand operations, and continuously improve processes.',
    officialDefinition: 'The Operational Excellence pillar focuses on executing and monitoring systems, continually improving processes and procedures, and delivering business value.',
    color: '#3B82F6',
    iconName: 'Activity',
    designPrinciples: [
      {
        title: 'Perform operations as code',
        explanation: 'Define entire workloads as code (IaC) and update them using automated deployment procedures to eliminate configuration drift.'
      },
      {
        title: 'Make frequent, small, reversible changes',
        explanation: 'Design workloads so that components can be updated regularly in small increments that can be quickly rolled back if failure occurs.'
      },
      {
        title: 'Refine operations procedures frequently',
        explanation: 'Regularly schedule game days to review operational procedures and verify that all team members are familiar with recovery workflows.'
      },
      {
        title: 'Anticipate failure',
        explanation: 'Perform pre-mortems to identify potential failure sources and test disaster recovery scenarios with simulated chaos injection.'
      },
      {
        title: 'Learn from all operational failures',
        explanation: 'Conduct blameless post-incident reviews (COEs) and automate preventive measures so the same failure never recurs.'
      }
    ],
    keyQuestions: [
      {
        code: 'OPS 1',
        question: 'How do you determine what your priorities are for operational excellence?',
        bestPractice: 'Align operational focus with customer needs and organizational business drivers.'
      },
      {
        code: 'OPS 4',
        question: 'How do you implement observability in your workload?',
        bestPractice: 'Capture distributed traces, centralize structured logs, and compute business-level KPIs with CloudWatch Container Insights & X-Ray.'
      },
      {
        code: 'OPS 7',
        question: 'How do you evolve your workload using automated delivery?',
        bestPractice: 'Use automated CI/CD pipelines with rollback triggers driven by automated metric alarms.'
      }
    ],
    antiPatternVsBestPractice: [
      {
        antiPattern: 'Manual configuration via AWS Console (ClickOps)',
        bestPractice: '100% Terraform / CloudFormation with automated GitOps pipelines'
      },
      {
        antiPattern: 'Inspecting local text log files on individual servers after customer complaints',
        bestPractice: 'Centralized streaming logs, X-Ray traces, and automated EventBridge self-healing alarms'
      }
    ],
    relatedDomainIds: ['monitoring-elasticity', 'automating-architecture', 'connecting-network']
  },
  {
    id: 'Security',
    name: 'Security',
    tagline: 'Protect information, systems, and assets through defense in depth and automated guardrails.',
    officialDefinition: 'The Security pillar focuses on protecting data, systems, and assets while taking advantage of cloud technologies to improve your security posture.',
    color: '#EF4444',
    iconName: 'Shield',
    designPrinciples: [
      {
        title: 'Implement a strong identity foundation',
        explanation: 'Enforce principle of least privilege, eliminate static IAM keys, and require multi-factor authentication with short-lived tokens via AWS STS.'
      },
      {
        title: 'Enable traceability',
        explanation: 'Log, monitor, and audit all actions in real-time with AWS CloudTrail, VPC Flow Logs, and Amazon GuardDuty ML anomaly detection.'
      },
      {
        title: 'Apply security at all layers',
        explanation: 'Defense in depth: deploy edge WAF, VPC security groups, private subnets, and host-level container firewalls rather than relying on a single perimeter.'
      },
      {
        title: 'Automate security best practices',
        explanation: 'Use software-based security mechanisms that analyze code and auto-remediate policy violations in real time.'
      },
      {
        title: 'Protect data in transit and at rest',
        explanation: 'Enforce TLS 1.3 encryption across all communication and use AWS KMS Customer Managed Keys (CMK) with automated key rotation.'
      },
      {
        title: 'Keep people away from data',
        explanation: 'Create tools and automated pipelines to reduce direct manual database and server console access, preventing human error.'
      }
    ],
    keyQuestions: [
      {
        code: 'SEC 1',
        question: 'How do you securely operate your workload?',
        bestPractice: 'Apply strict least-privilege IAM policies, AWS Organizations SCPs, and continuous compliance checks via AWS Config.'
      },
      {
        code: 'SEC 3',
        question: 'How do you manage human and machine identities?',
        bestPractice: 'Use IAM Identity Center for SSO and IAM Roles with temporary STS credentials for EC2 and Lambda execution.'
      },
      {
        code: 'SEC 8',
        question: 'How do you protect your data at rest?',
        bestPractice: 'Enforce default bucket encryption with KMS CMK, enable S3 Object Lock, and verify that public ACLs are blocked by SCP.'
      }
    ],
    antiPatternVsBestPractice: [
      {
        antiPattern: 'Hardcoded static IAM Access Keys in code with AdministratorAccess',
        bestPractice: 'IAM Roles with ephemeral STS tokens, automated 30-day Secrets Manager rotation, and least-privilege boundaries'
      },
      {
        antiPattern: 'Databases and backend servers residing in public subnets with 0.0.0.0/0 ingress',
        bestPractice: '3-tier VPC architecture with completely isolated private subnets and VPC Endpoints'
      }
    ],
    relatedDomainIds: ['securing-application', 'networking-environment', 'storage-layer']
  },
  {
    id: 'Reliability',
    name: 'Reliability',
    tagline: 'Recover from disruptions, dynamically adapt to demand, and mitigate failure blast radiuses.',
    officialDefinition: 'The Reliability pillar ensures that a workload performs its intended function correctly and consistently when expected to, and quickly recovers from failures.',
    color: '#10B981',
    iconName: 'RefreshCw',
    designPrinciples: [
      {
        title: 'Automatically recover from failure',
        explanation: 'Monitor workload KPIs and automate self-healing workflows (such as Auto Scaling replacement and Aurora replica promotion) when thresholds breach.'
      },
      {
        title: 'Test recovery procedures',
        explanation: 'Simulate disaster scenarios with Chaos Engineering to validate automatic failover paths before real outages occur.'
      },
      {
        title: 'Scale horizontally to increase aggregate workload availability',
        explanation: 'Replace single large resources with multiple small instances to reduce the impact of any individual failure.'
      },
      {
        title: 'Stop guessing capacity',
        explanation: 'Monitor demand and automate resource provisioning with predictive Auto Scaling to prevent saturation failures.'
      },
      {
        title: 'Manage change in automation',
        explanation: 'Changes to infrastructure should be made using automation and tracked in version control.'
      }
    ],
    keyQuestions: [
      {
        code: 'REL 1',
        question: 'How do you manage service quotas and constraints?',
        bestPractice: 'Use AWS Service Quotas with proactive CloudWatch alarms to prevent hitting hard API limits.'
      },
      {
        code: 'REL 6',
        question: 'How do you design your workload to withstand component failures?',
        bestPractice: 'Deploy multi-AZ topologies, eliminate single points of failure (SPOFs), and implement circuit breakers and retries with exponential backoff.'
      },
      {
        code: 'REL 13',
        question: 'How do you plan for disaster recovery (DR)?',
        bestPractice: 'Define RTO and RPO targets, replicate critical data across AWS regions, and test failover with automated game days.'
      }
    ],
    antiPatternVsBestPractice: [
      {
        antiPattern: 'Single EC2 instance and single-AZ database (Single Point of Failure)',
        bestPractice: 'Multi-AZ Auto Scaling compute with Aurora Multi-AZ automatic failover in <30 seconds'
      },
      {
        antiPattern: 'Synchronous REST chaining where one service outage takes down the entire site',
        bestPractice: 'Loosely coupled event-driven queuing with Amazon SQS, SNS, and Dead Letter Queues'
      }
    ],
    relatedDomainIds: ['compute-layer', 'database-layer', 'decoupled-architectures', 'disaster-recovery']
  },
  {
    id: 'Performance Efficiency',
    name: 'Performance Efficiency',
    tagline: 'Use computing resources efficiently to meet requirements and maintain efficiency as demand evolves.',
    officialDefinition: 'The Performance Efficiency pillar focuses on using computing resources efficiently to meet system requirements, and maintaining that efficiency as demand changes and technologies evolve.',
    color: '#F59E0B',
    iconName: 'Zap',
    designPrinciples: [
      {
        title: 'Democratize advanced technologies',
        explanation: 'Use managed and serverless technologies (like Aurora, DynamoDB, and Kinesis) rather than asking teams to host and maintain complex database clusters.'
      },
      {
        title: 'Go global in minutes',
        explanation: 'Deploy workloads in multiple AWS Regions and Edge Locations worldwide using CloudFront to reduce latency for global customers.'
      },
      {
        title: 'Use serverless architectures',
        explanation: 'Serverless architectures remove the operational burden of managing physical or virtual servers, scaling automatically with request demand.'
      },
      {
        title: 'Experiment more often',
        explanation: 'With virtual and automatable resources, quickly carry out comparative performance testing using different instance types or configurations.'
      },
      {
        title: 'Consider mechanical sympathy',
        explanation: 'Understand how cloud services work to select the optimal technology for your workload (e.g., in-memory Redis vs SSD relational queries).'
      }
    ],
    keyQuestions: [
      {
        code: 'PERF 1',
        question: 'How do you select the best performing architecture?',
        bestPractice: 'Benchmark workload characteristics against compute, storage, database, and networking options.'
      },
      {
        code: 'PERF 2',
        question: 'How do you select your compute solution?',
        bestPractice: 'Choose Graviton ARM instances or serverless Lambda functions matched to workload profile.'
      },
      {
        code: 'PERF 4',
        question: 'How do you evolve your data architecture for high performance?',
        bestPractice: 'Implement multi-tier caching with CloudFront and ElastiCache Redis, and offload read queries to read replicas.'
      }
    ],
    antiPatternVsBestPractice: [
      {
        antiPattern: 'Directly querying relational databases for every static asset and repeated lookup',
        bestPractice: 'CloudFront edge caching with 90%+ offload and ElastiCache Redis in-memory cache-aside'
      },
      {
        antiPattern: 'Running heavy analytic SQL queries on live production transactional OLTP database',
        bestPractice: 'Decoupled serverless data lake with Kinesis streaming, S3 Parquet storage, and Athena queries'
      }
    ],
    relatedDomainIds: ['caching-content', 'compute-layer', 'datapipelines']
  },
  {
    id: 'Cost Optimization',
    name: 'Cost Optimization',
    tagline: 'Avoid unnecessary costs, understand spending trends, and scale costs proportionally to business value.',
    officialDefinition: 'The Cost Optimization pillar focuses on avoiding unnecessary costs, analyzing and attributing spend, and picking the most cost-effective resources at the right scale.',
    color: '#8B5CF6',
    iconName: 'DollarSign',
    designPrinciples: [
      {
        title: 'Implement cloud financial management (FinOps)',
        explanation: 'Establish organizational commitment to cost awareness, automated budget alerts, and resource tagging governance.'
      },
      {
        title: 'Adopt a consumption model',
        explanation: 'Pay only for what you use by shutting down idle development resources and adopting auto-scaling or serverless scale-to-zero.'
      },
      {
        title: 'Measure overall efficiency',
        explanation: 'Measure the business output of the workload against infrastructure spend to ensure cost correlates directly with revenue.'
      },
      {
        title: 'Stop spending money on undifferentiated heavy lifting',
        explanation: 'Let AWS manage operating system patching, database replication, and networking hardware so engineers can focus on business logic.'
      },
      {
        title: 'Analyze and attribute expenditure',
        explanation: 'Enforce granular cost allocation tags to identify which microservices, teams, or environments generate costs.'
      }
    ],
    keyQuestions: [
      {
        code: 'COST 1',
        question: 'How do you implement cloud financial management?',
        bestPractice: 'Integrate AWS Cost Explorer, Budgets, and Cost Anomaly Detection with Slack or email alerts.'
      },
      {
        code: 'COST 5',
        question: 'How do you optimize resource costs over time?',
        bestPractice: 'Leverage Savings Plans, Compute Optimizer recommendations, and migrate legacy gp2 to gp3.'
      },
      {
        code: 'COST 7',
        question: 'How do you optimize data transfer and storage costs?',
        bestPractice: 'Use S3 Intelligent-Tiering, Gateway VPC Endpoints, and CloudFront egress discount tiers.'
      }
    ],
    antiPatternVsBestPractice: [
      {
        antiPattern: 'Over-provisioning 3TB EBS gp2 disks and keeping static files in S3 Standard forever',
        bestPractice: 'EBS gp3 decoupled IOPS + S3 Intelligent-Tiering with automated Glacier cold storage archiving (72% savings)'
      },
      {
        antiPattern: 'Paying 24/7 for idle EC2 servers sitting at 3% CPU utilization overnight',
        bestPractice: 'Event-driven serverless with AWS Lambda, API Gateway, and DynamoDB paying strictly per millisecond'
      }
    ],
    relatedDomainIds: ['storage-layer', 'serverless-microservices', 'caching-content']
  },
  {
    id: 'Sustainability',
    name: 'Sustainability',
    tagline: 'Minimize environmental impact, maximize resource utilization, and eliminate idle energy waste.',
    officialDefinition: 'The Sustainability pillar focuses on minimizing environmental impacts of running cloud workloads through right-sizing, modern silicon, and serverless adoption.',
    color: '#14B8A6',
    iconName: 'Leaf',
    designPrinciples: [
      {
        title: 'Understand your impact',
        explanation: 'Measure the carbon emissions and resource consumption of your workloads using the AWS Customer Carbon Footprint Tool.'
      },
      {
        title: 'Establish sustainability goals',
        explanation: 'Set measurable targets to increase compute density and decrease idle kilowatt-hours per user transaction.'
      },
      {
        title: 'Maximize utilization',
        explanation: 'Right-size compute instances, pack containers densely on AWS Fargate/ECS, and use auto-scaling to match actual customer demand.'
      },
      {
        title: 'Anticipate and adopt new, more efficient hardware and software',
        explanation: 'Migrate legacy x86 workloads to AWS Graviton processors, which deliver up to 60% better energy efficiency.'
      },
      {
        title: 'Use managed services',
        explanation: 'Managed services share infrastructure across multiple customers, drastically increasing physical server utilization and energy efficiency.'
      },
      {
        title: 'Reduce the downstream impact of your cloud workloads',
        explanation: 'Compress static assets, implement edge caching, and reduce network data transmission to lower energy usage on client devices.'
      }
    ],
    keyQuestions: [
      {
        code: 'SUS 1',
        question: 'How do you select Region and service architectures to support sustainability?',
        bestPractice: 'Choose AWS Regions powered by renewable energy and leverage managed serverless architectures.'
      },
      {
        code: 'SUS 2',
        question: 'How do you take advantage of user behavior to improve sustainability?',
        bestPractice: 'Scale down test and staging environments outside of business hours and optimize retention periods.'
      },
      {
        code: 'SUS 4',
        question: 'How do you optimize your data storage to reduce carbon footprint?',
        bestPractice: 'Archive or expire cold data using S3 lifecycle rules and compress files with modern snappy/gzip algorithms.'
      }
    ],
    antiPatternVsBestPractice: [
      {
        antiPattern: 'Over-provisioned x86 servers running 24/7 with 95% idle compute cycles',
        bestPractice: 'Energy-efficient AWS Graviton3 ARM silicon and scale-to-zero serverless architectures'
      },
      {
        antiPattern: 'Storing uncompressed raw data indefinitely across multiple unneeded availability zones',
        bestPractice: 'Parquet columnar compression and automated lifecycle expiration of transient logs'
      }
    ],
    relatedDomainIds: ['compute-layer', 'serverless-microservices', 'storage-layer']
  }
];
