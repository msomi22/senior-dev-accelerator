const DEFAULT_LIMIT = 4;

const FOUNDATIONAL_SIGNALS = [
  { pattern: /sliding\s*window/i, weight: 50 },
  { pattern: /two\s*pointers?/i, weight: 45 },
  { pattern: /binary\s*search/i, weight: 40 },
  { pattern: /prefix\s*sum|hash/i, weight: 35 },
  { pattern: /dynamic\s*programming|\bDP\b|state/i, weight: 30 },
  { pattern: /trees?/i, weight: 25 },
  { pattern: /graphs?|bfs|dfs/i, weight: 20 }
];

function getConfiguredRank(topic) {
  const rank = topic?.learningPath?.startHereRank
    ?? topic?.dashboard?.startHereRank
    ?? topic?.startHereRank;

  return Number.isFinite(rank) ? rank : null;
}

export function getTopicDisplayName(topic) {
  const name = topic?.shortName || topic?.label || topic?.name || 'Untitled topic';
  const [, suffix] = name.split('—').map((part) => part.trim());
  return suffix || name;
}

export function getTopicLearningTitle(topic) {
  return topic?.learningPath?.title
    || topic?.dashboard?.title
    || topic?.description
    || `Practice ${getTopicDisplayName(topic)}`;
}

export function scoreDashboardStartTopic(topic) {
  if (!topic || Number(topic.count || 0) <= 0) return Number.NEGATIVE_INFINITY;

  const progress = topic.progress || { percent: 0 };
  const searchableText = [topic.id, topic.name, topic.description, ...(topic.tags || [])]
    .filter(Boolean)
    .join(' ');
  let score = 100;

  const configuredRank = getConfiguredRank(topic);
  if (configuredRank !== null) {
    score += Math.max(0, 100 - configuredRank);
  }

  if (topic.category === 'dsa') score += 20;
  if (progress.percent === 0) score += 30;
  else if (progress.percent < 50) score += 18;
  else if (progress.percent < 100) score += 8;
  else score -= 120;

  for (const signal of FOUNDATIONAL_SIGNALS) {
    if (signal.pattern.test(searchableText)) score += signal.weight;
  }

  score += Math.min(Number(topic.count || 0), 10);

  return score;
}

function compareDashboardStartTopics(a, b) {
  const rankA = getConfiguredRank(a);
  const rankB = getConfiguredRank(b);

  if (rankA !== null || rankB !== null) {
    const configuredOrder = (rankA ?? 999) - (rankB ?? 999);
    if (configuredOrder !== 0) return configuredOrder;
  }

  const scoreOrder = scoreDashboardStartTopic(b) - scoreDashboardStartTopic(a);
  if (scoreOrder !== 0) return scoreOrder;

  const countOrder = Number(b.count || 0) - Number(a.count || 0);
  if (countOrder !== 0) return countOrder;

  return getTopicDisplayName(a).localeCompare(getTopicDisplayName(b));
}

export function getRecommendedStartTopics(topics = [], { limit = DEFAULT_LIMIT } = {}) {
  return [...topics]
    .filter((topic) => Number(topic?.count || 0) > 0)
    .sort(compareDashboardStartTopics)
    .slice(0, limit);
}
