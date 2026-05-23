import { defineLearningProblem } from '../../../../problems/problemAuthoring.js';

const problem = defineLearningProblem({
  id: 'prefix-sum-hashing-product-except-self-001',
  topicId: 'prefix-sum-hashing',
  title: 'Product of Array Except Self — prefix/suffix thinking',
  difficulty: 'Medium',
  estimatedTime: '14 min',
  tags: ['arrays', 'prefix-suffix', 'interview-pattern', 'mental-model', 'visual-walkthrough'],
  scenario: 'For each index, return the product of every number except the number at that index, without using division.',
  prompt: 'How can prefix and suffix products solve “everything except me” without recomputing the full product each time?',
  starterThought: 'For each position, split the world into two safe parts: everything on the left and everything on the right.',
  plainLanguageExplanation: 'The answer at index i is the product before i multiplied by the product after i. Prefix products collect what is on the left. Suffix products collect what is on the right.',
  mentalPicture: 'Each number stands in the middle of a line. It cannot use itself, so it looks left for one product and right for another product. Multiplying those two views gives the answer.',
  bruteForceThought: 'Brute force recomputes a product for every index, repeatedly multiplying the same neighboring values.',
  optimizationJourney: 'Division looks tempting, but it is often disallowed and becomes awkward with zeros. Prefix/suffix thinking avoids division completely and treats zeros naturally.',
  finalPattern: 'Precompute information before and after each position.',
  commonMistake: 'The most common bug is accidentally including the current element in either the prefix or suffix product.',
  edgeCases: ['One zero in the array', 'Multiple zeros', 'Negative numbers', 'Array length two', 'Values of 1 that do not change the product'],
  complexityAnalysis: 'Time is O(n) because the array is scanned a small constant number of times. Extra space can be O(1) beyond the output array by storing prefix products in the output and using one running suffix value.',
  finalTakeaway: 'For “everything except me” problems, split the world into “left of me” and “right of me.”',
  selfExplanationPrompt: 'Explain why prefix at index i means product before i, not product through i.',
  body: [
    { type: 'callout', tone: 'info', title: 'Pattern signal', content: 'Use prefix/suffix thinking when each answer depends on all items except the current one, or on information from both sides.' },
    {
      type: 'table',
      title: 'Walkthrough: nums = [1, 2, 3, 4]',
      columns: ['Index', 'Value', 'Left product', 'Right product', 'Answer'],
      rows: [
        ['0', '1', '1', '24', '24'],
        ['1', '2', '1', '12', '12'],
        ['2', '3', '2', '4', '8'],
        ['3', '4', '6', '1', '6']
      ]
    },
    { type: 'flow', title: 'Space-optimized flow', steps: ['First pass: write product of everything to the left into output[i]', 'Second pass from right: keep a running right product', 'Multiply output[i] by the running right product', 'Update running right product after using index i'] },
    { type: 'checklist', title: 'Mistakes to avoid', items: ['Do not include nums[i]', 'Do not rely on division', 'Handle zeros through multiplication naturally', 'Explain output-array space separately from extra space'] }
  ],
  relatedConcepts: ['prefix products', 'suffix products', 'running accumulator'],
  metadata: {
    reviewStatus: 'approved',
    visibility: ['dev', 'prod']
  }
});

export default problem;
