import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router";
import Navbar from "./Navbar.tsx";
import Footer from "./Footer.tsx";
import SplashScreen from "./SplashScreen.tsx";
import usePageMeta from "./usePageMeta.ts";

// Site-wide chrome. It wraps whatever page is showing, so the splash screen,
// navbar and footer never depend on a page or route and appear on every one.
// Start each page at the top when navigating between routes
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const target = hash && document.getElementById(hash.slice(1));
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function SiteLayout({ children }: { children: ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  usePageMeta();

  return (
    <>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
      <ScrollToTop />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
