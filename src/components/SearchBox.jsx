import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { SearchIcon } from './Icons.jsx';

/** Header search. Enter (or the magnifier) opens /collection?q=... with the matching products. */
export default function SearchBox({ className = 'search', autoFocus = false, onDone }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const urlQuery = pathname === '/collection' ? params.get('q') || '' : '';

  const [value, setValue] = useState(urlQuery);
  useEffect(() => setValue(urlQuery), [urlQuery]);

  const submit = (e) => {
    e.preventDefault();
    const q = value.trim();
    navigate(q ? `/collection?q=${encodeURIComponent(q)}` : '/collection');
    onDone?.();
  };

  return (
    <form className={className} onSubmit={submit} role="search">
      <button type="submit" className="search__btn" aria-label="Search"><SearchIcon /></button>
      <div className="search__field">
        {!value && <span className="search__text">Search for <b>T Shirt</b></span>}
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Search products"
          autoFocus={autoFocus}
          autoComplete="off"
        />
      </div>
    </form>
  );
}
