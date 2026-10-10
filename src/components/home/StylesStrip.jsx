import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { strip } from '../../data/home.js';
import { small } from '../../lib/images.js';
import { prefersReducedMotion } from '../../hooks/useMediaQuery.js';

// Continuous "ticker" (marquee). The photo set is rendered twice and the track moves left
// by one set's width, then wraps – seamless. On hover it eases down to a slow speed and
// eases back up when the cursor leaves.
const BASE_SPEED = 100; // px per second (normal)  – raise to go faster
const HOVER_SPEED = 25; // px per second (cursor over the strip)
const EASE = 6;         // how quickly the speed changes (higher = snappier)

function Set({ hidden }) {
  return (
    <div className="strip__set" aria-hidden={hidden || undefined}>
      {strip.map((item, i) => (
        <Link
          key={i}
          to="/collection"
          className="strip__item"
          aria-label="Shop the collection"
          tabIndex={hidden ? -1 : undefined}
        >
          <img
            src={small(item.src)}
            alt=""
            loading="lazy"
            decoding="async"
            className={item.style ? '' : 'cover'}
            style={item.style ? { position: 'absolute', maxWidth: 'none', ...item.style } : undefined}
          />
        </Link>
      ))}
    </div>
  );
}

export default function StylesStrip() {
  const trackRef = useRef(null);
  const hovering = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion()) return undefined;

    let x = 0;
    let speed = BASE_SPEED;
    let last = performance.now();
    let raf;

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const target = hovering.current ? HOVER_SPEED : BASE_SPEED;
      speed += (target - speed) * Math.min(1, dt * EASE);
      x -= speed * dt;
      const setWidth = track.firstElementChild.offsetWidth;
      if (setWidth && -x >= setWidth) x += setWidth;
      track.style.transform = `translate3d(${x}px, 0, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="strip-wrap"
      onMouseEnter={() => { hovering.current = true; }}
      onMouseLeave={() => { hovering.current = false; }}
    >
      <div className="strip" ref={trackRef}>
        <Set />
        <Set hidden />
      </div>
    </div>
  );
}
