import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import CollectionPage from "./pages/CollectionPage.jsx";
import AccountLayout from "./components/account/AccountLayout.jsx";

const ProfilePage = lazy(() => import("./pages/account/ProfilePage.jsx"));
const OrdersPage = lazy(() => import("./pages/account/OrdersPage.jsx"));
const OrderDetailsPage = lazy(
  () => import("./pages/account/OrderDetailsPage.jsx"),
);
const WishlistPage = lazy(() => import("./pages/account/WishlistPage.jsx"));
const AddressesPage = lazy(() => import("./pages/account/AddressesPage.jsx"));
const ProductDetailsPage = lazy(() => import("./pages/ProductDetailsPage.jsx"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage.jsx"));
const AccountMenu = lazy(() => import("./pages/account/AccountMenu.jsx"));

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/account" element={<AccountLayout />}>
            <Route index element={<AccountMenu />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:key" element={<OrderDetailsPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="addresses" element={<AddressesPage />} />
          </Route>
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
