import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard.jsx';
import { homeProducts, homeCardLayout } from '../../data/products.js';
import { categoryPills } from '../../data/home.js';
import useRemote from '../../hooks/useRemote.js';
import { prefersReducedMotion } from '../../hooks/useMediaQuery.js';
import { api } from '../../api/client.js';

const LEAVE_MS = 220;  // cards that don't match fade out
const MOVE_MS = 450;   // remaining cards glide to their new spot, new cards fade in
const EASE = 'cubic-bezier(.22, .8, .3, 1)';

const matches = (p, cat) => cat === 'All' || p.category === cat;

export default function BrowseProducts() {
  const [active, setActive] = useState('All'); // highlighted pill (instant)
  const [shown, setShown] = useState('All');   // category actually rendered in the grid
  const [leaving, setLeaving] = useState(() => new Set());

  const gridRef = useRef(null);
  const before = useRef(null); // { rects: Map(id -> DOMRect), height }
  const timer = useRef(null);

  const homeItems = useRemote(() => api.products({ section: 'home', limit: 50 }).then((r) => r.items), homeProducts, []);
  const visible = homeItems.filter((p) => matches(p, shown));

  const snapshot = () => {
    const grid = gridRef.current;
    const rects = new Map();
    grid.querySelectorAll('[data-id]').forEach((el) => rects.set(el.dataset.id, el.getBoundingClientRect()));
    return { rects, height: grid.getBoundingClientRect().height };
  };

  const select = (cat) => {
    if (cat === active) return;
    setActive(cat);
    clearTimeout(timer.current);

    if (prefersReducedMotion()) { setShown(cat); return; }

    // step 1: fade out the cards that will disappear
    const out = new Set(visible.filter((p) => !matches(p, cat)).map((p) => String(p.id)));
    setLeaving(out);

    // step 2: swap the list and let the layout effect animate the change
    timer.current = setTimeout(() => {
      before.current = snapshot();
      setLeaving(new Set());
      setShown(cat);
    }, out.size ? LEAVE_MS : 0);
  };

  // FLIP: animate from the old positions/height to the new ones
  useLayoutEffect(() => {
    const snap = before.current;
    const grid = gridRef.current;
    if (!snap || !grid) return undefined;
    before.current = null;

    const cells = [...grid.querySelectorAll('[data-id]')];
    const moved = [];

    cells.forEach((el) => {
      const prev = snap.rects.get(el.dataset.id);
      const now = el.getBoundingClientRect();
      el.style.transition = 'none';
      if (prev) {
        el.style.transform = `translate(${prev.left - now.left}px, ${prev.top - now.top}px)`;
      } else {
        el.style.opacity = '0';
        el.style.transform = 'scale(.94)';
      }
      moved.push(el);
    });

    // grid height: from old height to new height
    const newHeight = grid.getBoundingClientRect().height;
    grid.style.height = `${snap.height}px`;
    grid.style.overflow = 'visible';

    void grid.offsetHeight; // force reflow so the starting state is applied

    requestAnimationFrame(() => {
      moved.forEach((el) => {
        el.style.transition = `transform ${MOVE_MS}ms ${EASE}, opacity ${MOVE_MS}ms ease`;
        el.style.transform = '';
        el.style.opacity = '';
      });
      grid.style.transition = `height ${MOVE_MS}ms ${EASE}`;
      grid.style.height = `${newHeight}px`;
    });

    const done = setTimeout(() => {
      moved.forEach((el) => { el.style.transition = ''; });
      grid.style.transition = '';
      grid.style.height = '';
      grid.style.overflow = '';
    }, MOVE_MS + 50);
    return () => clearTimeout(done);
  }, [shown]);

  return (
    <section className="browse">
      <div className="browse__top">
        <h2>Browse All You Needs.</h2>
        <div className="cat-pills">
          {categoryPills.map((c) => (
            <button
              key={c}
              className={`cat-pill ${c === active ? 'is-active' : ''}`}
              onClick={() => select(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="browse__grid" ref={gridRef}>
        {visible.map((p) => (
          <div
            key={p.id}
            data-id={p.id}
            className={`browse__cell ${leaving.has(String(p.id)) ? 'is-leaving' : ''}`}
          >
            <ProductCard product={{ ...p, ...homeCardLayout[p.id] }} variant="home" />
          </div>
        ))}
      </div>

      <Link to="/collection" className="btn-dark">View More Products</Link>
    </section>
  );
}
