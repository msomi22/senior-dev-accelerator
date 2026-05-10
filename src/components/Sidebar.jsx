import { NavLink } from 'react-router-dom';
import BuyCoffeeButton from './BuyCoffeeButton.jsx';
import { categories } from '../services/questionBankService.js';

export default function Sidebar() {
  const featured = categories.filter((category) => category.featured !== false).slice(0, 6);

  return (
    <aside className="sidebar glass">
      <p className="eyebrow">Accelerator</p>
      <NavLink to="/">Dashboard</NavLink>
      {featured.map((category) => (
        <NavLink key={category.id} to={category.route || `/category/${category.id}`}>
          {category.shortName || category.name}
        </NavLink>
      ))}
      <NavLink to="/random">Random Question</NavLink>
      <NavLink to="/progress">Progress</NavLink>
      <BuyCoffeeButton />
    </aside>
  );
}
