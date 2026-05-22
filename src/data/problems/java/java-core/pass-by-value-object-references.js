import { defineMcqProblem } from '../../../../problems/problemAuthoring.js';

const problem = defineMcqProblem({
  id: 'java-core-pass-by-value-object-references-001',
  topicId: 'java-core',
  title: 'Java Pass-by-Value and Object References',
  difficulty: 'Medium',
  prompt: 'Look at the code example. The changeName method receives a Dog parameter and assigns that parameter to a new Dog. What happens to the caller\'s original dog variable after the method returns?',
  options: [
    'The caller\'s dog variable is reassigned to the new Dog("Max").',
    'The caller\'s dog variable still points to the original Dog("Buddy").',
    'Java passes objects by reference, so dog and pet must always point to the same variable slot.',
    'The code will not compile because Java objects cannot be passed to methods.'
  ],
  correctAnswer: 'The caller\'s dog variable still points to the original Dog("Buddy").',
  explanation: 'Java is pass-by-value. For objects, the value being copied is the reference value. The method parameter gets its own copy of the reference. Reassigning the parameter makes only the parameter point somewhere else; it does not change the caller\'s variable. But if the method uses the copied reference to mutate the same object, the caller can observe that mutation.',
  tags: ['java', 'references', 'oop'],
  rendering: {
    variant: 'deep-dive',
    density: 'detailed',
    accent: 'blue'
  },
  body: [
    {
      type: 'section',
      title: 'The code in question',
      content: 'This example separates two ideas that people often mix up: reassigning a parameter versus mutating the object that the parameter points to.'
    },
    {
      type: 'code',
      language: 'java',
      code: 'class Dog {\n    String name;\n\n    Dog(String name) {\n        this.name = name;\n    }\n}\n\npublic class Demo {\n    static void changeName(Dog pet) {\n        pet = new Dog("Max");\n    }\n\n    public static void main(String[] args) {\n        Dog dog = new Dog("Buddy");\n\n        changeName(dog);\n\n        System.out.println(dog.name); // Buddy\n    }\n}'
    },
    {
      type: 'section',
      title: 'Teacher explanation',
      content: 'Think of dog as a remote control pointing to a Dog object. When changeName(dog) is called, Java copies the remote control and gives the copy to the method. Inside the method, pet is the copied remote. When pet = new Dog("Max") runs, only the copied remote points to a new dog. The original dog remote in main still points to Buddy.'
    },
    {
      type: 'comparison',
      items: [
        {
          title: 'Parameter reassignment',
          content: 'pet = new Dog("Max") changes only the local parameter variable. The caller\'s dog variable is unchanged.'
        },
        {
          title: 'Object mutation',
          content: 'pet.name = "Max" would change the object that both dog and pet currently point to, so the caller would see the new name.'
        }
      ]
    },
    {
      type: 'code',
      language: 'java',
      code: 'static void mutateName(Dog pet) {\n    pet.name = "Max";\n}\n\nDog dog = new Dog("Buddy");\nmutateName(dog);\nSystem.out.println(dog.name); // Max'
    },
    {
      type: 'callout',
      tone: 'success',
      title: 'Memory sentence',
      content: 'Java passes everything by value. With objects, the copied value is a reference to an object, not the object variable itself.'
    }
  ],
  metadata: {
    reviewStatus: 'approved',
    visibility: ['dev', 'prod']
  }
});

export default problem;
