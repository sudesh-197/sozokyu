import { small } from './images.js';
import { readList, writeJSON } from './storage.js';
import { getProduct } from '../data/products.js';

// Front-end only order history (localStorage). Swap `placeOrder` for api.createOrder when the backend is live.
const KEY = 'sozokyu_orders';

// Orders saved before the redesign keep an old copy of the product. For the collection products (ids 1-12, sku SZ-000NN)
// show the current name, price and photo, and recompute the totals from them.
const freshItem = (it) => {
  const id = Number(String(it.sku || '').replace(/\D/g, ''));
  const p = id >= 1 && id <= 12 ? getProduct(id) : null;
  return p ? { ...it, name: p.name, price: p.detailPrice, color: p.color || it.color, thumb: { ...it.thumb, src: small(p.image) } } : it;
};
const freshOrder = (o) => {
  const items = (o.items || []).map(freshItem);
  return { ...o, items, total: items.reduce((s, l) => s + l.price * l.qty, 0) };
};

export const getPlacedOrders = () => readList(KEY).map(freshOrder);

const fmtShort = (d) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); // 10 Oct 2026
export const fmtLong = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }); // Oct 05, 2026

/** turns the cart lines into an order and saves it; returns the new order */
export function placeOrder(lines, address = null) {
  const now = new Date();
  const eta = new Date(now.getTime() + 5 * 86400000);
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const order = {
    key: `order-${now.getTime()}`,
    id: `SZQ-${String(now.getTime()).slice(-6)}`,
    placedAt: now.toISOString(),
    eta: fmtShort(eta),
    etaISO: eta.toISOString(),
    status: 'shipped',
    address, // snapshot of the delivery address used for this order (shown on Order Details)
    total,
    count: lines.reduce((s, l) => s + l.qty, 0),
    items: lines.map((l) => ({
      sku: `SZ-${String(l.id).padStart(5, '0')}`,
      name: l.name,
      qty: l.qty,
      price: l.price,
      size: l.size,
      color: l.color,
      thumb: { src: small(l.image), w: 146, h: 219 },
    })),
  };
  writeJSON(KEY, [order, ...getPlacedOrders()]);
  return order;
}
