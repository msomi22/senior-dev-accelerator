import { Fragment, useEffect, useMemo, useState } from 'react';

const INF = '∞';

function formatDpValue(value) {
  return value === INF || value === 'Infinity' || value === Infinity ? INF : value;
}

function LegendItem({ marker, label }) {
  return (
    <span className="road-dp-legend-item">
      <span aria-hidden="true">{marker}</span>
      {label}
    </span>
  );
}

export default function RoadDpWalkthrough({ visual }) {
  const steps = visual?.steps || [];
  const obstacles = visual?.obstacles || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const activeStep = steps[activeIndex] || steps[0];
  const finalPosition = Math.max(0, obstacles.length - 1);
  const visibleSteps = useMemo(() => steps.slice(0, activeIndex + 1), [activeIndex, steps]);

  useEffect(() => {
    if (!playing || steps.length <= 1) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => {
        if (current >= steps.length - 1) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 1200);

    return () => window.clearInterval(timer);
  }, [playing, steps.length]);

  if (!steps.length) return null;

  const goPrevious = () => {
    setPlaying(false);
    setActiveIndex((current) => Math.max(0, current - 1));
  };

  const goNext = () => {
    setPlaying(false);
    setActiveIndex((current) => Math.min(steps.length - 1, current + 1));
  };

  const togglePlay = () => {
    if (activeIndex >= steps.length - 1) {
      setActiveIndex(0);
      setPlaying(true);
      return;
    }
    setPlaying((current) => !current);
  };

  return (
    <section className="road-dp-walkthrough" aria-label={visual?.title || 'Road DP walkthrough'}>
      <style>{`
        .road-dp-walkthrough { display: grid; gap: 1rem; }
        .road-dp-grid { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.85fr); gap: 1rem; align-items: start; }
        .road-dp-card { border: 1px solid rgba(86, 67, 42, 0.16); border-radius: 24px; background: rgba(255, 252, 244, 0.78); box-shadow: 0 18px 45px rgba(74, 53, 27, 0.08); padding: 1rem; }
        .road-dp-card h3 { margin: 0 0 0.35rem; font-family: var(--font-serif); font-size: 1.1rem; color: var(--text-strong, #2f261b); }
        .road-dp-muted { margin: 0 0 0.85rem; color: var(--text-muted, #756a5a); font-size: 0.92rem; }
        .road-dp-road { display: grid; grid-template-columns: 5.2rem repeat(var(--road-columns), minmax(44px, 1fr)); gap: 0.45rem; overflow-x: auto; padding-bottom: 0.25rem; }
        .road-dp-position-label, .road-dp-lane-label { color: var(--text-muted, #756a5a); font-size: 0.78rem; font-weight: 700; text-align: center; }
        .road-dp-lane-label { display: flex; align-items: center; justify-content: flex-start; text-align: left; }
        .road-dp-cell { min-width: 44px; min-height: 44px; border: 1px solid rgba(86, 67, 42, 0.14); border-radius: 15px; background: rgba(255, 255, 255, 0.54); display: grid; place-items: center; font-weight: 800; transition: transform 160ms ease, background 160ms ease, border-color 160ms ease; }
        .road-dp-cell.active { background: rgba(234, 190, 117, 0.22); border-color: rgba(154, 104, 34, 0.35); transform: translateY(-1px); }
        .road-dp-cell.blocked { background: rgba(140, 57, 44, 0.1); color: #8c392c; }
        .road-dp-cell.goal { box-shadow: inset 0 0 0 1px rgba(78, 116, 76, 0.2); }
        .road-dp-cell.frog { background: rgba(82, 116, 76, 0.16); border-color: rgba(82, 116, 76, 0.35); }
        .road-dp-legend { display: flex; flex-wrap: wrap; gap: 0.45rem; margin: 0.9rem 0; }
        .road-dp-legend-item { display: inline-flex; align-items: center; gap: 0.35rem; border: 1px solid rgba(86, 67, 42, 0.12); background: rgba(255,255,255,0.5); border-radius: 999px; padding: 0.35rem 0.55rem; font-size: 0.8rem; color: var(--text-muted, #756a5a); }
        .road-dp-controls { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; margin-top: 0.9rem; }
        .road-dp-controls button { border: 1px solid rgba(86, 67, 42, 0.16); border-radius: 999px; background: rgba(255, 255, 255, 0.68); color: var(--text-strong, #2f261b); padding: 0.45rem 0.7rem; font: inherit; font-weight: 800; cursor: pointer; }
        .road-dp-controls button:disabled { cursor: not-allowed; opacity: 0.48; }
        .road-dp-step-count { margin-left: auto; color: var(--text-muted, #756a5a); font-size: 0.84rem; font-weight: 800; }
        .road-dp-explanation { margin-top: 0.85rem; border-radius: 18px; background: rgba(255, 255, 255, 0.58); border: 1px solid rgba(86, 67, 42, 0.12); padding: 0.85rem; }
        .road-dp-explanation strong { display: block; margin-bottom: 0.25rem; color: var(--text-strong, #2f261b); }
        .road-dp-explanation p { margin: 0; color: var(--text-muted, #756a5a); line-height: 1.55; }
        .road-dp-table { display: grid; gap: 0.45rem; }
        .road-dp-row { display: grid; grid-template-columns: 3.2rem minmax(0, 1fr); gap: 0.5rem; align-items: center; border: 1px solid rgba(86, 67, 42, 0.12); border-radius: 16px; background: rgba(255,255,255,0.48); padding: 0.55rem; }
        .road-dp-row.active { background: rgba(234, 190, 117, 0.2); border-color: rgba(154, 104, 34, 0.28); }
        .road-dp-row-index { font-weight: 900; color: var(--text-strong, #2f261b); }
        .road-dp-values { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .road-dp-value { border-radius: 999px; background: rgba(255, 252, 244, 0.9); border: 1px solid rgba(86, 67, 42, 0.12); padding: 0.25rem 0.45rem; font-family: var(--font-mono); font-size: 0.8rem; }
        .road-dp-value.inf { color: #8c392c; font-weight: 900; }
        .road-dp-helper { grid-column: 2; margin: -0.18rem 0 0; color: var(--text-muted, #756a5a); font-size: 0.78rem; }
        .road-dp-final { border: 1px solid rgba(82, 116, 76, 0.24); background: rgba(82, 116, 76, 0.12); border-radius: 20px; padding: 0.9rem; margin-top: 1rem; }
        .road-dp-final strong { display: block; margin-bottom: 0.25rem; color: var(--text-strong, #2f261b); }
        .road-dp-final p { margin: 0; color: var(--text-muted, #756a5a); }
        @media (max-width: 860px) { .road-dp-grid { grid-template-columns: 1fr; } .road-dp-step-count { width: 100%; margin-left: 0; } }
      `}</style>

      <div className="road-dp-grid">
        <div className="road-dp-card">
          <h3>{visual?.title || 'Three-lane road'}</h3>
          <p className="road-dp-muted">Move forward for free when the lane is open, or side-jump once when an obstacle blocks the path.</p>

          <div className="road-dp-road" style={{ '--road-columns': obstacles.length }}>
            <span aria-hidden="true" />
            {obstacles.map((_, position) => (
              <span className="road-dp-position-label" key={`position-${position}`}>{position}</span>
            ))}
            {[1, 2, 3].map((lane) => (
              <Fragment key={`lane-${lane}`}>
                <span className="road-dp-lane-label" key={`lane-label-${lane}`}>Lane {lane}</span>
                {obstacles.map((blockedLane, position) => {
                  const blocked = blockedLane === lane;
                  const frog = activeStep?.position === position && activeStep?.frogLane === lane;
                  const goal = position === finalPosition;
                  const active = activeStep?.position === position;
                  const className = ['road-dp-cell', blocked ? 'blocked' : '', frog ? 'frog' : '', goal ? 'goal' : '', active ? 'active' : ''].filter(Boolean).join(' ');
                  return (
                    <span className={className} key={`lane-${lane}-position-${position}`} aria-label={`Lane ${lane}, position ${position}`}>
                      {blocked ? 'X' : frog ? '🐸' : goal ? '🏁' : '→'}
                    </span>
                  );
                })}
              </Fragment>
            ))}
          </div>

          <div className="road-dp-legend" aria-label="Legend">
            <LegendItem marker="🐸" label="Frog" />
            <LegendItem marker="→" label="Move forward free" />
            <LegendItem marker="X" label="Blocked" />
            <LegendItem marker="🏁" label="Goal" />
          </div>

          <div className="road-dp-controls">
            <button type="button" onClick={goPrevious} disabled={activeIndex === 0}>Previous</button>
            <button type="button" onClick={togglePlay}>{playing ? 'Pause' : activeIndex >= steps.length - 1 ? 'Replay' : 'Play'}</button>
            <button type="button" onClick={goNext} disabled={activeIndex >= steps.length - 1}>Next</button>
            <span className="road-dp-step-count">Step {activeIndex + 1} of {steps.length}</span>
          </div>

          <div className="road-dp-explanation">
            <strong>What’s happening</strong>
            <p>{activeStep?.description}</p>
          </div>

          {activeStep?.final ? (
            <div className="road-dp-final" role="status">
              <strong>Final answer</strong>
              <p>Minimum sideway jumps = min({activeStep.dp.map(formatDpValue).join(', ')}) = {Math.min(...activeStep.dp.filter((value) => value !== INF && value !== Infinity))}</p>
            </div>
          ) : null}
        </div>

        <div className="road-dp-card">
          <h3>DP States Evolution</h3>
          <p className="road-dp-muted">Each row stores the best known cost as [lane 1, lane 2, lane 3].</p>
          <div className="road-dp-table">
            {visibleSteps.map((step, index) => (
              <div className={`road-dp-row ${index === activeIndex ? 'active' : ''}`} key={`dp-step-${index}`}>
                <span className="road-dp-row-index">P{step.position}</span>
                <span className="road-dp-values" aria-label={`DP state at position ${step.position}`}>
                  {step.dp.map((value, laneIndex) => {
                    const formatted = formatDpValue(value);
                    return <span className={`road-dp-value ${formatted === INF ? 'inf' : ''}`} key={`dp-${index}-${laneIndex}`}>{formatted}</span>;
                  })}
                </span>
                {step.helper ? <p className="road-dp-helper">{step.helper}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
