import * as fuzzball from "fuzzball";
import nlp from "compromise";
import { COMMON_SYSTEM_DESIGN_DICTIONARY } from "../data/scoring/systemDesignDictionary.js";

export const SCORING_MODEL_LABEL = "Hybrid deterministic scoring model";
export const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "has",
  "in",
  "is",
  "it",
  "its",
  "of",
  "on",
  "that",
  "the",
  "to",
  "was",
  "were",
  "will",
  "with",
]);
const TECHNICAL_STOPWORD_EXCEPTIONS = new Set([
  "url",
  "db",
  "api",
  "cache",
  "queue",
  "id",
  "key",
]);
const TRADE_OFF_WORDS = [
  "trade-off",
  "tradeoff",
  "trade off",
  "overhead",
  "bottleneck",
  "expensive",
  "cheaper",
  "slower",
  "faster",
  "operational cost",
  "write cost",
  "read cost",
  "memory cost",
  "complexity",
  "predictable",
  "guessable",
  "downside",
  "cost",
  "risk",
];
const FAILURE_WORDS = [
  "failure",
  "fail",
  "fails",
  "failing",
  "failover",
  "single point of failure",
  "spof",
  "network partition",
  "split brain",
  "split-brain",
  "cascading failure",
  "timeout",
  "retry",
  "circuit breaker",
  "fallback",
  "degraded mode",
  "database down",
  "cache down",
  "region failure",
  "queue backlog",
  "data loss",
  "replication lag",
  "unavailable",
  "outage",
];
const OBSERVABILITY_WORDS = [
  "metric",
  "metrics",
  "logs",
  "structured logs",
  "trace",
  "tracing",
  "trace id",
  "correlation id",
  "dashboard",
  "alert",
  "slo",
  "sla",
  "p95",
  "p99",
  "error rate",
  "queue lag",
  "cache hit rate",
  "database latency",
  "db latency",
  "monitoring",
];
const TYPO_REPLACEMENTS = [
  ["throug", "through"],
  ["throtteling", "throttling"],
  ["throttleing", "throttling"],
  ["authenatication", "authentication"],
  ["shortner", "shortener"],
  ["shortne", "shorten"],
  ["scaller", "scaler"],
  ["autoscaller", "autoscaler"],
  ["nework", "network"],
  ["savein", "save in"],
  ["saing", "saving"],
  ["hascode", "hashcode"],
  ["retrice", "retrieve"],
  ["usrl", "url"],
];
const SCORING_SIGNALS = [
  "rubric criteria",
  "shared scoring dictionary",
  "question-specific scoring dictionary",
  "partial credit",
  "reasoning signals",
  "trade-off signals",
  "failure-mode signals",
  "observability signals",
];
const GENERIC_NON_FUZZY_WORDS = new Set([
  "fast",
  "good",
  "server",
  "data",
  "open",
  "link",
  "user",
  "system",
  "work",
  "website",
]);
const STEM_REPLACEMENTS = new Map([
  ["metrics", "metric"],
  ["replicas", "replica"],
  ["indexes", "index"],
  ["indices", "index"],
  ["failures", "failure"],
  ["failing", "fail"],
  ["failed", "fail"],
  ["fails", "fail"],
  ["retries", "retry"],
  ["retried", "retry"],
  ["replicated", "replicate"],
  ["replicating", "replicate"],
  ["partitioned", "partition"],
  ["partitioning", "partition"],
  ["throttled", "throttle"],
  ["throttling", "throttle"],
  ["cached", "cache"],
  ["caching", "cache"],
  ["redirected", "redirect"],
  ["redirecting", "redirect"],
  ["queued", "queue"],
  ["queuing", "queue"],
  ["sharded", "shard"],
  ["sharding", "shard"],
  ["monitored", "monitor"],
  ["monitoring", "monitor"],
]);
const GATEKEEPER_CAPS = [
  ["storage-design", 0.4],
  ["read-write-flows", 0.5],
  ["short-code-generation", 0.65],
  ["reliability-consistency", 0.8],
  ["security-abuse", 0.85],
  ["observability", 0.9],
];

