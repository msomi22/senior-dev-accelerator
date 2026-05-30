import { categoryManifest, topicManifest, getTopicsByCategory } from '../data/topicManifest.js';
import { applyQuestionOverrides } from '../data/banks/question-overrides.js';
import {
  filterCategoriesForActiveProfile,
  filterQuestionsForActiveProfile,
  filterTopicsForActiveProfile
} from '../config/contentProfile.js';
import {
  discoverProblems,
  getDiscoveredQuestionsForTopic,
  getProblemValidationResult
} from '../problems/problemDiscovery.js';
import { normalizeProblem } from '../problems/normalizeProblem.js';

const bankModules = import.meta.env
  ? import.meta.glob('../data/banks/**/*.js')
  : {};

function getTopic(topicId, topics = topicManifest) {
  const topic = topics.find((item) => item.id === topicId);
  if (!topic) throw new Error(`Unknown topic bank: ${topicId}`);
  return topic;
}

function getTopicsByCategoryFrom(categoryId, topics = topicManifest) {
  return topics.filter((topic) => topic.category === categoryId);
}

function hasExplicitQuestionsOption(options = {}) {
  return Object.prototype.hasOwnProperty.call(options, 'questions');
}

function hasCustomBankSourceOptions(options = {}) {
  return Boolean(
    options.modules
    || options.topics
    || options.profile
    || options.getDiscoveredQuestions
    || options.getAllDiscoveredQuestions
    || hasExplicitQuestionsOption(options)
  );
}

function resolveCategory(categoryOrId, options = {}) {
  if (categoryOrId && typeof categoryOrId === 'object') return categoryOrId;

  return getCategory(categoryOrId)
    || (options.categories || []).find((category) => category.id === categoryOrId)
    || null;
}

export function getOptionalBankPath(topic, modules = bankModules) {
  if (!topic?.category || !topic?.id) return null;

  const path = `../data/banks/${topic.category}/${topic.id}.js`;
  return modules[path] ? path : null;
}

export function createVirtualBank(topic, questions = []) {
  return {
    id: topic.id,
    name: topic.name,
    category: topic.category,
    description: topic.description,
    questions
  };
}

export function canUseVirtualBank(topic, discoveredQuestions = []) {
  return discoveredQuestions.length > 0
    || topic?.allowVirtualBank === true
    || topic?.questionBank?.allowVirtual === true
    || topic?.questionBank?.mode === 'discovered'
    || topic?.questionBank?.mode === 'empty';
}

export function assertCanUseVirtualBank(topic, discoveredQuestions = []) {
  if (canUseVirtualBank(topic, discoveredQuestions)) return;

  throw new Error(`Topic ${topic?.id || 'unknown'} has no question bank and is not configured for discovered problems.`);
}

function mergeLegacyQuestion(question, merge) {
  const mergedId = question.id?.startsWith(merge.idPrefixFrom)
    ? question.id.replace(merge.idPrefixFrom, merge.idPrefixTo)
    : `${merge.idPrefixTo}${question.id}`;

  return normalizeProblem({
    ...question,
    id: mergedId,
    topicId: merge.topicId,
    category: merge.category || getTopic(merge.topicId).category,
    finalPattern: merge.finalPattern || question.finalPattern,
    tags: Array.from(new Set([...(question.tags || []), ...(merge.tags || [])]))
  });
}

async function loadLegacyMergeQuestions(topic, modules = bankModules) {
  const merges = topic?.questionBank?.legacyMerges || [];
  const loaded = await Promise.all(
    merges.map(async (merge) => {
      const loader = modules[merge.path];
      if (!loader) return [];
      const module = await loader();
      const exported = module?.default || module?.questions || module?.bank?.questions || [];
      return exported.map((question) => mergeLegacyQuestion(question, merge));
    })
  );

  return loaded.flat();
}

async function getDiscoveredQuestions(topicId, options = {}) {
  if (options.getDiscoveredQuestions) return options.getDiscoveredQuestions(topicId, options);
  return getDiscoveredQuestionsForTopic(topicId, options);
}

async function getAllDiscoveredQuestions(options = {}) {
  if (options.getAllDiscoveredQuestions) return options.getAllDiscoveredQuestions(options);
  return discoverProblems(options);
}

async function getQuestionsForProfileOptions(options = {}) {
  if (hasExplicitQuestionsOption(options)) return options.questions || [];
  return getAllDiscoveredQuestions(options);
}

