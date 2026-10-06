import { DomainData } from '../../types';

export const connectingDomain: DomainData = {
  id: 'connecting-networks',
  number: 5,
  title: 'Connecting Networks',
  subtitle: 'AWS Transit Gateway Hub-and-Spoke with Direct Connect & VPN Failover vs. O(N²) Peering Mesh',
  category: 'Network & Connectivity',
  pillars: ['Reliability', 'Operational Excellence', 'Security'],
  customerRequirement: {
    clientName: 'OmniCorp Multi-National Enterprise',
    businessGoal: 'Interconnect 25 spoke VPCs across business units with on-premises headquarters and partner data centers with centralized security inspection.',
    challenges: [
      'Point-to-point VPC peering requires 300 separate connections (O(N²))',
      'Corporate headquarters needs high-bandwidth private connectivity that survives fiber cuts',
      'Need centralized egress inspection for malware and data loss prevention'
    ],
    budgetOrSlaTarget: '99.99% Connectivity SLA | < 5s Carrier Failover | Centralized Egress Firewall'
  },
  normalPrescription: {
    title: 'Full Mesh of VPC Peering Connections & Single Internet IPsec VPN',
    prescribedServices: 'VPC Peering mesh + single AWS Site-to-Site VPN over public broadband',
    whyItSeemsLogical: 'Peering connections have no hourly charge; VPN is simple to deploy from the console.',
    whyItFailsInProduction: [
      'Peering does not support transitive routing: adding 1 VPC requires updating 24 route tables',
      'Single VPN tunnel drops during ISP brownouts, disconnecting headquarters',
      'No central inspection point: each VPC has its own unmonitored internet gateway'
    ]
  },
  wafTransformationSummary: 'WAF deploys AWS Transit Gateway (TGW) as a regional hub-and-spoke router with redundant Direct Connect and BGP VPN failover, plus a Centralized Egress VPC with AWS Network Firewall.',

  naive: {
    name: 'Fragile VPC Peering Mesh & Single IPsec VPN',
    tagline: 'O(N²) point-to-point connections with manual route tables',
    description: 'Multiple VPCs across development, staging, shared services, and production are connected via individual VPC peering connections. As VPC count reaches 10, managing 45 separate peering routes becomes unmaintainable. Connectivity to on-premises relies on a single unmanaged IPsec VPN over the public internet.',
    bulletPoints: [
      'Route table sprawl: adding one new VPC requires updating route tables in every single existing VPC',
      'No transitive routing: VPC A cannot talk to VPC C through VPC B',
      'Single IPsec VPN: internet brownouts disconnect corporate headquarters entirely',
      'No centralized egress inspection or centralized Network Firewall'
    ],
    nodes: [
      { id: 'n-corp-onprem', name: 'Corporate HQ Data Center', type: 'on-premises', service: 'On-Premises Cisco Router', tier: 'on-premises', status: 'healthy' },
      { id: 'n-single-vpn', name: 'Single IPsec VPN (Internet)', type: 'network', service: 'AWS Site-to-Site VPN (Single tunnel)', tier: 'public', isSPOF: true, status: 'healthy', description: 'Subject to internet routing flaps' },
      { id: 'n-mesh-vpc-a', name: 'Prod VPC A', type: 'network', service: 'VPC 10.1.0.0/16', tier: 'cloud', isSPOF: false, status: 'healthy' },
      { id: 'n-mesh-vpc-b', name: 'Staging VPC B', type: 'network', service: 'VPC 10.2.0.0/16', tier: 'cloud', isSPOF: false, status: 'healthy' },
      { id: 'n-mesh-vpc-c', name: 'Shared Services VPC C', type: 'network', service: 'VPC 10.3.0.0/16', tier: 'cloud', isSPOF: false, status: 'healthy' }
    ],
    connections: [
      { from: 'n-corp-onprem', to: 'n-single-vpn', label: 'Public Internet Tunnel', type: 'sync' },
      { from: 'n-single-vpn', to: 'n-mesh-vpc-a', label: 'Static VPN Route', type: 'sync' },
      { from: 'n-mesh-vpc-a', to: 'n-mesh-vpc-b', label: 'Peering Route A-B', type: 'sync' },
      { from: 'n-mesh-vpc-b', to: 'n-mesh-vpc-c', label: 'Peering Route B-C', type: 'sync' },
      { from: 'n-mesh-vpc-a', to: 'n-mesh-vpc-c', label: 'Peering Route A-C', type: 'sync' }
    ],
    monthlyCostEst: 210,
    availabilitySLA: '98.0%',
    rto: '3 Hours',
    rpo: 'In-Transit Packet Drop',
    scores: {
      operationalExcellence: 25,
      security: 40,
      reliability: 30,
      performanceEfficiency: 45,
      costOptimization: 50,
      sustainability: 45
    },
    iacSnippet: {
      language: 'hcl',
      filename: 'anti_pattern_peering.tf',
      code: `# ANTI-PATTERN: N*(N-1)/2 mesh of VPC peering connections
resource "aws_vpc_peering_connection" "mesh_1" {
  peer_vpc_id = aws_vpc.vpc_b.id
  vpc_id      = aws_vpc.vpc_a.id
  auto_accept = true
}

resource "aws_vpc_peering_connection" "mesh_2" {
  peer_vpc_id = aws_vpc.vpc_c.id
  vpc_id      = aws_vpc.vpc_a.id
  auto_accept = true
}

# Every new VPC requires dozens of repetitive route updates:
resource "aws_route" "route_a_to_b" {
  route_table_id            = aws_route_table.rt_a.id
  destination_cidr_block    = "10.2.0.0/16"
  vpc_peering_connection_id = aws_vpc_peering_connection.mesh_1.id
}`,
      notes: 'Scales with O(N²) complexity. VPC peering does not support transitive routing, leading to operational gridlock.'
    }
  },
  wellArch: {
    name: 'AWS Transit Gateway Hub-and-Spoke with Direct Connect & VPN Failover',
    tagline: 'Centralized cloud routing, AWS Network Firewall egress, and BGP resilience',
    description: 'Scalable regional hub-and-spoke topology. AWS Transit Gateway (TGW) consolidates connectivity across hundreds of VPCs and corporate on-premises locations. Dedicated AWS Direct Connect links provide dedicated low-latency bandwidth with automated BGP failover to IPsec VPN. Centralized Egress VPC with AWS Network Firewall inspects all outbound internet traffic.',
    bulletPoints: [
      'Linear O(N) operational complexity: attach any new VPC in seconds without re-touching existing VPCs',
      'Full transitive routing across VPCs, on-prem, and external software partners',
      'Dual active-standby BGP routing: automatic sub-second failover from Direct Connect to VPN',
      'Centralized Egress Inspection VPC with AWS Network Firewall for intrusion prevention (IPS)'
    ],
    nodes: [
      { id: 'w-corp-hybrid', name: 'Corporate Data Center', type: 'on-premises', service: 'Redundant Edge Routers', tier: 'on-premises', status: 'healthy' },
      { id: 'w-dx', name: 'AWS Direct Connect (10 Gbps)', type: 'network', service: 'Dedicated Fiber Interconnect', tier: 'cloud', isSPOF: false, status: 'healthy' },
      { id: 'w-backup-vpn', name: 'Backup IPsec VPN (BGP)', type: 'network', service: 'Dual-Tunnel Automated Failover', tier: 'cloud', isSPOF: false, status: 'healthy' },
      { id: 'w-tgw', name: 'AWS Transit Gateway (TGW)', type: 'gateway', service: 'Central Regional Cloud Router', tier: 'cloud', isSPOF: false, status: 'healthy', description: 'Transitive routing hub supporting up to 50 Gbps/attachment' },
      { id: 'w-egress-fw', name: 'Centralized Egress + AWS Network FW', type: 'security', service: 'Stateful Deep Packet Inspection', tier: 'public', isSPOF: false, status: 'healthy' },
      { id: 'w-spoke-vpcs', name: 'Spoke VPCs (Prod, Staging, Data)', type: 'network', service: 'Multiple Segregated Spoke VPCs', tier: 'private', isSPOF: false, status: 'healthy' }
    ],
    connections: [
      { from: 'w-corp-hybrid', to: 'w-dx', label: 'Primary 10Gbps BGP Route', type: 'sync' },
      { from: 'w-corp-hybrid', to: 'w-backup-vpn', label: 'Standby BGP Path', type: 'failover' },
      { from: 'w-dx', to: 'w-tgw', label: 'Direct Connect Gateway', type: 'sync' },
      { from: 'w-backup-vpn', to: 'w-tgw', label: 'VPN Attachment', type: 'sync' },
      { from: 'w-tgw', to: 'w-spoke-vpcs', label: 'TGW VPC Attachments', type: 'sync' },
      { from: 'w-tgw', to: 'w-egress-fw', label: 'Default 0.0.0.0/0 Egress Route', type: 'sync' }
    ],
    monthlyCostEst: 420,
    availabilitySLA: '99.99%',
    rto: '< 5 Seconds (BGP Keepalive)',
    rpo: '0 Packet Loss',
    scores: {
      operationalExcellence: 96,
      security: 95,
      reliability: 98,
      performanceEfficiency: 94,
      costOptimization: 86,
      sustainability: 88
    },
    iacSnippet: {
      language: 'hcl',
      filename: 'well_architected_transit_gateway.tf',
      code: `# WELL-ARCHITECTED: AWS Transit Gateway Hub-and-Spoke Router
resource "aws_ec2_transit_gateway" "central_tgw" {
  description                     = "Central Regional Transit Gateway"
  auto_accept_shared_attachments = "enable"
  default_route_table_association = "enable"
  default_route_table_propagation = "enable"
  dns_support                     = "enable"
  vpn_ecmp_support                = "enable" # Equal Cost Multi-Path routing
}

resource "aws_ec2_transit_gateway_vpc_attachment" "prod_attach" {
  transit_gateway_id = aws_ec2_transit_gateway.central_tgw.id
  vpc_id             = aws_vpc.production.id
  subnet_ids         = [aws_subnet.prod_tgw_1a.id, aws_subnet.prod_tgw_1b.id]
}`,
      notes: 'Replaces 45+ peering links with a single central router. VPCs scale linearly with zero route table explosion.'
    }
  },
  metrics: [
    { label: 'Routing Complexity', naiveValue: 'O(N²) - 45+ Connections for 10 VPCs', wellArchValue: 'O(N) - 1 TGW Attachment per VPC', impact: 'positive', explanation: 'Adding a 10th VPC requires 1 connection instead of 9 separate peerings.' },
    { label: 'Transitive Routing Support', naiveValue: 'Unsupported (Hard Protocol Limit)', wellArchValue: 'Fully Supported Native Routing', impact: 'positive', explanation: 'Allows seamless communication between on-prem, shared services, and spokes.' },
    { label: 'Direct Connect Failover Time', naiveValue: 'Manual DNS reconfiguration (Hours)', wellArchValue: 'Automatic BGP Failover (< 5 Seconds)', impact: 'positive', explanation: 'BGP dead-peer detection triggers automated traffic shift to VPN.' },
    { label: 'Central Egress Inspection', naiveValue: 'None (Unfiltered direct egress)', wellArchValue: '100% Inspected via AWS Network Firewall', impact: 'positive', explanation: 'Enforces strict outbound domain whitelisting and threat intelligence feeds.' }
  ],
  chaos: {
    id: 'chaos-connecting',
    title: 'Primary Direct Connect Fiber Cut & Carrier Outage',
    triggerLabel: 'Sever Primary Direct Connect Circuit',
    description: 'A physical fiber optic cable cut knocks out the primary 10 Gbps AWS Direct Connect link to corporate headquarters.',
    affectedNodeIds: ['n-single-vpn', 'w-dx'],
    naiveConsequence: {
      statusText: 'COMPLETE HEADQUARTERS ISOLATION',
      errorRate: '100% Inability to Reach Cloud Workloads',
      latency: 'Infinite (Connection Dropped)',
      downtime: '6+ Hours awaiting telecom technician',
      narrative: 'The single unmanaged internet VPN tunnel drops. On-prem engineering, accounting, and logistics systems completely lose connection to AWS cloud workloads.'
    },
    wellArchConsequence: {
      statusText: 'BGP AUTOMATIC FAILOVER TO ENCRYPTED VPN',
      errorRate: 'Zero Disrupted Sessions',
      latency: 'Slight increase (12ms -> 38ms)',
      failoverTime: '3.2 Seconds (BGP Keepalive)',
      narrative: 'BGP router detects Direct Connect loss in 3 seconds. Traffic routes seamlessly through the backup IPsec VPN tunnel into Transit Gateway. End users experience zero interruption.'
    }
  },
  speakerNotes: {
    hook: 'The biggest networking mistake growing startups make is using VPC Peering until they reach 20 VPCs and their engineers are afraid to touch the routing tables.',
    keyPoints: [
      'AWS Transit Gateway turns an exponential routing nightmare into a simple hub-and-spoke model.',
      'Transitive routing is the superpower of TGW that VPC Peering physically cannot provide.',
      'Direct Connect must always be paired with a redundant Direct Connect circuit or an automated BGP IPsec VPN backup for SLA reliability.'
    ],
    architectTip: 'Enable Equal-Cost Multi-Path (ECMP) on Transit Gateway to aggregate throughput across multiple VPN tunnels up to 50 Gbps.',
    examQuestion: 'A company has 20 VPCs and needs to enable communication between all of them while centralizing outbound internet egress. What is the most operationally efficient architecture? (Answer: AWS Transit Gateway with a centralized egress VPC).'
  }
};
