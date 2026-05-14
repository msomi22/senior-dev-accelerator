# Config-Driven Visual Schema

This project should treat quiz/problem visuals as data, not as one-off React components.

## Core rule

New quiz/problem additions should be config-only whenever they use an existing visual capability.

Normal problem additions should usually modify only files under:

```txt
src/data/banks/...
```

Core React changes are acceptable only when adding a new reusable visual capability that many future problems can use.

## Why this exists

Without a visual schema, every interesting problem risks adding a custom component and custom routing. That creates tech debt quickly.

The desired flow is:

```txt
Problem bank config
  -> visual schema
  -> reusable renderer
  -> consistent interactive walkthrough
```

## Supported visual types

| Type | Use for |
| --- | --- |
| `grid` | DP tables, matrices, boards, road/lane problems, obstacle traversal |
| `matrix` | Alias of `grid` |
| `board` | Alias of `grid` |
| `array` | Sliding window, two pointers, prefix sums, scans, partitions |
| `timeline` | Greedy choices, state transitions, process walkthroughs |
| `table` | Comparisons, DP state tables, complexity trade-offs |
| `cards` | Concept explanations, invariants, step grouping |
| `graph` | BFS, DFS, shortest path, relationship traversal |
| `tree` | Tree traversal, recursion, hierarchy problems |
| `heap` | Priority queues and heap state walkthroughs |
| `state` | State machine or transition walkthroughs |

## Shared diagram fields

```js
diagram: {
  type: 'array',
  variant: 'sliding-window',
  title: 'Maximum Sum Subarray of Size K',
  description: 'Explain what the visual is showing.',
  intervalMs: 1400,
  frames: []
}
```

### Required fields

| Field | Meaning |
| --- | --- |
| `type` | Visual family, such as `grid`, `array`, `graph` |
| `title` | Human-friendly visual title |
| `frames` | Ordered walkthrough steps |

### Recommended fields

| Field | Meaning |
| --- | --- |
| `variant` | Styling or learning mode hint, such as `dp-table`, `sliding-window`, `bfs` |
| `description` | One-line visual context |
| `stateTitle` | Title for the state panel |
| `stateDescription` | Explanation of state values |
| `legend` | Semantic labels for markers/roles |

## Frame shape

```js
{
  title: 'Current step title',
  description: 'What changed and why it matters.',
  state: {
    label: 'S1',
    values: [1, 0, 1],
    helper: 'Short state note.'
  }
}
```

## Semantic roles

Use semantic roles instead of raw CSS.

Common roles:

```txt
active
current
window
visited
blocked
goal
answer
success
error
muted
neutral
infinite
```

The renderer owns the styling. Problem config owns the meaning.

## Grid example

```js
visualWalkthrough: {
  diagram: {
    type: 'grid',
    variant: 'road',
    title: 'Three-lane road',
    rows: ['Lane 1', 'Lane 2', 'Lane 3'],
    columns: ['0', '1', '2', '3', '4', '5'],
    defaultCellLabel: '→',
    baseCells: [
      { row: 0, col: 1, role: 'blocked', label: 'X' }
    ],
    frames: [
      {
        title: 'Start',
        position: 0,
        cells: [{ row: 1, col: 0, role: 'active', label: '🐸' }],
        state: { label: 'P0', values: [1, 0, 1] },
        description: 'The frog starts in lane 2.'
      }
    ]
  }
}
```

## Array example

```js
diagram: {
  type: 'array',
  variant: 'sliding-window',
  title: 'Sliding window',
  values: [2, 1, 5, 1, 3, 2],
  frames: [
    {
      title: 'First full window',
      activeRange: [0, 2],
      state: { label: 'W0', values: { windowSum: 8, best: 8 } },
      description: 'The first valid window has sum 8.'
    }
  ]
}
```

## Graph example

```js
diagram: {
  type: 'graph',
  variant: 'bfs',
  title: 'BFS traversal',
  nodes: [
    { id: 'A', label: 'A' },
    { id: 'B', label: 'B' }
  ],
  edges: [
    { from: 'A', to: 'B' }
  ],
  frames: [
    {
      title: 'Visit A',
      activeNodes: ['A'],
      visitedNodes: [],
      state: { label: 'Queue', values: ['A'] },
      description: 'Start BFS from A.'
    }
  ]
}
```

## Guardrails

Do not add raw HTML or raw CSS into problem banks.

Prefer:

```js
{ role: 'blocked', label: 'X' }
```

Avoid:

```js
{ html: '<div class="custom-red-cell">X</div>' }
```

This keeps visuals safe, responsive, theme-consistent, and maintainable.

## Future renderer rule

If a visual cannot be expressed with the existing schema, first ask:

1. Can it be represented as `grid`, `array`, `timeline`, `table`, `cards`, or `graph`?
2. Can semantic roles express the difference?
3. Would a new renderer be reused by many problems?

Only create a new core renderer when the answer to #3 is yes.
