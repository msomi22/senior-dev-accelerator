import { useEffect, useMemo, useState } from 'react';
import './recursionHanoiVisualizer.css';

const ROD_NAMES = {
  A: 'Source',
  B: 'Auxiliary',
  C: 'Target'
};

function getStorageKey(diagram) {
  return `recursion-hanoi-step:${diagram?.id || diagram?.title || 'default'}`;
}

function readStoredStep(diagram, maxStep) {
  if (typeof window === 'undefined') return -1;

  const savedValue = window.sessionStorage.getItem(getStorageKey(diagram));
  const parsedValue = Number.parseInt(savedValue || '-1', 10);

  if (Number.isNaN(parsedValue)) return -1;
  return Math.min(Math.max(parsedValue, -1), maxStep);
}

function makeTrace(diskCount) {
  const events = [];
  let callCounter = 0;

  function visit(n, source, auxiliary, target, depth = 0) {
    const callId = `hanoi-call-${callCounter}`;
    callCounter += 1;

    events.push({
      type: 'CALL',
      callId,
      n,
      source,
      auxiliary,
      target,
      depth,
      title: `Push hanoi(${n}, ${source}, ${auxiliary}, ${target})`,
      note: n === 1
        ? `Base case: one disk can move directly from ${source} to ${target}.`
        : `Pause this frame while it creates a smaller hanoi(${n - 1}) plan.`
    });

    if (n === 1) {
      events.push({
        type: 'MOVE',
        callId,
        disk: 1,
        from: source,
        to: target,
        title: `Emit move ${source} → ${target}`,
        note: 'The base case performs real work immediately, then returns.'
      });
      events.push({
        type: 'RETURN',
        callId,
        title: `Pop hanoi(1, ${source}, ${auxiliary}, ${target})`,
        note: 'The smallest problem is done, so its stack frame disappears.'
      });
      return;
    }

    events.push({
      type: 'PHASE',
      callId,
      phase: `1) Move ${n - 1} disk${n - 1 === 1 ? '' : 's'} from ${source} to ${auxiliary}`,
      title: `Phase 1: clear disk ${n}`,
      note: `The largest disk ${n} cannot move until the ${n - 1} smaller disk${n - 1 === 1 ? '' : 's'} move away.`
    });

    visit(n - 1, source, target, auxiliary, depth + 1);

    events.push({
      type: 'PHASE',
      callId,
      phase: `2) Move disk ${n} from ${source} to ${target}`,
      title: 'Phase 2: move the largest disk in this frame',
      note: `Now disk ${n} is exposed, so this waiting frame can emit its middle move.`
    });

    events.push({
      type: 'MOVE',
      callId,
      disk: n,
      from: source,
      to: target,
      title: `Emit move ${source} → ${target}`,
      note: `Disk ${n} moves once the smaller tower has been moved out of the way.`
    });

    events.push({
      type: 'PHASE',
      callId,
      phase: `3) Move ${n - 1} disk${n - 1 === 1 ? '' : 's'} from ${auxiliary} to ${target}`,
      title: `Phase 3: rebuild on top of disk ${n}`,
      note: `The smaller tower now moves from ${auxiliary} onto ${target}.`
    });

    visit(n - 1, auxiliary, source, target, depth + 1);

    events.push({
      type: 'RETURN',
      callId,
      title: `Pop hanoi(${n}, ${source}, ${auxiliary}, ${target})`,
      note: 'This frame has completed all three phases, so control returns to its parent.'
    });
  }

  visit(diskCount, 'A', 'B', 'C');
  return events;
}

function makeInitialRuntime(diskCount) {
  return {
    rods: {
      A: Array.from({ length: diskCount }, (_, index) => diskCount - index),
      B: [],
      C: []
    },
    stack: [],
    completedMoves: [],
    activeEvent: null,
    latestMove: null
  };
}

