import { useEffect } from 'react';

/** Stops the page behind a popup / drawer from scrolling while `active`. */
export default function useScrollLock(active = true) {
  useEffect(() => {
    if (!active) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [active]);
}
