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

  return (
    <main className="page problem-detail-shell focused-problem-page">
      <div className="problem-breadcrumb glass-lite">
        <NavLink to="/">Dashboard</NavLink>

        <span>›</span>

        {entry.topic?.category ? (
          <NavLink to={`/category/${entry.topic.category}`}>
            {entry.categoryName || entry.topic.category}
          </NavLink>
        ) : (
          <span>{entry.categoryName || 'Category'}</span>
        )}

        <span>›</span>

        <span>{entry.topic?.name || 'Topic'}</span>
      </div>

      <div className="problem-detail-header hero-card compact-problem-header">
        <p className="eyebrow">Focused problem workspace</p>

        <h1>{entry.question.title}</h1>

        <p>{entry.topic?.description}</p>

        <div className="hero-actions">
          {entry.topic?.category ? (
            <NavLink
              className="btn ghost"
              to={`/category/${entry.topic.category}`}
            >
              Back to category
            </NavLink>
          ) : null}

          <NavLink className="btn ghost" to="/random">
            Try random question
          </NavLink>
        </div>
      </div>

      <FocusedProblemWorkspace
        question={entry.question}
        completed={!!completed[entry.question.id]}
        onToggle={handleToggle}
      />
    </main>
  );
}
