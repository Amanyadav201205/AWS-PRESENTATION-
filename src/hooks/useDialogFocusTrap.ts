import { useEffect } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * App-wide focus management for every element marked aria-modal="true".
 * - Moves focus into a dialog when it opens.
 * - Keeps Tab / Shift+Tab inside the top-most dialog.
 * - Returns focus to the element that opened it when it closes.
 * - Locks background scroll while any dialog is open.
 */
export function useDialogFocusTrap() {
  useEffect(() => {
    let lastTrigger: HTMLElement | null = null;
    let openDialog: HTMLElement | null = null;

    const topDialog = (): HTMLElement | null => {
      const all = document.querySelectorAll<HTMLElement>('[aria-modal="true"]');
      return all.length ? all[all.length - 1] : null;
    };

    const focusables = (root: HTMLElement) =>
      Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );

    const sync = () => {
      const dlg = topDialog();
      if (dlg && dlg !== openDialog) {
        if (!openDialog) {
          lastTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        }
        openDialog = dlg;
        document.body.style.overflow = 'hidden';
        if (!dlg.contains(document.activeElement)) {
          if (!dlg.hasAttribute('tabindex')) dlg.setAttribute('tabindex', '-1');
          const closeBtn = dlg.querySelector<HTMLElement>('[aria-label*="lose" i]');
          (closeBtn ?? focusables(dlg)[0] ?? dlg).focus({ preventScroll: true });
        }
      } else if (!dlg && openDialog) {
        openDialog = null;
        document.body.style.overflow = '';
        if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus({ preventScroll: true });
        lastTrigger = null;
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const dlg = topDialog();
      if (!dlg) return;
      const items = focusables(dlg);
      if (!items.length) {
        e.preventDefault();
        dlg.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (!active || !dlg.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-modal'] });
    document.addEventListener('keydown', onKeyDown, true);
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener('keydown', onKeyDown, true);
    };
  }, []);
}
