import { small } from "../lib/images.js";

export default function CartToast({ toast, onClose, onView }) {
  if (!toast) return null;
  return (
    <div className="toast" role="status" aria-live="polite" key={toast.id}>
      <img className="toast__img" src={small(toast.image)} alt="" />
      <div className="toast__text">
        <p className="toast__title">Added to cart</p>
        <p className="toast__sub">
          {toast.name} · Size {toast.size}
        </p>
      </div>
      <button type="button" className="toast__link" onClick={onView}>
        View cart
      </button>
      <button
        type="button"
        className="toast__close"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}
