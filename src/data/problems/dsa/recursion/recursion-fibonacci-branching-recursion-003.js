import { defineLearningProblem } from '../../../../problems/problemAuthoring.js';

const stack = (...frames) => frames.map((frame) => (typeof frame === 'string' ? { call: frame } : frame));

const problem = defineLearningProblem({
  id: 'recursion-fibonacci-branching-recursion-003',
  category: 'dsa',
  topicId: 'recursion',
  title: 'Fibonacci(n) - Branching Recursion',
  difficulty: 'Easy',
  estimatedTime: '15 min',
  estimatedTimeSeconds: 900,
  language: 'java',
  tags: ['recursion', 'fibonacci', 'branching-recursion', 'base-case', 'call-stack', 'memory', 'recursion-tree', 'java'],
  scenario: 'You are moving from linear recursion into branching recursion. Fibonacci is the first exercise where one parent call waits for two child calls instead of one.',
  question: 'Write a recursive Java method fib(n) that returns the nth Fibonacci number. Use the simple branching-recursion solution where fib(n) returns fib(n - 1) + fib(n - 2).',
  prompt: 'How does Fibonacci teach branching recursion, call-stack memory, waiting parent calls, return unwinding, and repeated work?',
  examples: [
    'Input: n = 0 -> Output: 0',
    'Input: n = 1 -> Output: 1',
    'Input: n = 2 -> Output: 1',
    'Input: n = 3 -> Output: 2',
    'Input: n = 5 -> Output: 5',
    'Input: n = 6 -> Output: 8'
  ],
  constraints: [
    'n is a non-negative integer.',
    'Use the simple recursive solution for this exercise.',
    'Assume n is small enough that stack depth and integer size are not the main focus.'
  ],
  starterThought: 'Fibonacci starts with two direct answers: fib(0) = 0 and fib(1) = 1. Every larger answer needs the previous two answers.',
  plainLanguageExplanation: 'Fibonacci is a sequence where each number is made by adding the previous two numbers. The sequence starts 0, 1, 1, 2, 3, 5, 8, 13, and keeps going. The number at position n is called fib(n).',
  intuition: 'Use the everyday memory: to know today\'s number, I need yesterday\'s number and the day before yesterday\'s number. In recursion, yesterday becomes fib(n - 1), and the day before yesterday becomes fib(n - 2).',
  mentalPicture: 'Factorial creates one smaller call at each step. Fibonacci creates two smaller calls at each non-base step. A parent like fib(5) pauses while it waits for fib(4) and fib(3). Each child call gets its own stack frame, returns a value, and is popped from memory when complete.',
  patternSignal: 'Use branching recursion when one problem naturally splits into two or more smaller versions of the same problem.',
  invariant: 'Every recursive branch must move toward fib(1) or fib(0), otherwise the recursion will not stop.',
  bruteForceThought: 'The naive recursive version is intentionally simple. It follows the definition directly, even though it repeats work.',
  optimizationJourney: 'Memoization can remember repeated answers and make Fibonacci much faster, but that belongs to dynamic programming. This lesson stays focused on understanding branching recursion and call-stack behavior.',
  stepByStepBreakdown: [
    'Handle fib(0) immediately by returning 0.',
    'Handle fib(1) immediately by returning 1.',
    'For every n greater than 1, ask for fib(n - 1) and fib(n - 2).',
    'Let Java evaluate the left recursive call first: fib(n - 1).',
    'When the left side returns, evaluate the right recursive call: fib(n - 2).',
    'Add the two returned values and return the sum to the waiting parent.'
  ],
  finalPattern: 'Branching recursion with two base cases and two smaller recursive calls.',
  commonMistake: 'The most common mistake is treating Fibonacci like factorial. Factorial has one smaller call; Fibonacci needs two smaller calls.',
  commonMistakes: [
    'Forgetting one of the base cases. Both fib(0) and fib(1) must return directly.',
    'Returning 1 for fib(0). The correct value is 0.',
    'Using only fib(n - 1), which makes the recursion linear but gives the wrong Fibonacci answer.',
    'Assuming Fibonacci is efficient just because the code is short.',
    'Not noticing that the same calls are repeated, such as fib(3), fib(2), and fib(1).',
    'Misunderstanding Java evaluation order. In fib(n - 1) + fib(n - 2), Java evaluates the left call before the right call.'
  ],
  edgeCases: [
    'n = 0 should return 0.',
    'n = 1 should return 1.',
    'n = 2 should return fib(1) + fib(0), which is 1.',
    'Large n becomes slow with naive recursion because repeated subproblems grow quickly.'
  ],
  complexityAnalysis: 'Time complexity is exponential for naive recursion because most calls branch into two more calls and many smaller answers are recomputed. The code for fib(5) already computes fib(3), fib(2), and fib(1) more than once. Space complexity is O(n) because the deepest active path on the call stack goes from fib(n) down to fib(1) or fib(0), even though the total number of calls is much larger.',
  explanation: 'For fib(5), the method first asks for fib(4) and fib(3). Java starts with the left side, so fib(4) is explored before the right fib(3). Each call waits on the stack while its child calls run. Base cases return direct values, then parent calls add returned values during unwinding: fib(2) returns 1, fib(3) returns 2, fib(4) returns 3, and finally fib(5) returns 5.',
  solutionCode: `class Solution {
    public int fib(int n) {
        if (n == 0) {
            return 0;
        }
        if (n == 1) {
            return 1;
        }

        return fib(n - 1) + fib(n - 2);
    }
}`,
  finalTakeaway: 'Fibonacci is the learner\'s first branching-recursion exercise: one parent call creates two child calls, waits, receives values, adds them, and returns upward.',
  selfExplanationPrompt: 'Before moving on, trace fib(4) on paper. Write the active stack, mark which parent is waiting, and circle each repeated call.',
  visualExplanation: 'Trace fib(5). Watch calls get pushed, parents pause, base cases return, frames pop, values add during unwinding, and repeated work appear.',
  visualWalkthrough: {
    title: 'Fibonacci branching recursion walkthrough - fib(5)',
    summary: 'The visual shows active memory, waiting parent calls, returned values, value addition, and repeated work while tracing fib(5).',
    diagram: {
      id: 'recursion-fibonacci-branching-recursion-003-walkthrough',
      type: 'recursion-branching',
      title: 'Fibonacci branching recursion walkthrough - fib(5)',
      summary: 'fib(5) branches into fib(4) and fib(3). Each non-base call waits for two child answers.',
      stackTitle: 'Active call stack',
      treeTitle: 'Call checkpoints',
      frames: [
        {
          title: 'Ready to trace fib(5)',
          action: 'Ready',
          kind: 'neutral',
          description: 'We will trace fib(5). The final answer should be 5, but first we need to see how memory behaves.',
          stack: [],
          tree: [{ label: 'fib(5)', kind: 'waiting' }]
        },
        {
          title: 'Push fib(5)',
          action: 'Push',
          kind: 'push',
          description: 'fib(5) enters memory. It is not a base case, so it needs fib(4) and fib(3).',
          stack: stack({ call: 'fib(5)', detail: 'waiting for fib(4) + fib(3)', kind: 'waiting' }),
          waiting: [{ label: 'fib(5)', detail: 'waits for fib(4) and fib(3)' }],
          tree: [{ label: 'fib(5)', kind: 'push' }, { label: 'fib(4)', kind: 'waiting' }, { label: 'fib(3)', kind: 'waiting' }]
        },
        {
          title: 'Push fib(4)',
          action: 'Push',
          kind: 'push',
          description: 'Java evaluates the left side first, so fib(4) starts while fib(5) pauses.',
          stack: stack({ call: 'fib(4)', detail: 'waiting for fib(3) + fib(2)', kind: 'waiting' }, { call: 'fib(5)', detail: 'paused', kind: 'waiting' }),
          waiting: [{ label: 'fib(5)', detail: 'waits for fib(4) and fib(3)' }, { label: 'fib(4)', detail: 'waits for fib(3) and fib(2)' }],
          tree: [{ label: 'fib(5)', kind: 'waiting' }, { label: 'fib(4)', kind: 'push' }, { label: 'fib(3)', kind: 'waiting' }, { label: 'fib(2)', kind: 'waiting' }]
        },
        {
          title: 'Push fib(3)',
          action: 'Push',
          kind: 'push',
          description: 'fib(4) also evaluates its left child first, so fib(3) starts and fib(4) waits.',
          stack: stack({ call: 'fib(3)', detail: 'waiting for fib(2) + fib(1)', kind: 'waiting' }, { call: 'fib(4)', detail: 'paused', kind: 'waiting' }, { call: 'fib(5)', detail: 'paused', kind: 'waiting' }),
          waiting: [{ label: 'fib(5)', detail: 'waits for fib(4) and fib(3)' }, { label: 'fib(4)', detail: 'waits for fib(3) and fib(2)' }, { label: 'fib(3)', detail: 'waits for fib(2) and fib(1)' }],
          tree: [{ label: 'fib(5)', kind: 'waiting' }, { label: 'fib(4)', kind: 'waiting' }, { label: 'fib(3)', kind: 'push' }, { label: 'fib(2)', kind: 'waiting' }, { label: 'fib(1)', kind: 'base' }]
        },
        {
          title: 'Push fib(2)',
          action: 'Push',
          kind: 'push',
          description: 'fib(2) is still not a base case. It needs fib(1) and fib(0).',
          stack: stack({ call: 'fib(2)', detail: 'waiting for fib(1) + fib(0)', kind: 'waiting' }, { call: 'fib(3)', detail: 'paused', kind: 'waiting' }, { call: 'fib(4)', detail: 'paused', kind: 'waiting' }, { call: 'fib(5)', detail: 'paused', kind: 'waiting' }),
          waiting: [{ label: 'fib(2)', detail: 'waits for fib(1) and fib(0)' }, { label: 'fib(3)', detail: 'waits for fib(2) and fib(1)' }],
          tree: [{ label: 'fib(2)', kind: 'push' }, { label: 'fib(1)', kind: 'base' }, { label: 'fib(0)', kind: 'base' }]
        },
        {
          title: 'Push fib(1)',
          action: 'Base case',
          kind: 'base',
          description: 'fib(1) is a direct answer. No more recursive calls are needed from this frame.',
          stack: stack({ call: 'fib(1)', detail: 'base case returns 1', kind: 'base' }, { call: 'fib(2)', detail: 'paused', kind: 'waiting' }, { call: 'fib(3)', detail: 'paused', kind: 'waiting' }, { call: 'fib(4)', detail: 'paused', kind: 'waiting' }, { call: 'fib(5)', detail: 'paused', kind: 'waiting' }),
          waiting: [{ label: 'fib(2)', detail: 'waiting for fib(1) result first' }],
          tree: [{ label: 'fib(1)', kind: 'base' }]
        },
        {
          title: 'Pop fib(1)',
          action: 'Pop',
          kind: 'pop',
          description: 'fib(1) returns 1 and its stack frame is removed. Control goes back to fib(2).',
          stack: stack({ call: 'fib(2)', detail: 'has left value 1, needs fib(0)', kind: 'waiting' }, { call: 'fib(3)', detail: 'paused', kind: 'waiting' }, { call: 'fib(4)', detail: 'paused', kind: 'waiting' }, { call: 'fib(5)', detail: 'paused', kind: 'waiting' }),
          returned: [{ label: 'fib(1) -> 1', detail: 'left child of fib(2)' }]
        },
        {
          title: 'Push fib(0)',
          action: 'Base case',
          kind: 'base',
          description: 'Now fib(2) evaluates its right child. fib(0) is also a direct answer.',
          stack: stack({ call: 'fib(0)', detail: 'base case returns 0', kind: 'base' }, { call: 'fib(2)', detail: 'waiting to add 1 + 0', kind: 'waiting' }, { call: 'fib(3)', detail: 'paused', kind: 'waiting' }, { call: 'fib(4)', detail: 'paused', kind: 'waiting' }, { call: 'fib(5)', detail: 'paused', kind: 'waiting' }),
          returned: [{ label: 'fib(1) -> 1', detail: 'already returned' }],
          tree: [{ label: 'fib(2)', kind: 'waiting' }, { label: 'fib(1)', kind: 'return' }, { label: 'fib(0)', kind: 'base' }]
        },
        {
          title: 'Pop fib(0)',
          action: 'Pop',
          kind: 'pop',
          description: 'fib(0) returns 0 and is removed from the stack.',
          stack: stack({ call: 'fib(2)', detail: 'ready to add 1 + 0', kind: 'return' }, { call: 'fib(3)', detail: 'paused', kind: 'waiting' }, { call: 'fib(4)', detail: 'paused', kind: 'waiting' }, { call: 'fib(5)', detail: 'paused', kind: 'waiting' }),
          returned: [{ label: 'fib(1) -> 1' }, { label: 'fib(0) -> 0' }]
        },
        {
          title: 'Pop fib(2)',
          action: 'Unwind',
          kind: 'pop',
          description: 'fib(2) now has both child answers, so it adds them and returns 1.',
          stack: stack({ call: 'fib(3)', detail: 'has left value fib(2) = 1', kind: 'waiting' }, { call: 'fib(4)', detail: 'paused', kind: 'waiting' }, { call: 'fib(5)', detail: 'paused', kind: 'waiting' }),
          returned: [{ label: 'fib(2) -> 1', detail: 'computed from 1 + 0' }],
          addition: { title: 'Return addition', body: 'fib(2) = fib(1) + fib(0) = 1 + 0 = 1' }
        },
        {
          title: 'Complete fib(3)',
          action: 'Unwind',
          kind: 'pop',
          description: 'fib(3) still needs its right child fib(1). That base case returns 1, so fib(3) can return 2.',
          stack: stack({ call: 'fib(4)', detail: 'has left value fib(3) = 2', kind: 'waiting' }, { call: 'fib(5)', detail: 'paused', kind: 'waiting' }),
          returned: [{ label: 'fib(2) -> 1' }, { label: 'fib(1) -> 1' }, { label: 'fib(3) -> 2' }],
          repeated: [{ label: 'fib(1)', detail: 'this base case is reached again' }],
          addition: { title: 'Return addition', body: 'fib(3) = fib(2) + fib(1) = 1 + 1 = 2' }
        },
        {
          title: 'Complete fib(4)',
          action: 'Unwind',
          kind: 'pop',
          description: 'fib(4) now computes its right child fib(2). That repeats work already done inside fib(3).',
          stack: stack({ call: 'fib(5)', detail: 'has left value fib(4) = 3, needs right fib(3)', kind: 'waiting' }),
          returned: [{ label: 'fib(3) -> 2' }, { label: 'fib(2) -> 1' }, { label: 'fib(4) -> 3' }],
          repeated: [{ label: 'fib(2)', detail: 'computed again for fib(4)' }, { label: 'fib(1)', detail: 'reached many times' }],
          addition: { title: 'Return addition', body: 'fib(4) = fib(3) + fib(2) = 2 + 1 = 3' }
        },
        {
          title: 'Compute right fib(3)',
          action: 'Repeat work',
          kind: 'repeat',
          description: 'fib(5) now starts its right child fib(3). This is repeated work because fib(3) was already computed while solving fib(4).',
          stack: stack({ call: 'fib(3)', detail: 'recomputed as right child of fib(5)', kind: 'repeat' }, { call: 'fib(5)', detail: 'waiting to add 3 + fib(3)', kind: 'waiting' }),
          waiting: [{ label: 'fib(5)', detail: 'waits for the second child fib(3)' }],
          repeated: [{ label: 'fib(3)', detail: 'computed again' }, { label: 'fib(2)', detail: 'will be computed again inside fib(3)' }, { label: 'fib(1)', detail: 'will be reached again' }],
          tree: [{ label: 'fib(5)', kind: 'waiting' }, { label: 'fib(4) = 3', kind: 'return' }, { label: 'fib(3)', kind: 'repeat' }]
        },
        {
          title: 'Pop fib(5)',
          action: 'Final',
          kind: 'final',
          description: 'The right fib(3) returns 2. fib(5) adds the left value 3 and right value 2, then returns 5.',
          stack: [],
          returned: [{ label: 'fib(4) -> 3' }, { label: 'fib(3) -> 2' }, { label: 'fib(5) -> 5' }],
          repeated: [{ label: 'Naive recursion repeats calls', detail: 'memoization will fix this later in dynamic programming' }],
          addition: { title: 'Final addition', body: 'fib(5) = fib(4) + fib(3) = 3 + 2 = 5' }
        }
      ]
    }
  },
  body: [
    {
      type: 'checklist',
      title: 'Objective',
      items: [
        'I can explain what Fibonacci means.',
        'I can identify the base cases for fib(0) and fib(1).',
        'I can trace how fib(n) branches into two smaller calls.',
        'I can describe what gets pushed to and popped from the call stack.',
        'I can explain why naive Fibonacci repeats work.'
      ]
    },
    { type: 'section', title: 'What Fibonacci means', content: 'Fibonacci is a sequence where each number is made by adding the previous two numbers. It starts as 0, 1, 1, 2, 3, 5, 8, 13, and continues the same way.' },
    {
      type: 'table',
      title: 'How the first Fibonacci values are formed',
      columns: ['Value', 'Meaning'],
      rows: [
        ['fib(0)', '0'],
        ['fib(1)', '1'],
        ['fib(2)', 'fib(1) + fib(0) = 1 + 0 = 1'],
        ['fib(3)', 'fib(2) + fib(1) = 1 + 1 = 2'],
        ['fib(4)', 'fib(3) + fib(2) = 2 + 1 = 3'],
        ['fib(5)', 'fib(4) + fib(3) = 3 + 2 = 5'],
        ['fib(6)', 'fib(5) + fib(4) = 5 + 3 = 8']
      ]
    },
    { type: 'callout', tone: 'info', title: 'Mental model before formula', content: 'To know today\'s number, I need yesterday\'s number and the day before yesterday\'s number. That is why fib(n) needs two smaller answers.' },
    {
      type: 'comparison',
      title: 'Factorial vs Fibonacci',
      items: [
        { label: 'Factorial', content: 'One recursive call waits for one smaller answer, such as factorial(n - 1).' },
        { label: 'Fibonacci', content: 'One recursive call waits for two smaller answers, fib(n - 1) and fib(n - 2).' }
      ]
    },
    { type: 'callout', tone: 'warning', title: 'Why this is educational but inefficient', content: 'Naive Fibonacci repeats smaller calls. That is useful for learning recursion trees, but it becomes slow for large n. Later, dynamic programming adds memory so repeated answers are reused.' }
  ],
  solutionBody: [
    {
      type: 'table',
      title: 'Return table for fib(5)',
      columns: ['Call returns', 'What it adds', 'Returned value'],
      rows: [
        ['fib(2)', 'fib(1) + fib(0) = 1 + 0', '1'],
        ['fib(3)', 'fib(2) + fib(1) = 1 + 1', '2'],
        ['fib(4)', 'fib(3) + fib(2) = 2 + 1', '3'],
        ['fib(5)', 'fib(4) + fib(3) = 3 + 2', '5']
      ]
    },
    {
      type: 'checklist',
      title: 'Trace checklist',
      items: [
        'Write both base cases before writing the recursive return.',
        'Trace the left call first because Java evaluates fib(n - 1) before fib(n - 2).',
        'Mark parent calls as waiting while child calls execute.',
        'Pop a stack frame only when that call has returned a value.',
        'Circle repeated calls so the future dynamic programming improvement feels obvious.'
      ]
    }
  ],
  relatedConcepts: ['base case', 'recursive case', 'branching recursion', 'call stack', 'return unwinding', 'recursion tree', 'overlapping subproblems'],
  followUpQuestions: [
    'Why does fib(0) return 0 while factorial(0) returns 1?',
    'Which call is evaluated first in Java: fib(n - 1) or fib(n - 2)?',
    'Where does fib(2) repeat while tracing fib(5)?',
    'Why is the deepest stack path O(n) even though the total number of calls is much larger?',
    'How would memoization avoid repeated work without changing the meaning of Fibonacci?'
  ],
  metadata: {
    sequence: 3,
    reviewStatus: 'approved',
    visibility: ['dev', 'prod'],
    source: 'original',
    estimatedTimeSeconds: 900
  }
});

export default problem;
