import { Link } from 'react-router-dom';

export default function CategoryHub({ categories = [], loading = false }) {
  if (loading) {
    return (
      <section className="category-hub glass">
        <p className="eyebrow">Learning library</p>
        <h2>Loading categories…</h2>
      </section>
    );
  }

  return (
    <section className="category-hub glass">
      <div className="section-head compact-head">
        <div>
          <p className="eyebrow">Learning library</p>
          <h2>Choose a category</h2>
          <p>Built to scale cleanly even when the library grows to dozens of categories.</p>
        </div>
      </div>

      <div className="category-grid">
        {categories.map((category) => (
          <Link className="category-card" to={category.route || `/category/${category.id}`} key={category.id}>
            <span className="eyebrow">{category.topicCount ?? 0} topics</span>
            <strong>{category.name}</strong>
            <p>{category.description}</p>
            <small>{category.quizCount ?? 0} real questions</small>
          </Link>
        ))}
      </div>
    </section>
  );
}
