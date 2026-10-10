import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useLoginModal } from "../context/LoginModalContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { getUser } from "../lib/auth.js";
import { placeOrder } from "../lib/orders.js";
import { small } from "../lib/images.js";
import "../styles/checkout.css";
import {
  getAddresses,
  getDefaultAddress,
  formatAddress,
  STATES,
} from "../lib/addresses.js";
import { rupee } from "../lib/format.js";
import { ChevronDownIcon } from "../components/Icons.jsx";
import ChooseAddressPopup from "../components/account/ChooseAddressPopup.jsx";

const BasketIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#111"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 8h18l-1.5 11a2 2 0 0 1-2 1.7H6.5a2 2 0 0 1-2-1.7L3 8Z" />
    <path d="M8 8V6a4 4 0 0 1 8 0v2" />
  </svg>
);

// chevron used by the "Order summary" toggle (up when open, down when closed)
const ChevronBack = ({ open }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 512 512"
    fill="none"
    stroke="#111"
    strokeWidth="48"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ transform: open ? "rotate(90deg)" : "rotate(-90deg)" }}
  >
    <path d="M328 112L184 256l144 144" />
  </svg>
);

const Field = ({ className = "", ...props }) => (
  <input
    className={`co-input ${className}`}
    aria-label={props.placeholder}
    {...props}
  />
);

const Select = ({ value, onChange, options, label }) => (
  <div className="co-input co-select">
    <select value={value} onChange={onChange} aria-label={label}>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
    <ChevronDownIcon size={16} strokeWidth={2} className="co-chev" aria-hidden="true" />
  </div>
);

const errStyle = { color: "#c0392b", fontSize: 12, margin: "4px 0 0" };

