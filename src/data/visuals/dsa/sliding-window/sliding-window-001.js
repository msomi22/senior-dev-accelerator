import firstWindowImage from '../../../../assets/visuals/sliding-window-001/k-day-volume-01-first-window.svg';
import slideRightImage from '../../../../assets/visuals/sliding-window-001/k-day-volume-02-slide-right.svg';
import bestWindowImage from '../../../../assets/visuals/sliding-window-001/k-day-volume-03-best-window.svg';

const visualWalkthrough = {
  title: 'Maximum Sum Subarray of Size K — visual walkthrough',
  summary: 'Fixed-size sliding window: build the first k items once, then slide exactly one step at a time by subtracting the value leaving the window and adding the value entering it.',
  diagram: {
    title: 'Cinematic state trace for nums = [2, 1, 5, 1, 3, 2], k = 3',
    frames: [
      {
        label: '1. First full window',
        image: firstWindowImage,
        imageAlt: 'First fixed-size window covering values 2, 1, and 5 with sum 8',
        value: 'nums:      2   1   5   1   3   2\nwindow:   [2   1   5]\nsum:      2 + 1 + 5 = 8\nmaxSum:   8',
        note: 'The first k values create the first valid candidate. No shrinking loop is needed because the size is fixed.',
        metrics: {
          window: '[2, 1, 5]',
          windowSum: 8,
          maxSum: 8,
          leaving: '—',
          entering: '2, 1, 5'
        }
      },
      {
        label: '2. Slide right once',
        image: slideRightImage,
        imageAlt: 'Fixed-size window slides right by removing 2 and adding 1',
        value: 'leave: 2, enter: 1\nwindow:       [1   5   1]\nsum: 8 - 2 + 1 = 7\nmaxSum: max(8, 7) = 8',
        note: 'A fixed-size window reuses the previous sum instead of recalculating all three values.',
        metrics: {
          window: '[1, 5, 1]',
          windowSum: 7,
          maxSum: 8,
          leaving: 2,
          entering: 1
        }
      },
      {
        label: '3. Best window appears',
        image: bestWindowImage,
        imageAlt: 'Best fixed-size window covering values 5, 1, and 3 with sum 9',
        value: 'leave: 1, enter: 3\nwindow:           [5   1   3]\nsum: 7 - 1 + 3 = 9\nmaxSum: max(8, 9) = 9',
        note: 'This is the best window so far, so maxSum changes from 8 to 9.',
        metrics: {
          window: '[5, 1, 3]',
          windowSum: 9,
          maxSum: 9,
          leaving: 1,
          entering: 3
        }
      },
      {
        label: '4. Final slide confirms answer',
        image: bestWindowImage,
        imageAlt: 'Best window remains 5, 1, and 3 while the final candidate is checked',
        value: 'leave: 5, enter: 2\nwindow:               [1   3   2]\nsum: 9 - 5 + 2 = 6\nmaxSum: max(9, 6) = 9',
        note: 'The scan ends after the last size-k window. The answer remains 9 because no later window beats [5, 1, 3].',
        metrics: {
          window: '[1, 3, 2]',
          windowSum: 6,
          maxSum: 9,
          leaving: 5,
          entering: 2
        }
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
