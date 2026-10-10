import { Link } from 'react-router-dom';
import { homeAssets } from '../../data/home.js';
import { usePhone } from '../../hooks/useMediaQuery.js';

export default function HomeHero() {
  // render only the hero for this screen size, so the other one is never downloaded
  const isPhone = usePhone();
  return (
    <section className="home-hero">
      <div className="home-hero__card">
        {isPhone
          ? <img className="home-hero__bg home-hero__bg--m" src={homeAssets.heroMobile} alt="" fetchpriority="high" decoding="async" />
          : <img className="home-hero__bg home-hero__bg--d" src={homeAssets.hero} alt="" fetchpriority="high" decoding="async" />}
        <div className="home-hero__text">
          <h1>CloudeyStyles.</h1>
          <p>Discover our wide ranging and timeless of lifestyle products. Pick your favorite stuff that matches your personal taste and style.</p>
        </div>
        <div className="home-hero__cta">
          <Link to="/collection" className="btn-white">Start Shopping</Link>
        </div>
      </div>
    </section>
  );
}
