// Wishlist (localStorage). Stores product ids; every component using useWishlist() stays in sync.
import { useCallback, useEffect, useState } from 'react';
import { readList, writeJSON } from './storage.js';

const KEY = 'sozokyu_wishlist';
const EVENT = 'sozokyu:wishlist';

const getWishlist = () => readList(KEY);
const save = (ids) => {
  writeJSON(KEY, ids);
  window.dispatchEvent(new Event(EVENT));
};

export function useWishlist() {
  const [ids, setIds] = useState(getWishlist);
  useEffect(() => {
    const sync = () => setIds(getWishlist());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener(EVENT, sync); window.removeEventListener('storage', sync); };
  }, []);
  const has = useCallback((id) => ids.includes(String(id)), [ids]);
  const toggle = useCallback((id) => {
    const cur = getWishlist();
    const key = String(id);
    save(cur.includes(key) ? cur.filter((x) => x !== key) : [...cur, key]);
  }, []);
  return { ids, has, toggle };
}
