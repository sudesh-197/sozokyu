import { Link } from "react-router-dom";
import ProductGrid from "../../components/ProductGrid.jsx";
import { MobileHead } from "../../components/account/BackLink.jsx";
import { allProducts, getProduct, withLocalMeta } from "../../data/products.js";
import { useWishlist } from "../../lib/wishlist.js";
import useRemote from "../../hooks/useRemote.js";
import { api } from "../../api/client.js";

export default function WishlistPage() {
  const { ids } = useWishlist();

  // shows the bundled data at once, then swaps in the latest backend data
  const bundled = allProducts.filter((p) => ids.includes(String(p.id)));
  const list = useRemote(
    () =>
      Promise.all(
        ids.map((id) =>
          api
            .product(id)
            .then(withLocalMeta)
            .catch(() => getProduct(id)),
        ),
      ).then((items) => items.filter(Boolean)),
    bundled,
    [ids.join(",")],
  );

  return (
    <div className="addr">
      {/* phones only: back arrow + title (the pill row is hidden on phones) */}
      <MobileHead title="Wishlist" />

      {list.length > 0 && (
        <h1 className="account__title page-title acc-desktop-title">
          Wishlist
        </h1>
      )}
      {list.length === 0 ? (
        <div className="login-guard">
          <p>
            Your wishlist is empty. Tap the heart on any product to save it.
          </p>
          <Link to="/collection" className="btn-dark">
            Browse the collection
          </Link>
        </div>
      ) : (
        <ProductGrid products={list} />
      )}
    </div>
  );
}
