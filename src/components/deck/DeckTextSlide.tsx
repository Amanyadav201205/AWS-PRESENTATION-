import { DeckSlide } from '../../data/deck/deckTypes';
import { LatexFormula } from '../LatexFormula';

interface DeckTextSlideProps {
  slide: DeckSlide;
}

/** Title, agenda, theory and closing slides: a heading, bullets, and an optional formula. */
export const DeckTextSlide: React.FC<DeckTextSlideProps> = ({ slide }) => {
  const isTitle = slide.kind === 'title';
  return (
    <div className={`deck-text-slide deck-kind-${slide.kind}`}>
      <p className="deck-eyebrow">{slide.eyebrow}</p>
      {isTitle ? <h1 className="deck-title-hero">{slide.title}</h1> : <h2 className="deck-title">{slide.title}</h2>}
      <ul className="deck-points">
        {slide.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      {slide.formula && (
        <div className="deck-formula-card">
          <LatexFormula formula={slide.formula} displayMode />
          {slide.formulaText && <p className="deck-formula-note">{slide.formulaText}</p>}
        </div>
      )}
    </div>
  );
};
