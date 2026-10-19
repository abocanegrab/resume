import { useEffect } from 'react';

// Number of active locks. Nested locks (e.g. a modal opened over the mobile drawer)
// share one lock: styles are applied on 0 -> 1 and restored on 1 -> 0, so the inner
// lock releasing first never re-enables scroll under the outer one.
let lockCount = 0;
let saved: { overflow: string; gutter: string } | null = null;

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
    if (lockCount === 0) {
      saved = { overflow: body.style.overflow, gutter: root.style.scrollbarGutter };
      if (window.innerWidth > root.clientWidth) root.style.scrollbarGutter = 'stable';
      body.style.overflow = 'hidden';
    }
    lockCount += 1;
    return () => {
      lockCount -= 1;
      if (lockCount === 0 && saved) {
        body.style.overflow = saved.overflow;
        root.style.scrollbarGutter = saved.gutter;
        saved = null;
      }
    };
  }, [active]);
};

export default useScrollLock;
