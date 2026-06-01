const visualWalkthrough = {
  title: 'Maximum Sum Subarray of Size K — visual walkthrough',
  summary: 'Fixed-size sliding window: build the first k items once, then slide exactly one step at a time by subtracting the value leaving the window and adding the value entering it.',
  diagram: {
    type: 'array',
    variant: 'sliding-window',
    title: 'Fixed-size window trace for nums = [2, 1, 5, 1, 3, 2], k = 3',
    description: 'Each frame shows the active window, the value leaving, the value entering, and the rolling best sum.',
    values: [2, 1, 5, 1, 3, 2],
    stateTitle: 'Rolling window state',
    stateDescription: 'The state panel tracks the exact values reused by the fixed-size window.',
    legend: [
      { role: 'window', marker: '[]', label: 'Current size-k window' },
      { role: 'remove', marker: '−', label: 'Outgoing value' },
      { role: 'current', marker: '+', label: 'Incoming value' },
      { role: 'answer', marker: '✓', label: 'Best answer so far' }
    ],
    frames: [
      {
        title: 'First full window',
        activeRange: [0, 2],
        items: [
          { index: 0, role: 'window', caption: 'window' },
          { index: 1, role: 'window', caption: 'window' },
          { index: 2, role: 'window', caption: 'window' }
        ],
        state: {
          label: 'window [0..2]',
          values: { window: '[2, 1, 5]', windowSum: 8, bestSum: 8 },
          helper: 'The first k values create the first valid candidate.'
        },
        description: 'Build the first valid window once: 2 + 1 + 5 = 8. bestSum starts at 8.'
      },
      {
        title: 'Slide right once',
        activeRange: [1, 3],
        items: [
          { index: 0, role: 'remove', caption: 'remove 2' },
          { index: 1, role: 'window', caption: 'window' },
          { index: 2, role: 'window', caption: 'window' },
          { index: 3, role: 'current', caption: 'add 1' }
        ],
        state: {
          label: 'window [1..3]',
          values: { outgoing: 2, incoming: 1, windowSum: 7, bestSum: 8 },
          helper: 'Reuse the old sum: 8 - 2 + 1 = 7. The best sum stays 8.'
        },
        description: 'Only one value leaves and one value enters, so the sum updates in constant time.'
      },
      {
        title: 'Best window appears',
        activeRange: [2, 4],
        items: [
          { index: 1, role: 'remove', caption: 'remove 1' },
          { index: 2, role: 'answer', caption: 'best' },
          { index: 3, role: 'answer', caption: 'best' },
          { index: 4, role: 'answer', caption: 'add 3' }
        ],
        state: {
          label: 'window [2..4]',
          values: { outgoing: 1, incoming: 3, windowSum: 9, bestSum: 9 },
          helper: '7 - 1 + 3 = 9, so bestSum improves from 8 to 9.'
        },
        description: 'The window [5, 1, 3] becomes the strongest candidate seen so far.'
      },
      {
        title: 'Final slide confirms the answer',
        activeRange: [3, 5],
        items: [
          { index: 2, role: 'remove', caption: 'remove 5' },
          { index: 3, role: 'window', caption: 'window' },
          { index: 4, role: 'window', caption: 'window' },
          { index: 5, role: 'current', caption: 'add 2' }
        ],
        state: {
          label: 'window [3..5]',
          values: { outgoing: 5, incoming: 2, windowSum: 6, bestSum: 9 },
          helper: '9 - 5 + 2 = 6. No later window beats [5, 1, 3].'
        },
        description: 'The scan ends after the last size-k window. Return bestSum = 9.',
        finalResult: { title: 'Final answer', body: 'Return 9.' }
      }
    ]
  },
  steps: [
    {
      title: 'Lock the window size',
      body: 'This problem is not about growing until invalid. Every candidate must contain exactly k elements.'
    },
    {
      title: 'Carry the rolling sum',
      body: 'When the window moves, one value exits and one value enters, so the new sum can be updated in constant time.'
    },
    {
      title: 'Compare only valid windows',
      body: 'Update maxSum only after the window has exactly k values. For the example, the best window is [5, 1, 3].'
    }
  ],
  productionMapping: [
    'Rolling transaction-volume dashboards',
    'K-minute fraud detection thresholds',
    'API rate-limit counters over fixed windows',
    'Moving averages in observability pipelines'
  ]
};

export default visualWalkthrough;
