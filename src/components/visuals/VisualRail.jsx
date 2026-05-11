import { useEffect, useMemo, useState } from 'react';

function formatMetricLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase());
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
        ← Prev
      </button>

      <button
        type="button"
        className="primary-playback"
        onClick={onTogglePlay}
        aria-label={playing ? 'Pause automatic walkthrough' : 'Start automatic walkthrough'}
      >
        {playing ? 'Pause' : 'Auto play'}
      </button>

      <button type="button" onClick={onNext} aria-label="Show next walkthrough step">
        Next →
      </button>

      <span>Step {activeIndex + 1} of {frameCount}</span>
    </div>
  );
}

function ActiveScene({ frame, activeIndex }) {
  const frameTypeClass = frame?.frameType
    ? `frame-type-${frame.frameType}`
    : 'frame-type-generic';

  return (
    <section
      className={`visual-active-scene ${frameTypeClass}`}
      key={`${frame?.label}-${activeIndex}`}
      aria-live="polite"
    >
      <div className="visual-active-image-shell">
        {frame?.image ? (
          <img
            src={frame.image}
            alt={frame.imageAlt || frame.label || 'Algorithm walkthrough frame'}
            className="visual-active-image"
            loading="eager"
          />
        ) : (
          <div className="visual-empty-image">No visual frame configured.</div>
        )}
      </div>

      <aside className="visual-active-state-card">
        <div className="visual-frame-labels">
          {frame?.label ? <span>{frame.label}</span> : null}
          {frame?.frameType ? <em className="visual-frame-type-tag">{frame.frameType}</em> : null}
        </div>

        {frame?.value ? <code>{frame.value}</code> : null}

        {frame?.metrics ? (
          <div className="visual-metrics-grid">
            {Object.entries(frame.metrics).map(([key, value]) => (
              <div className="visual-metric" key={key}>
                <small>{formatMetricLabel(key)}</small>
                <strong>{String(value)}</strong>
              </div>
            ))}
          </div>
        ) : null}

        {frame?.note ? <p className="visual-active-note">{frame.note}</p> : null}
      </aside>
    </section>
  );
}

function Timeline({ frames, activeIndex, onSelect }) {
  if (frames.length <= 1) return null;

  return (
    <div className="visual-timeline" data-no-card-nav aria-label="Walkthrough timeline">
      {frames.map((frame, index) => (
        <button
          type="button"
          key={`${frame.label || frame.value}-${index}`}
          className={`visual-timeline-step ${index === activeIndex ? 'active' : ''}`}
          onClick={() => onSelect(index)}
          aria-label={`Show step ${index + 1}: ${frame.label || 'walkthrough frame'}`}
        >
          <span>{index + 1}</span>
          <strong>{frame.label || `Step ${index + 1}`}</strong>
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
    }, diagram?.intervalMs || 2600);

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

  const selectStep = (index) => {
    setPlaying(false);
    setActiveIndex(index);
  };

  return (
    <div className="visual-diagram visual-synchronized-diagram" aria-label={diagram.title || 'Visual diagram'}>
      <div className="visual-diagram-header visual-diagram-header-row">
        <div>
          {diagram.title ? <strong>{diagram.title}</strong> : null}
          {activeFrame?.scene?.caption ? <p>{activeFrame.scene.caption}</p> : null}
        </div>

        <PlaybackControls
          activeIndex={activeIndex}
          frameCount={frames.length}
          playing={playing}
          onPrevious={goPrevious}
          onNext={goNext}
          onTogglePlay={() => setPlaying((current) => !current)}
        />
      </div>

      <div className="visual-progress-track" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <StateHud frame={activeFrame} />

      <ActiveScene frame={activeFrame} activeIndex={activeIndex} />

      <Timeline frames={frames} activeIndex={activeIndex} onSelect={selectStep} />
    </div>
  );
}

export default VisualRail;
