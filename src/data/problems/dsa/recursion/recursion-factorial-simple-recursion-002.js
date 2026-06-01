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
  mentalPicture: 'Picture the call stack as plates. A new recursive call is placed on top of the stack. A completed call is removed from the top. The last call pushed is the first one that returns.',
  patternSignal: 'Use simple recursion when the problem can be expressed as the current value plus the same problem on a smaller input.',
  invariant: 'Every recursive call must reduce n, so the function eventually reaches n == 0 or n == 1.',
  bruteForceThought: 'An iterative loop can multiply from 1 to n, but this exercise is about learning how recursive calls pause and return.',
  optimizationJourney: 'There is no overlapping subproblem here, so memoization is unnecessary. The goal is to master the call stack before moving to harder recursion.',
  stepByStepBreakdown: [
    'Understand the meaning first: n! means n × (n - 1) × (n - 2) × ... × 1.',
    'Define the base case: if n is 0 or 1, return 1.',
    'Define the recursive case: return n * factorial(n - 1).',
    'Make sure each call moves closer to the base case by subtracting 1 from n.',
    'Push each new recursive call onto the call stack until the base case is reached.',
    'Pop each completed call from the stack as it returns a value.',
    'Unwind the calls: 1, then 2 * 1, then 3 * 2, then 4 * 6, then 5 * 24.'
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
  explanation: 'For factorial(5), the function first pushes waiting calls onto the stack: factorial(5), factorial(4), factorial(3), factorial(2), and factorial(1). The base case factorial(1) returns 1. Then each completed call is popped from the stack: factorial(2) returns 2, factorial(3) returns 6, factorial(4) returns 24, and factorial(5) returns 120.',
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
  finalTakeaway: 'Factorial is the simplest recursion exercise: define the smallest answer, push smaller calls until the base case, then pop completed calls as the answer unwinds.',
  selfExplanationPrompt: 'Before reading the solution, trace factorial(4) on paper and write what gets pushed, what waits, and what gets popped.',
  visualExplanation: 'The visual uses factorial(5). Each click shows exactly one stack action: either a call is pushed onto the stack, the base case returns, or a completed call is popped from the stack with its return value.',
  visualWalkthrough: {
    title: 'Factorial call stack — push and pop walkthrough',
    summary: 'Every frame shows the stack changing by one important action: push a call, hit the base case, then pop calls as return values are produced.',
    diagram: {
      type: 'array',
      title: 'Call stack for factorial(5)',
      description: 'Read the array from left to right as bottom to top of the stack. The rightmost active call is the top of the stack.',
      values: ['factorial(5)', 'factorial(4)', 'factorial(3)', 'factorial(2)', 'factorial(1)'],
      stateTitle: 'Current stack action',
      stateDescription: 'Each frame names exactly what was pushed, what is waiting, or what was popped.',
      legend: [
        { role: 'current', label: 'just pushed / active top', marker: 'P' },
        { role: 'window', label: 'waiting on stack', marker: 'W' },
        { role: 'success', label: 'returned / popped', marker: 'R' },
        { role: 'answer', label: 'final answer', marker: '✓' }
      ],
      frames: [
        {
          title: '1. Push factorial(5)',
          description: 'The first call enters the stack. It cannot finish until factorial(4) returns.',
          items: [
            { index: 0, role: 'current', caption: 'push' }
          ],
          state: { label: 'PUSH', values: { pushed: 'factorial(5)', stackNow: '[factorial(5)]', waitingFor: 'factorial(4)' }, helper: 'factorial(5) is paused at: 5 × factorial(4).' }
        },
        {
          title: '2. Push factorial(4)',
          description: 'factorial(5) is waiting. The new top of the stack is factorial(4).',
          items: [
            { index: 0, role: 'window', caption: 'waiting' },
            { index: 1, role: 'current', caption: 'push' }
          ],
          state: { label: 'PUSH', values: { pushed: 'factorial(4)', stackNow: '[factorial(5), factorial(4)]', waitingFor: 'factorial(3)' }, helper: 'factorial(4) is paused at: 4 × factorial(3).' }
        },
        {
          title: '3. Push factorial(3)',
          description: 'The stack grows because the function keeps asking for a smaller factorial.',
          items: [
            { index: 0, role: 'window', caption: 'waiting' },
            { index: 1, role: 'window', caption: 'waiting' },
            { index: 2, role: 'current', caption: 'push' }
          ],
          state: { label: 'PUSH', values: { pushed: 'factorial(3)', stackNow: '[factorial(5), factorial(4), factorial(3)]', waitingFor: 'factorial(2)' }, helper: 'factorial(3) is paused at: 3 × factorial(2).' }
        },
        {
          title: '4. Push factorial(2)',
          description: 'factorial(2) becomes the top frame. It still needs factorial(1).',
          items: [
            { index: 0, role: 'window', caption: 'waiting' },
            { index: 1, role: 'window', caption: 'waiting' },
            { index: 2, role: 'window', caption: 'waiting' },
            { index: 3, role: 'current', caption: 'push' }
          ],
          state: { label: 'PUSH', values: { pushed: 'factorial(2)', stackNow: '[factorial(5), factorial(4), factorial(3), factorial(2)]', waitingFor: 'factorial(1)' }, helper: 'factorial(2) is paused at: 2 × factorial(1).' }
        },
        {
          title: '5. Push factorial(1): base case',
          description: 'factorial(1) reaches the base case. No more recursive calls are needed.',
          items: [
            { index: 0, role: 'window', caption: 'waiting' },
            { index: 1, role: 'window', caption: 'waiting' },
            { index: 2, role: 'window', caption: 'waiting' },
            { index: 3, role: 'window', caption: 'waiting' },
            { index: 4, role: 'current', caption: 'base case' }
          ],
          state: { label: 'PUSH + BASE CASE', values: { pushed: 'factorial(1)', stackNow: '[factorial(5), factorial(4), factorial(3), factorial(2), factorial(1)]', returns: 1 }, helper: 'The base case stops the stack from growing forever.' }
        },
        {
          title: '6. Pop factorial(1), return 1',
          description: 'The top call is complete, so it is removed from the stack and returns 1 to factorial(2).',
          items: [
            { index: 0, role: 'window', caption: 'waiting' },
            { index: 1, role: 'window', caption: 'waiting' },
            { index: 2, role: 'window', caption: 'waiting' },
            { index: 3, role: 'current', caption: 'receives 1' },
            { index: 4, role: 'success', caption: 'pop 1' }
          ],
          state: { label: 'POP', values: { popped: 'factorial(1)', returned: 1, stackNow: '[factorial(5), factorial(4), factorial(3), factorial(2)]' }, helper: 'Now factorial(2) can continue.' }
        },
        {
          title: '7. Pop factorial(2), return 2',
          description: 'factorial(2) resumes, computes 2 × 1, and returns 2 to factorial(3).',
          items: [
            { index: 0, role: 'window', caption: 'waiting' },
            { index: 1, role: 'window', caption: 'waiting' },
            { index: 2, role: 'current', caption: 'receives 2' },
            { index: 3, role: 'success', caption: 'pop 2' },
            { index: 4, role: 'success', caption: 'returned 1' }
          ],
          state: { label: 'POP', values: { popped: 'factorial(2)', computes: '2 × 1', returned: 2, stackNow: '[factorial(5), factorial(4), factorial(3)]' }, helper: 'A popped call passes its answer to the call below it.' }
        },
        {
          title: '8. Pop factorial(3), return 6',
          description: 'factorial(3) resumes, computes 3 × 2, and returns 6 to factorial(4).',
          items: [
            { index: 0, role: 'window', caption: 'waiting' },
            { index: 1, role: 'current', caption: 'receives 6' },
            { index: 2, role: 'success', caption: 'pop 6' },
            { index: 3, role: 'success', caption: 'returned 2' },
            { index: 4, role: 'success', caption: 'returned 1' }
          ],
          state: { label: 'POP', values: { popped: 'factorial(3)', computes: '3 × 2', returned: 6, stackNow: '[factorial(5), factorial(4)]' }, helper: 'The returned value keeps moving down the waiting stack.' }
        },
        {
          title: '9. Pop factorial(4), return 24',
          description: 'factorial(4) resumes, computes 4 × 6, and returns 24 to factorial(5).',
          items: [
            { index: 0, role: 'current', caption: 'receives 24' },
            { index: 1, role: 'success', caption: 'pop 24' },
            { index: 2, role: 'success', caption: 'returned 6' },
            { index: 3, role: 'success', caption: 'returned 2' },
            { index: 4, role: 'success', caption: 'returned 1' }
          ],
          state: { label: 'POP', values: { popped: 'factorial(4)', computes: '4 × 6', returned: 24, stackNow: '[factorial(5)]' }, helper: 'Only the original call remains waiting.' }
        },
        {
          title: '10. Pop factorial(5), return 120',
          description: 'factorial(5) resumes, computes 5 × 24, and returns the final answer.',
          items: [
            { index: 0, role: 'answer', caption: 'pop 120' },
            { index: 1, role: 'success', caption: 'returned 24' },
            { index: 2, role: 'success', caption: 'returned 6' },
            { index: 3, role: 'success', caption: 'returned 2' },
            { index: 4, role: 'success', caption: 'returned 1' }
          ],
          state: { label: 'FINAL POP', values: { popped: 'factorial(5)', computes: '5 × 24', returned: 120, stackNow: '[]' }, helper: 'The stack is empty because the original call has finished.' },
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
      columns: ['Call popped', 'Waiting expression completed', 'Returned value'],
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
