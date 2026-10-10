import { useEffect, useRef, useState } from "react";
import { SORT_OPTIONS } from "../lib/catalog.js";
import { colors, prices } from "../data/filters.js";
import { createIcon, CheckIcon } from "./Icons.jsx";
import useEscapeKey from "../hooks/useEscapeKey.js";

/* 15px line icons used by the bar (Figma: sort-by-down-02, palette, wallet-01, filter-horizontal) */
const barIcon = (paths) => createIcon(paths, 15, { stroke: "#000", "aria-hidden": true });
const SortIcon = barIcon(
  <>
    <path d="M4 6h10M4 12h7M4 18h4" />
    <path d="M18 5v14M14.5 15.5L18 19l3.5-3.5" />
  </>,
);
const PaletteIcon = barIcon(
  <>
    <path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-.9 2-1.8 0-1.1-.9-1.5-.9-2.5 0-1 .8-1.7 1.8-1.7H17a4 4 0 0 0 4-4c0-4-4-8-9-8z" />
    <circle cx="7.5" cy="11.5" r="1" />
    <circle cx="10.5" cy="7.5" r="1" />
    <circle cx="15" cy="8" r="1" />
  </>,
);
const WalletIcon = barIcon(
  <>
    <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v1" />
    <path d="M4 7.5v9A2.5 2.5 0 0 0 6.5 19H19a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1H6.5A2.5 2.5 0 0 1 4 7.5z" />
    <circle cx="16" cy="13.5" r="1" />
  </>,
);
const FilterHorizontalIcon = barIcon(
  <>
    <path d="M3 7h9M18 7h3M3 17h3M12 17h9" />
    <circle cx="15" cy="7" r="2.5" />
    <circle cx="9" cy="17" r="2.5" />
  </>,
);

// wording used in the phone design (the desktop dropdown keeps its own labels)
const SORT_LABELS = {
  latest: "What’s new",
  popular: "Popularity",
  price_asc: "Price - low to high",
  price_desc: "Price - high to low",
};
const TITLES = { sort: "Sort", color: "Color", price: "Price" };

/* ---------- price slider: one handle, ₹0 – ₹5000 (shows products up to the chosen price) ---------- */
const PRICE_MAX = 5000;
const PRICE_STEP = 100;
const snap = (v) => Math.round(v / PRICE_STEP) * PRICE_STEP;

// current URL price keys -> the highest price they allow ("0-2000", or the sidebar's fixed ranges)
function maxFromKeys(keys) {
  const ranges = keys
    .map((key) => {
      const preset = prices.find((r) => r.key === key);
      if (preset) return preset;
      const m = /^(\d+)-(\d+)$/.exec(key);
      return m ? { min: +m[1], max: +m[2] } : null;
    })
    .filter(Boolean);
  if (!ranges.length) return PRICE_MAX;
  const hi = Math.max(...ranges.map((r) => r.max));
  return Math.max(
    PRICE_STEP,
    Math.min(snap(Number.isFinite(hi) ? hi : PRICE_MAX), PRICE_MAX),
  );
}

function PriceSlider({ price, onPrice }) {
  const [hi, setHi] = useState(() => maxFromKeys(price));
  const first = useRef(true);

  // apply the price shortly after the finger stops moving
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return undefined;
    }
    const t = setTimeout(
      () => onPrice(hi === PRICE_MAX ? [] : [`0-${hi}`]),
      250,
    );
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hi]);

  return (
    <div className="mrange">
      <div className="mrange__values">
        <span className="mrange__value">
          ₹ 0 - ₹ {hi}
          {hi === PRICE_MAX ? "+" : ""}
        </span>
      </div>

      <div className="mrange__track">
        <div className="mrange__rail">
          <div
            className="mrange__fill"
            style={{ width: `${(hi / PRICE_MAX) * 100}%` }}
          />
        </div>
        <input
          type="range"
          className="mrange__input"
          min={0}
          max={PRICE_MAX}
          step={PRICE_STEP}
          value={hi}
          aria-label="Maximum price"
          onChange={(e) => setHi(Math.max(+e.target.value, PRICE_STEP))}
        />
      </div>

      <div className="mrange__scale" aria-hidden="true">
        <span>₹0</span>
        <span>₹{PRICE_MAX}</span>
      </div>

      {hi < PRICE_MAX && (
        <button
          type="button"
          className="mbar__reset"
          onClick={() => {
            setHi(PRICE_MAX);
            onPrice([]);
          }}
        >
          Reset
        </button>
      )}
    </div>
  );
}

/**
 * Phones only. Fixed (sticky) at the bottom of the screen: it never moves while scrolling,
 * including at the end of the product list.
 *   Sort / Color / Price open a card above the bar (they use the same URL options as the sidebar);
 *   Filter opens the full filter sheet.
 */
export default function MobileFilterBar({
  sort,
  onSort,
  color,
  onColor,
  price,
  onPrice,
  onOpenFilters,
}) {
  const [open, setOpen] = useState(null); // 'sort' | 'color' | 'price' | null
  const ref = useRef(null);

  // close the open card on outside tap / Escape
  useEscapeKey(() => setOpen(null), !!open);
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(null);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [open]);

  const toggleList = (list, value) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const tab = (id, label, active, children) => (
    <button
      key={id}
      type="button"
      className={`mbar__btn ${active ? "is-active" : ""} ${open === id ? "is-open" : ""}`}
      aria-haspopup="true"
      aria-expanded={open === id}
      onClick={() => setOpen(open === id ? null : id)}
    >
      {children}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="mbar">
      <div className={`mbar__float ${open ? "is-open" : ""}`} ref={ref}>
        {open && (
          <div
            className="mbar__panel"
            role="dialog"
            aria-label={`${TITLES[open]} options`}
          >
            <p className="mbar__title">{TITLES[open]}</p>

            {open === "sort" && (
              <ul
                className="mbar__list"
                role="listbox"
                aria-label="Sort products"
              >
                {SORT_OPTIONS.map((o) => (
                  <li
                    key={o.key}
                    role="option"
                    aria-selected={o.key === sort}
                    className={o.key === sort ? "is-selected" : ""}
                    onClick={() => {
                      onSort(o.key);
                      setOpen(null);
                    }}
                  >
                    {SORT_LABELS[o.key] || o.label}
                    {o.key === sort && <CheckIcon aria-hidden="true" />}
                  </li>
                ))}
              </ul>
            )}

            {open === "color" && (
              <>
                <div className="mbar__chips">
                  {colors.map((c) => (
                    <button
                      type="button"
                      key={c.label}
                      aria-pressed={color.includes(c.label)}
                      className={`mbar__chip ${color.includes(c.label) ? "is-on" : ""}`}
                      onClick={() => onColor(toggleList(color, c.label))}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
                {color.length > 0 && (
                  <button
                    type="button"
                    className="mbar__reset"
                    onClick={() => onColor([])}
                  >
                    Reset
                  </button>
                )}
              </>
            )}

            {open === "price" && (
              <PriceSlider price={price} onPrice={onPrice} />
            )}
          </div>
        )}

        <div className="mbar__bar">
          {tab("sort", "Sort", sort !== "latest", <SortIcon />)}
          {tab("color", "Color", color.length > 0, <PaletteIcon />)}
          {tab("price", "Price", price.length > 0, <WalletIcon />)}
          <span className="mbar__divider" aria-hidden="true" />
          <button
            type="button"
            className="mbar__btn"
            onClick={() => {
              setOpen(null);
              onOpenFilters();
            }}
          >
            <FilterHorizontalIcon />
            <span>Filter</span>
          </button>
        </div>
      </div>
    </div>
  );
}
