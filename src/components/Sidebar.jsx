import { Link, NavLink } from 'react-router-dom';
import BuyCoffeeButton from './BuyCoffeeButton.jsx';
import { categories } from '../services/questionBankService.js';

const ICON_PATHS = {
  dashboard: (
    <>
      <path d="M4 4h6v6H4z" />
      <path d="M14 4h6v6h-6z" />
      <path d="M4 14h6v6H4z" />
      <path d="M14 14h6v6h-6z" />
    </>
  ),
  dsa: (
    <>
      <path d="M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2z" />
      <path d="M8 8h8" />
      <path d="M8 12h6" />
      <path d="M7 20V6a2 2 0 0 1 2-2" />
    </>
  ),
  system: (
    <>
      <circle cx="12" cy="5" r="3" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="M10.7 7.7 7.3 15.3" />
      <path d="M13.3 7.7 16.7 15.3" />
      <path d="M9 18h6" />
    </>
  ),
  random: (
    <>
      <path d="M16 3h5v5" />
      <path d="M4 20 21 3" />
      <path d="M21 16v5h-5" />
      <path d="M15 15 21 21" />
      <path d="M4 4l5 5" />
    </>
  ),
  progress: (
    <>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="m7 15 3-4 4 3 5-8" />
      <path d="M17 6h2v2" />
    </>
  ),
  category: (
    <>
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </>
  )
};

function NavIcon({ name }) {
  return (
    <svg
      className="nav-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {ICON_PATHS[name] || ICON_PATHS.category}
    </svg>
  );
}

function categoryPath(category) {
  if (category.id === 'dsa') return '/dsa';
  if (category.id === 'system') return '/system-design';
  return category.route || `/category/${category.id}`;
}

function categoryIcon(category) {
  if (category.id === 'dsa') return 'dsa';
  if (category.id === 'system') return 'system';
  return 'category';
}

function NavItem({ to, icon, children }) {
  const navClass = ({ isActive }) => `nav-item ${isActive ? 'active' : ''}`.trim();

  return (
    <NavLink to={to} className={navClass}>
      <NavIcon name={icon} />
      <span className="nav-text">{children}</span>
    </NavLink>
  );
}

export default function Sidebar() {
  const featured = categories.filter((category) => category.featured !== false).slice(0, 6);

  return (
    <aside className="sidebar app-sidebar">
      <Link to="/" className="sidebar-logo" aria-label="Senior Dev Accelerator dashboard">
        <img
          className="brand-logo brand-logo-light"
          src="/brand-logo-light.svg"
          alt="Senior Dev Accelerator"
        />
        <img
          className="brand-logo brand-logo-dark"
          src="/brand-logo-dark.svg"
          alt=""
          aria-hidden="true"
        />
      </Link>

      <div className="nav-section">
        <p className="nav-label">Learn</p>
        <NavItem to="/" icon="dashboard">Dashboard</NavItem>
        {featured.map((category) => (
          <NavItem
            key={category.id}
            to={categoryPath(category)}
            icon={categoryIcon(category)}
          >
            {category.shortName || category.name}
          </NavItem>
        ))}
      </div>

      <div className="nav-section">
        <p className="nav-label">Practice</p>
        <NavItem to="/random" icon="random">Random Question</NavItem>
        <NavItem to="/progress" icon="progress">Progress</NavItem>
      </div>

      <div className="sidebar-spacer" />

      <BuyCoffeeButton className="nav-item coffee-link" />
    </aside>
  );
}
