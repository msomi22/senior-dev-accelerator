import { siteConfig } from '../config/siteConfig.js';

const defaults = {
  theme: 'light',
  completed: {},
  randomCount: 0,
  selectedTopics: {},
  selectedAnswers: {}
};

export const storageService = {
  read() {
    try { return { ...defaults, ...JSON.parse(localStorage.getItem(siteConfig.storageKey) || '{}') }; }
    catch { return defaults; }
  },
  write(next) { localStorage.setItem(siteConfig.storageKey, JSON.stringify({ ...this.read(), ...next })); },
  toggleComplete(id) {
    const state = this.read();
    const completed = { ...state.completed, [id]: !state.completed[id] };
    this.write({ completed });
    return completed;
  },
  markComplete(id) {
    const state = this.read();
    if (state.completed[id]) return state.completed;

    const completed = { ...state.completed, [id]: true };
    this.write({ completed });
    return completed;
  },
  setSelectedAnswer(questionId, answerIndex) {
    const state = this.read();
    const selectedAnswers = {
      ...state.selectedAnswers,
      [questionId]: answerIndex
    };

    this.write({ selectedAnswers });
    return selectedAnswers;
  },
  getSelectedAnswer(questionId) {
    const answer = this.read().selectedAnswers?.[questionId];
    return Number.isInteger(answer) ? answer : null;
  },
  setTheme(theme) { this.write({ theme }); },
  setSelectedTopic(category, topicId) {
    const state = this.read();
    this.write({ selectedTopics: { ...state.selectedTopics, [category]: topicId } });
  },
  getSelectedTopic(category) {
    return this.read().selectedTopics?.[category] || '';
  },
  incrementRandom() {
    const state = this.read();
    const randomCount = state.randomCount + 1;
    this.write({ randomCount });
    return randomCount;
  }
};
