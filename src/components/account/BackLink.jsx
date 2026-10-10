import { Link } from "react-router-dom";
import { ArrowBackIcon } from "./AccountIcons.jsx";

// Round back arrow shown on phones (hidden on desktop by CSS). `className` picks the page's own style.
export default function BackLink({
  className = "orders__back",
  to = "/account",
  label = "Back to my account",
}) {
  return (
    <Link to={to} className={className} aria-label={label}>
      <ArrowBackIcon />
    </Link>
  );
}

// Phones only: back arrow + page title
export function MobileHead({ title }) {
  return (
    <div className="acc-mobilehead">
      <BackLink />
      <h1 className="account__title">{title}</h1>
    </div>
  );
}
