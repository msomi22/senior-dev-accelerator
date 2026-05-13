import { NavLink, useLocation } from 'react-router-dom';
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

export default function Navbar() {
  const { theme, setTheme } = usePreferences();
  const location = useLocation();
  const featured = categories
    .filter((category) => category.featured !== false)
    .slice(0, 2);

  return (
    <header className="nav topbar">
      <span className="topbar-title">{pageTitle(location.pathname)}</span>

      <nav className="topbar-links" aria-label="Primary">
        {featured.map((category) => (
          <NavLink
            key={category.id}
            to={categoryPath(category)}
          >
            {category.shortName || category.name}
          </NavLink>
        ))}

        <NavLink to="/random">Random</NavLink>
        <NavLink to="/progress">Progress</NavLink>
      </nav>

      <button
        className="icon-btn"
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? 'Light' : 'Dark'}
      </button>
    </header>
  );
}
