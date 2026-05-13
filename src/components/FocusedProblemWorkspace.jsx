import { useEffect, useState } from 'react';
import VisualRail from './visuals/VisualRail.jsx';
import { loadVisualWalkthrough } from '../services/visualWalkthroughService.js';

const TABS = [
  ['walkthrough', '⊞', 'Visual Walkthrough'],
  ['intuition', 'ϟ', 'Intuition'],
  ['approach', '↗', 'Approach'],
  ['code', '⌘', 'Code'],
  ['complexity', '⌁', 'Complexity']
];

function optionLetter(index) {
  return String.fromCharCode(65 + index);
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

function McqBlock({ question, selected, setSelected }) {
  if (question.type !== 'mcq' || !question.options?.length) return null;

  const answered = selected !== null;
  const isCorrect = selected === question.correctAnswer;
  const correctLabel = question.options?.[question.correctAnswer]
    ? `${optionLetter(question.correctAnswer)}. ${question.options[question.correctAnswer]}`
    : 'Not configured';

  return (
    <section className="focused-mcq-panel">
      <span className="mini-label">Choose your answer</span>

      <div className="option-list" role="radiogroup" aria-label={question.title}>
        {question.options.map((option, index) => {
          const chosen = selected === index;
          const correct = question.correctAnswer === index;
          const className = [
            'option-btn',
            chosen ? 'selected' : '',
            answered && correct ? 'correct' : '',
            answered && chosen && !correct ? 'wrong' : ''
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
    </section>
  );
}

function CodeBlock({ children }) {
  return (
    <section className="workspace-block focused-code-block">
      <span className="mini-label">Implementation notes</span>
      <pre><code>{children || 'No code sample is configured yet. Use the approach tab as the implementation blueprint.'}</code></pre>
    </section>
  );
}

function VisualBlock({ question }) {
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
  const hasVisual = Boolean(
    visual?.summary || visual?.steps?.length || visual?.diagram?.frames?.length
  );

  if (!hasVisual) return null;

  return (
    <section className="learning-panel visual-walkthrough-panel reference-visual-panel">
      <div className="visual-walkthrough-header">
        <span className="mini-label">Visual clarity</span>
        <strong>{visual?.title || 'Mental model walkthrough'}</strong>
      </div>

      {visual?.summary ? <p className="visual-summary">{visual.summary}</p> : null}
      <VisualRail diagram={visual?.diagram} />

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
    </section>
  );
}

export default function FocusedProblemWorkspace({ question, completed, onToggle, hideTopline = false }) {
  const [activeTab, setActiveTab] = useState('walkthrough');
  const [selected, setSelected] = useState(null);
  const codeContent = question.solutionCode || question.code || question.pseudocode || question.approachPseudocode;

  return (
    <article className={`focused-problem-workspace glass-lite ${completed ? 'done' : ''}`}>
      {!hideTopline ? (
        <div className="focused-problem-topline">
          <div className="meta-strip">
            <span className="pill">{question.difficulty}</span>
            <span className="time-pill">⏱ {question.estimatedTime || '10 min'}</span>
          </div>

          <button className="mark" onClick={() => onToggle?.(question.id)}>
            {completed ? '✓ Completed' : 'Mark done'}
          </button>
        </div>
      ) : null}

      <div className="focused-tabs" role="tablist" aria-label="Problem learning sections">
        {TABS.map(([id, icon, label]) => (
          <button
            key={id}
            type="button"
            className={`focused-tab-btn ${activeTab === id ? 'active' : ''}`}
            role="tab"
            aria-selected={activeTab === id}
            onClick={() => setActiveTab(id)}
          >
            <span aria-hidden="true">{icon}</span>
            {label}
          </button>
        ))}
      </div>

      <div className="focused-tab-content">
        {activeTab === 'walkthrough' ? (
          <div className="focused-panel-stack">
            <div className="focused-two-col">
              <TextBlock title="Scenario" className="scenario-box">{question.scenario}</TextBlock>
              <TextBlock title="Problem" className="question-prompt">{question.question}</TextBlock>
            </div>
            <McqBlock question={question} selected={selected} setSelected={setSelected} />
            <VisualBlock question={question} />
          </div>
        ) : null}

        {activeTab === 'intuition' ? (
          <div className="focused-two-col">
            <TextBlock title="Think first" className="think-box">{question.starterThought}</TextBlock>
            <TextBlock title="Intuition">{question.intuition || question.visualExplanation}</TextBlock>
            <TextBlock title="Visual mental model" className="visual-model">{question.visualExplanation}</TextBlock>
          </div>
        ) : null}

        {activeTab === 'approach' ? (
          <div className="focused-panel-stack">
            <ListBlock title="Step-by-step breakdown" items={question.stepByStepBreakdown} ordered />
            <div className="focused-two-col">
              <TextBlock title="Brute-force thought">{question.bruteForceThought}</TextBlock>
              <TextBlock title="Optimization journey">{question.optimizationJourney}</TextBlock>
            </div>
          </div>
        ) : null}

        {activeTab === 'code' ? <CodeBlock>{codeContent}</CodeBlock> : null}

        {activeTab === 'complexity' ? (
          <div className="focused-two-col">
            <TextBlock title="Complexity / trade-off analysis">{question.complexityAnalysis}</TextBlock>
            <TextBlock title="Engineering insight">{question.engineeringInsight}</TextBlock>
            <TextBlock title="Production reality">{question.productionReality}</TextBlock>
            <TextBlock title="Common mistake">{question.commonMistake}</TextBlock>
          </div>
        ) : null}
      </div>

      {question.relatedConcepts?.length ? (
        <div className="concept-row focused-concepts">
          {question.relatedConcepts.map(concept => <span key={concept}>{concept}</span>)}
        </div>
      ) : null}

      <div className="tags focused-tags">{question.tags?.map(t => <span key={t}>#{t}</span>)}</div>
    </article>
  );
}
