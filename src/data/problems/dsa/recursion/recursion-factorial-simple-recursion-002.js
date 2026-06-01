import { defineLearningProblem } from '../../../../problems/problemAuthoring.js';

const problem = defineLearningProblem({
  id: 'recursion-factorial-simple-recursion-002',
  category: 'dsa',
  topicId: 'recursion',
  title: 'Factorial(n) — Simplest Recursion',
  difficulty: 'Easy',
  estimatedTime: '10 min',
  estimatedTimeSeconds: 600,
  language: 'java',
  tags: [
    'recursion',
    'factorial',
    'base-case',
    'call-stack',
    'java',
    'visual-walkthrough'
  ],
  scenario: 'You are learning the first recursion exercise: factorial. Factorial means multiplying a number by every positive whole number below it.',
  question: 'Write a recursive Java method factorial(n) that returns n!. For example, factorial(5) should return 120 because 5! = 5 × 4 × 3 × 2 × 1.',
  prompt: 'How does factorial(n) teach the base case, recursive case, and return unwinding in the simplest possible way?',
  examples: [
    'Input: n = 0 → Output: 1 because 0! is defined as 1.',
    'Input: n = 1 → Output: 1 because 1! = 1.',
    'Input: n = 3 → Output: 6 because 3! = 3 × 2 × 1.',
    'Input: n = 5 → Output: 120 because 5! = 5 × 4 × 3 × 2 × 1.'
  ],
  constraints: [
    'n is a non-negative integer.',
    'Use recursion for this exercise.',
    'Assume n is small enough that the result fits in a long.'
  ],
  starterThought: 'Factorial has a natural smaller problem: n! = n × (n - 1)!. The smallest direct answer is 0! = 1 or 1! = 1.',
  intuition: 'Factorial is beginner-friendly because it has one clear job: multiply the current number by the factorial of the number just below it. To compute 5!, first find 4!, then multiply that answer by 5. To find 4!, first find 3!, then multiply by 4. This continues until the base case returns 1.',
  plainLanguageExplanation: 'The symbol n! is read as “n factorial.” It means multiply n by every whole number below it until 1. So 4! means 4 × 3 × 2 × 1 = 24. Recursion works here because 4! can be written as 4 × 3!, and 3! can be written as 3 × 2!.',
  mentalPicture: 'Picture each call as a waiting note. factorial(5) writes “I need factorial(4), then I will multiply by 5.” The notes keep stacking until factorial(1) returns 1. Then the notes are completed from top to bottom.',
  patternSignal: 'Use simple recursion when the problem can be expressed as the current value plus the same problem on a smaller input.',
  invariant: 'Every recursive call must reduce n, so the function eventually reaches n == 0 or n == 1.',
  bruteForceThought: 'An iterative loop can multiply from 1 to n, but this exercise is about learning how recursive calls pause and return.',
  optimizationJourney: 'There is no overlapping subproblem here, so memoization is unnecessary. The goal is to master the call stack before moving to harder recursion.',
  stepByStepBreakdown: [
    'Understand the meaning first: n! means n × (n - 1) × (n - 2) × ... × 1.',
    'Define the base case: if n is 0 or 1, return 1.',
    'Define the recursive case: return n * factorial(n - 1).',
    'Make sure each call moves closer to the base case by subtracting 1 from n.',
    'Trace factorial(5) as 5 * factorial(4).',
    'Continue until factorial(1) returns 1.',
    'Unwind the calls: 2 * 1, then 3 * 2, then 4 * 6, then 5 * 24.'
  ],
  finalPattern: 'Linear recursion with one smaller recursive call and one direct base case.',
  commonMistake: 'Forgetting the base case causes infinite recursion until the call stack overflows.',
  commonMistakes: [
    'Using n * factorial(n) instead of n * factorial(n - 1).',
    'Returning 0 for factorial(0). The correct value is 1.',
    'Writing a base case that never gets reached.',
    'Trying to multiply while going down without understanding that the final result is built while returning.'
  ],
  edgeCases: [
    'n = 0 should return 1.',
    'n = 1 should return 1.',
    'Large n can overflow numeric types or exceed stack depth, but that is outside this beginner exercise.'
  ],
  complexityAnalysis: 'Time is O(n) because the function makes one recursive call for each value from n down to 1. Space is O(n) because each call waits on the call stack until the base case returns.',
  explanation: 'For factorial(5), the function first builds a chain of waiting calls: 5 * factorial(4), 4 * factorial(3), 3 * factorial(2), and 2 * factorial(1). The base case factorial(1) returns 1. Then the stack unwinds: factorial(2) returns 2, factorial(3) returns 6, factorial(4) returns 24, and factorial(5) returns 120.',
  solutionCode: `class Solution {
    public long factorial(int n) {
        if (n < 0) {
            throw new IllegalArgumentException("n must be non-negative");
        }

        if (n == 0 || n == 1) {
            return 1;
        }

        return n * factorial(n - 1);
    }
}`,
  finalTakeaway: 'Factorial is the simplest recursion exercise: define the smallest answer, call the smaller problem, and let the answer build while the stack unwinds.',
  selfExplanationPrompt: 'Before reading the solution, trace factorial(4) on paper and write what each stack frame is waiting for.',
  visualExplanation: 'The visual uses factorial(5). Each frame shows one call or one return. Going down, the current call asks for a smaller factorial. Coming back up, each call multiplies its number by the returned answer.',
  visualWalkthrough: {
    title: 'Factorial recursion walkthrough',
    summary: 'Build factorial(5) one call at a time, then return answers one by one until the final result is 120.',
    diagram: {
      type: 'array',
      title: 'Call chain for factorial(5)',
      description: 'Each cell represents one factorial call. The current call either waits for a smaller call or receives a returned value.',
      values: ['5!', '4!', '3!', '2!', '1!'],
      stateTitle: 'Call and return state',
      stateDescription: 'The first frames push smaller calls. The later frames return answers back up the chain.',
      legend: [
        { role: 'current', label: 'current call', marker: 'C' },
        { role: 'window', label: 'waiting call', marker: 'W' },
        { role: 'success', label: 'returned value', marker: 'R' },
        { role: 'answer', label: 'final answer', marker: '✓' }
      ],
      frames: [
        {
          title: 'Start with factorial(5)',
          description: 'factorial(5) cannot answer directly. It waits for factorial(4), then it will multiply that result by 5.',
          items: [
            { index: 0, role: 'current', caption: '5 × factorial(4)' }
          ],
          state: { label: 'call 5!', values: { current: 'factorial(5)', needs: 'factorial(4)', waitingExpression: '5 × factorial(4)' }, helper: 'The problem becomes smaller because the next call uses n - 1.' }
        },
        {
          title: 'Keep moving toward the base case',
          description: 'The same rule repeats: 4 waits for 3, 3 waits for 2, and 2 waits for 1.',
          items: [
            { index: 0, role: 'window', caption: 'waits' },
            { index: 1, role: 'window', caption: 'waits' },
            { index: 2, role: 'window', caption: 'waits' },
            { index: 3, role: 'current', caption: '2 × factorial(1)' }
          ],
          state: { label: 'calls pushed', values: { chain: '5! → 4! → 3! → 2! → 1!', nextBaseCase: 'factorial(1)' }, helper: 'Each call is paused until the smaller call returns.' }
        },
        {
          title: 'Base case returns 1',
          description: 'factorial(1) is the smallest direct answer, so recursion stops creating new calls here.',
          items: [
            { index: 0, role: 'window', caption: 'waiting' },
            { index: 1, role: 'window', caption: 'waiting' },
            { index: 2, role: 'window', caption: 'waiting' },
            { index: 3, role: 'window', caption: 'waiting' },
            { index: 4, role: 'success', caption: 'returns 1' }
          ],
          state: { label: 'base case', values: { call: 'factorial(1)', returns: 1 }, helper: 'The base case is what prevents infinite recursion.' }
        },
        {
          title: 'Return to factorial(2)',
          description: 'factorial(2) was waiting for factorial(1). Now it computes 2 × 1 = 2.',
          items: [
            { index: 0, role: 'window', caption: 'waiting' },
            { index: 1, role: 'window', caption: 'waiting' },
            { index: 2, role: 'window', caption: 'waiting' },
            { index: 3, role: 'success', caption: 'returns 2' },
            { index: 4, role: 'success', caption: '1' }
          ],
          state: { label: 'unwind 2!', values: { expression: '2 × 1', returns: 2 }, helper: 'Unwinding means paused calls resume from the top of the stack.' }
        },
        {
          title: 'Return through factorial(3) and factorial(4)',
          description: 'The returned answer keeps moving upward: factorial(3) returns 6, then factorial(4) returns 24.',
          items: [
            { index: 0, role: 'window', caption: 'waiting' },
            { index: 1, role: 'success', caption: 'returns 24' },
            { index: 2, role: 'success', caption: 'returns 6' },
            { index: 3, role: 'success', caption: 'returns 2' },
            { index: 4, role: 'success', caption: '1' }
          ],
          state: { label: 'unwind middle', values: { factorial3: '3 × 2 = 6', factorial4: '4 × 6 = 24' }, helper: 'Each call multiplies its n by the answer returned from the smaller call.' }
        },
        {
          title: 'Return the final answer',
          description: 'factorial(5) receives 24 from factorial(4), computes 5 × 24, and returns 120.',
          items: [
            { index: 0, role: 'answer', caption: 'returns 120' },
            { index: 1, role: 'success', caption: '24' },
            { index: 2, role: 'success', caption: '6' },
            { index: 3, role: 'success', caption: '2' },
            { index: 4, role: 'success', caption: '1' }
          ],
          state: { label: 'final result', values: { expression: '5 × 24', answer: 120 }, helper: 'The original call now has its answer.' },
          finalResult: { title: 'Final answer', body: 'factorial(5) returns 120.' }
        }
      ]
    }
  },
  body: [
    {
      type: 'section',
      title: 'What factorial means',
      content: 'Factorial is written with an exclamation mark. 5! means 5 × 4 × 3 × 2 × 1. 3! means 3 × 2 × 1. The result of 0! is defined as 1, which gives recursion a clean stopping answer.'
    },
    {
      type: 'callout',
      tone: 'info',
      title: 'Practice ladder step 1',
      content: 'Factorial(n) is the first recursion practice because it has one obvious base case and one obvious smaller problem.'
    },
    {
      type: 'section',
      title: 'What you must learn here',
      content: 'Do not rush past factorial. Use it to understand how a recursive call pauses, waits for the smaller answer, and resumes when the smaller call returns.'
    }
  ],
  solutionBody: [
    {
      type: 'table',
      title: 'factorial(5) return table',
      columns: ['Call', 'Waiting expression', 'Returned value'],
      rows: [
        ['factorial(1)', 'base case', '1'],
        ['factorial(2)', '2 × factorial(1)', '2 × 1 = 2'],
        ['factorial(3)', '3 × factorial(2)', '3 × 2 = 6'],
        ['factorial(4)', '4 × factorial(3)', '4 × 6 = 24'],
        ['factorial(5)', '5 × factorial(4)', '5 × 24 = 120']
      ]
    }
  ],
  relatedConcepts: [
    'base case',
    'recursive case',
    'call stack',
    'return unwinding',
    'linear recursion'
  ],
  followUpQuestions: [
    'Why is factorial(0) equal to 1?',
    'What happens if the recursive call uses factorial(n) instead of factorial(n - 1)?',
    'How many stack frames are created for factorial(5)?',
    'Why is factorial not a dynamic programming problem in this basic form?'
  ],
  metadata: {
    sequence: 2,
    reviewStatus: 'approved',
    visibility: ['dev', 'prod'],
    source: 'original',
    estimatedTimeSeconds: 600
  }
});

export default problem;
