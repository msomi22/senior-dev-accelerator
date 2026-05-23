import { defineLearningProblem } from '../../../../problems/problemAuthoring.js';

const problem = defineLearningProblem({
  id: 'monotonic-stack-queue-valid-parentheses-001',
  topicId: 'monotonic-stack-queue',
  title: 'Valid Parentheses — stack',
  difficulty: 'Easy',
  estimatedTime: '10 min',
  language: 'java',
  tags: ['stack', 'strings', 'interview-pattern', 'mental-model', 'visual-walkthrough', 'coding'],
  scenario: 'Given a string of bracket characters, decide whether every opening bracket is closed in the correct order.',
  question: 'Given s = "({[]})", return true because every closing bracket matches the most recent unmatched opening bracket.',
  examples: ['s = "({[]})" -> true', 's = "([)]" -> false'],
  constraints: ['Only bracket characters are considered.', 'A closing bracket must match the most recent unmatched opening bracket.', 'The stack must be empty after the full scan.'],
  starterThought: 'The most recently opened bracket must be the first one closed.',
  intuition: 'Opening brackets wait to be closed, so push them onto a stack. When a closing bracket appears, it must match the top of the stack. Anything else means the nesting order is broken.',
  mentalPicture: 'Think of a stack of plates. A closing bracket can only remove the top plate, never one buried underneath.',
  patternSignal: 'Use a stack when nested work must close in reverse order.',
  invariant: 'The stack contains exactly the unmatched opening brackets, with the next required closing match on top.',
  bruteForceThought: 'Checking whether a matching opening bracket exists somewhere is not enough because the order of closing matters.',
  optimizationJourney: 'The stack stores unfinished openings in last-in-first-out order, exactly matching nested bracket rules.',
  stepByStepBreakdown: ['Scan the string from left to right.', 'Push every opening bracket.', 'For every closing bracket, first ensure the stack is not empty.', 'Pop the top opening and verify it matches the closing bracket.', 'After the scan, return true only if the stack is empty.'],
  finalPattern: 'Last-in-first-out matching.',
  commonMistake: 'Checking whether a closing bracket matches anything in the stack instead of only the top opening.',
  commonMistakes: ['Peeking or popping before checking whether the stack is empty.', 'Forgetting to reject leftover opening brackets.', 'Using contains instead of top-of-stack matching.'],
  edgeCases: ['Closing bracket appears first', 'Leftover openings at the end', 'Mixed bracket types', 'Empty string if allowed', 'Odd-length string'],
  complexityAnalysis: 'Time is O(n) because each character is processed once. Space is O(n) in the worst case when many openings wait to close.',
  explanation: 'For the sample, each closing bracket matches the most recent opening bracket. The stack becomes empty at the end, so the string is valid.',
  solutionCode: `import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();

        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                stack.push(c);
                continue;
            }

            if (stack.isEmpty()) {
                return false;
            }

            char open = stack.pop();
            if ((c == ')' && open != '(') ||
                (c == ']' && open != '[') ||
                (c == '}' && open != '{')) {
                return false;
            }
        }

        return stack.isEmpty();
    }
}`,
  finalTakeaway: 'Use a stack when the last thing opened must be the first thing closed.',
  visualExplanation: 'The walkthrough shows the stack growing with openings and shrinking only when the top opening matches the closing bracket.',
  visualWalkthrough: {
    title: 'Stack matching walkthrough',
    summary: 'Every closing bracket must match the top opening bracket on the stack.',
    diagram: {
      type: 'timeline',
      title: 'Stack state evolution',
      stateTitle: 'Current unmatched openings',
      stateDescription: 'The top of the stack is the only opening bracket a closing bracket may match.',
      frames: [
        { title: 'Read openings', state: { label: 'after openings', values: { stack: '( { [' }, helper: 'Openings are pushed as they appear.' }, description: 'The stack grows while nested brackets open.' },
        { title: 'Read closing square bracket', state: { label: 'after first close', values: { stack: '( {' }, helper: 'The top opening matched and was removed.' }, description: 'A closing bracket must match the top opening.' },
        { title: 'Read closing brace', state: { label: 'after second close', values: { stack: '(' }, helper: 'The next top opening matched.' }, description: 'After one match is removed, the next nested level becomes visible.' },
        { title: 'Finish scan', state: { label: 'done', values: { stack: 'empty' }, helper: 'No unmatched openings remain.' }, description: 'All brackets closed in the correct order.', finalResult: { title: 'Final answer', body: 'Return true.' } }
      ]
    }
  },
  body: [
    { type: 'callout', tone: 'info', title: 'Pattern signal', content: 'Use a stack when nested work must close in reverse order.' },
    { type: 'flow', title: 'Validation flow', steps: ['Push opening brackets', 'Reject closing brackets when stack is empty', 'Compare closing bracket with the stack top', 'Pop only on a correct match', 'Accept only when the stack is empty'] },
    { type: 'checklist', title: 'Mistakes to avoid', items: ['Only compare with the top of stack', 'Fail fast on empty stack before closing', 'Check leftover openings at the end'] }
  ],
  relatedConcepts: ['stack', 'LIFO', 'nested structure'],
  metadata: { reviewStatus: 'approved', visibility: ['dev', 'prod'] }
});

export default problem;
