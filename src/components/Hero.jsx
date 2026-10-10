import { heroImage, heroImageMobile } from "../data/products.js";
import { usePhone } from "../hooks/useMediaQuery.js";

export default function Hero() {
  // render only the banner image for this screen size, so the other one is never downloaded
  const isPhone = usePhone();
  return (
    <section className="hero">
      <div className="hero__img">
        {isPhone ? (
          <img
            className="hero__img-m"
            src={heroImageMobile}
            alt=""
            fetchpriority="high"
            decoding="async"
          />
        ) : (
          <img
            className="hero__img-d"
            src={heroImage}
            alt=""
            fetchpriority="high"
            decoding="async"
          />
        )}
      </div>
      <div className="hero__text">
        <h1>
          explore the various collection <span className="hero__of">of</span>{" "}
          sozokyu
        </h1>
        <p>Don’t miss out to shopping collection from us!</p>
      </div>
    </section>
  );
}