export async function getQuestionsForTopic(topicId, options = {}) {
  const topic = getTopic(topicId, options.topics || topicManifest);
  const discoveredQuestions = await getDiscoveredQuestions(topicId, options);
  const legacyMergeQuestions = await loadLegacyMergeQuestions(topic, options.modules || bankModules);
  const questions = [...legacyMergeQuestions, ...discoveredQuestions];

  if (!questions.length) assertCanUseVirtualBank(topic, discoveredQuestions);

  return filterQuestionsForActiveProfile(applyQuestionOverrides(questions), options);
}

export async function getQuestionBank(topicId, options = {}) {
  const topic = getTopic(topicId, options.topics || topicManifest);
  const questions = await getQuestionsForTopic(topicId, options);
  return createVirtualBank(topic, questions);
}

export async function getQuestionsForCategory(categoryId, options = {}) {
  const topics = getTopicsByCategoryFrom(categoryId, options.topics || topicManifest);
  const groups = await Promise.all(topics.map((topic) => getQuestionsForTopic(topic.id, options)));
  return groups.flat();
}

export async function getQuestionBanksForCategory(categoryId, options = {}) {
  const topics = filterTopicsForActiveProfile(
    getTopicsByCategoryFrom(categoryId, options.topics || topicManifest),
    await getQuestionsForProfileOptions(options),
    options
  );

  return Promise.all(topics.map((topic) => getQuestionBank(topic.id, options)));
}

export async function getAllQuestions(options = {}) {
  const groups = await Promise.all(
    (options.topics || topicManifest).map((topic) => getQuestionsForTopic(topic.id, options))
  );

  return groups.flat();
}

export async function getVisibleTopicsForCategory(categoryId, options = {}) {
  const topics = getTopicsByCategoryFrom(categoryId, options.topics || topicManifest);
  const questions = await getQuestionsForProfileOptions(options);
  return filterTopicsForActiveProfile(topics, questions, options);
}

let visibleTopicsCache;
let visibleCategoriesCache;

async function getVisibleTopics() {
  if (!visibleTopicsCache) {
    visibleTopicsCache = getAllDiscoveredQuestions()
      .then((questions) => filterTopicsForActiveProfile(topicManifest, questions));
  }

  return visibleTopicsCache;
}

async function getVisibleCategories() {
  if (!visibleCategoriesCache) {
    visibleCategoriesCache = getAllDiscoveredQuestions()
      .then((questions) => filterCategoriesForActiveProfile(categoryManifest, topicManifest, questions));
  }

  return visibleCategoriesCache;
}

export const categories = categoryManifest;
export const allTopics = filterTopicsForActiveProfile(topicManifest);
export const dsaTopics = filterTopicsForActiveProfile(getTopicsByCategory('dsa'));
export const systemDesignTopics = filterTopicsForActiveProfile(getTopicsByCategory('system'));
export const javaTopics = filterTopicsForActiveProfile(getTopicsByCategory('java'));
export const kubernetesCkadTopics = filterTopicsForActiveProfile(getTopicsByCategory('kubernetes-ckad'));
export const aptitudeTopics = filterTopicsForActiveProfile(getTopicsByCategory('aptitude'));
export const mlAiTopics = filterTopicsForActiveProfile(getTopicsByCategory('ml-ai'));
export const engineeringLeadershipTopics = filterTopicsForActiveProfile(getTopicsByCategory('engineering-leadership'));

export function getCategory(categoryId) {
  return categories.find((category) => category.id === categoryId);
}

export function getTopicsForCategory(categoryId) {
  return filterTopicsForActiveProfile(getTopicsByCategory(categoryId));
}

export async function getVisibleCategoriesForActiveProfile(options = {}) {
  if (options.categories || options.topics || options.profile || hasExplicitQuestionsOption(options)) {
    const questions = await getQuestionsForProfileOptions(options);

    return filterCategoriesForActiveProfile(
      options.categories || categoryManifest,
      options.topics || topicManifest,
      questions,
      options
    );
  }

  return getVisibleCategories();
}

export async function getVisibleTopicsForActiveProfile(options = {}) {
  if (hasCustomBankSourceOptions(options)) {
    const questions = await getQuestionsForProfileOptions(options);
    return filterTopicsForActiveProfile(options.topics || topicManifest, questions, options);
  }

  return getVisibleTopics();
}

export async function validateLoadedProblems(options = {}) {
  return getProblemValidationResult(options);
}
