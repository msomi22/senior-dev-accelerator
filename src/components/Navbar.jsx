import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import GlobalSearch from './GlobalSearch.jsx';
import { usePreferences } from '../hooks/usePreferences.js';
import { categories } from '../services/questionBankService.js';
import '../styles/brand.css';

function pageTitle(pathname) {
  if (pathname === '/') return 'Learning Dashboard';
  if (pathname === '/dsa') return 'DSA Practice';
  if (pathname === '/system-design') return 'System Design';
  if (pathname === '/random') return 'Random Practice';
  if (pathname === '/progress') return 'Progress';
  if (pathname.startsWith('/problem/')) return 'Focused Problem';

  return 'Senior Dev Accelerator';
}

function categoryPath(category) {
  if (category.id === 'dsa') return '/dsa';
  if (category.id === 'system') return '/system-design';
  return category.route || `/category/${category.id}`;
}

function NavLinks({ featured, onNavigate }) {
  return (
    <>
      {featured.map((category) => (
        <NavLink key={category.id} to={categoryPath(category)} onClick={onNavigate}>
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
  const featured = categories.filter((category) => category.featured !== false).slice(0, 2);

  return (
    <header className="nav topbar glass">
      <div className="topbar-primary-row">
        <button
          type="button"
          className="mobile-nav-toggle"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileMenuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <NavLink to="/" className="brand" onClick={() => setMobileMenuOpen(false)}>
          <img
            src={theme === 'dark' ? '/brand-logo-dark.svg' : '/brand-logo-light.svg'}
            alt="Senior Dev Accelerator"
            className="brand-logo"
          />
          <span className="brand-text-fallback">Senior Dev Accelerator</span>
        </NavLink>

        <span className="topbar-title">{pageTitle(location.pathname)}</span>

        <button
          type="button"
          className="icon-btn"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>

      <div className="topbar-search-row">
        <GlobalSearch />
      </div>

      <nav
        className="mobile-menu-links"
        aria-label="Mobile navigation"
        style={{ display: mobileMenuOpen ? 'flex' : 'none' }}
      >
        <NavLinks featured={featured} onNavigate={() => setMobileMenuOpen(false)} />
      </nav>

      <nav className="topbar-links desktop-topbar-links" aria-label="Primary">
        <NavLinks featured={featured} />
      </nav>
    </header>
  );
}
