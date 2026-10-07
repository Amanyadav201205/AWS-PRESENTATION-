import { DomainData } from '../../types';

export const automationDomain: DomainData = {
  id: 'automating-architecture',
  number: 9,
  title: 'Automating the Architecture',
  subtitle: '100% Terraform/CDK GitOps with Drift Detection vs. Manual "ClickOps" Console Changes',
  category: 'Operations & Reliability',
  pillars: ['Operational Excellence', 'Security', 'Reliability'],
  customerRequirement: {
    clientName: 'CloudScale Global SaaS',
    businessGoal: 'Standardize cloud environments across production, staging, and disaster recovery with 100% reproducible Infrastructure as Code and automated drift detection.',
    challenges: [
      'Configuration drift between staging and production causes unexpected deployment crashes',
      'Manual changes made in the AWS console leave undocumented security holes',
      'Rebuilding the entire infrastructure after a disaster takes days of guesswork'
    ],
    budgetOrSlaTarget: '100% IaC Versioned | Drift Detected & Reverted < 60s | Full Rebuild < 15m'
  },
  normalPrescription: {
    title: 'Manual "ClickOps" Provisioning via AWS Management Console',
    prescribedServices: 'Engineers manually click buttons in the AWS Console to launch servers, VPCs, and SGs',
    whyItSeemsLogical: 'Intuitive graphical interface allows launching infrastructure without learning Terraform or CloudFormation.',
    whyItFailsInProduction: [
      'Zero version control or peer review: anyone with console access can make breaking changes',
      'Snowflake environments: staging and production differ in subtle, undocumented ways',
      'Disaster recovery requires manual recreation from memory, taking days'
    ]
  },
  wafTransformationSummary: 'WAF mandates 100% declarative IaC via Terraform/AWS CDK in GitOps pipelines, paired with AWS Config rules that continuously detect drift and trigger Systems Manager automated rollbacks.',

  naive: {
    name: 'Manual "ClickOps" in AWS Console with Snowflake Drift',
    tagline: 'Ad-hoc console clicks, undocumented ports, and un-reproducible staging',
    description: 'Infrastructure is provisioned by hand through the AWS Management Console. Staging and production environments have subtle differing versions, unrecorded security group changes, and manual SSH patch work. When disaster strikes, no one knows how to rebuild the environment.',
    bulletPoints: [
      'Zero version control: changes cannot be code-reviewed, tested, or rolled back',
      'Configuration drift: staging does not match production, causing deployment failures',
      'Undocumented security modifications left permanently active by tired developers',
      'Disaster recovery requires days of guesswork reading fragmented wiki notes'
    ],
    nodes: [
      { id: 'n-dev-click', name: 'Developer in AWS Console', type: 'client', service: 'Manual Web Browser Sessions', tier: 'edge', status: 'healthy', description: 'Clicking buttons in AWS Management Console' },
      { id: 'n-snowflake-prod', name: 'Snowflake Production VPC', type: 'network', service: 'Manually Configured Infrastructure', tier: 'cloud', isSPOF: true, status: 'healthy', description: 'Nobody knows the full configuration state' },
      { id: 'n-drifted-sg', name: 'Drifted Security Group', type: 'security', service: 'Manually Opened Ports (SSH/DB)', tier: 'cloud', isSPOF: true, status: 'degraded' }
    ],
    connections: [
      { from: 'n-dev-click', to: 'n-snowflake-prod', label: 'Manual Console Modifications', type: 'sync' },
      { from: 'n-snowflake-prod', to: 'n-drifted-sg', label: 'Undocumented State Drift', type: 'sync' }
    ],
    monthlyCostEst: 0,
    availabilitySLA: 'Human Error Prone',
    rto: 'Days to Reconstruct',
    rpo: 'Lost Configuration State',
    scores: {
      operationalExcellence: 12,
      security: 25,
      reliability: 30,
      performanceEfficiency: 40,
      costOptimization: 45,
      sustainability: 40
    },
    iacSnippet: {
      language: 'hcl',
      filename: 'anti_pattern_clickops.txt',
      code: `# ANTI-PATTERN: "ClickOps" - NO CODE EXISTS!
#
# Steps taken by engineers last year:
# 1. Logged into AWS Console using root credentials
# 2. Clicked "Launch Instance" -> clicked Next 10 times
# 3. Manually added SG rule allowing port 8080 and 22
# 4. Forgot to document which AMI was used
# 5. Staging environment created 6 months later with different kernel
# RESULT: Zero reproducibility, zero audit log, massive drift!`,
      notes: 'No IaC exists. Disaster recovery means re-clicking through hundreds of AWS console menus.'
    }
  },
  wellArch: {
    name: '100% Infrastructure as Code (IaC) with GitOps CI/CD & Drift Detection',
    tagline: 'Terraform/CDK pipelines, automated security scanning, and AWS Config self-rollback',
    description: 'Deterministic infrastructure automation. All AWS resources are declared in modular Terraform/CDK and managed via Git pull requests. Pre-commit hooks run Checkov security analysis. AWS CodePipeline automatically runs `plan` and `apply`. AWS Config continuously scans for configuration drift and triggers automated remediation if manual changes occur.',
    bulletPoints: [
      'Declarative code: every VPC, route, and IAM policy is version-controlled and peer-reviewed',
      'Automated security scanning via Checkov and tfsec blocks insecure code before deployment',
      'AWS Config rules monitor resources and automatically remediate unauthorized drift',
      'Complete disaster reconstruction: spin up an entire production region in 15 minutes'
    ],
    nodes: [
      { id: 'w-git-pr', name: 'Git Repo (Pull Request)', type: 'client', service: 'GitHub / CodeCommit', tier: 'edge', status: 'healthy', description: 'Peer reviewed code changes' },
      { id: 'w-cicd-pipeline', name: 'AWS CodePipeline / CI Runner', type: 'compute', service: 'Checkov + Terraform Plan/Apply', tier: 'cloud', isSPOF: false, status: 'healthy' },
      { id: 'w-iac-vpc', name: 'Immutable Multi-AZ VPC', type: 'network', service: 'Deterministic IaC Environment', tier: 'cloud', isSPOF: false, status: 'healthy' },
      { id: 'w-aws-config', name: 'AWS Config Drift Detector', type: 'security', service: 'Continuous Compliance Rules', tier: 'cloud', isSPOF: false, status: 'healthy', description: 'Detects unauthorized console clicks' },
      { id: 'w-ssm-auto', name: 'SSM Remediation Playbook', type: 'compute', service: 'Automated Drift Rollback', tier: 'cloud', isSPOF: false, status: 'healthy' }
    ],
    connections: [
      { from: 'w-git-pr', to: 'w-cicd-pipeline', label: 'PR Automated Test & Scan', type: 'sync' },
      { from: 'w-cicd-pipeline', to: 'w-iac-vpc', label: 'Terraform Apply (Zero Downtime)', type: 'sync' },
      { from: 'w-aws-config', to: 'w-ssm-auto', label: 'Non-Compliant Drift Alert', type: 'async' },
      { from: 'w-ssm-auto', to: 'w-iac-vpc', label: 'Auto-Revert Unauthorized Change', type: 'sync' }
    ],
    monthlyCostEst: 28,
    availabilitySLA: '99.99%',
    rto: '< 15 Minutes (Full Region Rebuild)',
    rpo: '100% Versioned State',
    scores: {
      operationalExcellence: 99,
      security: 96,
      reliability: 96,
      performanceEfficiency: 90,
      costOptimization: 92,
      sustainability: 92
    },
    iacSnippet: {
      language: 'hcl',
      filename: 'well_architected_automation.tf',
      code: `# WELL-ARCHITECTED: AWS Config Rule with Automated Remediation
resource "aws_config_config_rule" "deny_public_ssh" {
  name        = "restricted-ssh-ingress"
  description = "Checks whether security groups permit unrestricted incoming SSH"

  source {
    owner             = "AWS"
    source_identifier = "INCOMING_SSH_DISABLED"
  }
}

resource "aws_config_remediation_configuration" "auto_close_ssh" {
  config_rule_name = aws_config_config_rule.deny_public_ssh.name
  target_type      = "SSM_DOCUMENT"
  target_id        = "AWS-DisableIncomingSSHOnPort22"
  target_version   = "1"
  automatic        = true # Automatically closes rogue ports within 60 seconds!

  parameter {
    name         = "SecurityGroupId"
    resource_value = "RESOURCE_ID"
  }
}`,
      notes: 'AWS Config catches unauthorized console edits and uses Systems Manager to automatically revert security groups to their compliant state.'
    }
  },
  metrics: [
    { label: 'Environment Reproduction Speed', naiveValue: '3 to 5 Days (Manual Guesswork)', wellArchValue: '< 15 Minutes (1-Click Terraform Apply)', impact: 'positive', explanation: 'Entire infrastructure can be redeployed into any region in minutes.' },
    { label: 'Configuration Drift Frequency', naiveValue: 'Continuous & Uncontrolled', wellArchValue: 'Zero (Continuous Config Remediation)', impact: 'positive', explanation: 'AWS Config alerts and auto-reverts manual out-of-band changes.' },
    { label: 'Deployment Failure Rate', naiveValue: 'High (Differences between environments)', wellArchValue: '< 0.5% (Pre-tested IaC Pipelines)', impact: 'positive', explanation: 'Staging and production share identical, parameter-driven code.' },
    { label: 'Audit & Compliance Proof', naiveValue: 'Manual screenshots and hope', wellArchValue: '100% Git Commit Log & CloudTrail', impact: 'positive', explanation: 'Every change is tied to a specific developer PR and cryptographic commit.' }
  ],
  chaos: {
    id: 'chaos-automation',
    title: 'Rogue Engineer Manually Opens Port 22 in Console',
    triggerLabel: 'Simulate Manual Console Port Exposure',
    description: 'An engineer debugs an issue after hours, opens port 22 to 0.0.0.0/0 in the AWS console, and forgets to remove it.',
    affectedNodeIds: ['n-drifted-sg', 'w-aws-config', 'w-ssm-auto'],
    naiveConsequence: {
      statusText: 'PERMANENT EXPOSURE TO BOTNET EXPLOITS',
      errorRate: 'Security vulnerability score critical',
      latency: 'N/A',
      downtime: 'Undetected for months until security audit',
      narrative: 'Port 22 stays open permanently. Internet botnets discover it within hours and launch automated credential stuffing attacks against production instances.'
    },
    wellArchConsequence: {
      statusText: 'AUTOMATIC DRIFT DETECTED & REVERTED IN 42s',
      errorRate: '0% Impact',
      latency: 'N/A',
      failoverTime: '42 Seconds to Auto-Remediation',
      narrative: 'AWS Config flags the non-compliant security group within 30 seconds. Systems Manager Automation triggers immediately, strips the 0.0.0.0/0 rule, and sends a Slack alert to the security team.'
    }
  },
  speakerNotes: {
    hook: 'If you build your infrastructure using ClickOps in the AWS console, you do not own your infrastructure—you are renting a set of temporary accidents.',
    keyPoints: [
      'Infrastructure as Code (IaC) is the bedrock of Pillar 1: Operational Excellence.',
      'AWS Config rules combined with Systems Manager provide automated guardrails against human error.',
      'With modular Terraform or AWS CDK, spinning up a Disaster Recovery region takes minutes instead of days.'
    ],
    architectTip: 'Remove write permissions to the AWS Console in production for everyone except CI/CD service roles.',
    examQuestion: 'A company needs to detect and automatically remediate security group configurations that allow unrestricted SSH access. What is the most effective approach? (Answer: AWS Config rule with an automated AWS Systems Manager remediation document).'
  }
};
