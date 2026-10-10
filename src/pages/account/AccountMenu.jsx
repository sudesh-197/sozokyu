import { Link, Navigate, useOutletContext } from "react-router-dom";
import { LogoutIcon } from "../../components/account/AccountIcons.jsx";
import useMediaQuery from "../../hooks/useMediaQuery.js";

// "My account" menu for phones (Figma 3332:9460).
// Shown at /account on small screens: Profile / Wishlist / My Orders / Saved Address + Logout.
// On desktop /account still goes straight to Profile (the sidebar is already visible there).
export default function AccountMenu() {
  const isPhone = useMediaQuery("(max-width: 960px)");
  const { links, user, askLogout } = useOutletContext();

  if (!isPhone) return <Navigate to="profile" replace />;

  return (
    <nav className="acc-menu" aria-label="My account">
      <div className="acc-menu__list">
        {links.map(({ to, label, Icon }) => (
          <Link key={to} to={to} className="account__link">
            <Icon />
            {label}
          </Link>
        ))}
      </div>

      {user && (
        <button
          type="button"
          className="account__link account__link--logout"
          onClick={askLogout}
        >
          <LogoutIcon />
          Logout
        </button>
      )}
    </nav>
  );
}
