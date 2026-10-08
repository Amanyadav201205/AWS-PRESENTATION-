export interface TheoryReference {
  domainId: string;
  domainNumber: number;
  domainTitle: string;
  lawOrTheorem: {
    name: string;
    founder: string;
    year: string;
    formalStatement: string;
    architecturalApplication: string;
    mathematicalFormula?: string;
    formulaExplanation?: string;
  };
  awsWhitepaper: {
    title: string;
    docCode: string;
    pillarBestPracticeCode: string;
    canonicalQuote: string;
    linkUrl?: string;
  };
  buildersLibrary: {
    title: string;
    author: string;
    role: string;
    coreInsight: string;
  };
  complianceStandard: {
    standard: string;
    controlId: string;
    requirement: string;
  };
}

export const theoreticalFoundations: Record<string, TheoryReference> = {
  'overview-thesis': {
    domainId: 'overview-thesis',
    domainNumber: 0,
    domainTitle: 'Executive Architecture Overview',
    lawOrTheorem: {
      name: 'Gall’s Law',
      founder: 'John Gall',
      year: '1977',
      formalStatement: 'A complex system that works is invariably found to have evolved from a simple system that worked. A complex system designed from scratch never works and cannot be patched up to make it work.',
      architecturalApplication: 'The AWS Well-Architected Framework operationalizes Gall’s Law by enforcing modular, decoupled, and incrementally testable components rather than unmanageable monolithic constructs.',
      mathematicalFormula: 'S(t) = S_0 \\prod_{i=1}^n (1 - p_i)',
      formulaExplanation: 'System reliability S(t) degrades exponentially as unpartitioned interdependent components (p_i) increase.'
    },
    awsWhitepaper: {
      title: 'AWS Well-Architected Framework: General Design Principles',
      docCode: 'AWS-WAF-2024-GEN',
      pillarBestPracticeCode: 'OPS01, REL01, SEC01',
      canonicalQuote: 'Stop guessing your capacity needs. Test systems at production scale. Automate to make architectural experimentation easier. Allow for evolutionary architectures.'
    },
    buildersLibrary: {
      title: 'Reliability, constant work, and static stability',
      author: 'Becky Weiss',
      role: 'VP and Distinguished Engineer, AWS',
      coreInsight: 'Architectures that survive catastrophic load do so by remaining statically stable—operating predictably without relying on external control planes or sudden synchronous re-allocations during failure.'
    },
    complianceStandard: {
      standard: 'ISO/IEC 27001 / SOC 2 Type II',
      controlId: 'CC6.1 - System Boundaries & Architecture',
      requirement: 'The entity implements logical boundaries and formal architectural reviews to protect sensitive infrastructure from systemic collapse.'
    },
  },

  'storage-layer': {
    domainId: 'storage-layer',
    domainNumber: 1,
    domainTitle: 'Storage Layer',
    lawOrTheorem: {
      name: 'Reed-Solomon Erasure Coding & Quorum Durability',
      founder: 'Irving S. Reed & Gustave Solomon',
      year: '1960',
      formalStatement: 'An (n, k) Reed-Solomon code over Galois Field GF(2^w) reconstructs original data of k blocks from any k subset of n encoded blocks, tolerating (n - k) simultaneous disk/node losses.',
      architecturalApplication: 'Amazon S3 uses advanced erasure coding across at least three physical Availability Zones, delivering 99.999999999% (11 9’s) durability without tripling raw hardware footprints.',
      mathematicalFormula: 'P(\\text{loss}) = \\sum_{j=m+1}^{n} \\binom{n}{j} p^j (1-p)^{n-j}',
      formulaExplanation: 'Where n=encoded shards, m=tolerated parity failures, and p=annual drive failure rate (~1.5%). Yields P(loss) < 10^{-11}.'
    },
    awsWhitepaper: {
      title: 'Amazon S3 Architecture & Durability Whitepaper',
      docCode: 'AWS-S3-ARCH-11NINES',
      pillarBestPracticeCode: 'REL09 - Back up data; COST04 - Decommission or tier storage',
      canonicalQuote: 'S3 Standard is designed for 11 9’s of durability by automatically dispersing data across multiple independent facilities with real-time proactive cyclic checksum validation.'
    },
    buildersLibrary: {
      title: 'Workload isolation using shuffle sharding',
      author: 'Marc Brooker',
      role: 'VP and Distinguished Engineer, AWS',
      coreInsight: 'Isolating customer data across orthogonal shards limits the blast radius of any individual hardware or network degradation to a mathematically negligible slice.'
    },
    complianceStandard: {
      standard: 'NIST SP 800-53 Rev. 5',
      controlId: 'CP-9 - Information System Backup',
      requirement: 'Conduct automated incremental backups with continuous cryptographic hash validation and cross-facility geographic redundancy.'
    },
  },

  'compute-layer': {
    domainId: 'compute-layer',
    domainNumber: 2,
    domainTitle: 'Compute Layer',
    lawOrTheorem: {
      name: 'Amdahl’s Law & Gustafson’s Law of Parallel Scalability',
      founder: 'Gene Amdahl / John Gustafson',
      year: '1967 / 1988',
      formalStatement: 'The maximum speedup of a program using n processors is limited by the serial fraction s: Speedup = 1 / (s + (1-s)/n). Horizontal scale beats vertical scale as scale n approaches infinity.',
      architecturalApplication: 'Monolithic single-server compute hits vertical hardware walls ($s \\to 1$). Well-Architected Auto Scaling groups leverage stateless horizontal scaling across multiple AZs, maximizing parallel compute efficiency.',
      mathematicalFormula: 'S_{\\text{latency}} = \\frac{1}{(1-p) + \\frac{p}{N}}',
      formulaExplanation: 'Where p is parallelizable request execution fraction and N is the number of stateless EC2/Fargate containers.'
    },
    awsWhitepaper: {
      title: 'Performance Efficiency Pillar - AWS Well-Architected Framework',
      docCode: 'AWS-WAF-PERF-2024',
      pillarBestPracticeCode: 'PERF01 - Evaluate compute resources; PERF02 - Select right compute',
      canonicalQuote: 'Use elasticity to match supply with demand. Do not over-provision static instances to survive rare peak workloads; instead, use dynamic or predictive horizontal scaling.'
    },
    buildersLibrary: {
      title: 'Avoiding fallback in distributed systems',
      author: 'David Yanacek',
      role: 'Senior Principal Engineer, AWS',
      coreInsight: 'When compute fleets face sudden traffic spikes, hard limits and shedding work early protects core processing engines from entering unrecoverable brownout loops.'
    },
    complianceStandard: {
      standard: 'SOC 2 Type II',
      controlId: 'A1.2 - Capacity and Availability Management',
      requirement: 'Capacity requirements are monitored and dynamically scaled to prevent service denial and maintain performance SLAs.'
    },
  },

  'database-layer': {
    domainId: 'database-layer',
    domainNumber: 3,
    domainTitle: 'Database Layer',
    lawOrTheorem: {
      name: 'CAP Theorem & PACELC Theorem',
      founder: 'Eric Brewer (2000) / Daniel Abadi (2012)',
      year: '2000 / 2012',
      formalStatement: 'If there is a Partition (P), how does the system trade off Availability (A) and Consistency (C); Else (E), when normal, how does it trade off Latency (L) and Consistency (C)?',
      architecturalApplication: 'Amazon Aurora uses a multi-master or read-replica quorum (PC/EC for writes, PA/EL for reads), while DynamoDB offers tunable read consistency (Eventual vs Strong), allowing architects to tune PACELC trade-offs per access pattern.',
      mathematicalFormula: 'V_w > V/2 \\quad \\text{and} \\quad V_r + V_w > V',
      formulaExplanation: 'Gifford Quorum condition: Total votes V=6, Write quorum V_w=4, Read quorum V_r=3 ensures read and write sets always overlap by at least one node.'
    },
    awsWhitepaper: {
      title: 'Amazon Aurora: Design Considerations for High Throughput Cloud-Native Relational Databases',
      docCode: 'SIGMOD-AURORA-PAPER',
      pillarBestPracticeCode: 'REL07 - Design interactions in distributed systems to mitigate failures',
      canonicalQuote: 'The log is the database. Storage nodes independently apply redo log records in parallel, offloading database engine CPU and eliminating write latency bottlenecks.'
    },
    buildersLibrary: {
      title: 'Leader election in distributed systems',
      author: 'Marc Brooker',
      role: 'VP and Distinguished Engineer, AWS',
      coreInsight: 'Distributed consensus mechanisms such as Raft or Paxos prevent split-brain scenarios and allow automated sub-30 second failover across availability zones.'
    },
    complianceStandard: {
      standard: 'PCI-DSS v4.0',
      controlId: 'Req 3.4 & Req 10.2 - Database Protection & Audit Trails',
      requirement: 'All cardholder database storage must be encrypted at rest with hardware HSM-managed keys and all administrative transactions logged immutably.'
    },
  },

  'networking-environment': {
    domainId: 'networking-environment',
    domainNumber: 4,
    domainTitle: 'Networking Environment',
    lawOrTheorem: {
      name: 'Saltzer & Schroeder’s Compartmentalization & Defense in Depth',
      founder: 'Jerome Saltzer & Michael Schroeder',
      year: '1975',
      formalStatement: 'Every program and every privileged user of the system should operate using the least amount of privilege necessary to complete the job. Compartmentalize trust zones so that breach of one cannot compromise the whole.',
      architecturalApplication: 'Multi-tier VPC topologies enforce this by isolating databases in private, non-routable subnets with NAT Gateways for egress only and no ingress internet routes.',
      mathematicalFormula: 'P(\\text{breach}) = \\prod_{k=1}^m p_k',
      formulaExplanation: 'Where p_k is the chance an attacker bypasses layer k (Security Groups, NACLs, Private Subnets) and the layers fail independently. The attacker must beat every layer, so with three layers at 10% each the breach chance is 0.1%.'
    },
    awsWhitepaper: {
      title: 'Building a Modular and Scalable Virtual Private Cloud (VPC) Architecture',
      docCode: 'AWS-VPC-REFERENCE-2024',
      pillarBestPracticeCode: 'SEC05 - Protect network resources; SEC06 - Protect compute resources',
      canonicalQuote: 'Create layered security controls at perimeter, VPC, subnet, and host interfaces. Never place production databases in public subnets with direct 0.0.0.0/0 route table entries.'
    },
    buildersLibrary: {
      title: 'Network isolation and VPC peering architectures',
      author: 'Colm MacCárthaigh',
      role: 'VP and Distinguished Engineer, AWS',
      coreInsight: 'Isolating control planes from data planes at the network layer prevents lateral movement during host-level security compromises.'
    },
    complianceStandard: {
      standard: 'NIST SP 800-207',
      controlId: 'Zero Trust Architecture (ZTA)',
      requirement: 'No network implicitly carries trust based solely on physical or IP perimeter location; per-packet verification and microsegmentation are required.'
    },
  },

  'connecting-networks': {
    domainId: 'connecting-networks',
    domainNumber: 5,
    domainTitle: 'Connecting Networks',
    lawOrTheorem: {
      name: 'Complete-Graph Edge Count: Full-Mesh Peering vs Hub-and-Spoke',
      founder: 'Robert Metcalfe',
      year: '1980',
      formalStatement: 'The number of peer-to-peer connections in an n-node mesh network grows quadratically as n(n - 1) / 2, leading to exponential routing table bloat and failure overhead.',
      architecturalApplication: 'AWS Transit Gateway replaces complex full-mesh VPC peering meshes (O(n^2)) with a centralized hub-and-spoke model (O(n)), drastically simplifying route propagation and security audits.',
      mathematicalFormula: '\\text{Peering Edges} = \\frac{N(N-1)}{2} \\quad \\implies \\quad \\text{Transit Gateway} = N',
      formulaExplanation: 'For 20 VPCs: Full mesh requires 190 peering links and route entries. AWS Transit Gateway requires only 20 attachments.'
    },
    awsWhitepaper: {
      title: 'Hybrid Connectivity & AWS Transit Gateway Architecture',
      docCode: 'AWS-TGW-HYBRID-2024',
      pillarBestPracticeCode: 'REL03 - Design service architecture with resilient connectivity',
      canonicalQuote: 'Transit Gateway acts as a cloud router, simplifying network topologies and eliminating complex peering matrices while enabling centralized network inspection appliances.'
    },
    buildersLibrary: {
      title: 'Managing network traffic spikes with AWS Direct Connect',
      author: 'Peter Vosshall',
      role: 'Vice President & Distinguished Engineer, AWS',
      coreInsight: 'Redundant hybrid uplinks with BGP multipath routing (ECMP) guarantee active-active failover without human intervention during optical fiber cuts.'
    },
    complianceStandard: {
      standard: 'CIS AWS Foundations Benchmark',
      controlId: 'Sec 4.1 - Monitoring and Gateway Transit Inspections',
      requirement: 'Centralized egress firewalls and routing hubs must be established to monitor all east-west and north-south corporate communications.'
    },
  },

  'securing-applications': {
    domainId: 'securing-applications',
    domainNumber: 6,
    domainTitle: 'Securing Applications & Data Access',
    lawOrTheorem: {
      name: 'Kerckhoffs’s Principle & Shannon’s Maxim',
      founder: 'Auguste Kerckhoffs / Claude Shannon',
      year: '1883 / 1949',
      formalStatement: 'A cryptographic system should be secure even if everything about the system, except the key, is public knowledge ("The enemy knows the system").',
      architecturalApplication: 'Hardcoding credentials in source code or environment variables violates this principle. AWS Secrets Manager with AWS KMS envelope encryption protects secrets with automated key rotation and hardware HSM root-of-trust.',
      mathematicalFormula: 'C = E(K_{\\text{DEK}}, P) \\quad \\text{and} \\quad K_{\\text{enc}} = E(K_{\\text{CMK}}, K_{\\text{DEK}})',
      formulaExplanation: 'Envelope Encryption: Data P is encrypted by Data Encryption Key (DEK). The DEK is encrypted under AWS KMS Customer Master Key (CMK) inside FIPS-validated hardware security modules.'
    },
    awsWhitepaper: {
      title: 'AWS Security Pillar - Well-Architected Framework',
      docCode: 'AWS-WAF-SEC-2024',
      pillarBestPracticeCode: 'SEC01 - Separate workloads; SEC02 - Manage identities; SEC03 - Permissions',
      canonicalQuote: 'Apply security at all layers. Protect data in transit and at rest. Keep people away from data. Automate security best practices and incident response mechanisms.'
    },
    buildersLibrary: {
      title: 'Automating safe credential rotation at scale',
      author: 'Becky Weiss',
      role: 'VP and Distinguished Engineer, AWS',
      coreInsight: 'Human-managed credentials are an architectural anti-pattern. IAM Roles for EC2/ECS and Secrets Manager Lambdas completely eliminate permanent static credentials.'
    },
    complianceStandard: {
      standard: 'NIST SP 800-53 Rev. 5',
      controlId: 'AC-6 - Least Privilege & SC-13 Cryptographic Protection',
      requirement: 'Employ cryptographic mechanisms with automated lifecycle rotation and attribute-based access control (ABAC).'
    },
  },

  'monitoring-elasticity': {
    domainId: 'monitoring-elasticity',
    domainNumber: 7,
    domainTitle: 'Monitoring, Elasticity & High Availability',
    lawOrTheorem: {
      name: 'High Availability Probability Formula (Parallel vs Series Systems)',
      founder: 'Reliability Engineering Principles',
      year: '1965',
      formalStatement: 'System availability in series multiplies: A = A_1 * A_2. System availability in parallel redundancy increases exponentially: A = 1 - (1 - A_1)^n.',
      architecturalApplication: 'A single server with 99.0% SLA provides 3.65 days of annual downtime. Deploying 3 parallel instances across independent Availability Zones with Application Load Balancers raises availability to 99.9999% (31 seconds annual downtime).',
      mathematicalFormula: 'A_{\\text{parallel}} = 1 - \\prod_{i=1}^{N} (1 - A_i)',
      formulaExplanation: 'For N=3 AZs each with 99.9% availability: A = 1 - (0.001)^3 = 0.999999999 (Nine 9s availability for compute tier redundancy).'
    },
    awsWhitepaper: {
      title: 'Reliability Pillar - High Availability and Elasticity in AWS',
      docCode: 'AWS-WAF-REL-HA-2024',
      pillarBestPracticeCode: 'REL06 - Monitor system health; REL07 - Design to mitigate failures',
      canonicalQuote: 'Workload components must monitor health continuously. If an instance fails its health check, the load balancer stops routing traffic immediately and Auto Scaling automatically replaces it.'
    },
    buildersLibrary: {
      title: 'Health checks in distributed systems',
      author: 'David Yanacek',
      role: 'Senior Principal Engineer, AWS',
      coreInsight: 'Deep health checks that verify downstream database dependencies can trigger cascading outages if downstream services stutter. Use shallow health checks for routing and deep health checks for alerting.'
    },
    complianceStandard: {
      standard: 'ISO/IEC 27001',
      controlId: 'A.12.1.3 - Capacity Management & Monitoring',
      requirement: 'The use of resources shall be monitored, tuned, and projections made of future capacity requirements to ensure the required system performance.'
    },
  },

  'automating-architecture': {
    domainId: 'automating-architecture',
    domainNumber: 8,
    domainTitle: 'Automating the Architecture',
    lawOrTheorem: {
      name: 'Conway’s Law & The Declarative Infrastructure Convergence Principle',
      founder: 'Melvin Conway',
      year: '1968',
      formalStatement: 'Organizations which design systems are constrained to produce designs which are copies of the communication structures of these organizations. Automated declarative state convergence prevents manual drift and divergence.',
      architecturalApplication: 'Infrastructure as Code (Terraform / AWS CloudFormation) codifies architectural best practices, version-controls state, and guarantees identical, immutable deployments across testing and production environments.',
      mathematicalFormula: '\\lim_{t \\to \\infty} \\Delta(S_{\\text{desired}}, S_{\\text{actual}}) = 0',
      formulaExplanation: 'Automated CI/CD git-ops engines continuously converge actual infrastructure state towards desired version-controlled code specifications.'
    },
    awsWhitepaper: {
      title: 'Operational Excellence Pillar - AWS Well-Architected Framework',
      docCode: 'AWS-WAF-OPS-2024',
      pillarBestPracticeCode: 'OPS04 - Implement observability; OPS05 - Use Infrastructure as Code',
      canonicalQuote: 'Perform operations as code. Make small, frequent, reversible changes. Anticipate failure and evolve operations procedures continuously.'
    },
    buildersLibrary: {
      title: 'Automating safe, hands-off deployments',
      author: 'Clare Liguori',
      role: 'Senior Principal Engineer, AWS',
      coreInsight: 'Rollouts must use fractional canary deployments with automated rollback alarms triggered by p99 latency spikes or elevated 5xx error responses.'
    },
    complianceStandard: {
      standard: 'SOC 2 Type II',
      controlId: 'CC8.1 - Change Management & Version Control',
      requirement: 'All changes to infrastructure components must be authorized, tested, and tracked in immutable source control logs.'
    },
  },

  'caching-content': {
    domainId: 'caching-content',
    domainNumber: 9,
    domainTitle: 'Caching Content',
    lawOrTheorem: {
      name: 'Zipf’s Law & The 80/20 Pareto Principle of Workload Data Access',
      founder: 'George Kingsley Zipf / Vilfredo Pareto',
      year: '1935 / 1906',
      formalStatement: 'In most distributed applications, frequency of access to content follows a power-law distribution where roughly 80% of read requests target 20% of the data items.',
      architecturalApplication: 'Amazon CloudFront and Amazon ElastiCache intercept this top 20% slice at edge and in-memory tiers, shielding database origins from 90%+ of repetitive read query load.',
      mathematicalFormula: 'T_{\\text{eff}} = H \\cdot T_{\\text{cache}} + (1 - H) \\cdot T_{\\text{origin}}',
      formulaExplanation: 'Effective latency: With 95% cache hit ratio (H=0.95), T_cache=2ms, and T_origin=80ms: T_eff = 0.95(2) + 0.05(80) = 5.9ms (a 92.6% reduction in latency).'
    },
    awsWhitepaper: {
      title: 'Caching Strategies with Amazon ElastiCache and CloudFront',
      docCode: 'AWS-CACHE-STRATEGIES-2024',
      pillarBestPracticeCode: 'PERF03 - Fast data storage; COST06 - Reduce data transfer fees',
      canonicalQuote: 'Implement caching across every tier: at edge locations (CloudFront), in-memory compute (ElastiCache), and within application execution caches to eliminate redundant computation.'
    },
    buildersLibrary: {
      title: 'Caching made simple and robust',
      author: 'Marc Brooker',
      role: 'VP and Distinguished Engineer, AWS',
      coreInsight: 'Cache stampedes and dogpiling occur when cached keys expire simultaneously under load. Use probabilistic early expiration or distributed locks to protect origin databases.'
    },
    complianceStandard: {
      standard: 'PCI-DSS v4.0',
      controlId: 'Req 3.2 - Sensitive Authentication Data Storage',
      requirement: 'Ensure in-memory caching tiers (Redis/Memcached) do not inadvertently persist unencrypted CVV or primary account numbers in volatile memory dumps.'
    },
  },

  'decoupled-architecture': {
    domainId: 'decoupled-architecture',
    domainNumber: 10,
    domainTitle: 'Building Decoupled Architecture',
    lawOrTheorem: {
      name: 'The Two Generals’ Problem & Asynchronous Loose Coupling',
      founder: 'Distributed Computing Theory',
      year: '1975',
      formalStatement: 'Two entities communicating over an unreliable link cannot reach 100% certainty of agreement with bounded messages. Synchronous RPC chains multiply unreliability: Availability = Product of all intermediate service availabilities.',
      architecturalApplication: 'Amazon SQS and Amazon SNS decouple sender and receiver components. If downstream inventory services stutter or crash, SQS buffers messages safely with zero data loss.',
      mathematicalFormula: 'A_{\\text{chain}} = \\prod_{i=1}^M A_i \\quad \\implies \\quad (0.99)^5 = 0.951',
      formulaExplanation: 'A synchronous chain of 5 microservices each at 99% SLA drops composite availability to 95.1%. Asynchronous queueing decouples them to independent isolated SLAs.'
    },
    awsWhitepaper: {
      title: 'Microservices and Decoupled Messaging Architecture on AWS',
      docCode: 'AWS-MESSAGING-DECOUPLE-2024',
      pillarBestPracticeCode: 'REL04 - Segment your workload; REL05 - Design to withstand component failure',
      canonicalQuote: 'Decouple components to reduce dependencies. If one component fails, other components can continue to operate and buffer requests using message queues.'
    },
    buildersLibrary: {
      title: 'Timeouts, retries, and backoff with jitter',
      author: 'Marc Brooker',
      role: 'VP and Distinguished Engineer, AWS',
      coreInsight: 'Without exponential backoff and randomized jitter, retrying clients synchronize their traffic waves, creating destructive harmonic retry storms that keep failing systems down.'
    },
    complianceStandard: {
      standard: 'NIST SP 800-53 Rev. 5',
      controlId: 'SC-5 - Denial of Service Protection',
      requirement: 'The information system protects against or limits the effects of denial of service attacks by employing queuing and rate limiting mechanisms.'
    },
  },

  'serverless-microservices': {
    domainId: 'serverless-microservices',
    domainNumber: 11,
    domainTitle: 'Serverless Architecture & Microservices',
    lawOrTheorem: {
      name: 'Little’s Law & Zero Idle Capacity Economics',
      founder: 'John D. C. Little',
      year: '1961',
      formalStatement: 'The average number of items L in a stationary queueing system equals the long-term average arrival rate λ multiplied by the average time W that an item spends in the system: L = λW.',
      architecturalApplication: 'Serverless architectures (AWS Lambda, API Gateway) scale capacity dynamically to match Little’s Law ($L = \\lambda W$) per millisecond, reducing idle server waste to literally $0.00 when traffic drops to zero.',
      mathematicalFormula: 'L = \\lambda \\cdot W \\quad \\implies \\quad \\text{Cost} = \\sum_{k=1}^N (\\text{RAM}_k \\times \\text{Time}_k)',
      formulaExplanation: 'Compute expenditure scales strictly with executed transactions rather than paying 24/7 for overprovisioned idle EC2 cores.'
    },
    awsWhitepaper: {
      title: 'Serverless Applications Lens - AWS Well-Architected Framework',
      docCode: 'AWS-WAF-SERVERLESS-LENS-2024',
      pillarBestPracticeCode: 'PERF01 - Select compute resources; COST02 - Evaluate governance',
      canonicalQuote: 'Build with serverless-first architectures. Remove operational overhead of server management, patch management, and idle provisioning.'
    },
    buildersLibrary: {
      title: 'Operating serverless architectures in production',
      author: 'Julian Wood',
      role: 'Principal Developer Advocate, Serverless, AWS',
      coreInsight: 'Optimize function cold starts using Lambda SnapStart for Java or light container runtimes, keeping memory sizing tuned for execution speed rather than raw cost.'
    },
    complianceStandard: {
      standard: 'SOC 2 Type II',
      controlId: 'CC6.6 - Boundary Protection and Serverless Run-time Isolation',
      requirement: 'Compute workloads run inside hardened, ephemeral micro-VM execution boundaries (such as AWS Firecracker) with per-function IAM role isolation.'
    },
  },

  'data-pipelines': {
    domainId: 'data-pipelines',
    domainNumber: 12,
    domainTitle: 'Data Pipelines',
    lawOrTheorem: {
      name: 'Lambda Architecture vs Kappa Architecture (Nathan Marz / Jay Kreps)',
      founder: 'Nathan Marz / Jay Kreps',
      year: '2011 / 2014',
      formalStatement: 'Data processing can be unified into a single stream processing system (Kappa) or bifurcated into speed-layer and batch-layer pipelines (Lambda) to balance real-time freshness against comprehensive batch accuracy.',
      architecturalApplication: 'AWS offers streaming ingestion via Amazon Kinesis and MSK (Kafka) for sub-second dashboards, with Amazon S3 data lake storage queried directly by AWS Glue and Amazon Athena serverless SQL.',
      mathematicalFormula: 'T_{\\text{pipeline}} = T_{\\text{ingest}} + T_{\\text{transform}} + T_{\\text{load}}',
      formulaExplanation: 'Serverless event-driven ingestion decouples ingestion time from analytical query runtimes, enabling petabyte analytics without cluster sizing constraints.'
    },
    awsWhitepaper: {
      title: 'Data Analytics Lens - AWS Well-Architected Framework',
      docCode: 'AWS-WAF-ANALYTICS-2024',
      pillarBestPracticeCode: 'PERF05 - Optimize data storage; SUS02 - Align resource usage with demand',
      canonicalQuote: 'Adopt columnar formats like Apache Parquet and partition datasets by date and category to minimize query scan volume and maximize analytical throughput.'
    },
    buildersLibrary: {
      title: 'Building resilient real-time streaming architectures',
      author: 'Ian Meyers',
      role: 'Principal Solutions Architect, AWS',
      coreInsight: 'Decoupling streaming shards from consumer worker processing fleets prevents checkpoint lag and guarantees idempotent reprocessing upon transient node reboots.'
    },
    complianceStandard: {
      standard: 'HIPAA & GDPR',
      controlId: 'Right to Be Forgotten & PHI Audit Records',
      requirement: 'Data pipelines must provide cryptographic pseudonymization and automated lifecycle deletion policies for sensitive personal data records.'
    },
  },

  'disaster-recovery': {
    domainId: 'disaster-recovery',
    domainNumber: 13,
    domainTitle: 'Disaster Recovery (DR) Planning & Management',
    lawOrTheorem: {
      name: 'The RTO/RPO Cost Trade-off (Qualitative Heuristic)',
      founder: 'AWS Well-Architected Reliability Pillar',
      year: '2021',
      formalStatement: 'Anything that can go wrong will go wrong. The cost of disaster recovery increases asymptotically as RTO (Recovery Time Objective) and RPO (Recovery Point Objective) approach zero.',
      architecturalApplication: 'The AWS Well-Architected Framework categorizes DR into 4 distinct strategies (Backup & Restore, Pilot Light, Warm Standby, Multi-Region Active-Active), letting businesses align engineering spend directly with downtime cost impact.',
      mathematicalFormula: '\\text{Lower RTO and RPO} \\Rightarrow \\text{Higher Standby Cost}',
      formulaExplanation: 'A trade-off, not a fitted equation. Backup & Restore (24h RTO) costs 1x; Pilot Light (2h RTO, 10 min RPO) about 2.5x; Warm Standby (10 min RTO) about 4x; Multi-Region Active-Active (under 30s RTO) about 7x in this model.'
    },
    awsWhitepaper: {
      title: 'Disaster Recovery of Workloads on AWS: Recovery in the Cloud',
      docCode: 'AWS-DR-WHITE-2024',
      pillarBestPracticeCode: 'REL13 - Plan for disaster recovery; REL14 - Automate recovery',
      canonicalQuote: 'Test your disaster recovery strategies regularly. Automatically simulate outages and validate that systems recover within defined RTO and RPO boundaries.'
    },
    buildersLibrary: {
      title: 'Continuous resilience testing with Chaos Engineering',
      author: 'Adrian Hornsby',
      role: 'Principal Technical Evangelist, Architecture, AWS',
      coreInsight: 'If you have not tested your failover runbook in the last 30 days under synthetic failure conditions, your failover system will not work during a real regional catastrophe.'
    },
    complianceStandard: {
      standard: 'NIST SP 800-34 Rev. 1',
      controlId: 'Contingency Planning (CP) & Business Continuity',
      requirement: 'Maintain documented and validated disaster recovery capabilities with measurable RTO and RPO metrics tested semi-annually.'
    },
  },

  'executive-conclusion': {
    domainId: 'executive-conclusion',
    domainNumber: 14,
    domainTitle: 'Executive Conclusion & Architectural Verdict',
    lawOrTheorem: {
      name: 'The Law of Demeter & Evolutionary Architecture Principle',
      founder: 'Ian Holland / Neal Ford, Rebecca Parsons',
      year: '1987 / 2017',
      formalStatement: 'An evolutionary architecture supports guided, incremental change across multiple dimensions. Architectural fitness functions protect core qualities from degrading over time.',
      architecturalApplication: 'The AWS Well-Architected Framework acts as the definitive set of continuous architectural fitness functions, ensuring long-term maintainability, security, and financial viability.',
      mathematicalFormula: '\\text{Fitness}(A) = \\sum_{j=1}^{6} w_j \\cdot \\text{PillarScore}_j',
      formulaExplanation: 'Composite architectural health is a weighted optimization function across all 6 Well-Architected pillars.'
    },
    awsWhitepaper: {
      title: 'AWS Well-Architected Framework: Continuous Improvement Cycle',
      docCode: 'AWS-WAF-EXEC-SIGN-OFF',
      pillarBestPracticeCode: 'OPS11 - Evolve operations; COST11 - Be a cost-effective organization',
      canonicalQuote: 'Architecture is not a static one-time sign-off; it is a continuous evolution driven by data, testing, and periodic Well-Architected Reviews.'
    },
    buildersLibrary: {
      title: 'Building evolutionary architectures at Amazon',
      author: 'Werner Vogels',
      role: 'Chief Technology Officer, Amazon.com',
      coreInsight: 'Systems change constantly. Build architectures that assume failure will happen, decouple every dependency, and treat security and operational excellence as continuous cultural disciplines.'
    },
    complianceStandard: {
      standard: 'NIST / ISO / SOC 2 Continuous Compliance',
      controlId: 'Annual Executive Review & Architecture Re-certification',
      requirement: 'Formal architectural re-evaluations must occur annually or upon major topology revisions.'
    },
  }
};
