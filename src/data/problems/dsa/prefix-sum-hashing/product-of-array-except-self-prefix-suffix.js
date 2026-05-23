import { defineLearningProblem } from '../../../../problems/problemAuthoring.js';

const problem = defineLearningProblem({
  id: 'prefix-sum-hashing-product-except-self-001',
  topicId: 'prefix-sum-hashing',
  title: 'Product of Array Except Self — prefix/suffix thinking',
  difficulty: 'Medium',
  estimatedTime: '14 min',
  language: 'java',
  tags: ['arrays', 'prefix-suffix', 'interview-pattern', 'mental-model', 'visual-walkthrough', 'coding'],
  scenario: 'For each index, multiply every other number except the number sitting at that index. That excluded number is called “self.”',
  question: 'Given nums = [1, 2, 3, 4], return [24, 12, 8, 6].',
  examples: ['nums = [1, 2, 3, 4] -> [24, 12, 8, 6]', 'At index 0, answer[0] excludes 1, so answer[0] = 2 × 3 × 4 = 24'],
  constraints: ['Do not use division.', 'Each output index must exclude nums[i].', 'Use prefix and suffix products to avoid repeated multiplication.'],
  starterThought: 'At every loop step, the current value is nums[i]. The code first stores the product before index i, then later multiplies by the product after index i.',
  intuition: '“Product except self” means each position gets the product of all the other positions. For [1, 2, 3, 4], answer[0] excludes 1 and becomes 2 × 3 × 4 = 24. answer[1] excludes 2 and becomes 1 × 3 × 4 = 12.',
  mentalPicture: 'Imagine each answer slot pointing to one input number and saying, “leave this one out, multiply the rest.” In code, the excluded number is nums[i].',
  patternSignal: 'Use prefix/suffix thinking when each answer depends on information from both sides of the current index.',
  invariant: 'Before multiplying by the right product at index i, output[i] already contains the product of all values strictly to the left of i.',
  bruteForceThought: 'Brute force recomputes a product for every index by excluding the current value and multiplying all the others again.',
  optimizationJourney: 'Once “except self” is clear, the optimization is to avoid rebuilding the same products many times. The code uses two simple passes. The first pass stores the product before each index in answer[i]. The second pass multiplies answer[i] by the product after that index.',
  stepByStepBreakdown: ['The current value is nums[i].', 'First loop, left to right: answer[i] = leftProduct stores the product before index i.', 'Then leftProduct *= nums[i] adds the current value for future indexes.', 'Second loop, right to left: answer[i] *= rightProduct multiplies by the product after index i.', 'Then rightProduct *= nums[i] adds the current value for earlier indexes.'],
  finalPattern: 'Precompute information before and after each position.',
  commonMistake: 'Accidentally including the current element in either the prefix or suffix product.',
  commonMistakes: ['Including the current value in the product for its own index.', 'Updating the running suffix before multiplying output[i].', 'Using division even though the constraint disallows it.', 'Counting the output array as extra space when the problem allows returning it.'],
  edgeCases: ['One zero in the array', 'Multiple zeros', 'Negative numbers', 'Array length two', 'Values of one'],
  complexityAnalysis: 'Time is O(n) because the code makes two linear passes: one pass builds products from the left, and one pass combines products from the right. Extra space is O(1) beyond the output array.',
  explanation: 'Product except self means every output position excludes the number at the same index. For nums = [1, 2, 3, 4], answer[0] excludes 1 and multiplies 2 × 3 × 4 = 24. answer[1] excludes 2 and multiplies 1 × 3 × 4 = 12. answer[2] excludes 3 and multiplies 1 × 2 × 4 = 8. answer[3] excludes 4 and multiplies 1 × 2 × 3 = 6. In code, the first loop writes the left-side product into each answer slot. The second loop walks from the right and multiplies in the right-side product. Together, those two pieces form “everything except self.” The explanation tables below use the same variable names as the Java code.',
  approach: 'Use the output array as a notepad. The first loop uses leftProduct. Before the loop has multiplied any input values, leftProduct starts at 1. At i = 0, answer[0] = leftProduct writes 1 because there are no values before index 0 yet. Then leftProduct *= nums[0] updates leftProduct for the next index. The same pattern continues until the first loop creates [1, 1, 2, 6]. The second loop uses rightProduct in the same way from the right side. It multiplies each answer[i] by the product of values after index i, then updates rightProduct for the next index to the left.',
  solutionCode: `class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] answer = new int[n];

        int leftProduct = 1;
        for (int i = 0; i < n; i++) {
            answer[i] = leftProduct;
            leftProduct *= nums[i];
        }

        int rightProduct = 1;
        for (int i = n - 1; i >= 0; i--) {
            answer[i] *= rightProduct;
            rightProduct *= nums[i];
        }

        return answer;
    }
}`,
  finalTakeaway: 'The first loop stores product-before-index in answer[i]. The second loop multiplies product-after-index into answer[i]. Because each loop updates its product after using nums[i], the current value is excluded from its own answer.',
  visualExplanation: 'The visual explains the given example directly. Each frame builds one answer slot for nums = [1, 2, 3, 4]. The code uses two loops to build the same idea efficiently: one left pass for products before the current index, then one right pass for products after the current index.',
  visualWalkthrough: {
    title: 'Product except self walkthrough',
    summary: 'Each answer is the product of everything except the number at that same index.',
    diagram: {
      type: 'array',
      title: 'Build the given example one answer slot at a time',
      description: 'The current input value is excluded from its own output slot.',
      values: [1, 2, 3, 4],
      stateTitle: 'Answer slot being built',
      stateDescription: 'Each frame shows the excluded value, the numbers multiplied, and the output value created for that index.',
      legend: [
        { role: 'current', label: 'excluded value', marker: 'E' },
        { role: 'success', label: 'used in product', marker: '×' },
        { role: 'answer', label: 'answer written', marker: '✓' }
      ],
      frames: [
        {
          title: 'Index 0 excludes 1',
          description: 'At index 0, exclude 1. Multiply the remaining values: 2 × 3 × 4 = 24.',
          items: [
            { index: 0, role: 'current', caption: 'exclude 1' },
            { index: 1, role: 'success', caption: 'use 2' },
            { index: 2, role: 'success', caption: 'use 3' },
            { index: 3, role: 'success', caption: 'use 4' }
          ],
          state: { label: 'output[0]', role: 'answer', values: { nums: '[1, 2, 3, 4]', excluded: '1 at index 0', multiply: '2 × 3 × 4', output: '[24, _, _, _]' }, helper: 'The answer at index 0 is formed from every value except nums[0].' }
        },
        {
          title: 'Index 1 excludes 2',
          description: 'Move one index. Exclude 2, then multiply 1 × 3 × 4 = 12.',
          items: [
            { index: 0, role: 'success', caption: 'use 1' },
            { index: 1, role: 'current', caption: 'exclude 2' },
            { index: 2, role: 'success', caption: 'use 3' },
            { index: 3, role: 'success', caption: 'use 4' }
          ],
          state: { label: 'output[1]', role: 'answer', values: { excluded: '2 at index 1', multiply: '1 × 3 × 4', output: '[24, 12, _, _]' }, helper: 'Only the current index changes. The rule stays the same: multiply every other value.' }
        },
        {
          title: 'Index 2 excludes 3',
          description: 'Move to index 2. Exclude 3 and multiply 1 × 2 × 4 = 8.',
          items: [
            { index: 0, role: 'success', caption: 'use 1' },
            { index: 1, role: 'success', caption: 'use 2' },
            { index: 2, role: 'current', caption: 'exclude 3' },
            { index: 3, role: 'success', caption: 'use 4' }
          ],
          state: { label: 'output[2]', role: 'answer', values: { excluded: '3 at index 2', multiply: '1 × 2 × 4', output: '[24, 12, 8, _]' }, helper: 'This writes the answer for index 2.' }
        },
        {
          title: 'Index 3 excludes 4',
          description: 'Move to index 3. Exclude 4 and multiply 1 × 2 × 3 = 6.',
          items: [
            { index: 0, role: 'success', caption: 'use 1' },
            { index: 1, role: 'success', caption: 'use 2' },
            { index: 2, role: 'success', caption: 'use 3' },
            { index: 3, role: 'current', caption: 'exclude 4' }
          ],
          state: { label: 'output[3]', values: { excluded: '4 at index 3', multiply: '1 × 2 × 3', output: '[24, 12, 8, 6]' }, helper: 'Now every answer slot has been filled.' },
          finalResult: { title: 'Final answer', body: 'Return [24, 12, 8, 6].' }
        }
      ]
    }
  },
  body: [
    { type: 'callout', tone: 'info', title: 'Code variables used below', content: 'The Java code uses three important names: answer[i] is the output slot being filled, leftProduct is the product of values before index i, and rightProduct is the product of values after index i.' },
    { type: 'callout', tone: 'info', title: 'Why leftProduct starts at 1', content: 'Before the first loop reaches index 0, no input values have been multiplied yet. leftProduct starts at 1 because 1 is the safe starting value for multiplication: 1 × 2 = 2. Starting with 0 would break the product because 0 × 2 = 0.' },
    { type: 'callout', tone: 'info', title: 'What “except self” means', content: 'For nums = [1, 2, 3, 4], answer[0] excludes nums[0], which is 1, and multiplies the rest: 2 × 3 × 4 = 24.' },
    { type: 'callout', tone: 'info', title: 'Why the code has two loops', content: 'The first loop fills answer[i] with the product before index i. The second loop multiplies answer[i] by the product after index i. before × after gives product except self.' },
    {
      type: 'table',
      title: 'First loop: answer[i] = leftProduct, then leftProduct *= nums[i]',
      columns: ['i', 'nums[i]', 'leftProduct before answer[i]', 'answer[i] writes', 'leftProduct after update'],
      rows: [
        ['0', '1', '1; no values before index 0 have been multiplied yet', 'answer[0] = 1', '1 × nums[0] = 1'],
        ['1', '2', '1', 'answer[1] = 1', '1 × nums[1] = 2'],
        ['2', '3', '2', 'answer[2] = 2', '2 × nums[2] = 6'],
        ['3', '4', '6', 'answer[3] = 6', '6 × nums[3] = 24']
      ]
    },
    {
      type: 'table',
      title: 'Second loop: answer[i] *= rightProduct, then rightProduct *= nums[i]',
      columns: ['i', 'nums[i]', 'rightProduct before answer[i]', 'answer[i] becomes', 'rightProduct after update'],
      rows: [
        ['3', '4', '1; no values after index 3 have been multiplied yet', '6 × 1 = 6', '1 × nums[3] = 4'],
        ['2', '3', '4', '2 × 4 = 8', '4 × nums[2] = 12'],
        ['1', '2', '12', '1 × 12 = 12', '12 × nums[1] = 24'],
        ['0', '1', '24', '1 × 24 = 24', '24 × nums[0] = 24']
      ]
    },
    {
      type: 'flow',
      title: 'How the two loops connect to the answer',
      steps: [
        { title: 'After first loop', detail: 'answer is [1, 1, 2, 6]. These are products before each index.' },
        { title: 'During second loop', detail: 'rightProduct supplies the product after each index and multiplies into answer[i].' },
        { title: 'After second loop', detail: 'answer is [24, 12, 8, 6]. Each slot now has product before index i × product after index i.' }
      ]
    },
    { type: 'callout', tone: 'info', title: 'Pattern signal', content: 'Use prefix/suffix thinking when each answer depends on all items except the current one.' },
    { type: 'checklist', title: 'Mistakes to avoid', items: ['Do not include nums[i]', 'Do not rely on division', 'Handle zeros through multiplication naturally'] }
  ],
  relatedConcepts: ['prefix products', 'suffix products', 'running accumulator'],
  metadata: { reviewStatus: 'approved', visibility: ['dev', 'prod'] }
});

export default problem;
