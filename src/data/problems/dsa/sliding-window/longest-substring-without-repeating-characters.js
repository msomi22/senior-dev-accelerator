import { defineLearningProblem } from '../../../../problems/problemAuthoring.js';

const problem = defineLearningProblem({
  id: 'sliding-window-longest-substring-unique-001',
  topicId: 'sliding-window',
  title: 'Longest Substring Without Repeating Characters — variable sliding window',
  difficulty: 'Medium',
  estimatedTime: '15 min',
  language: 'java',
  tags: ['strings', 'sliding-window', 'hash-set', 'interview-pattern', 'mental-model', 'visual-walkthrough', 'coding'],
  scenario: 'Find the length of the longest contiguous substring that contains no repeated characters.',
  question: 'Given s = "abcabcbb", return 3 because "abc" is the longest substring without repeated characters.',
  examples: ['Input: s = "abcabcbb" -> Output: 3'],
  constraints: [
    'The answer must be a contiguous substring length.',
    'Characters can repeat outside the active substring.',
    'The active substring is clean only when it has no repeated characters.',
    'Use O(n) time.'
  ],
  starterThought: 'Keep one clean substring alive. Grow it when possible, and trim it only when a duplicate enters.',
  intuition: 'Read the string from left to right. Keep a current substring that is allowed to contain each character only once. The right pointer is the reader: it brings in the next character. If the character is new, the substring stays clean and may become the best answer. If the character is already inside, the substring becomes dirty. Move the left pointer forward until the older copy is removed. Then the substring is clean again.',
  mentalPicture: 'Picture a tray holding letters. You slide new letters into the tray from the right. The tray is only allowed to hold one copy of each letter. When a second copy enters, you throw letters out from the left until the old duplicate is gone. The biggest clean tray you ever see is the answer.',
  patternSignal: 'Use sliding window when you are looking for the best contiguous group and a bad group can be fixed by removing items from the left.',
  invariant: 'After every repair, the active substring has no repeated characters.',
  bruteForceThought: 'Brute force keeps restarting from different positions and checks many of the same characters again.',
  optimizationJourney: 'The window avoids restarting. Each character enters once from the right and leaves at most once from the left, so the whole string is scanned in one pass.',
  stepByStepBreakdown: [
    'Start with an empty clean substring.',
    'Move right to bring in the next character.',
    'If that character is not already inside, update best.',
    'If that character is already inside, move left until the older copy is removed.',
    'Once the substring is clean again, update best.'
  ],
  finalPattern: 'Variable sliding window with a clean-substring rule.',
  commonMistake: 'Counting the substring while it still contains a duplicate.',
  commonMistakes: [
    'Updating best before removing the old duplicate.',
    'Moving left only once when the duplicate may require several removals.',
    'Confusing substring with subsequence.',
    'Forgetting to update character counts when letters leave from the left.'
  ],
  edgeCases: ['Empty string', 'All unique characters', 'All same characters', 'Duplicates far apart'],
  complexityAnalysis: 'Time is O(n) because each character enters and leaves the active substring at most once. Space is O(k), where k is the number of possible distinct characters.',
  explanation: 'For abcabcbb, the active substring grows to abc. The next a creates abca, which is not clean because the new a at index 3 matches the old a at index 0. Remove letters from the left until the old a is gone, leaving bca. The scan continues to the end of the string, but no later clean substring becomes longer than 3.',
  solutionCode: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> count = new HashMap<>();
        int left = 0;
        int best = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            count.put(c, count.getOrDefault(c, 0) + 1);

            while (count.get(c) > 1) {
                char remove = s.charAt(left);
                count.put(remove, count.get(remove) - 1);
                left++;
            }

            best = Math.max(best, right - left + 1);
        }

        return best;
    }
}`,
  finalTakeaway: 'right brings letters in. left throws old letters out. best remembers the largest clean substring.',
  visualExplanation: 'The highlighted letters show the substring currently being tested. When the same letter appears twice inside it, the duplicate cells turn red. Then left moves forward until the older copy leaves.',
  visualWalkthrough: {
    title: 'Grow the clean substring, then repair it',
    summary: 'Follow the highlighted substring as new letters enter from the right. When a duplicate appears, the repeated letters are marked red, then left moves forward to remove the older copy.',
    diagram: {
      type: 'array',
      title: 's = abcabcbb',
      values: ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'],
      stateTitle: 'What to watch',
      stateDescription: 'The highlighted letters are the substring we are testing right now. left shows where it starts. right shows the newest letter that joined. best remembers the longest clean substring seen so far.',
      frames: [
        {
          title: 'Start with a',
          activeRange: [0, 0],
          items: [{ index: 0, role: 'current', caption: 'left + right' }],
          state: { label: 'clean', role: 'success', values: ['left 0', 'right 0', 'tray a', 'best 1'], helper: 'The tray has one letter, so nothing repeats.' },
          description: 'The first clean substring is just "a".'
        },
        {
          title: 'Add b',
          activeRange: [0, 1],
          items: [{ index: 0, role: 'window', caption: 'left' }, { index: 1, role: 'current', caption: 'right adds b' }],
          state: { label: 'clean', role: 'success', values: ['left 0', 'right 1', 'tray ab', 'best 2'], helper: 'a and b are different, so the tray is still clean.' },
          description: 'Add "b" to the right side. The clean substring becomes "ab".'
        },
        {
          title: 'Add c',
          activeRange: [0, 2],
          items: [{ index: 0, role: 'window', caption: 'left' }, { index: 2, role: 'current', caption: 'right adds c' }],
          state: { label: 'clean', role: 'success', values: ['left 0', 'right 2', 'tray abc', 'best 3'], helper: 'abc is clean and becomes the best length so far.' },
          description: 'Add "c". Now the clean substring is "abc", length 3.'
        },
        {
          title: 'The new a repeats the old a',
          activeRange: [0, 3],
          items: [{ index: 0, role: 'warning', caption: 'old a' }, { index: 3, role: 'warning', caption: 'new a' }],
          state: { label: 'duplicate found', role: 'warning', values: ['left 0', 'right 3', 'tray abca', 'best 3'], helper: 'The a at index 3 matches the a at index 0. The current substring is not clean yet.' },
          description: 'The new "a" enters at index 3, but there is already an "a" at index 0. Those two red cells show the exact duplicate pair.'
        },
        {
          title: 'Throw out the old a',
          activeRange: [1, 3],
          items: [{ index: 0, role: 'remove', caption: 'removed' }, { index: 1, role: 'window', caption: 'left' }, { index: 3, role: 'current', caption: 'right' }],
          state: { label: 'clean again', role: 'success', values: ['left 1', 'right 3', 'tray bca', 'best 3'], helper: 'After the old a leaves, every letter is unique again.' },
          description: 'Move left forward and remove the old "a". The clean substring is now "bca".'
        },
        {
          title: 'The new b repeats the old b',
          activeRange: [1, 4],
          items: [{ index: 1, role: 'warning', caption: 'old b' }, { index: 4, role: 'warning', caption: 'new b' }],
          state: { label: 'duplicate found', role: 'warning', values: ['left 1', 'right 4', 'tray bcab', 'best 3'], helper: 'The b at index 4 matches the b at index 1. The current substring must be repaired.' },
          description: 'The new "b" enters at index 4, but the old "b" at index 1 is still inside the substring. The red cells show the repeated pair.'
        },
        {
          title: 'Throw out the old b',
          activeRange: [2, 4],
          items: [{ index: 1, role: 'remove', caption: 'removed' }, { index: 2, role: 'window', caption: 'left' }, { index: 4, role: 'current', caption: 'right' }],
          state: { label: 'clean again', role: 'success', values: ['left 2', 'right 4', 'tray cab', 'best 3'], helper: 'cab is clean, but it only ties the best length.' },
          description: 'Move left past the old "b". The clean substring becomes "cab".'
        },
        {
          title: 'The new c repeats the old c',
          activeRange: [2, 5],
          items: [{ index: 2, role: 'warning', caption: 'old c' }, { index: 5, role: 'warning', caption: 'new c' }],
          state: { label: 'duplicate found', role: 'warning', values: ['left 2', 'right 5', 'tray cabc', 'best 3'], helper: 'The c at index 5 matches the c at index 2. Repair before counting this window.' },
          description: 'right continues to index 5. The new "c" repeats the old "c" still inside the substring.'
        },
        {
          title: 'Throw out the old c',
          activeRange: [3, 5],
          items: [{ index: 2, role: 'remove', caption: 'removed' }, { index: 3, role: 'window', caption: 'left' }, { index: 4, role: 'window', caption: 'kept b' }, { index: 5, role: 'current', caption: 'right' }],
          state: { label: 'clean again', role: 'success', values: ['left 3', 'right 5', 'tray abc', 'best 3'], helper: 'The clean tray is indexes 3 to 5: a, b, c. Notice b at index 4 is still inside.' },
          description: 'Move left past the old "c". The clean substring becomes "abc" again, using indexes 3, 4, and 5.'
        },
        {
          title: 'Right adds b, but index 4 already has b',
          activeRange: [3, 6],
          items: [{ index: 3, role: 'window', caption: 'inside tray' }, { index: 4, role: 'warning', caption: 'old b' }, { index: 5, role: 'window', caption: 'inside tray' }, { index: 6, role: 'warning', caption: 'right adds b' }],
          state: { label: 'duplicate found', role: 'warning', values: ['left 3', 'right 6', 'tray abcb', 'best 3'], helper: 'Before this step, the tray was indexes 3..5: a, b, c. Now right adds b at index 6, which matches the b already inside at index 4.' },
          description: 'The pointer did not jump to index 4. Index 4 was already inside the active substring. When right adds the new "b" at index 6, the duplicate pair becomes index 4 and index 6.'
        },
        {
          title: 'Repair until the old b is gone',
          activeRange: [5, 6],
          items: [{ index: 3, role: 'remove', caption: 'removed a' }, { index: 4, role: 'remove', caption: 'removed old b' }, { index: 5, role: 'window', caption: 'left' }, { index: 6, role: 'current', caption: 'right' }],
          state: { label: 'clean again', role: 'success', values: ['left 5', 'right 6', 'tray cb', 'best 3'], helper: 'left moved past a and then past the old b at index 4. Now only the new b remains.' },
          description: 'The repair removes more than one letter: first "a" at index 3, then the old "b" at index 4. Now the clean substring is "cb".'
        },
        {
          title: 'The final b repeats the previous b',
          activeRange: [5, 7],
          items: [{ index: 6, role: 'warning', caption: 'old b' }, { index: 7, role: 'warning', caption: 'new b' }],
          state: { label: 'duplicate found', role: 'warning', values: ['left 5', 'right 7', 'tray cbb', 'best 3'], helper: 'The b at index 7 matches the b at index 6, so the last window must also be repaired.' },
          description: 'right reaches the final character. The new "b" repeats the "b" at index 6.'
        },
        {
          title: 'End of string: best is still 3',
          activeRange: [7, 7],
          items: [{ index: 5, role: 'remove', caption: 'removed' }, { index: 6, role: 'remove', caption: 'removed' }, { index: 7, role: 'current', caption: 'left + right' }],
          state: { label: 'answer', role: 'success', values: ['left 7', 'right 7', 'tray b', 'best 3'], helper: 'The scan reached the end. No clean substring beat length 3.' },
          description: 'After the final repair, only the last "b" remains in the clean substring. The full scan is complete, and the best length is 3.',
          finalResult: { title: 'Final answer', body: 'Return 3.' }
        }
      ]
    }
  },
  body: [
    { type: 'callout', tone: 'info', title: 'Mental model', content: 'Keep a clean tray of letters. Add from the right. When a duplicate enters, remove from the left until the tray is clean again.' },
    { type: 'callout', tone: 'info', title: 'Pattern signal', content: 'Use a sliding window when the answer is a contiguous group and a bad group can be repaired by trimming from the left.' }
  ],
  relatedConcepts: ['two pointers', 'hash map', 'window invariant'],
  metadata: { reviewStatus: 'approved', visibility: ['dev', 'prod'] }
});

export default problem;
