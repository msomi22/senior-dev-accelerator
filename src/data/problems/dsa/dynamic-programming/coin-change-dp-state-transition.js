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
  visualExplanation: 'For coins = [1, 2, 5] and amount = 11, the visual shows the actual dp table from amount 0 through amount 11.',
  visualWalkthrough: {
    title: 'Coin Change DP walkthrough',
    summary: 'For coins = [1, 2, 5] and amount = 11, solve every amount from 0 through 11 and reuse saved smaller answers.',
    diagram: {
      type: 'array',
      title: 'DP table updates',
      description: 'Top numbers are the amounts being solved: 0 through 11. Each box shows dp[amount], the fewest coins needed for that amount using coins [1, 2, 5].',
      values: ['0', '1', '1', '2', '2', '1', '2', '2', '3', '3', '2', '3'],
      stateTitle: 'Current update',
      stateDescription: 'The highlighted box is the amount currently being solved. The latest state explains which coins were tried and which candidate won.',
      stateOrder: 'latest-first',
      frames: [
        {
          title: 'Amount 0: base case',
          items: [{ index: 0, role: 'answer', label: '0', caption: 'dp[0]' }],
          state: { label: 'dp[0] = 0', values: ['base case', '0 coins'], helper: 'Making amount 0 needs no coins. This is the trusted starting point for every later transition.' },
          description: 'Before solving positive amounts, set dp[0] = 0.'
        },
        {
          title: 'Amount 1: try coins 1, 2, 5',
          items: [{ index: 1, role: 'current', label: '1', caption: 'dp[1]' }],
          state: { label: 'dp[1] = 1', values: ['coin 1: dp[0]+1 = 1', 'coin 2: too large', 'coin 5: too large'], helper: 'Only coin 1 fits. Amount 1 can be made as 0 + 1, so it needs 1 coin.' },
          description: 'Solve amount 1 by checking every coin and keeping the smallest valid candidate.'
        },
        {
          title: 'Amount 2: coin 2 wins',
          items: [{ index: 2, role: 'current', label: '1', caption: 'dp[2]' }],
          state: { label: 'dp[2] = 1', values: ['coin 1: dp[1]+1 = 2', 'coin 2: dp[0]+1 = 1', 'coin 5: too large'], helper: 'Two 1-coins would work, but one 2-coin is better. Keep the minimum: 1.' },
          description: 'Amount 2 can be made directly with coin 2.'
        },
        {
          title: 'Amount 3: build from smaller answers',
          items: [{ index: 3, role: 'current', label: '2', caption: 'dp[3]' }],
          state: { label: 'dp[3] = 2', values: ['coin 1: dp[2]+1 = 2', 'coin 2: dp[1]+1 = 2', 'coin 5: too large'], helper: 'Both 2 + 1 and 1 + 2 use 2 coins, so dp[3] becomes 2.' },
          description: 'Amount 3 is not a denomination, so DP builds it from solved smaller amounts.'
        },
        {
          title: 'Amount 4: two 2-coins',
          items: [{ index: 4, role: 'current', label: '2', caption: 'dp[4]' }],
          state: { label: 'dp[4] = 2', values: ['coin 1: dp[3]+1 = 3', 'coin 2: dp[2]+1 = 2', 'coin 5: too large'], helper: 'The best candidate is dp[2] + coin 2, which gives 2 + 2 using 2 coins.' },
          description: 'The table keeps the fewest coins, not the first valid way.'
        },
        {
          title: 'Amount 5: coin 5 wins',
          items: [{ index: 5, role: 'current', label: '1', caption: 'dp[5]' }],
          state: { label: 'dp[5] = 1', values: ['coin 1: dp[4]+1 = 3', 'coin 2: dp[3]+1 = 3', 'coin 5: dp[0]+1 = 1'], helper: 'Coin 5 reaches amount 5 directly, so one coin is the best possible answer.' },
          description: 'A larger denomination can suddenly make a bigger amount cheaper.'
        },
        {
          title: 'Amount 6: reuse dp[5] or dp[1]',
          items: [{ index: 6, role: 'current', label: '2', caption: 'dp[6]' }],
          state: { label: 'dp[6] = 2', values: ['coin 1: dp[5]+1 = 2', 'coin 2: dp[4]+1 = 3', 'coin 5: dp[1]+1 = 2'], helper: 'The best candidates use 2 coins: 5 + 1 or 1 + 5.' },
          description: 'Amount 6 becomes important because it will later help build the target amount 11.'
        },
        {
          title: 'Amount 7: reuse dp[5] or dp[2]',
          items: [{ index: 7, role: 'current', label: '2', caption: 'dp[7]' }],
          state: { label: 'dp[7] = 2', values: ['coin 1: dp[6]+1 = 3', 'coin 2: dp[5]+1 = 2', 'coin 5: dp[2]+1 = 2'], helper: 'The best answer is 2 coins, such as 5 + 2.' },
          description: 'DP continues solving every amount, even if it is not the final target.'
        },
        {
          title: 'Amount 8: all valid choices give 3',
          items: [{ index: 8, role: 'current', label: '3', caption: 'dp[8]' }],
          state: { label: 'dp[8] = 3', values: ['coin 1: dp[7]+1 = 3', 'coin 2: dp[6]+1 = 3', 'coin 5: dp[3]+1 = 3'], helper: 'Every valid last-coin choice produces 3 coins, so dp[8] is 3.' },
          description: 'A previously solved middle amount can become useful later.'
        },
        {
          title: 'Amount 9: best is 3 coins',
          items: [{ index: 9, role: 'current', label: '3', caption: 'dp[9]' }],
          state: { label: 'dp[9] = 3', values: ['coin 1: dp[8]+1 = 4', 'coin 2: dp[7]+1 = 3', 'coin 5: dp[4]+1 = 3'], helper: 'Using coin 2 after dp[7], or coin 5 after dp[4], gives 3 coins.' },
          description: 'This is why DP does not skip middle amounts like 4 and 7.'
        },
        {
          title: 'Amount 10: two 5-coins',
          items: [{ index: 10, role: 'current', label: '2', caption: 'dp[10]' }],
          state: { label: 'dp[10] = 2', values: ['coin 1: dp[9]+1 = 4', 'coin 2: dp[8]+1 = 4', 'coin 5: dp[5]+1 = 2'], helper: 'The best answer is 5 + 5, using 2 coins.' },
          description: 'Amount 10 is best made with two 5-coins.'
        },
        {
          title: 'Amount 11: final target',
          items: [{ index: 11, role: 'answer', label: '3', caption: 'dp[11]' }],
          state: { label: 'dp[11] = 3', values: ['coin 1: dp[10]+1 = 3', 'coin 2: dp[9]+1 = 4', 'coin 5: dp[6]+1 = 3'], helper: 'The best answer is 3 coins. One optimal combination is 5 + 5 + 1.' },
          description: 'For amount 11, coin 1 after dp[10] and coin 5 after dp[6] both give 3 coins. Return 3.',
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
