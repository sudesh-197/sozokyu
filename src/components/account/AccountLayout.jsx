import { useState } from "react";
import LogoutPopup from "./LogoutPopup.jsx";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  UserIcon,
  FavouriteIcon,
  BasketIcon,
  LocationIcon,
  LogoutIcon,
} from "./AccountIcons.jsx";
import { getUser, logout } from "../../lib/auth.js";
import { useCart } from "../../context/CartContext.jsx";
import { useLoginModal } from "../../context/LoginModalContext.jsx";

const LINKS = [
  { to: "/account/profile", label: "Profile", Icon: UserIcon },
  { to: "/account/wishlist", label: "Wishlist", Icon: FavouriteIcon },
  { to: "/account/orders", label: "My Orders", Icon: BasketIcon },
  { to: "/account/addresses", label: "Saved Address", Icon: LocationIcon },
];
// Sidebar + content area shared by every "My account" page (Profile / Wishlist / Orders / Addresses)
export default function AccountLayout() {
  const [confirmOut, setConfirmOut] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = getUser();
  const { clear } = useCart();
  const { openLogin } = useLoginModal();
  const guarded =
    !user &&
    ["profile", "orders", "addresses"].includes(pathname.split("/")[2]); // these pages hold personal data
  const atRoot = /^\/account\/?$/.test(pathname); // phones: the account menu page
  const section = atRoot ? "menu" : pathname.split("/")[2] || "profile"; // account--orders, account--addresses ...

  const onLogout = () => {
    logout();
    clear();
    navigate("/", { replace: true });
  };

  return (
    <main className={`account account--${section}`}>
      <aside className="account__nav">
        {LINKS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `account__link${isActive ? " is-active" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon color={isActive ? "#ffffff" : undefined} />
                {label}
              </>
            )}
          </NavLink>
        ))}
        {user && (
          <button
            type="button"
            className="account__link account__link--logout"
            onClick={() => setConfirmOut(true)}
          >
            <LogoutIcon />
            Logout
          </button>
        )}
      </aside>
      <section className="account__body">
        {guarded ? (
          <div className="login-guard">
            <p>Your content will appear here after you log in.</p>
            <button
              type="button"
              className="btn-dark"
              onClick={() => openLogin({ redirectTo: pathname })}
            >
              Log in
            </button>
          </div>
        ) : (
          <Outlet
            key={user?.identifier || "guest"}
            context={{
              links: LINKS,
              user,
              askLogout: () => setConfirmOut(true),
            }}
          />
        )}
      </section>
      {confirmOut && (
        <LogoutPopup
          onCancel={() => setConfirmOut(false)}
          onConfirm={() => {
            setConfirmOut(false);
            onLogout();
          }}
        />
      )}
    </main>
  );
}
