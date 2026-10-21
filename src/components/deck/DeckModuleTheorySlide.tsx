import { DeckSlide } from '../../data/deck/deckTypes';
import { LatexFormula } from '../LatexFormula';

interface DeckModuleTheorySlideProps {
  slide: DeckSlide;
}

/** Module theory: the named principle, what it means for the design, and its formula. */
export const DeckModuleTheorySlide: React.FC<DeckModuleTheorySlideProps> = ({ slide }) => (
  <div className="deck-module-theory">
    <div className="deck-module-theory-text">
      <p className="deck-eyebrow">{slide.eyebrow}</p>
      <h2 className="deck-title">{slide.title}</h2>
      {slide.source && <p className="deck-source">Theory: {slide.source}</p>}
      <ul className="deck-points">
        {slide.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </div>
    {slide.formula && (
      <aside className="deck-formula-card" aria-label="Formula">
        <LatexFormula formula={slide.formula} displayMode />
        {slide.formulaText && <p className="deck-formula-note">{slide.formulaText}</p>}
      </aside>
    )}
  </div>
);
