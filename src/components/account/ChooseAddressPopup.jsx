import Popup from "./Popup.jsx";
import { formatAddress } from "../../lib/addresses.js";

// Checkout: pick one of the saved addresses (or switch to typing a different one)
export default function ChooseAddressPopup({
  addresses,
  selectedId,
  onSelect,
  onCancel,
}) {
  return (
    <Popup onCancel={onCancel} className="lo lo--wide">
      <div className="lo__text">
        <h2 id="lo-title">Choose Delivery Address</h2>
        <p>Select where this order should be delivered.</p>
      </div>

      <div className="lo__list">
        {addresses.map((a) => (
          <button
            type="button"
            key={a.id}
            className={`addr__card lo__opt${a.id === selectedId ? " is-default" : ""}`}
            onClick={() => onSelect(a.id)}
          >
            <span className="addr__row">
              <span className="addr__name">{a.name}</span>
              {a.isDefault && (
                <span className="addr__badge">
                  <span>Default</span>
                </span>
              )}
            </span>
            <span className="addr__text">
              {formatAddress(a)}
              <br />
              +91 {a.phone}
            </span>
          </button>
        ))}
      </div>

      <div className="lo__actions">
        <button
          type="button"
          className="lo__btn lo__btn--cancel"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="lo__btn lo__btn--cancel"
          onClick={() => onSelect(null)}
        >
          Enter a different address
        </button>
      </div>
    </Popup>
  );
}
