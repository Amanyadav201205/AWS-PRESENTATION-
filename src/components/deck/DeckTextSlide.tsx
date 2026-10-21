import { DeckSlide } from '../../data/deck/deckTypes';
import { DeckTable } from './DeckTable';

interface DeckTextSlideProps {
  slide: DeckSlide;
}

/** Title, agenda, theory and closing slides: a heading, a banner, bullets, and tables. */
export const DeckTextSlide: React.FC<DeckTextSlideProps> = ({ slide }) => {
  const isTitle = slide.kind === 'title';
  return (
    <div className={`deck-text-slide deck-kind-${slide.kind}`}>
      <p className="deck-eyebrow">{slide.eyebrow}</p>
      {isTitle ? <h1 className="deck-title-hero">{slide.title}</h1> : <h2 className="deck-title">{slide.title}</h2>}
      {slide.banner && <p className="deck-banner">{slide.banner}</p>}
      {slide.points.length > 0 && (
        <ul className="deck-points">
          {slide.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      )}
      {slide.tables?.map((table) => (
        <DeckTable key={table.headers.join('|')} table={table} />
      ))}
    </div>
  );
};
