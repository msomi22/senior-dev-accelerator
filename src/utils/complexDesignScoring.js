const REASONING_WORDS = [
  'because',
  'so that',
  'in order to',
  'this helps',
  'since',
  'therefore',
  'why',
  'so it can',
  'as a result'
];

const TRADE_OFF_WORDS = [
  'trade-off',
  'tradeoff',
  'downside',
  'cost',
  'latency',
  'consistency',
  'availability',
  'complexity',
  'throughput',
  'stale',
  'eventual',
  'strong consistency'
];

const FAILURE_WORDS = [
  'failure',
  'failover',
  'retry',
  'timeout',
  'fallback',
  'unavailable',
  'degraded',
  'outage',
  'partial failure',
  'database down',
  'cache down'
];

const OBSERVABILITY_WORDS = [
  'metric',
  'metrics',
  'log',
  'logs',
  'trace',
  'tracing',
  'alert',
  'dashboard',
  'slo',
  'monitoring',
  'error rate',
  'latency'
];

function normalize(value = '') {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function includesAny(text, phrases = []) {
  return phrases.some((phrase) => text.includes(normalize(phrase)));
}

function countMatches(text, phrases = []) {
  return phrases.reduce((count, phrase) => count + (text.includes(normalize(phrase)) ? 1 : 0), 0);
}

function scoreCriterion(answerText, criterion) {
  const aliases = criterion.aliases || [];
  const matches = countMatches(answerText, aliases);

  if (!matches) {
    return { score: 0, matched: false, keywordOnly: false };
  }

  const max = Number(criterion.points || 0);
  const aliasCoverage = Math.min(1, matches / Math.max(1, Math.min(aliases.length, 3)));
  let ratio = 0.35 + aliasCoverage * 0.25;

  if (includesAny(answerText, REASONING_WORDS)) ratio += 0.15;
  if (includesAny(answerText, TRADE_OFF_WORDS)) ratio += 0.1;
  if (includesAny(answerText, FAILURE_WORDS)) ratio += 0.1;
  if (criterion.requiresReasoning && !includesAny(answerText, REASONING_WORDS)) ratio = Math.min(ratio, 0.55);

  const score = Math.min(max, Math.max(1, Math.round(max * ratio)));

  return {
    score,
    matched: true,
    keywordOnly: score <= Math.ceil(max * 0.45)
  };
}

function levelFor(percentage) {
  if (percentage >= 85) return 'Excellent';
  if (percentage >= 70) return 'Good';
  if (percentage >= 50) return 'Developing';
  return 'Needs work';
}

function sectionFeedback(section, score, maxScore, matchedCriteria, missedCriteria) {
  if (score === 0) return `Missing ${section.title}. Add the core concepts and explain the design reasoning.`;
  if (!missedCriteria.length && score >= maxScore * 0.8) return `Strong coverage of ${section.title}.`;
  if (matchedCriteria.length) {
    return `Covered ${matchedCriteria.length} area${matchedCriteria.length === 1 ? '' : 's'} in ${section.title}, but ${missedCriteria.slice(0, 2).join(', ') || 'some details'} could be clearer.`;
  }
  return `${section.title} needs more concrete design detail.`;
}

function buildStrength(section) {
  return `Covered ${section.title.toLowerCase()} well.`;
}

function buildImprovement(section, missedCriteria) {
  const missed = missedCriteria.slice(0, 2).join(' and ');
  return missed ? `Improve ${section.title.toLowerCase()}: add ${missed}.` : `Add more reasoning for ${section.title.toLowerCase()}.`;
}

export function scoreComplexDesignAnswer(question, answer) {
  const answerText = normalize(answer);
  const rubric = question?.scoringRubric || [];
  const maxScore = rubric.reduce((sum, section) => sum + Number(section.weight || 0), 0) || 100;

  if (!answerText) {
    return {
      totalScore: 0,
      maxScore,
      percentage: 0,
      level: 'Needs work',
      sectionScores: rubric.map((section) => ({
        id: section.id,
        title: section.title,
        score: 0,
        maxScore: Number(section.weight || 0),
        feedback: `Missing ${section.title}.`,
        matchedCriteria: [],
        missedCriteria: (section.criteria || []).map((criterion) => criterion.id)
      })),
      strengths: [],
      improvements: ['Write a complete design answer before evaluating.']
    };
  }

  const sectionScores = rubric.map((section) => {
    const rawMax = (section.criteria || []).reduce((sum, criterion) => sum + Number(criterion.points || 0), 0) || Number(section.weight || 0) || 1;
    let rawScore = 0;
    const matchedCriteria = [];
    const missedCriteria = [];

    (section.criteria || []).forEach((criterion) => {
      const result = scoreCriterion(answerText, criterion);
      rawScore += result.score;

      if (result.matched) matchedCriteria.push(criterion.id);
      else missedCriteria.push(criterion.id);
    });

    const maxSectionScore = Number(section.weight || rawMax);
    const score = Math.min(maxSectionScore, Math.round((rawScore / rawMax) * maxSectionScore));

    return {
      id: section.id,
      title: section.title,
      score,
      maxScore: maxSectionScore,
      feedback: sectionFeedback(section, score, maxSectionScore, matchedCriteria, missedCriteria),
      matchedCriteria,
      missedCriteria
    };
  });

  let totalScore = sectionScores.reduce((sum, section) => sum + section.score, 0);

  if (includesAny(answerText, OBSERVABILITY_WORDS)) totalScore = Math.min(maxScore, totalScore + 2);
  if (includesAny(answerText, FAILURE_WORDS) && includesAny(answerText, TRADE_OFF_WORDS)) totalScore = Math.min(maxScore, totalScore + 3);

  const percentage = Math.round((totalScore / maxScore) * 100);
  const strongSections = sectionScores.filter((section) => section.score >= section.maxScore * 0.7);
  const weakSections = sectionScores.filter((section) => section.score < section.maxScore * 0.7);

  return {
    totalScore,
    maxScore,
    percentage,
    level: levelFor(percentage),
    sectionScores,
    strengths: strongSections.slice(0, 4).map(buildStrength),
    improvements: weakSections.slice(0, 5).map((section) => buildImprovement(section, section.missedCriteria))
  };
}

export default scoreComplexDesignAnswer;
