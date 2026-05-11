import { useEffect, useMemo, useRef, useState } from 'react';

function formatMetricLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase());
}

function LaneMotionScene({ diagram, activeFrame }) {
  const scene = diagram?.laneScene;
  const frameScene = activeFrame?.scene;

  if (!scene?.positions?.length || !scene?.lanes?.length || !frameScene) return null;

  const obstacles = scene.obstacles || [];
  const dpState = frameScene.dp || [];

  function isBlocked(lane, position) {
    return obstacles.some((item) => item.lane === lane && item.position === position);
  }

  return (
    <section className="lane-motion-scene" aria-label={scene.title || 'Animated lane diagram'}>
      <div className="lane-motion-head">
        <div>
          <span className="mini-label">Animated mental model</span>
          <strong>{scene.title || 'Lane transition view'}</strong>
        </div>
        <div className="lane-motion-position-pill">Position {frameScene.position}</div>
      </div>

      <div className="lane-road" style={{ '--position-count': scene.positions.length }}>
        <div className="lane-axis lane-axis-top">
          <span />
          {scene.positions.map((position) => (
            <strong key={position}>{position}</strong>
          ))}
        </div>

        {scene.lanes.map((lane) => (
          <div className="lane-row" key={lane}>
            <strong className="lane-label">Lane {lane}</strong>
            {scene.positions.map((position) => {
              const blocked = isBlocked(lane, position);
              const activeColumn = frameScene.position === position;
              const frogHere = frameScene.frogLane === lane && frameScene.position === position;
              const openCurrentLane = activeColumn && !blocked;

              return (
                <div
                  key={`${lane}-${position}`}
                  className={[
                    'lane-cell',
                    blocked ? 'blocked' : '',
                    activeColumn ? 'active-column' : '',
                    openCurrentLane ? 'open-current-lane' : '',
                    frogHere ? 'frog-cell' : ''
                  ].filter(Boolean).join(' ')}
                >
                  {blocked ? <span className="obstacle-token">×</span> : null}
                  {frogHere ? <span className="frog-token" aria-label="frog">🐸</span> : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="lane-dp-strip" aria-label="Compressed dynamic programming state">
        {scene.lanes.map((lane, index) => (
          <div
            className={[
              'lane-dp-chip',
              frameScene.blockedLane === lane ? 'blocked' : '',
              frameScene.frogLane === lane ? 'frog-lane' : ''
            ].filter(Boolean).join(' ')}
            key={lane}
          >
            <small>Lane {lane}</small>
            <strong>{String(dpState[index] ?? '—')}</strong>
          </div>
        ))}
      </div>

      {frameScene.caption ? <p className="lane-motion-caption">{frameScene.caption}</p> : null}
    </section>
  );
}

function VisualFrame({ frame, index, active }) {
  const frameTypeClass = frame?.frameType
    ? `frame-type-${frame.frameType}`
    : 'frame-type-generic';

  return (
    <article
      className={`visual-frame cinematic-frame ${frameTypeClass} ${active ? 'active' : ''}`}
      data-frame-index={index}
    >
      <div className="visual-frame-top">
        <div className="visual-frame-labels">
          {frame.label ? <span>{frame.label}</span> : null}

          {frame.frameType ? (
            <em className="visual-frame-type-tag">{frame.frameType}</em>
          ) : null}
        </div>
      </div>

      {frame.image ? (
        <div className="visual-frame-image-shell">
          <img
            src={frame.image}
            alt={frame.imageAlt || frame.label || 'Algorithm walkthrough frame'}
            className="visual-frame-image"
            loading="lazy"
          />
        </div>
      ) : null}

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
  );
}

function StateHud({ frame }) {
  if (!frame?.metrics) return null;

  return (
    <div className="visual-state-hud" aria-label="Current algorithm state">
      {Object.entries(frame.metrics).map(([key, value]) => (
        <div key={key}>
          <small>{formatMetricLabel(key)}</small>
          <strong>{String(value)}</strong>
        </div>
      ))}
    </div>
  );
}

function PlaybackControls({ activeIndex, frameCount, playing, onPrevious, onNext, onTogglePlay }) {
  if (frameCount <= 1) return null;

  return (
    <div className="visual-playback-controls" data-no-card-nav>
      <button type="button" onClick={onPrevious} aria-label="Show previous walkthrough step">
        ← Prev step
      </button>

      <button
        type="button"
        className="primary-playback"
        onClick={onTogglePlay}
        aria-label={playing ? 'Pause automatic walkthrough' : 'Start automatic walkthrough'}
      >
        {playing ? 'Pause auto' : 'Auto walk'}
      </button>

      <button type="button" onClick={onNext} aria-label="Show next walkthrough step">
        Next step →
      </button>

      <span>Step {activeIndex + 1} of {frameCount}</span>
    </div>
  );
}

function VisualRail({ diagram }) {
  const frames = diagram?.frames || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const railRef = useRef(null);

  const activeFrame = frames[activeIndex];

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

  useEffect(() => {
    const activeNode = railRef.current?.querySelector(`[data-frame-index="${activeIndex}"]`);

    activeNode?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    });
  }, [activeIndex]);

  if (!frames.length) return null;

  const goPrevious = () => {
    setPlaying(false);
    setActiveIndex((current) => (current - 1 + frames.length) % frames.length);
  };

  const goNext = () => {
    setPlaying(false);
    setActiveIndex((current) => (current + 1) % frames.length);
  };

  return (
    <div className="visual-diagram" aria-label={diagram.title || 'Visual diagram'}>
      <div className="visual-diagram-header">
        {diagram.title ? <strong>{diagram.title}</strong> : null}

        <div className="visual-progress-track" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <StateHud frame={activeFrame} />

      <LaneMotionScene diagram={diagram} activeFrame={activeFrame} />

      <PlaybackControls
        activeIndex={activeIndex}
        frameCount={frames.length}
        playing={playing}
        onPrevious={goPrevious}
        onNext={goNext}
        onTogglePlay={() => setPlaying((current) => !current)}
      />

      <div className="visual-diagram-frames" ref={railRef}>
        {frames.map((frame, index) => (
          <button
            type="button"
            className="visual-frame-button"
            key={`${frame.label || frame.value}-${index}`}
            onClick={() => {
              setPlaying(false);
              setActiveIndex(index);
            }}
            data-no-card-nav
          >
            <VisualFrame frame={frame} index={index} active={index === activeIndex} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default VisualRail;
