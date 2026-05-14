const minimumSidewayJumps = {
  id: 'dynamic-programming-020',
  type: 'coding',
  topicId: 'dynamic-programming',
  title: 'Minimum Sideway Jumps',
  difficulty: 'Medium',
  estimatedTime: '10 min',
  tags: [
    'dsa',
    'dynamic-programming',
    'state-compression',
    'greedy',
    'minimum-sideway-jumps',
    'coding'
  ],
  scenario:
    'A frog starts in lane 2 at position 0 and wants to reach the end of a three-lane road. Some positions have obstacles in specific lanes. Moving forward in the same lane is free, while side-jumping to another lane costs 1.',
  question:
    'Given obstacles = [0, 1, 2, 3, 0, 0], find the minimum number of sideway jumps needed for the frog to reach the end. Output: 2.',
  examples: [
    'Input: obstacles = [0, 1, 2, 3, 0, 0] → Output: 2'
  ],
  constraints: [
    'The road has exactly 3 lanes.',
    'obstacles[i] is 0 when no lane is blocked at position i.',
    'obstacles[i] is 1, 2, or 3 when that lane is blocked at position i.',
    'Moving forward in the same lane costs 0; side-jumping costs 1.'
  ],
  starterThought:
    'Track only three values: the minimum cost to stand in lane 1, lane 2, and lane 3 at the current position. At each obstacle, mark the blocked lane as unreachable, then relax the remaining lanes using the best available cost plus one side jump.',
  intuition:
    'Key Insight — State Compression: at any position, we only need three numbers: the minimum cost to be in each lane. We do not need to remember the full path, because future decisions only depend on the cheapest cost per lane right now. State boxes: dp[1] = min cost in lane 1, dp[2] = min cost in lane 2, dp[3] = min cost in lane 3.',
  visualExplanation:
    'Start with dp = [1, 0, 1], block impossible lanes, relax open lanes, and return the minimum state at the end.',
  patternSignal:
    'The problem asks for a minimum cost over positions, but each position only needs three lane states, making it a space-optimized dynamic programming problem with a small greedy relaxation step.',
  invariant:
    'After processing each position, dp[lane] stores the minimum side jumps needed to be safely standing in that lane at that position.',
  hints: [
    'Initialize dp = [1, 0, 1] because the frog starts in lane 2.',
    'When a lane is blocked at the current position, set that lane to infinity.',
    'For every unblocked lane, compare its current cost with best + 1.',
    'The answer is the minimum of the three lane costs after processing all positions.'
  ],
  stepByStepBreakdown: [
    'Initialize DP array: start at position 0 in lane 2 with dp = [1, 0, 1].',
    'Iterate through each position and check which lane is blocked.',
    'Set the blocked lane cost to infinity because the frog cannot stand there.',
    'Find the best cost among the remaining lanes.',
    'For each unblocked lane, relax its cost using best + 1 side jump.',
    'Return min(dp) after processing the final position.'
  ],
  bruteForceThought:
    'A brute-force search could try every forward move and side jump path. That quickly repeats the same lane-position states, so it is more work than needed.',
  optimizationJourney:
    'The optimized version compresses all path history into three lane costs. Since there are only three lanes, every position does constant work.',
  finalPattern: 'Dynamic Programming with State Compression',
  complexityAnalysis:
    'Time: O(n), because each obstacle position is processed once and each position performs constant work across 3 lanes. Space: O(1), because only 3 DP values are stored.',
  explanation:
    'Set dp = [1, 0, 1]. For each obstacle position after the start, mark the blocked lane as unreachable. Then compute the best current cost and relax each unblocked lane with best + 1. For obstacles = [0, 1, 2, 3, 0, 0], the final state is [2, 3, 3], so the minimum number of sideway jumps is 2.',
  solutionCode: `def minSideJumps(obstacles):
    dp = [1, 0, 1]

    for obs in obstacles[1:]:
        if obs != 0:
            dp[obs - 1] = float("inf")

        best = min(dp)
        for lane in range(3):
            if obs != lane + 1:
                dp[lane] = min(dp[lane], best + 1)

    return min(dp)`,
  engineeringInsight:
    'This is a strong example of senior DP thinking: keep the state small, update it safely, and prove that the compressed state still contains everything needed for the next decision.',
  commonMistake:
    'Updating the blocked lane after relaxing costs can accidentally allow the frog to stand on an obstacle.',
  commonMistakes: [
    'Forgetting that lane numbers are 1-based while array indexes are 0-based.',
    'Relaxing a blocked lane instead of leaving it as infinity.',
    'Keeping a full DP table even though only the current 3-lane state is needed.',
    'Returning a specific lane cost instead of min(dp).'
  ],
  productionReality:
    'The same idea appears in route planning and constrained optimization: carry only the cheapest valid state for each small category of future choices.',
  relatedConcepts: [
    'Dynamic Programming',
    'State Compression',
    'Greedy Relaxation',
    'Minimum Cost Path',
    'O(1) Space DP'
  ],
  references: [
    'LeetCode 1824: Minimum Sideway Jumps',
    'Pattern: Dynamic Programming with 3 compressed lane states'
  ],
  visualWalkthrough: {
    title: 'Three-lane road',
    summary: 'Walk through the obstacle positions while tracking the compressed DP state [lane 1, lane 2, lane 3].',
    diagram: {
      type: 'grid',
      variant: 'road',
      title: 'Three-lane road',
      description: 'Move forward for free when the lane is open, or side-jump once when an obstacle blocks the path.',
      rows: ['Lane 1', 'Lane 2', 'Lane 3'],
      columns: ['0', '1', '2', '3', '4', '5'],
      defaultCellLabel: '→',
      stateTitle: 'DP States Evolution',
      stateDescription: 'Each row stores the best known cost as [lane 1, lane 2, lane 3].',
      legend: [
        { role: 'active', marker: '🐸', label: 'Frog' },
        { role: 'open', marker: '→', label: 'Move forward free' },
        { role: 'blocked', marker: 'X', label: 'Blocked' },
        { role: 'goal', marker: '🏁', label: 'Goal' }
      ],
      baseCells: [
        { row: 0, col: 1, role: 'blocked', label: 'X' },
        { row: 1, col: 2, role: 'blocked', label: 'X' },
        { row: 2, col: 3, role: 'blocked', label: 'X' },
        { row: 0, col: 5, role: 'goal', label: '🏁' },
        { row: 1, col: 5, role: 'goal', label: '🏁' },
        { row: 2, col: 5, role: 'goal', label: '🏁' }
      ],
      frames: [
        { title: 'Start', position: 0, cells: [{ row: 1, col: 0, role: 'active', label: '🐸' }], state: { label: 'P0', values: [1, 0, 1], helper: 'Start: frog in lane 2.' }, description: 'The frog starts in lane 2 at position 0. Initial costs: lane 1 = 1, lane 2 = 0, lane 3 = 1.' },
        { title: 'Block lane 1', position: 1, cells: [{ row: 1, col: 1, role: 'active', label: '🐸' }], state: { label: 'P1', values: ['∞', 0, 1], helper: 'Lane 1 blocked — ∞.' }, description: 'Position 1 blocks lane 1. Lane 1 becomes unreachable, but the frog can still continue in lane 2.' },
        { title: 'Block lane 2', position: 2, cells: [{ row: 0, col: 2, role: 'active', label: '🐸' }], state: { label: 'P2', values: [2, '∞', 1], helper: 'Lane 2 blocked — jump before the obstacle.' }, description: 'Position 2 blocks lane 2. The frog must side-jump from lane 2 before this obstacle. Lane 1 becomes reachable at cost 2.' },
        { title: 'Block lane 3', position: 3, cells: [{ row: 0, col: 3, role: 'active', label: '🐸' }], state: { label: 'P3', values: [2, 3, '∞'], helper: 'Lane 3 blocked — cost propagates.' }, description: 'Position 3 blocks lane 3. Lane 1 remains the cheapest valid lane.' },
        { title: 'Relax open lanes', position: 4, cells: [{ row: 0, col: 4, role: 'active', label: '🐸' }], state: { label: 'P4', values: [2, 3, 3], helper: 'No blocks — relax side jumps.' }, description: 'Position 4 has no blocks. Costs are relaxed, so lane 3 can now be reached at cost 3 via a side jump.' },
        { title: 'End reached', position: 5, cells: [{ row: 0, col: 5, role: 'active', label: '🐸' }], state: { label: 'P5', values: [2, 3, 3], helper: 'End reached.' }, description: 'Position 5 is the end. Final answer = min(2, 3, 3) = 2 sideway jumps.', finalResult: { title: 'Final answer', body: 'Minimum sideway jumps = min(2, 3, 3) = 2.' } }
      ]
    }
  }
};

export default minimumSidewayJumps;
