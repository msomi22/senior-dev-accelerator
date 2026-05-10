import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import QuestionCard from './QuestionCard.jsx';
import Button from './Button.jsx';

import { searchConfig } from '../config/searchConfig.js';
import { performanceConfig } from '../config/performanceConfig.js';

function clampPage(page, totalPages) {
  return Math.min(Math.max(page, 1), Math.max(totalPages, 1));
}

function buildPageNumbers(currentPage, totalPages, windowSize) {
  const safeWindow = Math.max(3, windowSize);
  const half = Math.floor(safeWindow / 2);

  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + safeWindow - 1);

  start = Math.max(1, end - safeWindow + 1);

  const pages = [];

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  return pages;
}

function SearchResultsSection({ results, completed, onToggle }) {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const sectionRef = useRef(null);

  const pageSize = Math.max(1, searchConfig.searchPageSize);
  const totalQuestions = results.length;
  const totalPages = Math.max(1, Math.ceil(totalQuestions / pageSize));

  const safePage = clampPage(currentPage, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const pageEnd = Math.min(pageStart + pageSize, totalQuestions);

  useEffect(() => {
    setCurrentPage(1);
  }, [results]);

  const visibleResults = useMemo(
    () => results.slice(pageStart, pageEnd),
    [results, pageStart, pageEnd]
  );

  const pageNumbers = useMemo(
    () =>
      buildPageNumbers(
        safePage,
        totalPages,
        performanceConfig.paginationWindow
      ),
    [safePage, totalPages]
  );

  function goToPage(page) {
    setCurrentPage(clampPage(page, totalPages));

    requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  }

  function openProblem(entry) {
    const questionId = entry?.question?.id || entry?.id;

    if (!questionId) return;

    navigate(`/problem/${encodeURIComponent(questionId)}`, {
      state: {
        searchEntry: entry
      }
    });
  }

  function handleSearchResultClick(event, entry) {
    const interactive = event.target.closest(
      'button, input, select, textarea, summary, details, [data-no-card-nav]'
    );

    if (interactive) return;

    openProblem(entry);
  }

  function handleSearchResultKeyDown(event, entry) {
    if (event.key !== 'Enter') return;
    handleSearchResultClick(event, entry);
  }

  if (!totalQuestions) {
    return (
      <section className="search-results-section" ref={sectionRef}>
        <div className="empty-state glass-lite">
          <h2>No matching problems yet</h2>

          <p>
            Try fewer words, remove one filter, or search by a broader
            concept like cache, graph, retry, window, queue, or index.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="search-results-section" ref={sectionRef}>
      <div className="section-head search-results-head">
        <div>
          <p className="eyebrow">Search results</p>

          <h2>{totalQuestions} matching problems</h2>

          <p className="render-note">
            Showing results {pageStart + 1}-{pageEnd}. Click anywhere
            on a result card to open the focused workspace.
          </p>
        </div>
      </div>

      <div className="card-grid compact-grid">
        {visibleResults.map((entry) => (
          <article
            key={entry.id}
            className="search-result-item clickable-problem-card"
            role="button"
            tabIndex={0}
            onClick={(event) => handleSearchResultClick(event, entry)}
            onKeyDown={(event) => handleSearchResultKeyDown(event, entry)}
          >
            <div className="result-context">
              <span>{entry.topicName}</span>

              <small>
                {entry.type} · {entry.difficulty}
              </small>
            </div>

            <QuestionCard
              question={entry.question}
              completed={!!completed[entry.question.id]}
              onToggle={onToggle}
              disableCardNavigation
            />
          </article>
        ))}
      </div>

      {totalPages > 1 ? (
        <nav
          className="pagination glass-lite"
          aria-label="Search result pages"
        >
          <div className="pagination-summary">
            Page <strong>{safePage}</strong> of{' '}
            <strong>{totalPages}</strong>
          </div>

          <div className="pagination-controls">
            <Button
              className="ghost"
              onClick={() => goToPage(1)}
              disabled={safePage === 1}
            >
              First
            </Button>

            <Button
              className="ghost"
              onClick={() => goToPage(safePage - 1)}
              disabled={safePage === 1}
            >
              Previous
            </Button>

            {pageNumbers[0] > 1 ? (
              <span className="pagination-gap">…</span>
            ) : null}

            {pageNumbers.map((page) => (
              <button
                key={page}
                type="button"
                className={`page-btn ${
                  page === safePage ? 'active' : ''
                }`}
                onClick={() => goToPage(page)}
                aria-current={page === safePage ? 'page' : undefined}
              >
                {page}
              </button>
            ))}

            {pageNumbers.at(-1) < totalPages ? (
              <span className="pagination-gap">…</span>
            ) : null}

            <Button
              className="ghost"
              onClick={() => goToPage(safePage + 1)}
              disabled={safePage === totalPages}
            >
              Next
            </Button>

            <Button
              className="ghost"
              onClick={() => goToPage(totalPages)}
              disabled={safePage === totalPages}
            >
              Last
            </Button>
          </div>
        </nav>
      ) : null}
    </section>
  );
}

export default memo(SearchResultsSection);