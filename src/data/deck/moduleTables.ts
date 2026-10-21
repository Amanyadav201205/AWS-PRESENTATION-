/** Four rows per module: component, naive build, Well-Architected build. Matches what the presenters say for that module. */
export type ModuleTableRow = [string, string, string];

export const moduleTables: ModuleTableRow[][] = [
  // 1. Architecture overview
  [
    ['Application tier', 'One server, a single point of failure', 'Auto Scaling pool spread across three zones'],
    ['Database', 'One primary with no standby', 'Aurora Multi-AZ with a replica in another zone'],
    ['Edge and security', 'No edge layer; the origin is exposed', 'CloudFront and AWS WAF in front of the load balancer'],
    ['Cost', '$4,450 a month', '$1,820 a month, 59.1% lower']
  ],
  // 2. Storage layer
  [
    ['Block storage', '3 TB gp2 disk, speed tied to size', 'gp3 sized to the workload, 3,000 baseline IOPS'],
    ['Archive', 'Old scans stay on hot storage', 'S3 Intelligent-Tiering, then Glacier Deep Archive'],
    ['Deletion protection', 'Flat bucket with no versioning', 'S3 Object Lock in compliance mode: every delete returns 403'],
    ['Recovery points', 'None that cannot be changed', 'AWS Backup vault with immutable recovery points']
  ],
  // 3. Compute layer
  [
    ['Instance', 'One large monolith, 24/7', 'Graviton instances sized by target tracking at 60% CPU'],
    ['Zones', 'One zone', 'Three zones behind an Application Load Balancer'],
    ['Zone failure', 'Out-of-memory crash, full outage', 'Node unhealthy in about 10 s; replacements in under 75 s'],
    ['Capacity model', 'Static size running 24/7 for the peak', 'On-Demand base plus Spot; $584 to $168 a month']
  ],
  // 4. Database layer
  [
    ['Engine', 'Self-managed MySQL on one EC2 host', 'Aurora cluster with a writer and read replicas'],
    ['Backups', 'Bash cron dump that locks tables', 'Continuous backup with point-in-time recovery to the second'],
    ['Failover', 'Rebuild by hand, hours of downtime', 'Replica promoted; endpoint moves in under 30 s'],
    ['Durability', 'One disk, up to 24 hours of lost commits', 'Six copies across three zones; writes need 4 of 6']
  ],
  // 5. Networking environment
  [
    ['Network layout', 'Default VPC, every server public', 'Three tiers across three zones: public, private, isolated'],
    ['Database exposure', 'MySQL on port 3306 open to 0.0.0.0/0', 'No public address and no route to the internet gateway'],
    ['Access rules', 'Open ports, shared credentials', 'Security groups reference other security groups by ID'],
    ['Visibility', 'No flow logs', 'VPC Flow Logs capture every connection for audit']
  ],
  // 6. Connecting networks
  [
    ['Routing model', 'Peering mesh: 190 links for 20 VPCs', 'Transit Gateway hub: one attachment per VPC'],
    ['Corporate link', 'One IPsec VPN over the internet', 'Direct Connect with a backup VPN over BGP'],
    ['Link failure', 'Tunnel drops; manual recovery', 'BGP fails over in a few seconds'],
    ['Egress', 'Direct and unfiltered', 'Central inspection with AWS Network Firewall']
  ],
  // 7. Securing applications and data access
  [
    ['Credentials', 'Permanent access keys committed to Git', 'IAM roles issue temporary credentials for one hour'],
    ['Database password', 'Clear text and never rotated', 'Secrets Manager rotates every 30 days with no downtime'],
    ['Web attacks', 'No WAF; SQL injection reaches the database', 'AWS WAF managed rules block SQL injection with a 403'],
    ['Encryption', 'Unmanaged keys', 'KMS customer managed keys with envelope encryption']
  ],
  // 8. Monitoring, elasticity and high availability
  [
    ['Detection', 'Customers report the outage on social media', 'CloudWatch Synthetics canaries detect it in under 15 s'],
    ['Alerting', 'Single-metric alarms, constant noise', 'Composite alarms need several signals before paging'],
    ['Tracing', 'Log grep over SSH', 'AWS X-Ray traces the slow query to the millisecond'],
    ['Remediation', 'Manual SSH, 2 to 4 hours', 'EventBridge and Lambda recycle the task in about 45 s']
  ],
  // 9. Automating the architecture
  [
    ['Changes', 'Console clicks, no record', 'Terraform or CDK changes through pull requests'],
    ['Security scanning', 'None before deployment', 'Checkov and tfsec block insecure code'],
    ['Drift', 'Silent and continuous', 'AWS Config flags drift; Systems Manager remediates it'],
    ['Rebuild a region', '3 to 5 days of guesswork', 'About 15 minutes with one pipeline run']
  ],
  // 10. Caching content
  [
    ['Static content', 'Every request reaches the origin', 'CloudFront at 600+ edge locations absorbs about 96%'],
    ['Hot queries', 'Repeated reads hit the database', 'ElastiCache Redis answers from memory'],
    ['Database CPU', 'About 96%, near collapse', 'About 11%, with headroom for spikes'],
    ['Global p95 latency', 'About 850 ms', 'About 18 ms from the nearest edge location']
  ],
  // 11. Building decoupled architecture
  [
    ['Checkout path', 'Waits for payment, inventory and email', 'Acknowledged in about 85 ms after the SQS write'],
    ['Vendor outage', 'Checkout fails with the vendor', 'Messages wait in SQS for up to 14 days'],
    ['Failed messages', 'Lost with the request', 'Dead-letter queue with a CloudWatch alarm'],
    ['New consumers', 'Edit the checkout code', 'SNS fan-out to fraud, audit or any new service']
  ],
  // 12. Serverless architecture and microservices
  [
    ['Compute', 'Stateful VMs running 24/7', 'Lambda on Graviton ARM64, paid per request'],
    ['Idle cost', 'About $18 a day at 3 AM', '$0 when nobody is calling'],
    ['Scale-out', '8 to 15 minutes to boot AMIs', 'Under half a second to thousands of concurrent calls'],
    ['Operations', 'Weekly OS patch windows', 'No servers, no AMIs, no SSH bastions']
  ],
  // 13. Data pipelines
  [
    ['Ingestion', 'Nightly mysqldump on production', 'Kinesis Data Firehose streams events continuously'],
    ['Transform', 'Python script that runs out of memory', 'AWS Glue serverless ETL writes Parquet'],
    ['Storage', 'Raw CSV on local disk', 'S3 data lake with columnar Parquet'],
    ['Query', 'Reports 24 hours behind; full raw scans cost more', 'Athena reads only needed Parquet columns; about 85% lower cost']
  ],
  // 14. Disaster recovery
  [
    ['Strategy', 'Backup and hope, in the same region', 'Active-active across us-east-1 and eu-west-1'],
    ['Recovery time', '3 to 5 days to rebuild by hand', 'Route 53 ARC shifts traffic in under a minute'],
    ['Data loss', 'Up to 2 weeks of commits', 'Aurora Global Database replicates in under a second'],
    ['Testing', 'Never tested', 'Automated game-day drills run continuously']
  ],
  // 15. Executive conclusion
  [
    ['Availability', '98.5%, frequent unplanned downtime', '99.99%, certified high availability'],
    ['Recovery', '48+ hours after an incident', 'Under 30 seconds with automatic failover'],
    ['Annual spend', '$53,400 a year', '$21,840 a year'],
    ['Governance', 'Failing audit, unmitigated risk', 'AWS Organizations, guardrails and GitOps pipelines']
  ]
];
