import { useEffect, useMemo, useState } from 'react';
import { topicLibraryConfig } from '../config/topicLibraryConfig.js';
import { getTopicCount, topicProgress } from '../services/questionBankService.js';
import { useDebouncedValue } from '../hooks/useDebouncedValue.js';

const ALL = 'all';

function normalize(value) {
  return String(value || '').toLowerCase().trim();
}

function topicHaystack(topic) {
  return [
    topic.id,
    topic.name,
    topic.description,
    topic.category,
    topic.domain,
    ...(topic.tags || [])
  ].join(' ').toLowerCase();
}

export default function TopicLibrary({ topics, selectedId, completed, onSelect }) {
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState(ALL);
  const [sortBy, setSortBy] = useState('recommended');
  const [currentPage, setCurrentPage] = useState(1);
  const [counts, setCounts] = useState({});

  const debouncedQuery = useDebouncedValue(query, topicLibraryConfig.topicSearchDebounceMs);

  const difficulties = useMemo(() => {
    const set = new Set();
    topics.forEach((topic) => (topic.difficulties || []).forEach((item) => set.add(item)));
    return Array.from(set).sort();
  }, [topics]);

  const filteredTopics = useMemo(() => {
    const q = normalize(debouncedQuery);

    let next = topics.filter((topic) => {
      if (difficulty !== ALL && !(topic.difficulties || []).includes(difficulty)) return false;
      if (!q) return true;
      return topicHaystack(topic).includes(q);
    });

    next = [...next].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'progress') {
        const ap = topicProgress({ ...a, count: counts[a.id] }, completed).percent;
        const bp = topicProgress({ ...b, count: counts[b.id] }, completed).percent;
        return bp - ap;
      }
      if (sortBy === 'questions') return (counts[b.id] || 0) - (counts[a.id] || 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a.name.localeCompare(b.name);
    });

    return next;
  }, [topics, debouncedQuery, difficulty, sortBy, counts, completed]);

  const totalPages = Math.max(1, Math.ceil(filteredTopics.length / topicLibraryConfig.topicsPerPage));

  const visibleTopics = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * topicLibraryConfig.topicsPerPage;
    return filteredTopics.slice(start, start + topicLibraryConfig.topicsPerPage);
  }, [filteredTopics, currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, difficulty, sortBy]);

  useEffect(() => {
    let alive = true;
    const missing = visibleTopics
      .filter((topic) => counts[topic.id] == null)
      .slice(0, topicLibraryConfig.visibleCountBatchSize);

    if (!missing.length) return undefined;

    Promise.all(
      missing.map(async (topic) => {
        const count = await getTopicCount(topic.id);
        return [topic.id, count];
      })
    ).then((entries) => {
      if (!alive) return;
      setCounts((current) => ({ ...current, ...Object.fromEntries(entries) }));
    });

    return () => { alive = false; };
  }, [visibleTopics, counts]);

  function goToPage(page) {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <section className="topic-library glass-lite">
      <div className="library-head">
        <div>
          <p className="eyebrow">Topic library</p>
          <h2>Choose a topic</h2>
          <p>
            {filteredTopics.length} of {topics.length} topics. Counts are loaded only for the visible page.
          </p>
        </div>
      </div>

      <div className="topic-library-controls">
        <label>
          <span>Search topics</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, tags, description..."
          />
        </label>

        <label>
          <span>Difficulty</span>
          <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
            <option value={ALL}>All difficulties</option>
            {difficulties.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>

        <label>
          <span>Sort</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="recommended">Recommended</option>
            <option value="name">Name</option>
            <option value="progress">Progress</option>
            <option value="questions">Question count</option>
          </select>
        </label>
      </div>

      <div className="topic-picker scalable-topic-picker">
        {visibleTopics.map((topic) => {
          const count = counts[topic.id];
          const progress = topicProgress({ ...topic, count }, completed);

          return (
            <button
              key={topic.id}
              type="button"
              className={`topic-tab glass ${selectedId === topic.id ? 'active' : ''}`}
              onClick={() => onSelect(topic.id)}
            >
              <span className="eyebrow">{count == null ? 'loading' : count} quiz</span>
              <strong>{topic.name}</strong>
              <small>{progress.done}/{progress.total || '…'} complete</small>
              <em>{topic.description}</em>
            </button>
          );
        })}
      </div>

      {filteredTopics.length === 0 ? (
        <div className="empty-state glass-lite">
          <h3>No topics found</h3>
          <p>Try a broader search or clear the filters.</p>
        </div>
      ) : null}

      {totalPages > 1 ? (
        <div className="pagination compact-pagination">
          <button type="button" onClick={() => goToPage(1)} disabled={currentPage === 1}>First</button>
          <button type="button" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
          <span className="pagination-status">Page {Math.min(currentPage, totalPages)} of {totalPages}</span>
          <button type="button" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
          <button type="button" onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>Last</button>
        </div>
      ) : null}
    </section>
  );
}
