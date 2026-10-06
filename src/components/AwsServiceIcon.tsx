import React from 'react';

export type AwsServiceCategory = 
  | 'compute' 
  | 'storage' 
  | 'database' 
  | 'networking' 
  | 'security' 
  | 'integration' 
  | 'analytics' 
  | 'management' 
  | 'general';

interface AwsServiceIconProps {
  service: string;
  size?: number;
  className?: string;
}

export const AwsServiceIcon: React.FC<AwsServiceIconProps> = ({ 
  service, 
  size = 28, 
  className = '' 
}) => {
  const s = service.toLowerCase();

  // Helper to determine service identity and color
  // Compute: #EC7211 (Orange)
  // Storage: #5A8834 or #30D158 (Green)
  // Database: #2E73B8 or #2997FF (Blue)
  // Networking/Content Delivery: #8C4FFF or #BF5AF2 (Purple)
  // Security/Identity: #DD344C or #FF453A (Red)
  // Application Integration: #CC2264 (Pink/Magenta)
  // Management/Governance: #FF9900 (Amber)
  // Analytics: #8C4FFF (Violet/Blue)

  if (s.includes('s3') || s.includes('glacier') || s.includes('backup') || s.includes('storage') || s.includes('ebs')) {
    // S3 & Storage Icons
    const isS3 = s.includes('s3');
    const isEBS = s.includes('ebs');
    const isGlacier = s.includes('glacier') || s.includes('backup');

    if (isEBS) {
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={`aws-service-icon ${className}`} fill="none">
          <rect width="32" height="32" rx="6" fill="#1C3829" stroke="#30D158" strokeWidth="1.2" />
          <path d="M7 11C7 9.5 8 8 16 8C24 8 25 9.5 25 11V21C25 22.5 24 24 16 24C8 24 7 22.5 7 21V11Z" fill="#30D158" fillOpacity="0.2" stroke="#30D158" strokeWidth="1.4" />
          <line x1="7" y1="15" x2="25" y2="15" stroke="#30D158" strokeWidth="1.2" strokeDasharray="2 2" />
          <line x1="7" y1="19" x2="25" y2="19" stroke="#30D158" strokeWidth="1.2" strokeDasharray="2 2" />
          <circle cx="16" cy="11.5" r="1.5" fill="#30D158" />
          <circle cx="21" cy="21.5" r="1" fill="#30D158" />
        </svg>
      );
    }

    if (isGlacier) {
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={`aws-service-icon ${className}`} fill="none">
          <rect width="32" height="32" rx="6" fill="#152B3C" stroke="#2997FF" strokeWidth="1.2" />
          <path d="M9 10C9 8.89 9.89 8 11 8H21C22.11 8 23 8.89 23 10V22C23 23.11 22.11 24 21 24H11C9.89 24 9 23.11 9 22V10Z" stroke="#2997FF" strokeWidth="1.4" />
          <circle cx="16" cy="16" r="3" stroke="#2997FF" strokeWidth="1.4" />
          <line x1="16" y1="13" x2="16" y2="11" stroke="#2997FF" strokeWidth="1.4" />
          <line x1="16" y1="21" x2="16" y2="19" stroke="#2997FF" strokeWidth="1.4" />
          <line x1="13" y1="16" x2="11" y2="16" stroke="#2997FF" strokeWidth="1.4" />
          <line x1="21" y1="16" x2="19" y2="16" stroke="#2997FF" strokeWidth="1.4" />
        </svg>
      );
    }

    // Default S3 Bucket
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" className={`aws-service-icon ${className}`} fill="none">
        <rect width="32" height="32" rx="6" fill="#1C3829" stroke="#30D158" strokeWidth="1.2" />
        {/* S3 Bucket Shape */}
        <path d="M8 11C8 9.5 11.5 8 16 8C20.5 8 24 9.5 24 11V21C24 22.5 20.5 24 16 24C11.5 24 8 22.5 8 21V11Z" fill="#30D158" fillOpacity="0.2" stroke="#30D158" strokeWidth="1.4" />
        <ellipse cx="16" cy="11" rx="8" ry="3" fill="#30D158" fillOpacity="0.4" stroke="#30D158" strokeWidth="1.4" />
        <ellipse cx="16" cy="16" rx="8" ry="2.5" stroke="#30D158" strokeWidth="1" strokeDasharray="2 2" />
        <path d="M16 11V18M16 18L13.5 15.5M16 18L18.5 15.5" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (s.includes('ec2') || s.includes('compute') || s.includes('instance') || s.includes('fargate') || s.includes('ecs') || s.includes('eks')) {
    // Amazon EC2 / Container Compute
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" className={`aws-service-icon ${className}`} fill="none">
        <rect width="32" height="32" rx="6" fill="#38210F" stroke="#FF9900" strokeWidth="1.2" />
        {/* EC2 Server Box */}
        <rect x="7" y="8" width="18" height="16" rx="2" fill="#FF9900" fillOpacity="0.2" stroke="#FF9900" strokeWidth="1.4" />
        <line x1="7" y1="13" x2="25" y2="13" stroke="#FF9900" strokeWidth="1" />
        <line x1="7" y1="18" x2="25" y2="18" stroke="#FF9900" strokeWidth="1" />
        <circle cx="10" cy="10.5" r="1" fill="#FF9900" />
        <circle cx="10" cy="15.5" r="1" fill="#FF9900" />
        <circle cx="10" cy="21" r="1" fill="#FF9900" />
        <path d="M14 15.5H22M19 13.5L22 15.5L19 17.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (s.includes('lambda') || s.includes('serverless')) {
    // AWS Lambda
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" className={`aws-service-icon ${className}`} fill="none">
        <rect width="32" height="32" rx="6" fill="#38210F" stroke="#FF9900" strokeWidth="1.2" />
        {/* Greek Lambda Symbol */}
        <path d="M9 23L14.5 13L17.5 8H21L17.5 14L23 23H19L15 17L11.5 23H9Z" fill="#FF9900" />
      </svg>
    );
  }

  if (s.includes('aurora') || s.includes('rds') || s.includes('database') || s.includes('sql') || s.includes('postgres')) {
    // Amazon Aurora / RDS
    const isAurora = s.includes('aurora');
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" className={`aws-service-icon ${className}`} fill="none">
        <rect width="32" height="32" rx="6" fill="#132B44" stroke="#2997FF" strokeWidth="1.2" />
        {/* Database Cylinders */}
        <ellipse cx="16" cy="10" rx="8" ry="3" fill="#2997FF" fillOpacity="0.3" stroke="#2997FF" strokeWidth="1.4" />
        <path d="M8 10V16C8 17.65 11.58 19 16 19C20.42 19 24 17.65 24 16V10" stroke="#2997FF" strokeWidth="1.4" />
        <path d="M8 16V22C8 23.65 11.58 25 16 25C20.42 25 24 23.65 24 22V16" stroke="#2997FF" strokeWidth="1.4" />
        {isAurora && (
          <path d="M15 7L18 10L14 13L17 16" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    );
  }

  if (s.includes('dynamodb') || s.includes('nosql')) {
    // Amazon DynamoDB
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" className={`aws-service-icon ${className}`} fill="none">
        <rect width="32" height="32" rx="6" fill="#132B44" stroke="#2997FF" strokeWidth="1.2" />
        <ellipse cx="16" cy="10" rx="7" ry="2.5" stroke="#2997FF" strokeWidth="1.4" />
        <path d="M9 10V22C9 23.38 12.13 24.5 16 24.5C19.87 24.5 23 23.38 23 22V10" stroke="#2997FF" strokeWidth="1.4" />
        <path d="M17 7L13 16H18L14 24" stroke="#FF9900" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (s.includes('elasticache') || s.includes('redis') || s.includes('cache') || s.includes('memcached')) {
    // Amazon ElastiCache / Redis
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" className={`aws-service-icon ${className}`} fill="none">
        <rect width="32" height="32" rx="6" fill="#132B44" stroke="#2997FF" strokeWidth="1.2" />
        <rect x="9" y="9" width="14" height="14" rx="2" fill="#2997FF" fillOpacity="0.2" stroke="#2997FF" strokeWidth="1.4" />
        <path d="M16 6V9M16 23V26M6 16H9M23 16H26" stroke="#2997FF" strokeWidth="1.4" />
        <path d="M16 11L14 16H18L16 21" stroke="#FF9F0A" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }

  if (s.includes('cloudfront') || s.includes('cdn')) {
    // Amazon CloudFront
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" className={`aws-service-icon ${className}`} fill="none">
        <rect width="32" height="32" rx="6" fill="#2E1844" stroke="#BF5AF2" strokeWidth="1.2" />
        {/* Globe with distribution arrows */}
        <circle cx="16" cy="16" r="7.5" stroke="#BF5AF2" strokeWidth="1.4" />
        <ellipse cx="16" cy="16" rx="3.5" ry="7.5" stroke="#BF5AF2" strokeWidth="1.2" />
        <line x1="8.5" y1="16" x2="23.5" y2="16" stroke="#BF5AF2" strokeWidth="1.2" />
        <path d="M6 10L10 10M10 10L10 6" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M26 22L22 22M22 22L22 26" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (s.includes('route 53') || s.includes('dns') || s.includes('route53')) {
    // Amazon Route 53
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" className={`aws-service-icon ${className}`} fill="none">
        <rect width="32" height="32" rx="6" fill="#2E1844" stroke="#BF5AF2" strokeWidth="1.2" />
        <circle cx="16" cy="16" r="7.5" stroke="#BF5AF2" strokeWidth="1.4" />
        <path d="M16 9V12M16 20V23M9 16H12M20 16H23" stroke="#BF5AF2" strokeWidth="1.2" />
        <path d="M12 19L16 13L20 19L16 17L12 19Z" fill="#FFFFFF" />
      </svg>
    );
  }

  if (s.includes('alb') || s.includes('nlb') || s.includes('elb') || s.includes('load balancer') || s.includes('gateway')) {
    // Elastic Load Balancing (ALB/NLB) / API Gateway
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" className={`aws-service-icon ${className}`} fill="none">
        <rect width="32" height="32" rx="6" fill="#2E1844" stroke="#BF5AF2" strokeWidth="1.2" />
        {/* Load balancer scale / split */}
        <rect x="7" y="13" width="6" height="6" rx="1.5" stroke="#BF5AF2" strokeWidth="1.2" />
        <rect x="19" y="8" width="6" height="6" rx="1.5" stroke="#BF5AF2" strokeWidth="1.2" />
        <rect x="19" y="18" width="6" height="6" rx="1.5" stroke="#BF5AF2" strokeWidth="1.2" />
        <path d="M13 16H16M16 11V21M16 11H19M16 21H19" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }

  if (s.includes('sqs') || s.includes('queue')) {
    // Amazon SQS (Simple Queue Service)
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" className={`aws-service-icon ${className}`} fill="none">
        <rect width="32" height="32" rx="6" fill="#3D1229" stroke="#FF375F" strokeWidth="1.2" />
        {/* Queue Stack */}
        <rect x="8" y="10" width="16" height="3.5" rx="1" fill="#FF375F" fillOpacity="0.4" stroke="#FF375F" strokeWidth="1.2" />
        <rect x="8" y="15" width="16" height="3.5" rx="1" fill="#FF375F" fillOpacity="0.6" stroke="#FF375F" strokeWidth="1.2" />
        <rect x="8" y="20" width="16" height="3.5" rx="1" fill="#FF375F" stroke="#FF375F" strokeWidth="1.2" />
        <path d="M5 16H7M25 16H27" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }

  if (s.includes('sns') || s.includes('pubsub') || s.includes('notification')) {
    // Amazon SNS (Simple Notification Service)
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" className={`aws-service-icon ${className}`} fill="none">
        <rect width="32" height="32" rx="6" fill="#3D1229" stroke="#FF375F" strokeWidth="1.2" />
        <circle cx="16" cy="16" r="3.5" fill="#FF375F" />
        <path d="M16 8V10M16 22V24M8 16H10M22 16H24M10.5 10.5L12 12M20 20L21.5 21.5M10.5 21.5L12 20M20 12L21.5 10.5" stroke="#FF375F" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }

  if (s.includes('waf') || s.includes('shield') || s.includes('security') || s.includes('firewall')) {
    // AWS WAF & Shield
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" className={`aws-service-icon ${className}`} fill="none">
        <rect width="32" height="32" rx="6" fill="#381014" stroke="#FF453A" strokeWidth="1.2" />
        {/* Shield */}
        <path d="M16 7L24 10.5V16C24 21 20 24.5 16 26C12 24.5 8 21 8 16V10.5L16 7Z" fill="#FF453A" fillOpacity="0.2" stroke="#FF453A" strokeWidth="1.4" />
        <path d="M12 16L15 19L20 14" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (s.includes('iam') || s.includes('kms') || s.includes('vault') || s.includes('key')) {
    // AWS KMS / IAM
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" className={`aws-service-icon ${className}`} fill="none">
        <rect width="32" height="32" rx="6" fill="#381014" stroke="#FF453A" strokeWidth="1.2" />
        {/* Key and lock */}
        <circle cx="14" cy="14" r="4.5" stroke="#FF453A" strokeWidth="1.4" />
        <path d="M17.5 17.5L24 24M22 20L24 22M20 22L22 24" stroke="#FF9900" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }

  if (s.includes('cloudwatch') || s.includes('eventbridge') || s.includes('monitor') || s.includes('alarm')) {
    // Amazon CloudWatch / EventBridge
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" className={`aws-service-icon ${className}`} fill="none">
        <rect width="32" height="32" rx="6" fill="#38210F" stroke="#FF9900" strokeWidth="1.2" />
        {/* Telemetry dial */}
        <circle cx="16" cy="16" r="8" stroke="#FF9900" strokeWidth="1.4" />
        <path d="M16 11V16L19 19" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="16" cy="16" r="1.5" fill="#FF9900" />
      </svg>
    );
  }

  if (s.includes('kinesis') || s.includes('pipeline') || s.includes('stream') || s.includes('glue') || s.includes('emr')) {
    // AWS Kinesis / Data Pipelines
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" className={`aws-service-icon ${className}`} fill="none">
        <rect width="32" height="32" rx="6" fill="#2E1844" stroke="#BF5AF2" strokeWidth="1.2" />
        <path d="M7 11H25M7 16H25M7 21H25" stroke="#BF5AF2" strokeWidth="1.4" strokeDasharray="3 2" />
        <polygon points="12,9 15,11 12,13" fill="#FFFFFF" />
        <polygon points="18,14 21,16 18,18" fill="#FFFFFF" />
        <polygon points="14,19 17,21 14,23" fill="#FFFFFF" />
      </svg>
    );
  }

  if (s.includes('auto scaling') || s.includes('asg') || s.includes('scaling')) {
    // AWS Auto Scaling
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" className={`aws-service-icon ${className}`} fill="none">
        <rect width="32" height="32" rx="6" fill="#38210F" stroke="#FF9900" strokeWidth="1.2" />
        <path d="M9 16H23M9 16L13 12M9 16L13 20M23 16L19 12M23 16L19 20" stroke="#FF9900" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Fallback Generic Cloud / VPC Node
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={`aws-service-icon ${className}`} fill="none">
      <rect width="32" height="32" rx="6" fill="#18181F" stroke="var(--separator)" strokeWidth="1.2" />
      <path d="M10 20C8.5 20 7 18.5 7 16.5C7 14.8 8.1 13.4 9.7 13.1C10.3 10.7 12.4 9 15 9C18 9 20.4 11.2 20.8 14.1C22.6 14.4 24 16 24 18C24 20.2 22.2 22 20 22H11" stroke="var(--text-secondary)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
};
