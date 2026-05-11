import { memo, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button.jsx';
import VisualRail from './visuals/VisualRail.jsx';
import { loadVisualWalkthrough } from '../services/visualWalkthroughService.js';

const TYPE_LABELS = {
  coding: 'Coding reasoning',
  mcq: 'Quick check',
  debugging: 'Debugging',
  trace: 'Trace walkthrough',
  optimization: 'Optimization',
  'system-design': 'System design',
  'production-scenario': 'Production scenario'
};

function optionLetter(index) {
  return String.fromCharCode(65 + index);
}

function ListBlock({ title, items, ordered = false }) {
  if (!items?.length) return null;
  const Tag = ordered ? 'ol' : 'ul';
  return (
    <section className="workspace-block">
      <span className="mini-label">{title}</span>
      <Tag>
        {items.map((item) => <li key={item}>{item}</li>)}
      </Tag>
    </section>
  );
}

function TextBlock({ title, children, className = '' }) {
  if (!children) return null;
  return (
    <section className={`workspace-block ${className}`}>
      <span className="mini-label">{title}</span>
      <p>{children}</p>
    </section>
  );
}

function VisualMedia({ item }) {
  if (!item?.src) return null;

  const type = item.type || (item.src.endsWith('.mp4') || item.src.endsWith('.webm') ? 'video' : 'image');

  return (
    <figure className={`visual-media visual-media-${type}`}>
      {type === 'video' ? (
        <video
          src={item.src}
          poster={item.poster}
          controls={item.controls !== false}
          muted={item.muted !== false}
          loop={item.loop !== false}
          playsInline
        />
      ) : (
        <img src={item.src} alt={item.alt || item.caption || 'Visual explanation'} loading="lazy" />
      )}

      {item.caption ? <figcaption>{item.caption}</figcaption> : null}
    </figure>
  );
}

function VisualWalkthrough({ question }) {
  const [loadedVisual, setLoadedVisual] = useState(null);

  useEffect(() => {
    let active = true;

    setLoadedVisual(question.visualWalkthrough || null);

    if (!question.visualWalkthrough && question?.id) {
      loadVisualWalkthrough(question.id).then((visual) => {
        if (active) setLoadedVisual(visual);
      });
    }

    return () => {
      active = false;
    };
  }, [question.id, question.visualWalkthrough]);

  const visual = question.visualWalkthrough || loadedVisual;
  const hasStructuredVisual = Boolean(
    visual?.summary ||
    visual?.steps?.length ||
    visual?.media?.length ||
    visual?.diagram?.frames?.length
  );

  if (!hasStructuredVisual) return null;

  return (
    <section className="learning-panel visual-walkthrough-panel">
      <div className="visual-walkthrough-header">
        <span className="mini-label">Visual clarity</span>
        <strong>{visual?.title || 'Mental model walkthrough'}</strong>
      </div>

      {visual?.summary ? <p className="visual-summary">{visual.summary}</p> : null}

      <VisualRail diagram={visual?.diagram} />

      {visual?.productionMapping?.length ? (
        <div className="production-mapping-panel">
          <span className="mini-label">Production relevance</span>
          <div className="production-mapping-grid">
            {visual.productionMapping.map((item) => (
              <div className="production-chip" key={item}>{item}</div>
            ))}
          </div>
        </div>
      ) : null}

      {visual?.steps?.length ? (
        <ol className="visual-step-list">
          {visual.steps.map((step, index) => (
            <li key={`${step.title || step.body}-${index}`}>
              <span>{index + 1}</span>
              <div>
                {step.title ? <strong>{step.title}</strong> : null}
                {step.body ? <p>{step.body}</p> : null}
              </div>
            </li>
          ))}
        </ol>
      ) : null}

      {visual?.media?.length ? (
        <div className="visual-media-grid">
          {visual.media.map((item, index) => (
            <VisualMedia item={item} key={`${item.src}-${index}`} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function McqBlock({ question, selected, setSelected, showExplanation }) {
  if (!question.options?.length) return null;
  const answered = selected !== null;
  const isCorrect = selected === question.correctAnswer;
  const correctLabel = question.options?.[question.correctAnswer]
    ? `${optionLetter(question.correctAnswer)}. ${question.options[question.correctAnswer]}`
    : 'Not configured';

  return (
    <>
      <div className="option-list" role="radiogroup" aria-label={question.title}>
        {question.options.map((option, index) => {
          const chosen = selected === index;
          const correct = question.correctAnswer === index;
          const reveal = answered || showExplanation;
          const className = [
            'option-btn',
            chosen ? 'selected' : '',
            reveal && correct ? 'correct' : '',
            reveal && chosen && !correct ? 'wrong' : ''
          ].filter(Boolean).join(' ');

          return (
            <button
              key={option}
              type="button"
              className={className}
              onClick={() => setSelected(index)}
            >
              <strong>{optionLetter(index)}</strong>
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {answered ? (
        <div className={`answer-banner ${isCorrect ? 'correct' : 'wrong'}`}>
          {isCorrect ? 'Correct.' : 'Not quite.'} Best answer: <strong>{correctLabel}</strong>
        </div>
      ) : null}
    </>
  );
}

function QuestionCard({ question, completed, onToggle, disableCardNavigation = false }) {
  const [selected, setSelected] = useState(null);
  const [activePanel, setActivePanel] = useState(null);

  const showHints = activePanel === 'hints';
  const showThinking = activePanel === 'thinking';
  const showSolution = activePanel === 'solution';

  function togglePanel(panel) {
    setActivePanel((current) =>
      current === panel ? null : panel
    );
  }

  const navigate = useNavigate();

  const isMcq = question.type === 'mcq' && question.options?.length;
  const typeLabel = TYPE_LABELS[question.type] || 'Learning problem';
  const typeClass = `type-${question.type || 'learning'}`;

  const openFocusedProblem = () => {
    if (!disableCardNavigation && question?.id) {
      navigate(`/problem/${question.id}`);
    }
  };

  const handleCardClick = (event) => {
    const interactive = event.target.closest(
      'button, a, input, select, textarea, summary, details, [data-no-card-nav]'
    );

    if (interactive) return;
    openFocusedProblem();
  };

  const handleCardKeyDown = (event) => {
    if (disableCardNavigation) return;
    if (event.key !== 'Enter') return;

    const interactive = event.target.closest(
      'button, a, input, select, textarea, summary, details, [data-no-card-nav]'
    );

    if (interactive) return;
    openFocusedProblem();
  };

  const primaryActionLabel = useMemo(() => {
    if (question.type === 'coding') return 'Reveal intuition';
    if (question.type === 'optimization') return 'Reveal optimization path';
    if (question.type === 'trace') return 'Reveal walkthrough';
    if (question.type === 'debugging') return 'Reveal debugging lens';
    return 'Reveal thinking';
  }, [question.type]);

  return (
    <article
      className={`question-card problem-workspace glass-lite ${completed ? 'done' : ''} ${disableCardNavigation ? '' : 'clickable-problem-card'}`}
      role={disableCardNavigation ? undefined : 'button'}
      tabIndex={disableCardNavigation ? undefined : 0}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      aria-label={disableCardNavigation ? undefined : `Open ${question.title} in focused workspace`}
    >
      <div className="q-top">
        <div className="meta-strip">
          <span className={`pill type-pill ${typeClass}`}>{typeLabel}</span>
          <span className="pill">{question.difficulty}</span>
          <span className="time-pill">⏱ {question.estimatedTime || '10 min'}</span>
        </div>

        <button className="mark" onClick={() => onToggle?.(question.id)}>
          {completed ? '✓ Completed' : 'Mark done'}
        </button>
      </div>

      <h3>{question.title}</h3>

      <TextBlock title="Scenario" className="scenario-box">
        {question.scenario}
      </TextBlock>

      <TextBlock title="Problem" className="question-prompt">
        {question.question}
      </TextBlock>

      <VisualWalkthrough question={question} />

      <TextBlock title="Think first" className="think-box">
        {question.starterThought}
      </TextBlock>

      {isMcq ? (
        <McqBlock
          question={question}
          selected={selected}
          setSelected={setSelected}
          showExplanation={showSolution}
        />
      ) : (
        <div className="practice-mode-banner">
          <strong>No answer input needed.</strong>
          <span> Pause, reason through the approach, then reveal hints and the explanation journey.</span>
        </div>
      )}

      <div className="question-actions">
        <Button
          className={showHints ? 'ghost active-action' : 'ghost'}
          onClick={() => togglePanel('hints')}
        >
          {showHints ? '✓ Hints active' : 'Show hints'}
        </Button>

        <Button
          className={showThinking ? 'ghost active-action' : 'ghost'}
          onClick={() => togglePanel('thinking')}
        >
          {showThinking ? '✓ Thinking active' : primaryActionLabel}
        </Button>

        <Button
          className={showSolution ? 'ghost active-action' : 'ghost'}
          onClick={() => togglePanel('solution')}
        >
          {showSolution ? '✓ Explanation active' : 'Reveal full explanation'}
        </Button>
      </div>

      {showHints ? <ListBlock title="Hints" items={question.hints} ordered /> : null}

      {showThinking ? (
        <section className="learning-panel thinking-panel">
          <TextBlock title="Intuition">{question.intuition}</TextBlock>
          <TextBlock title="Visual mental model" className="visual-model">
            {question.visualExplanation}
          </TextBlock>
          <ListBlock title="Step-by-step breakdown" items={question.stepByStepBreakdown} ordered />
          <TextBlock title="Brute-force thought">{question.bruteForceThought}</TextBlock>
          <TextBlock title="Optimization journey">{question.optimizationJourney}</TextBlock>
        </section>
      ) : null}

      {showSolution ? (
        <section className="learning-panel explanation-panel">
          <div className="solution-header">
            <span className="mini-label">Final mental model</span>
            <strong>{question.finalPattern}</strong>
          </div>

          <p>{question.explanation}</p>

          <TextBlock title="Complexity / trade-off analysis">
            {question.complexityAnalysis}
          </TextBlock>

          <div className="insight-grid">
            <div>
              <strong>Engineering insight</strong>
              <p>{question.engineeringInsight}</p>
            </div>
            <div>
              <strong>Production reality</strong>
              <p>{question.productionReality}</p>
            </div>
            <div>
              <strong>Common mistake</strong>
              <p>{question.commonMistake}</p>
            </div>
            <div>
              <strong>Follow-up question</strong>
              <p>{question.followUpQuestion}</p>
            </div>
          </div>

          <ListBlock title="Common mistakes" items={question.commonMistakes} />
          <ListBlock title="Follow-up questions" items={question.followUpQuestions} ordered />

          {question.relatedConcepts?.length ? (
            <div className="concept-row">
              {question.relatedConcepts.map(concept => <span key={concept}>{concept}</span>)}
            </div>
          ) : null}

          {question.references?.length ? (
            <details className="reference-box">
              <summary>References</summary>
              <ul>
                {question.references.map(ref => <li key={ref}>{ref}</li>)}
              </ul>
            </details>
          ) : null}
        </section>
      ) : null}

      <div className="tags">{question.tags?.map(t => <span key={t}>#{t}</span>)}</div>
    </article>
  );
}

export default memo(QuestionCard);
