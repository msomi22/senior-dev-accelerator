import firstWindowImage from '../../../../assets/visuals/sliding-window-001/k-day-volume-01-first-window.svg';
import slideRightImage from '../../../../assets/visuals/sliding-window-001/k-day-volume-02-slide-right.svg';
import bestWindowImage from '../../../../assets/visuals/sliding-window-001/k-day-volume-03-best-window.svg';

const visualWalkthrough = {
  title: 'Maximum Sum Subarray of Size K — visual walkthrough',
  summary: 'Fixed-size sliding window: build the first k items once, then slide exactly one step at a time by subtracting the value leaving the window and adding the value entering it.',
  diagram: {
    title: 'State trace for nums = [2, 1, 5, 1, 3, 2], k = 3',
    frames: [
      {
        label: '1. First full window',
        value: 'nums:      2   1   5   1   3   2\nwindow:   [2   1   5]\nsum:      2 + 1 + 5 = 8\nmaxSum:   8',
        note: 'The first k values create the first valid candidate. No shrinking loop is needed because the size is fixed.'
      },
      {
        label: '2. Slide right once',
        value: 'leave: 2, enter: 1\nwindow:       [1   5   1]\nsum: 8 - 2 + 1 = 7\nmaxSum: max(8, 7) = 8',
        note: 'A fixed-size window reuses the previous sum instead of recalculating all three values.'
      },
      {
        label: '3. Slide right again',
        value: 'leave: 1, enter: 3\nwindow:           [5   1   3]\nsum: 7 - 1 + 3 = 9\nmaxSum: max(8, 9) = 9',
        note: 'This is the best window so far, so maxSum changes from 8 to 9.'
      },
      {
        label: '4. Final slide',
        value: 'leave: 5, enter: 2\nwindow:               [1   3   2]\nsum: 9 - 5 + 2 = 6\nmaxSum: max(9, 6) = 9',
        note: 'The scan ends after the last size-k window. The answer remains 9.'
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
  media: [
    {
      type: 'image',
      src: firstWindowImage,
      alt: 'First fixed-size window covering values 2, 1, and 5 with sum 8',
      caption: 'Frame 1: build the first complete k-day window and initialize maxSum.'
    },
    {
      type: 'image',
      src: slideRightImage,
      alt: 'Fixed-size window slides right by removing 2 and adding 1',
      caption: 'Frame 2: slide the window by subtracting the outgoing value and adding the incoming value.'
    },
    {
      type: 'image',
      src: bestWindowImage,
      alt: 'Best fixed-size window covering values 5, 1, and 3 with sum 9',
      caption: 'Frame 3: the best window becomes [5, 1, 3], producing maxSum = 9.'
    }
  ]
};

export default visualWalkthrough;
