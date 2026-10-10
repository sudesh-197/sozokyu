import { Link } from "react-router-dom";
import { allOrders } from "../../data/orders.js";
import StatusBadge from "../../components/account/StatusBadge.jsx";
import { BasketIcon } from "../../components/account/AccountIcons.jsx";
import BackLink from "../../components/account/BackLink.jsx";
import { rupee } from "../../lib/format.js";

function Thumb({ thumb }) {
  const { src, w, h, crop } = thumb;
  return (
    <div className="order-item__img">
      <div className="order-item__photo" style={{ width: w, height: h }}>
        <img
          src={src}
          alt=""
          className={crop ? "is-crop" : "is-cover"}
          style={crop}
          loading="lazy"
        />
      </div>
    </div>
  );
}

// back arrow + title (arrow is phones only, hidden on desktop via CSS)
function TitleRow() {
  return (
    <div className="orders__titlerow">
      <BackLink />
      <h1 className="account__title page-title">My Orders</h1>
    </div>
  );
}

// My Orders list (Figma: Cart / My Orders)
export default function OrdersPage() {
  const list = allOrders();
  if (!list.length)
    return (
      <>
        <TitleRow />
        <div className="login-guard">
          <p>You haven't placed any orders yet.</p>
          <Link to="/collection" className="btn-dark">
            Browse the collection
          </Link>
        </div>
      </>
    );
  return (
    <>
      <TitleRow />
      <div className="orders">
        {list.map((o) => (
          <article className="order" key={o.key}>
            <div className="order__body">
              <div className="order__head">
                <div className="order__id">
                  <p className="order__idlabel">Order ID</p>
                  <p className="order__idval">
                    <BasketIcon /> {o.id}
                  </p>
                </div>
                <div className="order__meta">
                  <p className="order__eta">Estimated arrival : {o.eta}</p>
                  <StatusBadge status={o.status} />
                </div>
              </div>

              <div className="order__items">
                {o.items.map((it, i) => (
                  <div className="order-item" key={i}>
                    <Thumb thumb={it.thumb} />
                    <div className="order-item__txt">
                      <div className="order-item__top">
                        <p className="order-item__sku">{it.sku}</p>
                        <p className="order-item__name">{it.name}</p>
                      </div>
                      <p className="order-item__qty">
                        <small>{it.qty} x</small>
                        <b> {rupee(it.price)}</b>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order__foot">
              <p className="order__total">
                Total: {rupee(o.total)}
                <span>
                  {" "}
                  ({o.count} item{o.count === 1 ? "" : "s"})
                </span>
              </p>
              <Link to={`/account/orders/${o.key}`} className="order__details">
                Details
              </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
