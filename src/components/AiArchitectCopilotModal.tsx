import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  RotateCcw, 
  Square, 
  ExternalLink, 
  Terminal, 
  FileText, 
  X,
  Layers,
  ArrowRight,
  ShieldAlert,
  Cpu,
  DollarSign
} from 'lucide-react';
import { DomainData } from '../types';
import { WafAiEngine, AiChatMessage } from '../utils/wafAiEngine';
import { WafCitation, WafRemediationAction } from '../data/wafKnowledgeBase';
import { soundFX } from '../utils/soundEffects';

interface AiArchitectCopilotModalProps {
  activeDomain: DomainData;
  onClose: () => void;
  onApplyRemediation?: (action: WafRemediationAction) => void;
  onOpen6PillarsFallback: () => void;
}

export const AiArchitectCopilotModal: React.FC<AiArchitectCopilotModalProps> = ({
  activeDomain,
  onClose,
  onApplyRemediation,
  onOpen6PillarsFallback
}) => {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      content: `👋 **Welcome to the AWS Well-Architected Copilot!**\n\nI am your verified AI cloud architecture advisor, grounded in authoritative AWS whitepapers across all **6 Pillars** (Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability).\n\nCurrently inspecting **Module ${activeDomain.number}: ${activeDomain.title}**.\n\n*Select a contextual question below or ask anything about remediating single points of failure, optimizing cloud expenditure, or auditing your workloads.*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'complete'
    }
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [streamCancelSignal, setStreamCancelSignal] = useState<{ isCancelled: boolean }>({ isCancelled: false });
  const [actionToConfirm, setActionToConfirm] = useState<WafRemediationAction | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll chat on updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on open
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Suggested domain-specific prompt starters
  const suggestedPrompts = [
    `How do we eliminate single-AZ failure in ${activeDomain.title}?`,
    `Calculate the FinOps ROI & cost optimization for ${activeDomain.title}.`,
    `What does the AWS Reliability Pillar mandate for this architecture?`,
    `Generate Terraform IaC to auto-remediate anti-patterns in ${activeDomain.title}.`
  ];

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isGenerating) return;

    soundFX.playClick();
    setInputQuery('');

    const userMessageId = `user-${Date.now()}`;
    const userMessage: AiChatMessage = {
      id: userMessageId,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'complete'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsGenerating(true);

    const cancelSignal = { isCancelled: false };
    setStreamCancelSignal(cancelSignal);

    // AI Engine grounding & RAG evaluation
    const response = WafAiEngine.generateGroundedResponse(query, activeDomain.id);

    const assistantMessageId = `assistant-${Date.now()}`;
    const initialAssistantMessage: AiChatMessage = {
      id: assistantMessageId,
      sender: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations: response.citations,
      proposedAction: response.proposedAction,
      isStreaming: true,
      status: 'streaming'
    };

    setMessages(prev => [...prev, initialAssistantMessage]);

    // Stream the grounded response token by token
    WafAiEngine.streamResponse(
      response.messageText,
      (currentChunk) => {
        setMessages(prev => 
          prev.map(m => m.id === assistantMessageId ? { ...m, content: currentChunk } : m)
        );
      },
      () => {
        setIsGenerating(false);
        setMessages(prev => 
          prev.map(m => m.id === assistantMessageId ? { ...m, isStreaming: false, status: 'complete' } : m)
        );
        soundFX.playHealChime();
      },
      cancelSignal
    );
  };

  const handleStopStreaming = () => {
    streamCancelSignal.isCancelled = true;
    setIsGenerating(false);
    setMessages(prev => 
      prev.map(m => m.isStreaming ? { ...m, isStreaming: false, status: 'complete' } : m)
    );
    soundFX.playClick();
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    soundFX.playClick();
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleClearChat = () => {
    soundFX.playClick();
    setMessages([
      {
        id: 'welcome-reinit',
        sender: 'assistant',
        content: `Conversation reset. Ready to audit **Module ${activeDomain.number}: ${activeDomain.title}**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'complete'
      }
    ]);
  };

  const handleExecuteActionConfirmed = () => {
    if (!actionToConfirm) return;
    soundFX.playHealChime();
    if (onApplyRemediation) {
      onApplyRemediation(actionToConfirm);
    }
    
    // Add confirmation receipt to chat
    setMessages(prev => [
      ...prev,
      {
        id: `action-applied-${Date.now()}`,
        sender: 'system',
        content: `✅ **Supervised Action Executed Successfully**\n\nRemediation **"${actionToConfirm.title}"** applied to live stage!\n- Cost impact: **${actionToConfirm.costDelta}**\n- Target services: ${actionToConfirm.targetServices.join(', ')}\n- Blast radius: ${actionToConfirm.blastRadius}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'complete'
      }
    ]);

    setActionToConfirm(null);
  };

  return (
    <div 
      className="sheet-overlay" 
      role="dialog" 
      aria-modal="true" 
      aria-label="AWS Well-Architected AI Copilot & Architecture Advisor"
      style={{ zIndex: 1100 }}
    >
      <div 
        className="sheet-content copilot-modal-card" 
        style={{
          width: '920px',
          maxWidth: '96vw',
          height: '86vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          background: 'var(--bg-panel)',
          borderRadius: 16,
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.85)'
        }}
      >
        {/* Top Header & Principle 1-3 Disclosures */}
        <div 
          className="copilot-modal-header"
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-color)',
            background: 'linear-gradient(180deg, rgba(255, 153, 0, 0.08) 0%, rgba(0,0,0,0) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div 
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(255, 153, 0, 0.25), rgba(255, 153, 0, 0.05))',
                border: '1px solid rgba(255, 153, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bot size={20} color="#FF9900" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                  AWS Well-Architected AI Copilot
                </h3>
                <span 
                  style={{
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    padding: '2px 8px',
                    borderRadius: 99,
                    background: 'rgba(0, 230, 118, 0.12)',
                    color: '#00E676',
                    border: '1px solid rgba(0, 230, 118, 0.25)',
                    fontWeight: 700
                  }}
                >
                  Grounded RAG Engine
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>
                Advisory recommendations grounded in official AWS WAF Whitepapers • Human-confirmed actions
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button 
              className="btn-action"
              onClick={handleClearChat}
              title="Reset conversation session"
              style={{ height: 28, fontSize: 11, padding: '0 10px', background: 'rgba(255,255,255,0.05)' }}
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
            <button 
              className="btn-action"
              onClick={onClose}
              title="Close Copilot [Esc]"
              style={{ height: 28, width: 28, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Governance & Safety Disclaimer Strip (Principle 1 & 7) */}
        <div 
          style={{
            padding: '6px 24px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 11,
            color: 'var(--text-tertiary)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={13} color="var(--accent)" />
            <span>Scope: 6 Pillars compliance, anti-pattern remediation &amp; FinOps. Zero private key transmission.</span>
          </div>
          <button 
            onClick={onOpen6PillarsFallback}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent)',
              fontSize: 11,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: 0
            }}
          >
            <span>Standard Non-AI 6 Pillars Audit</span>
            <ArrowRight size={11} />
          </button>
        </div>

        {/* Chat Message Scroll Area */}
        <div 
          className="copilot-chat-body" 
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}
          aria-live="polite"
        >
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`copilot-msg-bubble ${msg.sender}`}
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: msg.sender === 'user' ? '75%' : '90%',
                display: 'flex',
                flexDirection: 'column',
                gap: 6
              }}
            >
              {/* Header metadata */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 10,
                  color: 'var(--text-tertiary)',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <span>{msg.sender === 'user' ? 'You (Architect)' : msg.sender === 'system' ? 'System Orchestrator' : 'AWS WAF Copilot'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Content Container */}
              <div 
                style={{
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: msg.sender === 'user' 
                    ? 'linear-gradient(135deg, #0071E3, #005bb5)' 
                    : msg.sender === 'system'
                    ? 'rgba(0, 230, 118, 0.08)'
                    : 'rgba(255, 255, 255, 0.04)',
                  border: msg.sender === 'user' 
                    ? '1px solid rgba(255, 255, 255, 0.2)' 
                    : msg.sender === 'system'
                    ? '1px solid rgba(0, 230, 118, 0.25)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  fontSize: 13,
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  position: 'relative'
                }}
              >
                {msg.content}
                {msg.isStreaming && (
                  <span className="streaming-cursor" style={{ display: 'inline-block', width: 6, height: 14, background: '#FF9900', marginLeft: 4, verticalAlign: 'middle', animation: 'blink 0.8s infinite' }} />
                )}
              </div>

              {/* Evidence & Citations Accordion (Principle 5: Grounding) */}
              {msg.citations && msg.citations.length > 0 && (
                <div 
                  style={{
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'rgba(255, 153, 0, 0.05)',
                    border: '1px solid rgba(255, 153, 0, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#FF9900' }}>
                    <FileText size={12} />
                    <span>Authoritative AWS Citations &amp; Evidence ({msg.citations.length})</span>
                  </div>
                  {msg.citations.map(cit => (
                    <div key={cit.id} style={{ fontSize: 11, color: 'var(--text-secondary)', paddingLeft: 8, borderLeft: '2px solid rgba(255, 153, 0, 0.4)' }}>
                      <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{cit.whitepaper} • {cit.section}</div>
                      <div style={{ fontStyle: 'italic', color: 'var(--text-tertiary)', marginTop: 2 }}>"{cit.verifiedQuote}"</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Supervised Agent Action Proposal Card (Principle 5 & 7) */}
              {msg.proposedAction && (
                <div 
                  style={{
                    padding: '12px 16px',
                    borderRadius: 10,
                    background: 'rgba(0, 230, 118, 0.05)',
                    border: '1px solid rgba(0, 230, 118, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Sparkles size={14} color="#00E676" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#00E676' }}>
                        Proposed Supervised Action: {msg.proposedAction.title}
                      </span>
                    </div>
                    <span 
                      style={{
                        fontSize: 10,
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: msg.proposedAction.riskLevel === 'Low' ? 'rgba(0,230,118,0.15)' : 'rgba(255,153,0,0.15)',
                        color: msg.proposedAction.riskLevel === 'Low' ? '#00E676' : '#FF9900',
                        fontWeight: 700
                      }}
                    >
                      Risk: {msg.proposedAction.riskLevel}
                    </span>
                  </div>

                  <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>
                    {msg.proposedAction.impactSummary}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 11, color: 'var(--text-tertiary)' }}>
                    <span><strong>Cost Impact:</strong> {msg.proposedAction.costDelta}</span>
                    <span>•</span>
                    <span><strong>Blast Radius:</strong> {msg.proposedAction.blastRadius}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <button
                      className="btn-action"
                      onClick={() => setActionToConfirm(msg.proposedAction!)}
                      style={{
                        background: 'linear-gradient(135deg, rgba(0,230,118,0.2), rgba(0,230,118,0.05))',
                        border: '1px solid rgba(0,230,118,0.4)',
                        color: '#00E676',
                        fontSize: 12,
                        fontWeight: 700,
                        height: 30,
                        gap: 6
                      }}
                    >
                      <Terminal size={12} />
                      <span>Review &amp; Apply Remediation (Human Sign-off)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Message Action Footer (Copy, etc.) */}
              {msg.sender === 'assistant' && msg.status === 'complete' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <button
                    onClick={() => handleCopyMessage(msg.id, msg.content)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: copiedMessageId === msg.id ? '#00E676' : 'var(--text-tertiary)',
                      fontSize: 10,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: 0
                    }}
                  >
                    <Copy size={11} />
                    <span>{copiedMessageId === msg.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Context-Aware Suggested Prompts Bar (Principle 5: Help users get started) */}
        <div 
          style={{
            padding: '8px 24px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}
        >
          <span style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700, flexShrink: 0 }}>
            Contextual Prompts:
          </span>
          {suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              disabled={isGenerating}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 99,
                padding: '4px 10px',
                color: 'var(--text-secondary)',
                fontSize: 11,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar & Controls */}
        <div 
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-panel)',
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}
        >
          <input
            ref={inputRef}
            type="text"
            className="copilot-text-input"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder={`Ask WAF Copilot about ${activeDomain.title}, 6 Pillars, or FinOps remediation...`}
            disabled={isGenerating}
            style={{
              flex: 1,
              height: 42,
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 10,
              padding: '0 16px',
              color: '#FFFFFF',
              fontSize: 13,
              outline: 'none'
            }}
          />

          {isGenerating ? (
            <button
              className="btn-action danger-quiet"
              onClick={handleStopStreaming}
              style={{ height: 42, padding: '0 16px', fontSize: 13, gap: 6 }}
            >
              <Square size={13} />
              <span>Stop Generating</span>
            </button>
          ) : (
            <button
              className="btn-action primary-cta"
              onClick={() => handleSend()}
              disabled={!inputQuery.trim()}
              style={{ height: 42, padding: '0 20px', fontSize: 13, gap: 6 }}
            >
              <Send size={13} />
              <span>Ask WAF</span>
            </button>
          )}
        </div>
      </div>

      {/* Two-Phase Human Confirmation Safeguard Modal (Principle 5 & 7) */}
      {actionToConfirm && (
        <div 
          className="sheet-overlay" 
          style={{ zIndex: 1200, background: 'rgba(0, 0, 0, 0.85)' }}
          role="alertdialog"
          aria-labelledby="confirm-action-title"
        >
          <div 
            style={{
              width: 580,
              maxWidth: '92vw',
              background: '#0D0E12',
              border: '1px solid rgba(0, 230, 118, 0.4)',
              borderRadius: 14,
              padding: 24,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.95)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div 
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: 'rgba(0, 230, 118, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ShieldCheck size={22} color="#00E676" />
              </div>
              <div>
                <h4 id="confirm-action-title" style={{ margin: 0, fontSize: 16, color: '#FFFFFF', fontWeight: 700 }}>
                  Human Confirmation Safeguard
                </h4>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>
                  Principle 5 &amp; 7: Require explicit human approval before executing simulated agent actions
                </p>
              </div>
            </div>

            <div 
              style={{
                padding: 14,
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                fontSize: 12
              }}
            >
              <div><strong>Proposed Action:</strong> {actionToConfirm.title}</div>
              <div><strong>Target AWS Services:</strong> {actionToConfirm.targetServices.join(', ')}</div>
              <div><strong>Cost Delta:</strong> <span style={{ color: '#00E676' }}>{actionToConfirm.costDelta}</span></div>
              <div><strong>Blast Radius:</strong> {actionToConfirm.blastRadius}</div>
              <div><strong>Rollback / Reversible:</strong> {actionToConfirm.reversible ? 'Yes (Can be reverted at any time)' : 'No'}</div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Infrastructure-as-Code Execution Plan (HCL / Terraform):
              </div>
              <pre 
                style={{
                  margin: 0,
                  padding: 12,
                  borderRadius: 6,
                  background: '#050507',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: 11,
                  fontFamily: 'monospace',
                  color: '#00E676',
                  maxHeight: 120,
                  overflowY: 'auto'
                }}
              >
                {actionToConfirm.iacSnippet}
              </pre>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
              <button
                className="btn-action"
                onClick={() => setActionToConfirm(null)}
                style={{ height: 36, padding: '0 16px', fontSize: 12 }}
              >
                Cancel (Safe)
              </button>
              <button
                className="btn-action"
                onClick={handleExecuteActionConfirmed}
                style={{
                  height: 36,
                  padding: '0 20px',
                  fontSize: 12,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #00E676, #00B0FF)',
                  color: '#000000',
                  border: 'none'
                }}
              >
                Confirm &amp; Apply Remediation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
