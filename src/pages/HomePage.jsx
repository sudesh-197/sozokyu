import HomeHero from "../components/home/HomeHero.jsx";
import SectionHeading from "../components/home/SectionHeading.jsx";
import FeatureSplit from "../components/home/FeatureSplit.jsx";
import BrowseProducts from "../components/home/BrowseProducts.jsx";
import StylesStrip from "../components/home/StylesStrip.jsx";

const COPY =
  "Our collection is constantly updated with the latest styles, ensuring you’re always on point. Shop now and let your fashion sense shine with the newest arrivals at";

export default function HomePage() {
  return (
    <main className="home-page">
      <HomeHero />

      <section className="home-section">
        <SectionHeading
          title="Fresh Fashion at Modern Vibes"
          text={`${COPY} Sozokyu.`}
        />
        <FeatureSplit />
      </section>

      <BrowseProducts />

      <section className="home-section">
        <SectionHeading
          title="Styles That Welcome Sunshine’s Return"
          text={`${COPY} Sozokyu.`}
        />
        <StylesStrip />
      </section>
    </main>
  );
}
