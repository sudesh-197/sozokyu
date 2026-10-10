import { useNavigate } from "react-router-dom";
import Pill from "./Pill.jsx";
import IconButton from "./IconButton.jsx";
import { BasketIcon, HeartIcon } from "./Icons.jsx";
import { responsive } from "../lib/images.js";
import { inr } from "../lib/format.js";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../lib/wishlist.js";
import { usePhone } from "../hooks/useMediaQuery.js";

/** variant: 'default' (collection grid) | 'large' (details page – "You might also like") | 'home' (home "Browse" grid: large + heart button) */
export default function ProductCard({ product, variant = "default", onAdd }) {
  const navigate = useNavigate();
  const { id, name, description, price, image, box, imgStyle, plain, bg } =
    product;
  const isPhone = usePhone();
  const m =
    isPhone && variant !== "home" && product.mobile ? product.mobile : null;
  const [w, h] = m ? m.box : box;
  const crop = m ? m.imgStyle : imgStyle;
  const open = () => navigate(`/product/${id}`);
  const isHome = variant === "home";
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const liked = has(id);
  // card-level add: pick M when the product has it, otherwise its first size (the details page lets people choose)
  const quickAdd = () => {
    const sizes = product.availableSizes?.length
      ? product.availableSizes
      : ["M"];
    add(product, sizes.includes("M") ? "M" : sizes[0]);
  };

  return (
    <article
      className={`card ${variant === "large" || isHome ? "card--lg" : ""} ${isHome ? "card--home" : ""}`}
      onClick={open}
      onKeyDown={(e) => e.key === "Enter" && open()}
      role="link"
      tabIndex={0}
    >
      <div
        className={`card__media ${plain ? "card__media--plain" : ""}`}
        style={bg ? { background: bg } : undefined}
      >
        <div
          className={`card__imgbox ${m ? "card__imgbox--m" : ""}`}
          style={{ width: w, height: h }}
        >
          <img
            {...responsive(
              image,
              `(max-width: 768px) ${m ? w : Math.round(w * 0.45)}px, ${w}px`,
            )}
            style={{ position: "absolute", maxWidth: "none", ...crop }}
            /* alt, loading, decoding stay as they are */
          />
        </div>
      </div>

      <div className="card__body">
        <div className="card__text">
          <h3>{name}</h3>
          <p>{description}</p>
        </div>
        <div className="card__footer">
          <Pill className="pill--price">₹{inr(price)}</Pill>
          <div className="card__actions">
            <IconButton
              size={32}
              label={liked ? "Remove from wishlist" : "Add to wishlist"}
              onClick={(e) => {
                e.stopPropagation();
                toggle(id);
              }}
            >
              <HeartIcon color={liked ? "#e0245e" : undefined} fill={liked} />
            </IconButton>
            <IconButton
              size={32}
              label="Add to bag"
              onClick={(e) => {
                e.stopPropagation();
                (onAdd || quickAdd)(product);
              }}
            >
              <BasketIcon />
            </IconButton>
          </div>
        </div>
      </div>
    </article>
  );
}
