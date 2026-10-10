import { ConfirmPopup } from "./Popup.jsx";
import { createIcon } from "../Icons.jsx";

const PinIcon = createIcon(
  <>
    <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </>,
  24,
);

// "Change default address?" confirmation popup (same design as the Logout / Delete popups)
export default function ChangeDefaultPopup({ onCancel, onConfirm }) {
  return (
    <ConfirmPopup
      neutral
      icon={<PinIcon aria-hidden="true" />}
      title="Change Default Address"
      lines={["Do you want to change the default address?", "It will be used first at checkout."]}
      confirmLabel="Yes, Change"
      confirmClass="lo__btn--dark"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
