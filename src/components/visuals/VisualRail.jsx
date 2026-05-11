import { useEffect, useMemo, useState } from 'react';

function formatMetricLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase());
}

function PlaybackControls({ activeIndex, frameCount, playing, onPrevious, onNext, onTogglePlay }) {
  if (frameCount <= 1) return null;

  return (
    <div className="visual-playback-controls visual-product-controls" data-no-card-nav>
      <button type="button" className="primary-playback" onClick={onTogglePlay}>
        {playing ? 'Pause' : '▶ Auto Play'}
      </button>
      <button type="button" onClick={onPrevious}>←</button>
      <span>Step {activeIndex + 1} of {frameCount}</span>
      <button type="button" onClick={onNext}>→</button>
    </div>
  );
}

function LaneRoadVisual({ diagram, activeFrame }) {
  const scene = diagram?.laneScene;
  const frameScene = activeFrame?.scene;

  if (!scene?.positions?.length || !scene?.lanes?.length || !frameScene) return null;

  const obstacles = scene.obstacles || [];

  function isBlocked(lane, position) {
    return obstacles.some((item) => item.lane === lane && item.position === position);
  }

  return (
    <div className="sideway-road-board" style={{ '--position-count': scene.positions.length }}>
      <div className="sideway-axis">
        <span>Position</span>
        {scene.positions.map((position) => (
          <strong key={position}>{position}</strong>
        ))}
      </div>

      {scene.lanes.map((lane) => (
        <div className="sideway-lane-row" key={lane}>
          <div className={`sideway-lane-label lane-${lane}`}>
            <span>{lane}</span>
            <strong>Lane {lane}</strong>
          </div>

          {scene.positions.map((position) => {
            const blocked = isBlocked(lane, position);
            const activeColumn = frameScene.position === position;
            const frogHere = frameScene.frogLane === lane && activeColumn;
            const goalColumn = position === scene.positions[scene.positions.length - 1];

            return (
              <div
                key={`${lane}-${position}`}
                className={[
                  'sideway-cell',
                  blocked ? 'blocked' : '',
                  activeColumn ? 'active-column' : '',
                  frogHere ? 'frog-here' : '',
                  goalColumn ? 'goal-cell' : ''
                ].filter(Boolean).join(' ')}
              >
                <span className="road-dash" />
                {blocked ? <span className="obstacle-token">×</span> : null}
                {frogHere ? <span className="frog-token" aria-label="frog">🐸</span> : null}
                {goalColumn ? <span className="goal-token">⚑</span> : null}
              </div>
            );
          })}
        </div>
      ))}

      <div className="sideway-legend">
        <span><b className="frog-dot">🐸</b> Frog</span>
        <span><b className="dash-dot" /> Move forward</span>
        <span><b className="blocked-dot">×</b> Blocked lane</span>
        <span><b className="goal-dot">⚑</b> End</span>
        <span><b className="jump-dot">↔</b> Side jump cost = 1</span>
      </div>
    </div>
  );
}

function DpStateCard({ frame, index, active, onSelect }) {
  const dp = frame?.scene?.dp || [];

  return (
    <button
      type="button"
      className={`dp-evolution-row ${active ? 'active' : ''}`}
      onClick={() => onSelect(index)}
      data-no-card-nav
    >
      <span className="dp-step-index">{index}</span>
      <div className="dp-step-title">
        <strong>{frame.label}</strong>
        <small>{frame.frameType?.replaceAll('-', ' ')}</small>
      </div>
      <code className="dp-state-code">[{dp.map((item) => String(item)).join(', ')}]</code>
      <p>{frame.note}</p>
    </button>
  );
}

function DpEvolutionPanel({ frames, activeIndex, onSelect }) {
  return (
    <section className="dp-evolution-panel">
      <div className="visual-panel-head">
        <div>
          <h3>DP States Evolution</h3>
          <p>States = [lane1, lane2, lane3]</p>
        </div>
      </div>

      <div className="dp-evolution-list">
        {frames.map((frame, index) => (
          <DpStateCard
            key={`${frame.label}-${index}`}
            frame={frame}
            index={index}
            active={index === activeIndex}
            onSelect={onSelect}
          />
        ))}
      </div>

      <div className="final-answer-card">
        <span>✓</span>
        <div>
          <strong>Final Answer: 2</strong>
          <p>Minimum sideway jumps to reach the end.</p>
        </div>
      </div>
    </section>
  );
}

function DpIntuitionPanel({ activeFrame }) {
  const dp = activeFrame?.scene?.dp || [];

  return (
    <section className="dp-intuition-panel">
      <div>
        <h3>🎯 DP Intuition</h3>
        <p>At each position, keep only three values: the minimum cost to end at lane 1, lane 2, or lane 3.</p>
      </div>

      <div className="dp-mini-state">
        {dp.map((value, index) => (
          <div key={`${value}-${index}`}>
            <small>Lane {index + 1}</small>
            <strong>{String(value)}</strong>
          </div>
        ))}
      </div>

      <p className="active-caption">{activeFrame?.scene?.caption || activeFrame?.note}</p>
    </section>
  );
}

