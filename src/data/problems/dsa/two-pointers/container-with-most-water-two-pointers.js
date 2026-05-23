import { defineLearningProblem } from '../../../../problems/problemAuthoring.js';

const problem = defineLearningProblem({
  id: 'two-pointers-container-with-most-water-001',
  topicId: 'two-pointers',
  title: 'Container With Most Water — two pointers',
  difficulty: 'Medium',
  estimatedTime: '13 min',
  language: 'java',
  tags: ['arrays', 'two-pointers', 'interview-pattern', 'mental-model', 'visual-walkthrough', 'coding'],
  scenario: 'You are given vertical walls. Pick two walls that can hold the largest amount of water between them.',
  question: 'Given height = [1, 8, 6, 2, 5, 4, 8, 3, 7], return 49.',
  examples: ['Input: height = [1,8,6,2,5,4,8,3,7] -> Output: 49'],
  constraints: [
    'The water container is formed by two selected walls.',
    'The water height is limited by the shorter of the two walls.',
    'The width is the distance between the two selected indices.',
    'Return the maximum water area possible.'
  ],
  starterThought: 'Imagine two walls with water between them. The water can only rise as high as the shorter wall.',
  intuition: 'A container needs two things: width and height. Starting with the two farthest walls gives the maximum possible width. But the water level is controlled by the shorter wall. If one wall is short, keeping that short wall and moving the taller wall inward cannot help: the width gets smaller and the water level is still capped by the same short wall. So the only move that can possibly improve the answer is to move the shorter wall and hope to find a taller one.',
  mentalPicture: 'Picture holding a tray between two vertical boards. If the left board is tiny and the right board is tall, water spills over the tiny left board. Replacing the tall right board with another wall does not fix the spill. You must replace the tiny wall.',
  patternSignal: 'Use two pointers when the answer depends on two boundaries, and one boundary is clearly the bottleneck.',
  invariant: 'best always stores the largest container seen so far. When the shorter wall moves, every skipped container with that same shorter wall is safe to ignore because it would have less width and no better height limit.',
  bruteForceThought: 'The obvious solution tries every pair of walls. That works, but it spends time checking many containers that are clearly worse once we understand the bottleneck.',
  optimizationJourney: 'The breakthrough is realizing that area is not controlled by the taller wall. Area is width times the shorter wall. Width only gets smaller as pointers move inward, so to have any chance of improving the area, the limiting wall must improve.',
  stepByStepBreakdown: [
    'Place one pointer at the far left wall and one pointer at the far right wall.',
    'Compute the current water area: width times the shorter wall.',
    'Save it if it is the best area seen so far.',
    'Move the pointer standing on the shorter wall, because that wall is limiting the water level.',
    'Repeat until the two pointers meet.'
  ],
  finalPattern: 'Two-pointer bottleneck elimination.',
  commonMistake: 'Moving the taller wall feels natural, but it usually changes the wrong thing. The shorter wall is what limits the water level.',
  commonMistakes: [
    'Using the taller wall in the area formula.',
    'Moving the taller pointer instead of the shorter pointer.',
    'Forgetting that width shrinks every time a pointer moves.',
    'Updating the best area after moving instead of before moving.'
  ],
  edgeCases: ['Only two walls', 'Equal-height walls', 'Strictly increasing heights', 'Strictly decreasing heights', 'A very tall wall that is too close to another wall'],
  complexityAnalysis: 'Time is O(n) because each pointer moves inward at most once per position. Space is O(1) because we only store two pointers and the best area.',
  explanation: 'For height = [1,8,6,2,5,4,8,3,7], the best pair is index 1 with height 8 and index 8 with height 7. The width is 7, the water level is capped at 7, and the area is 7 * 7 = 49.',
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
  finalTakeaway: 'Do not move the wall that already has enough height. Move the wall that is making the water spill.',
  selfExplanationPrompt: 'Explain why keeping the shorter wall and moving the taller wall inward cannot create a better container.',
  visualExplanation: 'The walkthrough treats every pointer pair like a real water container: width is the floor distance, water level is the shorter wall, and area is the amount of water held.',
  visualWalkthrough: {
    title: 'See the container, water level, and bottleneck',
    summary: 'At each step, imagine water filling the space between the two selected walls. The shorter wall decides the water level; the distance decides the width.',
    diagram: {
      type: 'array',
      title: 'height = [1,8,6,2,5,4,8,3,7]',
      description: 'The selected pair forms a container. The water cannot rise above the shorter wall.',
      values: [1, 8, 6, 2, 5, 4, 8, 3, 7],
      stateTitle: 'Container state',
      stateDescription: 'Read each state as: selected walls, floor width, water level, and best water seen so far.',
      frames: [
        {
          title: 'First container: very wide, but very shallow',
          activeRange: [0, 8],
          items: [
            { index: 0, role: 'current', caption: 'left wall = 1' },
            { index: 8, role: 'current', caption: 'right wall = 7' }
          ],
          state: {
            label: 'area 8',
            values: ['walls 1 and 7', 'width 8', 'water level 1', 'area 8', 'best 8'],
            helper: 'The container is wide, but water spills over the tiny left wall.'
          },
          description: 'The floor is long, but the left wall is only height 1. So the water level is only 1. Moving the tall right wall would keep the same tiny spill point, so move the left wall.'
        },
        {
          title: 'Second container: strong walls and still wide',
          activeRange: [1, 8],
          items: [
            { index: 1, role: 'answer', caption: 'left wall = 8' },
            { index: 8, role: 'answer', caption: 'right wall = 7' }
          ],
          state: {
            label: 'area 49',
            values: ['walls 8 and 7', 'width 7', 'water level 7', 'area 49', 'best 49'],
            helper: 'This is a deep container and it is still wide.'
          },
          description: 'Now both walls are tall. The shorter wall is height 7 and the width is 7, so the container holds 49 units of water.'
        },
        {
          title: 'Why move the right wall now?',
          activeRange: [1, 7],
          items: [
            { index: 1, role: 'current', caption: 'left wall = 8' },
            { index: 7, role: 'remove', caption: 'right wall = 3' }
          ],
          state: {
            label: 'area 18',
            values: ['walls 8 and 3', 'width 6', 'water level 3', 'area 18', 'best 49'],
            helper: 'The right wall is now the spill point.'
          },
          description: 'The right wall is short, so the water level drops to 3. The left wall is already tall; moving it would not fix the short right wall. Move the right pointer.'
        },
        {
          title: 'The best container stays remembered',
          activeRange: [1, 6],
          items: [
            { index: 1, role: 'answer', caption: 'best left wall' },
            { index: 8, role: 'answer', caption: 'best right wall' },
            { index: 6, role: 'current', caption: 'current right wall = 8' }
          ],
          state: {
            label: 'best 49',
            values: ['best walls index 1 and 8', 'best width 7', 'best water level 7', 'best area 49'],
            helper: 'Later containers may be tall, but their width is smaller.'
          },
          description: 'Even when another tall wall appears, the width has already shrunk. The algorithm keeps checking, but the best known container remains 49.',
          finalResult: { title: 'Final answer', body: 'Return 49.' }
        }
      ]
    }
  },
  body: [
    {
      type: 'callout',
      tone: 'info',
      title: 'Simple mental model',
      content: 'A container is not controlled by the taller wall. It is controlled by the wall where water would spill first.'
    },
    {
      type: 'flow',
      title: 'Natural reasoning flow',
      steps: [
        'Start with the widest possible container.',
        'Measure how much water it can hold.',
        'Identify the shorter wall: that is where water spills.',
        'Move only that shorter wall and hope for a taller replacement.',
        'Keep the best container seen so far.'
      ]
    },
    {
      type: 'checklist',
      title: 'Explain it like a senior engineer',
      items: [
        'Area = width × shorter wall.',
        'Width shrinks as pointers move inward.',
        'The only way to compensate for shrinking width is to find a taller limiting wall.',
        'That is why we move the shorter wall.'
      ]
    }
  ],
  relatedConcepts: ['two pointers', 'greedy elimination', 'bottleneck reasoning'],
  metadata: { reviewStatus: 'approved', visibility: ['dev', 'prod'] }
});

export default problem;
