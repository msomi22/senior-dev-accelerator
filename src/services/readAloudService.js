const FEMALE_HINTS = ['female', 'samantha', 'zira', 'susan', 'karen', 'victoria', 'moira', 'tessa', 'serena', 'ava'];
const MALE_HINTS = ['male', 'david', 'daniel', 'alex', 'fred', 'tom', 'arthur', 'george'];

const ENGLISH_PREFERRED_VOICE_NAMES = [
  'Google US English'
];

function normalize(value) {
  return String(value || '').toLowerCase();
}

function getSpeechSynthesis() {
  return typeof globalThis !== 'undefined' ? globalThis.speechSynthesis : null;
}

function getUtteranceConstructor() {
  return typeof globalThis !== 'undefined' ? globalThis.SpeechSynthesisUtterance : null;
}

function voiceMatches(voice, hints) {
  const name = normalize(voice?.name);
  const uri = normalize(voice?.voiceURI);
  return hints.some((hint) => name.includes(hint) || uri.includes(hint));
}

export function pickPreferredVoice(voices = [], voiceType = 'female', lang = 'en') {
  const rows = Array.isArray(voices) ? voices : [];
  if (!rows.length) return null;

  const hints = voiceType === 'male' ? MALE_HINTS : FEMALE_HINTS;
  const normalizedLang = normalize(lang);
  const languagePrefix = normalizedLang.split('-')[0];

  const exactLanguageMatches = rows.filter((voice) => normalize(voice?.lang) === normalizedLang);
  const prefixLanguageMatches = rows.filter((voice) => normalize(voice?.lang).startsWith(languagePrefix));
  const languageMatches = exactLanguageMatches.length ? exactLanguageMatches : prefixLanguageMatches;

  const isEnglish = languagePrefix === 'en';

  if (isEnglish) {
    const preferredEnglishVoice = rows.find((voice) =>
      ENGLISH_PREFERRED_VOICE_NAMES.some((name) =>
        normalize(voice?.name) === normalize(name)
      )
    );

    if (preferredEnglishVoice) return preferredEnglishVoice;
  }

  const candidates = languageMatches.length ? languageMatches : isEnglish ? rows : [];

  if (!candidates.length) return null;

  return candidates.find((voice) => voiceMatches(voice, hints))
    || candidates[0]
    || null;
}

export function buildReadAloudText(questionOrText, options = {}) {
  const baseText = typeof questionOrText === 'string'
    ? questionOrText
    : questionOrText?.readAloudText || questionOrText?.question || questionOrText?.title || '';

  const shouldReadOptions = Boolean(options.readOptionsAloud ?? questionOrText?.readOptionsAloud);
  const answerOptions = options.answerOptions || questionOrText?.options || [];

  if (!shouldReadOptions || !answerOptions.length) return String(baseText).trim();

  const optionText = answerOptions
    .map((option, index) => `Option ${String.fromCharCode(65 + index)}, ${typeof option === 'object' ? option.text || option.label || option.ariaLabel || '' : option}`)
    .filter(Boolean)
    .join('. ');

  return [baseText, optionText].filter(Boolean).join('. ').trim();
}

export const readAloudService = {
  isSupported() {
    return Boolean(getSpeechSynthesis() && getUtteranceConstructor());
  },

  getVoices() {
    const synth = getSpeechSynthesis();
    return synth?.getVoices?.() || [];
  },

  stop() {
    const synth = getSpeechSynthesis();
    synth?.cancel?.();
  },

  speak(questionOrText, options = {}) {
    const synth = getSpeechSynthesis();
    const Utterance = getUtteranceConstructor();

    if (!synth || !Utterance) return null;

    const text = buildReadAloudText(questionOrText, options);
    if (!text) return null;

    synth.cancel?.();

    const voiceType = options.voiceType || 'female';
    const lang = options.lang || 'en-US';
    const utterance = new Utterance(text);

    utterance.lang = lang;
    utterance.rate = Number.isFinite(options.rate) ? options.rate : 0.85;
    utterance.pitch = Number.isFinite(options.pitch)
      ? options.pitch
      : voiceType === 'male' ? 0.92 : 1.08;

    const voice = pickPreferredVoice(this.getVoices(), voiceType, lang);
    if (voice) utterance.voice = voice;

    synth.speak(utterance);
    return utterance;
  }
};
