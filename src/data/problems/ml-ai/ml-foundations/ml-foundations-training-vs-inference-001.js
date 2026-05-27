import { defineLearningProblem } from '../../../../problems/problemAuthoring.js';

const problem = defineLearningProblem({
  id: 'ml-foundations-training-vs-inference-001',
  category: 'ml-ai',
  topicId: 'ml-foundations',
  title: 'Training vs inference in the ML lifecycle',
  difficulty: 'Easy',
  estimatedTimeSeconds: 180,
  tags: [
    'ml-ai',
    'machine-learning',
    'ml-foundations',
    'training',
    'inference',
    'model-lifecycle'
  ],
  prompt: 'Explain the difference between training and inference in a machine learning system, and why a model that looks strong while being built can still behave poorly after release.',
  question: 'What is the practical difference between training and inference in a machine learning system?',
  body: [
    'Training is the phase where the model learns from historical examples. It compares outputs with known answers and updates its internal parameters so future outputs become better.',
    'Inference is the phase where the trained model is used on new input. During inference, the model does not learn from the current request; it applies the parameters it already learned during training.',
    'A model can look strong while being built but behave poorly after release when evaluation is weak, the data changes, preprocessing differs between building and serving, or the model memorizes examples instead of learning a pattern that generalizes.'
  ],
  explanation: 'Training updates model parameters using historical examples and feedback from known answers. Inference applies those learned parameters to new data. Strong training results are not enough: production behavior depends on clean evaluation, matching preprocessing, stable data assumptions, and whether the model generalizes beyond the examples it saw while learning.',
  starterThought: 'Ask whether the model is still learning from labeled examples, or whether it is only applying what it already learned.',
  hints: [
    'Training changes the model. Inference uses the model.',
    'A production request normally should not update the model parameters immediately.',
    'High training accuracy can hide memorization or data mismatch.'
  ],
  relatedConcepts: [
    'model lifecycle',
    'training data',
    'model parameters',
    'inference',
    'generalization',
    'data drift'
  ],
  followUpQuestions: [
    'What checks would you add before trusting a trained model after release?',
    'How can preprocessing differences cause training-serving skew?'
  ],
  metadata: {
    reviewStatus: 'approved',
    visibility: ['dev', 'prod'],
    source: 'original',
    estimatedTimeSeconds: 180
  }
});

export default problem;
