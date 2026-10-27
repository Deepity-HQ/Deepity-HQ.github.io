import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import '@fontsource-variable/jetbrains-mono'
import './index.css'
// Site-wide styles and fonts; imported here so no page depends on the home chunk
import './App.css'
import SiteLayout from './Components/SiteLayout.tsx'

// Each page is its own chunk, so the 3D engine only downloads on the home page
const App = lazy(() => import('./App.tsx'))
const About = lazy(() => import('./pages/About.tsx'))
const TutorialLanding = lazy(() => import('./pages/TutorialLanding.tsx'))
const TutorialIntro = lazy(() => import('./pages/TutorialIntro.tsx'))
const TutorialBeginning = lazy(() => import('./pages/TutorialBeginning.tsx'))
const Benchmarks = lazy(() => import('./pages/Benchmarks.tsx'))
const Theory = lazy(() => import('./pages/Theory.tsx'))
const Privacy = lazy(() => import('./pages/Privacy.tsx'))
const EarlyAccess = lazy(() => import('./pages/EarlyAccess.tsx'))
const NotFound = lazy(() => import('./pages/NotFound.tsx'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SiteLayout>
        <Suspense fallback={<div className="min-h-screen" />}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<About />} />
          <Route path="/tutorial" element={<TutorialLanding />} />
          <Route path="/tutorial/0-introduction" element={<TutorialIntro />} />
          <Route path="/tutorial/1-beginning" element={<TutorialBeginning />} />
          <Route path="/benchmarks" element={<Benchmarks />} />
          <Route path="/theory" element={<Theory />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/early-access" element={<EarlyAccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </SiteLayout>
    </BrowserRouter>
  </StrictMode>,
)
