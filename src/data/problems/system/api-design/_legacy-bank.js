import topic from '../../../banks/system/api-design.js';

const problems = topic.questions.map((question) => ({ ...question, category: 'system' }));

export default problems;
