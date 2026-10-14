import Navbar from "./components/Navbar";
import HomePage from "./HomePage";
import NotFound from "./NotFound";
import About from "./About";
import Benchmarks from "./Benchmarks";
import Theory from "./Theory";
import EarlyAccess from "./EarlyAccess";
import Privacy from "./Privacy";
import "./index.css";

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import TutorialLanding from "./TutorialLanding";
import Tutorial0_Intro from "./components/tutorials/Tutorial0_Intro";
import Tutorial1_Beginning from "./components/tutorials/Tutorial1_Beginning";
import SplashScreen from "./components/SplashScreen";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const target = hash && document.getElementById(hash.slice(1));
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}

      <div style={{ position: "relative", zIndex: 1 }}>
        <BrowserRouter basename="/">
          <ScrollToTop />
          <Navbar />

          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-black"
          >
            Skip to content
          </a>

          <main id="main" tabIndex={-1}>
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
          </main>
        </BrowserRouter>
      </div>
    </>
  );
}
