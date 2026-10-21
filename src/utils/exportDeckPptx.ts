import { deckSlides } from '../data/deck/buildDeck';
import { addComparisonSlide, addModuleTheorySlide, addTextSlide } from './deckPptxSlides';

export const PPTX_FILE_NAME = 'AWS-Well-Architected-Presentation.pptx';

/** Builds the full deck as a 16:9 PowerPoint file, with the scripts in the speaker notes, and downloads it. */
export const exportDeckPptx = async (): Promise<void> => {
  const { default: PptxGenJS } = await import('pptxgenjs');
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.title = 'AWS Well-Architected Framework: Naive builds versus resilient builds';
  pptx.author = 'Devarsh Patel and Aman Kumar';

  deckSlides.forEach((deckSlide) => {
    if (deckSlide.kind === 'comparison') addComparisonSlide(pptx, deckSlide);
    else if (deckSlide.kind === 'module-theory') addModuleTheorySlide(pptx, deckSlide);
    else addTextSlide(pptx, deckSlide);
  });

  await pptx.writeFile({ fileName: PPTX_FILE_NAME });
};
