import { useEffect, useState } from 'react';
import './recursionFactorialVisualizer.css';

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function getStorageKey(diagram) {
  return `recursion-factorial-step:${diagram?.id || diagram?.title || 'default'}`;
}

function readStoredStep(diagram, maxStep) {
  if (typeof window === 'undefined') return 0;

  const savedValue = window.sessionStorage.getItem(getStorageKey(diagram));
  const parsedValue = Number.parseInt(savedValue || '0', 10);

  if (Number.isNaN(parsedValue)) return 0;
  return Math.min(Math.max(parsedValue, 0), maxStep);
}

export default function RecursionFactorialVisualizer({ diagram }) {
  const frames = asArray(diagram?.frames);
  const maxStep = Math.max(0, frames.length - 1);
  const [activeIndex, setActiveIndex] = useState(() => readStoredStep(diagram, maxStep));

  useEffect(() => {
    setActiveIndex(readStoredStep(diagram, maxStep));
  }, [diagram, maxStep]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.sessionStorage.setItem(getStorageKey(diagram), String(activeIndex));
  }, [activeIndex, diagram]);

  if (!frames.length) return null;

  const descentSteps = asArray(diagram.descentSteps).length ? asArray(diagram.descentSteps) : [
    { step: 1, label: '1. fact(4)', value: '4!', kind: 'descent' },
    { step: 2, label: '2. fact(3)', value: '3!', kind: 'descent' },
    { step: 3, label: '3. fact(2)', value: '2!', kind: 'descent' },
    { step: 4, label: '✔ Base case: return 1', value: 'fact(1) = 1', kind: 'base' }
  ];

  const returnSteps = asArray(diagram.returnSteps).length ? asArray(diagram.returnSteps) : [
    { step: 8, label: 'fact(4) = 4 × fact(3)', value: 'fact(3) returned 6 → 24', kind: 'return' },
    { step: 7, label: 'fact(3) = 3 × fact(2)', value: 'fact(2) returned 2 → 6', kind: 'return' },
    { step: 6, label: 'fact(2) = 2 × fact(1)', value: 'fact(1) returned 1 → 2', kind: 'return' },
    { step: 5, label: 'fact(1) = 1', value: 'base case', kind: 'return' }
  ];

  const activeFrame = frames[activeIndex] || frames[0];

  const getStepClass = (step) => [
    'recursion-factorial-box',
    `is-${step.kind || 'descent'}`,
    activeIndex >= step.step ? 'is-visible' : '',
    activeIndex === step.step ? 'is-active' : ''
  ].filter(Boolean).join(' ');

  const goBack = () => setActiveIndex((current) => Math.max(0, current - 1));
  const goNext = () => setActiveIndex((current) => Math.min(maxStep, current + 1));
  const restart = () => setActiveIndex(0);

  return (
    <section className="recursion-factorial-shell" aria-label={diagram.title || 'Factorial recursion walkthrough'}>
      <div className="recursion-factorial-grid">
        <div className="recursion-factorial-column">
          <div className="recursion-factorial-header is-descent">
            <h3>{diagram.descentTitle || 'CALL STACK (DESCENT)'}</h3>
            <p>{diagram.descentSubtitle || 'We keep calling the function with smaller inputs.'}</p>
          </div>
          {descentSteps.map((step) => (
            <div className={getStepClass(step)} key={step.step}>
              <span>{step.label}</span>
              <span>{step.value}</span>
            </div>
          ))}
        </div>

        <div className="recursion-factorial-column">
          <div className="recursion-factorial-header is-return">
            <h3>{diagram.returnTitle || 'UNWINDING (RETURN)'}</h3>
            <p>{diagram.returnSubtitle || 'We return and build the result back up.'}</p>
          </div>
          <div className="recursion-factorial-return-list">
            {returnSteps.map((step) => (
              <div className={getStepClass(step)} key={step.step}>
                <span>{step.label}</span>
                <span>{step.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="recursion-factorial-controls" data-no-card-nav>
        <button type="button" className="recursion-factorial-back" onClick={goBack} disabled={activeIndex === 0}>← Back</button>
        <button type="button" className="recursion-factorial-restart" onClick={restart} disabled={activeIndex === 0}>↺ Restart</button>
        <p className="recursion-factorial-status" role="status">{activeFrame.description || diagram.summary}</p>
        <button type="button" className="recursion-factorial-next" onClick={goNext} disabled={activeIndex >= maxStep}>Next →</button>
      </div>
    </section>
  );
}
