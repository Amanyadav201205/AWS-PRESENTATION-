import { DomainData } from '../../types';

export const computeDomain: DomainData = {
  id: 'compute-layer',
  number: 3,
  title: 'Compute Layer',
  subtitle: 'Auto Scaling, Graviton3 ARM, & Mixed Spot Fleets vs. Static Single-AZ Monolith',
  category: 'Infrastructure Core',
  pillars: ['Performance Efficiency', 'Cost Optimization', 'Reliability', 'Sustainability'],
  customerRequirement: {
    clientName: 'ShopStream Global E-Commerce',
    businessGoal: 'Handle baseline traffic of 5,000 active shoppers while dynamically absorbing sudden 10x traffic bursts (50,000 shoppers) during promotional flash sales with zero downtime and low carbon footprint.',
    challenges: [
      'Traffic fluctuates wildly between 2 AM (idle) and 8 PM (flash sale bursts)',
      'Oversized static instances burn thousands of dollars in idle compute at night',
      'Instance crashes take 10+ minutes to reboot, losing millions in abandoned carts'
    ],
    budgetOrSlaTarget: '99.99% Availability | Compute budget reduced by 60%+'
  },
  normalPrescription: {
    title: 'Single Oversized On-Demand EC2 Instance (m5.4xlarge)',
    prescribedServices: 'Amazon EC2 (1x m5.4xlarge, 16 vCPUs, 64GB RAM) running On-Demand in single AZ',
    whyItSeemsLogical: 'Guarantees the server has plenty of RAM and CPU to handle peaks without having to configure complex load balancing or AMIs.',
    whyItFailsInProduction: [
      'Single Point of Failure: hardware degradation or AZ network partition causes 100% downtime',
      'Burns $580/month 24/7 even when traffic is near zero at 3 AM (8% average CPU utilization)',
      'When viral flash sales exceed 64GB RAM, the OS out-of-memory (OOM) killer kills web processes anyway',
      'Scaling up requires stopping the instance, changing type, and restarting (10 minutes of scheduled downtime)'
    ]
  },
  wafTransformationSummary: 'WAF implements an Auto Scaling Group across 3 AZs behind an ALB. It leverages energy-efficient ARM Graviton3 instances for baseline load, paired with Spot Fleets for batch/bursts, achieving 71% cost reduction with automatic self-healing.',
  naive: {
    name: 'Single Oversized On-Demand EC2 Monolith',
    tagline: 'Static m5.4xlarge running 24/7 in a single Availability Zone',
    description: 'An application is deployed onto a single large m5.4xlarge EC2 instance. The server averages 8% CPU utilization during work hours and 2% at night, burning thousands in idle On-Demand spend. During sudden flash sales, the single instance exhausts RAM and crashes completely.',
    bulletPoints: [
      'Single Point of Failure: No Auto Scaling or Multi-AZ presence',
      'Over-provisioned x86 architecture running 24/7 at peak sizing ($580/mo)',
      'Instance restarts or underlying hypervisor maintenance cause total downtime',
      'Zero elasticity: cannot scale out when traffic spikes beyond physical limits'
    ],
    nodes: [
      { 
        id: 'n-user', 
        name: 'Web Traffic', 
        type: 'client', 
        service: 'Public Users', 
        tier: 'public', 
        status: 'healthy',
        configDetails: {
          specs: 'Unbuffered HTTP/1.1 client connections',
          securityPolicy: 'Direct connection to public IP address',
          costProfile: 'N/A',
          wafAdvantage: 'Direct ingress to single host creates a traffic bottleneck'
        }
      },
      { 
        id: 'n-ec2-big', 
        name: 'Monolith EC2 (m5.4xlarge)', 
        type: 'compute', 
        service: 'Amazon EC2 (us-east-1a)', 
        tier: 'public', 
        isSPOF: true, 
        status: 'healthy', 
        description: 'Single VM running Web + App + Background workers',
        configDetails: {
          specs: '16 vCPUs, 64GB RAM, Intel Xeon x86 running 24/7',
          securityPolicy: 'Direct public IPv4, security group open to 0.0.0.0/0',
          costProfile: '$584/mo ($0.768/hour flat rate)',
          wafAdvantage: 'Replace with Auto Scaling Group spanning 3 AZs with Target Tracking'
        }
      },
      { 
        id: 'n-db-local', 
        name: 'Local App Storage', 
        type: 'storage', 
        service: 'Instance Store / EBS', 
        tier: 'public', 
        isSPOF: true, 
        status: 'healthy',
        configDetails: {
          specs: 'Local root volume storing session state and logs',
          securityPolicy: 'Unencrypted, no automated snapshot schedule',
          costProfile: 'Bundled with instance cost',
          wafAdvantage: 'Decouple state into ElastiCache Redis and S3 for stateless compute'
        }
      }
    ],
    connections: [
      { from: 'n-user', to: 'n-ec2-big', label: 'Unbuffered HTTP Direct', type: 'sync' },
      { from: 'n-ec2-big', to: 'n-db-local', label: 'Local File IO', type: 'sync' }
    ],
    monthlyCostEst: 584,
    availabilitySLA: '99.0%',
    rto: '4 Hours',
    rpo: '12 Hours',
    scores: {
      operationalExcellence: 30,
      security: 40,
      reliability: 25,
      performanceEfficiency: 40,
      costOptimization: 20,
      sustainability: 25
    },
    iacSnippet: {
      language: 'hcl',
      filename: 'anti_pattern_compute.tf',
      code: `# ANTI-PATTERN: Single oversized EC2 instance with no redundancy
resource "aws_instance" "monolith_server" {
  ami           = "ami-0c55b159cbfafe1f0" # Custom golden image
  instance_type = "m5.4xlarge"            # 16 vCPUs, 64GB RAM ($0.768/hr)
  subnet_id     = "subnet-1a-public"      # Single AZ - major SPOF!

  tags = {
    Name = "Production-Everything-Server"
  }
}`,
      notes: 'No Auto Scaling Group, no load balancer, no health check failover, and legacy expensive x86 instance type.'
    }
  },
  wellArch: {
    name: 'Multi-AZ Auto Scaling Group with Graviton3 & Spot Fleets',
    tagline: 'Elastic, container-ready fleet spanned across 3 AZs with ALB',
    description: 'Dynamic elasticity matching supply to real-time demand. An Application Load Balancer distributes requests across an Auto Scaling Group in 3 Availability Zones. Leveraging AWS Graviton3 (c7g) delivers 25% higher performance at 20% lower cost, with Spot instances absorbing batch bursts.',
    bulletPoints: [
      'Multi-AZ resilience: automatically handles loss of an entire AWS Availability Zone',
      'Target tracking scaling policy maintains optimal 60% CPU utilization',
      'AWS Graviton3 ARM processors provide industry-leading energy efficiency & price/performance',
      'Mixed Instances Policy blends On-Demand base capacity with Spot instances for 65% cost savings'
    ],
    nodes: [
      { 
        id: 'w-user', 
        name: 'Global Users', 
        type: 'client', 
        service: 'Web & Mobile Apps', 
        tier: 'edge', 
        status: 'healthy',
        configDetails: {
          specs: 'TLS 1.3 HTTPS traffic from all browsers',
          securityPolicy: 'Edge SSL termination at ALB',
          costProfile: 'N/A',
          wafAdvantage: 'Protected by AWS Shield Standard'
        }
      },
      { 
        id: 'w-alb', 
        name: 'Application Load Balancer', 
        type: 'loadbalancer', 
        service: 'AWS ALB (Multi-AZ)', 
        tier: 'public', 
        isSPOF: false, 
        status: 'healthy', 
        description: 'TLS offloading & path-based routing',
        configDetails: {
          specs: 'Spans 3 AZs with automated cross-zone load balancing',
          securityPolicy: 'AWS WAF attached, TLS 1.3 only',
          costProfile: '$22/mo base + LCU usage',
          wafAdvantage: 'Deep health checking, drops unhealthy nodes in < 15 seconds'
        }
      },
      { 
        id: 'w-asg-1', 
        name: 'ASG Node (AZ-1a)', 
        type: 'compute', 
        service: 'EC2 c7g.large (Graviton3)', 
        tier: 'private', 
        isSPOF: false, 
        status: 'healthy', 
        az: 'us-east-1a',
        configDetails: {
          specs: '2 vCPUs, 4GB RAM, ARM64 architecture',
          securityPolicy: 'Private Subnet, Security Group accepts traffic ONLY from ALB',
          costProfile: '$0.0725/hr On-Demand (20% lower than x86)',
          wafAdvantage: 'High efficiency, automatic termination on unhealthy check'
        }
      },
      { 
        id: 'w-asg-2', 
        name: 'ASG Node (AZ-1b)', 
        type: 'compute', 
        service: 'EC2 c7g.large (Graviton3)', 
        tier: 'private', 
        isSPOF: false, 
        status: 'healthy', 
        az: 'us-east-1b',
        configDetails: {
          specs: '2 vCPUs, 4GB RAM, ARM64 architecture',
          securityPolicy: 'Private Subnet, IAM Role instance profile',
          costProfile: '$0.0725/hr On-Demand',
          wafAdvantage: 'Geographic separation guarantees uptime if AZ-1a fails'
        }
      },
      { 
        id: 'w-asg-3', 
        name: 'ASG Spot Worker (AZ-1c)', 
        type: 'compute', 
        service: 'EC2 c7g.large (Spot)', 
        tier: 'private', 
        isSPOF: false, 
        status: 'healthy', 
        az: 'us-east-1c',
        configDetails: {
          specs: '2 vCPUs, 4GB RAM, Spot allocation',
          securityPolicy: 'Private Subnet, stateless job runner',
          costProfile: '$0.0218/hr (70% discount via Spot)',
          wafAdvantage: 'Absorbs promotional burst spikes at minimal cost'
        }
      }
    ],
    connections: [
      { from: 'w-user', to: 'w-alb', label: 'HTTPS / TLS 1.3', type: 'sync' },
      { from: 'w-alb', to: 'w-asg-1', label: 'Health Checked Round-Robin', type: 'sync' },
      { from: 'w-alb', to: 'w-asg-2', label: 'Health Checked Round-Robin', type: 'sync' },
      { from: 'w-alb', to: 'w-asg-3', label: 'Burstable Batch Stream', type: 'async' }
    ],
    monthlyCostEst: 168,
    availabilitySLA: '99.99%',
    rto: '< 60 Seconds',
    rpo: '0 Seconds',
    scores: {
      operationalExcellence: 92,
      security: 90,
      reliability: 98,
      performanceEfficiency: 95,
      costOptimization: 94,
      sustainability: 96
    },
    iacSnippet: {
      language: 'hcl',
      filename: 'well_architected_compute.tf',
      code: `# WELL-ARCHITECTED: Auto Scaling, Graviton3, Multi-AZ, Target Tracking
resource "aws_autoscaling_group" "app_asg" {
  name_prefix         = "asg-production-"
  vpc_zone_identifier = [aws_subnet.private_1a.id, aws_subnet.private_1b.id, aws_subnet.private_1c.id]
  target_group_arns   = [aws_lb_target_group.app_tg.arn]
  min_size            = 2
  max_size            = 12
  desired_capacity    = 2

  mixed_instances_policy {
    instances_distribution {
      on_demand_base_capacity                  = 2
      on_demand_percentage_above_base_capacity = 30
      spot_allocation_strategy                 = "price-capacity-optimized"
    }
    launch_template {
      launch_template_specification {
        launch_template_id = aws_launch_template.graviton_template.id
      }
      override { instance_type = "c7g.large" } # Graviton3 ARM
      override { instance_type = "m7g.large" }
    }
  }
}`,
      notes: 'Spans 3 AZs with Graviton3 ARM instances. Dynamically scales between 2 and 12 instances while leveraging Spot capacity.'
    }
  },
  metrics: [
    { label: 'Monthly Compute Bill', naiveValue: '$584/mo', wellArchValue: '$168/mo', impact: 'positive', explanation: 'Elastic scaling + Graviton3 + Spot instances cuts compute expenditure by 71%.' },
    { label: 'Workload Availability', naiveValue: '99.0% (Single AZ)', wellArchValue: '99.99% (Multi-AZ ALB)', impact: 'positive', explanation: 'Application survives total AZ failure or host hypervisor crashes.' },
    { label: 'Average CPU Utilization', naiveValue: '8% (Severe Waste)', wellArchValue: '62% (Right-sized)', impact: 'positive', explanation: 'Target tracking ensures servers operate at peak efficiency.' },
    { label: 'Carbon Intensity (Sustainability)', naiveValue: 'High (x86 idle 24/7)', wellArchValue: 'Low (ARM Graviton3 60% less energy)', impact: 'positive', explanation: 'Graviton3 processors consume up to 60% less energy for the same compute output.' }
  ],
  chaos: {
    id: 'chaos-compute',
    title: '10x Flash Sale Traffic Surge & AZ-1a Hard Failure',
    triggerLabel: 'Simulate 10x Spike & AZ Outage',
    description: 'A marketing campaign floods the compute layer with 50,000 req/s while AWS us-east-1a suffers an underlying power disruption.',
    affectedNodeIds: ['n-ec2-big', 'w-asg-1'],
    naiveConsequence: {
      statusText: 'OUT OF MEMORY & TOTAL SYSTEM CRASH',
      errorRate: '100% (502 / 504 Bad Gateway)',
      latency: 'Timeout (> 30,000ms)',
      downtime: 'Hours until manual hardware migration',
      narrative: 'The single EC2 instance hits 100% CPU, exhausts RAM, and the Linux OOM killer terminates the web service. Complete application outage.'
    },
    wellArchConsequence: {
      statusText: 'AUTO-SCALED & SEAMLESS AZ FAILOVER',
      errorRate: '0.01% Transient (< 5 requests)',
      latency: '34ms',
      failoverTime: 'Instant traffic re-route, ASG scale-out < 75s',
      narrative: 'ALB health check marks AZ-1a node unhealthy within 10s and diverts 100% of traffic to healthy nodes in AZ-1b and 1c. ASG launches 4 additional Graviton instances automatically.'
    }
  },
  speakerNotes: {
    hook: 'In the cloud, paying for idle capacity is the architectural equivalent of throwing company money out the window.',
    keyPoints: [
      'AWS Graviton3 instances offer 25% better compute performance and up to 60% lower power consumption compared to x86.',
      'Auto Scaling Target Tracking policies allow the architecture to breathe with actual user demand.',
      'A single EC2 instance is NEVER acceptable for a production certified architecture due to lack of fault isolation.'
    ],
    architectTip: 'Combine Graviton with AWS Compute Optimizer recommendations to discover right-sizing opportunities across your fleet.',
    examQuestion: 'A company wants to minimize compute costs for a batch processing workload that can be interrupted without losing progress. What instance purchasing option is best? (Answer: Amazon EC2 Spot Instances with Spot Fleet).'
  }
};
