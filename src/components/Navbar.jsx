import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import GlobalSearch from './GlobalSearch.jsx';
import { usePreferences } from '../hooks/usePreferences.js';
import { categories } from '../services/questionBankService.js';

const MOBILE_NAV_ITEMS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/dsa', label: 'Categories' },
  { to: '/recent', label: 'Recent' },
  { to: '/progress', label: 'Progress' },
  { to: '/settings', label: 'Settings' }
];

function pageTitle(pathname) {
  if (pathname === '/') return 'Learning Dashboard';
  if (pathname === '/dsa') return 'DSA Practice';
  if (pathname === '/system-design') return 'System Design';
  if (pathname === '/random') return 'Random Practice';
  if (pathname === '/recent') return 'Recent';
  if (pathname === '/progress') return 'Progress';
  if (pathname === '/settings') return 'Settings';
  if (pathname.startsWith('/problem/')) return 'Focused Problem';

  const categoryMatch = pathname.match(/^\/category\/([^/]+)/);
  if (categoryMatch) {
    const category = categories.find((item) => item.id === categoryMatch[1]);
    return category?.name || 'Category Practice';
  }

  return 'Senior Dev Accelerator';
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
        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav-panel"
          onClick={() => setMobileMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>

        <span className="topbar-title">{pageTitle(location.pathname)}</span>

        <GlobalSearch />

        <button
          className="icon-btn"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </header>

      <nav
        id="mobile-nav-panel"
        className={`mobile-nav-panel ${mobileMenuOpen ? 'is-open' : ''}`}
        aria-label="Mobile navigation"
      >
        {MOBILE_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
