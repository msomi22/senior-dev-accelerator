import { useMemo, useState } from 'react';

import { scoreComplexDesignAnswer } from '../../utils/complexDesignScoring.js';

function rows(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function ListSection({ title, items }) {
  const list = rows(items);
  if (!list.length) return null;

  return (
    <section className="complex-design-card">
      <span className="mini-label">{title}</span>
      <ul>
        {list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function ScoreMeter({ result }) {
  if (!result) return null;

  return (
    <section className="complex-design-score-card" aria-live="polite">
      <div>
        <span className="mini-label">Evaluation result</span>
        <strong>{result.totalScore}/{result.maxScore}</strong>
        <p>{result.percentage}% · {result.level}</p>
      </div>
      <div className="complex-design-score-bar" aria-hidden="true">
        <span style={{ width: `${Math.min(100, result.percentage)}%` }} />
      </div>
    </section>
  );
}

function FeedbackList({ title, items }) {
  const list = rows(items);
  if (!list.length) return null;

  return (
    <section className="complex-design-card compact">
      <span className="mini-label">{title}</span>
      <ul>
        {list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function SectionBreakdown({ result }) {
  if (!result?.sectionScores?.length) return null;

  return (
    <section className="complex-design-breakdown">
      <div className="complex-design-section-heading">
        <span className="mini-label">Score breakdown</span>
        <p>Rubric-based deterministic scoring. Keyword-only answers receive partial credit; reasoned answers score higher.</p>
      </div>

      <div className="complex-design-section-list">
        {result.sectionScores.map((section) => (
          <article key={section.id} className="complex-design-section-score">
            <div>
              <strong>{section.title}</strong>
              <span>{section.score}/{section.maxScore}</span>
            </div>
            <p>{section.feedback}</p>
            {section.missedCriteria.length ? <small>Missing: {section.missedCriteria.join(', ')}</small> : null}
          </article>
        ))}
      </div>
    </section>
  );
}

export default function ComplexSystemDesignProblem({ question, completed, onToggle }) {
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const wordCount = useMemo(() => answer.trim().split(/\s+/).filter(Boolean).length, [answer]);

  function handleEvaluate() {
    const nextResult = scoreComplexDesignAnswer(question, answer);
    setResult(nextResult);
    setSubmitted(true);
  }

  return (
    <article className={`complex-design-workspace glass-lite ${completed ? 'done' : ''}`}>
      <header className="complex-design-header">
        <div>
          <span className="mini-label">Complex system design</span>
          <h2>{question.title}</h2>
          <p>{question.scenario}</p>
        </div>
        <button className="mark" type="button" onClick={() => onToggle?.(question.id)}>
          {completed ? 'Completed' : 'Mark complete'}
        </button>
      </header>

      <section className="complex-design-prompt">
        <span className="mini-label">Full design prompt</span>
        <p>{question.question}</p>
      </section>

      <div className="complex-design-grid">
        <ListSection title="Functional requirements" items={question.requirements?.functional} />
        <ListSection title="Non-functional requirements" items={question.requirements?.nonFunctional} />
        <ListSection title="Constraints" items={question.constraints} />
        <ListSection title="Optional hints" items={question.hints} />
      </div>

      <section className="complex-design-answer-panel">
        <div className="complex-design-section-heading">
          <div>
            <span className="mini-label">Your answer</span>
            <p>Explain APIs, storage, flows, scaling, failure behavior, security, and observability.</p>
          </div>
          <span>{wordCount} words</span>
        </div>

        <textarea
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="Write your full system design answer here..."
          rows={14}
        />

        <div className="complex-design-actions">
          <button className="btn" type="button" onClick={handleEvaluate}>Evaluate answer</button>
          {submitted && result ? <span>{result.level} · {result.percentage}%</span> : null}
        </div>
      </section>

      <ScoreMeter result={result} />

      {result ? (
        <div className="complex-design-feedback-grid">
          <FeedbackList title="Strong areas" items={result.strengths} />
          <FeedbackList title="Improvements" items={result.improvements} />
        </div>
      ) : null}

      <SectionBreakdown result={result} />

      <details className="complex-design-model-answer">
        <summary>Model answer outline</summary>
        <ListSection title="Expected answer outline" items={question.expectedAnswerOutline} />
        <section className="complex-design-card">
          <span className="mini-label">Model answer summary</span>
          <p>{question.modelAnswer}</p>
        </section>
        <ListSection title="Common weak answers" items={question.commonWeakAnswers} />
      </details>
    </article>
  );
}
