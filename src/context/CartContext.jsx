import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import CartToast from "../components/CartToast.jsx";
import CartDrawer from "../components/CartDrawer.jsx";
import { api } from "../api/client.js";
import { getProduct } from "../data/products.js";
import { readList, writeJSON } from "../lib/storage.js";

const KEY = "sozokyu_cart";
const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

// Saved carts keep a copy of name / price / photo. For the collection products (ids 1-12) refresh that copy from the
// current catalog, so a cart saved before the redesign never shows the old name, price or (deleted) photo.
const fresh = (i) => {
  const p = Number(i.id) <= 12 ? getProduct(i.id) : null;
  return p
    ? {
        ...i,
        name: p.name,
        price: p.detailPrice,
        image: p.image,
        color: p.color || i.color,
      }
    : i;
};
const load = () => readList(KEY).map(fresh);

export function CartProvider({ children }) {
  const [items, setItems] = useState(load);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // hide the toast after 2.5s (adding another item restarts the timer)
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    writeJSON(KEY, items);
  }, [items]);

  // adds a product (same product + size just increases the quantity) and opens the drawer
  const add = useCallback((product, size) => {
    const key = `${product.id}-${size}`;
    setItems((cur) => {
      const hit = cur.find((i) => i.key === key);
      if (hit)
        return cur.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
      return [
        ...cur,
        {
          key,
          id: product.id,
          name: product.name,
          size,
          price: product.detailPrice,
          image: product.image,
          color: product.color || "White",
          qty: 1,
        },
      ];
    });
    setToast({
      id: Date.now(),
      name: product.name,
      image: product.image,
      size,
    });
    api.addToCart(product.id, size).catch(() => {
      /* works without a backend */
    }); // keep the server cart in sync when it exists
  }, []);

  const setQty = useCallback(
    (key, qty) =>
      setItems((cur) =>
        cur.map((i) => (i.key === key ? { ...i, qty: Math.max(1, qty) } : i)),
      ),
    [],
  );
  const remove = useCallback(
    (key) => setItems((cur) => cur.filter((i) => i.key !== key)),
    [],
  );
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      add,
      setQty,
      remove,
      clear,
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal: items.reduce((s, i) => s + i.price * i.qty, 0),
      open,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
    }),
    [items, add, setQty, remove, clear, open],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
      <CartToast
        toast={toast}
        onClose={() => setToast(null)}
        onView={() => {
          setToast(null);
          setOpen(true);
        }}
      />
    </CartContext.Provider>
  );
}
