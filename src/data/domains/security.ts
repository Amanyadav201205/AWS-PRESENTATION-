import { DomainData } from '../../types';

export const securityDomain: DomainData = {
  id: 'securing-applications',
  number: 6,
  title: 'Securing Applications & Data Access',
  subtitle: 'IAM Roles (STS), AWS Secrets Manager, KMS CMK, & AWS WAF vs. Root Keys & Hardcoded Secrets',
  category: 'Security & Governance',
  pillars: ['Security', 'Operational Excellence', 'Reliability'],
  customerRequirement: {
    clientName: 'SafeVault Identity & FinTech',
    businessGoal: 'Zero Trust architecture protecting customer PII and API endpoints against OWASP Top 10 vulnerabilities, unauthorized privilege escalation, and credential theft.',
    challenges: [
      'Prevent credential leaks from developers pushing access keys to GitHub',
      'Protect APIs against automated SQL injection and credential stuffing bots',
      'Automate database password rotation without taking applications offline'
    ],
    budgetOrSlaTarget: 'Zero Hardcoded Secrets | 100% OWASP Mitigation at Edge | Automated 30-Day Rotation'
  },
  normalPrescription: {
    title: 'Permanent IAM Access Keys & Hardcoded Root Secrets in App Code',
    prescribedServices: 'Permanent AKIA IAM access keys, plain-text environment variables, root account login',
    whyItSeemsLogical: 'Avoids having to configure IAM roles, STS tokens, or external secret stores during initial development.',
    whyItFailsInProduction: [
      'Hardcoded access keys in code repositories lead to automated credential theft and cryptojacking',
      'No Web Application Firewall: SQL injection queries directly execute against databases',
      'Passwords never rotated because changing them requires redeploying the application'
    ]
  },
  wafTransformationSummary: 'WAF enforces IAM Roles with temporary STS tokens, AWS Secrets Manager for automated 30-day credential rotation, AWS KMS envelope encryption, and AWS WAF with Managed Rule sets at the edge.',

  naive: {
    name: 'Hardcoded Root Keys, Static Passwords & No WAF',
    tagline: 'Permanent AKIA keys committed to GitHub with wide-open root privileges',
    description: 'Application code contains hardcoded AWS IAM access keys with AdministratorAccess. Database credentials are plain text environment variables. Port 22 is open to the internet. There is no Web Application Firewall to shield HTTP endpoints from common web exploits.',
    bulletPoints: [
      'Hardcoded permanent IAM credentials in git repo: zero key rotation or expiry',
      'AdministratorAccess policy granted indiscriminately to developers and machines',
      'Plain text database passwords stored directly in configuration files',
      'No Web Application Firewall (WAF): vulnerable to SQL injection, XSS, and layer 7 DDoS'
    ],
    nodes: [
      { id: 'n-hacker', name: 'Malicious Attacker', type: 'client', service: 'Dark Web Botnet', tier: 'edge', status: 'degraded' },
      { id: 'n-app-vuln', name: 'App with Hardcoded Keys', type: 'compute', service: 'EC2 with AKIA... in config.json', tier: 'public', isSPOF: true, status: 'healthy', description: 'Hardcoded root secrets in application bundle' },
      { id: 'n-db-raw', name: 'Database (Cleartext Password)', type: 'database', service: 'DB with root/password123', tier: 'public', isSPOF: true, status: 'healthy' }
    ],
    connections: [
      { from: 'n-hacker', to: 'n-app-vuln', label: 'SQL Injection / XSS Ingress', type: 'sync' },
      { from: 'n-app-vuln', to: 'n-db-raw', label: 'Cleartext Unencrypted Wire', type: 'sync' }
    ],
    monthlyCostEst: 0,
    availabilitySLA: 'Security Compromised',
    rto: 'Forensic Investigation Days',
    rpo: 'Total Data Breach',
    scores: {
      operationalExcellence: 15,
      security: 5,
      reliability: 25,
      performanceEfficiency: 50,
      costOptimization: 80,
      sustainability: 50
    },
    iacSnippet: {
      language: 'hcl',
      filename: 'anti_pattern_security.tf',
      code: `# ANTI-PATTERN: Wildcard Administrator Access & Hardcoded Credentials
resource "aws_iam_user_policy" "wildcard_admin" {
  name = "god_mode_policy"
  user = "app_deployer"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = "*" # Over-privileged God Mode!
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}

# Static access keys that never expire:
resource "aws_iam_access_key" "permanent_key" {
  user = "app_deployer" # Downloaded to developer laptops
}`,
      notes: 'Wildcard Action="*" and Resource="*" grants full administrative control over the entire AWS account with permanent credentials.'
    }
  },
  wellArch: {
    name: 'IAM Roles (Temporary STS), Secrets Manager, KMS CMK & AWS WAF',
    tagline: 'Zero hardcoded secrets, automated 30-day rotation, and Edge WAF inspection',
    description: 'Zero Trust architectural posture. EC2/ECS instances assume temporary STS credentials via IAM Instance Profiles with strict Least Privilege policies. Database credentials rotate automatically every 30 days via AWS Secrets Manager and Lambda. AWS WAF blocks OWASP Top 10 exploits at the edge, and AWS KMS Customer Managed Keys provide envelope encryption.',
    bulletPoints: [
      'Zero static credentials: IAM Roles deliver temporary 1-hour credentials via STS',
      'AWS Secrets Manager automatically rotates database credentials every 30 days without downtime',
      'AWS WAF Managed Rules actively inspect and block SQL Injection, XSS, and malicious scrapers',
      'Envelope encryption with KMS Customer Managed Keys (CMK) featuring cryptographic auditing in CloudTrail'
    ],
    nodes: [
      { id: 'w-waf', name: 'AWS WAF (OWASP Managed Rules)', type: 'waf', service: 'AWS WAF + Shield Standard', tier: 'edge', isSPOF: false, status: 'healthy', description: 'Blocks SQLi, XSS, and rate limits bad actors' },
      { id: 'w-iam-role', name: 'IAM Role (Least Privilege STS)', type: 'security', service: 'Instance Profile (No hardcoded keys)', tier: 'cloud', isSPOF: false, status: 'healthy' },
      { id: 'w-sec-mgr', name: 'AWS Secrets Manager', type: 'security', service: 'Automated 30-Day Rotation Engine', tier: 'cloud', isSPOF: false, status: 'healthy', description: 'Lambda auto-rotates database passwords' },
      { id: 'w-kms', name: 'AWS KMS (Customer Managed Key)', type: 'security', service: 'Envelope Encryption CMK', tier: 'cloud', isSPOF: false, status: 'healthy', description: 'Audited in CloudTrail' },
      { id: 'w-guardduty', name: 'Amazon GuardDuty', type: 'security', service: 'ML Threat Detection Engine', tier: 'cloud', isSPOF: false, status: 'healthy', description: 'Continuous VPC Flow & CloudTrail anomaly scanning' }
    ],
    connections: [
      { from: 'w-waf', to: 'w-iam-role', label: 'Sanitized Clean Traffic', type: 'sync' },
      { from: 'w-iam-role', to: 'w-sec-mgr', label: 'Encrypted Credential Fetch', type: 'sync' },
      { from: 'w-sec-mgr', to: 'w-kms', label: 'Envelope Decrypt CMK', type: 'sync' },
      { from: 'w-iam-role', to: 'w-guardduty', label: 'Continuous Telemetry Stream', type: 'async' }
    ],
    monthlyCostEst: 68,
    availabilitySLA: '99.99%',
    rto: 'Instant Threat Neutralization',
    rpo: 'Zero Exposure',
    scores: {
      operationalExcellence: 96,
      security: 99,
      reliability: 96,
      performanceEfficiency: 92,
      costOptimization: 88,
      sustainability: 90
    },
    iacSnippet: {
      language: 'hcl',
      filename: 'well_architected_security.tf',
      code: `# WELL-ARCHITECTED: Least Privilege IAM Role, Secrets Manager & WAF
resource "aws_iam_role" "app_role" {
  name = "app-least-privilege-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
}

resource "aws_wafv2_web_acl" "edge_shield" {
  name        = "production-edge-waf"
  scope       = "REGIONAL"
  default_action { allow {} }

  rule {
    name     = "AWSManagedRulesSQLiRuleSet"
    priority = 1
    override_action { none {} }
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesSQLiRuleSet"
        vendor_name = "AWS"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "WAF-SQLi-Blocks"
      sampled_requests_enabled   = true
    }
  }
}`,
      notes: 'No long-term credentials anywhere. Web ACL blocks OWASP exploits before they ever reach application compute.'
    }
  },
  metrics: [
    { label: 'Static Credential Exposure', naiveValue: '100% (Hardcoded in Git/VM)', wellArchValue: '0% (Temporary STS Tokens)', impact: 'positive', explanation: 'Eliminates permanent credentials that can be leaked or stolen.' },
    { label: 'Credential Rotation Cadence', naiveValue: 'Never (Until Breached)', wellArchValue: 'Automated Every 30 Days (Zero Downtime)', impact: 'positive', explanation: 'AWS Secrets Manager automates password rotation via Lambda.' },
    { label: 'OWASP Exploit Protection', naiveValue: '0% (No WAF Inspection)', wellArchValue: '100% Managed WAF Rule Sets', impact: 'positive', explanation: 'SQLi, XSS, and malicious bot scraping blocked at the CDN/ALB edge.' },
    { label: 'Data Encryption Standard', naiveValue: 'Cleartext / Unaudited Keys', wellArchValue: 'KMS Envelope Encryption CMK', impact: 'positive', explanation: 'All data at rest is encrypted with customer-managed keys audited in CloudTrail.' }
  ],
  chaos: {
    id: 'chaos-security',
    title: 'SQL Injection Attack & Stolen Access Key Exploit',
    triggerLabel: 'Simulate SQLi Attack & Stolen Key Exploit',
    description: "An attacker attempts to inject ' OR 1=1 -- into customer search inputs while using a stolen access key to download S3 data.",
    affectedNodeIds: ['n-app-vuln', 'w-waf', 'w-guardduty'],
    naiveConsequence: {
      statusText: 'MASSIVE DATA BREACH & REPUTATIONAL DISASTER',
      errorRate: '100% of User Data Dumped',
      latency: 'N/A',
      downtime: 'Subpoena & Emergency Shutdown',
      narrative: 'SQL injection bypasses auth, exposing 500,000 credit card records. The stolen permanent IAM key is used to spin up unauthorized GPU crypto mining instances.'
    },
    wellArchConsequence: {
      statusText: 'EXPLOIT BLOCKED AT EDGE: HTTP 403 FORBIDDEN',
      errorRate: '0% Legitimate Impact',
      latency: '< 15ms',
      failoverTime: 'Instant (Edge Rejection)',
      narrative: 'AWS WAF matches the SQLi pattern and drops the request with HTTP 403 Forbidden. GuardDuty detects anomalous API attempts and triggers automated IAM quarantine via EventBridge.'
    }
  },
  speakerNotes: {
    hook: 'In the cloud, identity is the new network perimeter. If you are using permanent IAM access keys in production, you are failing the AWS Security Pillar on day one.',
    keyPoints: [
      'Always use IAM Roles with STS temporary credentials instead of long-lived access keys.',
      'AWS Secrets Manager takes the human factor out of database password rotation.',
      'AWS WAF provides immediate perimeter defense against zero-day vulnerabilities like Log4j and OWASP Top 10.'
    ],
    architectTip: 'Enforce AWS Organizations Service Control Policies (SCPs) to deny the creation of access keys in production accounts altogether.',
    examQuestion: 'A company needs to store database credentials securely and rotate them automatically without modifying application code. What service should they use? (Answer: AWS Secrets Manager with automatic rotation enabled).'
  }
};
