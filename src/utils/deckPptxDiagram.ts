import type PptxGenJS from 'pptxgenjs';
import type { ArchitectureSpec } from '../types';
import { PPTX_COLORS, PPTX_FONT } from './deckPptxTheme';

const NODE_HEIGHT_MAX = 0.7;
const NODE_GAP = 0.28;

interface DiagramBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Draws one architecture as a vertical chain of editable shapes, in the order a request travels. */
export const addArchitectureDiagram = (
  pptx: PptxGenJS,
  slide: PptxGenJS.Slide,
  spec: ArchitectureSpec,
  area: { x: number; y: number; w: number; h: number },
  isResilient: boolean
): void => {
  const nodeCount = spec.nodes.length;
  const pitch = Math.min(NODE_HEIGHT_MAX + NODE_GAP, area.h / Math.max(nodeCount, 1));
  const boxHeight = pitch - NODE_GAP;
  const boxes = new Map<string, DiagramBox>();

  spec.nodes.forEach((node, index) => {
    const box = { x: area.x, y: area.y + index * pitch, w: area.w, h: boxHeight };
    boxes.set(node.id, box);
    const isRisk = !isResilient && node.isSPOF === true;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: box.x,
      y: box.y,
      w: box.w,
      h: box.h,
      rectRadius: 0.08,
      fill: { color: isRisk ? PPTX_COLORS.tintDanger : isResilient ? PPTX_COLORS.tintSuccess : PPTX_COLORS.surface },
      line: { color: isRisk ? PPTX_COLORS.danger : isResilient ? PPTX_COLORS.success : PPTX_COLORS.border, width: 1.25 }
    });
    slide.addText(node.name, {
      x: box.x + 0.12,
      y: box.y,
      w: box.w - 0.24,
      h: box.h,
      fontFace: PPTX_FONT,
      fontSize: 14,
      bold: true,
      color: PPTX_COLORS.ink,
      valign: 'middle',
      align: 'left',
      margin: 0
    });
  });

  spec.connections.forEach((connection) => {
    const from = boxes.get(connection.from);
    const to = boxes.get(connection.to);
    if (!from || !to || to.y <= from.y) return;
    const x = area.x + area.w / 2;
    const y = from.y + from.h;
    slide.addShape(pptx.ShapeType.line, {
      x,
      y,
      w: 0,
      h: to.y - y,
      line: {
        color: connection.type === 'blocked' ? PPTX_COLORS.danger : isResilient ? PPTX_COLORS.success : PPTX_COLORS.muted,
        width: 1.25,
        endArrowType: 'triangle'
      }
    });
  });
};
