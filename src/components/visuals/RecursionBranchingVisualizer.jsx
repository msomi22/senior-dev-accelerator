import { useEffect, useState } from 'react';
import './recursionBranchingVisualizer.css';

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function getStorageKey(diagram) {
  return `recursion-branching-step:${diagram?.id || diagram?.title || 'default'}`;
}

function readStoredStep(diagram, maxStep) {
  if (typeof window === 'undefined') return 0;

  const savedValue = window.sessionStorage.getItem(getStorageKey(diagram));
  const parsedValue = Number.parseInt(savedValue || '0', 10);

  if (Number.isNaN(parsedValue)) return 0;
  return Math.min(Math.max(parsedValue, 0), maxStep);
}

function kindClass(kind) {
  return `is-${kind || 'neutral'}`;
}

function StackFrame({ frame }) {
  return (
    <article className={`recursion-branching-stack-frame ${kindClass(frame.kind || frame.role)}`}>
      <strong>{frame.call || frame.label}</strong>
      {frame.detail ? <span>{frame.detail}</span> : null}
    </article>
  );
}

function InfoList({ title, emptyText, items = [], kind = 'neutral' }) {
  return (
    <section className="recursion-branching-panel">
      <h4>{title}</h4>
      <div className="recursion-branching-list">
        {items.length ? items.map((item, index) => (
          <article className={`recursion-branching-chip ${kindClass(item.kind || kind)}`} key={`${item.label || item}-${index}`}>
            <strong>{item.label || item}</strong>
            {item.detail ? <span>{item.detail}</span> : null}
          </article>
        )) : <p className="recursion-branching-empty">{emptyText}</p>}
      </div>
    </section>
  );
}

export default function RecursionBranchingVisualizer({ diagram }) {
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

  const activeFrame = frames[activeIndex] || frames[0];
  const stack = asArray(activeFrame.stack);
  const waiting = asArray(activeFrame.waiting);
  const returned = asArray(activeFrame.returned);
  const repeated = asArray(activeFrame.repeated);
  const tree = asArray(activeFrame.tree || diagram.tree);

  const goBack = () => setActiveIndex((current) => Math.max(0, current - 1));
  const goNext = () => setActiveIndex((current) => Math.min(maxStep, current + 1));
  const restart = () => setActiveIndex(0);

  return (
    <section className="recursion-branching-shell" aria-label={diagram.title || 'Branching recursion walkthrough'}>
      <header className="recursion-branching-header">
        <span className={`recursion-branching-action ${kindClass(activeFrame.kind)}`}>{activeFrame.action || `Step ${activeIndex + 1}`}</span>
        <div>
          <h3>{diagram.title || 'Branching recursion walkthrough'}</h3>
          {diagram.summary ? <p>{diagram.summary}</p> : null}
        </div>
      </header>

      <div className="recursion-branching-layout">
        <section className="recursion-branching-panel recursion-branching-stack-panel">
          <h4>{diagram.stackTitle || 'Active call stack'}</h4>
          <p className="recursion-branching-helper">Top of stack is shown first. Each card is one stack frame currently in memory.</p>
          <div className="recursion-branching-stack" aria-label="Current call stack">
            {stack.length ? stack.map((item, index) => <StackFrame frame={item} key={`${item.call || item.label}-${index}`} />) : (
              <p className="recursion-branching-empty">No stack frames yet.</p>
            )}
          </div>
        </section>

        <div className="recursion-branching-side-panels">
          <InfoList title="Paused parents" emptyText="No parent call is waiting yet." items={waiting} kind="waiting" />
          <InfoList title="Returned values" emptyText="No child call has returned yet." items={returned} kind="return" />
          <InfoList title="Repeated work" emptyText="No repeated call highlighted in this step." items={repeated} kind="repeat" />
        </div>
      </div>

      {tree.length ? (
        <section className="recursion-branching-tree" aria-label="Recursion tree checkpoints">
          <h4>{diagram.treeTitle || 'Recursion tree checkpoints'}</h4>
          <div>
            {tree.map((node, index) => (
              <span className={`recursion-branching-node ${kindClass(node.kind || node.role)}`} key={`${node.label}-${index}`}>{node.label}</span>
            ))}
          </div>
        </section>
      ) : null}

      {activeFrame.addition ? (
        <aside className="recursion-branching-addition" role="status">
          <strong>{activeFrame.addition.title || 'Value addition'}</strong>
          <p>{activeFrame.addition.body}</p>
        </aside>
      ) : null}

      <div className="recursion-branching-controls" data-no-card-nav>
        <button type="button" onClick={goBack} disabled={activeIndex === 0}>← Back</button>
        <button type="button" onClick={restart} disabled={activeIndex === 0}>↺ Restart</button>
        <p role="status"><strong>{activeFrame.title}</strong> {activeFrame.description}</p>
        <button type="button" className="recursion-branching-next" onClick={goNext} disabled={activeIndex >= maxStep}>Next →</button>
      </div>
    </section>
  );
}
