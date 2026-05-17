import { categoryManifest, topicManifest, getTopicsByCategory } from '../data/topicManifest.js';
import { applyQuestionOverrides } from '../data/banks/question-overrides.js';
import {
  filterQuestionsForActiveProfile,
  filterTopicsForActiveProfile
} from '../config/contentProfile.js';

const bankModules = import.meta.glob('../data/banks/**/*.js');
const SIMPLE_SYSTEM_DESIGN_TYPES = new Set(['system-design', 'production-scenario']);

function getBankPath(topicId) {
  const topic = topicManifest.find((item) => item.id === topicId);
  if (!topic) throw new Error(`Unknown topic bank: ${topicId}`);

  const path = `../data/banks/${topic.category}/${topic.id}.js`;
  if (!bankModules[path]) {
    throw new Error(`Missing quiz bank file for ${topicId}. Expected: src/data/banks/${topic.category}/${topic.id}.js`);
  }

  return path;
}

function normalizeSimpleSystemDesignTags(tags = []) {
  const normalizedTags = tags.map((tag) => (
    SIMPLE_SYSTEM_DESIGN_TYPES.has(tag) ? 'simple-system-design' : tag
  ));

  return [...new Set(normalizedTags)];
}

function normalizeQuestionTypes(bank) {
  if (bank.category !== 'system') return bank;

  return {
    ...bank,
    questions: (bank.questions || []).map((question) => {
      if (!SIMPLE_SYSTEM_DESIGN_TYPES.has(question.type)) return question;

      return {
        ...question,
        type: 'simple-system-design',
        tags: normalizeSimpleSystemDesignTags(question.tags)
      };
    })
  };
}

function applyContentProfileToBank(bank) {
  return {
    ...bank,
    questions: filterQuestionsForActiveProfile(bank.questions || [])
  };
}

const bankCache = new Map();
const countCache = new Map();

export const categories = categoryManifest;
export const allTopics = filterTopicsForActiveProfile(topicManifest);
export const dsaTopics = filterTopicsForActiveProfile(getTopicsByCategory('dsa'));
export const systemDesignTopics = filterTopicsForActiveProfile(getTopicsByCategory('system'));

export function getCategory(categoryId) {
  return categories.find((category) => category.id === categoryId);
}

export function getTopicsForCategory(categoryId) {
  return filterTopicsForActiveProfile(getTopicsByCategory(categoryId));
}

export async function loadTopicBank(topicId) {
  if (!bankCache.has(topicId)) {
    const path = getBankPath(topicId);

    bankCache.set(
      topicId,
      bankModules[path]().then((module) => {
        const overridden = applyQuestionOverrides(module.default);
        const normalized = normalizeQuestionTypes(overridden);
        return applyContentProfileToBank(normalized);
      })
    );
  }

  return bankCache.get(topicId);
}

export async function getTopicCount(topicId) {
  if (!countCache.has(topicId)) {
    countCache.set(topicId, loadTopicBank(topicId).then((bank) => bank.questions.length));
  }
  return countCache.get(topicId);
}

export async function getTopicWithCount(topic) {
  const count = await getTopicCount(topic.id);
  return { ...topic, count };
}

export async function getTopicsWithCounts(categoryId) {
  const topics = getTopicsForCategory(categoryId);
  return Promise.all(topics.map(getTopicWithCount));
}

export async function getAllTopicsWithCounts() {
  return Promise.all(allTopics.map(getTopicWithCount));
}

export function getCategorySummaries() {
  return categories.map((category) => {
    const topics = getTopicsForCategory(category.id);
    return {
      ...category,
      topicCount: topics.length
    };
  });
}

export async function getCategoryWithCounts(categoryId, completed = {}) {
  const category = getCategory(categoryId);
  if (!category) return null;

  const topics = await getTopicsWithCounts(categoryId);
  const quizCount = topics.reduce((sum, topic) => sum + topic.count, 0);
  const done = topics.reduce((sum, topic) => sum + topicProgress(topic, completed).done, 0);

  return {
    ...category,
    topicCount: topics.length,
    quizCount,
    done,
    progressPercent: quizCount ? Math.round((done / quizCount) * 100) : 0
  };
}

export async function getCategoriesWithCounts(completed = {}) {
  const summaries = getCategorySummaries();
  const enriched = await Promise.all(summaries.map((category) => getCategoryWithCounts(category.id, completed)));
  return enriched.filter(Boolean);
}

export async function loadTopicBanks(topicIds) {
  return Promise.all(topicIds.map(loadTopicBank));
}

export async function getRandomQuestion(filters = {}) {
  const candidates = allTopics.filter((topic) => {
    if (filters.category && topic.category !== filters.category) return false;
    if (filters.topicId && topic.id !== filters.topicId) return false;
    return true;
  });

  const pickedTopic = candidates[Math.floor(Math.random() * candidates.length)] || allTopics[0];
  const bank = await loadTopicBank(pickedTopic.id);
  const question = bank.questions[Math.floor(Math.random() * bank.questions.length)];

  return { ...question, parentTopic: bank.name, category: bank.category };
}

export async function findQuestionById(questionId) {
  for (const topic of allTopics) {
    const bank = await loadTopicBank(topic.id);
    const question = bank.questions.find((item) => item.id === questionId);

    if (question) {
      const category = getCategory(topic.category);
      return {
        question,
        topic: { ...topic, count: bank.questions.length },
        bank,
        category,
        categoryName: category?.name || topic.category
      };
    }
  }

  return null;
}

export async function progressSummary(completed = {}) {
  const topicsWithCounts = await getAllTopicsWithCounts();
  const total = topicsWithCounts.reduce((sum, topic) => sum + topic.count, 0);
  const done = Object.keys(completed).filter((id) => completed[id]).length;

  return { total, done, percent: total ? Math.round((done / total) * 100) : 0 };
}

export function topicProgress(topic, completed = {}) {
  const total = Number(topic.count ?? 0);
  const prefix = `${topic.id}-`;
  const done = Object.keys(completed).filter((id) => completed[id] && id.startsWith(prefix)).length;

  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
}
