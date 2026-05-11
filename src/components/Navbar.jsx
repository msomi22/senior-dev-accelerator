import { NavLink } from 'react-router-dom';
import { usePreferences } from '../hooks/usePreferences.js';
import { siteConfig } from '../config/siteConfig.js';
import { categories } from '../services/questionBankService.js';

export default function Navbar() {
  const { theme, setTheme } = usePreferences();
  const featured = categories.filter((category) => category.featured !== false).slice(0, 2);

  return (
    <header className="nav glass">
      <NavLink to="/" className="brand">
        <img src="/brand-logo.svg" alt="Senior Dev Accelerator" className="brand-logo" />
      </NavLink>
      <nav>
        {featured.map((category) => (
          <NavLink key={category.id} to={category.route || `/category/${category.id}`}>
            {category.shortName || category.name}
          </NavLink>
        ))}
        <NavLink to="/random">Random</NavLink>
        <NavLink to="/progress">Progress</NavLink>
      </nav>
      <button className="icon-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </header>
  )
}
