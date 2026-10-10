import { useEffect, useState } from 'react';

export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

/** phones / small tablets – keep in sync with the 768px breakpoint in the CSS */
export const usePhone = () => useMediaQuery('(max-width: 768px)');

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