// Checkout - opened by "Proceed to Checkout". "Pay now" places the order and opens My Orders.
// Rendered OUTSIDE <Layout/>, it has its own header + footer.
export default function CheckoutPage() {
  const { items, subtotal, clear, openCart } = useCart();
  const navigate = useNavigate();
  const { openLogin } = useLoginModal();
  const placedRef = useRef(false); // stops the "empty cart" redirect after a successful order

  const [f, setF] = useState({
    contact: "",
    first: "",
    last: "",
    line: "",
    apt: "",
    city: "",
    state: "Karnataka",
    pincode: "",
    country: "India",
    phone: "",
  });
  const [pay, setPay] = useState("");
  const [errors, setErrors] = useState({});
  const [sumOpen, setSumOpen] = useState(false); // phones: "Order summary" opens / closes
  const [saved] = useState(getAddresses); // saved addresses (Account > Saved Address)
  const [addrId, setAddrId] = useState(() => getDefaultAddress()?.id ?? null); // null = type one in
  const [choosing, setChoosing] = useState(false);
  const chosen = saved.find((a) => a.id === addrId) || null;

  const set = (k) => (e) => setF((c) => ({ ...c, [k]: e.target.value }));
  const setDigits = (k, max) => (e) =>
    setF((c) => ({
      ...c,
      [k]: e.target.value.replace(/\D/g, "").slice(0, max),
    }));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // signed-in user: the "Login" link is hidden once someone is logged in
  const [user, setUser] = useState(getUser);
  useEffect(() => {
    const sync = () => setUser(getUser());
    window.addEventListener("sozokyu-auth", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("sozokyu-auth", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // logged in -> show their phone number / email in the Contact field
  useEffect(() => {
    if (!user) return;
    const value = user.identifier || user.email || "";
    setF((c) => (c.contact ? c : { ...c, contact: value }));
  }, [user]);

  // nothing in the cart -> nothing to check out
  if (!items.length && !placedRef.current) {
    return <Navigate to="/collection" replace />;
  }

  const tax = (subtotal * 74.82) / 1899; // Figma shows "Including ₹74.82 in taxes" for ₹1,899

  const validate = () => {
    const e = {};
    if (!f.contact.trim()) e.contact = "Enter your email or phone number";
    if (!chosen) {
      if (!f.first.trim()) e.first = "Enter first name";
      // last name is optional
      if (!f.line.trim()) e.line = "Enter your address";
      if (!f.city.trim()) e.city = "Enter city";
      if (!/^\d{6}$/.test(f.pincode))
        e.pincode = "Enter a valid 6-digit PIN code";
      if (!/^\d{10}$/.test(f.phone))
        e.phone = "Enter a valid 10-digit phone number";
    }
    if (!pay) e.pay = "Select a payment method";
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;

    // snapshot of the delivery address (same shape the Order Details page expects)
    const address = chosen
      ? {
          name: chosen.name,
          phone: chosen.phone,
          line: chosen.line,
          city: chosen.city,
          pincode: chosen.pincode,
        }
      : {
          name: [f.first, f.last]
            .map((s) => s.trim())
            .filter(Boolean)
            .join(" "),
          phone: f.phone,
          line: [f.line.trim(), f.apt.trim()].filter(Boolean).join(", "),
          city: f.city.trim(),
          pincode: f.pincode,
        };
    placeOrder(items, address); // save the order
    placedRef.current = true;
    clear(); // empty the cart
    navigate("/account/orders", { replace: true }); // open My Orders
  };

  const Err = ({ k }) =>
    errors[k] ? <p style={errStyle}>{errors[k]}</p> : null;

  return (
    <div className="co">
      <header className="co-top">
        <Link to="/" className="co-logo" aria-label="Sozokyu home">
          SOZOKYU
        </Link>
        <button
          type="button"
          className="co-cartbtn"
          aria-label="Cart"
          onClick={openCart}
        >
          <BasketIcon />
        </button>
      </header>

      <main className="co-main">
        <form className="co-form" onSubmit={submit} noValidate>
          <section className="co-sec">
            <div className="co-sechead">
              <h2>Contact</h2>
              {!user && (
                <button
                  type="button"
                  className="co-link"
                  onClick={() => openLogin()}
                >
                  Login
                </button>
              )}
            </div>
            <Field
              placeholder="Email or phone number"
              autoComplete="email"
              value={f.contact}
              onChange={set("contact")}
            />
            <Err k="contact" />
          </section>

          <section className="co-sec co-sec--delivery">
            {saved.length > 0 ? (
              <div className="co-sechead">
                <h2>Delivery</h2>
                <button
                  type="button"
                  className="co-link co-link--sm"
                  onClick={() => setChoosing(true)}
                >
                  {chosen ? "Change" : "Saved addresses"}
                </button>
              </div>
            ) : (
              <h2>Delivery</h2>
            )}

            {chosen ? (
              <div className="addr__card is-default">
                <div className="addr__row">
                  <p className="addr__name">{chosen.name}</p>
                  {chosen.isDefault && (
                    <span className="addr__badge">
                      <span>Default</span>
                    </span>
                  )}
                </div>
                <p className="addr__text">
                  {formatAddress(chosen)}
                  <br />
                  +91 {chosen.phone}
                </p>
              </div>
            ) : (
              <>
                <div className="co-row">
                  <div>
                    <Field
                      placeholder="First name"
                      autoComplete="given-name"
                      value={f.first}
                      onChange={set("first")}
                    />
                    <Err k="first" />
                  </div>
                  <div>
                    <Field
                      placeholder="Last name (optional)"
                      autoComplete="family-name"
                      value={f.last}
                      onChange={set("last")}
                    />
                  </div>
                </div>
                <Field
                  placeholder="Address"
                  autoComplete="address-line1"
                  value={f.line}
                  onChange={set("line")}
                />
                <Err k="line" />
                <Field
                  placeholder="Apartment, suite, etc. (optional)"
                  autoComplete="address-line2"
                  value={f.apt}
                  onChange={set("apt")}
                />
                <div className="co-row">
                  <div>
                    <Field
                      placeholder="City"
                      autoComplete="address-level2"
                      value={f.city}
                      onChange={set("city")}
                    />
                    <Err k="city" />
                  </div>
                  <Select
                    label="State"
                    value={f.state}
                    onChange={set("state")}
                    options={STATES}
                  />
                  <div>
                    <Field
                      placeholder="PIN code"
                      inputMode="numeric"
                      maxLength={6}
                      autoComplete="postal-code"
                      value={f.pincode}
                      onChange={setDigits("pincode", 6)}
                    />
                    <Err k="pincode" />
                  </div>
                </div>
                <Select
                  label="Country"
                  value={f.country}
                  onChange={set("country")}
                  options={["India"]}
                />
                <Field
                  placeholder="Phone Number"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  autoComplete="tel-national"
                  value={f.phone}
                  onChange={setDigits("phone", 10)}
                />
                <Err k="phone" />
              </>
            )}
          </section>

          <section className="co-sec">
            <h2>Shipping Method</h2>
            <p className="co-note co-note--info">
              <svg
                className="co-note__icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9.5" />
                <path d="M12 11v5.5" />
                <circle cx="12" cy="7.6" r="0.6" fill="currentColor" />
              </svg>
              <span>
                Enter your shipping address to view available shipping method
              </span>
            </p>
          </section>

          <section className="co-sec">
            <div className="co-paytitle">
              <h2>Payment</h2>
              <p>All transactions are secure and encrypted.</p>
            </div>
            <div
              className="co-paybox"
              role="radiogroup"
              aria-label="Payment method"
            >
              <label className="co-payrow co-payrow--top">
                <input
                  type="radio"
                  name="pay"
                  checked={pay === "razorpay"}
                  onChange={() => setPay("razorpay")}
                />
                <span className="co-radio" />
                <span className="co-paytext">
                  Razorpay Secure (UPI, Card, Int'l Card, Apple Pay)
                </span>
                <span className="co-cards" aria-hidden="true">
                  <span className="co-card co-card--upi">
                    UPI<i>▸</i>
                  </span>
                  <span className="co-card co-card--visa">VISA</span>
                  <span className="co-card co-card--mc">
                    <b />
                    <b />
                  </span>
                  <span className="co-card co-card--more">+17</span>
                </span>
              </label>
              <label className="co-payrow">
                <input
                  type="radio"
                  name="pay"
                  checked={pay === "cod"}
                  onChange={() => setPay("cod")}
                />
                <span className="co-radio" />
                <span className="co-paytext">Cash on Delivery (COD)</span>
              </label>
            </div>
            <Err k="pay" />
          </section>

          <button type="submit" className="co-pay">
            {pay === "cod" ? "Place order" : "Pay now"}
          </button>
        </form>

        <aside className={`co-summary ${sumOpen ? "" : "is-closed"}`}>
          {/* phones only (hidden on desktop by CSS) */}
          <button
            type="button"
            className="co-sumhead"
            aria-expanded={sumOpen}
            onClick={() => setSumOpen((o) => !o)}
          >
            <span className="co-sumhead__l">
              Order summary <ChevronBack open={sumOpen} />
            </span>
            <span className="co-sumhead__total">{rupee(subtotal)}</span>
          </button>

          <div className="co-sumbody">
            <div className="co-items">
              {items.map((it) => (
                <article className="co-item" key={it.key}>
                  <div className="co-item__img">
                    <img src={small(it.image)} alt="" />
                  </div>
                  <div className="co-item__info">
                    <div className="co-item__txt">
                      <p className="co-item__sku">{`SZ-${String(it.id).padStart(5, "0")}`}</p>
                      <p className="co-item__name">{it.name}</p>
                    </div>
                    <p className="co-item__price">
                      <small>{it.qty} x</small> {rupee(it.price)}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* discount, lines and total stay exactly as they are below */}

            <div className="co-discount">
              <input
                className="co-discount__in"
                placeholder="Discount code or gift card"
                aria-label="Discount code or gift card"
              />
              <button type="button" className="co-apply">
                Apply
              </button>
            </div>

            <dl className="co-lines">
              <div>
                <dt>Subtotal</dt>
                <dd>{rupee(subtotal)}</dd>
              </div>
              <div>
                <dt>Shipping</dt>
                <dd className="co-lines__muted">Enter shipping address</dd>
              </div>
            </dl>

            <div className="co-total">
              <div className="co-total__row">
                <span>Total</span>
                <span>{rupee(subtotal)}</span>
              </div>
              <p>Including ₹{tax.toFixed(2)} in taxes</p>
            </div>
          </div>
        </aside>
      </main>

      {choosing && (
        <ChooseAddressPopup
          addresses={saved}
          selectedId={addrId}
          onSelect={(id) => {
            setAddrId(id);
            setChoosing(false);
          }}
          onCancel={() => setChoosing(false)}
        />
      )}

      <footer className="co-foot">
        <span>© Sozokyu 2026 | All Rights reserved</span>
        <span className="co-foot__r">
          Designed &amp; built by <u>SOZOQ</u>
        </span>
      </footer>
    </div>
  );
}
