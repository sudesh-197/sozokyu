import { getPlacedOrders, fmtLong } from "../lib/orders.js";
import { formatAddress } from "../lib/addresses.js";

// Orders come from checkout only (see lib/orders.js) - no sample data.
export const allOrders = getPlacedOrders;
export const getOrder = (key) => getPlacedOrders().find((o) => o.key === key);

const STEPS = [
  { icon: "bag", label: "Order Placed", offset: 0 },
  { icon: "package", label: "Order packed", offset: 0 },
  { icon: "truck", label: "in transit", offset: 2 },
  { icon: "delivered", label: "out of Delivery", offset: 4 },
];

/** everything the Order Details page shows, built from a placed order */
export function detailsFor(order) {
  const day = 86400000;
  const t = new Date(order.placedAt).getTime();
  const subtotal = order.items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const address = order.address
    ? {
        name: order.address.name,
        address: formatAddress(order.address),
        phone: `+91 ${order.address.phone}`,
      }
    : null;
  return {
    paymentMode: "Paid",
    placed: fmtLong(order.placedAt),
    itemCount: `${order.count} item${order.count === 1 ? "" : "s"}`,
    status: order.status,
    orderId: `#${String(t).slice(-9)}`,
    steps: STEPS.map((s) => ({
      icon: s.icon,
      label: s.label,
      date: fmtLong(new Date(t + s.offset * day).toISOString()).toLowerCase(),
    })),
    address,
    items: order.items.map((it) => ({
      name: it.name,
      sku: it.sku,
      variant: `${it.size} / ${it.color}`,
      qty: it.qty,
      price: it.price,
      thumb: it.thumb.src,
    })),
    discount: 0,
    delivery: 0,
    subtotal,
    total: subtotal,
  };
}
