import { useEffect } from 'react';

/** Calls `onEscape` when Escape is pressed while `active`. */
export default function useEscapeKey(onEscape, active = true) {
  useEffect(() => {
    if (!active) return undefined;
    const onKey = (e) => e.key === 'Escape' && onEscape();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onEscape, active]);
}
