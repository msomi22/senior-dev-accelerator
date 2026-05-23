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
  visualExplanation: 'Focus on the picture: two selected walls, blue water between them, and the shorter wall where water spills. Width shows how far apart the walls are. Water level shows the height that can actually be held.',
  visualWalkthrough: {
    title: 'Walls, water, and the spill point',
    summary: 'The visual below is the main explanation: choose two walls, fill water between them, then move the wall where water spills.',
    diagram: {
      type: 'container-water',
      title: 'height = [1, 8, 6, 2, 5, 4, 8, 3, 7]',
      description: 'Each frame shows one real container: the chosen walls, the blue water, the width, and the bottleneck wall.',
      values: [1, 8, 6, 2, 5, 4, 8, 3, 7],
      bestPair: [1, 8],
      takeaway: 'The shorter wall is the spill point. Since width only shrinks, the only useful move is to replace that shorter wall.',
      stateTitle: 'What the picture means',
      stateDescription: 'Do not memorize pointer movement. Watch which wall limits the water.',
      frames: [
        {
          title: 'Wide but shallow',
          short: 'Left wall is tiny, so water spills at height 1.',
          left: 0,
          right: 8,
          width: 8,
          waterLevel: 1,
          area: 8,
          best: 8,
          bestPair: [0, 8],
          movePointer: 'left',
          reason: 'The left wall is the spill point. Keeping it would keep the water shallow, even if the right wall changes.',
          state: { label: 'spill at left wall', values: ['width 8', 'water level 1', 'area 8'], helper: 'Wide is not enough if one wall is tiny.' },
          description: 'A very wide container still holds little water when one wall is too short.'
        },
        {
          title: 'Wide and deep',
          short: 'Move to height 8 on the left. This creates the best container.',
          left: 1,
          right: 8,
          width: 7,
          waterLevel: 7,
          area: 49,
          best: 49,
          bestPair: [1, 8],
          movePointer: 'right',
          reason: 'Now the right wall is the shorter wall, but this pair is already strong because it is still wide and deep.',
          state: { label: 'best container', values: ['width 7', 'water level 7', 'area 49'], helper: 'This is the winning picture.' },
          description: 'The water rises to height 7 across width 7, so the container holds 49 units.'
        },
        {
          title: 'Short right wall',
          short: 'Right wall becomes the spill point.',
          left: 1,
          right: 7,
          width: 6,
          waterLevel: 3,
          area: 18,
          best: 49,
          bestPair: [1, 8],
          movePointer: 'right',
          reason: 'The left wall is tall enough. The right wall is now too short, so the right pointer must move.',
          state: { label: 'spill at right wall', values: ['width 6', 'water level 3', 'area 18'], helper: 'The shorter wall decides the next move.' },
          description: 'The container becomes worse because the water can only rise to height 3.'
        },
        {
          title: 'Tall but narrower',
          short: 'Both walls are tall, but width has dropped.',
          left: 1,
          right: 6,
          width: 5,
          waterLevel: 8,
          area: 40,
          best: 49,
          bestPair: [1, 8],
          movePointer: 'right',
          reason: 'The height improved, but the container is now narrower. Deep water with too little width still loses to 49.',
          state: { label: 'not enough width', values: ['width 5', 'water level 8', 'area 40'], helper: 'Height alone is not the answer.' },
          description: 'This pair is deep, but not wide enough to beat the best container.'
        },
        {
          title: 'Best picture remains',
          short: 'The search continues, but the winning container stays remembered.',
          left: 1,
          right: 5,
          width: 4,
          waterLevel: 4,
          area: 16,
          best: 49,
          bestPair: [1, 8],
          movePointer: 'right',
          reason: 'This right wall is shorter, so it controls the water level. Move it and keep the best picture saved.',
          state: { label: 'best still 49', values: ['width 4', 'water level 4', 'area 16'], helper: 'Weak containers do not replace the best.' },
          description: 'The current container cannot beat 49, so the best answer stays unchanged.'
        },
        {
          title: 'Final answer',
          short: 'The best container is between index 1 and index 8.',
          left: 1,
          right: 2,
          width: 1,
          waterLevel: 6,
          area: 6,
          best: 49,
          bestPair: [1, 8],
          movePointer: 'right',
          reason: 'The remaining width is too small. The best visual container already found is the answer.',
          state: { label: 'return 49', values: ['best left 1', 'best right 8', 'best area 49'], helper: 'Return the strongest container seen.' },
          description: 'The maximum water is held between the wall at index 1 and the wall at index 8.',
          finalResult: { title: 'Final answer', body: 'Return 49.' }
        }
      ]
    }
  },
  body: [
    { type: 'callout', tone: 'info', title: 'Mental model', content: 'A container is controlled by its spill point. The spill point is always the shorter wall.' },
    { type: 'checklist', title: 'Reasoning checkpoints', items: ['Area = width × min(left height, right height).', 'Width gets smaller after every move.', 'The shorter wall is the only wall that can improve the water level.'] }
  ],
  relatedConcepts: ['two pointers', 'greedy elimination', 'bottleneck reasoning'],
  metadata: { reviewStatus: 'approved', visibility: ['dev', 'prod'] }
});

export default problem;
