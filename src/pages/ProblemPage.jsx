import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import LoadingCard from '../components/LoadingCard.jsx';
import QuestionCard from '../components/QuestionCard.jsx';
import { findQuestionById } from '../services/questionBankService.js';
import { storageService } from '../services/storageService.js';

export default function ProblemPage() {
  const { questionId } = useParams();
  const [entry, setEntry] = useState(null);
  const [completed, setCompleted] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadProblem() {
      setLoading(true);
      setError('');

      try {
        const result = await findQuestionById(questionId);
        if (!cancelled) {
          setEntry(result);
          if (!result) setError('Problem not found.');
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setError('Could not load this problem.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    setCompleted(storageService.read().completed);
    loadProblem();

    return () => {
      cancelled = true;
    };
  }, [questionId]);

  const handleToggle = (id) => {
    const updated = storageService.toggleComplete(id);
    setCompleted(updated);
  };

  if (loading) return <LoadingCard label="Loading problem workspace…" />;

  if (error || !entry) {
    return (
      <section className="hero-card problem-detail-shell">
        <p className="eyebrow">Problem workspace</p>
        <h1>{error || 'Problem not found.'}</h1>
        <p>The selected question may have moved or the bank may have been renamed.</p>
        <NavLink className="btn" to="/">Back to dashboard</NavLink>
      </section>
    );
  }

  return (
    <section className="problem-detail-shell">
      <div className="problem-breadcrumb glass-lite">
        <NavLink to="/">Dashboard</NavLink>
        <span>›</span>
        <NavLink to={`/category/${entry.topic.category}`}>{entry.categoryName}</NavLink>
        <span>›</span>
        <span>{entry.topic.name}</span>
      </div>

      <div className="problem-detail-header hero-card">
        <p className="eyebrow">Focused problem workspace</p>
        <h1>{entry.question.title}</h1>
        <p>{entry.topic.description}</p>
        <div className="hero-actions">
          <NavLink className="btn ghost" to={`/category/${entry.topic.category}`}>Back to category</NavLink>
          <NavLink className="btn ghost" to="/random">Try random question</NavLink>
        </div>
      </div>

      <QuestionCard
        question={entry.question}
        completed={!!completed[entry.question.id]}
        onToggle={handleToggle}
        disableCardNavigation
      />
    </section>
  );
}
