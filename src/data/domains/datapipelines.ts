import { DomainData } from '../../types';

export const dataPipelinesDomain: DomainData = {
  id: 'data-pipelines',
  number: 12,
  title: 'Data Pipelines',
  subtitle: 'Kinesis Streaming, AWS Glue Serverless ETL, S3 Lake & Athena vs. Cron EC2 Bash Dumps',
  category: 'Modern Application Design',
  pillars: ['Performance Efficiency', 'Cost Optimization', 'Operational Excellence'],
  customerRequirement: {
    clientName: 'DataPulse Analytics Corp',
    businessGoal: 'Ingest and analyze 500 million clickstream and IoT telemetry events per day, providing real-time dashboards with sub-minute latency without impacting production databases.',
    challenges: [
      'Analytics reports are currently delayed by 24 hours due to nightly batch jobs',
      'Nightly mysqldump scripts lock production tables, disrupting live customer transactions',
      'Monolithic Python pandas scripts crash with Out-of-Memory (OOM) errors as datasets grow'
    ],
    budgetOrSlaTarget: 'Sub-60s Data Ingestion | Zero Impact on OLTP DB | Pay-per-Query SQL'
  },
  normalPrescription: {
    title: 'Nightly Bash Cron Script Executing mysqldump on Production DB',
    prescribedServices: 'Single EC2 instance running a midnight bash script that dumps SQL to local disk and runs pandas',
    whyItSeemsLogical: 'Simple script written in an afternoon without provisioning big data infrastructure.',
    whyItFailsInProduction: [
      'Production database locks during the dump, causing timeouts for active users',
      'Single-server RAM limit (OOM crash) when data volume exceeds instance memory',
      'Reports are always 24 hours stale, preventing real-time business decisions'
    ]
  },
  wafTransformationSummary: 'WAF implements a modern serverless data lake with Amazon Kinesis Data Firehose for real-time streaming, AWS Glue serverless ETL for columnar Parquet conversion, Amazon S3 for durable storage, and Amazon Athena for serverless SQL.',

  naive: {
    name: 'Fragile Nightly Bash Cron Job on Single EC2',
    tagline: '`mysqldump` dumped to local disk, python script crashes on Out-of-Memory, 24h data lag',
    description: 'Analytics and reporting rely on a midnight cron script running on a lone EC2 instance. The script locks production tables, exports raw CSVs to local disk, runs a monolithic Python pandas script that consumes all RAM, and FTPs files to an external server. When data volume grows, the script crashes silently and stakeholders see yesterday\'s stale data.',
    bulletPoints: [
      '24-hour latency: business intelligence reports are always one day behind reality',
      'Table locking: midnight `mysqldump` locks production transactions, causing user timeouts',
      'Out of Memory (OOM) crashes: scaling requires continuously upsizing the EC2 instance',
      'No data lake or schema catalog: raw, un-partitioned CSVs stored without optimization'
    ],
    nodes: [
      { id: 'n-prod-db-hit', name: 'Production Relational DB', type: 'database', service: 'Live OLTP Database', tier: 'public', isSPOF: true, status: 'healthy', description: 'Locked by nightly mysqldump' },
      { id: 'n-cron-ec2', name: 'Cron Worker EC2', type: 'compute', service: 'EC2 Running Python Pandas', tier: 'public', isSPOF: true, status: 'degraded', description: 'Regularly crashes with OOM error' },
      { id: 'n-flat-csv', name: 'Local Disk /mnt/data.csv', type: 'storage', service: 'Unpartitioned Raw Text CSV', tier: 'public', isSPOF: true, status: 'healthy' }
    ],
    connections: [
      { from: 'n-prod-db-hit', to: 'n-cron-ec2', label: 'Blocking mysqldump Lock', type: 'sync' },
      { from: 'n-cron-ec2', to: 'n-flat-csv', label: 'Memory-bound Pandas Transformation', type: 'sync' }
    ],
    monthlyCostEst: 310,
    availabilitySLA: '85.0% Pipeline Reliability',
    rto: 'Manual Python Script Rerun',
    rpo: '24 Hours of Data Lag',
    scores: {
      operationalExcellence: 20,
      security: 35,
      reliability: 25,
      performanceEfficiency: 20,
      costOptimization: 40,
      sustainability: 35
    },
    iacSnippet: {
      language: 'hcl',
      filename: 'anti_pattern_etl.sh',
      code: `#!/bin/bash
# ANTI-PATTERN: Fragile midnight cron script
echo "Starting ETL export at 00:00..."
mysqldump -u root -p password123 --all-databases > /tmp/backup.sql # Locks production!

# Fragile Python script that loads 80GB into 16GB RAM:
python3 /opt/scripts/transform_pandas.py /tmp/backup.sql
# If data grows 10%, script dies with MemoryError!
echo "Upload complete"`,
      notes: 'No streaming capabilities, locks live production databases, and cannot scale beyond single-instance memory limits.'
    }
  },
  wellArch: {
    name: 'Modern Serverless Data Lake & Streaming Pipeline',
    tagline: 'Amazon Kinesis Data Firehose, AWS Glue Serverless ETL, S3 Parquet Lake & Athena SQL',
    description: 'Real-time analytics without operational overhead. Microservices stream clickstream and transactional events directly to Amazon Kinesis Data Firehose. AWS Glue processes and transforms incoming data into partitioned Apache Parquet format. Analysts query petabytes of data on demand using Amazon Athena serverless SQL without provisioning clusters.',
    bulletPoints: [
      'Real-time streaming: data available for analytics in under 60 seconds (instead of 24 hours)',
      'Zero impact on production OLTP: streaming events decoupled from relational databases',
      'AWS Glue serverless distributed Spark scales automatically across petabytes without OOM crashes',
      'Amazon Athena queries Amazon S3 columnar Parquet files directly, paying only $5 per TB scanned'
    ],
    nodes: [
      { id: 'w-stream-sources', name: 'Live Event Producers', type: 'client', service: 'IoT, Web, & Microservices', tier: 'edge', status: 'healthy' },
      { id: 'w-kinesis', name: 'Amazon Kinesis Firehose', type: 'analytics', service: 'Serverless Real-Time Ingestion', tier: 'cloud', isSPOF: false, status: 'healthy', description: 'Buffers, compresses & converts format' },
      { id: 'w-glue-etl', name: 'AWS Glue Serverless ETL', type: 'analytics', service: 'Auto-Scaling Apache Spark Jobs', tier: 'cloud', isSPOF: false, status: 'healthy', description: 'Glue Data Catalog + Partitioning' },
      { id: 'w-s3-lake', name: 'Amazon S3 Modern Data Lake', type: 'storage', service: 'Tiered Parquet Lake (Raw/Curated)', tier: 'cloud', isSPOF: false, status: 'healthy', description: '11 9s durability, partitioned by date' },
      { id: 'w-athena', name: 'Amazon Athena (Presto SQL)', type: 'analytics', service: 'Serverless Interactive Analytics', tier: 'cloud', isSPOF: false, status: 'healthy', description: 'Pay-per-query ad-hoc SQL' }
    ],
    connections: [
      { from: 'w-stream-sources', to: 'w-kinesis', label: 'Real-Time Streaming PutRecord', type: 'sync' },
      { from: 'w-kinesis', to: 'w-s3-lake', label: 'Micro-Batch Buffer Delivery', type: 'async' },
      { from: 'w-s3-lake', to: 'w-glue-etl', label: 'Automated Spark Transformation', type: 'async' },
      { from: 'w-s3-lake', to: 'w-athena', label: 'Columnar Parquet Pushdown', type: 'sync' }
    ],
    monthlyCostEst: 64,
    availabilitySLA: '99.99%',
    rto: '< 60 Seconds Delivery',
    rpo: 'Real-Time Streaming Commit',
    scores: {
      operationalExcellence: 97,
      security: 95,
      reliability: 98,
      performanceEfficiency: 98,
      costOptimization: 94,
      sustainability: 96
    },
    iacSnippet: {
      language: 'hcl',
      filename: 'well_architected_data_lake.tf',
      code: `# WELL-ARCHITECTED: Kinesis Firehose directly into S3 Parquet Data Lake
resource "aws_kinesis_firehose_delivery_stream" "lake_stream" {
  name        = "clickstream-lake-ingestion"
  destination = "extended_s3"

  extended_s3_configuration {
    role_arn   = aws_iam_role.firehose_role.arn
    bucket_arn = aws_s3_bucket.data_lake.arn
    prefix     = "curated/year=!{timestamp:yyyy}/month=!{timestamp:MM}/"

    # Serverless format conversion to Columnar Parquet:
    data_format_conversion_configuration {
      output_format_configuration {
        serializer {
          parquet_ser_de {}
        }
      }
      schema_configuration {
        database_name = aws_glue_catalog_database.lake_db.name
        table_name    = aws_glue_catalog_table.events.name
        role_arn      = aws_iam_role.firehose_role.arn
      }
    }
  }
}`,
      notes: 'Firehose converts JSON to Parquet on the fly, saving up to 80% on query scanning costs with Athena.'
    }
  },
  metrics: [
    { label: 'Data Freshness / Analytics Latency', naiveValue: '24 Hours (Nightly Batch)', wellArchValue: '< 60 Seconds (Real-Time Ingestion)', impact: 'positive', explanation: 'Kinesis Firehose buffers and lands data in S3 within 60 seconds.' },
    { label: 'Impact on Live Production DB', naiveValue: 'Table Locks during mysqldump', wellArchValue: 'Zero Impact (Decoupled Stream)', impact: 'positive', explanation: 'Analytics queries run against S3 via Athena without touching production databases.' },
    { label: 'Query Performance & Cost', naiveValue: 'Scanning whole raw CSVs ($$$)', wellArchValue: '85% Cost Drop via Parquet Columnar Pushdown', impact: 'positive', explanation: 'Parquet format only reads columns referenced in the SQL SELECT statement.' },
    { label: 'Max Dataset Scalability', naiveValue: 'Limited by single server RAM (80GB)', wellArchValue: 'Petabyte-scale distributed execution', impact: 'positive', explanation: 'S3 and Glue scale compute and storage independently to petabytes.' }
  ],
  chaos: {
    id: 'chaos-data-pipeline',
    title: '100x Payload Explosion & Corrupted Data Ingestion',
    triggerLabel: 'Simulate 100x Data Spike & Schema Drift',
    description: 'During a marketing campaign, event telemetry surges by 100x while an update sends malformed JSON records into the pipeline.',
    affectedNodeIds: ['n-cron-ec2', 'n-flat-csv', 'w-kinesis', 'w-glue-etl'],
    naiveConsequence: {
      statusText: 'OUT OF MEMORY HARD CRASH & MISSING REPORTS',
      errorRate: '100% Pipeline Stoppage',
      latency: 'Data frozen indefinitely',
      downtime: '48 Hours until manual script modification',
      narrative: 'The Python script runs out of memory, corrupts the local CSV file, and leaves executive dashboards displaying stale zeroes.'
    },
    wellArchConsequence: {
      statusText: 'AUTO-SCALED INGESTION & MALFORMED ISOLATION',
      errorRate: '0.00% Streaming Data Loss',
      latency: '< 45s to Lake',
      failoverTime: 'Instant (Firehose scales shards dynamically)',
      narrative: 'Kinesis Firehose dynamically scales buffer limits. Malformed records are safely routed to an S3 quarantine error bucket for inspection. Athena queries continue executing smoothly.'
    }
  },
  speakerNotes: {
    hook: 'If your business has to wait until tomorrow morning to see what your customers did today, you are competing in slow motion.',
    keyPoints: [
      'Modern data architectures decouple operational transactional systems (OLTP) from analytics (OLAP).',
      'Converting data to columnar Parquet via Glue or Firehose reduces Athena scan costs by up to 90%.',
      'Amazon Athena allows SQL queries directly on S3 data lakes without managing any database clusters.'
    ],
    architectTip: 'Always partition your S3 data lake by date (year/month/day) to prevent full-bucket scans in Athena.',
    examQuestion: 'A company needs to ingest streaming clickstream data, convert it to Apache Parquet format, and load it into Amazon S3 for ad-hoc SQL querying. What serverless combination is best? (Answer: Amazon Kinesis Data Firehose with format conversion enabled and Amazon Athena).'
  }
};
