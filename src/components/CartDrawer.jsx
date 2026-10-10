import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { small } from "../lib/images.js";
import { rupee } from "../lib/format.js";
import { MinusIcon, PlusIcon, TrashIcon } from "./Icons.jsx";
import useEscapeKey from "../hooks/useEscapeKey.js";
import useScrollLock from "../hooks/useScrollLock.js";

// Slide-in cart (opened by "Add to Cart" and the header basket).
// "Proceed to Checkout" opens the checkout page.
export default function CartDrawer() {
  const { open, closeCart, items, count, subtotal, setQty, remove } = useCart();
  const navigate = useNavigate();

  useEscapeKey(closeCart, open);
  useScrollLock(open);

  if (!open) return null;

  const isEmpty = items.length === 0;

  const continueShopping = () => {
    closeCart();
    navigate("/collection");
  };

  const checkout = () => {
    if (!items.length) return;
    closeCart();
    navigate("/checkout"); // opens the checkout page first
  };

  return (
    <div className="cart-overlay" onClick={closeCart}>
      <aside
        className="cart"
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        onClick={(e) => e.stopPropagation()}
      >
        {isEmpty ? (
          <div className="cart__empty-state">
            <p className="cart__empty">Your Cart is Empty</p>
            <button
              type="button"
              className="cart__checkout cart__continue"
              onClick={continueShopping}
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <header className="cart__head">
              <h2>Your Cart ({count})</h2>
              <button type="button" className="cart__close" onClick={closeCart}>
                Close
              </button>
            </header>

            <div className="cart__list">
              {items.map((it) => (
                <div className="cart__item" key={it.key}>
                  <Link
                    to={`/product/${it.id}`}
                    className="cart__product"
                    onClick={closeCart}
                    aria-label={`View ${it.name}`}
                  />
                  <div className="cart__img">
                    <img src={small(it.image)} alt="" />
                  </div>
                  <div className="cart__info">
                    <p className="cart__name">{it.name}</p>
                    <p className="cart__size">Size: {it.size}</p>
                    <p className="cart__price">{rupee(it.price)}</p>
                    <div className="cart__qty">
                      <button
                        type="button"
                        onClick={() => setQty(it.key, it.qty - 1)}
                        disabled={it.qty <= 1}
                        aria-label="Decrease quantity"
                      >
                        <MinusIcon />
                      </button>
                      <span>{it.qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(it.key, it.qty + 1)}
                        aria-label="Increase quantity"
                      >
                        <PlusIcon />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="cart__round cart__trash"
                    onClick={() => remove(it.key)}
                    aria-label={`Remove ${it.name}`}
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>

            <footer className="cart__foot">
              <div className="cart__sum">
                <span>Subtotal</span>
                <span>{rupee(subtotal)}</span>
              </div>
              <div className="cart__sum cart__sum--muted">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="cart__total">
                <span>Total</span>
                <span>{rupee(subtotal)}</span>
              </div>
              <button
                type="button"
                className="cart__checkout"
                onClick={checkout}
              >
                Proceed to Checkout
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
