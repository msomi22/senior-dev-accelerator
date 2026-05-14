export const visualSchemaExamples = {
  grid: {
    type: 'grid',
    variant: 'dp-table',
    title: 'Grid / matrix / board walkthrough',
    rows: ['row 0', 'row 1'],
    columns: ['0', '1', '2'],
    baseCells: [
      { row: 0, col: 1, role: 'blocked', label: 'X' }
    ],
    frames: [
      {
        title: 'Visit cell',
        position: 0,
        cells: [{ row: 1, col: 0, role: 'active', label: '●' }],
        state: { label: 'S0', values: [0, 1, 2] },
        description: 'Use grid for DP tables, matrix traversal, road/lane problems, and board-style walkthroughs.'
      }
    ]
  },

  array: {
    type: 'array',
    variant: 'sliding-window',
    title: 'Array walkthrough',
    values: [2, 1, 5, 1, 3, 2],
    frames: [
      {
        title: 'First window',
        activeRange: [0, 2],
        state: { label: 'W0', values: { windowSum: 8, best: 8 } },
        description: 'Use array for sliding window, two pointers, prefix sums, partitioning, and scan-based problems.'
      }
    ]
  },

  timeline: {
    type: 'timeline',
    variant: 'greedy',
    title: 'Timeline walkthrough',
    steps: [
      { title: 'Sort intervals', description: 'Prepare choices in the order the greedy invariant needs.' },
      { title: 'Pick earliest finish', description: 'Accept the next compatible interval.' }
    ],
    frames: [
      {
        title: 'Greedy decision',
        stepId: 'pick',
        state: { label: 'Decision', values: { selected: 1 } },
        description: 'Use timeline for greedy choices, state transitions, and process walkthroughs.'
      }
    ]
  },

  table: {
    type: 'table',
    variant: 'comparison',
    title: 'Table walkthrough',
    columns: ['Approach', 'Time', 'Space'],
    rows: [
      { Approach: 'Brute force', Time: 'O(n²)', Space: 'O(1)' },
      { Approach: 'Optimized', Time: 'O(n)', Space: 'O(1)' }
    ],
    frames: [
      {
        title: 'Compare approaches',
        description: 'Use table for DP state tables, trade-off comparisons, and structured reasoning.'
      }
    ]
  },

  cards: {
    type: 'cards',
    variant: 'concept',
    title: 'Concept cards',
    cards: [
      { title: 'Invariant', description: 'What must remain true after each step?', role: 'active' },
      { title: 'Transition', description: 'How does the state legally change?', role: 'neutral' }
    ],
    frames: [
      {
        title: 'Understand the invariant',
        description: 'Use cards for concept-first explanations and mental model building.'
      }
    ]
  },

  graph: {
    type: 'graph',
    variant: 'bfs',
    title: 'Graph walkthrough',
    nodes: [
      { id: 'A', label: 'A' },
      { id: 'B', label: 'B' },
      { id: 'C', label: 'C' }
    ],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' }
    ],
    frames: [
      {
        title: 'Visit A',
        activeNodes: ['A'],
        visitedNodes: [],
        state: { label: 'Queue', values: ['A'] },
        description: 'Use graph for BFS, DFS, shortest path, tree, and heap-like relationship visuals.'
      }
    ]
  }
};

export default visualSchemaExamples;
