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

export default function Navbar(props) {
  const { mobileNavOpen, onToggleMobileNav, onCloseMobileNav } = props;
  const { theme, setTheme } = usePreferences();
  const location = useLocation();

  const featured = categories.filter((category) => category.featured !== false).slice(0, 2);
  const headerClassName = `nav topbar glass ${mobileNavOpen ? 'mobile-menu-open' : 'mobile-menu-closed'}`;

  return (
    <header className={headerClassName}>
      <div className="topbar-primary-row">
        <button
          type="button"
          className="mobile-nav-toggle"
          onClick={onToggleMobileNav}
          aria-label={mobileNavOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileNavOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <NavLink to="/" className="brand" onClick={onCloseMobileNav}>
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

      <div className="topbar-expandable">
        <nav className="topbar-links">
          {featured.map((category) => (
            <NavLink
              key={category.id}
              to={categoryPath(category)}
              onClick={onCloseMobileNav}
            >
              {category.shortName || category.name}
            </NavLink>
          ))}

          <NavLink to="/random" onClick={onCloseMobileNav}>Random</NavLink>
          <NavLink to="/progress" onClick={onCloseMobileNav}>Progress</NavLink>
        </nav>
      </div>
    </header>
  );
}
