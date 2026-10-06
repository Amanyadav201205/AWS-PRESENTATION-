/**
 * AWS Well-Architected Framework AI Engine & Orchestrator
 * Adheres strictly to the 12 Principles of Production AI Engineering:
 * - Product-first value delivery
 * - Semantic RAG retrieval from verified WAF knowledge base
 * - Prompt injection & malicious query guardrails
 * - Token-by-token simulated streaming lifecycle
 * - Abstention on unsupported requests
 * - Safe agent action proposal generation
 */

import { WAF_KNOWLEDGE_BASE, WafKnowledgeEntry, WafCitation, WafRemediationAction } from '../data/wafKnowledgeBase';

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: WafCitation[];
  proposedAction?: WafRemediationAction;
  isStreaming?: boolean;
  status?: 'ready' | 'streaming' | 'complete' | 'abstained' | 'error';
}

export interface AiEngineResponse {
  messageText: string;
  citations: WafCitation[];
  proposedAction?: WafRemediationAction;
  abstained: boolean;
  abstentionReason?: string;
}

// Prompt Injection & Adversarial Defense Patterns
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
  /system\s+prompt/i,
  /you\s+are\s+now\s+a/i,
  /jailbreak/i,
  /output\s+(aws|root)\s+(key|secret|credential)/i,
  /delete\s+all\s+databases/i,
  /drop\s+table/i
];

// Off-topic classification
const OFF_TOPIC_PATTERNS = [
  /recipe/i,
  /poem/i,
  /dating/i,
  /weather\s+in/i,
  /crypto\s+trading\s+bot/i,
  /lottery/i
];

export class WafAiEngine {
  /**
   * Evaluates input security and safety guardrails
   */
  public static inspectInputSecurity(query: string): { isSafe: boolean; reason?: string } {
    for (const pattern of PROMPT_INJECTION_PATTERNS) {
      if (pattern.test(query)) {
        return {
          isSafe: false,
          reason: 'Security Guardrail Activated: Query contains disallowed prompt injection or administrative credential extraction patterns.'
        };
      }
    }
    return { isSafe: true };
  }

