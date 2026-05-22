import { defineMcqProblem } from '../../../../problems/problemAuthoring.js';

const problem = defineMcqProblem({
  id: 'java-core-equals-vs-double-equals-001',
  topicId: 'java-core',
  title: 'equals() vs ==',
  difficulty: 'Easy',
  prompt: 'Two different String objects both contain the text "Java". In Java, what is the best simple explanation of == versus equals() for objects?',
  options: [
    '== asks whether two variables point to the same object, while equals() can ask whether two objects mean the same value.',
    '== and equals() always do exactly the same thing for every object.',
    'equals() checks whether two variables point to the same object, while == checks whether their text is equal.',
    '== automatically converts objects into strings before comparing them.'
  ],
  correctAnswer: '== asks whether two variables point to the same object, while equals() can ask whether two objects mean the same value.',
  explanation: 'For objects, == is like asking, "Are these two names pointing to the very same box?" equals() is like asking, "Do the things inside the boxes represent the same value?" For String, equals() compares the characters, so two different String objects can still be logically equal.',
  tags: ['java', 'objects', 'equality'],
  rendering: {
    variant: 'deep-dive',
    density: 'comfortable',
    accent: 'blue'
  },
  body: [
    {
      type: 'section',
      title: 'Explain it like a very simple story',
      content: 'Imagine two lunch boxes. The == operator asks, "Is this the exact same lunch box?" The equals() method asks, "Do the lunch boxes have the same food inside?" In Java object comparison, those are different questions.'
    },
    {
      type: 'code',
      language: 'java',
      code: 'String a = new String("Java");\nString b = new String("Java");\n\nSystem.out.println(a == b);      // false\nSystem.out.println(a.equals(b)); // true'
    },
    {
      type: 'section',
      title: 'What each line means',
      content: 'a and b are two separate String objects. They both contain the same letters, but they are not the same object. That is why a == b is false. Their text is the same, and String implements equals() to compare text, so a.equals(b) is true.'
    },
    {
      type: 'table',
      columns: ['Comparison', 'Simple meaning', 'Example result'],
      rows: [
        ['a == b', 'Are a and b pointing to the exact same object?', 'false'],
        ['a.equals(b)', 'Do a and b have the same logical value?', 'true'],
        ['a == a', 'Is a the same reference as itself?', 'true']
      ]
    },
    {
      type: 'callout',
      tone: 'warning',
      title: 'Common beginner trap',
      content: 'Do not use == to compare String content. Use equals(), because you usually care whether the words match, not whether both variables point to the exact same String object.'
    },
    {
      type: 'checklist',
      title: 'Remember this',
      items: [
        'For primitives like int, == compares values.',
        'For objects, == compares references: same object or not.',
        'For objects, equals() can compare meaning, if the class implemented it properly.',
        'For String content, prefer equals().'
      ]
    }
  ],
  metadata: {
    reviewStatus: 'approved',
    visibility: ['dev', 'prod']
  }
});

export default problem;