function buildRuntime(events, activeIndex, diskCount) {
  const runtime = makeInitialRuntime(diskCount);

  for (let index = 0; index <= activeIndex; index += 1) {
    const event = events[index];
    if (!event) continue;

    runtime.activeEvent = event;

    if (event.type === 'CALL') {
      if (runtime.stack.length > 0) {
        runtime.stack[runtime.stack.length - 1] = {
          ...runtime.stack[runtime.stack.length - 1],
          status: `Paused: waiting for hanoi(${event.n}, ${event.source}, ${event.auxiliary}, ${event.target})`,
          phase: 'paused'
        };
      }

      runtime.stack.push({
        callId: event.callId,
        n: event.n,
        source: event.source,
        auxiliary: event.auxiliary,
        target: event.target,
        status: event.note,
        phase: 'active'
      });
    }

    if (event.type === 'PHASE') {
      const frameIndex = runtime.stack.findIndex((frame) => frame.callId === event.callId);
      if (frameIndex >= 0) {
        runtime.stack[frameIndex] = {
          ...runtime.stack[frameIndex],
          status: event.phase,
          phase: frameIndex === runtime.stack.length - 1 ? 'active' : 'paused'
        };
      }
    }

    if (event.type === 'MOVE') {
      const movingDisk = runtime.rods[event.from].pop();
      const disk = movingDisk ?? event.disk;

      runtime.rods[event.to].push(disk);
      runtime.latestMove = { ...event, disk };
      runtime.completedMoves.push(`${runtime.completedMoves.length + 1}. Disk ${disk}: ${event.from} → ${event.to}`);

      const frameIndex = runtime.stack.findIndex((frame) => frame.callId === event.callId);
      if (frameIndex >= 0) {
        runtime.stack[frameIndex] = {
          ...runtime.stack[frameIndex],
          status: `Emitted move ${event.from} → ${event.to}`,
          phase: 'active'
        };
      }
    }

    if (event.type === 'RETURN') {
      const returningIndex = runtime.stack.findIndex((frame) => frame.callId === event.callId);
      if (returningIndex >= 0) {
        runtime.stack.splice(returningIndex, 1);
      }

      if (runtime.stack.length > 0) {
        runtime.stack[runtime.stack.length - 1] = {
          ...runtime.stack[runtime.stack.length - 1],
          status: 'Resumed after child returned',
          phase: 'active'
        };
      }
    }
  }

  return runtime;
}

function Disk({ size, diskCount, isMoving }) {
  const width = `${46 + (size / diskCount) * 44}%`;

  return (
    <div
      className={`recursion-hanoi-disk disk-${size} ${isMoving ? 'is-moving' : ''}`}
      style={{ width }}
    >
      Disk {size}
    </div>
  );
}

function Rod({ rodId, disks, diskCount, latestMove }) {
  const movingDiskOnRod = latestMove?.to === rodId ? latestMove.disk : null;

  return (
    <article className="recursion-hanoi-rod-card">
      <header>
        <strong>Rod {rodId}</strong>
        <span>{ROD_NAMES[rodId]}</span>
      </header>

      <div className="recursion-hanoi-rod-stage" aria-label={`Rod ${rodId}, ${ROD_NAMES[rodId]}`}>
        <div className="recursion-hanoi-rod-pole" aria-hidden="true" />
        <div className="recursion-hanoi-disk-stack">
          {disks.map((disk) => (
            <Disk
              size={disk}
              diskCount={diskCount}
              isMoving={movingDiskOnRod === disk}
              key={`${rodId}-${disk}`}
            />
          ))}
        </div>
      </div>
    </article>
  );
}

function StackFrame({ frame, index, total }) {
  const isTop = index === 0;

  return (
    <article className={`recursion-hanoi-frame ${isTop ? 'is-active' : 'is-paused'}`}>
      <div>
        <strong>hanoi({frame.n}, {frame.source}, {frame.auxiliary}, {frame.target})</strong>
        <small>{isTop ? 'Currently executing' : `Waiting below stack depth ${total - index}`}</small>
      </div>
      <p>{frame.status}</p>
    </article>
  );
}

