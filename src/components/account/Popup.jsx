import useEscapeKey from "../../hooks/useEscapeKey.js";

// Overlay + dialog shared by every confirmation popup. Escape or a click outside calls onCancel.
export default function Popup({ onCancel, className = "lo", children }) {
  useEscapeKey(onCancel);
  return (
    <div className="lo-overlay" onClick={onCancel}>
      <div
        className={className}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lo-title"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

// Icon + two-line message + Cancel / confirm buttons (Logout, Delete address, Change default).
export function ConfirmPopup({
  icon,
  neutral = false,
  title,
  lines,
  confirmLabel,
  confirmClass,
  onCancel,
  onConfirm,
}) {
  return (
    <Popup onCancel={onCancel}>
      <div className="lo__top">
        <div className={`lo__icon${neutral ? " lo__icon--neutral" : ""}`}>
          {icon}
        </div>
        <div className="lo__text">
          <h2 id="lo-title">{title}</h2>
          <p>
            {lines[0]}
            <br />
            {lines[1]}
          </p>
        </div>
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
          className={`lo__btn ${confirmClass}`}
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </Popup>
  );
}
