import topic from '../../../banks/system/scalability.js';

const problems = topic.questions.map((question) => ({ ...question, category: 'system' }));

export default problems;
