import { useEffect, useMemo, useState } from 'react';

import { topicLibraryConfig } from '../config/topicLibraryConfig.js';
import { topicProgress } from '../services/questionBankService.js';

const ALL = 'all';

function getFilterSummary(completionFilter, visibleTopicCount, allTopicsCount) {
  if (completionFilter === 'completed') {
    return `${visibleTopicCount} topics contain completed questions.`;
  }

  if (completionFilter === 'incomplete') {
    return `${visibleTopicCount} topics contain incomplete questions.`;
  }

  return `${visibleTopicCount} of ${allTopicsCount} topics match the current filters.`;
}

function getCountLabel(count, completionFilter) {
  if (completionFilter === 'completed') {
    return `${count} completed`;
  }

  if (completionFilter === 'incomplete') {
    return `${count} incomplete`;
  }

  return `${count} quiz`;
}

export default function TopicLibrary({
  topics,
  allTopicsCount,
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

  const filteredTopics = useMemo(() => {
    return [...topics].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === 'progress') {
        const ap = topicProgress(
          { ...a, count: a.filteredCount ?? a.count },
          completed
        ).percent;

        const bp = topicProgress(
          { ...b, count: b.filteredCount ?? b.count },
          completed
        ).percent;

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
  }, [topics, sortBy, completed]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredTopics.length / topicLibraryConfig.topicsPerPage
    )
  );

  const visibleTopics = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start =
      (safePage - 1) * topicLibraryConfig.topicsPerPage;

    return filteredTopics.slice(
      start,
      start + topicLibraryConfig.topicsPerPage
    );
  }, [filteredTopics, currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [difficulty, completionFilter, sortBy]);

  function goToPage(page) {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  return (
    <section className="topic-library glass-lite">
      <div className="library-head">
        <div>
          <p className="eyebrow">Topic library</p>

          <h2>Choose a topic</h2>

          <p>
            {getFilterSummary(
              completionFilter,
              filteredTopics.length,
              allTopicsCount ?? topics.length
            )}
          </p>
        </div>
      </div>

      <div className="topic-library-controls">
        <label>
          <span>Difficulty</span>

          <select
            value={difficulty}
            onChange={(event) => onDifficultyChange(event.target.value)}
          >
            <option value={ALL}>All difficulties</option>

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
            <option value="all">All questions</option>
            <option value="completed">Completed only</option>
            <option value="incomplete">Incomplete only</option>
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
            <option value="questions">Question count</option>
          </select>
        </label>
      </div>

      <div className="topic-picker scalable-topic-picker">
        {visibleTopics.map((topic) => {
          const count = topic.filteredCount ?? topic.count ?? 0;

          const progress = topicProgress(
            { ...topic, count },
            completed
          );

          const fullyCompleted =
            count > 0 && progress.done === count;

          return (
            <button
              key={topic.id}
              type="button"
              className={`topic-tab glass ${
                selectedId === topic.id ? 'active' : ''
              } ${fullyCompleted ? 'done' : ''}`}
              onClick={() => onSelect(topic.id)}
            >
              <span className="eyebrow">
                {getCountLabel(count, completionFilter)}
              </span>

              <strong>{topic.name}</strong>

              <small>
                {progress.done}/{progress.total || count} complete
              </small>

              {difficulty !== ALL ? (
                <small>Difficulty: {difficulty}</small>
              ) : null}

              {completionFilter !== 'all' ? (
                <small>
                  Status:{' '}
                  {completionFilter === 'completed'
                    ? 'Completed only'
                    : 'Incomplete only'}
                </small>
              ) : null}

              <em>{topic.description}</em>
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
        <div className="pagination compact-pagination">
          <button
            type="button"
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
          >
            First
          </button>

          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span className="pagination-status">
            Page {Math.min(currentPage, totalPages)} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>

          <button
            type="button"
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </div>
      ) : null}
    </section>
  );
}
