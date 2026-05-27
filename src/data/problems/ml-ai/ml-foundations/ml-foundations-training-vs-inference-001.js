import { defineLearningProblem } from '../../../../problems/problemAuthoring.js';

const prompt = 'A team says, “Our model performed well during training, so production predictions should automatically be reliable.” What important difference between training and inference are they overlooking?';

const problem = defineLearningProblem({
  id: 'ml-foundations-training-vs-inference-learning-001',
  category: 'ml-ai',
  topicId: 'ml-foundations',
  title: 'Training vs Inference',
  difficulty: 'Easy',
  estimatedTimeSeconds: 180,
  tags: [
    'ml-foundations',
    'training',
    'inference',
    'model-lifecycle',
    'production-ml',
    'model-evaluation'
  ],
  prompt,
  question: prompt,
  body: [
    'Training is the learning phase. The model sees historical examples, compares its output with known answers, and updates its internal parameters so it can make better future outputs.',
    'Inference is the usage phase. The trained model receives new input and applies what it already learned. A normal production prediction should not automatically update the model just because one request arrived.',
    'Good training performance is not a guarantee of reliable production behavior. The model may have memorized training examples, evaluation data may not represent real traffic, input data may change, or production preprocessing may differ from the training pipeline.'
  ],
  explanation: 'The team is mixing up training with inference. Training is where the model learns and changes. Inference is where the model uses learned parameters on new data. Production reliability still requires evaluation on data that resembles real usage, checks for data drift, and consistency between training-time and serving-time preprocessing.',
  starterThought: 'Ask whether the model is still learning from labeled examples or only applying what it already learned.',
  hints: [
    'Training changes the model; inference uses the model.',
    'High training performance can hide memorization or weak evaluation.',
    'Production inputs may not behave like the training dataset.'
  ],
  relatedConcepts: [
    'training',
    'inference',
    'generalization',
    'overfitting',
    'training-serving skew',
    'data drift',
    'production ML'
  ],
  followUpQuestions: [
    'What validation data would make this team more confident before release?',
    'What monitoring would you add after the model starts serving production traffic?'
  ],
  metadata: {
    reviewStatus: 'approved',
    visibility: ['dev', 'prod'],
    source: 'original',
    estimatedTimeSeconds: 180
  }
});

export default problem;
