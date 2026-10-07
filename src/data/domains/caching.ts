import { DomainData } from '../../types';

export const cachingDomain: DomainData = {
  id: 'caching-content',
  number: 10,
  title: 'Caching Content',
  subtitle: 'CloudFront Edge Caching & ElastiCache Redis vs. Direct Origin & Database Overload',
  category: 'Performance & Scale',
  pillars: ['Performance Efficiency', 'Cost Optimization', 'Reliability'],
  customerRequirement: {
    clientName: 'StreamByte Global Media',
    businessGoal: 'Deliver video catalogs, streaming metadata, and image assets to 10 million global viewers with sub-20ms latency and minimal origin database load.',
    challenges: [
      'Global viewers experience 800ms+ latency traversing transatlantic network routes',
      'Repetitive database queries for popular movies push database CPU to 98%',
      'Origin servers collapse during viral show releases'
    ],
    budgetOrSlaTarget: '95%+ Cache Hit Ratio | Sub-20ms Global Latency | Database CPU < 15%'
  },
  normalPrescription: {
    title: 'Direct Origin Hits with No Content Delivery Network',
    prescribedServices: 'Direct Route 53 A-record pointing to origin EC2 instance and RDS database',
    whyItSeemsLogical: 'Avoids setting up CloudFront distributions or Redis clusters during early MVP development.',
    whyItFailsInProduction: [
      'Origin servers spend 85% of CPU cycles serving static images and CSS',
      'Database connection pools exhaust instantly during traffic spikes, throwing 500 errors',
      'International users suffer severe latency and slow buffering'
    ]
  },
  wafTransformationSummary: 'WAF introduces Amazon CloudFront edge caching with Origin Access Control (OAC) across 600+ PoPs, alongside an Amazon ElastiCache (Redis) cluster, absorbing 96% of traffic with sub-15ms response times.',

  naive: {
    name: 'Zero Caching: Direct Database & Web Origin Hammering',
    tagline: 'Every static image, stylesheet, and repetitive SQL query hits origin DB directly',
    description: 'No Content Delivery Network (CDN) or in-memory caching layer. Every incoming visitor request for homepage images, product catalog listings, and user authentication tokens triggers direct disk I/O and SQL queries on the primary database.',
    bulletPoints: [
      'Origin web servers spend 80% of CPU cycles serving static CSS, JS, and image files',
      'Identical database queries (e.g., top 10 products) executed tens of thousands of times per minute',
      'Global users suffer high network latency (400ms - 900ms) traversing transatlantic hops',
      'Database connection pool exhausts during traffic surges, taking down the entire website'
    ],
    nodes: [
      { id: 'n-cache-users', name: 'Global Website Visitors', type: 'client', service: 'Users Worldwide', tier: 'edge', status: 'healthy' },
      { id: 'n-origin-srv', name: 'Uncached Origin Server', type: 'compute', service: 'Apache / Nginx EC2 (Overwhelmed)', tier: 'public', isSPOF: true, status: 'healthy', description: 'Serving both static assets & APIs' },
      { id: 'n-origin-db', name: 'Primary SQL Database', type: 'database', service: 'Overloaded Database (100% CPU)', tier: 'public', isSPOF: true, status: 'healthy', description: 'Hammered by repetitive queries' }
    ],
    connections: [
      { from: 'n-cache-users', to: 'n-origin-srv', label: 'Slow Transatlantic HTTP/1.1', type: 'sync' },
      { from: 'n-origin-srv', to: 'n-origin-db', label: 'Repetitive SQL Selects', type: 'sync' }
    ],
    monthlyCostEst: 490,
    availabilitySLA: '98.5%',
    rto: '45 Minutes',
    rpo: 'Connection Pool Lock',
    scores: {
      operationalExcellence: 30,
      security: 45,
      reliability: 25,
      performanceEfficiency: 15,
      costOptimization: 30,
      sustainability: 35
    },
    iacSnippet: {
      language: 'hcl',
      filename: 'anti_pattern_caching.tf',
      code: `# ANTI-PATTERN: No CloudFront CDN, no Redis, direct origin routing
resource "aws_route53_record" "naked_domain" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = "example.com"
  type    = "A"
  ttl     = 300
  records = [aws_instance.single_origin.public_ip]
  # Direct A-record pointing directly to EC2 public IP!
  # No CDN edge POPs, no TLS termination at the edge!
}`,
      notes: 'Lacks CloudFront edge caching, causing origin servers and databases to absorb 100% of traffic directly.'
    }
  },
  wellArch: {
    name: 'Multi-Tier Edge & In-Memory Caching (CloudFront + ElastiCache Redis)',
    tagline: 'Amazon CloudFront (600+ PoPs) with sub-15ms edge latency and ElastiCache in-memory Redis',
    description: 'Tiered caching architecture. Amazon CloudFront caches static content and API responses at 600+ Points of Presence worldwide with HTTP/3. Dynamic database query results are cached in an Amazon ElastiCache (Redis) cluster using Cache-Aside strategy, offloading 95% of reads from the database.',
    bulletPoints: [
      'CloudFront absorbs 96% of static requests at the edge with sub-15ms latency worldwide',
      'Amazon ElastiCache Redis serves sub-millisecond query responses with automated failover',
      'Database CPU utilization plummets from 95% to under 12%, extending hardware headroom',
      'AWS Shield Standard at CloudFront edge automatically mitigates Layer 3/4 DDoS attacks'
    ],
    nodes: [
      { id: 'w-cache-clients', name: 'Global Users (Any Device)', type: 'client', service: 'Global Web & Mobile Users', tier: 'edge', status: 'healthy' },
      { id: 'w-cloudfront', name: 'Amazon CloudFront CDN (600+ PoPs)', type: 'cdn', service: 'Edge Cache + TLS 1.3 + HTTP/3', tier: 'edge', isSPOF: false, status: 'healthy', description: '96% Cache Hit Ratio at edge' },
      { id: 'w-s3-origin', name: 'S3 Static Origin (Private OAC)', type: 'storage', service: 'Amazon S3 via Origin Access Control', tier: 'private', isSPOF: false, status: 'healthy' },
      { id: 'w-redis', name: 'Amazon ElastiCache (Redis Cluster)', type: 'cache', service: 'Multi-AZ In-Memory Cache (< 1ms)', tier: 'private', isSPOF: false, status: 'healthy', description: 'Sub-millisecond query response' },
      { id: 'w-app-cached', name: 'Application Microservices', type: 'compute', service: 'Elastic App Layer', tier: 'private', isSPOF: false, status: 'healthy' },
      { id: 'w-aurora-protected', name: 'Aurora Database (Protected)', type: 'database', service: 'Amazon Aurora Multi-AZ', tier: 'isolated', isSPOF: false, status: 'healthy', description: 'CPU under 12% utilization' }
    ],
    connections: [
      { from: 'w-cache-clients', to: 'w-cloudfront', label: 'Anycast DNS Sub-15ms', type: 'sync' },
      { from: 'w-cloudfront', to: 'w-s3-origin', label: 'Cache Miss Static (4%)', type: 'sync' },
      { from: 'w-cloudfront', to: 'w-app-cached', label: 'Dynamic API Passthrough', type: 'sync' },
      { from: 'w-app-cached', to: 'w-redis', label: 'Redis Cache-Aside (< 1ms)', type: 'sync' },
      { from: 'w-app-cached', to: 'w-aurora-protected', label: 'Only on Redis Cache Miss (< 5%)', type: 'sync' }
    ],
    monthlyCostEst: 165,
    availabilitySLA: '99.99%',
    rto: 'Instant (Edge Shielded)',
    rpo: 'Zero Exposure',
    scores: {
      operationalExcellence: 94,
      security: 96,
      reliability: 98,
      performanceEfficiency: 99,
      costOptimization: 94,
      sustainability: 95
    },
    iacSnippet: {
      language: 'hcl',
      filename: 'well_architected_caching.tf',
      code: `# WELL-ARCHITECTED: CloudFront with Origin Access Control (OAC) & ElastiCache
resource "aws_cloudfront_distribution" "cdn" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100"

  origin {
    domain_name              = aws_s3_bucket.static_assets.bucket_regional_domain_name
    origin_id                = "S3-Static-Assets"
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-Static-Assets"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
  }
}`,
      notes: 'CloudFront OAC restricts bucket access so only the CDN can read files. Compresses responses and serves worldwide in milliseconds.'
    }
  },
  metrics: [
    { label: 'Edge Cache Hit Ratio', naiveValue: '0% (Every request hits origin)', wellArchValue: '96.2% (Absorbed at CloudFront)', impact: 'positive', explanation: 'Static assets and common APIs never touch the origin server.' },
    { label: 'Global p95 Latency', naiveValue: '850ms (Traverses global WAN)', wellArchValue: '18ms (Served from local Edge PoP)', impact: 'positive', explanation: 'Anycast DNS routes users to the geographically nearest edge location.' },
    { label: 'Primary DB CPU Load', naiveValue: '96% (Constant near-crash)', wellArchValue: '11% (Protected by ElastiCache Redis)', impact: 'positive', explanation: 'Cache-Aside offloads repeated read queries completely.' },
    { label: 'Monthly Compute/DB Spend', naiveValue: '$490/mo (Requires large instances)', wellArchValue: '$165/mo (Right-sized origin + CDN)', impact: 'positive', explanation: 'CDN bandwidth is significantly cheaper than oversized EC2/RDS instances.' }
  ],
  chaos: {
    id: 'chaos-caching',
    title: '50,000 Req/s Flash Sale Traffic Spike',
    triggerLabel: 'Simulate 50,000 Req/s Flash Sale Spike',
    description: 'A national television advertisement airs, driving 50,000 requests per second to the product catalog homepage simultaneously.',
    affectedNodeIds: ['n-origin-srv', 'n-origin-db', 'w-cloudfront', 'w-redis'],
    naiveConsequence: {
      statusText: 'ORIGIN COLLAPSE & 504 GATEWAY TIMEOUT',
      errorRate: '92% Error Rate (500 / 504 Failures)',
      latency: 'Exceeds 30,000ms Timeout',
      downtime: 'Complete outage for duration of spike',
      narrative: 'Database connection pool is depleted within 2 seconds. Nginx origin worker processes queue up and crash. Potential millions in lost revenue.'
    },
    wellArchConsequence: {
      statusText: 'TRAFFIC ABSORBED SEAMLESSLY AT EDGE',
      errorRate: '0.00% Dropped Requests',
      latency: '14ms',
      failoverTime: 'Instant (Zero Origin Degradation)',
      narrative: 'CloudFront absorbs 96.5% of requests across global PoPs without touching origin. Redis absorbs remaining query read bursts. Database CPU barely flickers to 14%.'
    }
  },
  speakerNotes: {
    hook: 'The fastest and cheapest database query is the one you never execute. Caching is the ultimate performance superpower in the cloud.',
    keyPoints: [
      'Amazon CloudFront has over 600 Points of Presence, bringing data within milliseconds of 99% of global internet users.',
      'Always use Origin Access Control (OAC) to ensure users cannot bypass CloudFront to access your S3 origin.',
      'Amazon ElastiCache Redis provides microsecond latency for session management and hot product catalogs.'
    ],
    architectTip: 'Configure CloudFront with stale-while-revalidate cache headers to keep content blazing fast even during origin refreshes.',
    examQuestion: 'A web application requires low-latency delivery of static images globally while keeping origin S3 buckets private. Which configuration is required? (Answer: Amazon CloudFront with Origin Access Control (OAC) and an S3 bucket policy allowing only the CloudFront distribution).'
  }
};
