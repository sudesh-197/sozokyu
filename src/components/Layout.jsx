import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

export default function Layout() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <div className="page">
      <Header />
      <div className="frame"><Suspense fallback={null}><Outlet /></Suspense></div>
      <Footer />
    </div>
  );
}
