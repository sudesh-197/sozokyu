import { small } from "../../lib/images.js";
export default function VariantSelector({ variants, active, onSelect }) {
  return (
    <div className="pd-section">
      <p className="pd-label">
        Shop by Variant/<span className="lbl-d">Look</span>
        <span className="lbl-m">Color</span>
      </p>
      <div className="variant-row">
        {variants.map((src, i) => (
          <button
            key={i}
            className={`tile tile--variant ${i === active ? "is-active" : ""}`}
            onClick={() => onSelect(src, i)}
            aria-label={`Variant ${i + 1}`}
          >
            <img src={small(src)} alt="" loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
    </div>
  );
}
