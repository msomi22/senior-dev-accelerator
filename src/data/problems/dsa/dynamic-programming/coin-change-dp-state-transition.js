import { defineLearningProblem } from '../../../../problems/problemAuthoring.js';

const problem = defineLearningProblem({
  id: 'dynamic-programming-coin-change-state-transition-001',
  topicId: 'dynamic-programming',
  title: 'Coin Change — dynamic programming state/transition',
  difficulty: 'Medium',
  estimatedTime: '17 min',
  language: 'java',
  tags: ['dynamic-programming', 'state-transition', 'arrays', 'interview-pattern', 'visual-walkthrough', 'coding'],
  scenario: 'Given coin denominations and a target amount, find the fewest coins needed to make that amount.',
  question: 'Given coins = [1, 2, 5] and amount = 11, return 3.',
  examples: ['coins = [1, 2, 5], amount = 11 -> 3'],
  constraints: ['Each coin can be used multiple times.', 'Return -1 if the amount cannot be made.'],
  starterThought: 'To solve amount X, try using one coin now and ask which smaller amount remains.',
  intuition: 'Let dp[a] mean the fewest coins needed to make amount a. Start with dp[0] = 0, then build every larger amount from reachable smaller amounts.',
  mentalPicture: 'A row of boxes from amount 0 to the target amount. Each box stores the fewest coins needed for that amount.',
  patternSignal: 'Use DP when a large answer can be built from repeated smaller answers that should be saved.',
  invariant: 'After processing an amount, its dp cell stores the minimum number of coins currently known for that exact amount.',
  stepByStepBreakdown: ['Create the dp table.', 'Set the zero amount to zero.', 'Try every coin for every amount.', 'Keep the smallest reachable candidate.', 'Return the target cell or -1.'],
  bruteForceThought: 'Brute force repeats the same remaining amounts many times.',
  optimizationJourney: 'DP saves each smaller result once and reuses it.',
  finalPattern: 'Bottom-up DP with state and transition.',
  commonMistake: 'Treating unreachable states as valid can produce fake answers.',
  edgeCases: ['Amount zero', 'No valid combination', 'Coin larger than amount'],
  complexityAnalysis: 'Time is O(amount times number of coins). Space is O(amount).',
  explanation: 'For every amount, try each coin as the last coin used. If the remaining amount is reachable, that creates a candidate answer. The smallest candidate becomes the dp value.',
  solutionCode: `import java.util.Arrays;

class Solution {
    public int coinChange(int[] coins, int amount) {
        int limit = amount + 1;
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, limit);
        dp[0] = 0;

        for (int a = 1; a <= amount; a++) {
            for (int coin : coins) {
                int prev = a - coin;
                if (prev >= 0 && dp[prev] != limit) {
                    dp[a] = Math.min(dp[a], dp[prev] + 1);
                }
            }
        }

        return dp[amount] == limit ? -1 : dp[amount];
    }
}`,
  finalTakeaway: 'Dynamic programming works when a big answer can be built from saved smaller answers.',
  visualExplanation: 'For coins = [1, 2, 5] and amount = 11, each frame highlights the dp cell that becomes useful for reaching the final answer.',
  visualWalkthrough: {
    title: 'Coin Change DP walkthrough',
    summary: 'For coins = [1, 2, 5] and amount = 11, build the answer using saved smaller answers.',
    diagram: {
      type: 'array',
      title: 'DP table updates',
      description: 'Example: coins = [1, 2, 5], amount = 11. Each dp cell stores the fewest coins needed for that amount.',
      values: ['dp[0]', 'dp[1]', 'dp[2]', 'dp[5]', 'dp[6]', 'dp[11]'],
      stateTitle: 'Current update',
      stateDescription: 'The latest state explains the cell currently being improved.',
      stateOrder: 'latest-first',
      frames: [
        {
          title: 'Define the trusted base',
          items: [{ index: 0, role: 'answer', label: '0', caption: 'known' }],
          state: { label: 'dp[0]', values: ['0 coins'], helper: 'Making amount 0 needs no coins. This gives the table a trusted starting point.' },
          description: 'Start with dp[0] = 0 because amount 0 costs 0 coins.'
        },
        {
          title: 'One coin can solve 1, 2, and 5',
          items: [
            { index: 0, role: 'success', label: '0', caption: 'base' },
            { index: 1, role: 'current', label: '1', caption: 'coin 1' },
            { index: 2, role: 'current', label: '1', caption: 'coin 2' },
            { index: 3, role: 'current', label: '1', caption: 'coin 5' }
          ],
          state: { label: 'dp[1], dp[2], dp[5]', values: ['1 coin each'], helper: 'Amounts 1, 2, and 5 can each be made directly using one available coin.' },
          description: 'The coin values themselves are the first useful positive amounts: 1, 2, and 5 each need one coin.'
        },
        {
          title: 'Build amount 6 from a saved answer',
          items: [
            { index: 1, role: 'success', label: '1', caption: 'reuse' },
            { index: 3, role: 'success', label: '1', caption: 'coin 5' },
            { index: 4, role: 'current', label: '2', caption: 'update' }
          ],
          state: { label: 'dp[6]', values: ['dp[1] + coin 5', '1 + 1 = 2'], helper: 'Amount 6 can be made by reusing dp[1], then adding coin 5. That gives 1 + 5 = 6 using 2 coins.' },
          description: 'Amount 6 matters because it becomes the saved smaller answer we can reuse to reach 11.'
        },
        {
          title: 'Reach the target amount 11',
          items: [
            { index: 4, role: 'success', label: '2', caption: 'reuse dp[6]' },
            { index: 5, role: 'answer', label: '3', caption: 'answer' }
          ],
          state: { label: 'dp[11]', values: ['dp[6] + coin 5', '2 + 1 = 3', '5 + 1 + 5'], helper: 'Use coin 5 as the last coin. Before that, amount 6 was already solved in 2 coins, so amount 11 takes 3 coins.' },
          description: 'Since dp[6] = 2, adding one more 5-coin gives dp[11] = 3. This matches 5 + 5 + 1.',
          finalResult: { title: 'Final answer', body: 'Return 3 because 11 can be made with three coins: 5 + 5 + 1. The problem asks for the fewest coins, not just any combination.' }
        }
      ]
    }
  },
  body: [
    {
      type: 'callout',
      tone: 'info',
      title: 'Why the answer is 3',
      content: 'We need to make 11 using coins [1, 2, 5]. One optimal way is 5 + 5 + 1 = 11, which uses 3 coins. The problem asks for the fewest coins, so the answer is 3.'
    },
    {
      type: 'callout',
      tone: 'info',
      title: 'Why dynamic programming?',
      content: 'For this example, the best answer is easy to see. In general, choosing the biggest coin first can fail, so DP saves the best answer for each smaller amount and reuses it.'
    },
    { type: 'callout', tone: 'info', title: 'Pattern signal', content: 'Use DP when smaller saved answers build larger answers.' }
  ],
  relatedConcepts: ['bottom-up DP', 'state definition', 'transition'],
  metadata: { reviewStatus: 'approved', visibility: ['dev', 'prod'] }
});

export default problem;
