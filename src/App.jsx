import Navbar from "./components/Navbar";
import HomePage from "./HomePage";
import "./index.css";

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import { metaFor, canonicalFor, normalizePath } from "./routes";
import SplashScreen from "./components/SplashScreen";

const NotFound = lazy(() => import("./NotFound"));
const About = lazy(() => import("./About"));
const Benchmarks = lazy(() => import("./Benchmarks"));
const Theory = lazy(() => import("./Theory"));
const EarlyAccess = lazy(() => import("./EarlyAccess"));
const Privacy = lazy(() => import("./Privacy"));
const TutorialLanding = lazy(() => import("./TutorialLanding"));
const Tutorial0_Intro = lazy(() => import("./components/tutorials/Tutorial0_Intro"));
const Tutorial1_Beginning = lazy(() => import("./components/tutorials/Tutorial1_Beginning"));

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const target = hash && document.getElementById(hash.slice(1));
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function setMeta(selector, attr, value) {
  document.head.querySelector(selector)?.setAttribute(attr, value);
}

function PageMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    const meta = metaFor(pathname);
    const path = normalizePath(pathname);
    document.title = meta.title;
    setMeta('meta[name="description"]', "content", meta.description);
    setMeta('link[rel="canonical"]', "href", canonicalFor(path));
    setMeta('meta[property="og:url"]', "content", canonicalFor(path));
    setMeta('meta[property="og:title"]', "content", meta.ogTitle ?? meta.title);
    setMeta('meta[property="og:description"]', "content", meta.description);
    setMeta('meta[name="twitter:title"]', "content", meta.ogTitle ?? meta.title);
    setMeta('meta[name="twitter:description"]', "content", meta.description);
  }, [pathname]);
  return null;
}

export function Shell() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}

      <div style={{ position: "relative", zIndex: 1 }}>
          <ScrollToTop />
          <PageMeta />
          <Navbar />

          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-black"
          >
            Skip to content
          </a>

          <main id="main" tabIndex={-1}>
            <Suspense fallback={null}>
            <Routes>
              <Route path="" element={<HomePage />} />
              <Route path="/tutorial" element={<TutorialLanding />} />
              <Route
                path="/tutorial/0-introduction"
                element={<Tutorial0_Intro />}
              />
              <Route
                path="/tutorial/1-beginning"
                element={<Tutorial1_Beginning />}
              />
              <Route path="/about" element={<About />} />
              <Route path="/benchmarks" element={<Benchmarks />} />
              <Route path="/theory" element={<Theory />} />
              <Route path="/early-access" element={<EarlyAccess />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/notfound" element={<NotFound variant="construction" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </main>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/">
      <Shell />
    </BrowserRouter>
  );
}
