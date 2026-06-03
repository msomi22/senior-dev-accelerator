import { useEffect, useMemo, useRef, useState } from 'react';

import { topicLibraryConfig } from '../config/topicLibraryConfig.js';
import { topicProgress } from '../services/questionBankService.js';
import { getQuestionSetProgress } from '../services/topicFilterService.js';

const ALL = 'all';

function getVisibleTopicProgress(topic, completed = {}) {
  if (Array.isArray(topic.filteredQuestions)) {
    return getQuestionSetProgress(topic.filteredQuestions, completed);
  }

  return topicProgress(
    { ...topic, count: topic.filteredCount ?? topic.count },
    completed
  );
}

function getFullTopicProgress(topic, completed = {}) {
  return topicProgress(topic, completed);
}

function getTopicIcon(topic, index) {
  const source = `${topic.id || topic.name || ''}`.toLowerCase();

  if (source.includes('communication')) return '▱';
  if (source.includes('delegation')) return '◎';
  if (source.includes('ownership')) return '◇';
  if (source.includes('mentor')) return '+';
  if (source.includes('delivery')) return '↗';
  if (source.includes('recursion')) return 'R';
  if (source.includes('nodes') || source.includes('graph')) return 'N';
  if (source.includes('pair')) return 'P';
  if (source.includes('pref')) return '∑';
  if (source.includes('search') || source.includes('sear')) return '⌕';
  if (source.includes('stack')) return 'S';
  if (source.includes('state')) return 'ƒ';
  if (source.includes('wind')) return 'W';

  return String(index + 1).padStart(2, '0');
}

export default function TopicLibrary({
  topics,
  selectedId,
  completed,
  onSelect,
  difficulty,
  onDifficultyChange,
  difficultyOptions,
  completionFilter,
  onCompletionFilterChange
}) {
  const [sortBy, setSortBy] = useState('recommended');
  const [currentPage, setCurrentPage] = useState(1);
  const libraryRef = useRef(null);

  const filteredTopics = useMemo(() => {
    return [...topics].sort((a, b) => {
      const selectedDelta =
        Number(b.id === selectedId) - Number(a.id === selectedId);

      if (selectedDelta !== 0) return selectedDelta;

      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === 'progress') {
        const ap = getVisibleTopicProgress(a, completed).percent;
        const bp = getVisibleTopicProgress(b, completed).percent;

        return bp - ap;
      }

      if (sortBy === 'questions') {
        return (
          (b.filteredCount ?? b.count ?? 0) -
          (a.filteredCount ?? a.count ?? 0)
        );
      }

      return (
        (b.featured ? 1 : 0) -
          (a.featured ? 1 : 0) ||
        a.name.localeCompare(b.name)
      );
    });
  }, [topics, sortBy, completed, selectedId]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredTopics.length / topicLibraryConfig.topicsPerPage
    )
  );

  const safePage = Math.min(currentPage, totalPages);

  const visibleTopics = useMemo(() => {
    const start =
      (safePage - 1) * topicLibraryConfig.topicsPerPage;

    return filteredTopics.slice(
      start,
      start + topicLibraryConfig.topicsPerPage
    );
  }, [filteredTopics, safePage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [difficulty, completionFilter, sortBy, selectedId]);

  useEffect(() => {
    if (safePage === currentPage) return;
    setCurrentPage(safePage);
  }, [currentPage, safePage]);

  function goToPage(page) {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(nextPage);

    requestAnimationFrame(() => {
      libraryRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  }

  return (
    <section className="topic-library glass-lite premium-topic-rail" ref={libraryRef}>
      <div className="library-head premium-topic-rail-head">
        <p className="eyebrow">Topics</p>
      </div>

      <div className="topic-library-controls premium-topic-rail-controls" aria-label="Question filters">
        <label>
          <span>Difficulty</span>

          <select
            value={difficulty}
            onChange={(event) => onDifficultyChange(event.target.value)}
          >
            <option value={ALL}>All levels</option>

            {difficultyOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Status</span>

          <select
            value={completionFilter}
            onChange={(event) =>
              onCompletionFilterChange(event.target.value)
            }
          >
            <option value="all">All</option>
            <option value="completed">Complete</option>
            <option value="incomplete">Todo</option>
          </select>
        </label>

        <label>
          <span>Sort</span>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="recommended">Recommended</option>
            <option value="name">Name</option>
            <option value="progress">Progress</option>
            <option value="questions">Questions</option>
          </select>
        </label>
      </div>

      <div className="topic-picker scalable-topic-picker premium-topic-rail-list">
        {visibleTopics.map((topic, index) => {
          const count = topic.filteredCount ?? topic.count ?? 0;
          const progress = getVisibleTopicProgress(topic, completed);
          const fullProgress = getFullTopicProgress(topic, completed);

          const fullyCompleted =
            fullProgress.total > 0 && fullProgress.done === fullProgress.total;

          return (
            <button
              key={topic.id}
              type="button"
              className={`topic-tab glass premium-topic-rail-item ${
                selectedId === topic.id ? 'active' : ''
              } ${fullyCompleted ? 'done' : ''}`}
              onClick={() => onSelect(topic.id)}
            >
              <span className="premium-topic-rail-icon" aria-hidden="true">
                {getTopicIcon(topic, index)}
              </span>

              <span className="premium-topic-rail-copy">
                <strong>{topic.name}</strong>
                <small>{count} questions</small>
                <em>{progress.done}/{progress.total || count} complete</em>
              </span>
            </button>
          );
        })}
      </div>

      {filteredTopics.length === 0 ? (
        <div className="empty-state glass-lite">
          <h3>No topics found</h3>
          <p>Try clearing the difficulty or status filters.</p>
        </div>
      ) : null}

      {totalPages > 1 ? (
        <nav
          className="pagination compact-pagination premium-topic-rail-pagination"
          aria-label="Topic library pages"
        >
          <div className="pagination-status">
            Page {safePage} of {totalPages}
          </div>

          <div className="pagination-controls">
            <button
              type="button"
              onClick={() => goToPage(safePage - 1)}
              disabled={safePage === 1}
            >
              ‹
            </button>

            <button
              type="button"
              onClick={() => goToPage(safePage + 1)}
              disabled={safePage === totalPages}
            >
              ›
            </button>
          </div>
        </nav>
      ) : null}
    </section>
  );
}
