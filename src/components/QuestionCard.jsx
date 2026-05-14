import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDifficultyClass } from '../utils/difficultyStyles.js';

function getPrimaryPattern(question) {
  return question.primaryPattern || question.finalPattern || question.pattern || question.tags?.[0] || 'Practice';
}

function getSummary(question) {
  return question.summary || question.shortSummary || question.scenario || question.question || '';
}

function QuestionCard({ question, completed, onToggle, disableCardNavigation = false, compact = false }) {
  const navigate = useNavigate();

  const difficultyClass = getDifficultyClass(question.difficulty);
  const primaryPattern = getPrimaryPattern(question);
  const summary = getSummary(question);

  function openProblem() {
    if (!disableCardNavigation && question?.id) {
      navigate(`/problem/${question.id}`);
    }
  }

  return (
    <article
      className={`question-card problem-workspace glass-lite ${completed ? 'done' : ''} ${compact ? 'compact-problem-card' : ''}`}
      onClick={openProblem}
    >
      <div className="q-top">
        <div className="meta-strip">
          <span className={`pill ${difficultyClass}`}>{question.difficulty || 'Practice'}</span>
          <span className="pill type-pill">{primaryPattern}</span>
          {!compact ? <span className="time-pill">⏱ {question.estimatedTime || '10 min'}</span> : null}
        </div>

        <button
          className="mark"
          onClick={(event) => {
            event.stopPropagation();
            onToggle?.(question.id);
          }}
        >
          {completed ? '✓ Completed' : 'Mark done'}
        </button>
      </div>

      <h3>{question.title}</h3>

      {summary ? (
        <p className="question-text">{summary}</p>
      ) : null}
    </article>
  );
}

export default memo(QuestionCard);
