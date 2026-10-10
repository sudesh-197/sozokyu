import { Navigate, useParams } from "react-router-dom";
import { getOrder, detailsFor } from "../../data/orders.js";
import {
  BagAddIcon,
  PackageIcon,
  TruckDeliveryIcon,
  PackageDeliveredIcon,
} from "../../components/account/AccountIcons.jsx";
import StatusBadge from "../../components/account/StatusBadge.jsx";
import BackLink from "../../components/account/BackLink.jsx";
import { rupee as rupeeIN } from "../../lib/format.js";

const STEP_ICONS = {
  bag: BagAddIcon,
  package: PackageIcon,
  truck: TruckDeliveryIcon,
  delivered: PackageDeliveredIcon,
};
const rupee = (n) => `₹${n}`;

// Order Details (Figma 3259:2667) - opened from the "Details" button on My Orders
export default function OrderDetailsPage() {
  const { key } = useParams();
  const order = getOrder(key);
  if (!order) return <Navigate to="/account/orders" replace />;
  const d = detailsFor(order);

  return (
    <div className="od">
      <div className="od__title">
        <BackLink className="od__back" to="/account/orders" label="Back to my orders" />
        <h1>Order Details</h1>
      </div>

      <div className="od__body">
        <div className="od__top">
          <div className="od__facts">
            <div className="od__fact od__fact--grow">
              <span className="od__pre">Order ID </span>
              <span className="od__idval">
                {" "}
                <span className="od__hash">#</span>
                {d.orderId.replace("#", "")}
              </span>
            </div>
            <div className="od__fact od__fact--w">
              <span>Order Placed</span>
              <b>{d.placed}</b>
            </div>

            <div className="od__fact od__fact--w">
              <span>No of Items</span>
              <b>{d.itemCount}</b>
            </div>
            <div className="od__fact od__fact--wa">
              <span>Payment Mode</span>
              <b>{d.paymentMode}</b>
            </div>
            <div className="od__fact od__fact--grow">
              <span>Status</span>
              <StatusBadge status={d.status} />
            </div>
          </div>

          <div className="od__sec">
            <div className="od__row">
              <h2>Order Tracking</h2>
              <span>Order ID : {d.orderId}</span>
            </div>
            <div className="od__track">
              <div className="od__trackin">
                <div className="od__line" aria-hidden="true">
                  <svg
                    width="100%"
                    height="1"
                    viewBox="0 0 744 1"
                    preserveAspectRatio="none"
                    fill="none"
                  >
                    <path d="M0 0.5H744" stroke="black" />
                  </svg>
                </div>
                <ol className="od__steps">
                  {d.steps.map((s, i) => {
                    const Icon = STEP_ICONS[s.icon];
                    return (
                      <li
                        className={`od__step od__step--${i + 1}`}
                        key={s.label}
                      >
                        <span className="od__dot">
                          <Icon />
                        </span>
                        <span className="od__steplabel">
                          <span>{s.label}</span>
                          <span>{s.date}</span>
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="od__sec">
          <h2>Address</h2>
          <div className="od__box">
            <div className="od__addr">
              {d.address ? (
                <>
                  <p className="od__addr-name">{d.address.name}</p>
                  <p className="od__addr-text">
                    {d.address.address}
                    <br />
                    {d.address.phone}
                  </p>
                </>
              ) : (
                <p className="od__addr-text">No address added</p>
              )}
            </div>
          </div>
        </div>

        <div className="od__sec">
          <h2>Items from the Order</h2>
          <div className="od__table-wrap">
            <div
              className="od__table"
              role="table"
              aria-label="Items from the order"
            >
              <div className="od__tr od__tr--head" role="row">
                <span role="columnheader" className="c-name">
                  PRODUCT NAME
                </span>
                <span role="columnheader" className="c-sku">
                  SKU
                </span>
                <span role="columnheader" className="c-var">
                  SIZE / COLOR
                </span>
                <span role="columnheader" className="c-qty">
                  QTY
                </span>
                <span role="columnheader" className="c-num c-num--head">
                  PRICE
                </span>
                <span role="columnheader" className="c-num c-num--head">
                  TOTAL
                </span>
              </div>
              {d.items.map((it, i) => (
                <div className="od__tr" role="row" key={`${it.sku}-${i}`}>
                  <span role="cell" className="c-name">
                    <span className="od__thumb">
                      <img src={it.thumb} alt="" />
                    </span>
                    {it.name}
                  </span>
                  <span role="cell" className="c-sku">
                    {it.sku}
                  </span>
                  <span role="cell" className="c-var">
                    {it.variant}
                  </span>
                  <span role="cell" className="c-qty">
                    {it.qty}
                  </span>
                  <span role="cell" className="c-num">
                    <span>{rupee(it.price)}</span>
                  </span>
                  <span role="cell" className="c-num">
                    <span>{rupee(it.price * it.qty)}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="od__sums">
          <div className="od__box od__box--sum">
            <div>
              <span>{" Discount"}</span>
              <b>{` ${rupee(d.discount)}`}</b>
            </div>
            <div>
              <span>{" Delivery"}</span>
              <b>{` ${rupee(d.delivery)}`}</b>
            </div>
          </div>
          <div className="od__box od__box--sum">
            <div>
              <span>Subtotal</span>
              <b>{` ${rupee(d.subtotal)}`}</b>
            </div>
            <div>
              <span>
                <strong>Total</strong>
              </span>
              <b>
                <strong>{` ${rupee(d.total)}`}</strong>
              </b>
            </div>
          </div>
        </div>

        {/* phones: plain Order Summary list (desktop keeps the two boxes above) */}
        <div className="od__sec od__summary">
          <h2>Order Summary</h2>
          <dl className="od__sumlist">
            <div>
              <dt>Subtotal</dt>
              <dd>{rupeeIN(d.subtotal)}</dd>
            </div>
            {d.discount > 0 && (
              <div>
                <dt>Discount</dt>
                <dd>-{rupeeIN(d.discount)}</dd>
              </div>
            )}
            <div className="od__sumship">
              <dt>Shipping</dt>
              <dd>{d.delivery > 0 ? rupeeIN(d.delivery) : "Free"}</dd>
            </div>
          </dl>
          <div className="od__sumtotal">
            <span>Total</span>
            <span>{rupeeIN(d.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
