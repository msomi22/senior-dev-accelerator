import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import QuestionCard from './QuestionCard.jsx';
import Button from './Button.jsx';

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

function TopicSection({
  topic,
  questions,
  completed,
  onToggle,
  activeDifficulty = 'all',
  currentPage,
  onPageChange,
  returnContext
}) {
  const [internalPage, setInternalPage] = useState(1);
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const previousTopicKey = useRef('');
  const isControlled = typeof currentPage === 'number';

  const safeQuestions = questions || topic.questions || [];

  const pageSize = Math.max(1, performanceConfig.questionsPerPage);
  const totalQuestions = safeQuestions.length;
  const totalPages = Math.max(1, Math.ceil(totalQuestions / pageSize));
  const rawPage = isControlled ? currentPage : internalPage;
  const safePage = clampPage(rawPage, totalPages);

  useEffect(() => {
    const topicKey = `${topic.id}:${activeDifficulty}`;
    const hadPreviousTopic = Boolean(previousTopicKey.current);

    if (!isControlled) {
      setInternalPage(1);
    }

    if (hadPreviousTopic && previousTopicKey.current !== topicKey) {
      sectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }

    previousTopicKey.current = topicKey;
  }, [topic.id, activeDifficulty, isControlled]);

  useEffect(() => {
    if (safePage === rawPage) return;

    if (isControlled) {
      onPageChange?.(safePage);
      return;
    }

    setInternalPage(safePage);
  }, [isControlled, onPageChange, rawPage, safePage]);

  const pageStart = (safePage - 1) * pageSize;
  const pageEnd = Math.min(pageStart + pageSize, totalQuestions);

  const visibleQuestions = useMemo(
    () => safeQuestions.slice(pageStart, pageEnd),
    [safeQuestions, pageStart, pageEnd]
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

  function openFocusedProblem(question) {
    if (!question?.id) return;

    navigate(`/problem/${question.id}`, {
      state: {
        returnToCategory: {
          ...returnContext,
          questionId: question.id
        }
      }
    });
  }

  function shouldIgnoreCardNavigation(event) {
    return event.target.closest(
      'button, a, input, select, summary, details, [data-no-card-nav]'
    );
  }

  function goToPage(page) {
    const nextPage = clampPage(page, totalPages);

    if (isControlled) {
      onPageChange?.(nextPage);
    } else {
      setInternalPage(nextPage);
    }

    requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  }

  return (
    <section className="topic-section" ref={sectionRef}>
      <div className="section-head">
        <div>
          <p className="eyebrow">
            {totalQuestions} problems
          </p>

          <h2>{topic.name}</h2>

          <p>{topic.description}</p>

          <p className="render-note">
            {activeDifficulty !== 'all'
              ? `Showing ${activeDifficulty} questions only. `
              : ''}
            Showing {totalQuestions ? pageStart + 1 : 0}-{pageEnd} of{' '}
            {totalQuestions} problems.
          </p>
        </div>

        {performanceConfig.enableAnimatedTopicOrbit ? (
          <div className="topic-orbit" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : null}
      </div>

      {totalQuestions === 0 ? (
        <div className="empty-state glass-lite">
          <h3>No questions found</h3>
          <p>Try another difficulty or clear the filter.</p>
        </div>
      ) : (
        <div className="card-grid compact-grid problem-list-grid">
          {visibleQuestions.map((question) => (
            <div
              key={question.id}
              role="button"
              tabIndex={0}
              className="clickable-problem-card-shell"
              aria-label={`Open ${question.title} in focused workspace`}
              onClick={(event) => {
                if (shouldIgnoreCardNavigation(event)) return;
                openFocusedProblem(question);
              }}
              onKeyDown={(event) => {
                if (event.key !== 'Enter') return;
                if (shouldIgnoreCardNavigation(event)) return;
                openFocusedProblem(question);
              }}
            >
              <QuestionCard
                question={question}
                completed={!!completed[question.id]}
                onToggle={onToggle}
                disableCardNavigation
                compact
              />
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <nav
          className="pagination glass-lite"
          aria-label={`${topic.name} question pages`}
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

export default memo(TopicSection);
