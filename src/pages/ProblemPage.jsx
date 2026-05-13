import { useEffect, useState } from 'react';
import {
  NavLink,
  useLocation,
  useParams
} from 'react-router-dom';

import FocusedProblemWorkspace from '../components/FocusedProblemWorkspace.jsx';
import LoadingCard from '../components/LoadingCard.jsx';

import { findQuestionById } from '../services/questionBankService.js';
import { storageService } from '../services/storageService.js';

function uniqueItems(items = []) {
  return [...new Set(items.filter(Boolean))];
}

function pillClass(tag, difficulty) {
  const normalizedTag = String(tag || '').toLowerCase();
  const normalizedDifficulty = String(difficulty || '').toLowerCase();

  if (normalizedTag === normalizedDifficulty) {
    if (normalizedTag === 'easy') return 'difficulty-pill difficulty-easy';
    if (normalizedTag === 'medium') return 'difficulty-pill difficulty-medium';
    if (normalizedTag === 'hard') return 'difficulty-pill difficulty-hard';
    return 'difficulty-pill';
  }

  return 'meta-pill';
}

export default function ProblemPage() {
  const { questionId } = useParams();
  const location = useLocation();

  const [entry, setEntry] = useState(null);
  const [completed, setCompleted] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadProblem() {
      setLoading(true);
      setError('');

      const decodedQuestionId = decodeURIComponent(questionId || '');
      const searchEntry = location.state?.searchEntry;

      try {
        if (searchEntry?.question) {
          const stateEntry = {
            question: searchEntry.question,
            topic: {
              id: searchEntry.topicId,
              name: searchEntry.topicName,
              description: searchEntry.topicDescription,
              category: searchEntry.category
            },
            categoryName: searchEntry.category
          };

          if (!cancelled) {
            setEntry(stateEntry);
            setLoading(false);
          }

          return;
        }

        const result = await findQuestionById(decodedQuestionId);

        if (!cancelled) {
          setEntry(result);

          if (!result) {
            setError('Problem not found.');
          }
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError('Could not load this problem.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    setCompleted(storageService.read().completed);
    loadProblem();

    return () => {
      cancelled = true;
    };
  }, [questionId, location.state]);

  function handleToggle(id) {
    const updated = storageService.toggleComplete(id);
    setCompleted(updated);
  }

  if (loading) {
    return <LoadingCard label="Loading problem workspace…" />;
  }

  if (error || !entry) {
    return (
      <main className="page">
        <section className="hero-card problem-detail-shell">
          <p className="eyebrow">Problem workspace</p>

          <h1>{error || 'Problem not found.'}</h1>

          <p>
            The selected question may have moved or the bank may have
            been renamed.
          </p>

          <NavLink className="btn" to="/">
            Back to dashboard
          </NavLink>
        </section>
      </main>
    );
  }

  const problemTags = uniqueItems([
    entry.question.difficulty,
    entry.topic?.name,
    ...(entry.question.relatedConcepts || []).slice(0, 2),
    ...(entry.question.tags || []).slice(0, 2)
  ]);

  return (
    <main className="page problem-detail-shell focused-problem-page">
      <div className="problem-breadcrumb compact-problem-breadcrumb">
        <NavLink to="/">‹ Dashboard</NavLink>

        <span>/</span>

        {entry.topic?.name ? (
          <span>{entry.topic.name}</span>
        ) : (
          <span>{entry.categoryName || 'Topic'}</span>
        )}

        <span>/</span>

        <span>{entry.question.title}</span>
      </div>

      <section className="reference-problem-intro">
        <div>
          <h1>{entry.question.title}</h1>

          <div className="problem-meta-pills" aria-label="Problem metadata">
            {problemTags.map((tag) => (
              <span
                key={tag}
                className={pillClass(tag, entry.question.difficulty)}
              >
                {tag}
              </span>
            ))}
          </div>

          <p>
            {entry.question.question || entry.topic?.description || entry.question.scenario}
          </p>
        </div>

        <button className="mark reference-mark" onClick={() => handleToggle(entry.question.id)}>
          {completed[entry.question.id] ? '✓ Completed' : 'Mark done'}
        </button>
      </section>

      <FocusedProblemWorkspace
        question={entry.question}
        completed={!!completed[entry.question.id]}
        onToggle={handleToggle}
        hideTopline
      />
    </main>
  );
}
