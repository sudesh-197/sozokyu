import { ConfirmPopup } from "./Popup.jsx";
import { createIcon } from "../Icons.jsx";

const TrashIcon = createIcon(
  <>
    <path d="M3 6h18" />
    <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
  </>,
  24,
);

// Delete-address confirmation popup (same design as the Logout popup, with a dustbin icon)
export default function DeleteAddressPopup({ onCancel, onConfirm }) {
  return (
    <ConfirmPopup
      icon={<TrashIcon color="#BA424B" aria-hidden="true" />}
      title="Delete Address"
      lines={["Are you sure you want to delete this address?", "This action can't be undone."]}
      confirmLabel="Yes, Delete"
      confirmClass="lo__btn--confirm"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
