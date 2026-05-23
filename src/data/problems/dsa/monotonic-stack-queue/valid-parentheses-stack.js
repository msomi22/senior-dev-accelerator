import { defineLearningProblem } from '../../../../problems/problemAuthoring.js';

const problem = defineLearningProblem({
  id: 'monotonic-stack-queue-valid-parentheses-001',
  topicId: 'monotonic-stack-queue',
  title: 'Valid Parentheses — stack',
  difficulty: 'Easy',
  estimatedTime: '10 min',
  tags: ['stack', 'strings', 'interview-pattern', 'mental-model', 'visual-walkthrough'],
  scenario: 'Given a string of brackets, decide whether every opening bracket is closed in the correct order.',
  prompt: 'Why does a stack correctly match parentheses, brackets, and braces?',
  starterThought: 'The most recently opened bracket must be the first one closed.',
  plainLanguageExplanation: 'Opening brackets wait to be closed, so we push them onto a stack. A closing bracket must match the top of the stack. If the stack is empty or the top does not match, the string is invalid. At the end, the stack must be empty.',
  mentalPicture: 'Think of a stack of plates. Every opening bracket places a plate on top. A closing bracket must match the top plate, not one buried underneath.',
  bruteForceThought: 'Trying to check whether a matching opening bracket exists somewhere is not enough because order matters.',
  optimizationJourney: 'The stack stores unfinished openings in exactly the order we need: last opened, first closed.',
  finalPattern: 'Last-in-first-out matching.',
  commonMistake: 'Checking whether a closing bracket matches something anywhere in the stack instead of only the top breaks nested cases like ([)] .',
  edgeCases: ['Closing bracket appears first', 'Leftover openings at the end', 'Mixed bracket types', 'Empty string if allowed', 'Odd-length strings'],
  complexityAnalysis: 'Time is O(n) because each character is processed once. Space is O(n) in the worst case when many openings are waiting to be closed.',
  finalTakeaway: 'Use a stack when the last thing opened must be the first thing closed.',
  selfExplanationPrompt: 'Explain why ([)] is invalid even though every bracket type appears once opened and once closed.',
  body: [
    { type: 'callout', tone: 'info', title: 'Pattern signal', content: 'Use a stack when nested work must close in reverse order.' },
    {
      type: 'table',
      title: 'Step frames: s = "({[]})"',
      columns: ['Character', 'Stack before', 'Action', 'Stack after', 'Reason'],
      rows: [
        ['(', '[]', 'push (', '[(]', 'Opening waits to close.'],
        ['{', '[(]', 'push {', '[(, {]', 'Nested opening waits on top.'],
        ['[', '[(, {]', 'push [', '[(, {, []', 'Most recent opening.'],
        [']', '[(, {, []', 'pop [', '[(, {]', 'Closing ] matches top [.'],
        ['}', '[(, {]', 'pop {', '[(]', 'Closing } matches top {.'],
        [')', '[(]', 'pop (', '[]', 'Closing ) matches top (.']
      ]
    },
    { type: 'flow', title: 'Validation flow', steps: ['If opening bracket, push it', 'If closing bracket, stack must not be empty', 'Closing bracket must match top opening', 'Pop the matched opening', 'After the scan, stack must be empty'] },
    { type: 'checklist', title: 'Mistakes to avoid', items: ['Only compare with the top of stack', 'Fail fast on empty stack before closing', 'Check leftover openings at the end', 'Use a map from closing bracket to expected opening bracket'] }
  ],
  relatedConcepts: ['stack', 'LIFO', 'nested structure'],
  metadata: {
    reviewStatus: 'approved',
    visibility: ['dev', 'prod']
  }
});

export default problem;
