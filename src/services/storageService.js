import { siteConfig } from '../config/siteConfig.js';

const defaults = { theme: 'light', completed: {}, randomCount: 0, selectedTopics: {} };

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
