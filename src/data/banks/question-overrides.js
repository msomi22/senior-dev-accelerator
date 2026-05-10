const questionOverrides = {
  'sliding-window-001': {
    id: 'sliding-window-001',
    type: 'coding',
    topicId: 'sliding-window',
    title: 'Maximum Sum Subarray of Size K',
    difficulty: 'Medium',
    estimatedTime: '8 min',
    tags: [
      'dsa',
      'sliding-window',
      'wind',
      'fixed-size-window',
      'maximum-sum',
      'array',
      'invariant'
    ],
    scenario:
      'You are building a lightweight analytics feature for a payments dashboard. Given a stream of daily transaction volumes, the product team wants to know the highest total volume seen in any continuous K-day period. For example, if each number is one day of volume, the answer should come from one contiguous block of exactly K days.',
    question:
      'Given an array nums and an integer k, find the maximum sum of any contiguous subarray of exactly size k. Example: nums = [2, 1, 5, 1, 3, 2], k = 3. The best window is [5, 1, 3], so the answer is 9.',
    starterThought:
      'This is a fixed-size sliding window problem. The invariant is: after the first full window is formed, windowSum always represents the sum of exactly k contiguous elements between left and right. Every move removes the element leaving the window and adds the new element entering the window.',
    constraints: [
      'The window must contain exactly k elements, not at most k elements.',
      'If k is larger than the array length, the problem input is invalid or should return a clear fallback depending on product requirements.',
      'Negative numbers are allowed, so do not initialize the answer to 0 unless the problem guarantees non-negative input.',
      'The target runtime should be O(n), because each element should enter and leave the active window at most once.'
    ],
    hints: [
      'Start by computing the sum of the first k elements.',
      'When the window moves one step right, only two values change: one leaves, one enters.',
      'Do not recompute the sum of every k-sized block from scratch.',
      'Update maxSum after each valid k-sized window is formed.'
    ],
    intuition:
      'The brute-force solution recalculates mostly the same numbers again and again. Sliding Window works because neighboring windows overlap heavily. If the previous window sum is known, the next window sum is obtained by subtracting the outgoing value and adding the incoming value.',
    visualExplanation:
      'Window [2, 1, 5] has sum 8. Slide right: remove 2, add 1 → [1, 5, 1] sum 7. Slide right: remove 1, add 3 → [5, 1, 3] sum 9. Keep the best sum seen.',
    stepByStepBreakdown: [
      'Build the first window using the first k elements: [2, 1, 5] gives sum 8.',
      'Set maxSum to the first full window sum, because it is the first valid candidate.',
      'Move the window one position right by removing nums[left] and adding nums[right].',
      'For [1, 5, 1], compute 8 - 2 + 1 = 7, so maxSum remains 8.',
      'For [5, 1, 3], compute 7 - 1 + 3 = 9, so maxSum becomes 9.',
      'For [1, 3, 2], compute 9 - 5 + 2 = 6, so maxSum remains 9.',
      'Return maxSum after all valid windows have been checked.'
    ],
    bruteForceThought:
      'The brute-force approach tries every subarray of size k and sums each one independently. For n items and window size k, this costs O(n × k), because every window repeats almost all the previous work.',
    optimizationJourney:
      'The optimization comes from noticing overlap. Consecutive k-sized windows share k - 1 elements. Instead of recomputing the full sum, maintain a running windowSum and update it with only the outgoing and incoming elements.',
    finalPattern: 'Fixed-size Sliding Window',
    complexityAnalysis:
      'Time complexity is O(n): the first window costs O(k), then each remaining element is processed once as it enters the window. Space complexity is O(1), because only windowSum, maxSum, and pointer/index values are stored.',
    explanation:
      'For nums = [2, 1, 5, 1, 3, 2] and k = 3, the valid windows are [2,1,5] = 8, [1,5,1] = 7, [5,1,3] = 9, and [1,3,2] = 6. The maximum is 9. The key is that the active window always has exactly k elements, so every update is safe and predictable: subtract the element that leaves, add the element that enters, then compare with the best answer so far.',
    engineeringInsight:
      'This mirrors production rolling metrics: you rarely recompute an entire time window from scratch. You maintain a rolling aggregate and update it as new data arrives and old data expires.',
    commonMistake:
      'A common mistake is updating maxSum before the window has exactly k elements, or initializing maxSum to 0 when all numbers could be negative.',
    commonMistakes: [
      'Using a variable-size window when the problem requires exactly k elements.',
      'Recomputing every window sum from scratch.',
      'Updating the result before the first full window exists.',
      'Initializing maxSum to 0 when negative values are possible.',
      'Forgetting the invalid case where k is 0 or k is larger than nums.length.'
    ],
    productionReality:
      'The same pattern appears in rolling revenue totals, moving averages, rate-limit windows, observability metrics, fraud checks over recent transactions, and time-bucketed monitoring dashboards.',
    followUpQuestion:
      'How would the solution change if the window size was not fixed, for example longest subarray with sum at most S?',
    followUpQuestions: [
      'How would you handle a stream where values arrive continuously?',
      'What changes if the requirement asks for the average instead of the sum?',
      'How would negative numbers affect the approach?',
      'How would you return the actual window indices, not just the sum?'
    ],
    relatedConcepts: [
      'Fixed-size Sliding Window',
      'rolling aggregate',
      'contiguous subarray',
      'invariant',
      'O(n) optimization'
    ],
    references: [
      'Pattern: Fixed-size Sliding Window',
      'Example input: nums = [2, 1, 5, 1, 3, 2], k = 3',
      'Production analogy: rolling K-day transaction volume'
    ]
  }
};

export function applyQuestionOverrides(bank) {
  return {
    ...bank,
    questions: bank.questions.map((question) => ({
      ...question,
      ...(questionOverrides[question.id] || {})
    }))
  };
}

export default questionOverrides;
