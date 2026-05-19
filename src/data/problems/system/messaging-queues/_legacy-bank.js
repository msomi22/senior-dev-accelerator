import topic from '../../../banks/system/messaging-queues.js';

const problems = topic.questions.map((question) => ({ ...question, category: 'system' }));

export default problems;
