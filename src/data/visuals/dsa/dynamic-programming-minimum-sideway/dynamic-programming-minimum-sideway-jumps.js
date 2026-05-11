const sharedFrameImage = '/visuals/minimum-sideway-jumps-overview.svg';

const visualWalkthrough = {
  title: 'Minimum Sideway Jumps — lane DP visual walkthrough',
  summary:
    'Watch the frog move through a three-lane road while the DP state tracks the cheapest cost to stand on each lane. Each frame shows the blocked lane, the current lane costs, and the reason the state changes.',
  diagram: {
    title: 'Three-lane road + compressed DP state',
    intervalMs: 2600,
    laneScene: {
      title: 'Interactive lane-state animation',
      positions: [0, 1, 2, 3, 4],
      lanes: [1, 2, 3],
      obstacles: [
        { lane: 1, position: 1 },
        { lane: 2, position: 2 },
        { lane: 3, position: 3 }
      ]
    },
    frames: [
      {
        label: 'Start at position 0',
        frameType: 'initial-state',
        image: sharedFrameImage,
        imageAlt: 'Minimum Sideway Jumps lane overview',
        scene: {
          position: 0,
          frogLane: 2,
          blockedLane: null,
          dp: [1, 0, 1],
          caption:
            'The frog starts on lane 2. Other lanes are reachable with one side jump.'
        },
        value:
          'pos: 0\n\nLane 1:  .   .   .   .   .\nLane 2:  F   .   .   .   .\nLane 3:  .   .   .   .   .\n\nDP = [1, 0, 1]',
        metrics: {
          blockedLane: 'none',
          lane1Cost: 1,
          lane2Cost: 0,
          lane3Cost: 1,
          bestCost: 0
        },
        note:
          'The frog starts on lane 2. Lane 1 and lane 3 are reachable with one side jump, so the initial compressed state is [1, 0, 1].'
      },
      {
        label: 'Position 1 blocks lane 1',
        frameType: 'obstacle-filter',
        image: sharedFrameImage,
        imageAlt: 'Minimum Sideway Jumps obstacle transition',
        scene: {
          position: 1,
          frogLane: 2,
          blockedLane: 1,
          dp: ['∞', 0, 1],
          caption:
            'Lane 1 becomes invalid. Lane 2 remains the cheapest safe route.'
        },
        value:
          'pos: 1\n\nLane 1:  .   X   .   .   .\nLane 2:  F → .   .   .   .\nLane 3:  .   .   .   .   .\n\nBefore relax: [∞, 0, 1]\nAfter relax:  [∞, 0, 1]',
        metrics: {
          blockedLane: 1,
          lane1Cost: '∞',
          lane2Cost: 0,
          lane3Cost: 1,
          bestCost: 0
        },
        note:
          'Lane 1 is impossible at this position. Lane 2 remains cheapest, and lane 3 is still one side jump away.'
      },
      {
        label: 'Position 2 blocks lane 2',
        frameType: 'side-jump-relaxation',
        image: sharedFrameImage,
        imageAlt: 'Minimum Sideway Jumps side jump state',
        scene: {
          position: 2,
          frogLane: 3,
          blockedLane: 2,
          dp: [2, '∞', 1],
          caption:
            'The frog shifts to lane 3 because lane 2 becomes blocked.'
        },
        value:
          'pos: 2\n\nLane 1:  .   X   .   .   .\nLane 2:  F → .   X   .   .\nLane 3:  .   .   .   .   .\n\nBlock lane 2: [∞, ∞, 1]\nRelax lane 1: min(∞, lane3 + 1) = 2\nDP = [2, ∞, 1]',
        metrics: {
          blockedLane: 2,
          lane1Cost: 2,
          lane2Cost: '∞',
          lane3Cost: 1,
          bestCost: 1
        },
        note:
          'The frog cannot stay in lane 2. The cheapest safe option is to be on lane 3 with cost 1, or jump to lane 1 with cost 2.'
      },
      {
        label: 'Position 3 blocks lane 3',
        frameType: 'side-jump-relaxation',
        image: sharedFrameImage,
        imageAlt: 'Minimum Sideway Jumps lane survival state',
        scene: {
          position: 3,
          frogLane: 1,
          blockedLane: 3,
          dp: [2, 3, '∞'],
          caption:
            'Lane 1 now becomes the strongest surviving state.'
        },
        value:
          'pos: 3\n\nLane 1:  .   X   .   .   .\nLane 2:  F → .   X   .   .\nLane 3:  .   .   .   X   .\n\nBlock lane 3: [2, ∞, ∞]\nRelax lane 2: min(∞, lane1 + 1) = 3\nDP = [2, 3, ∞]',
        metrics: {
          blockedLane: 3,
          lane1Cost: 2,
          lane2Cost: 3,
          lane3Cost: '∞',
          bestCost: 2
        },
        note:
          'Lane 1 has cost 2 and is open, so it becomes the strongest state. Lane 2 can be reached with one more side jump.'
      },
      {
        label: 'Finish at position 4',
        frameType: 'answer-state',
        image: sharedFrameImage,
        imageAlt: 'Minimum Sideway Jumps final answer state',
        scene: {
          position: 4,
          frogLane: 1,
          blockedLane: null,
          dp: [2, 3, 3],
          caption:
            'All lanes are open again. The minimum final cost is 2.'
        },
        value:
          'pos: 4\n\nLane 1:  .   X   .   .   ✓\nLane 2:  F → .   X   .   .\nLane 3:  .   .   .   X   .\n\nAll lanes open.\nRelaxed DP = [2, 3, 3]\nAnswer = min(DP) = 2',
        metrics: {
          blockedLane: 'none',
          lane1Cost: 2,
          lane2Cost: 3,
          lane3Cost: 3,
          answer: 2
        },
        note:
          'At the end, the frog can finish from any lane. The minimum across the three compressed states is 2.'
      }
    ]
  },
  steps: [
    {
      title: 'State meaning',
      body:
        'dp[0], dp[1], and dp[2] represent the minimum side jumps needed to stand on lanes 1, 2, and 3 at the current position.'
    },
    {
      title: 'Obstacle rule',
      body:
        'Before considering side jumps, mark the blocked lane as impossible. This prevents illegal states from being reused.'
    },
    {
      title: 'Relaxation rule',
      body:
        'For each open lane, keep the current cost or borrow the cheapest other open lane plus one side jump.'
    },
    {
      title: 'Why O(1) space works',
      body:
        'The next position only depends on the three costs from the current position, so the full table can be compressed into three numbers.'
    }
  ],
  productionMapping: [
    'Blocked deployment paths',
    'Route failover with switching cost',
    'Game movement planning',
    'Workflow state transitions',
    'Minimum-cost mode switching'
  ]
};

export default visualWalkthrough;
