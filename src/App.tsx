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
    <AnimatePresence mode="wait">
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

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <Global styles={globalStyles} />
      {isLoading ? (
        <LoadingScreen
          minDuration={2500}
          onComplete={() => setIsLoading(false)}
        />
      ) : (
        <Router>
          <ScrollToTop />
          <AppLayout />
        </Router>
      )}
    </>
  );
}

export default App;
