import HomeHero from "../components/home/HomeHero.jsx";
import SectionHeading from "../components/home/SectionHeading.jsx";
import FeatureSplit from "../components/home/FeatureSplit.jsx";
import BrowseProducts from "../components/home/BrowseProducts.jsx";
import StylesStrip from "../components/home/StylesStrip.jsx";

export default function HomePage() {
  return (
    <main className="home-page">
      <HomeHero />

      <section className="home-section">
        <SectionHeading
          title="Fresh Fashion at Modern Vibes"
          text={
            <>
              Our collection is constantly updated with the latest styles,
              ensuring you’re always on point.
              <span className="hide-mobile">
                {" "}
                Shop now and let your fashion sense shine with the newest
                arrivals at Sozokyu.
              </span>
            </>
          }
        />
        <FeatureSplit />
      </section>

      <BrowseProducts />

      <section className="home-section">
        <SectionHeading
          title="Styles That Welcome Sunshine’s Return"
          text={
            <>
              Our collection is constantly updated with the latest styles,
              ensuring you’re always on point.
              <span className="hide-mobile">
                {" "}
                Shop now and let your fashion sense shine with the newest
                arrivals at Sozokyu.
              </span>
            </>
          }
        />
        <StylesStrip />
      </section>
    </main>
  );
}
