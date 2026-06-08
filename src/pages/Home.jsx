import '../styles/dashboard-hero.css';
import { getActiveAcademyCatalog } from '../academies/catalog.js';
import AcademyHero from '../components/AcademyHero.jsx';
import AcademyPaths from '../components/AcademyPaths.jsx';

export default function Home() {
  const catalog = getActiveAcademyCatalog();
  const academy = catalog.academy;
  const categories = catalog.categories;

  return (
    <div className="learning-dashboard-page dashboard-command-center