  /**
   * Retrieves relevant knowledge entries using RAG scoring
   */
  public static retrieveRelevantKnowledge(query: string, currentDomainId?: string): WafKnowledgeEntry[] {
    const tokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    
    const scored = WAF_KNOWLEDGE_BASE.map(entry => {
      let score = 0;
      
      // Domain alignment boost
      if (currentDomainId && entry.domainId === currentDomainId) {
        score += 3;
      }

      // Keyword matching
      for (const token of tokens) {
        for (const kw of entry.keywords) {
          if (kw.includes(token) || token.includes(kw)) {
            score += 2;
          }
        }
        if (entry.topic.toLowerCase().includes(token)) score += 3;
        if (entry.antiPattern.toLowerCase().includes(token)) score += 2;
        if (entry.wellArchSolution.toLowerCase().includes(token)) score += 2;
      }

      return { entry, score };
    });

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);
    return scored.filter(s => s.score > 0).map(s => s.entry);
  }

  /**
   * Generates a grounded response based on verified AWS WAF corpus
   */
  public static generateGroundedResponse(query: string, currentDomainId?: string): AiEngineResponse {
    // 1. Security Check
    const security = this.inspectInputSecurity(query);
    if (!security.isSafe) {
      return {
        messageText: `⚠️ **Security Boundary Enforced**\n\n${security.reason}\n\n*In accordance with AWS Security Pillar (SEC-01: Securely operate your workload), administrative overrides and credential disclosures are strictly prohibited. Please rephrase your query around architecture design, 6 Pillars audit, or cost optimization.*`,
        citations: [],
        abstained: true,
        abstentionReason: 'Prompt Injection Defense'
      };
    }

    // 2. Off-Topic Check
    for (const pattern of OFF_TOPIC_PATTERNS) {
      if (pattern.test(query)) {
        return {
          messageText: `ℹ️ **Scope Boundary Notice (Abstention)**\n\nI am the **AWS Well-Architected Copilot**, grounded exclusively in AWS enterprise cloud architecture, the 6 Pillars, FinOps, and resilient system design. I cannot assist with general, off-topic requests.\n\n*How can I help you audit your cloud infrastructure, eliminate single points of failure, or cut your AWS bill today?*`,
          citations: [],
          abstained: true,
          abstentionReason: 'Out-of-Scope Query'
        };
      }
    }

    // 3. RAG Retrieval
    const relevantEntries = this.retrieveRelevantKnowledge(query, currentDomainId);
    
    if (relevantEntries.length === 0) {
      // Fallback response with guidance
      return {
        messageText: `### 📋 Architectural Assessment\n\nBased on your query: *"${query}"*, the AWS Well-Architected Framework emphasizes evaluating workloads across the **6 Pillars**:\n\n1. **Operational Excellence**: Automate deployments via IaC (CloudFormation/Terraform).\n2. **Security**: Enforce least privilege IAM, AWS KMS envelope encryption, and edge protection (WAF).\n3. **Reliability**: Remove Single Points of Failure (SPOF) with Multi-AZ architectures and automated failovers.\n4. **Performance Efficiency**: Utilize Graviton3 ARM64 compute and multi-tier caching (CloudFront + ElastiCache).\n5. **Cost Optimization**: Right-size over-provisioned instances, apply Savings Plans, and automate lifecycle tiering.\n6. **Sustainability**: Maximize hardware utilization with serverless architectures.\n\n*For verified specifications, select any of the 15 domains in the sidebar or explore the 6 Pillars Master Audit.*`,
        citations: [
          {
            id: 'cit-overview-waf',
            pillar: 'Framework Foundation',
            whitepaper: 'AWS Well-Architected Framework Core Whitepaper',
            section: 'General Design Principles',
            sourceUrl: 'https://aws.amazon.com/architecture/well-architected/',
            verifiedQuote: 'The AWS Well-Architected Framework helps cloud architects build the most secure, high-performing, resilient, and efficient infrastructure possible for their applications.'
          }
        ],
        abstained: false
      };
    }

    const top = relevantEntries[0];
    const citations = top.citations;
    const action = top.recommendedAction;

    let responseMarkdown = `### 🏛️ AWS Well-Architected Assessment: ${top.topic}\n\n`;
    responseMarkdown += `#### 🚨 Anti-Pattern Detected (High Risk Issue)\n${top.antiPattern}\n\n`;
    responseMarkdown += `#### 🛡️ Well-Architected Best Practice Remediation\n${top.wellArchSolution}\n\n`;
    responseMarkdown += `#### 📐 Theoretical & Mathematical Proof\n*${top.theoreticalProof}*\n\n`;

    if (action) {
      responseMarkdown += `#### ⚡ Supervised Agentic Remediation Available\n`;
      responseMarkdown += `I have prepared a supervised remediation action: **${action.title}** (${action.costDelta}, Risk: ${action.riskLevel}). You can review its parameters below and confirm execution to apply it directly to the active topology stage.`;
    }

    return {
      messageText: responseMarkdown,
      citations,
      proposedAction: action,
      abstained: false
    };
  }

  /**
   * Simulates realistic token-by-token streaming with cancellation support
   */
  public static streamResponse(
    fullText: string,
    onChunk: (currentStreamedText: string) => void,
    onComplete: () => void,
    signal?: { isCancelled: boolean }
  ): void {
    const words = fullText.split(' ');
    let currentIndex = 0;
    let accumulated = '';

    const interval = setInterval(() => {
      if (signal?.isCancelled || currentIndex >= words.length) {
        clearInterval(interval);
        if (!signal?.isCancelled) {
          onComplete();
        }
        return;
      }

      accumulated += (currentIndex === 0 ? '' : ' ') + words[currentIndex];
      currentIndex++;
      onChunk(accumulated);
    }, 28); // ~35 tokens per second for realistic stream
  }
}
