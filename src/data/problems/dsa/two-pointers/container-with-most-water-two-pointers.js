import { defineLearningProblem } from '../../../../problems/problemAuthoring.js';

const problem = defineLearningProblem({
  id: 'two-pointers-container-with-most-water-001',
  topicId: 'two-pointers',
  title: 'Container With Most Water — two pointers',
  difficulty: 'Medium',
  estimatedTime: '13 min',
  language: 'java',
  tags: ['arrays', 'two-pointers', 'interview-pattern', 'mental-model', 'visual-walkthrough', 'coding'],
  scenario: 'You are given vertical walls. Choose two walls that hold the most water between them.',
  question: 'Given height = [1, 8, 6, 2, 5, 4, 8, 3, 7], return 49.',
  examples: ['Input: height = [1,8,6,2,5,4,8,3,7] -> Output: 49'],
  constraints: [
    'Two selected lines become the left and right walls of the container.',
    'The water height is limited by the shorter selected wall.',
    'The width is the distance between the two selected indices.',
    'Return the largest possible area.'
  ],
  starterThought: 'Do not think of this as just an array. Think of it as a row of walls trying to hold water.',
  intuition: 'A container holds more water when it is wide and deep. Starting at both ends gives the widest possible container. But depth is not controlled by the taller wall. Water spills over the shorter wall first, so the shorter wall is the bottleneck. If we keep the shorter wall and move the taller wall inward, the width becomes smaller while the same short wall still limits the water. That move cannot help. The only move with a real chance is replacing the shorter wall with a taller one.',
  mentalPicture: 'Imagine two boards standing on the ground with water poured between them. If the left board is tiny and the right board is tall, the water spills over the tiny board. Swapping the tall board for another tall board does not solve the spill. You must replace the tiny board. That is why the pointer on the shorter wall moves.',
  patternSignal: 'Use two pointers when two boundaries define the answer and one boundary is clearly the bottleneck.',
  invariant: 'best stores the largest container seen so far. Once the shorter wall is processed, every narrower container using that same short wall can be ignored because it has smaller width and no higher water level.',
  bruteForceThought: 'Brute force tries every pair of walls. It works, but it misses the key insight that many pairs are impossible to improve once the shorter wall is known.',
  optimizationJourney: 'The greedy move comes from the formula: area = width * min(leftWall, rightWall). Width only shrinks as pointers move inward, so improvement must come from increasing the limiting height. That means move the shorter wall.',
  stepByStepBreakdown: [
    'Put left at the first wall and right at the last wall.',
    'Compute width as right - left.',
    'Compute water level as the shorter of the two walls.',
    'Area is width multiplied by water level.',
    'Update best if this container is stronger.',
    'Move the pointer at the shorter wall, because that is where water spills.'
  ],
  finalPattern: 'Two-pointer bottleneck elimination.',
  commonMistake: 'Moving the taller wall feels natural, but it changes the wrong wall. The shorter wall is what limits the water.',
  commonMistakes: [
    'Using the taller wall in the area calculation.',
    'Moving the taller pointer instead of the shorter pointer.',
    'Forgetting that width gets smaller after every pointer move.',
    'Updating best after moving the pointer instead of before moving it.'
  ],
  edgeCases: ['Only two walls', 'Equal-height walls', 'Strictly increasing heights', 'Strictly decreasing heights', 'Tall walls that are too close together'],
  complexityAnalysis: 'Time is O(n) because each pointer moves inward at most n times total. Space is O(1) because the algorithm only stores two pointers and the best area.',
  explanation: 'For [1,8,6,2,5,4,8,3,7], the best container uses index 1 and index 8. The width is 7, the shorter wall is 7, and the area is 7 * 7 = 49.',
  solutionCode: `class Solution {
    public int maxArea(int[] height) {
        int left = 0;
        int right = height.length - 1;
        int best = 0;

        while (left < right) {
            int width = right - left;
            int waterLevel = Math.min(height[left], height[right]);
            int area = width * waterLevel;
            best = Math.max(best, area);

            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }

        return best;
    }
}`,
  finalTakeaway: 'The shorter wall is the spill point. Move the spill point, not the wall that is already tall enough.',
  selfExplanationPrompt: 'Why can moving the taller wall inward never help while the shorter wall remains the same?',
  visualExplanation: 'The walkthrough draws the problem as actual walls and water. The blue fill shows the water level, the highlighted walls show the current container, and the metrics explain width, water level, area, and best area.',
  visualWalkthrough: {
    title: 'Visual Walkthrough: walls, water, and the bottleneck',
    summary: 'Watch the container form between two walls. The water level stops at the shorter wall, so the shorter wall decides which pointer moves.',
    diagram: {
      type: 'container-water',
      title: 'height = [1, 8, 6, 2, 5, 4, 8, 3, 7]',
      description: 'Each step shows the selected walls, water fill, width, water level, current area, best area, and the reason for the next pointer move.',
      values: [1, 8, 6, 2, 5, 4, 8, 3, 7],
      bestPair: [1, 8],
      takeaway: 'Area is limited by the shorter wall. Since width only shrinks, the only hopeful move is to replace the shorter wall with a taller one.',
      stateTitle: 'Container reasoning',
      stateDescription: 'The same formula is applied at every step: area = width × shorter wall.',
      frames: [
        {
          title: 'Start with the widest container',
          short: 'Widest container, but water is shallow.',
          left: 0,
          right: 8,
          width: 8,
          waterLevel: 1,
          area: 8,
          best: 8,
          bestPair: [0, 8],
          movePointer: 'left',
          reason: 'The left wall has height 1, so water spills there. Moving the right wall would shrink the width while the water level stays stuck at 1. Replace the short left wall.',
          state: { label: 'area 8', values: ['left 0', 'right 8', 'width 8', 'water level 1', 'best 8'], helper: 'Wide is not enough when one wall is very short.' },
          description: 'The first container is very wide, but it is shallow because the left wall is only height 1.'
        },
        {
          title: 'A deep and still-wide container appears',
          short: 'Move left to height 8. New best = 49.',
          left: 1,
          right: 8,
          width: 7,
          waterLevel: 7,
          area: 49,
          best: 49,
          bestPair: [1, 8],
          movePointer: 'right',
          reason: 'Now the right wall has height 7 and becomes the shorter wall. This pair is strong because it is both wide and deep.',
          state: { label: 'best 49', values: ['left 1', 'right 8', 'width 7', 'water level 7', 'area 49'], helper: 'This is the best container in the example.' },
          description: 'The water can now rise to height 7 across width 7, giving area 49.'
        },
        {
          title: 'The right wall becomes the spill point',
          short: 'Right wall is short, so move right inward.',
          left: 1,
          right: 7,
          width: 6,
          waterLevel: 3,
          area: 18,
          best: 49,
          bestPair: [1, 8],
          movePointer: 'right',
          reason: 'The right wall is only height 3. The left wall is tall enough already, so moving the left wall would not fix the low spill point on the right.',
          state: { label: 'area 18', values: ['left 1', 'right 7', 'width 6', 'water level 3', 'best 49'], helper: 'The shorter wall tells us which pointer should move.' },
          description: 'This container is worse because the water level drops to 3 and the width is already smaller.'
        },
        {
          title: 'A tall wall is useful only if width remains enough',
          short: 'Another tall wall appears, but width is smaller.',
          left: 1,
          right: 6,
          width: 5,
          waterLevel: 8,
          area: 40,
          best: 49,
          bestPair: [1, 8],
          movePointer: 'right',
          reason: 'Both walls are tall, but the width has shrunk to 5. Deep water with too little width still cannot beat 49.',
          state: { label: 'area 40', values: ['left 1', 'right 6', 'width 5', 'water level 8', 'best 49'], helper: 'Height improved, but width dropped too much.' },
          description: 'This pair can hold deep water, but not enough total area to beat the earlier wide-and-deep container.'
        },
        {
          title: 'Keep eliminating the bottleneck',
          short: 'Keep moving the shorter wall.',
          left: 1,
          right: 5,
          width: 4,
          waterLevel: 4,
          area: 16,
          best: 49,
          bestPair: [1, 8],
          movePointer: 'right',
          reason: 'The right wall is shorter, so it controls the water level. The algorithm keeps replacing the bottleneck wall.',
          state: { label: 'area 16', values: ['left 1', 'right 5', 'width 4', 'water level 4', 'best 49'], helper: 'Best stays remembered while weaker containers are checked.' },
          description: 'The current area is smaller, so the best value remains 49.'
        },
        {
          title: 'All useful candidates are checked',
          short: 'Search finishes. Best area = 49.',
          left: 1,
          right: 2,
          width: 1,
          waterLevel: 6,
          area: 6,
          best: 49,
          bestPair: [1, 8],
          movePointer: 'right',
          reason: 'At this point the width is too small to beat the best container. The search has safely eliminated weaker choices.',
          state: { label: 'answer 49', values: ['best left 1', 'best right 8', 'best width 7', 'best area 49'], helper: 'Return the strongest container seen.' },
          description: 'The maximum water is held between index 1 and index 8.',
          finalResult: { title: 'Final answer', body: 'Return 49.' }
        }
      ]
    }
  },
  body: [
    { type: 'callout', tone: 'info', title: 'Mental model', content: 'A container is controlled by its spill point. The spill point is always the shorter wall.' },
    { type: 'flow', title: 'How to reason naturally', steps: ['Start as wide as possible.', 'Measure the water level using the shorter wall.', 'Save the area.', 'Move the shorter wall because it is the bottleneck.', 'Repeat until the pointers meet.'] },
    { type: 'checklist', title: 'Senior-engineer explanation', items: ['Area = width × min(left height, right height).', 'Width decreases after every move.', 'Moving the taller wall cannot raise the water level while the shorter wall remains.', 'So we eliminate the shorter wall and search for a better bottleneck.'] }
  ],
  relatedConcepts: ['two pointers', 'greedy elimination', 'bottleneck reasoning'],
  metadata: { reviewStatus: 'approved', visibility: ['dev', 'prod'] }
});

export default problem;
