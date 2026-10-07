import React, { useState } from 'react';
import {
  CustomerRequirement,
  NormalPrescription,
  PillarType,
  StorylineStage
} from '../types';
import {
  soundFX
} from '../utils/soundEffects';
import { LatexFormula } from './LatexFormula';
import {
  Target,
  AlertTriangle,
  Sparkles,
  BookOpen,
  ShieldCheck
} from 'lucide-react';
import {
  theoreticalFoundations
} from '../data/theoreticalFoundations';

interface JourneyProps {
  customer: CustomerRequirement;
  normalPrescription: NormalPrescription;
  wafSummary: string;
  pillars: PillarType[];
  domainId?: string;
}

export const CustomerJourneyCard: React.FC<JourneyProps> = ({
  customer,
  normalPrescription,
  wafSummary,
  pillars,
  domainId
}) => {
  const [activeStage, setActiveStage] = useState<StorylineStage>('requirement');

  return (
    <div className="card-apple" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Top Header & Segmented Picker */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Architecture context &amp; requirements
          </span>
          <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
            {customer.clientName}
          </h2>
        </div>

        {/* Apple Segmented Control */}
        <div className="segmented-control" role="tablist" aria-label="Customer scenario steps">
          <button
            className={`segmented-item ${activeStage === 'requirement' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setActiveStage('requirement');
            }}
            role="tab"
            aria-selected={activeStage === 'requirement'}
          >
            <Target size={13} />
            <span>1. Requirement</span>
          </button>

          <button
            className={`segmented-item ${activeStage === 'prescription' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setActiveStage('prescription');
            }}
            role="tab"
            aria-selected={activeStage === 'prescription'}
          >
            <AlertTriangle size={13} color={activeStage === 'prescription' ? 'var(--status-danger)' : undefined} />
            <span className="tab-label-desktop">2. Standard setup (flaws)</span>
            <span className="tab-label-mobile">2. Anti-pattern</span>
          </button>

          <button
            className={`segmented-item ${activeStage === 'waf-solution' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setActiveStage('waf-solution');
            }}
            role="tab"
            aria-selected={activeStage === 'waf-solution'}
          >
            <Sparkles size={13} color={activeStage === 'waf-solution' ? 'var(--status-success)' : undefined} />
            <span className="tab-label-desktop">3. Well-Architected</span>
            <span className="tab-label-mobile">3. Well-Arch</span>
          </button>

          <button
            className={`segmented-item ${activeStage === 'theory' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setActiveStage('theory');
            }}
            role="tab"
            aria-selected={activeStage === 'theory'}
          >
            <BookOpen size={13} color={activeStage === 'theory' ? 'var(--accent)' : undefined} />
            <span className="tab-label-desktop">4. Theoretical Proof & Citations</span>
            <span className="tab-label-mobile">4. Theory</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeStage === 'requirement' && (
        <div className="journey-grid-row">
          <div>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-primary)', lineHeight: 1.47 }}>
              {customer.businessGoal}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 'var(--space-3)' }}>
              {customer.challenges.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  <span className="journey-challenge-bullet" aria-hidden="true" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--bg-canvas)', border: '1px solid var(--separator-subtle)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 500 }}>
              SLA & budget constraint
            </span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginTop: 4, fontWeight: 500 }}>
              {customer.budgetOrSlaTarget}
            </div>
          </div>
        </div>
      )}

      {activeStage === 'prescription' && (
        <div className="journey-grid-row">
          <div>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--status-danger)', fontWeight: 500 }}>
              Standard naive prescription
            </span>
            <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
              {normalPrescription.title}
            </h4>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '6px 0 10px' }}>
              {normalPrescription.prescribedServices}
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.42 }}>
              {normalPrescription.whyItSeemsLogical}
            </p>
          </div>

          <div style={{ background: 'var(--status-danger-subtle)', border: '1px solid rgba(255, 69, 58, 0.2)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--status-danger)', fontWeight: 600 }}>
              Production failure points
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
              {normalPrescription.whyItFailsInProduction.map((flaw, i) => (
                <div key={i} style={{ fontSize: 'var(--text-xs)', color: 'var(--text-primary)', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  <span style={{ color: 'var(--status-danger)', fontWeight: 700 }}>•</span>
                  <span>{flaw}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeStage === 'waf-solution' && (
        <div className="journey-grid-row">
          <div>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--status-success)', fontWeight: 500 }}>
              Well-Architected resolution
            </span>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-primary)', marginTop: 4, lineHeight: 1.47 }}>
              {wafSummary}
            </p>
          </div>

          {/* Right panel shows which WAF pillars this module addresses — not a duplicate of the summary */}
          <div style={{ background: 'var(--status-success-subtle)', border: '1px solid rgba(48, 209, 88, 0.2)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--status-success)', fontWeight: 600 }}>
              Framework pillars addressed
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pillars.map((p) => (
                <div key={p} className="journey-pillar-item">
                  <span className="journey-pillar-check" aria-hidden="true">✓</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Theoretical Proof & Academic Whitepapers Panel */}
      {activeStage === 'theory' && domainId && theoreticalFoundations[domainId] && (() => {
        const theory = theoreticalFoundations[domainId];
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
            {/* Law & Mathematical Equation */}
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--separator)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 10, boxShadow: 'inset 0 1px 0 var(--hairline-top)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Distributed Systems Law
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>
                  {theory.lawOrTheorem.founder} ({theory.lawOrTheorem.year})
                </span>
              </div>
              <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                {theory.lawOrTheorem.name}
              </h4>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                {theory.lawOrTheorem.formalStatement}
              </p>
              {theory.lawOrTheorem.mathematicalFormula && (
                <div style={{ background: 'var(--bg-canvas)', border: '1px solid var(--separator-subtle)', borderRadius: 'var(--radius-control)', padding: '12px 14px', boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)' }}>
                  <LatexFormula
                    formula={theory.lawOrTheorem.mathematicalFormula!}
                    style={{ fontSize: 13, color: 'var(--accent)' }}
                  />
                  {theory.lawOrTheorem.formulaExplanation && (
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>
                      {theory.lawOrTheorem.formulaExplanation}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* AWS Whitepaper & Amazon Builders' Library Citations */}
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--separator)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 10, boxShadow: 'inset 0 1px 0 var(--hairline-top)' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--status-success)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Official AWS Architecture Citations
              </span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {theory.awsWhitepaper.title}
                </div>
                <div style={{ display: 'flex', gap: 6, margin: '4px 0 6px' }}>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', padding: '1px 8px', borderRadius: 'var(--radius-pill)', background: 'var(--bg-subtle)', border: '1px solid var(--separator)' }}>
                    Doc: {theory.awsWhitepaper.docCode}
                  </span>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', padding: '1px 8px', borderRadius: 'var(--radius-pill)', background: 'rgba(48, 209, 88, 0.1)', color: 'var(--status-success)', border: '1px solid rgba(48, 209, 88, 0.3)' }}>
                    BP: {theory.awsWhitepaper.pillarBestPracticeCode}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.4 }}>
                  "{theory.awsWhitepaper.canonicalQuote}"
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--separator-subtle)', paddingTop: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Amazon Builders' Library:
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', marginTop: 2 }}>
                  "{theory.buildersLibrary.title}" — <span style={{ color: 'var(--text-tertiary)' }}>{theory.buildersLibrary.author} ({theory.buildersLibrary.role})</span>
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.35 }}>
                  {theory.buildersLibrary.coreInsight}
                </p>
              </div>
            </div>

            {/* Compliance Framework & Jury Defense */}
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--separator)', borderRadius: 'var(--radius-inner)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 10, boxShadow: 'inset 0 1px 0 var(--hairline-top)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={13} color="var(--accent)" />
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  {theory.complianceStandard.standard}
                </span>
                <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--accent)', marginLeft: 'auto', fontVariantNumeric: 'tabular-nums' }}>
                  {theory.complianceStandard.controlId}
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {theory.complianceStandard.requirement}
              </p>

              <div style={{ borderTop: '1px solid var(--separator-subtle)', paddingTop: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--status-warning)' }}>
                  Anticipated Academic Jury Question:
                </span>
                <p style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500, marginTop: 2 }}>
                  "{theory.defenseQnA[0].examinerQuestion}"
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.4, background: 'rgba(0, 0, 0, 0.5)', padding: '8px 10px', borderRadius: 'var(--radius-control)', border: '1px solid var(--separator-subtle)' }}>
                  <strong style={{ color: 'var(--status-success)' }}>Airtight Defense:</strong> {theory.defenseQnA[0].defenseAnswer}
                </p>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
