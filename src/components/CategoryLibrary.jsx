import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { categoryLibraryConfig } from '../config/categoryLibraryConfig.js';
import { getCategoryWithCounts } from '../services/questionBankService.js';
import { useDebouncedValue } from '../hooks/useDebouncedValue.js';

const CATEGORY_ICON_LABELS = {
  aptitude: 'AT',
  dsa: 'DS',
  kubernetes: 'K8',
  ckad: 'K8',
  ai: 'AI',
  ml: 'AI',
  system: 'SD',
  java: 'JV',
  leadership: 'LD'
};

function categoryIconLabel(category) {
  const source = [category.id, category.name, category.domain].filter(Boolean).join(' ').toLowerCase();
  const match = Object.entries(CATEGORY_ICON_LABELS).find(([key]) => source.includes(key));
  if (match) return match[1];

  return (category.shortName || category.name || 'TP')
    .split(/\s|\/|&|-/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function categoryAccent(category) {
  const palette = ['sky', 'violet', 'amber', 'emerald', 'rose', 'indigo', 'cyan'];
  const seed = `${category.id || ''}${category.name || ''}`;
  const hash = Array.from(seed).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return palette[hash % palette.length];
}

function formatCount(value, singular, plural) {
  if (value === undefined || value === null) return '…';
  return `${value} ${value === 1 ? singular : plural}`;
}

function CategoryCard({ category }) {
  const progress = typeof category.progressPercent === 'number' ? category.progressPercent : null;

  return (
    <Link
      className={`category-card scalable-category-card premium-category-card accent-${categoryAccent(category)}`}
      to={category.route || `/category/${category.id}`}
    >
      <div className="premium-category-card__head">
        <span className="premium-category-card__icon" aria-hidden="true">
          {categoryIconLabel(category)}
        </span>
        <span className="premium-category-card__title-group">
          <strong>{category.name}</strong>
          <small>{category.domain || 'Learning path'}</small>
        </span>
        {category.featured ? <em className="premium-category-card__badge">New</em> : null}
      </div>

      <p>{category.description}</p>

      <div className="premium-category-card__meta" aria-label={`${category.name} learning stats`}>
        <span>{formatCount(category.topicCount, 'Topic', 'Topics')}</span>
        <span>{formatCount(category.quizCount, 'Question', 'Questions')}</span>
        {progress !== null ? <span className="premium-category-card__progress">{progress}%</span> : null}
      </div>
    </Link>
  );
}

export default function CategoryLibrary({ categories = [], completed = {} }) {
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
          rows.filter(Boolean).forEach((row) => { next[row.id] = row; });
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
    <section className="category-library premium-category-library" aria-label="Topic categories">
      <div className="category-library-controls premium-category-controls" aria-label="Topic filters">
        <label className="premium-category-controls__search">
          <span>Search topics</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search topics..."
          />
        </label>

        <label>
          <span>Domain</span>
          <select value={domain} onChange={(event) => setDomain(event.target.value)}>
            <option value="all">All Domains</option>
            {domains.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>

        <label>
          <span>Sort</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="featured">Featured First</option>
            <option value="name">Name</option>
            <option value="topics">Most Topics</option>
            <option value="questions">Most Questions</option>
            <option value="progress">Progress</option>
          </select>
        </label>
      </div>

      <div className="category-grid scalable-category-grid premium-category-grid">
        {visibleCategories.map((category) => (
          <CategoryCard key={category.id} category={countedCategories[category.id] || category} />
        ))}
      </div>

      {!visibleCategories.length ? (
        <div className="empty-state glass-lite premium-category-empty">
          <h2>No topics found</h2>
          <p>Try a broader search or clear the domain filter.</p>
        </div>
      ) : null}

      {totalPages > 1 ? (
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
      ) : null}
    </section>
  );
}
