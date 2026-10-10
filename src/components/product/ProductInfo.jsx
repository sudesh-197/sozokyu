import { useState } from "react";
import SizeSelector from "./SizeSelector.jsx";
import VariantSelector from "./VariantSelector.jsx";
import DeliveryCheck from "./DeliveryCheck.jsx";
import { sizes } from "../../data/products.js";
import { HeartIcon } from "../Icons.jsx";
import Pill from "../Pill.jsx";
import { inr } from "../../lib/format.js";
import { useWishlist } from "../../lib/wishlist.js";

export default function ProductInfo({
  product,
  activeVariant,
  onVariant,
  onAddToCart,
}) {
  const {
    tag,
    name,
    detailPrice,
    variants,
    longDescription,
    details,
    availableSizes,
  } = product;
  const { has, toggle } = useWishlist();
  const liked = has(product.id);
  const sizeList = availableSizes?.length ? availableSizes : sizes;
  const [size, setSize] = useState(sizeList.includes("S") ? "S" : sizeList[0]);
  // if the selected size isn't sold for this product (navigated from another product), fall back
  const activeSize = sizeList.includes(size) ? size : sizeList[0];

  return (
    <div className="info">
      <div className="info__head">
        <Pill className="pill--tag">{tag}</Pill>
        <div className="info__title">
          <h1>{name}</h1>
          <div>
            <p className="info__price">₹{inr(detailPrice)}</p>
            <p className="info__tax">Price incl. of all taxes</p>
          </div>
        </div>
      </div>

      <div className="info__body">
        <SizeSelector sizes={sizeList} value={activeSize} onChange={setSize} />
        <VariantSelector
          variants={variants}
          active={activeVariant}
          onSelect={onVariant}
        />

        <div className="cta-row">
          <button
            className="add-to-cart"
            onClick={() => onAddToCart?.(product, activeSize)}
          >
            Add to Cart
          </button>
          <button
            type="button"
            className={`wish-btn ${liked ? "is-liked" : ""}`}
            aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={liked}
            onClick={() => toggle(product.id)}
          >
            <HeartIcon
              size={22}
              color={liked ? "#e0245e" : undefined}
              fill={liked}
            />
          </button>
        </div>

        <DeliveryCheck />

        <div className="info__copy">
          <div className="info__block">
            <p className="pd-title-16">Description</p>
            <p className="info__desc">{longDescription}</p>
          </div>
          <div className="info__block">
            <p className="pd-title-16">Product Details</p>
            <ul className="info__list">
              {details.map(([label, value]) => (
                <li key={label}>
                  <span>{label}</span> {value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
