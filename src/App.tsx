import React, { useState, useEffect, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Global } from '@emotion/react';
import { AnimatePresence } from 'framer-motion';
import { globalStyles } from './styles/globalStyles';
import { NavBar, Footer, LoadingScreen } from './components/common';
import {
  HomePage,
  AboutPage,
  SkillsPage,
  ExperiencePage,
  ProjectsPage,
  ContactPage,
} from './pages';

const SecretPage = React.lazy(() => import('./pages/SecretPage'));

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Animated Routes wrapper
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/secret"
          element={
            <Suspense fallback={<div />}>
              <SecretPage />
            </Suspense>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

// Layout wrapper that hides NavBar/Footer on /secret
const AppLayout = () => {
  const { pathname } = useLocation();
  const isSecret = pathname === '/secret';

  return (
    <>
      {!isSecret && <NavBar />}
      <main>
        <AnimatedRoutes />
      </main>
      {!isSecret && <Footer />}
    </>
  );
};

// The title screen plays once per browser session
const BOOT_KEY = 'portfolio.booted';
const alreadyBooted = () => {
  try {
    return sessionStorage.getItem(BOOT_KEY) === '1';
  } catch {
    return false;
  }
};

function App() {
  const [boot, setBoot] = useState<'title' | 'opening' | 'done'>(() => (alreadyBooted() ? 'done' : 'title'));

  const finishBoot = () => {
    try {
      sessionStorage.setItem(BOOT_KEY, '1');
    } catch {
      // Private mode: the title just plays again next time
    }
    setBoot('done');
  };

  return (
    <>
      <Global styles={globalStyles} />
      {boot !== 'done' && <LoadingScreen onReveal={() => setBoot('opening')} onComplete={finishBoot} />}
      {boot !== 'title' && (
        <Router>
          <ScrollToTop />
          <AppLayout />
        </Router>
      )}
    </>
  );
}

export default App;
