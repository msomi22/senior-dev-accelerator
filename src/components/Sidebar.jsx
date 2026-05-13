import { NavLink } from 'react-router-dom';
import BuyCoffeeButton from './BuyCoffeeButton.jsx';
import { categories } from '../services/questionBankService.js';

function categoryPath(category) {
  if (category.id === 'dsa') return '/dsa';
  if (category.id === 'system') return '/system-design';
  return category.route || `/category/${category.id}`;
}

export default function Sidebar() {
  const featured = categories.filter((category) => category.featured !== false).slice(0, 6);
  const navClass = ({ isActive }) => `nav-item ${isActive ? 'active' : ''}`.trim();

  return (
    <aside className="sidebar app-sidebar">
      <div className="nav-section">
        <p className="nav-label">Learn</p>
        <NavLink to="/" className={navClass}>Dashboard</NavLink>
        {featured.map((category) => (
          <NavLink
            key={category.id}
            to={categoryPath(category)}
            className={navClass}
          >
            {category.shortName || category.name}
          </NavLink>
        ))}
      </div>

      <div className="nav-section">
        <p className="nav-label">Practice</p>
        <NavLink to="/random" className={navClass}>Random Question</NavLink>
        <NavLink to="/progress" className={navClass}>Progress</NavLink>
      </div>

      <div className="sidebar-spacer" />

      <BuyCoffeeButton className="nav-item coffee-link" />
    </aside>
  );
}
