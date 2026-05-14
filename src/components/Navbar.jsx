import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import BuyCoffeeButton from './BuyCoffeeButton.jsx';
import GlobalSearch from './GlobalSearch.jsx';
import { usePreferences } from '../hooks/usePreferences.js';
import { categories } from '../services/questionBankService.js';

function pageTitle(pathname) {
  if (pathname === '/') return 'Learning Dashboard';
  if (pathname === '/dsa') return 'DSA Practice';
  if (pathname === '/system-design') return 'System Design';
  if (pathname === '/random') return 'Random Practice';
  if (pathname === '/progress') return 'Progress';
  if (pathname.startsWith('/problem/')) return 'Focused Problem';

  const categoryMatch = pathname.match(/^\/category\/([^/]+)/);
  if (categoryMatch) {
    const category = categories.find((item) => item.id === categoryMatch[1]);
    return category?.name || 'Category Practice';
  }

  return 'Senior Dev Accelerator';
}

function categoryPath(category) {
  if (category.id === 'dsa') return '/dsa';
  if (category.id === 'system') return '/system-design';
  return category.route || `/category/${category.id}`;
}

function FeaturedLinks({ onNavigate }) {
  const featured = categories
    .filter((category) => category.featured !== false)
    .slice(0, 2);

  return (
    <>
      {featured.map((category) => (
        <NavLink
          key={category.id}
          to={categoryPath(category)}
          onClick={onNavigate}
        >
          {category.shortName || category.name}
        </NavLink>
      ))}

      <NavLink to="/random" onClick={onNavigate}>Random</NavLink>
      <NavLink to="/progress" onClick={onNavigate}>Progress</NavLink>
    </>
  );
}

export default function Navbar() {
  const { theme, setTheme } = usePreferences();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className="nav topbar">
        <span className="topbar-title">{pageTitle(location.pathname)}</span>

        <GlobalSearch />

        <nav className="topbar-links" aria-label="Primary">
          <FeaturedLinks />
        </nav>

        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-controls="mobile-primary-navigation"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <button
          className="icon-btn"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </header>

      <nav
        id="mobile-primary-navigation"
        className={`mobile-nav-panel ${mobileMenuOpen ? 'is-open' : ''}`}
        aria-label="Mobile primary"
        aria-hidden={!mobileMenuOpen}
      >
        <FeaturedLinks onNavigate={() => setMobileMenuOpen(false)} />
        <BuyCoffeeButton className="mobile-coffee-link" />
      </nav>
    </>
  );
}
