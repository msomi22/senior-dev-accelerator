import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { categoryLibraryConfig } from '../config/categoryLibraryConfig.js';
import { getCategoryWithCounts } from '../services/questionBankService.js';
import { useDebouncedValue } from '../hooks/useDebouncedValue.js';

function CategoryCard({ category }) {
  return (
    <Link className="category-card scalable-category-card phase-one-category-card" to={category.route || `/category/${category.id}`}>
      <div className="category-card-top">
        <span className="eyebrow">{category.domain || 'Learning path'}</span>
        {category.featured ? <small className="featured-badge">Featured</small> : null}
      </div>
      <strong>{category.name}</strong>
      <div className="category-stats-row" aria-label={`${category.name} metadata`}>
        <span>{category.topicCount ?? '…'} topics</span>
        <span>{category.quizCount ?? '…'} questions</span>
        <span>{category.progressPercent ?? 0}% done</span>
      </div>
    </Link>
  );
}

export default function CategoryLibrary({ categories = [], completed = {}, title = 'Category Library' }) {
  const [query, setQuery] = useState('');
  const [domain, setDomain] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [countedCategories, setCountedCategories] = useState({});

  const debouncedQuery = useDebouncedValue(query, categoryLibraryConfig.categorySearchDebounceMs);

  const domains = useMemo(() => {
    const unique = Array.from(new Set(categories.map((category) => category.domain || 'General')));
    return unique.sort((a, b) => a.localeCompare(b));
  }, [categories]);

  const filtered = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLowerCase();

    const base = categories.filter((category) => {
      const matchesDomain = domain === 'all' || (category.domain || 'General') === domain;
      if (!matchesDomain) return false;

      if (!normalizedQuery) return true;

      const haystack = [
        category.name,
        category.shortName,
        category.description,
        category.domain,
        category.id,
        ...(category.tags || [])
      ].filter(Boolean).join(' ').toLowerCase();

      return haystack.includes(normalizedQuery);
    });

    return [...base].sort((a, b) => {
      const aCounts = countedCategories[a.id] || a;
      const bCounts = countedCategories[b.id] || b;

      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'topics') return (bCounts.topicCount || 0) - (aCounts.topicCount || 0);
      if (sortBy === 'questions') return (bCounts.quizCount || 0) - (aCounts.quizCount || 0);
      if (sortBy === 'progress') return (bCounts.progressPercent || 0) - (aCounts.progressPercent || 0);

      const featuredDelta = Number(b.featured === true) - Number(a.featured === true);
      return featuredDelta || a.name.localeCompare(b.name);
    });
  }, [categories, countedCategories, debouncedQuery, domain, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / categoryLibraryConfig.categoriesPerPage));
  const safePage = Math.min(currentPage, totalPages);

  const visibleCategories = useMemo(() => {
    const start = (safePage - 1) * categoryLibraryConfig.categoriesPerPage;
    return filtered.slice(start, start + categoryLibraryConfig.categoriesPerPage);
  }, [filtered, safePage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, domain, sortBy]);

  useEffect(() => {
    let alive = true;
    const missing = visibleCategories.filter((category) => !countedCategories[category.id]);
    if (!missing.length) return () => { alive = false; };

    Promise.all(missing.map((category) => getCategoryWithCounts(category.id, completed)))
      .then((rows) => {
        if (!alive) return;
        setCountedCategories((previous) => {
          const next = { ...previous };
          rows.forEach((row) => { next[row.id] = row; });
          return next;
        });
      });

    return () => { alive = false; };
  }, [visibleCategories, completed, countedCategories]);

  function goToPage(page) {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <section className="category-library glass phase-one-category-library">
      <div className="section-head compact-head">
        <div>
          <p className="eyebrow">Problem library</p>
          <h2>{title}</h2>
          <p>Pick a category, then go straight into focused practice.</p>
        </div>
        <div className="library-count-pill">{filtered.length} categories</div>
      </div>

      <div className="category-library-controls">
        <label>
          <span>Search categories</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search DSA, Java, Cloud, Security…"
          />
        </label>

        <label>
          <span>Domain</span>
          <select value={domain} onChange={(event) => setDomain(event.target.value)}>
            <option value="all">All domains</option>
            {domains.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>

        <label>
          <span>Sort</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="featured">Featured first</option>
            <option value="name">Name</option>
            <option value="topics">Most topics</option>
            <option value="questions">Most questions</option>
            <option value="progress">Progress</option>
          </select>
        </label>
      </div>

      <div className="category-grid scalable-category-grid">
        {visibleCategories.map((category) => (
          <CategoryCard key={category.id} category={countedCategories[category.id] || category} />
        ))}
      </div>

      {!visibleCategories.length ? (
        <div className="empty-state glass-lite">
          <h2>No categories found</h2>
          <p>Try a shorter term, switch the domain to All, or clear the search.</p>
        </div>
      ) : null}

      <div className="pagination category-pagination glass-lite">
        <div className="pagination-summary">
          Page {safePage} of {totalPages}. Showing {visibleCategories.length} of {filtered.length} categories.
        </div>
        <div className="pagination-controls">
          <button className="page-btn" disabled={safePage === 1} onClick={() => goToPage(1)}>First</button>
          <button className="page-btn" disabled={safePage === 1} onClick={() => goToPage(safePage - 1)}>Prev</button>
          <button className="page-btn active">{safePage}</button>
          <button className="page-btn" disabled={safePage === totalPages} onClick={() => goToPage(safePage + 1)}>Next</button>
          <button className="page-btn" disabled={safePage === totalPages} onClick={() => goToPage(totalPages)}>Last</button>
        </div>
      </div>
    </section>
  );
}
