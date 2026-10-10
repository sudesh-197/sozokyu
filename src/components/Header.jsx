import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import IconButton from "./IconButton.jsx";
import { useCart } from "../context/CartContext.jsx";
import SearchBox from "./SearchBox.jsx";
import { collectionPath } from "../lib/catalog.js";
import { SearchIcon, BasketIcon, MenuIcon } from "./Icons.jsx";

// header menu -> collection page with that option selected (the sidebar reads the same URL)
const NavPill = ({ to, children }) => (
  <Link to={to} className="pill pill--nav pill--link">
    {children}
  </Link>
);

export default function Header() {
  const { openCart, count } = useCart();
  const [searchOpen, setSearchOpen] = useState(false); // phones: search bar drops down under the header
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const current = pathname === "/collection" ? params : new URLSearchParams();
  const view = (v) => collectionPath(current, "view", v);
  const gender = (g) => collectionPath(current, "gender", g);
  useEffect(() => {
    setSearchOpen(false);
  }, [pathname]);

  return (
    <>
      {/* desktop / large tablet */}
      <header className="header header--desktop">
        <Link to="/" className="logo">
          SOZOKYU
        </Link>

        <nav className="header__group header__group--stretch">
          <NavPill to={view("new")}>New Arrivals</NavPill>
          <NavPill to={view("best")}>Best Seller</NavPill>
        </nav>

        <SearchBox />

        <div className="header__group">
          <NavPill to={gender("men")}>Men</NavPill>
          <NavPill to={gender("women")}>Women</NavPill>
          <IconButton label="Cart" onClick={openCart} badge={count}>
            <BasketIcon />
          </IconButton>
          <IconButton label="Menu" onClick={() => navigate("/account")}>
            <MenuIcon />
          </IconButton>
        </div>
      </header>

      {/* phones / small tablets: logo on the left, search / cart / menu on the right (Figma 3342:428) */}
      <header className="header header--mobile">
        <Link to="/" className="logo-m">
          SOZOKYU
        </Link>
        <div className="header__group">
          <IconButton
            label="Search"
            onClick={() => {
              setSearchOpen((o) => !o);
            }}
          >
            <SearchIcon size={16} />
          </IconButton>
          <IconButton
            label="Cart"
            onClick={() => {
              setSearchOpen(false);
              openCart();
            }}
            badge={count}
          >
            <BasketIcon />
          </IconButton>
          <IconButton
            label="Menu"
            onClick={() => {
              setSearchOpen(false);
              navigate("/account");
            }}
          >
            <MenuIcon />
          </IconButton>
        </div>

        {searchOpen && (
          <div className="mobile-search">
            <SearchBox
              className="search search--mobile"
              autoFocus
              onDone={() => setSearchOpen(false)}
            />
          </div>
        )}
      </header>
    </>
  );
}
