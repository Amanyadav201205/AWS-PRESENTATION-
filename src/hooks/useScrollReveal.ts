import { RefObject, useEffect } from 'react';

const REVEAL_SELECTOR = '.card-apple';
const REVEAL_THRESHOLD = 0.08;
const REVEAL_ROOT_MARGIN = '0px 0px -6% 0px';

/**
 * Reveals cards as they scroll into view. Cards stay visible when JavaScript is off or when the user
 * prefers reduced motion, because the hidden state is only added here.
 */
export const useScrollReveal = (containerRef: RefObject<HTMLElement | null>, revealKey: number): void => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = Array.from(container.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)).filter(
      (element) => !element.classList.contains('is-visible')
    );
    targets.forEach((element) => element.classList.add('js-reveal'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: REVEAL_THRESHOLD, rootMargin: REVEAL_ROOT_MARGIN }
    );
    targets.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [containerRef, revealKey]);
};
