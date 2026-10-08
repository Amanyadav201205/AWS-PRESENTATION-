import type { RemoteCommand } from '../services/presentationRemoteSync';

export const CONTENT_ZOOM_MIN = 50;
export const CONTENT_ZOOM_MAX = 200;
export const CONTENT_ZOOM_STEP = 10;
export const CONTENT_ZOOM_DEFAULT = 100;

export const LINE_SCROLL_PX = 120;
export const PAGE_SCROLL_RATIO = 0.9;

// Sections closer than this to the current position count as "here", so repeated steps always advance
const SECTION_EPSILON_PX = 16;
const SECTION_ID_SELECTOR = '[id^="section-"]';

export const clampContentZoom = (level: number): number => {
  if (!Number.isFinite(level)) return CONTENT_ZOOM_DEFAULT;
  return Math.min(CONTENT_ZOOM_MAX, Math.max(CONTENT_ZOOM_MIN, Math.round(level)));
};

export const stepContentZoom = (current: number, direction: 'in' | 'out'): number => {
  const steps = current / CONTENT_ZOOM_STEP;
  const snapped = direction === 'in'
    ? (Math.floor(steps) + 1) * CONTENT_ZOOM_STEP
    : (Math.ceil(steps) - 1) * CONTENT_ZOOM_STEP;
  return clampContentZoom(snapped);
};

export const resolveContentZoom = (cmd: RemoteCommand, current: number): number => {
  switch (cmd.zoomAction) {
    case 'in':
      return stepContentZoom(current, 'in');
    case 'out':
      return stepContentZoom(current, 'out');
    case 'reset':
      return CONTENT_ZOOM_DEFAULT;
    case 'set':
      return clampContentZoom(cmd.zoomLevel ?? current);
    default:
      return current;
  }
};

const maxScrollTop = (el: HTMLElement): number => Math.max(0, el.scrollHeight - el.clientHeight);

export const getScrollPercent = (el: HTMLElement | null): number => {
  if (!el) return 0;
  const max = maxScrollTop(el);
  if (max === 0) return 0;
  return Math.round((el.scrollTop / max) * 100);
};

// Absolute offset of every #section-* anchor inside the scroll container, in ascending order
const getSectionOffsets = (el: HTMLElement): number[] => {
  const containerTop = el.getBoundingClientRect().top;
  return Array.from(el.querySelectorAll<HTMLElement>(SECTION_ID_SELECTOR))
    .map((node) => node.getBoundingClientRect().top - containerTop + el.scrollTop)
    .sort((a, b) => a - b);
};

const scrollToSection = (el: HTMLElement, direction: RemoteCommand['sectionDirection']): void => {
  const current = el.scrollTop;
  const offsets = getSectionOffsets(el);
  const target = direction === 'next'
    ? offsets.find((offset) => offset > current + SECTION_EPSILON_PX)
    : offsets.findLast((offset) => offset < current - SECTION_EPSILON_PX);
  const fallback = direction === 'next' ? maxScrollTop(el) : 0;
  el.scrollTo({ top: target ?? fallback, behavior: 'smooth' });
};

/**
 * Applies a scroll command to the main site's scroll container.
 * Returns the HUD label to show, or null when the command should stay silent.
 */
export const runContentScrollCommand = (cmd: RemoteCommand, el: HTMLElement): string | null => {
  switch (cmd.type) {
    case 'SCROLL_BY': {
      // Instant, so rapid line taps and drag frames accumulate instead of cancelling each other's animation
      const delta = cmd.scrollDelta ?? 0;
      el.scrollBy({ top: delta, behavior: 'auto' });
      return cmd.isContinuous ? null : `Scrolled ${delta < 0 ? 'up' : 'down'}`;
    }
    case 'SCROLL_PAGE': {
      const direction = cmd.scrollDirection === 'up' ? -1 : 1;
      el.scrollBy({ top: direction * el.clientHeight * PAGE_SCROLL_RATIO, behavior: 'smooth' });
      return `Page ${cmd.scrollDirection === 'up' ? 'up' : 'down'}`;
    }
    case 'SCROLL_EDGE': {
      const top = cmd.scrollEdge === 'top' ? 0 : maxScrollTop(el);
      el.scrollTo({ top, behavior: 'smooth' });
      return `Jumped to ${cmd.scrollEdge === 'top' ? 'top' : 'bottom'}`;
    }
    case 'SCROLL_SECTION_STEP': {
      scrollToSection(el, cmd.sectionDirection);
      return `Section ${cmd.sectionDirection === 'prev' ? 'back' : 'forward'}`;
    }
    default:
      return null;
  }
};
