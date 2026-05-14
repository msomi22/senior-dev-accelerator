import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button.jsx';
import VisualRail from './visuals/VisualRail.jsx';
import { loadVisualWalkthrough } from '../services/visualWalkthroughService.js';
import { storageService } from '../services/storageService.js';
import { getDifficultyClass } from '../utils/difficultyStyles.js';

const TYPE_LABELS = {
  coding: 'Coding',
  mcq: 'Quick check',
  debugging: 'Debugging',
  trace: 'Trace',
  optimization: 'Optimization',
  'system-design': 'System design',
  'production-scenario': 'Production'
};

const SUMMARY_LIMIT = 128;

function optionLetter(index) {
  return String.fromCharCode(65 + index);
}

function compactText(value, limit = SUMMARY_LIMIT) {
  if (!value) return '';

  const normalized = String(value).replace(/\s+/g, ' ').trim();

  if (normalized.length <= limit) return normalized;

  return `${normalized.slice(0, limit - 1).trim()}…`;
}

function getPrimaryPattern(question) {
  return (
    question.primaryPattern ||
    question.finalPattern ||
    question.pattern ||
    question.category ||
    question.tags?.[0] ||
    'Practice'
  );
}

function getProblemSummary(question) {
  return compactText(
    question.summary ||
    question.shortSummary ||
    question.scenario ||
    question.question ||
    question.starterThought
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

function McqBlock({ question, selected, onSelect, showExplanation }) {
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
              aria-pressed={chosen}
              onClick={() => onSelect(index)}
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

export default memo(QuestionCard);
