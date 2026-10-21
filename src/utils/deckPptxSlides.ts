import type PptxGenJS from 'pptxgenjs';
import type { DeckSlide } from '../data/deck/deckTypes';
import { allDomains } from '../data/index';
import { addArchitectureDiagram } from './deckPptxDiagram';
import { PPTX_BODY_SIZE, PPTX_COLORS, PPTX_FONT, PPTX_MARGIN, PPTX_TITLE_SIZE } from './deckPptxTheme';

const SLIDE_WIDTH = 13.333;
const COLUMN_GAP = 0.5;
const CONTENT_TOP = 1.75;
const CONTENT_BOTTOM = 6.7;

const addHeader = (slide: PptxGenJS.Slide, eyebrow: string, title: string): void => {
  slide.addText(eyebrow, {
    x: PPTX_MARGIN,
    y: 0.45,
    w: SLIDE_WIDTH - PPTX_MARGIN * 2,
    h: 0.35,
    fontFace: PPTX_FONT,
    fontSize: 13,
    bold: true,
    color: PPTX_COLORS.muted,
    margin: 0
  });
  slide.addText(title, {
    x: PPTX_MARGIN,
    y: 0.85,
    w: SLIDE_WIDTH - PPTX_MARGIN * 2,
    h: 0.75,
    fontFace: PPTX_FONT,
    fontSize: PPTX_TITLE_SIZE,
    bold: true,
    color: PPTX_COLORS.ink,
    margin: 0
  });
};

const addBullets = (
  slide: PptxGenJS.Slide,
  points: string[],
  box: { x: number; y: number; w: number; h: number },
  fontSize = PPTX_BODY_SIZE
): void => {
  slide.addText(
    points.map((point) => ({ text: point, options: { bullet: { indent: 18 }, breakLine: true } })),
    { ...box, fontFace: PPTX_FONT, fontSize, color: PPTX_COLORS.secondary, valign: 'top', paraSpaceAfter: 10, margin: 0 }
  );
};

const addNotes = (slide: PptxGenJS.Slide, deckSlide: DeckSlide): void => {
  const script = deckSlide.lines.map((line) => line.say).join('\n\n');
  slide.addNotes(script);
};

/** Title, agenda, theory and closing slides. */
export const addTextSlide = (pptx: PptxGenJS, deckSlide: DeckSlide): void => {
  const slide = pptx.addSlide();
  addHeader(slide, deckSlide.eyebrow, deckSlide.title);
  addBullets(slide, deckSlide.points, { x: PPTX_MARGIN, y: CONTENT_TOP, w: SLIDE_WIDTH - PPTX_MARGIN * 2, h: 3.9 });
  if (deckSlide.formulaText) {
    slide.addText(`Formula: ${deckSlide.formulaText}`, {
      x: PPTX_MARGIN,
      y: 5.9,
      w: SLIDE_WIDTH - PPTX_MARGIN * 2,
      h: 0.8,
      fontFace: PPTX_FONT,
      fontSize: 15,
      italic: true,
      color: PPTX_COLORS.accent,
      margin: 0
    });
  }
  addNotes(slide, deckSlide);
};

/** A module's theory slide: the named principle, what it means for the design, and its formula in words. */
export const addModuleTheorySlide = (pptx: PptxGenJS, deckSlide: DeckSlide): void => {
  const slide = pptx.addSlide();
  addHeader(slide, deckSlide.eyebrow, deckSlide.title);
  if (deckSlide.source) {
    slide.addText(`Theory: ${deckSlide.source}`, {
      x: PPTX_MARGIN,
      y: CONTENT_TOP,
      w: 7.2,
      h: 0.4,
      fontFace: PPTX_FONT,
      fontSize: 14,
      color: PPTX_COLORS.muted,
      margin: 0
    });
  }
  addBullets(slide, deckSlide.points, { x: PPTX_MARGIN, y: CONTENT_TOP + 0.6, w: 7.2, h: 4.2 });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 8.2,
    y: CONTENT_TOP,
    w: SLIDE_WIDTH - 8.2 - PPTX_MARGIN,
    h: 3.6,
    rectRadius: 0.08,
    fill: { color: PPTX_COLORS.surface },
    line: { color: PPTX_COLORS.border, width: 1 }
  });
  slide.addText(deckSlide.formulaText ?? 'Formula on the slide', {
    x: 8.45,
    y: CONTENT_TOP + 0.25,
    w: SLIDE_WIDTH - 8.2 - PPTX_MARGIN - 0.5,
    h: 3.1,
    fontFace: PPTX_FONT,
    fontSize: 16,
    color: PPTX_COLORS.ink,
    valign: 'top',
    margin: 0
  });
  addNotes(slide, deckSlide);
};

/** A module's comparison slide: naive and Well-Architected diagrams side by side on one screen. */
export const addComparisonSlide = (pptx: PptxGenJS, deckSlide: DeckSlide): void => {
  const slide = pptx.addSlide();
  const domain = allDomains[deckSlide.domainIndex ?? 0];
  addHeader(slide, deckSlide.eyebrow, domain.title);
  slide.addText(deckSlide.title, {
    x: PPTX_MARGIN,
    y: 1.28,
    w: SLIDE_WIDTH - PPTX_MARGIN * 2,
    h: 0.35,
    fontFace: PPTX_FONT,
    fontSize: 15,
    color: PPTX_COLORS.secondary,
    margin: 0
  });
  const columnWidth = (SLIDE_WIDTH - PPTX_MARGIN * 2 - COLUMN_GAP) / 2;
  const columns = [
    { x: PPTX_MARGIN, label: 'Naive build', color: PPTX_COLORS.danger, summary: deckSlide.points[0], spec: domain.naive, resilient: false },
    { x: PPTX_MARGIN + columnWidth + COLUMN_GAP, label: 'Well-Architected build', color: PPTX_COLORS.success, summary: deckSlide.points[1], spec: domain.wellArch, resilient: true }
  ];
  columns.forEach((column) => {
    slide.addText(column.label.toUpperCase(), {
      x: column.x,
      y: CONTENT_TOP - 0.1,
      w: columnWidth,
      h: 0.35,
      fontFace: PPTX_FONT,
      fontSize: 12,
      bold: true,
      color: column.color,
      margin: 0
    });
    addArchitectureDiagram(pptx, slide, column.spec, { x: column.x, y: CONTENT_TOP + 0.35, w: columnWidth, h: CONTENT_BOTTOM - CONTENT_TOP - 0.85 }, column.resilient);
    slide.addText(column.summary ?? '', {
      x: column.x,
      y: CONTENT_BOTTOM - 0.4,
      w: columnWidth,
      h: 0.4,
      fontFace: PPTX_FONT,
      fontSize: 13,
      bold: true,
      color: PPTX_COLORS.secondary,
      margin: 0
    });
  });
  addNotes(slide, deckSlide);
};
