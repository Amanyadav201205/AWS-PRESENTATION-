import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Search,
  Copy,
  Check,
  ShieldCheck
} from 'lucide-react';
import {
  theoreticalFoundations
} from '../data/theoreticalFoundations';
import {
  soundFX
} from '../utils/soundEffects';
import { LatexFormula } from './LatexFormula';

interface TheoreticalFoundationsModalProps {
  onClose: () => void;
  onSelectDomain?: (domainId: string) => void;
  selectedDomainId?: string;
  onSelectDomainId?: (domainId: string) => void;
}

export const TheoreticalFoundationsModal: React.FC<TheoreticalFoundationsModalProps> = ({
  onClose,
  onSelectDomain,
  selectedDomainId: controlledDomainId,
  onSelectDomainId
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [internalDomainId, setInternalDomainId] = useState<string>('overview-thesis');
  const activeDomainId = controlledDomainId || internalDomainId;
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleSelectTheoryDomain = (id: string) => {
    soundFX.playClick();
    setInternalDomainId(id);
    if (onSelectDomainId) onSelectDomainId(id);
  };

  const theoriesList = Object.values(theoreticalFoundations);

  const filteredTheories = theoriesList.filter(t => 
    t.domainTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.lawOrTheorem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.awsWhitepaper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.complianceStandard.standard.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentTheory = theoreticalFoundations[activeDomainId] || theoriesList[0];

  const handleCopyCitation = (text: string, id: string) => {
    soundFX.playClick();
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="sheet-overlay" role="dialog" aria-modal="true" aria-label="Theoretical Foundations & Whitepapers">
      <div className="presenter-dialog theory-sheet" style={{ maxWidth: 1100, maxHeight: '92dvh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--separator)', padding: '16px 24px', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-control)', background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={18} color="var(--accent)" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  Theoretical Foundations & AWS Literature Compendium
                </h2>
                <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: 'var(--radius-pill)', background: 'var(--accent-subtle)', color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.02em' }}>
                  Academic Defense
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                Academic distributed systems theorems, mathematical formulas, AWS whitepapers, and Amazon Builders' Library publications
              </p>
            </div>
          </div>

          <button
            className="btn-action btn-icon"
            onClick={() => { soundFX.playClick(); onClose(); }}
            style={{ width: 30, height: 30, borderRadius: 'var(--radius-pill)' }}
            aria-label="Close modal"
          >
            <X size={15} />
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--separator-subtle)', background: 'rgba(255, 255, 255, 0.02)', display: 'flex', gap: 10, alignItems: 'center' }}>
          <Search size={14} color="var(--text-tertiary)" />
          <input
            type="text"
            placeholder="Search by law (CAP, Little's Law, Amdahl's), whitepaper, or compliance framework..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: 13,
              letterSpacing: '-0.01em'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: 12 }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Main Split Body */}
        <div className="theory-split">
          {/* Left: Domain & Theory List */}
          <div className="theory-list" style={{ borderRight: '1px solid var(--separator)', overflowY: 'auto', padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {filteredTheories.map(t => (
              <button
                key={t.domainId}
                onClick={() => handleSelectTheoryDomain(t.domainId)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-control)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  background: activeDomainId === t.domainId ? 'var(--accent-subtle)' : 'transparent',
                  border: activeDomainId === t.domainId ? '1px solid var(--accent)' : '1px solid transparent',
                  transition: 'background-color var(--duration-fast) var(--ease-spring), border-color var(--duration-fast) var(--ease-spring)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: activeDomainId === t.domainId ? 'var(--accent)' : 'var(--text-tertiary)', fontWeight: 600 }}>
                    MODULE {t.domainNumber + 1}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>
                    {t.lawOrTheorem.year}
                  </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.01em' }}>
                  {t.domainTitle}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {t.lawOrTheorem.name}
                </div>
              </button>
            ))}
          </div>

          {/* Right: Detailed Deep Dive for Selected Theory */}
          <div style={{ overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Title & Domain Context */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontWeight: 600 }}>
                  MODULE {currentTheory.domainNumber + 1} • {currentTheory.domainTitle}
                </span>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2, letterSpacing: '-0.02em' }}>
                  {currentTheory.lawOrTheorem.name}
                </h3>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                  Formulated by <strong>{currentTheory.lawOrTheorem.founder}</strong> in <span style={{ fontVariantNumeric: 'tabular-nums' }}>{currentTheory.lawOrTheorem.year}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {onSelectDomain && (
                  <button
                    className="btn-action primary"
                    onClick={() => {
                      soundFX.playClick();
                      onSelectDomain(currentTheory.domainId);
                      onClose();
                    }}
                    style={{ height: 30, fontSize: 11, gap: 6, borderRadius: 'var(--radius-pill)' }}
                  >
                    <span>View in Topology</span>
                  </button>
                )}
                <button
                  className="btn-action"
                  onClick={() => {
                    const citationText = `Law: ${currentTheory.lawOrTheorem.name} (${currentTheory.lawOrTheorem.founder}, ${currentTheory.lawOrTheorem.year})\nAWS Whitepaper: ${currentTheory.awsWhitepaper.title} [${currentTheory.awsWhitepaper.docCode}]\nBuilders' Library: ${currentTheory.buildersLibrary.title} by ${currentTheory.buildersLibrary.author}`;
                    handleCopyCitation(citationText, 'all');
                  }}
                  style={{ height: 30, fontSize: 11, gap: 6, borderRadius: 'var(--radius-pill)' }}
                >
                  {copiedCode === 'all' ? <Check size={12} color="var(--status-success)" /> : <Copy size={12} />}
                  <span>{copiedCode === 'all' ? 'Citation Copied' : 'Copy Full Citation'}</span>
                </button>
              </div>
            </div>

            {/* Formal Statement & Mathematical Formulation */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--separator)', boxShadow: 'inset 0 1px 0 var(--hairline-top)', borderRadius: 'var(--radius-inner)', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Formal Statement & Principle
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.5, fontStyle: 'italic' }}>
                "{currentTheory.lawOrTheorem.formalStatement}"
              </p>

              {currentTheory.lawOrTheorem.mathematicalFormula && (
                <div style={{ background: '#000000', border: '1px solid var(--separator-subtle)', boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-control)', padding: '16px 18px' }}>
                  <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)', marginBottom: 6 }}>
                    Rigorous Mathematical Formulation
                  </div>
                  <LatexFormula
                    formula={currentTheory.lawOrTheorem.mathematicalFormula!}
                    style={{ fontSize: 16, color: 'var(--accent)' }}
                  />
                  {currentTheory.lawOrTheorem.formulaExplanation && (
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.45 }}>
                      {currentTheory.lawOrTheorem.formulaExplanation}
                    </div>
                  )}
                </div>
              )}

              <div>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)' }}>
                  Architectural Application in Well-Architected Framework:
                </span>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.48 }}>
                  {currentTheory.lawOrTheorem.architecturalApplication}
                </p>
              </div>
            </div>

            {/* Official AWS Whitepaper & Amazon Builders' Library */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--separator)', boxShadow: 'inset 0 1px 0 var(--hairline-top)', borderRadius: 'var(--radius-inner)', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--status-success)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Official AWS Whitepaper
                </span>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                  {currentTheory.awsWhitepaper.title}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: 'var(--radius-pill)', background: 'var(--bg-subtle)', border: '1px solid var(--separator-subtle)', color: 'var(--text-secondary)' }}>
                    Doc: {currentTheory.awsWhitepaper.docCode}
                  </span>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: 'var(--radius-pill)', background: 'var(--status-success-subtle)', color: 'var(--status-success)', border: '1px solid rgba(48, 209, 88, 0.3)' }}>
                    BP: {currentTheory.awsWhitepaper.pillarBestPracticeCode}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.45 }}>
                  "{currentTheory.awsWhitepaper.canonicalQuote}"
                </p>
              </div>

              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--separator)', boxShadow: 'inset 0 1px 0 var(--hairline-top)', borderRadius: 'var(--radius-inner)', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Amazon Builders' Library Publication
                </span>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                  "{currentTheory.buildersLibrary.title}"
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                  By {currentTheory.buildersLibrary.author} ({currentTheory.buildersLibrary.role})
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {currentTheory.buildersLibrary.coreInsight}
                </p>
              </div>
            </div>

            {/* Compliance Standards & Jury Defense Q&A */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--separator)', boxShadow: 'inset 0 1px 0 var(--hairline-top)', borderRadius: 'var(--radius-inner)', padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={16} color="var(--accent)" />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                  Regulatory Standard: {currentTheory.complianceStandard.standard}
                </span>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent)', marginLeft: 'auto' }}>
                  {currentTheory.complianceStandard.controlId}
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                {currentTheory.complianceStandard.requirement}
              </p>

              <div style={{ borderTop: '1px solid var(--separator-subtle)', paddingTop: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--status-warning)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Jury Oral Defense Question & Rigorous Response
                </span>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginTop: 4 }}>
                  "{currentTheory.defenseQnA[0].examinerQuestion}"
                </p>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.48, background: 'var(--bg-canvas)', padding: '12px 14px', borderRadius: 'var(--radius-control)', border: '1px solid var(--separator-subtle)' }}>
                  <strong style={{ color: 'var(--status-success)' }}>Airtight Architect Defense:</strong> {currentTheory.defenseQnA[0].defenseAnswer}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
