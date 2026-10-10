import { useEffect, useState } from 'react';

/**
 * Shows `fallback` immediately (the data bundled in the frontend), then swaps in the
 * backend's data once it arrives. If the backend is down the fallback simply stays.
 */
export default function useRemote(fetcher, fallback, deps = []) {
  const [data, setData] = useState(fallback);
  useEffect(() => {
    let alive = true;
    setData(fallback);
    fetcher().then((d) => { if (alive && d) setData(d); }).catch(() => { /* keep fallback */ });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return data;
}
