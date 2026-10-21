import { ArchitectureSpec } from '../../types';

interface DeckFlowColumnProps {
  spec: ArchitectureSpec;
  label: string;
  tone: 'naive' | 'resilient';
  /** Nodes hit by the injected failure in this build. */
  affectedNodeIds: string[];
  /** True while the presenter has injected the failure. */
  isFailing: boolean;
}

const statusFor = (tone: 'naive' | 'resilient', isAffected: boolean, isFailing: boolean): string => {
  if (!isFailing || !isAffected) return '';
  return tone === 'naive' ? 'Failed' : 'Rerouted';
};

/** One build as a flow: each node is a large card, and arrows run from the first node to the last. */
export const DeckFlowColumn: React.FC<DeckFlowColumnProps> = ({ spec, label, tone, affectedNodeIds, isFailing }) => (
  <section className={`deck-flow-column deck-flow-${tone}`} aria-label={label}>
    <h3 className="deck-flow-label">{label}</h3>
    <ol className="deck-flow">
      {spec.nodes.map((node) => {
        const isAffected = affectedNodeIds.includes(node.id);
        const status = statusFor(tone, isAffected, isFailing);
        const risk = tone === 'naive' && node.isSPOF ? 'SPOF' : tone === 'resilient' && node.az ? node.az : '';
        return (
          <li key={node.id} className={`deck-flow-node${isAffected && isFailing ? ' is-affected' : ''}`}>
            <span className="deck-flow-name">{node.name}</span>
            <span className="deck-flow-service">{node.service}</span>
            {(risk || status) && (
              <span className="deck-flow-tags">
                {risk && <span className="deck-flow-tag">{risk}</span>}
                {status && <span className="deck-flow-tag deck-flow-tag-status">{status}</span>}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  </section>
);
