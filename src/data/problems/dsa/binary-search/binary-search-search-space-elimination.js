import { defineLearningProblem } from '../../../../problems/problemAuthoring.js';

const problem = defineLearningProblem({
  id: 'binary-search-search-space-elimination-001',
  topicId: 'binary-search',
  title: 'Binary Search — search space elimination',
  difficulty: 'Easy',
  estimatedTime: '12 min',
  tags: ['binary-search', 'arrays', 'interview-pattern', 'mental-model', 'visual-walkthrough'],
  scenario: 'Search for a target in a sorted array by repeatedly removing the half that cannot contain the answer.',
  prompt: 'Why is binary search about proving which side is impossible, not just guessing the middle?',
  starterThought: 'The middle value is evidence. Use it to discard a whole impossible side.',
  plainLanguageExplanation: 'Because the array is sorted, comparing the target with the middle value tells us which half cannot contain the target. If mid is too small, everything to the left is also too small. If mid is too large, everything to the right is also too large.',
  mentalPicture: 'Looking for a word in a dictionary. If the middle word comes before your word alphabetically, every earlier page can be ignored at once.',
  bruteForceThought: 'Linear search checks values one by one. It is simple, but it does not use the sorted order.',
  optimizationJourney: 'Sorted order gives a monotonic rule: once the middle is too small or too large, an entire side becomes impossible.',
  finalPattern: 'Search space elimination using a monotonic condition.',
  commonMistake: 'Off-by-one boundary updates can cause infinite loops. Each comparison must shrink the search space.',
  edgeCases: ['Empty array', 'One element', 'Target smaller than all values', 'Target larger than all values', 'Duplicate values if the problem asks for first or last occurrence'],
  complexityAnalysis: 'Time is O(log n) because each step cuts the remaining search space roughly in half. Space is O(1) for the iterative version.',
  finalTakeaway: 'Binary search is repeated proof that one side cannot contain the answer.',
  selfExplanationPrompt: 'Before revealing the next step, explain which range can be eliminated and why.',
  body: [
    { type: 'callout', tone: 'info', title: 'Pattern signal', content: 'Use binary search on sorted data or any monotonic yes/no condition where one side can be proven impossible.' },
    {
      type: 'table',
      title: 'Step frames: nums = [1, 3, 5, 7, 9, 11], target = 9',
      columns: ['Left', 'Right', 'Mid', 'nums[mid]', 'Comparison', 'Eliminated range', 'Remaining range'],
      rows: [
        ['0', '5', '2', '5', '5 < 9', '0..2', '3..5'],
        ['3', '5', '4', '9', '9 == 9', 'none', 'found at 4']
      ]
    },
    { type: 'flow', title: 'Boundary flow', steps: ['Set left and right to the searchable range', 'Compute mid safely', 'If nums[mid] equals target, return mid', 'If nums[mid] is too small, set left = mid + 1', 'If nums[mid] is too large, set right = mid - 1', 'Stop when left passes right'] },
    { type: 'checklist', title: 'Mistakes to avoid', items: ['Do not use binary search on unsorted data', 'Make every branch shrink the range', 'Be clear about inclusive versus exclusive boundaries', 'For first/last occurrence, keep searching after a match'] }
  ],
  relatedConcepts: ['sorted array', 'monotonic predicate', 'bounds'],
  metadata: {
    reviewStatus: 'approved',
    visibility: ['dev', 'prod']
  }
});

export default problem;
