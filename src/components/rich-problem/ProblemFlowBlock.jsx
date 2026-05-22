export default function ProblemFlowBlock({ block }) {
  const steps = Array.isArray(block.steps) ? block.steps : [];

  return (
    <section className="workspace-block problem-rich-block problem-flow-block">
      {block.title ? <span className="mini-label">{block.title}</span> : <span className="mini-label">Flow</span>}
      <ol className="problem-flow-list">
        {steps.map((step, index) => {
          const title = typeof step === 'string' ? step : step?.title;
          const detail = typeof step === 'string' ? null : step?.detail || step?.content;

          return (
            <li key={`${title || 'step'}-${index}`}>
              <span className="problem-flow-step-number">{index + 1}</span>
              <div>
                {title ? <strong>{title}</strong> : null}
                {detail ? <p>{detail}</p> : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
