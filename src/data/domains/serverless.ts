import { DomainData } from '../../types';

export const serverlessDomain: DomainData = {
  id: 'serverless-microservices',
  number: 11,
  title: 'Serverless Architecture & Microservices',
  subtitle: 'API Gateway, Lambda ARM64, Step Functions, & DynamoDB vs. Stateful VM Monolith',
  category: 'Modern Application Design',
  pillars: ['Performance Efficiency', 'Cost Optimization', 'Sustainability'],
  customerRequirement: {
    clientName: 'NextGen Mobility AI',
    businessGoal: 'Build an event-driven mobile backend that costs $0 when idle at night, scales instantly from 0 to 50,000 concurrent requests, and requires zero OS management.',
    challenges: [
      'Traffic is almost zero from 1 AM to 6 AM, but explodes during morning rush hour',
      'Scaling virtual machines takes 8 to 15 minutes to boot AMIs',
      'Engineering team spends 20% of their time on Linux security patches and kernel upgrades'
    ],
    budgetOrSlaTarget: '$0 Idle Spend | Sub-second Scale-Out | 0 OS Maintenance Hours'
  },
  normalPrescription: {
    title: 'Stateful Virtual Machine Cluster Running 24/7 on EC2',
    prescribedServices: '24/7 EC2 c5.2xlarge instances running Node.js with sticky sessions and local memory state',
    whyItSeemsLogical: 'Standard VM deployment pattern familiar to traditional system administrators.',
    whyItFailsInProduction: [
      'Paying for idle peak capacity 24/7 costs $450+/month even with zero traffic',
      'Scaling lag: new instances take 10 minutes to initialize and join the load balancer',
      'Continuous operational overhead for OS patching, AMI maintenance, and security hardening'
    ]
  },
  wafTransformationSummary: 'WAF transitions to serverless microservices with Amazon API Gateway, AWS Lambda running on energy-efficient ARM64 Graviton, AWS Step Functions for state workflows, and DynamoDB On-Demand, achieving true pay-per-use and instant scaling.',

  naive: {
    name: 'Stateful Monolithic VM Cluster with Manual Patching',
    tagline: 'Paying 24/7 for idle Linux VMs, 15-minute AMI scaling, and stateful session traps',
    description: 'A traditional stateful monolith running inside EC2 virtual machines. Sessions are pinned to local instance memory. Scaling up during traffic bursts requires spinning up new AMIs, taking 8 to 15 minutes. At 3:00 AM when traffic is zero, the business still pays full hourly price for idle VMs and EBS disks.',
    bulletPoints: [
      'Zero traffic at night still costs $400+/month in continuous idle VM and EBS fees',
      'Scaling lag: takes 8 to 15 minutes to boot, initialize, and warm up a new virtual machine',
      'Session affinity / sticky sessions: single instance crashes log out thousands of active users',
      'Continuous operational burden: OS patching, kernel upgrades, and CVE remediation'
    ],
    nodes: [
      { id: 'n-mono-vm1', name: 'Monolith VM 1 (us-east-1a)', type: 'compute', service: 'EC2 Linux Stateful VM', tier: 'public', isSPOF: true, status: 'healthy', description: 'Local memory session state' },
      { id: 'n-mono-vm2', name: 'Monolith VM 2 (us-east-1b)', type: 'compute', service: 'EC2 Linux Stateful VM', tier: 'public', isSPOF: true, status: 'healthy' },
      { id: 'n-patching', name: 'Manual OS Patching Window', type: 'compute', service: 'Midnight SSH Maintenance', tier: 'public', isSPOF: false, status: 'degraded' }
    ],
    connections: [
      { from: 'n-mono-vm1', to: 'n-mono-vm2', label: 'Fragile Session Sync', type: 'sync' },
      { from: 'n-patching', to: 'n-mono-vm1', label: 'Reboot Required for Kernel', type: 'sync' }
    ],
    monthlyCostEst: 460,
    availabilitySLA: '99.0%',
    rto: '15 Minutes (AMI Boot Time)',
    rpo: 'Local Session Loss',
    scores: {
      operationalExcellence: 30,
      security: 45,
      reliability: 35,
      performanceEfficiency: 40,
      costOptimization: 25,
      sustainability: 25
    },
    iacSnippet: {
      language: 'hcl',
      filename: 'anti_pattern_monolith.tf',
      code: `# ANTI-PATTERN: Heavy stateful VM requiring constant OS maintenance
resource "aws_instance" "monolithic_app" {
  ami                  = "ami-0c55b159cbfafe1f0"
  instance_type        = "c5.2xlarge" # 8 vCPUs, 16GB RAM ($0.34/hr 24/7)
  associate_public_ip_address = true
  # No serverless scaling, constant power draw at night!
}`,
      notes: 'Stateful VM architecture costs money 24/7 regardless of traffic and requires continuous operating system maintenance.'
    }
  },
  wellArch: {
    name: 'Event-Driven Serverless Microservices with Graviton ARM64 Lambda',
    tagline: 'Amazon API Gateway, Lambda ARM, Step Functions state machines & DynamoDB On-Demand',
    description: 'Cloud-native serverless architecture. Amazon API Gateway provides managed routing, rate limiting, and authorization. AWS Lambda functions run on energy-efficient ARM64 Graviton architecture, scaling to thousands of concurrent executions in milliseconds and dropping to $0 cost when idle. AWS Step Functions orchestrates multi-step workflows with compensating transactions (Saga Pattern), and Amazon DynamoDB provides single-digit millisecond performance at any scale.',
    bulletPoints: [
      'True pay-per-use: $0 compute cost when idle at night, scales to 10,000 requests in milliseconds',
      'AWS Lambda Graviton2/3 (ARM64) delivers 34% better price/performance and 60% less energy',
      'AWS Step Functions manages distributed transactions, retries, and error handling visually',
      'Zero server management: no operating systems to patch, no AMIs to bake, no SSH bastions'
    ],
    nodes: [
      { id: 'w-apigw', name: 'Amazon API Gateway', type: 'gateway', service: 'Managed REST / HTTP API', tier: 'edge', isSPOF: false, status: 'healthy', description: 'Throttling, Auth, OpenAPI validation' },
      { id: 'w-lambda-auth', name: 'Auth Lambda (ARM64)', type: 'compute', service: 'AWS Lambda (JWT Validator)', tier: 'cloud', isSPOF: false, status: 'healthy' },
      { id: 'w-step-fn', name: 'AWS Step Functions', type: 'queue', service: 'Visual State Machine Orchestrator', tier: 'cloud', isSPOF: false, status: 'healthy', description: 'Handles Saga pattern & retries' },
      { id: 'w-lambda-exec', name: 'Order Processing Lambda', type: 'compute', service: 'AWS Lambda Graviton3', tier: 'cloud', isSPOF: false, status: 'healthy', description: 'Sub-second horizontal scale' },
      { id: 'w-dynamodb', name: 'Amazon DynamoDB On-Demand', type: 'database', service: 'Serverless NoSQL (Single-digit ms)', tier: 'isolated', isSPOF: false, status: 'healthy' }
    ],
    connections: [
      { from: 'w-apigw', to: 'w-lambda-auth', label: 'Lambda Authorizer', type: 'sync' },
      { from: 'w-apigw', to: 'w-step-fn', label: 'Direct Service Integration', type: 'sync' },
      { from: 'w-step-fn', to: 'w-lambda-exec', label: 'Parallel Task State', type: 'sync' },
      { from: 'w-lambda-exec', to: 'w-dynamodb', label: 'Encrypted PutItem (< 3ms)', type: 'sync' }
    ],
    monthlyCostEst: 38,
    availabilitySLA: '99.99%',
    rto: '< 1 Second (Stateless Re-invocation)',
    rpo: 'Zero (DynamoDB Multi-AZ Commit)',
    scores: {
      operationalExcellence: 98,
      security: 97,
      reliability: 98,
      performanceEfficiency: 96,
      costOptimization: 98,
      sustainability: 99
    },
    iacSnippet: {
      language: 'hcl',
      filename: 'well_architected_serverless.tf',
      code: `# WELL-ARCHITECTED: Serverless Lambda ARM64 with API Gateway & DynamoDB
resource "aws_lambda_function" "order_handler" {
  function_name = "process-order"
  runtime       = "nodejs20.x"
  architectures = ["arm64"] # AWS Graviton: 34% better price/perf!
  memory_size   = 1024
  timeout       = 10

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.orders.name
    }
  }
}

resource "aws_dynamodb_table" "orders" {
  name         = "Orders"
  billing_mode = "PAY_PER_REQUEST" # True serverless on-demand billing!
  hash_key     = "OrderId"

  attribute {
    name = "OrderId"
    type = "S"
  }
  point_in_time_recovery { enabled = true }
}`,
      notes: 'No EC2 instances, zero idle costs, sub-millisecond cold starts, and built-in continuous point-in-time recovery.'
    }
  },
  metrics: [
    { label: 'Idle Compute Cost (3:00 AM)', naiveValue: '$18.40 / day ($550/mo)', wellArchValue: '$0.00 (True Pay-per-Use)', impact: 'positive', explanation: 'Serverless Lambda and DynamoDB charge $0 when zero requests are being executed.' },
    { label: 'Scale-Out Latency (0 to 10k RPS)', naiveValue: '8 to 15 Minutes (Booting AMIs)', wellArchValue: '< 500 Milliseconds (Instant concurrency)', impact: 'positive', explanation: 'Lambda scales up concurrency immediately without waiting for OS boots.' },
    { label: 'OS Patching / Maintenance Burden', naiveValue: 'Weekly SSH Patch Windows', wellArchValue: 'Zero (Fully Managed by AWS)', impact: 'positive', explanation: 'AWS manages OS security updates, hypervisors, and runtimes transparently.' },
    { label: 'Carbon Efficiency (Sustainability)', naiveValue: 'Continuous wasted kilowatt-hours', wellArchValue: 'Maximum: Executes only when needed on ARM', impact: 'positive', explanation: 'High-density multi-tenant hardware eliminates unused thermal waste.' }
  ],
  chaos: {
    id: 'chaos-serverless',
    title: 'Instant 0 to 40,000 Invocations Surge',
    triggerLabel: 'Simulate 0 to 40k Invocations Burst',
    description: 'Traffic spikes instantly from zero to 40,000 concurrent API calls due to an unexpected viral notification.',
    affectedNodeIds: ['n-mono-vm1', 'n-mono-vm2', 'w-apigw', 'w-lambda-exec', 'w-dynamodb'],
    naiveConsequence: {
      statusText: 'INSTANCES FREEZE & CRASH UNDER LOAD',
      errorRate: '98% HTTP 503 Service Unavailable',
      latency: 'Connections Dropped',
      downtime: '15 Minutes until Auto Scaling catches up',
      narrative: 'Existing VM connections saturate instantly. New instances take 12 minutes to download packages and join load balancer. Viral moment completely squandered.'
    },
    wellArchConsequence: {
      statusText: '100% EXECUTED WITH ZERO PROVISIONING LAG',
      errorRate: '0.00% Dropped Requests',
      latency: '26ms median execution',
      failoverTime: 'Sub-second automatic concurrency scale',
      narrative: 'API Gateway absorbs and validates requests. Lambda scales to thousands of concurrent executions in milliseconds. DynamoDB On-Demand handles 40,000 writes without throttling.'
    }
  },
  speakerNotes: {
    hook: 'The greenest and most cost-effective line of code is the server that is turned off when nobody is using it.',
    keyPoints: [
      'Serverless represents the pinnacle of the Sustainability and Cost Optimization pillars.',
      'AWS Graviton ARM64 architecture on Lambda delivers 34% better price/performance than x86.',
      'AWS Step Functions allows modeling complex business transactions visually with automatic retries and catch blocks.'
    ],
    architectTip: 'Use API Gateway payload validation to reject malformed requests at the edge before invoking Lambda, saving execution costs.',
    examQuestion: 'An application requires intermittent processing of unpredictable events with zero compute cost when no events are received. Which architecture meets this requirement? (Answer: AWS Lambda with Amazon API Gateway and DynamoDB On-Demand).'
  }
};
