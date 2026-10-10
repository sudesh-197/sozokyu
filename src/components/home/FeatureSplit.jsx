import { Link } from 'react-router-dom';
import { homeAssets, stackCards, stackCardsPhone } from '../../data/home.js';
import { responsive, small } from '../../lib/images.js';
import { usePhone } from '../../hooks/useMediaQuery.js';

// "Hold on, new products are coming!" – three stacked cards (back -> front).
// Desktop / tablet and phone share the markup; only the card sizes (data) and the CSS differ.
function NewArrivals({ cards, phone = false }) {
  return (
    <div className="feature__right">
      <div className="feature__head">
        <p className="feature__head-title">Hold on, new products are coming!</p>
        <p className="feature__head-sub">New Style , Just Arrived!</p>
      </div>
      <div className={`stack${phone ? ' stack--phone' : ''}`}>
        {cards.map((c, i) => (
          <div
            key={i}
            className="stack__card"
            style={{ width: c.w, height: c.h, top: c.top, opacity: c.opacity, zIndex: i + 1 }}
          >
            <div className="stack__img" style={c.img ? { width: c.img } : undefined}>
              <img
                className={c.crop ? undefined : 'cover'}
                src={small(c.src)}
                alt=""
                loading="lazy"
                decoding="async"
                style={c.crop ? { position: 'absolute', maxWidth: 'none', ...c.crop } : undefined}
              />
            </div>
            <div className="stack__text">
              <span className="stack__year">2026</span>
              <span>New Arrival Cloth</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FeatureSplit() {
  const isPhone = usePhone();
  return (
    <div className="feature">
      <Link to="/collection" className="feature__left">
        <div className="feature__photo">
          <img {...responsive(homeAssets.feature, '(max-width: 768px) 310px, 681px')} alt="" loading="lazy" decoding="async" />
        </div>
        <div className="feature__caption">
          <p className="feature__title">Discover the limitless</p>
          <p className="feature__sub">-Imagining New Fashion Trends</p>
        </div>
      </Link>

      <NewArrivals cards={isPhone ? stackCardsPhone : stackCards} phone={isPhone} />
    </div>
  );
}
