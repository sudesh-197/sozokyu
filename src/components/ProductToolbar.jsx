import { useEffect, useRef, useState } from 'react';
import { ChevronDownIcon, CheckIcon } from './Icons.jsx';
import { SORT_OPTIONS } from '../lib/catalog.js';

function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = SORT_OPTIONS.find((o) => o.key === value) || SORT_OPTIONS[0];

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  return (
    <div className="sort-wrap" ref={ref}>
      <button className={`sort ${open ? 'is-open' : ''}`} onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open}>
        Sort by : {current.label} <ChevronDownIcon />
      </button>
      {open && (
        <ul className="sort-menu" role="listbox" aria-label="Sort products">
          {SORT_OPTIONS.map((o) => (
            <li
              key={o.key}
              role="option"
              aria-selected={o.key === current.key}
              className={o.key === current.key ? 'is-selected' : ''}
              onClick={() => { onChange?.(o.key); setOpen(false); }}
            >
              {o.label}
              {o.key === current.key && <CheckIcon />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ProductToolbar({ total, query, sort = 'latest', onSort }) {
  return (
    <div className="toolbar">
      <p className="toolbar__count">Showing the result of {total}{query ? ` for “${query}”` : ''}</p>
      <SortDropdown value={sort} onChange={onSort} />
    </div>
  );
}
