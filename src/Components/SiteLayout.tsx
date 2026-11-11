import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router";
import DocsChooser from "./DocsChooser.tsx";
import Navbar from "./Navbar.tsx";
import Footer from "./Footer.tsx";
import usePageMeta from "./usePageMeta.ts";

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
  usePageMeta();

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <DocsChooser />
      <main>{children}</main>
      <Footer />
    </>
  );
}
