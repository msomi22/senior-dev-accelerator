import topic from '../../../banks/system/databases.js';

const problems = topic.questions.map((question) => ({ ...question, category: 'system' }));

export default problems;
