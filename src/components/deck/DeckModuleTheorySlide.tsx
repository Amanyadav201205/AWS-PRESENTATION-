import { DeckSlide } from '../../data/deck/deckTypes';
import { DeckTable } from './DeckTable';

interface DeckModuleTheorySlideProps {
  slide: DeckSlide;
}

/** Module theory: the named principle, what it means for this design, and the component-by-component detail. */
export const DeckModuleTheorySlide: React.FC<DeckModuleTheorySlideProps> = ({ slide }) => (
  <div className="deck-module-theory">
    <p className="deck-eyebrow">{slide.eyebrow}</p>
    <h2 className="deck-title">{slide.title}</h2>
    {slide.banner && <p className="deck-banner">{slide.banner}</p>}
    <ul className="deck-points deck-points-row">
      {slide.points.map((point) => (
        <li key={point}>{point}</li>
      ))}
    </ul>
    {slide.tables?.map((table) => (
      <DeckTable key={table.headers.join('|')} table={table} />
    ))}
  </div>
);
