import { DomainData } from '../../types';

export const networkingDomain: DomainData = {
  id: 'networking-environment',
  number: 4,
  title: 'Networking Environment',
  subtitle: '3-Tier Multi-AZ VPC with Private/Isolated Subnets vs. Flat Public Default VPC',
  category: 'Network & Connectivity',
  pillars: ['Security', 'Reliability', 'Operational Excellence'],
  customerRequirement: {
    clientName: 'PayShield Global Payments',
    businessGoal: 'Host payment gateway APIs and merchant database in AWS while meeting strict PCI-DSS Level 1 compliance for network isolation.',
    challenges: [
      'Zero public routability allowed to backend databases',
      'Must inspect all ingress and egress network traffic',
      'Developer remote access needed without exposing open internet ports'
    ],
    budgetOrSlaTarget: 'PCI-DSS Compliance | 0 Public DB Endpoints | 100% Traffic Audited'
  },
  normalPrescription: {
    title: 'Default AWS VPC with Flat Public Subnet & 0.0.0.0/0 SG Rules',
    prescribedServices: 'AWS Default VPC (172.31.0.0/16) with all instances on public IPv4 addresses and 0.0.0.0/0 open on port 3306 for remote access',
    whyItSeemsLogical: 'Fastest way to get instances communicating without configuring route tables or NAT Gateways.',
    whyItFailsInProduction: [
      'Database port 3306 directly exposed to automated Shodan port scanners and botnets',
      'Flat network has zero perimeter containment: compromising a web server gives direct access to DB',
      'No VPC Flow Logs: impossible to trace data exfiltration or prove PCI-DSS compliance'
    ]
  },
  wafTransformationSummary: 'WAF establishes a strict 3-tier VPC spanning 3 AZs with Public subnets (ALB/NAT), Private subnets (App containers), and Isolated subnets (Database). Security groups enforce referential chaining, and VPC Flow Logs stream to CloudWatch.',

  naive: {
    name: 'Default VPC with Flat Public Subnet & 0.0.0.0/0 Exposure',
    tagline: 'All servers and databases reside on public IP addresses',
    description: 'The workload is deployed inside the AWS account default VPC. Application servers and database instances are assigned public IPv4 addresses. Security groups allow port 3306 (MySQL) and port 22 (SSH) from 0.0.0.0/0 for developer convenience. VPC Flow Logs are disabled.',
    bulletPoints: [
      'Production database directly reachable over the public internet on default port 3306',
      'Flat network topology: no defense-in-depth or network boundary separation',
      'Wide open Security Groups (0.0.0.0/0) exposed to brute force password spray attacks',
      'No VPC Flow Logs: zero visibility into malicious egress or lateral movement'
    ],
    nodes: [
      { id: 'n-attacker', name: 'Internet Port Scanner / Botnet', type: 'client', service: 'Public Web Scanner', tier: 'edge', status: 'degraded' },
      { id: 'n-flat-vpc', name: 'Default Flat VPC (172.31.0.0/16)', type: 'network', service: 'AWS Default VPC', tier: 'public', isSPOF: true, status: 'healthy' },
      { id: 'n-pub-db', name: 'Public MySQL (Port 3306 Open)', type: 'database', service: 'Database with Public IPv4', tier: 'public', isSPOF: true, status: 'healthy', description: '0.0.0.0/0 SG rule open to the world' }
    ],
    connections: [
      { from: 'n-attacker', to: 'n-pub-db', label: 'Direct Unrestricted TCP 3306', type: 'sync' },
      { from: 'n-flat-vpc', to: 'n-pub-db', label: 'Default Route Table (IGW direct)', type: 'sync' }
    ],
    monthlyCostEst: 45,
    availabilitySLA: '98.5%',
    rto: 'Manual Incident Triage',
    rpo: 'Compromised Integrity',
    scores: {
      operationalExcellence: 20,
      security: 10,
      reliability: 35,
      performanceEfficiency: 50,
      costOptimization: 70,
      sustainability: 50
    },
    iacSnippet: {
      language: 'hcl',
      filename: 'anti_pattern_vpc.tf',
      code: `# ANTI-PATTERN: Database in public subnet with 0.0.0.0/0 ingress
resource "aws_security_group" "bad_database_sg" {
  name        = "db-public-access"
  description = "Open to world for remote dev access"

  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # CATASTROPHIC SECURITY FLAW!
  }
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Open SSH to world!
  }
}`,
      notes: 'Exposing MySQL port 3306 and SSH port 22 directly to 0.0.0.0/0 is a critical compliance violation and leading cause of ransomware breaches.'
    }
  },
  wellArch: {
    name: 'Enterprise 3-Tier Multi-AZ VPC with Strict Isolation & Flow Logs',
    tagline: 'Public (ALB/NAT), Private (App), and Isolated (DB) subnets across 3 AZs',
    description: 'Rigorous network perimeter segmentation. Public subnets contain only ALBs and managed NAT Gateways. Application containers run in private subnets with egress via NAT. Database clusters reside in completely isolated subnets with zero internet gateway route. Security groups use stateful referential chaining.',
    bulletPoints: [
      'Strict 3-Tier architecture spanning 3 Availability Zones with dedicated route tables',
      'Database has ZERO public IPv4 address and no route to the Internet Gateway',
      'Security Groups enforce referential rules: Database only accepts TCP 3306 from App SG ID',
      'VPC Flow Logs capture 100% of network traffic metadata with automated anomaly detection'
    ],
    nodes: [
      { id: 'w-net-users', name: 'External Traffic', type: 'client', service: 'Legitimate Clients', tier: 'edge', status: 'healthy' },
      { id: 'w-igw', name: 'Internet Gateway (IGW)', type: 'gateway', service: 'AWS IGW', tier: 'public', isSPOF: false, status: 'healthy' },
      { id: 'w-sub-pub', name: 'Public Subnet (ALB + NAT GW)', type: 'network', service: 'Public Subnet (AZ-a/b/c)', tier: 'public', isSPOF: false, status: 'healthy' },
      { id: 'w-sub-priv', name: 'Private Subnet (App ECS/EC2)', type: 'network', service: 'Private Subnet (Outbound via NAT)', tier: 'private', isSPOF: false, status: 'healthy' },
      { id: 'w-sub-iso', name: 'Isolated Subnet (Aurora DB)', type: 'database', service: 'Isolated Subnet (No Internet Route)', tier: 'isolated', isSPOF: false, status: 'healthy' }
    ],
    connections: [
      { from: 'w-net-users', to: 'w-igw', label: 'HTTPS 443 Only', type: 'sync' },
      { from: 'w-igw', to: 'w-sub-pub', label: 'Public Ingress to ALB', type: 'sync' },
      { from: 'w-sub-pub', to: 'w-sub-priv', label: 'Internal Reverse Proxy', type: 'sync' },
      { from: 'w-sub-priv', to: 'w-sub-iso', label: 'Referential SG TCP 3306 Only', type: 'sync' }
    ],
    monthlyCostEst: 145,
    availabilitySLA: '99.99%',
    rto: 'N/A (Immune to Direct Ingress)',
    rpo: 'Zero Exposure',
    scores: {
      operationalExcellence: 95,
      security: 99,
      reliability: 98,
      performanceEfficiency: 92,
      costOptimization: 85,
      sustainability: 88
    },
    iacSnippet: {
      language: 'hcl',
      filename: 'well_architected_vpc.tf',
      code: `# WELL-ARCHITECTED: 3-Tier VPC with Referential Security Groups
resource "aws_security_group" "app_sg" {
  name        = "app-workload-sg"
  vpc_id      = aws_vpc.main_vpc.id
  # Ingress strictly from ALB SG:
  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }
}

resource "aws_security_group" "db_isolated_sg" {
  name        = "database-isolated-sg"
  vpc_id      = aws_vpc.main_vpc.id

  # Database ONLY accepts connections from Application SG!
  ingress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.app_sg.id]
  }
  # No egress allowed to the Internet!
}`,
      notes: 'Chained referential security groups guarantee that even if an attacker knew the database private IP, direct access from outside the VPC is mathematically impossible.'
    }
  },
  metrics: [
    { label: 'Public Database Attack Surface', naiveValue: '100% Exposed (0.0.0.0/0)', wellArchValue: '0% (Isolated Subnet)', impact: 'positive', explanation: 'Eliminates direct internet routability to core stateful databases.' },
    { label: 'Defense-in-Depth Tiers', naiveValue: '1 (Single flat subnet)', wellArchValue: '3 Tiers across 3 AZs', impact: 'positive', explanation: 'Public, private, and isolated boundaries enforce least privilege networking.' },
    { label: 'Network Visibility & Auditability', naiveValue: '0% (Flow Logs Disabled)', wellArchValue: '100% (VPC Flow Logs to S3/CloudWatch)', impact: 'positive', explanation: 'All accepted and rejected network traffic is indexed for threat analysis.' },
    { label: 'Blast Radius Containment', naiveValue: 'Zero (Full flat access)', wellArchValue: 'Micro-segmented per security group', impact: 'positive', explanation: 'Compromise of a web server does not automatically grant database root access.' }
  ],
  chaos: {
    id: 'chaos-networking',
    title: 'Automated Shodan Port Scan & Brute Force Botnet Assault',
    triggerLabel: 'Simulate Internet Port Scan & Brute Force',
    description: 'An aggressive automated scanning bot sweeps the cloud CIDR block attempting SSH and MySQL dictionary attacks.',
    affectedNodeIds: ['n-pub-db', 'w-sub-iso'],
    naiveConsequence: {
      statusText: 'AUTHENTICATION BREACH & DATA EXFILTRATION',
      errorRate: 'Database CPU 100% locked by brute force connections',
      latency: 'Application queries starved',
      downtime: 'Security incident requiring emergency isolation',
      narrative: 'Port 3306 is open to the globe. Botnet launches thousands of connection attempts per second, discovers weak credentials, dumps database, and leaves a ransom note.'
    },
    wellArchConsequence: {
      statusText: 'ATTACK REPELLED: ZERO INGRESS PACKETS REACH DB',
      errorRate: '0% Impact',
      latency: 'Normal (< 25ms)',
      failoverTime: 'Instant (Perimeter drops packets at IGW/Router)',
      narrative: 'Port scanner cannot even locate the database because it has no public IP address and isolated subnets lack an IGW route. Attack traffic drops harmlessly at the edge.'
    }
  },
  speakerNotes: {
    hook: 'If your production database has a public IPv4 address, you do not have a security posture—you have a ticking time bomb.',
    keyPoints: [
      'A Well-Architected VPC is always partitioned into at least 3 tiers: Public, Private, and Isolated.',
      'Security Groups should reference other Security Groups by ID rather than raw CIDR blocks.',
      'VPC Flow Logs provide crucial forensics for SOC 2, ISO 27001, and HIPAA compliance.'
    ],
    architectTip: 'Utilize AWS Network Access Analyzer and IAM VPC Endpoint Policies to verify that no unauthorized paths exist into your isolated data tiers.',
    examQuestion: 'A company requires that its database tier have no internet connectivity while still receiving connections from an EC2 application tier. What subnet and routing setup is required? (Answer: Place the database in an isolated subnet with no route to an IGW or NAT GW, allowing ingress only from the application security group).'
  }
};
