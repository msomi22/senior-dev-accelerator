export const ALL_FILTER = 'all';

export function questionMatchesDifficulty(question, difficulty = ALL_FILTER) {
  if (difficulty === ALL_FILTER) return true;
  return question.difficulty === difficulty;
}

export function getQuestionSetProgress(questions = [], completed = {}) {
  const total = questions.length;
  const done = questions.filter((question) => completed[question.id]).length;

  return {
    done,
    total,
    percent: total ? Math.round((done / total) * 100) : 0
  };
}

export function getFilteredTopicQuestions(
  topic,
  completed = {},
  difficulty = ALL_FILTER,
  completionFilter = ALL_FILTER
) {
  const questions = topic.questions || [];
  const difficultyScopedQuestions = questions.filter((question) =>
    questionMatchesDifficulty(question, difficulty)
  );

  if (completionFilter === 'completed') {
    const completedQuestions = difficultyScopedQuestions.filter(
      (question) => completed[question.id]
    );

    return completedQuestions.length === difficultyScopedQuestions.length
      ? completedQuestions
      : [];
  }

  if (completionFilter === 'incomplete') {
    return difficultyScopedQuestions.filter((question) => !completed[question.id]);
  }

  return difficultyScopedQuestions;
}
