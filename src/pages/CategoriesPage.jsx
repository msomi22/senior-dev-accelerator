import CategoryLibrary from '../components/CategoryLibrary.jsx';
import { getCategorySummaries } from '../services/questionBankService.js';
import { usePreferences } from '../hooks/usePreferences.js';

export default function CategoriesPage() {
  const { completed } = usePreferences();
  const categories = getCategorySummaries();

  return (
    <main className="page category-page">
      <section className="page-title">
        <p className="eyebrow">Learning tracks</p>
        <h1>Choose a Learning Track</h1>
        <p>Pick a category to explore focused practice questions, patterns, and system design topics.</p>
      </section>

      <CategoryLibrary
        categories={categories}
        completed={completed}
        title="Available tracks"
      />
    </main>
  );
}
