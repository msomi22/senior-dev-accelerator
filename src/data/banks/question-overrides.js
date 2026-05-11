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

const questionAdditions = {
  'dynamic-programming': [
    {
      id: 'dynamic-programming-minimum-sideway-jumps',
      type: 'coding',
      topicId: 'dynamic-programming',
      title: 'Minimum Sideway Jumps',
      difficulty: 'Medium',
      estimatedTime: '12 min',
      tags: [
        'dsa',
        'dynamic-programming',
        'state-compression',
        'minimum-cost',
        'lane-dp',
        'leetcode-1824',
        'visual-reasoning'
      ],
      scenario:
        'A frog starts at point 0 on lane 2 of a 3-lane road and wants to reach the final point. Some positions contain obstacles, represented by obstacles[i], where 0 means no obstacle and 1, 2, or 3 means that lane is blocked at position i. The frog moves forward for free if the next position in the same lane is open, or jumps sideways at the same point with cost 1. The goal is to minimize sideway jumps.',
      question:
        'Given obstacles = [0, 1, 2, 3, 0], explain how to compute the minimum number of sideway jumps needed to reach the end. Show the DP state, the lane diagram, the transition rule, and why the answer is 2.',
      starterThought:
        'This is a minimum-cost Dynamic Programming problem with only three live states. At every road position, keep the minimum side jumps needed to stand on each lane at that position. Blocked lanes become impossible. Open lanes can either keep their previous cost by moving forward, or improve by taking one side jump from the cheapest other open lane.',
      constraints: [
        'There are always exactly 3 lanes.',
        'The frog starts at point 0 on lane 2.',
        'obstacles[0] and obstacles[n] are 0, so the start and end points are not blocked.',
        'At each position, at most one lane has an obstacle.',
        'Forward movement costs 0; sideway movement costs 1.',
        'The target runtime is O(n) and target space is O(1), because only three lane states are needed.'
      ],
      hints: [
        'Think of dp[1], dp[2], dp[3] as the cost to be on each lane at the current point.',
        'Initial state is lane 1 = 1, lane 2 = 0, lane 3 = 1 because the frog starts on lane 2 and can side-jump once to lanes 1 or 3 at point 0.',
        'When a lane has an obstacle at the current point, set its cost to impossible before relaxing side jumps.',
        'For each open lane, the best cost is min(current lane cost, cheapest other open lane + 1).',
        'You do not need a full table. Three numbers are enough because the next position depends only on the previous position.'
      ],
      intuition:
        'The frog does not care about the full path history once it reaches a point. It only cares about the cheapest way to be on lane 1, lane 2, or lane 3 at that point. That is the DP compression. Obstacles remove impossible lanes; side jumps let open lanes borrow the best cost from another open lane plus one jump.',
      visualExplanation:
        'Example obstacles = [0, 1, 2, 3, 0]\n\nPositions:  0   1   2   3   4\nLane 1:     .   X   .   .   .\nLane 2:     F   .   X   .   .\nLane 3:     .   .   .   X   .\n\nStart state at position 0: [lane1=1, lane2=0, lane3=1]\nAfter position 1 blocks lane 1: [∞, 0, 1]\nAfter relaxing open lanes: [∞, 0, 1]\nAfter position 2 blocks lane 2: [2, ∞, 1]\nAfter position 3 blocks lane 3: [2, 3, ∞]\nAt position 4 all lanes open: [2, 3, 3]\nMinimum = 2.',
      stepByStepBreakdown: [
        'Model the road as three lanes across n + 1 points. The frog begins at position 0, lane 2.',
        'Define dp[lane] as the minimum side jumps needed to stand on that lane at the current position.',
        'Initialize dp as [1, 0, 1] for lanes 1, 2, and 3 because lane 2 costs 0 and the other lanes are one side jump away.',
        'Process each position from left to right.',
        'First, if obstacles[i] blocks a lane, mark that lane impossible for this position.',
        'Second, for every open lane, compare staying in the lane with side-jumping from another open lane plus 1.',
        'For obstacles [0,1,2,3,0], the state evolves from [1,0,1] to [∞,0,1], then [2,∞,1], then [2,3,∞], then [2,3,3].',
        'Return the smallest value across the three lanes at the final position.'
      ],
      bruteForceThought:
        'A brute-force search could branch at every position: move forward if possible, or try side jumps to other lanes. This quickly repeats the same state many times because reaching the same position and lane through different histories only differs by cost. Without memoization, the branching can grow exponentially.',
      optimizationJourney:
        'Memoization turns the brute-force state into (position, lane). Then the key observation compresses it further: since movement is left to right, the next step only needs the three lane costs from the current position. That reduces the DP table to three numbers.',
      finalPattern: 'Dynamic Programming with State Compression',
      complexityAnalysis:
        'Time complexity is O(n) because each road position is processed once and each position touches only three lanes. Space complexity is O(1) because the algorithm stores only three lane costs, not an n by 3 table.',
      explanation:
        'The best solution keeps three costs: minimum side jumps needed to be on lane 1, lane 2, and lane 3 at the current point. Start with [1, 0, 1]. At each position, block the obstacle lane by setting it to impossible. Then relax all open lanes: an open lane can keep its current cost, or receive the best cost from another open lane plus one side jump. For [0,1,2,3,0], the frog can avoid lane 1 at position 1, lane 2 at position 2, and lane 3 at position 3 with only two side jumps, so the answer is 2.',
      engineeringInsight:
        'This problem is a small version of routing with blocked paths and transition costs. The senior move is recognizing that the state space looks large, but only three current costs matter at any time.',
      commonMistake:
        'A common mistake is relaxing side jumps before removing the blocked lane. That can accidentally allow the frog to stand on or jump through an obstacle at the current position.',
      commonMistakes: [
        'Using lanes as 0, 1, 2 while obstacles use 1, 2, 3 and causing off-by-one bugs.',
        'Forgetting that sideway jumps happen at the same position, not after moving forward.',
        'Updating a blocked lane after it has been marked impossible.',
        'Keeping a full DP table when three values are enough.',
        'Returning the cost of lane 2 only instead of the minimum over all lanes at the end.'
      ],
      productionReality:
        'The same idea appears in navigation systems, workflow engines, deployment routing, game path planning, and failover logic where a few current modes must avoid blocked states at minimum switching cost.',
      followUpQuestion:
        'How would the algorithm change if sideway jumps had different costs between lanes, for example lane 1 to lane 3 costs more than lane 1 to lane 2?',
      followUpQuestions: [
        'Can you explain why [1, 0, 1] is the correct starting state?',
        'Why must the obstacle lane be invalidated before side-jump relaxation?',
        'How would you reconstruct the actual lane path, not just the minimum jump count?',
        'What changes if there are more than three lanes?',
        'How would the solution change if forward movement also had a cost?'
      ],
      relatedConcepts: [
        'Dynamic Programming',
        'state compression',
        'minimum cost path',
        'finite-state transitions',
        'obstacle handling',
        'routing with blocked states'
      ],
      references: [
        'LeetCode 1824: Minimum Sideway Jumps',
        'Pattern: Dynamic Programming with three compressed lane states',
        'Example input: obstacles = [0, 1, 2, 3, 0]'
      ]
    }
  ]
};

export function applyQuestionOverrides(bank) {
  const additions = questionAdditions[bank.id] || [];

  return {
    ...bank,
    questions: [
      ...bank.questions.map((question) => ({
        ...question,
        ...(questionOverrides[question.id] || {})
      })),
      ...additions
    ]
  };
}

export default questionOverrides;
