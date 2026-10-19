import { useEffect } from 'react';

// Locks page scroll while `active`.
// To keep fixed UI (NavBar) from jumping when the scrollbar disappears, the root
// reserves the scrollbar slot with `scrollbar-gutter: stable`, but only while locked
// and only if a scrollbar was actually showing. A global `scrollbar-gutter: stable`
// would also reserve an empty strip on screens that never scroll (the fixed
// LoadingScreen showed an 8px band of page background at its right edge).
export const useScrollLock = (active: boolean) => {
  useEffect(() => {
    if (!active) return;
    const { body, documentElement: root } = document;
    const prevOverflow = body.style.overflow;
    const prevGutter = root.style.scrollbarGutter;
    if (window.innerWidth > root.clientWidth) root.style.scrollbarGutter = 'stable';
    body.style.overflow = 'hidden';
    return () => {
      body.style.overflow = prevOverflow;
      root.style.scrollbarGutter = prevGutter;
    };
  }, [active]);
};

export default useScrollLock;
