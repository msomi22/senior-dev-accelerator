import { defineLearningProblem } from '../../../../problems/problemAuthoring.js';

const problem = defineLearningProblem({
  id: 'dynamic-programming-coin-change-state-transition-001',
  topicId: 'dynamic-programming',
  title: 'Coin Change — dynamic programming state/transition',
  difficulty: 'Medium',
  estimatedTime: '17 min',
  tags: ['dynamic-programming', 'state-transition', 'arrays', 'interview-pattern', 'mental-model', 'visual-walkthrough'],
  scenario: 'Given coin denominations and a target amount, find the fewest coins needed to make that amount.',
  prompt: 'How does dynamic programming build the best answer for a large amount from saved answers to smaller amounts?',
  starterThought: 'To solve amount X, try using one coin now and ask which smaller amount remains.',
  plainLanguageExplanation: 'Let dp[a] mean the fewest coins needed to make amount a. The base case is dp[0] = 0 because zero coins make amount zero. For each amount and each coin, if amount - coin is reachable, then dp[amount - coin] + 1 is a candidate answer.',
  mentalPicture: 'A row of boxes from amount 0 to the target amount. Each box stores the fewest coins needed for that amount. Bigger boxes learn from smaller boxes.',
  bruteForceThought: 'Brute force tries many coin combinations and repeatedly solves the same remaining amounts.',
  optimizationJourney: 'DP removes repeated work by saving the best answer for every smaller amount once, then reusing those saved answers.',
  finalPattern: 'Bottom-up DP with state and transition.',
  commonMistake: 'Treating unreachable states as valid can produce fake answers. Another common mistake is confusing minimum coins with the number of combinations.',
  edgeCases: ['Amount 0', 'No combination can make the amount', 'Coin value larger than target', 'Coin value 1 guarantees reachability', 'Unsorted coin list'],
  complexityAnalysis: 'Time is O(amount × number of coins) because each amount considers each coin. Space is O(amount) because the dp table stores one best value for every amount from 0 to target.',
  finalTakeaway: 'Dynamic programming works when a big answer can be built from saved smaller answers.',
  selfExplanationPrompt: 'In one sentence, explain what dp[amount] means before writing the transition.',
  body: [
    { type: 'callout', tone: 'info', title: 'Pattern signal', content: 'Use DP when the same smaller subproblems repeat and a larger answer can reuse saved smaller answers.' },
    { type: 'diagram', title: 'State definition', content: 'dp[a] = fewest coins needed to make amount a\nbase: dp[0] = 0\ntransition: try each coin, then use dp[a - coin] + 1 when reachable' },
    {
      type: 'table',
      title: 'Walkthrough: coins = [1, 2, 5], amount = 5',
      columns: ['Amount', 'Coin considered', 'Previous smaller amount', 'Candidate answer', 'Best so far'],
      rows: [
        ['1', '1', '0', 'dp[0] + 1 = 1', '1'],
        ['2', '1', '1', 'dp[1] + 1 = 2', '2'],
        ['2', '2', '0', 'dp[0] + 1 = 1', '1'],
        ['3', '1', '2', 'dp[2] + 1 = 2', '2'],
        ['3', '2', '1', 'dp[1] + 1 = 2', '2'],
        ['5', '5', '0', 'dp[0] + 1 = 1', '1']
      ]
    },
    { type: 'flow', title: 'DP fill order', steps: ['Create dp table from 0 to target', 'Set dp[0] = 0', 'For every amount, try every coin', 'Skip coin if amount - coin is negative or unreachable', 'Keep the minimum candidate', 'Return -1 if target remains unreachable'] },
    { type: 'checklist', title: 'Mistakes to avoid', items: ['Define state before transition', 'Initialize dp[0] correctly', 'Use a safe unreachable value', 'Do not count combinations when the question asks for minimum coins'] }
  ],
  relatedConcepts: ['bottom-up DP', 'state definition', 'transition', 'unreachable state'],
  metadata: {
    reviewStatus: 'approved',
    visibility: ['dev', 'prod']
  }
});

export default problem;
