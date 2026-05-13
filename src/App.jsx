/*
DECISION: Vite + React + React Router remains the best fit for this version because the product is a fast, static, highly interactive learning platform. This refactor uses route-level lazy loading and topic-level lazy quiz banks, so the dashboard no longer downloads or parses every question upfront. Next.js would be useful later for SSR, auth, payments, or a database-backed CMS; Angular would be stronger for a large enterprise team but heavier for this content-first product.
*/
import { Suspense, lazy, useEffect } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import StatusBar from './components/StatusBar.jsx';
import LoadingCard from './components/LoadingCard.jsx';
import { useContentProtection } from './hooks/useContentProtection.js';
import { usePreferences } from './hooks/usePreferences.js';

const Home = lazy(() => import('./pages/Home.jsx'));
const DSAPage = lazy(() => import('./pages/DSAPage.jsx'));
const SystemDesignPage = lazy(() => import('./pages/SystemDesignPage.jsx'));
const CategoryPage = lazy(() => import('./pages/CategoryPage.jsx'));
const RandomQuestionPage = lazy(() => import('./pages/RandomQuestionPage.jsx'));
const ProgressPage = lazy(() => import('./pages/ProgressPage.jsx'));
const ProblemPage = lazy(() => import('./pages/ProblemPage.jsx'));

function RouteScrollReset({ theme }) {
  const { pathname } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const reset = () => {
      const pageWrap = document.querySelector('.page-wrap');
      const mainContent = document.querySelector('.main-content');

      pageWrap?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      mainContent?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };

    reset();
    const frameId = window.requestAnimationFrame(reset);
    const timeoutId = window.setTimeout(reset, 250);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
    };
  }, [pathname, theme]);

  return null;
}

export default function App() {
  useContentProtection();
  const { theme } = usePreferences();
  return (
    <div className={`app-shell ${theme}`}>
      <RouteScrollReset theme={theme} />
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main className="page-wrap protect-content">
          <Suspense fallback={<LoadingCard label="Loading page…" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dsa" element={<DSAPage />} />
              <Route path="/system-design" element={<SystemDesignPage />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/random" element={<RandomQuestionPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/problem/:questionId" element={<ProblemPage />} />
              <Route path="*" element={<section className="hero-card"><h1>Page not found</h1><p>Use the navigation to continue learning.</p><NavLink className="btn" to="/">Go home</NavLink></section>} />
            </Routes>
          </Suspense>
        </main>
      </div>
      <StatusBar />
    </div>
  );
}
