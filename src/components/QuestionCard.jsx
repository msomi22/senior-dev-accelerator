import { memo, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button.jsx';

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

function getFallbackVisualWalkthrough(question) {
  if (question.visualWalkthrough) return question.visualWalkthrough;
  if (question.topicId !== 'sliding-window') return null;

  return {
    title: 'Mental model walkthrough',
    summary: question.visualExplanation || '[left ... right] expands → violation appears → left moves until valid → answer updates',
    diagram: {
      title: 'Pointer movement: preserve a valid active region',
      frames: [
        {
          label: '1. Start',
          value: 'a  b  c  d  e\n^\nL,R',
          note: 'Both pointers begin at the first candidate item.'
        },
        {
          label: '2. Expand right',
          value: 'a  b  c  d  e\n[--]\nL  R',
          note: 'Move right to include one new item and reuse previous state.'
        },
        {
          label: '3. Keep growing',
          value: 'a  b  c  d  e\n[-----]\nL     R',
          note: 'The active region remains contiguous while state is valid.'
        },
        {
          label: '4. Violation appears',
          value: 'a  b  c  c  e\n[--------]\nL        R',
          note: 'A duplicate or invalid condition appears inside the window.'
        },
        {
          label: '5. Pause answer update',
          value: 'a  b  c  c  e\n[invalid]\nL        R',
          note: 'Do not update the answer while the invariant is broken.'
        },
        {
          label: '6. Move left',
          value: 'a  b  c  c  e\n   [-----]\n   L     R',
          note: 'Shrink from the left until the bad state is removed.'
        },
        {
          label: '7. Valid again',
          value: 'a  b  c  c  e\n      [--]\n      L  R',
          note: 'The window is valid again, so it is safe to compare answers.'
        },
        {
          label: '8. Continue scan',
          value: 'a  b  c  c  e\n      [-----]\n      L     R',
          note: 'Continue expanding and repairing until the input is exhausted.'
        }
      ]
    },
    steps: [
      {
        title: 'Track the active region',
        body: 'The window is the only part of the input you are currently reasoning about.'
      },
      {
        title: 'Protect the invariant',
        body: 'Before updating the answer, make sure the active region is valid.'
      },
      {
        title: 'Reuse previous work',
        body: 'Move one pointer at a time instead of recomputing every candidate from scratch.'
      }
    ],
    media: [
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop',
        alt: 'Code on a screen representing algorithm state transitions',
        caption: 'Visual clarity means tracking how state moves, not memorizing syntax.'
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1200&auto=format&fit=crop',
        alt: 'Developer workstation used for visual algorithm reasoning',
        caption: 'A strong mental model lets the same pattern transfer across variants.'
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
        alt: 'Laptop showing software engineering workspace',
        caption: 'Trace one small example until pointer movement becomes obvious.'
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
        alt: 'Data dashboard representing evolving state',
        caption: 'Sliding windows are useful anywhere state changes over a moving range.'
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop',
        alt: 'Server racks representing production stream processing',
        caption: 'The same mental model appears in streaming, rate limits, and observability.'
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
        alt: 'Developer learning with laptop and notes',
        caption: 'Use visuals to explain the invariant before writing final code.'
      }
    ]
  };
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

function VisualDiagram({ diagram }) {
  if (!diagram?.frames?.length) return null;

  return (
    <div className="visual-diagram" aria-label={diagram.title || 'Visual diagram'}>
      {diagram.title ? <strong>{diagram.title}</strong> : null}
      <div className="visual-diagram-frames">
        {diagram.frames.map((frame, index) => (
          <div className="visual-frame" key={`${frame.label || frame.value}-${index}`}>
            {frame.label ? <span>{frame.label}</span> : null}
            <code>{frame.value}</code>
            {frame.note ? <small>{frame.note}</small> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function VisualWalkthrough({ question }) {
  const visual = getFallbackVisualWalkthrough(question);
  const hasStructuredVisual = Boolean(
    visual?.summary ||
    visual?.steps?.length ||
    visual?.media?.length ||
    visual?.diagram?.frames?.length
  );

  if (!hasStructuredVisual && !question.visualExplanation) return null;

  return (
    <section className="learning-panel visual-walkthrough-panel">
      <div className="visual-walkthrough-header">
        <span className="mini-label">Visual clarity</span>
        <strong>{visual?.title || 'Mental model walkthrough'}</strong>
      </div>

      {visual?.summary || question.visualExplanation ? (
        <p className="visual-summary">{visual?.summary || question.visualExplanation}</p>
      ) : null}

      <VisualDiagram diagram={visual?.diagram} />

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
