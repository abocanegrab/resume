import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

// Active traps, innermost last. Only the topmost trap handles Tab and Escape, so a
// dialog opened over another trapped region closes alone on Escape.
const trapStack: symbol[] = [];

// Skips elements that render no boxes (display: none, or inside a hidden subtree)
const isVisible = (el: HTMLElement) => el.getClientRects().length > 0;

interface FocusTrapOptions {
  // Focused on activation (falls back to the first focusable element)
  initialFocusRef?: RefObject<HTMLElement | null>;
  // Focused on deactivation; falls back to the element focused at activation
  returnFocusRef?: RefObject<HTMLElement | null>;
  onEscape?: () => void;
}

// While `active`: moves focus inside `containerRef`, cycles Tab/Shift+Tab within its
// visible focusables, calls onEscape on Escape (topmost trap only), and returns focus
// when it deactivates or unmounts.
export const useFocusTrap = (
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
  { initialFocusRef, returnFocusRef, onEscape }: FocusTrapOptions = {},
) => {
  // Latest options without re-running the effect (which would steal focus again)
  const optionsRef = useRef({ initialFocusRef, returnFocusRef, onEscape });
  useEffect(() => {
    optionsRef.current = { initialFocusRef, returnFocusRef, onEscape };
  });

  useEffect(() => {
    if (!active) return;

    const id = Symbol('focus-trap');
    trapStack.push(id);
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const getItems = () =>
      containerRef.current
        ? Array.from(containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(isVisible)
        : [];

    const initial = optionsRef.current.initialFocusRef?.current ?? getItems()[0];
    initial?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (trapStack[trapStack.length - 1] !== id) return;
      if (e.key === 'Escape') {
        if (optionsRef.current.onEscape) {
          e.preventDefault();
          optionsRef.current.onEscape();
        }
        return;
      }
      const container = containerRef.current;
      if (e.key !== 'Tab' || !container) return;
      const items = getItems();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      if (e.shiftKey && (current === first || !container.contains(current))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (current === last || !container.contains(current))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      trapStack.splice(trapStack.indexOf(id), 1);
      const target = optionsRef.current.returnFocusRef?.current ?? opener;
      // Elements that are hidden or detached simply ignore focus()
      if (target?.isConnected) target.focus();
    };
  }, [active, containerRef]);
};

export default useFocusTrap;
