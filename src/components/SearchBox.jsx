import { useEffect, useId, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { SearchIcon } from "./Icons.jsx";
import { allProducts } from "../data/products.js";
import useEscapeKey from "../hooks/useEscapeKey.js";

const MAX_SUGGESTIONS = 4;

// Up to 4 different product names that START with what was typed (nothing typed -> nothing).
// To also match words inside a name ("hoodie" -> "Oversized Hoodie"), change the test to:
//   name.split(' ').some((w) => w.startsWith(q))
function getSuggestions(text) {
  const q = text.trim().toLowerCase();
  if (!q) return [];
  const seen = new Set();
  return allProducts
    .filter((p) => {
      const name = p.name.toLowerCase();
      if (!name.startsWith(q) || seen.has(name)) return false;
      seen.add(name);
      return true;
    })
    .slice(0, MAX_SUGGESTIONS);
}

/**
 * Header search. Enter (or the magnifier) opens /collection?q=... with the matching products.
 * Clicking the bar opens an empty white box (room for 4 rows); typing fills it with suggestions.
 * `blur` (phones) also blurs the page behind the search; tapping the blur closes the search.
 */
export default function SearchBox({
  className = "search",
  autoFocus = false,
  blur = false,
  onDone,
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const urlQuery = pathname === "/collection" ? params.get("q") || "" : "";

  const [value, setValue] = useState(urlQuery);
  useEffect(() => setValue(urlQuery), [urlQuery]);

  const [open, setOpen] = useState(autoFocus); // the white suggestion box
  const [active, setActive] = useState(-1); // keyboard-highlighted suggestion
  const ref = useRef(null);
  const listId = useId();
  const suggestions = getSuggestions(value);

  // close on Escape / a tap outside the search
  useEscapeKey(() => setOpen(false), open);
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [open]);

  const go = (text) => {
    const q = text.trim();
    setValue(text);
    setOpen(false);
    navigate(q ? `/collection?q=${encodeURIComponent(q)}` : "/collection");
    onDone?.();
  };

  const submit = (e) => {
    e.preventDefault();
    go(value);
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault(); // a search field would otherwise clear itself (and reopen the box)
      setOpen(false);
      return;
    }
    if (!suggestions.length) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const n = suggestions.length;
      // cycles: none -> 1st -> ... -> last -> none
      setActive((i) =>
        e.key === "ArrowDown"
          ? i + 1 >= n
            ? -1
            : i + 1
          : i - 1 < -1
            ? n - 1
            : i - 1,
      );
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      go(suggestions[active].name);
    }
  };

  const typed = value.trim().length;
  // only show the panel when there is something to show (no empty white sheet)
  const showPanel = open && (suggestions.length > 0 || typed > 0);

  return (
    <form
      className={`${className}${showPanel ? " search--open" : ""}`}
      onSubmit={submit}
      role="search"
      ref={ref}
    >
      {blur && open && (
        <div
          className="search__backdrop"
          onClick={() => {
            setOpen(false);
            onDone?.();
          }}
          aria-hidden="true"
        />
      )}
      <button type="submit" className="search__btn" aria-label="Search">
        <SearchIcon />
      </button>
      <div className="search__field">
        {!value && (
          <span className="search__text">
            Search for <b>T Shirt</b>
          </span>
        )}
        <input
          type="search"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onKeyDown={onKeyDown}
          aria-label="Search products"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          autoFocus={autoFocus}
          autoComplete="off"
        />
      </div>

      {showPanel && (
        <div
          className="search__panel"
          id={listId}
          role="listbox"
          aria-label="Search suggestions"
        >
          {suggestions.map((p, i) => (
            <button
              type="button"
              key={p.name}
              role="option"
              aria-selected={i === active}
              className={`search__item ${i === active ? "is-active" : ""}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => go(p.name)}
            >
              <SearchIcon size={14} />
              <span>
                <b>{p.name.slice(0, typed)}</b>
                {p.name.slice(typed)}
              </span>
            </button>
          ))}
          {typed > 0 && !suggestions.length && (
            <p className="search__empty">No matching products</p>
          )}
        </div>
      )}
    </form>
  );
}
