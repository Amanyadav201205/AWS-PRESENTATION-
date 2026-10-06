import { DomainData } from '../../types';

export const decoupledDomain: DomainData = {
  id: 'decoupled-architecture',
  number: 10,
  title: 'Building Decoupled Architecture',
  subtitle: 'Amazon SQS FIFO, SNS Fan-Out, & Dead-Letter Queues (DLQ) vs. Blocking Synchronous HTTP Chains',
  category: 'Performance & Scale',
  pillars: ['Reliability', 'Performance Efficiency', 'Operational Excellence'],
  customerRequirement: {
    clientName: 'HyperCart Retail Logistics',
    businessGoal: 'Process 100,000 orders per hour during Black Friday flash sales with sub-100ms checkout acknowledgment and zero dropped orders during partner outages.',
    challenges: [
      'Third-party payment gateways and shipping webhooks frequently timeout under load',
      'Synchronous HTTP chains hold open client connections for 4+ seconds',
      'If any downstream vendor fails, customer checkout fails completely'
    ],
    budgetOrSlaTarget: 'Sub-100ms Checkout Acknowledgment | Zero Dropped Orders | 14-Day Resilient Buffer'
  },
  normalPrescription: {
    title: 'Tightly Coupled Synchronous Blocking HTTP Microservices Chain',
    prescribedServices: 'Monolithic application server synchronously calling Payment API, Inventory DB, and SMTP email vendor',
    whyItSeemsLogical: 'Simple sequential programming logic: charge card, update DB, send email, return status.',
    whyItFailsInProduction: [
      'Cascading failure: a slow email server holds web worker threads open until the entire server crashes',
      'High latency: user waits 4+ seconds for 3 sequential network hops',
      'No retry buffer: failed transactions are permanently lost'
    ]
  },
  wafTransformationSummary: 'WAF decouples the architecture using Amazon SQS FIFO with Dead-Letter Queues (DLQs) and Amazon SNS fan-out. The checkout responds in 85ms with HTTP 202, while worker fleets process orders asynchronously with zero data loss.',

  naive: {
    name: 'Tightly Coupled Synchronous HTTP Chained Monolith',
    tagline: 'Frontend -> Backend -> Payment API -> Inventory -> Third-Party Email in single blocking thread',
    description: 'Every checkout request executes as a synchronous serial chain. The frontend waits while the backend calls a payment gateway, updates database inventory, and communicates with a third-party email provider over HTTP. If the email provider or payment webhook experiences a 10-second delay, the customer browser times out and the order is lost.',
    bulletPoints: [
      'Cascading failure: a minor outage in a non-critical notification vendor kills core checkout revenue',
      'High latency: customer browser waits 3,500ms+ for 4 sequential external HTTP handshakes',
      'No retry buffering: if payment drops connection, transactions are lost with zero replay ability',
      'No backpressure handling: traffic spikes crush downstream services'
    ],
    nodes: [
      { id: 'n-buyer', name: 'Checkout Customer', type: 'client', service: 'E-commerce Shopper', tier: 'edge', status: 'healthy' },
      { id: 'n-sync-checkout', name: 'Monolithic Web Server', type: 'compute', service: 'Synchronous Checkout Thread', tier: 'public', isSPOF: true, status: 'healthy', description: 'Blocking thread holding open socket' },
      { id: 'n-slow-payment', name: 'Payment Gateway', type: 'compute', service: 'External Bank API', tier: 'edge', isSPOF: true, status: 'healthy' },
      { id: 'n-flaky-email', name: 'Third-Party Email Vendor', type: 'compute', service: 'External SMTP Webhook', tier: 'edge', isSPOF: true, status: 'degraded', description: 'Subject to 10s timeouts & 503 outages' }
    ],
    connections: [
      { from: 'n-buyer', to: 'n-sync-checkout', label: 'Blocking HTTPS Checkout', type: 'sync' },
      { from: 'n-sync-checkout', to: 'n-slow-payment', label: 'Blocking Step 1: Charge Card', type: 'sync' },
      { from: 'n-sync-checkout', to: 'n-flaky-email', label: 'Blocking Step 2: Send Email Receipt', type: 'sync' }
    ],
    monthlyCostEst: 320,
    availabilitySLA: '97.0%',
    rto: 'Manual Reconciliation',
    rpo: 'Lost In-Flight Orders',
    scores: {
      operationalExcellence: 25,
      security: 50,
      reliability: 20,
      performanceEfficiency: 25,
      costOptimization: 50,
      sustainability: 45
    },
    iacSnippet: {
      language: 'hcl',
      filename: 'anti_pattern_synchronous.py',
      code: `# ANTI-PATTERN: Synchronous blocking execution in application handler
@app.route("/api/order", methods=["POST"])
def place_order():
    order = create_order_in_db(request.json)
    
    # BLOCKING HTTP CALL #1:
    charge = requests.post("https://payment-gateway/charge", json=order, timeout=10)
    
    # BLOCKING HTTP CALL #2 (If this times out, checkout crashes!):
    email = requests.post("https://vendor-smtp/send-email", json=order, timeout=15)
    
    # Result: Client waits 8 seconds. If email fails, customer gets error 500!
    return jsonify({"status": "complete"})`,
      notes: 'Cascading failure trap. The health of your primary revenue flow depends on the uptime of third-party vendors.'
    }
  },
  wellArch: {
    name: 'Asynchronous Event-Driven Architecture with Amazon SQS & EventBridge',
    tagline: 'Amazon SQS FIFO, Dead-Letter Queues (DLQ), and SNS Fan-Out with sub-100ms checkout confirmation',
    description: 'Decoupled event-driven choreography. When an order is submitted, the API validates the payload, enqueues an event into Amazon SQS / EventBridge, and returns HTTP 202 Accepted to the user in 85ms. Asynchronous worker microservices process billing, inventory, and emails independently. Dead-Letter Queues (DLQ) safely capture failed events with exponential backoff and redrive.',
    bulletPoints: [
      'Checkout responds in 85ms: customer never waits for slow email or fulfillment microservices',
      'Failure isolation: a total outage in the email provider has zero impact on revenue checkout',
      'Amazon SQS buffers spikes: downstream services process workloads at their own sustainable pace',
      'Dead-Letter Queues (DLQ) with AWS CloudWatch alarms ensure zero messages are ever lost'
    ],
    nodes: [
      { id: 'w-buyer-decoupled', name: 'Happy Shopper', type: 'client', service: 'Instant Checkout App', tier: 'edge', status: 'healthy' },
      { id: 'w-api-fast', name: 'Fast Ingestion API', type: 'compute', service: 'AWS Lambda / API Gateway', tier: 'public', isSPOF: false, status: 'healthy', description: 'Returns HTTP 202 in 85ms' },
      { id: 'w-sqs-orders', name: 'Amazon SQS (Orders Queue + DLQ)', type: 'queue', service: 'Durable Message Buffer (14-day retention)', tier: 'cloud', isSPOF: false, status: 'healthy', description: 'Buffers 100k messages safely' },
      { id: 'w-sns-fanout', name: 'Amazon SNS Fan-Out Topic', type: 'queue', service: 'Pub/Sub Event Broadcaster', tier: 'cloud', isSPOF: false, status: 'healthy' },
      { id: 'w-worker-payment', name: 'Payment Microservice Worker', type: 'compute', service: 'Auto-Scaling Consumer Fleet', tier: 'private', isSPOF: false, status: 'healthy' },
      { id: 'w-worker-email', name: 'Notification Worker (with DLQ)', type: 'compute', service: 'Decoupled Async Worker', tier: 'private', isSPOF: false, status: 'healthy' }
    ],
    connections: [
      { from: 'w-buyer-decoupled', to: 'w-api-fast', label: 'HTTP 202 Accepted in 85ms', type: 'sync' },
      { from: 'w-api-fast', to: 'w-sqs-orders', label: 'Enqueue Message', type: 'sync' },
      { from: 'w-sqs-orders', to: 'w-sns-fanout', label: 'Broadcast OrderPlaced Event', type: 'async' },
      { from: 'w-sns-fanout', to: 'w-worker-payment', label: 'Billing Subscription', type: 'async' },
      { from: 'w-sns-fanout', to: 'w-worker-email', label: 'Notification Subscription (DLQ Guarded)', type: 'async' }
    ],
    monthlyCostEst: 42,
    availabilitySLA: '99.99%',
    rto: 'Zero (Buffer Absorbs Outages)',
    rpo: 'Zero (Messages Retained up to 14 Days)',
    scores: {
      operationalExcellence: 97,
      security: 94,
      reliability: 99,
      performanceEfficiency: 98,
      costOptimization: 95,
      sustainability: 95
    },
    iacSnippet: {
      language: 'hcl',
      filename: 'well_architected_sqs_dlq.tf',
      code: `# WELL-ARCHITECTED: Amazon SQS with Dead-Letter Queue (DLQ) & Redrive Policy
resource "aws_sqs_queue" "orders_dlq" {
  name                      = "orders-dead-letter-queue"
  message_retention_seconds = 1209600 # 14 days retention for inspection
}

resource "aws_sqs_queue" "orders_queue" {
  name                      = "orders-primary-queue"
  visibility_timeout_seconds = 300
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.orders_dlq.arn
    maxReceiveCount     = 5 # Retry 5 times with backoff before DLQ
  })
}

resource "aws_sns_topic" "order_events" {
  name = "order-events-fanout"
}`,
      notes: 'Decouples order intake from processing. DLQ captures poison pill messages without interrupting the primary message flow.'
    }
  },
  metrics: [
    { label: 'Customer Checkout Response Latency', naiveValue: '3,800ms (Waits for all 3rd parties)', wellArchValue: '85ms (Async SQS Acknowledgment)', impact: 'positive', explanation: 'Customer gets instant confirmation; heavy processing handled asynchronously.' },
    { label: 'Impact of Downstream Vendor Outage', naiveValue: '100% Checkout Crash', wellArchValue: '0% Checkout Impact (Buffered in SQS)', impact: 'positive', explanation: 'Orders sit safely in SQS queue for up to 14 days until downstream recovers.' },
    { label: 'Data Loss During Traffic Spikes', naiveValue: 'Dropped Requests (HTTP 504)', wellArchValue: '0 Dropped Messages (DLQ Protected)', impact: 'positive', explanation: 'Queue automatically absorbs traffic surges with zero packet loss.' },
    { label: 'Cost of Idle Queues', naiveValue: 'Constant server overhead', wellArchValue: '$0.40 per 1,000,000 messages', impact: 'positive', explanation: 'Amazon SQS charges purely per API call with zero idle server instances.' }
  ],
  chaos: {
    id: 'chaos-decoupled',
    title: 'Downstream Email Vendor Down & 20,000 Black Friday Orders',
    triggerLabel: 'Kill Email Vendor & Flood 20k Orders',
    description: 'The third-party email notification provider suffers a complete worldwide DNS blackout while shoppers submit 20,000 orders.',
    affectedNodeIds: ['n-flaky-email', 'n-sync-checkout', 'w-worker-email', 'w-sqs-orders'],
    naiveConsequence: {
      statusText: 'CASCADING SYSTEM FAILURE & ABANDONED CARTS',
      errorRate: '100% of Checkouts Timeout with HTTP 504',
      latency: 'Infinite (Thread Starvation)',
      downtime: 'Ongoing for 45 minutes until vendor recovers',
      narrative: 'Because the email step is synchronous in the main thread, all web worker processes lock waiting for TCP socket timeouts. Entire checkout crashes.'
    },
    wellArchConsequence: {
      statusText: 'ALL 20,000 ORDERS ACCEPTED IN < 90ms',
      errorRate: '0.00% Order Failures',
      latency: '78ms average checkout',
      failoverTime: 'Instant (SQS buffers email backlog)',
      narrative: 'Shoppers receive immediate order confirmation. SQS buffers all notification tasks. Worker retires with exponential backoff. Once vendor restores, backlog drains in 3 minutes with zero lost orders.'
    }
  },
  speakerNotes: {
    hook: 'If your frontend checkout crashes because your email receipt server is slow, you do not have a microservice architecture—you have a distributed monolith with network latency.',
    keyPoints: [
      'Decoupling with Amazon SQS converts unpredictable spikes into a smooth, manageable stream.',
      'Always configure a Dead-Letter Queue (DLQ) with a maxReceiveCount and CloudWatch alarm.',
      'SNS Fan-Out allows adding new consumers (e.g., fraud analysis, audit) without touching the checkout codebase.'
    ],
    architectTip: 'Set your SQS visibility timeout to 6 times the timeout of your processing Lambda function to prevent duplicate deliveries.',
    examQuestion: 'An application needs to process order transactions asynchronously and ensure that messages that fail processing after 3 attempts are isolated for manual review. Which combination should be used? (Answer: Amazon SQS queue with a Dead-Letter Queue and redrive policy maxReceiveCount set to 3).'
  }
};