function TakeawayPanel() {
  return (
    <section className="visual-takeaway-panel">
      <div>
        <h3>⭐ Key Takeaways</h3>
        <ul>
          <li>Only 3 states are needed, one per lane.</li>
          <li>Invalidate blocked lanes before relaxing side jumps.</li>
          <li>Each position costs O(1) work.</li>
        </ul>
      </div>
      <div className="complexity-chip">
        <strong>Complexity</strong>
        <span>Time: O(n)</span>
        <span>Space: O(1)</span>
      </div>
    </section>
  );
}

function GenericFrameRail({ frames, activeIndex, onSelect }) {
  return (
    <div className="visual-diagram-frames">
      {frames.map((frame, index) => (
        <button
          type="button"
          className={`visual-frame-button ${index === activeIndex ? 'active' : ''}`}
          key={`${frame.label || frame.value}-${index}`}
          onClick={() => onSelect(index)}
          data-no-card-nav
        >
          <article className={`visual-frame ${index === activeIndex ? 'active' : ''}`}>
            <div className="visual-frame-top">
              <div className="visual-frame-labels">
                {frame.label ? <span>{frame.label}</span> : null}
                {frame.frameType ? <em className="visual-frame-type-tag">{frame.frameType}</em> : null}
              </div>
            </div>
            <div className="visual-frame-side">
              {frame.value ? <code>{frame.value}</code> : null}
              {frame.metrics ? (
                <div className="visual-metrics-grid">
                  {Object.entries(frame.metrics).map(([key, value]) => (
                    <div className="visual-metric" key={key}>
                      <small>{formatMetricLabel(key)}</small>
                      <strong>{String(value)}</strong>
                    </div>
                  ))}
                </div>
              ) : null}
              {frame.note ? <small>{frame.note}</small> : null}
            </div>
          </article>
        </button>
      ))}
    </div>
  );
}

function VisualRail({ diagram }) {
  const frames = diagram?.frames || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const activeFrame = frames[activeIndex];
  const hasLaneScene = Boolean(diagram?.laneScene && activeFrame?.scene);

  const progress = useMemo(() => {
    if (frames.length <= 1) return 100;
    return ((activeIndex + 1) / frames.length) * 100;
  }, [activeIndex, frames.length]);

  useEffect(() => {
    setActiveIndex(0);
    setPlaying(false);
  }, [diagram]);

  useEffect(() => {
    if (!playing || frames.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % frames.length);
    }, diagram?.intervalMs || 2200);
    return () => window.clearInterval(timer);
  }, [playing, frames.length, diagram?.intervalMs]);

  if (!frames.length) return null;

  const goPrevious = () => {
    setPlaying(false);
    setActiveIndex((current) => (current - 1 + frames.length) % frames.length);
  };

  const goNext = () => {
    setPlaying(false);
    setActiveIndex((current) => (current + 1) % frames.length);
  };

  if (!hasLaneScene) {
    return (
      <div className="visual-diagram" aria-label={diagram.title || 'Visual diagram'}>
        <div className="visual-diagram-header">
          {diagram.title ? <strong>{diagram.title}</strong> : null}
          <div className="visual-progress-track" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
        </div>
        <PlaybackControls activeIndex={activeIndex} frameCount={frames.length} playing={playing} onPrevious={goPrevious} onNext={goNext} onTogglePlay={() => setPlaying((current) => !current)} />
        <GenericFrameRail frames={frames} activeIndex={activeIndex} onSelect={setActiveIndex} />
      </div>
    );
  }

  return (
    <div className="visual-product-shell" aria-label={diagram.title || 'Visual diagram'}>
      <div className="visual-progress-track" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>

      <div className="visual-product-grid">
        <section className="road-visual-panel">
          <div className="visual-panel-head visual-panel-head-row">
            <div>
              <h3>Three-lane road visualization</h3>
              <p>Follow the frog, obstacles, and active position.</p>
            </div>
            <PlaybackControls activeIndex={activeIndex} frameCount={frames.length} playing={playing} onPrevious={goPrevious} onNext={goNext} onTogglePlay={() => setPlaying((current) => !current)} />
          </div>
          <LaneRoadVisual diagram={diagram} activeFrame={activeFrame} />
          <DpIntuitionPanel activeFrame={activeFrame} />
        </section>

        <DpEvolutionPanel frames={frames} activeIndex={activeIndex} onSelect={(index) => { setPlaying(false); setActiveIndex(index); }} />
      </div>

      <div className="visual-bottom-grid">
        <section className="whats-happening-panel">
          <h3>📖 What’s Happening?</h3>
          <p>At each position, if a lane is blocked, we cannot stand on it. For open lanes, we either move forward for free or side jump from another lane with cost 1. We always keep the minimum cost for each lane.</p>
        </section>
        <TakeawayPanel />
      </div>
    </div>
  );
}

export default VisualRail;
