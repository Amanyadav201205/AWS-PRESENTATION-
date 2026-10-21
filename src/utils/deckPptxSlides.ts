import type PptxGenJS from 'pptxgenjs';
import type { DeckSlide, DeckTable } from '../data/deck/deckTypes';
import { allDomains } from '../data/index';
import { addArchitectureDiagram } from './deckPptxDiagram';
import { PPTX_BODY_SIZE, PPTX_COLORS, PPTX_FONT, PPTX_MARGIN, PPTX_TITLE_SIZE } from './deckPptxTheme';

const SLIDE_WIDTH = 13.333;
const CONTENT_WIDTH = SLIDE_WIDTH - PPTX_MARGIN * 2;
const COLUMN_GAP = 0.5;
const CONTENT_TOP = 1.75;
const CONTENT_BOTTOM = 6.9;
const TABLE_FONT = 12;

const addHeader = (slide: PptxGenJS.Slide, eyebrow: string, title: string): void => {
  slide.addText(eyebrow, {
    x: PPTX_MARGIN, y: 0.4, w: CONTENT_WIDTH, h: 0.35,
    fontFace: PPTX_FONT, fontSize: 13, bold: true, color: PPTX_COLORS.muted, margin: 0
  });
  slide.addText(title, {
    x: PPTX_MARGIN, y: 0.78, w: CONTENT_WIDTH, h: 0.6,
    fontFace: PPTX_FONT, fontSize: PPTX_TITLE_SIZE, bold: true, color: PPTX_COLORS.ink, margin: 0
  });
};

const addBanner = (pptx: PptxGenJS, slide: PptxGenJS.Slide, text: string, y: number, alert = false): number => {
  const height = 0.5;
  slide.addShape(pptx.ShapeType.rect, {
    x: PPTX_MARGIN, y, w: CONTENT_WIDTH, h: height,
    fill: { color: alert ? PPTX_COLORS.tintDanger : PPTX_COLORS.tintAccent },
    line: { color: alert ? PPTX_COLORS.danger : PPTX_COLORS.accent, width: 0 }
  });
  slide.addText(text, {
    x: PPTX_MARGIN + 0.2, y, w: CONTENT_WIDTH - 0.4, h: height,
    fontFace: PPTX_FONT, fontSize: 16, bold: true, color: PPTX_COLORS.ink, valign: 'middle', margin: 0
  });
  return y + height + 0.25;
};

const addBullets = (slide: PptxGenJS.Slide, points: string[], box: { x: number; y: number; w: number; h: number }): void => {
  if (points.length === 0) return;
  slide.addText(
    points.map((point) => ({ text: point, options: { bullet: { indent: 18 }, breakLine: true } })),
    { ...box, fontFace: PPTX_FONT, fontSize: PPTX_BODY_SIZE - 2, color: PPTX_COLORS.secondary, valign: 'top', paraSpaceAfter: 8, margin: 0 }
  );
};

/** Draws a deck table as a native PowerPoint table, with a header row and a bold first column. */
const addDeckTable = (slide: PptxGenJS.Slide, table: DeckTable, box: { x: number; y: number; w: number }, fontSize = TABLE_FONT): number => {
  const headerRow = table.headers.map((text) => ({
    text: text.toUpperCase(),
    options: { bold: true, color: PPTX_COLORS.secondary, fill: { color: PPTX_COLORS.surfaceMuted } }
  }));
  const bodyRows = table.rows.map((row) =>
    row.map((text, index) => ({
      text,
      options: { bold: index === 0, color: index === 0 ? PPTX_COLORS.ink : PPTX_COLORS.secondary }
    }))
  );
  const rowCount = bodyRows.length + 1;
  slide.addTable([headerRow, ...bodyRows], {
    x: box.x, y: box.y, w: box.w,
    fontFace: PPTX_FONT, fontSize,
    border: { type: 'solid', pt: 0.5, color: PPTX_COLORS.border },
    valign: 'middle',
    margin: 0.05
  });
  return box.y + rowCount * (fontSize / 72 * 2.1);
};

const addNotes = (slide: PptxGenJS.Slide, deckSlide: DeckSlide): void => {
  slide.addNotes(deckSlide.lines.map((line) => line.say).join('\n\n'));
};

/** Title, agenda, theory and closing slides: banner, bullets, and tables. */
export const addTextSlide = (pptx: PptxGenJS, deckSlide: DeckSlide): void => {
  const slide = pptx.addSlide();
  addHeader(slide, deckSlide.eyebrow, deckSlide.title);
  let y = CONTENT_TOP;
  if (deckSlide.banner) y = addBanner(pptx, slide, deckSlide.banner, y);
  addBullets(slide, deckSlide.points, { x: PPTX_MARGIN, y, w: CONTENT_WIDTH, h: 1.6 });
  if (deckSlide.points.length > 0) y += 0.4 + deckSlide.points.length * 0.42;
  deckSlide.tables?.forEach((table) => {
    y = addDeckTable(slide, table, { x: PPTX_MARGIN, y, w: CONTENT_WIDTH }, 14) + 0.25;
  });
  addNotes(slide, deckSlide);
};

/** A module's theory slide: the named principle, three bullets, and the component-by-component table. */
export const addModuleTheorySlide = (pptx: PptxGenJS, deckSlide: DeckSlide): void => {
  const slide = pptx.addSlide();
  addHeader(slide, deckSlide.eyebrow, deckSlide.title);
  let y = CONTENT_TOP;
  if (deckSlide.banner) y = addBanner(pptx, slide, deckSlide.banner, y);
  addBullets(slide, deckSlide.points, { x: PPTX_MARGIN, y, w: CONTENT_WIDTH, h: 1.2 });
  y += 1.35;
  deckSlide.tables?.forEach((table) => {
    addDeckTable(slide, table, { x: PPTX_MARGIN, y, w: CONTENT_WIDTH }, 14);
  });
  addNotes(slide, deckSlide);
};

/** A module's comparison slide: naive and Well-Architected diagrams side by side, with the measures underneath. */
export const addComparisonSlide = (pptx: PptxGenJS, deckSlide: DeckSlide): void => {
  const slide = pptx.addSlide();
  const domain = allDomains[deckSlide.domainIndex ?? 0];
  addHeader(slide, deckSlide.eyebrow, domain.title);
  if (deckSlide.banner) addBanner(pptx, slide, deckSlide.banner, 1.5, true);
  const columnWidth = (CONTENT_WIDTH - COLUMN_GAP) / 2;
  const columns = [
    { x: PPTX_MARGIN, label: 'Naive build', color: PPTX_COLORS.danger, spec: domain.naive, resilient: false },
    { x: PPTX_MARGIN + columnWidth + COLUMN_GAP, label: 'Well-Architected build', color: PPTX_COLORS.success, spec: domain.wellArch, resilient: true }
  ];
  const diagramTop = 2.05;
  const diagramBottom = 5.6;
  columns.forEach((column) => {
    slide.addText(column.label.toUpperCase(), {
      x: column.x, y: diagramTop - 0.1 - 0.2, w: columnWidth, h: 0.3,
      fontFace: PPTX_FONT, fontSize: 12, bold: true, color: column.color, margin: 0
    });
    addArchitectureDiagram(pptx, slide, column.spec, { x: column.x, y: diagramTop, w: columnWidth, h: diagramBottom - diagramTop }, column.resilient);
  });
  deckSlide.tables?.forEach((table) => {
    addDeckTable(slide, table, { x: PPTX_MARGIN, y: CONTENT_BOTTOM - 1.1, w: CONTENT_WIDTH }, 11);
  });
  addNotes(slide, deckSlide);
};