function MoveList({ moves }) {
  const visibleMoves = moves.slice(-5);

  return (
    <div className="recursion-hanoi-moves">
      <h4>Emitted Moves</h4>
      {visibleMoves.length ? (
        <ol>
          {visibleMoves.map((move) => <li key={move}>{move}</li>)}
        </ol>
      ) : (
        <p>No move has been emitted yet. The first few clicks only build the recursive plan in memory.</p>
      )}
    </div>
  );
}

export default function RecursionHanoiVisualizer({ diagram }) {
  const diskCount = Number.isInteger(diagram?.disks) ? diagram.disks : 3;
  const events = useMemo(() => makeTrace(diskCount), [diskCount]);
  const maxStep = events.length - 1;
  const [activeIndex, setActiveIndex] = useState(() => readStoredStep(diagram, maxStep));

  useEffect(() => {
    setActiveIndex(readStoredStep(diagram, maxStep));
  }, [diagram, maxStep]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.sessionStorage.setItem(getStorageKey(diagram), String(activeIndex));
  }, [activeIndex, diagram]);

  const runtime = useMemo(() => buildRuntime(events, activeIndex, diskCount), [events, activeIndex, diskCount]);
  const activeEvent = runtime.activeEvent;
  const stackTopFirst = [...runtime.stack].reverse();
  const progress = activeIndex < 0 ? 0 : ((activeIndex + 1) / events.length) * 100;

  const goBack = () => setActiveIndex((current) => Math.max(-1, current - 1));
  const goNext = () => setActiveIndex((current) => Math.min(maxStep, current + 1));
  const restart = () => setActiveIndex(-1);

  return (
    <section className="recursion-hanoi-shell" aria-label={diagram?.title || `Tower of Hanoi with ${diskCount} disks`}>
      <header className="recursion-hanoi-hero">
        <span className="recursion-hanoi-kicker">Recursive planning + computer memory</span>
        <h3>{diagram?.title || `Tower of Hanoi(${diskCount}) - Move Planning in Memory`}</h3>
        <p>{diagram?.summary || 'Watch rods, disks, stack frames, paused calls, emitted moves, and returns happen together.'}</p>
      </header>

      <div className="recursion-hanoi-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="recursion-hanoi-controls" data-no-card-nav>
        <button type="button" onClick={goBack} disabled={activeIndex < 0}>Previous Step</button>
        <button type="button" className="recursion-hanoi-next" onClick={goNext} disabled={activeIndex >= maxStep}>Next Step</button>
        <button type="button" onClick={restart} disabled={activeIndex < 0}>Restart</button>
        <span>Step {activeIndex + 1 <= 0 ? 0 : activeIndex + 1} of {events.length}</span>
      </div>

      <div className="recursion-hanoi-current-card">
        <strong>{activeEvent?.title || 'Ready: click Next Step to push the first stack frame.'}</strong>
        <p>{activeEvent?.note || 'The computer begins with all disks on Rod A. Nothing has moved yet because no function call has started.'}</p>
        {runtime.latestMove ? (
          <code>Latest move: Disk {runtime.latestMove.disk} from {runtime.latestMove.from} to {runtime.latestMove.to}</code>
        ) : (
          <code>Latest move: none yet</code>
        )}
      </div>

      <div className="recursion-hanoi-layout">
        <section className="recursion-hanoi-board-card">
          <h4>Rods and Disks</h4>
          <div className="recursion-hanoi-rods">
            {Object.entries(runtime.rods).map(([rodId, disks]) => (
              <Rod
                rodId={rodId}
                disks={disks}
                diskCount={diskCount}
                latestMove={runtime.latestMove}
                key={rodId}
              />
            ))}
          </div>
        </section>

        <aside className="recursion-hanoi-memory-card">
          <h4>Call Stack (Top First)</h4>
          <div className="recursion-hanoi-stack">
            {stackTopFirst.length ? (
              stackTopFirst.map((frame, index) => (
                <StackFrame frame={frame} index={index} total={stackTopFirst.length} key={`${frame.callId}-${index}`} />
              ))
            ) : (
              <p className="recursion-hanoi-empty">Stack is empty. The full plan has returned.</p>
            )}
          </div>

          <MoveList moves={runtime.completedMoves} />
        </aside>
      </div>
    </section>
  );
}