export function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const NORMALIZE_CACHE = new Map();
export function normalize(value = "") {
  const original = String(value);
  if (NORMALIZE_CACHE.has(original)) return NORMALIZE_CACHE.get(original);
  let normalized = original.toLowerCase();
  TYPO_REPLACEMENTS.forEach(([from, to]) => {
    normalized = normalized.replace(
      new RegExp(`\\b${escapeRegExp(from)}\\b`, "g"),
      to,
    );
  });
  normalized = normalized
    .replace(/base\s*62/g, "base62")
    .replace(/hash\s*code/g, "hashcode")
    .replace(/\bdb\b/g, "database")
    .replace(/\bk8s\b/g, "kubernetes")
    .replace(/\bpostgres\b/g, "postgresql")
    .replace(/\basync\b/g, "asynchronous")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (NORMALIZE_CACHE.size > 1000) NORMALIZE_CACHE.clear();
  NORMALIZE_CACHE.set(original, normalized);
  return normalized;
}
export function words(value = "") {
  const normalized = normalize(value);
  return normalized ? normalized.split(/\s+/).filter(Boolean) : [];
}
export function stemWord(word = "") {
  const token = normalize(word);
  if (STEM_REPLACEMENTS.has(token)) return STEM_REPLACEMENTS.get(token);
  if (token.length > 6 && token.endsWith("ies"))
    return `${token.slice(0, -3)}y`;
  if (token.length > 6 && token.endsWith("ing")) return token.slice(0, -3);
  if (token.length > 5 && token.endsWith("ed")) return token.slice(0, -2);
  if (token.length > 5 && token.endsWith("es")) return token.slice(0, -2);
  if (token.length > 5 && token.endsWith("s")) return token.slice(0, -1);
  return token;
}
export function shouldFuzzyTokenMatch(word = "") {
  const token = normalize(word);
  return (
    token.length > 5 &&
    !GENERIC_NON_FUZZY_WORDS.has(token) &&
    /^[a-z0-9]+$/.test(token)
  );
}
export function shouldFuzzyPhraseMatch(phrase = "") {
  const phraseWords = words(phrase).filter(
    (word) => !STOPWORDS.has(word) || TECHNICAL_STOPWORD_EXCEPTIONS.has(word),
  );
  return phraseWords.some(shouldFuzzyTokenMatch) && phraseWords.length > 0;
}
function fuzzyThresholdFor(dictionaryWord = "", threshold = 85) {
  const token = normalize(dictionaryWord);
  if (token.length <= 8) return Math.max(threshold, 90);
  return Math.max(threshold, 85);
}
export function fuzzyWordMatches(
  answerWord = "",
  dictionaryWord = "",
  threshold = 85,
) {
  const answerToken = normalize(answerWord);
  const dictionaryToken = normalize(dictionaryWord);
  if (!answerToken || !shouldFuzzyTokenMatch(dictionaryToken)) return false;
  if (GENERIC_NON_FUZZY_WORDS.has(answerToken)) return false;
  if (Math.abs(answerToken.length - dictionaryToken.length) > 3) return false;
  return (
    fuzzball.ratio(answerToken, dictionaryToken) >=
    fuzzyThresholdFor(dictionaryToken, threshold)
  );
}
export function tokenFuzzyMatch(answerText, phraseWords, threshold = 85) {
  const answerTokens = words(answerText);
  const importantWords = phraseWords.filter((word) =>
    shouldFuzzyTokenMatch(word),
  );
  if (!importantWords.length) return false;
  const matched = importantWords.filter((phraseWord) =>
    answerTokens.some((answerWord) =>
      fuzzyWordMatches(answerWord, phraseWord, threshold),
    ),
  ).length;
  return matched / importantWords.length >= 0.75;
}
export function fuzzyPhraseMatch(answerText, phrase, threshold = 85) {
  if (!shouldFuzzyPhraseMatch(phrase)) return false;
  const phraseWords = words(phrase);
  if (phraseWords.length === 1)
    return tokenFuzzyMatch(answerText, phraseWords, threshold);
  const answerWords = words(answerText);
  if (answerWords.length > 120 || phraseWords.length > 6) return false;
  const windowSize = Math.min(Math.max(phraseWords.length + 2, 4), 12);
  const importantPhraseWords = phraseWords.filter(
    (word) => !STOPWORDS.has(word) || TECHNICAL_STOPWORD_EXCEPTIONS.has(word),
  );
  for (
    let index = 0;
    index <= answerWords.length - Math.min(windowSize, answerWords.length);
    index += 1
  ) {
    const windowText = answerWords.slice(index, index + windowSize).join(" ");
    const importantMatched = importantPhraseWords.filter((word) =>
      words(windowText).some((answerWord) => tokenMatches(answerWord, word)),
    ).length;
    if (
      importantPhraseWords.length &&
      importantMatched / importantPhraseWords.length >= 0.75
    ) {
      const ratioScore = fuzzball.ratio(windowText, normalize(phrase));
      const tokenSetScore = fuzzball.token_set_ratio(
        windowText,
        normalize(phrase),
      );
      if (Math.max(ratioScore, tokenSetScore) >= threshold) return true;
    }
  }
  return false;
}
const TOKEN_MATCH_CACHE = new Map();
export function tokenMatches(answerWord = "", dictionaryWord = "") {
  const answerToken = normalize(answerWord);
  const dictionaryToken = normalize(dictionaryWord);
  if (!answerToken || !dictionaryToken) return false;
  const cacheKey = `${answerToken}|${dictionaryToken}`;
  if (TOKEN_MATCH_CACHE.has(cacheKey)) return TOKEN_MATCH_CACHE.get(cacheKey);
  const answerStem = stemWord(answerToken);
  const dictionaryStem = stemWord(dictionaryToken);
  const matched =
    answerToken === dictionaryToken ||
    answerStem === dictionaryStem ||
    fuzzyWordMatches(answerToken, dictionaryToken) ||
    fuzzyWordMatches(answerStem, dictionaryStem);
  if (TOKEN_MATCH_CACHE.size > 5000) TOKEN_MATCH_CACHE.clear();
  TOKEN_MATCH_CACHE.set(cacheKey, matched);
  return matched;
}
function containsOrderedPhrase(answerWords, phraseWords) {
  if (!phraseWords.length) return false;
  for (
    let index = 0;
    index <= answerWords.length - phraseWords.length;
    index += 1
  ) {
    if (
      phraseWords.every((word, offset) =>
        tokenMatches(answerWords[index + offset], word),
      )
    )
      return true;
  }
  return false;
}
export function phraseMatches(text, phrase) {
  const normalizedText = normalize(text);
  const normalizedPhrase = normalize(phrase);
  const phraseWords = words(normalizedPhrase);
  if (!phraseWords.length) return false;
  if (phraseWords.length === 1)
    return words(normalizedText).some((answerWord) =>
      tokenMatches(answerWord, phraseWords[0]),
    );
  return (
    normalizedText.includes(normalizedPhrase) ||
    containsOrderedPhrase(words(normalizedText), phraseWords) ||
    fuzzyPhraseMatch(normalizedText, normalizedPhrase)
  );
}
function exactPhraseMatches(text, phrase) {
  const normalizedPhrase = normalize(phrase);
  if (!normalizedPhrase) return false;
  const phraseWords = words(normalizedPhrase);
  if (phraseWords.length === 1) return words(text).includes(phraseWords[0]);
  return normalize(text).includes(normalizedPhrase);
}
function includesAny(text, phrases = []) {
  return phrases.some((phrase) => phraseMatches(text, phrase));
}
function matchPhraseList(text, phrases = []) {
  const exactMatches = phrases.filter((phrase) =>
    exactPhraseMatches(text, phrase),
  );
  if (exactMatches.length) return exactMatches;
  return phrases.filter((phrase) => phraseMatches(text, phrase));
}
function sentenceChunks(text = "") {
  const raw = String(text);
  try {
    const sentences = nlp(raw).sentences().out("array");
    if (sentences.length) return sentences.map(normalize).filter(Boolean);
  } catch {}
  return raw
    .split(/[.!?;\n]+/)
    .map(normalize)
    .filter(Boolean);
}
function hasStructuredTradeoff(answerText = "") {
  const sentences = sentenceChunks(answerText);
  const choice =
    /\b(use|choose|prefer|select|store|cache|queue|redirect|generate|partition|shard|replicate)\b/;
  const benefit =
    /\b(because|so that|in order to|allows|ensures|improves|reduces|prevents|avoids|benefit|faster|lower latency|available|safe)\b/;
  const cost =
    /\b(but|however|although|trade off|tradeoff|trade-off|cost|downside|risk|overhead|complexity|slower|less|stale|eventual|guessable|predictable)\b/;
  return sentences.some(
    (sentence) =>
      choice.test(sentence) && benefit.test(sentence) && cost.test(sentence),
  );
}
export function detectReasoningPatterns(answerText = "") {
  const normalized = normalize(answerText);
  const sentences = sentenceChunks(answerText);
  const causalPattern =
    /\b(because|therefore|since|so that|in order to)\b|\bdue to\b|\bas a result\b|\bthis (allows|ensures|reduces|improves|prevents|avoids)\b|\bthe goal is\b/;
  const verbReasoningPattern =
    /\b\w+\s+(improves|reduces|prevents|avoids|allows|ensures)\s+\w+/;
  const chooseBecausePattern = /\b(we|i) choose\b.+\bbecause\b/;
  const hasReasoning =
    causalPattern.test(normalized) ||
    sentences.some(
      (sentence) =>
        causalPattern.test(sentence) ||
        verbReasoningPattern.test(sentence) ||
        chooseBecausePattern.test(sentence),
    );
  const hasTradeoff =
    hasStructuredTradeoff(answerText) ||
    includesAny(normalized, TRADE_OFF_WORDS);
  const hasFailure = includesAny(normalized, FAILURE_WORDS);
  const hasObservability = includesAny(normalized, OBSERVABILITY_WORDS);
  return { hasReasoning, hasTradeoff, hasFailure, hasObservability };
}
function sectionAwareSignals(answerText = "", sectionId = "") {
  const global = detectReasoningPatterns(answerText);
  const sentences = sentenceChunks(answerText);
  const termsBySection =
    {
      "short-code-generation": [
        "collision",
        "base62",
        "random",
        "sequence",
        "snowflake",
        "predictable",
        "guessable",
        "unique",
      ],
      "storage-design": [
        "schema",
        "table",
        "index",
        "lookup",
        "primary key",
        "database",
        "mapping",
      ],
      "read-write-flows": [
        "cache miss",
        "cache hit",
        "database fallback",
        "redirect",
        "404",
        "lookup",
      ],
      "reliability-consistency": [
        "fail",
        "fallback",
        "replica",
        "region",
        "strong consistency",
        "eventual consistency",
      ],
      analytics: ["analytics", "queue", "eventual", "background", "worker"],
      "security-abuse": [
        "abuse",
        "owner",
        "ownership",
        "rate limit",
        "auth",
        "alias",
        "phishing",
      ],
      observability: ["metric", "log", "trace", "alert", "dashboard"],
    }[sectionId] || [];
  const hasSectionReasoning =
    termsBySection.length &&
    sentences.some(
      (sentence) =>
        termsBySection.some((term) => phraseMatches(sentence, term)) &&
        detectReasoningPatterns(sentence).hasReasoning,
    );
  return {
    ...global,
    hasReasoning: global.hasReasoning || hasSectionReasoning,
  };
}
function conceptConfigFrom(entry) {
  if (!entry)
    return {
      terms: [],
      synonyms: [],
      stems: [],
      negativePhrases: [],
      proximity: null,
    };
  if (Array.isArray(entry))
    return {
      terms: entry,
      synonyms: [],
      stems: [],
      negativePhrases: [],
      proximity: null,
    };
  return {
    terms: entry.terms || [],
    synonyms: entry.synonyms || [],
    stems: entry.stems || [],
    negativePhrases: entry.negativePhrases || [],
    proximity: entry.proximity || null,
  };
}
export function tokenPositions(answerWords = [], termGroup = []) {
  const positions = [];
  const normalizedTerms = termGroup.flatMap((term) => {
    const termWords = words(term);
    return termWords.length ? [termWords] : [];
  });
  answerWords.forEach((_, index) => {
    if (
      normalizedTerms.some((termWords) =>
        termWords.every((word, offset) =>
          tokenMatches(answerWords[index + offset], word),
        ),
      )
    )
      positions.push(index);
  });
  return positions;
}
export function termsNearEachOther(
  answerWords = [],
  groups = [],
  windowSize = 12,
) {
  const groupPositions = groups.map((group) =>
    tokenPositions(answerWords, group),
  );
  if (groupPositions.some((positions) => positions.length === 0)) return false;
  return groupPositions[0].some((anchor) =>
    groupPositions.every((positions) =>
      positions.some((position) => Math.abs(position - anchor) <= windowSize),
    ),
  );
}
export function hasNegativePhraseNearConcept(answerText, conceptConfig = {}) {
  const negativePhrases = conceptConfig.negativePhrases || [];
  if (!negativePhrases.length) return false;
  const relatedTerms = [
    ...(conceptConfig.terms || []),
    ...(conceptConfig.synonyms || []),
    ...(conceptConfig.proximity?.groups || []).flat(),
  ];
  return sentenceChunks(answerText).some((sentence) => {
    const hasNegative = negativePhrases.some(
      (phrase) =>
        exactPhraseMatches(sentence, phrase) || phraseMatches(sentence, phrase),
    );
    if (!hasNegative) return false;
    return (
      !relatedTerms.length ||
      relatedTerms.some((term) => phraseMatches(sentence, term))
    );
  });
}
export function proximityConceptMatches(answerText, conceptConfig = {}) {
  if (
    !conceptConfig.proximity ||
    hasNegativePhraseNearConcept(answerText, conceptConfig)
  )
    return false;
  const answerWords = words(answerText);
  const groups = conceptConfig.proximity.groups || [];
  const requiredGroups =
    conceptConfig.proximity.requiredGroups || groups.length;
  const windowSize = Math.min(
    Number(conceptConfig.proximity.windowSize || 12),
    15,
  );
  if (!groups.length) return false;
  if (requiredGroups >= groups.length)
    return termsNearEachOther(answerWords, groups, windowSize);
  const matchedGroups = groups.filter(
    (group) => tokenPositions(answerWords, group).length > 0,
  );
  if (matchedGroups.length < requiredGroups) return false;
  for (let i = 0; i < matchedGroups.length; i += 1) {
    const subset = matchedGroups.slice(i, i + requiredGroups);
    if (
      subset.length === requiredGroups &&
      termsNearEachOther(answerWords, subset, windowSize)
    )
      return true;
  }
  return false;
}
function conceptMatches(text, entry, conceptName = "") {
  const config = conceptConfigFrom(entry);
  if (hasNegativePhraseNearConcept(text, config))
    return { matched: false, labels: [], source: "negative" };
  const termMatches = matchPhraseList(text, config.terms);
  if (termMatches.length)
    return { matched: true, labels: termMatches, source: "term" };
  const synonymMatches = matchPhraseList(text, config.synonyms);
  if (synonymMatches.length)
    return { matched: true, labels: synonymMatches, source: "synonym" };
  const answerStems = new Set(words(text).map(stemWord));
  const stemMatches = (config.stems || []).filter((stem) =>
    answerStems.has(stemWord(stem)),
  );
  if (stemMatches.length)
    return { matched: true, labels: stemMatches, source: "stem" };
  if (
    [...(config.terms || []), ...(config.synonyms || [])].some((phrase) =>
      fuzzyPhraseMatch(text, phrase),
    )
  )
    return { matched: true, labels: [conceptName], source: "fuzzy" };
  if (proximityConceptMatches(text, config))
    return { matched: true, labels: [conceptName], source: "proximity" };
  return { matched: false, labels: [], source: null };
}
function dictionaryMatchesFor(concepts = [], dictionary = {}, text = "") {
  return dictionaryMatchDetails(
    concepts,
    dictionary,
    text,
    "dictionary",
  ).flatMap((item) => item.labels);
}
function dictionaryMatchDetails(
  concepts = [],
  dictionary = {},
  text = "",
  dictionarySource = "dictionary",
) {
  const details = [];
  (concepts || []).forEach((concept) => {
    const result = conceptMatches(text, dictionary[concept], concept);
    if (result.matched)
      details.push({
        concept,
        labels: result.labels,
        source: dictionarySource,
        matchSource: result.source,
      });
  });
  return details;
}
function questionDictionaryFor(question) {
  return question?.scoringDictionary || {};
}
function uniqueLabels(details = []) {
  return [...new Set(details.flatMap((item) => item.labels))];
}
export function matchCriterion(answerText, criterion, question) {
  const shared = dictionaryMatchDetails(
    criterion.concepts,
    COMMON_SYSTEM_DESIGN_DICTIONARY,
    answerText,
    "shared dictionary",
  );
  const questionSpecific = dictionaryMatchDetails(
    criterion.questionConcepts,
    questionDictionaryFor(question),
    answerText,
    "question dictionary",
  );
  const aliasLabels = matchPhraseList(answerText, criterion.aliases || []);
  const alias = aliasLabels.length
    ? [
        {
          concept: "aliases",
          labels: aliasLabels,
          source: "alias",
          matchSource: "phrase",
        },
      ]
    : [];
  const matches = uniqueLabels([...shared, ...questionSpecific, ...alias]);
  return {
    matched: matches.length > 0,
    matches,
    matchedAliases: matches,
    matchDetails: [...shared, ...questionSpecific, ...alias],
  };
}
function criticalMatches(question, criterion, answerText) {
  const shared = dictionaryMatchesFor(
    criterion.criticalConcepts,
    COMMON_SYSTEM_DESIGN_DICTIONARY,
    answerText,
  );
  const questionSpecific = dictionaryMatchesFor(
    criterion.criticalQuestionConcepts,
    questionDictionaryFor(question),
    answerText,
  );
  const aliases = matchPhraseList(answerText, criterion.criticalAliases || []);
  const hasCriticalTerms =
    [
      ...(criterion.criticalConcepts || []),
      ...(criterion.criticalQuestionConcepts || []),
      ...(criterion.criticalAliases || []),
    ].length > 0;
  return {
    criticalMatched:
      !hasCriticalTerms ||
      shared.length > 0 ||
      questionSpecific.length > 0 ||
      aliases.length > 0,
    criticalLabels: [...shared, ...questionSpecific, ...aliases],
  };
}
function countSignalFamilies(answerText, sectionId) {
  const patterns = sectionAwareSignals(answerText, sectionId);
  return [
    patterns.hasReasoning,
    patterns.hasTradeoff,
    patterns.hasFailure,
    patterns.hasObservability,
  ].filter(Boolean).length;
}
function criterionLabel(criterion) {
  return criterion.label || criterion.id;
}
function matchedNegativePhrases(answerText, phrases = []) {
  return (phrases || []).filter((phrase) =>
    sentenceChunks(answerText).some((sentence) =>
      phraseMatches(sentence, phrase),
    ),
  );
}
function criterionNegativePhrases(question, criterion) {
  const names = [
    ...(criterion.concepts || []),
    ...(criterion.questionConcepts || []),
    ...(criterion.criticalConcepts || []),
    ...(criterion.criticalQuestionConcepts || []),
  ];
  return names
    .flatMap((name) => [
      COMMON_SYSTEM_DESIGN_DICTIONARY[name],
      questionDictionaryFor(question)[name],
    ])
    .filter(Boolean)
    .flatMap((entry) => conceptConfigFrom(entry).negativePhrases || []);
}
export function evaluateCriterionQuality(
  answerText,
  criterion,
  question,
  sectionId = "",
) {
  const patterns = sectionAwareSignals(answerText, sectionId);
  const signalFamilies = countSignalFamilies(answerText, sectionId);
  const critical = criticalMatches(question, criterion, answerText);
  const negatives = matchedNegativePhrases(answerText, [
    ...criterionNegativePhrases(question, criterion),
    ...(criterion.negativePhrases || []),
  ]);
  return {
    patterns,
    signalFamilies,
    criticalMatched: critical.criticalMatched,
    criticalLabels: critical.criticalLabels,
    negatives,
    hasContradiction: negatives.length > 0,
  };
}
export function calculateCriterionScore(match, quality, criterion) {
  if (!match.matched)
    return {
      score: 0,
      matched: false,
      keywordOnly: false,
      matchedAliases: [],
      ratio: 0,
    };
  const max = Number(criterion.points || 0);
  const targetCoverage = Number(criterion.minimumMatches || 0) || 1;
  const aliasCoverage = Math.min(1, match.matches.length / targetCoverage);
  let ratio = 0.42 + aliasCoverage * 0.38;
  if (quality.patterns.hasReasoning) ratio += 0.08;
  if (quality.patterns.hasTradeoff) ratio += 0.05;
  if (quality.patterns.hasFailure) ratio += 0.05;
  if (quality.patterns.hasObservability) ratio += 0.02;
  if (criterion.requiresReasoning && !quality.patterns.hasReasoning)
    ratio = Math.min(ratio, 0.65);
  if (!quality.criticalMatched)
    ratio = Math.min(ratio, Number(criterion.maxRatioWithoutCritical || 0.65));
  if (quality.hasContradiction)
    ratio = Math.min(
      ratio,
      Number(criterion.maxRatioWithContradiction || 0.45),
    );
  if (
    match.matches.length >= targetCoverage &&
    quality.criticalMatched &&
    !quality.hasContradiction &&
    (!criterion.requiresReasoning || quality.patterns.hasReasoning)
  )
    ratio = Math.max(ratio, 1);
  return {
    score: Math.min(max, Math.max(1, Math.round(max * ratio))),
    matched: true,
    keywordOnly: quality.signalFamilies <= 1 && match.matches.length <= 1,
    matchedAliases: match.matches,
    ratio,
    hasContradiction: quality.hasContradiction,
  };
}
function scoreCriterion(
  answerText,
  criterion,
  question,
  sectionId = "",
  debug = false,
) {
  const match = matchCriterion(answerText, criterion, question);
  const quality = evaluateCriterionQuality(
    answerText,
    criterion,
    question,
    sectionId,
  );
  const scored = calculateCriterionScore(match, quality, criterion);
  if (!debug) return scored;
  return {
    ...scored,
    debug: {
      criterionId: criterion.id,
      sectionId,
      matched: match.matched,
      matchedTerms: match.matches,
      matchDetails: match.matchDetails,
      criticalMatched: quality.criticalMatched,
      criticalLabels: quality.criticalLabels,
      reasoningSignals: quality.patterns,
      negativePhrases: quality.negatives,
      ratio: scored.ratio,
      finalCriterionScore: scored.score,
    },
  };
}
function levelFor(percentage) {
  if (percentage >= 85) return "Excellent";
  if (percentage >= 70) return "Good";
  if (percentage >= 50) return "Developing";
  return "Needs work";
}
function sectionFeedback(
  section,
  score,
  maxScore,
  matchedLabels,
  missedLabels,
) {
  if (score === 0)
    return `Missing ${section.title}. Add the core concepts and explain the design reasoning.`;
  if (!missedLabels.length && score >= maxScore * 0.8)
    return `Strong coverage of ${section.title}.`;
  if (matchedLabels.length)
    return `Covered ${matchedLabels.length} area${matchedLabels.length === 1 ? "" : "s"} in ${section.title}, but ${missedLabels.slice(0, 2).join(", ") || "some details"} could be clearer.`;
  return `${section.title} needs more concrete design detail.`;
}
function buildStrength(section) {
  return `Covered ${section.title.toLowerCase()} well.`;
}
function buildImprovement(section) {
  const missed = (section.missedLabels || section.missedCriteria || [])
    .slice(0, 2)
    .join(" and ");
  return missed
    ? `Improve ${section.title.toLowerCase()}: add ${missed}.`
    : `Add more reasoning for ${section.title.toLowerCase()}.`;
}
function baseResult(overrides = {}) {
  return {
    scoringModel: SCORING_MODEL_LABEL,
    scoringExplanation:
      "Scored based on key design coverage, clear reasoning, trade-offs, reliability, security, scaling, and observability.",
    scoringSignals: SCORING_SIGNALS,
    ...overrides,
  };
}
function countWords(answerText) {
  return words(answerText).length;
}
function gatekeeperCapsFor(question) {
  if (Array.isArray(question?.scoringCaps) && question.scoringCaps.length)
    return question.scoringCaps
      .map(({ sectionId, maxRatioIfMissing }) => [
        sectionId,
        Number(maxRatioIfMissing),
      ])
      .filter(([id, ratio]) => id && Number.isFinite(ratio));
  return GATEKEEPER_CAPS;
}
function gatekeeperCapTrace(totalScore, maxScore, sectionScores, question) {
  let cappedScore = totalScore;
  const applied = [];
  gatekeeperCapsFor(question).forEach(([sectionId, maxRatio]) => {
    const section = sectionScores.find((item) => item.id === sectionId);
    const capScore = Math.round(maxScore * maxRatio);
    if (section && section.score === 0 && cappedScore > capScore) {
      cappedScore = capScore;
      applied.push({
        type: "gatekeeper",
        sectionId,
        maxRatioIfMissing: maxRatio,
        cappedScore,
      });
    }
  });
  return { cappedScore, applied };
}
export function applyGatekeeperCaps(
  totalScore,
  maxScore,
  sectionScores,
  question,
) {
  return gatekeeperCapTrace(totalScore, maxScore, sectionScores, question)
    .cappedScore;
}
function qualityCapTrace(totalScore, maxScore, sectionScores, answerText) {
  const wordCount = countWords(answerText);
  const coveredSections = sectionScores.filter(
    (section) => section.score > 0,
  ).length;
  const strongSections = sectionScores.filter(
    (section) => section.score >= section.maxScore * 0.6,
  ).length;
  const signalFamilies = countSignalFamilies(answerText);
  const matchedCriteria = sectionScores.reduce(
    (sum, section) => sum + section.matchedCriteria.length,
    0,
  );
  const totalCriteria = sectionScores.reduce(
    (sum, section) =>
      sum + section.matchedCriteria.length + section.missedCriteria.length,
    0,
  );
  let cap = maxScore;
  const applied = [];
  const apply = (reason, ratio) => {
    const score = Math.round(maxScore * ratio);
    if (cap > score) {
      cap = score;
      applied.push({ type: "quality", reason, ratio, cappedScore: score });
    }
  };
  if (wordCount < 25) apply("very short answer", 0.35);
  else if (wordCount < 80) apply("short answer", 0.7);
  if (coveredSections < 4) apply("too few covered sections", 0.6);
  if (strongSections < 3) apply("too few strong sections", 0.75);
  if (signalFamilies <= 1 && matchedCriteria < totalCriteria)
    apply("mostly keyword-only coverage", 0.65);
  return { cappedScore: Math.min(totalScore, cap), applied };
}
function applyQualityCaps(totalScore, maxScore, sectionScores, answerText) {
  return qualityCapTrace(totalScore, maxScore, sectionScores, answerText)
    .cappedScore;
}
export function scoreComplexDesignAnswer(question, answer, options = {}) {
  const debugEnabled = options?.debug === true;
  const answerText = normalize(answer);
  const rubric = question?.scoringRubric || [];
  const maxScore =
    rubric.reduce((sum, section) => sum + Number(section.weight || 0), 0) ||
    100;
  if (!answerText) {
    const empty = baseResult({
      totalScore: 0,
      maxScore,
      percentage: 0,
      level: "Needs work",
      sectionScores: rubric.map((section) => ({
        id: section.id,
        title: section.title,
        score: 0,
        maxScore: Number(section.weight || 0),
        feedback: `Missing ${section.title}.`,
        matchedCriteria: [],
        missedCriteria: (section.criteria || []).map(
          (criterion) => criterion.id,
        ),
        matchedLabels: [],
        missedLabels: (section.criteria || []).map(criterionLabel),
      })),
      strengths: [],
      improvements: ["Write a complete design answer before evaluating."],
    });
    return debugEnabled
      ? {
          ...empty,
          debug: { criteria: [], capsApplied: [], finalCappedScore: 0 },
        }
      : empty;
  }
  const criterionDebug = [];
  const sectionScores = rubric.map((section) => {
    const rawMax =
      (section.criteria || []).reduce(
        (sum, criterion) => sum + Number(criterion.points || 0),
        0,
      ) ||
      Number(section.weight || 0) ||
      1;
    let rawScore = 0;
    let hasSectionContradiction = false;
    const matchedCriteria = [],
      missedCriteria = [],
      matchedLabels = [],
      missedLabels = [];
    (section.criteria || []).forEach((criterion) => {
      const result = scoreCriterion(
        answerText,
        criterion,
        question,
        section.id,
        debugEnabled,
      );
      rawScore += result.score;
      if (result.hasContradiction) hasSectionContradiction = true;
      if (debugEnabled) criterionDebug.push(result.debug);
      if (result.matched) {
        matchedCriteria.push(criterion.id);
        matchedLabels.push(criterionLabel(criterion));
      } else {
        missedCriteria.push(criterion.id);
        missedLabels.push(criterionLabel(criterion));
      }
    });
    const maxSectionScore = Number(section.weight || rawMax);
    let score = Math.min(
      maxSectionScore,
      Math.round((rawScore / rawMax) * maxSectionScore),
    );
    if (hasSectionContradiction)
      score = Math.min(score, Math.round(maxSectionScore * 0.7));
    return {
      id: section.id,
      title: section.title,
      score,
      maxScore: maxSectionScore,
      feedback: sectionFeedback(
        section,
        score,
        maxSectionScore,
        matchedLabels,
        missedLabels,
      ),
      matchedCriteria,
      missedCriteria,
      matchedLabels,
      missedLabels,
    };
  });
  let totalScore = sectionScores.reduce(
    (sum, section) => sum + section.score,
    0,
  );
  const rawTotalScore = totalScore;
  const allCriteriaMatched = sectionScores.every(
    (section) => section.missedCriteria.length === 0,
  );
  const patterns = detectReasoningPatterns(answerText);
  const bonuses = [];
  if (!allCriteriaMatched) {
    if (patterns.hasObservability) {
      totalScore = Math.min(maxScore, totalScore + 2);
      bonuses.push({ signal: "observability", points: 2 });
    }
    if (patterns.hasFailure && patterns.hasTradeoff) {
      totalScore = Math.min(maxScore, totalScore + 3);
      bonuses.push({ signal: "failure+tradeoff", points: 3 });
    }
  }
  const gateTrace = gatekeeperCapTrace(
    totalScore,
    maxScore,
    sectionScores,
    question,
  );
  totalScore = gateTrace.cappedScore;
  const qualityTrace = qualityCapTrace(
    totalScore,
    maxScore,
    sectionScores,
    answerText,
  );
  totalScore = qualityTrace.cappedScore;
  const percentage = Math.round((totalScore / maxScore) * 100);
  const strongSections = sectionScores.filter(
    (section) => section.score >= section.maxScore * 0.7,
  );
  const weakSections = sectionScores.filter(
    (section) => section.score < section.maxScore * 0.7,
  );
  const result = baseResult({
    totalScore,
    maxScore,
    percentage,
    level: levelFor(percentage),
    sectionScores,
    strengths: strongSections.slice(0, 4).map(buildStrength),
    improvements: weakSections.slice(0, 5).map(buildImprovement),
  });
  if (!debugEnabled) return result;
  return {
    ...result,
    debug: {
      criteria: criterionDebug,
      signals: patterns,
      bonuses,
      capsApplied: [...gateTrace.applied, ...qualityTrace.applied],
      rawTotalScore,
      finalCappedScore: totalScore,
    },
  };
}
export default scoreComplexDesignAnswer;
