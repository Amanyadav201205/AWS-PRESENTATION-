import { DomainData } from '../../types';

export const monitoringDomain: DomainData = {
  id: 'monitoring-elasticity',
  number: 7,
  title: 'Monitoring, Elasticity & High Availability',
  subtitle: 'CloudWatch Synthetics, Composite Alarms, & EventBridge Self-Healing vs. Silent Failures',
  category: 'Operations & Reliability',
  pillars: ['Operational Excellence', 'Reliability', 'Performance Efficiency'],
  customerRequirement: {
    clientName: 'AeroBank Online Operations',
    businessGoal: 'Achieve 99.99% availability for 2 million active banking customers with autonomous anomaly detection and self-healing.',
    challenges: [
      'Engineers find out about outages only when users post on social media',
      'Individual metric alarms cause pager fatigue and false alarms',
      'Debugging distributed microservice latency takes hours of log grepping'
    ],
    budgetOrSlaTarget: 'MTTD < 15 seconds | MTTR < 45 seconds | Zero Alert Fatigue'
  },
  normalPrescription: {
    title: 'Basic 5-Minute CloudWatch Metrics & Manual SSH Terminal Logging',
    prescribedServices: 'Default EC2 metrics (5-min intervals) with engineers running tail -f /var/log/syslog',
    whyItSeemsLogical: 'Saves a few dollars on CloudWatch custom metrics and detailed monitoring.',
    whyItFailsInProduction: [
      '5-minute metrics mean outages persist for 15+ minutes before basic thresholds trip',
      'No synthetic user transaction testing: APIs fail silently while server CPU looks normal',
      'Manual remediation requires waking engineers up at night, prolonging MTTR to hours'
    ]
  },
  wafTransformationSummary: 'WAF deploys CloudWatch Synthetics canaries running 24/7, Composite Alarms to eliminate noise, AWS X-Ray for distributed tracing, and EventBridge rules triggering automated Lambda self-healing.',

  naive: {
    name: 'Zero Telemetry & Manual SSH `tail -f` Log Debugging',
    tagline: 'Outages discovered only when customers complain on social media',
    description: 'No centralized logging or performance metrics. When servers slow down, engineers SSH into individual instances to run `top` and `grep /var/log/nginx/error.log`. Outages linger for hours undetected because there are no synthetic canaries or automated alerts.',
    bulletPoints: [
      'Zero proactive alerting: Mean Time to Detect (MTTD) exceeds 45 minutes',
      'Engineers debug via risky interactive SSH sessions on live production instances',
      'No correlation between frontend latency, backend microservices, and database queries',
      'Manual remediation: requires waking engineers up at night to restart hung processes'
    ],
    nodes: [
      { id: 'n-unmonitored-srv', name: 'Unmonitored EC2 Instance', type: 'compute', service: 'Amazon EC2 (Silent Crash)', tier: 'public', isSPOF: true, status: 'healthy', description: 'No CloudWatch agent installed' },
      { id: 'n-angry-user', name: 'Angry Customers on Twitter', type: 'client', service: 'Social Media Complaints', tier: 'edge', status: 'degraded', description: 'De facto monitoring system' },
      { id: 'n-ssh-dev', name: 'Manual SSH Terminal', type: 'compute', service: 'Engineer running tail -f', tier: 'edge', status: 'healthy' }
    ],
    connections: [
      { from: 'n-unmonitored-srv', to: 'n-angry-user', label: 'HTTP 500 Silent Failures', type: 'sync' },
      { from: 'n-ssh-dev', to: 'n-unmonitored-srv', label: 'Emergency SSH Triage', type: 'sync' }
    ],
    monthlyCostEst: 0,
    availabilitySLA: '97.5%',
    rto: '2 - 4 Hours',
    rpo: 'Unbounded Telemetry Void',
    scores: {
      operationalExcellence: 10,
      security: 30,
      reliability: 20,
      performanceEfficiency: 35,
      costOptimization: 75,
      sustainability: 40
    },
    iacSnippet: {
      language: 'hcl',
      filename: 'anti_pattern_monitoring.tf',
      code: `# ANTI-PATTERN: No CloudWatch alarms, no metrics, no canaries
resource "aws_instance" "blind_node" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.medium"
  # monitoring is false by default (basic 5-min intervals)
  monitoring    = false
  # No CloudWatch Agent installed via SSM
  # No composite alarms configured!
}`,
      notes: 'Basic 5-minute metric resolution is too slow for production SLAs. No log centralization or synthetic monitoring.'
    }
  },
  wellArch: {
    name: 'CloudWatch Synthetics, Composite Alarms, X-Ray & EventBridge Auto-Healing',
    tagline: 'Sub-minute anomaly detection, distributed tracing, and automated self-healing',
    description: 'Autonomous operational observability. CloudWatch Synthetics canaries simulate end-user transactions 24/7 across multiple regions. Composite Alarms combine CPU, memory, and p99 latency to eliminate alert fatigue. AWS X-Ray traces distributed microservice hops. EventBridge listens to threshold breaches and triggers automated Lambda remediation.',
    bulletPoints: [
      'CloudWatch Synthetics canaries detect user-facing regressions before customers notice',
      'CloudWatch Composite Alarms combine multiple signals to eliminate alert noise and pager fatigue',
      'AWS X-Ray distributed tracing isolates database query bottlenecks down to the exact millisecond',
      'EventBridge automatically triggers Lambda self-healing scripts (restarting unhealthy containers, cycling tasks)'
    ],
    nodes: [
      { id: 'w-synthetic', name: 'CloudWatch Synthetics Canary', type: 'analytics', service: 'Puppeteer Browser Canaries (24/7)', tier: 'edge', isSPOF: false, status: 'healthy', description: 'Simulates checkout flow every 60s' },
      { id: 'w-composite', name: 'CloudWatch Composite Alarms', type: 'analytics', service: 'Multi-Metric Logic Gate Alarm', tier: 'cloud', isSPOF: false, status: 'healthy', description: 'Latency > 500ms AND ErrorRate > 2%' },
      { id: 'w-xray', name: 'AWS X-Ray Distributed Tracing', type: 'analytics', service: 'End-to-End Latency Trace Map', tier: 'cloud', isSPOF: false, status: 'healthy' },
      { id: 'w-eventbridge', name: 'Amazon EventBridge Rule', type: 'queue', service: 'Event Router for Alarms', tier: 'cloud', isSPOF: false, status: 'healthy' },
      { id: 'w-selfheal', name: 'Self-Healing Lambda Function', type: 'compute', service: 'AWS Lambda Auto-Remediation', tier: 'cloud', isSPOF: false, status: 'healthy', description: 'Graceful blue/green task recycle' }
    ],
    connections: [
      { from: 'w-synthetic', to: 'w-composite', label: 'Continuous Telemetry Feed', type: 'sync' },
      { from: 'w-composite', to: 'w-eventbridge', label: 'Alarm State Change Event', type: 'async' },
      { from: 'w-eventbridge', to: 'w-selfheal', label: 'Target Invocation', type: 'async' },
      { from: 'w-xray', to: 'w-composite', label: 'Trace Metric Filter', type: 'sync' }
    ],
    monthlyCostEst: 54,
    availabilitySLA: '99.99%',
    rto: '< 45 Seconds (Autonomous)',
    rpo: 'Continuous Metrics Stream',
    scores: {
      operationalExcellence: 98,
      security: 92,
      reliability: 98,
      performanceEfficiency: 95,
      costOptimization: 85,
      sustainability: 90
    },
    iacSnippet: {
      language: 'hcl',
      filename: 'well_architected_monitoring.tf',
      code: `# WELL-ARCHITECTED: Composite Alarms and EventBridge Automated Remediation
resource "aws_cloudwatch_composite_alarm" "high_severity_outage" {
  alarm_name        = "HighSeverityCheckoutDegradation"
  alarm_description = "Fires only when Canaries fail AND Backend latency exceeds 500ms"

  alarm_rule = "ALARM(\${aws_cloudwatch_metric_alarm.canary_failure.alarm_name}) AND ALARM(\${aws_cloudwatch_metric_alarm.api_p99_latency.alarm_name})"
  alarm_actions = [aws_sns_topic.pagerduty.arn, aws_cloudwatch_event_rule.self_heal.arn]
}

resource "aws_cloudwatch_event_rule" "self_heal" {
  name        = "trigger-auto-healing-lambda"
  event_pattern = jsonencode({
    source      = ["aws.cloudwatch"],
    detail_type = ["CloudWatch Alarm State Change"],
    detail      = { state = { value = ["ALARM"] } }
  })
}`,
      notes: 'Composite alarms prevent false positives. EventBridge triggers remediation instantly without waiting for human intervention.'
    }
  },
  metrics: [
    { label: 'Mean Time to Detect (MTTD)', naiveValue: '45+ Minutes (Customer complaints)', wellArchValue: '< 15 Seconds (Synthetics + Alarms)', impact: 'positive', explanation: 'Automated synthetic canaries run continuous browser checks.' },
    { label: 'Mean Time to Remediate (MTTR)', naiveValue: '2 to 4 Hours (Manual SSH)', wellArchValue: '< 45 Seconds (Autonomous Lambda)', impact: 'positive', explanation: 'EventBridge initiates container task replacement immediately.' },
    { label: 'Distributed Trace Visibility', naiveValue: '0% (Black Box)', wellArchValue: '100% (AWS X-Ray Waterfall)', impact: 'positive', explanation: 'Every request traced from browser to database query.' },
    { label: 'Alert Noise / False Positives', naiveValue: 'Frequent or Ignored', wellArchValue: '< 2% (Composite Alarms Filtered)', impact: 'positive', explanation: 'Composite alarms require multiple correlating factors before alerting.' }
  ],
  chaos: {
    id: 'chaos-monitoring',
    title: 'Silent Memory Leak Causing Cascading API Hangs',
    triggerLabel: 'Inject Silent Application Memory Leak',
    description: 'A bad deployment introduces a memory leak in the core API, pushing heap usage to 98% and freezing worker threads.',
    affectedNodeIds: ['n-unmonitored-srv', 'w-composite', 'w-selfheal'],
    naiveConsequence: {
      statusText: 'PROTRACTED SILENT OUTAGE',
      errorRate: '85% Timeout Rate',
      latency: '> 15,000ms',
      downtime: 'Hours until someone notices Twitter rage',
      narrative: 'No alerts fire because basic CPU utilization looks normal. Customers abandon carts in droves. Operations team spends hours guessing which instance is stuck.'
    },
    wellArchConsequence: {
      statusText: 'AUTONOMOUS HEALING IN 38 SECONDS',
      errorRate: '0.05% Transient',
      latency: '24ms post-heal',
      failoverTime: '38 Seconds (Zero Pager Escalation)',
      narrative: 'Synthetic canary spots checkout timeout. Composite alarm triggers EventBridge. Lambda initiates rolling task recycling to clean state. Incident remediated before engineers wake up.'
    }
  },
  speakerNotes: {
    hook: 'If your users are the first ones to tell you your site is down, you do not have an architecture—you have an accidental service.',
    keyPoints: [
      'CloudWatch Synthetics test the actual user experience, not just server ping or CPU.',
      'Composite alarms prevent alert fatigue by requiring multiple symptoms before triggering pagers.',
      'Close the loop by connecting alarms to EventBridge for automated self-healing.'
    ],
    architectTip: 'Embed AWS X-Ray SDK in your backend clients to generate real-time service maps showing hidden latency bottlenecks.',
    examQuestion: 'A company needs to reduce alert fatigue by triggering notifications only when both CPU utilization exceeds 85% and the error rate exceeds 5%. Which AWS feature supports this? (Answer: Amazon CloudWatch Composite Alarms).'
  }
};
