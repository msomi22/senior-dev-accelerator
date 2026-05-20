const defaultNormalize = (problem) => problem;
const defaultValidate = () => [];
const defaultScorer = () => null;
const defaultComponent = null;

const legacyDsaType = (label) => ({
  label,
  normalize: defaultNormalize,
  validate: defaultValidate,
  scorer: defaultScorer,
  component: defaultComponent
});

export const problemTypeRegistry = {
  'multiple-choice': {
    label: 'Multiple Choice',
    normalize: defaultNormalize,
    validate: defaultValidate,
    scorer: defaultScorer,
    component: defaultComponent
  },
  mcq: legacyDsaType('Multiple Choice'),
  coding: {
    label: 'Coding',
    normalize: defaultNormalize,
    validate: defaultValidate,
    scorer: defaultScorer,
    component: defaultComponent
  },
  code: {
    label: 'Code',
    normalize: defaultNormalize,
    validate: defaultValidate,
    scorer: defaultScorer,
    component: defaultComponent
  },
  optimization: legacyDsaType('Optimization'),
  trace: legacyDsaType('Trace'),
  debugging: legacyDsaType('Debugging'),
  'simple-system-design': {
    label: 'Simple System Design',
    normalize: defaultNormalize,
    validate: defaultValidate,
    scorer: defaultScorer,
    component: defaultComponent
  },
  'complex-system-design': {
    label: 'Complex System Design',
    normalize: defaultNormalize,
    validate: defaultValidate,
    scorer: defaultScorer,
    component: defaultComponent
  }
};

export function getProblemType(type) {
  return problemTypeRegistry[type] || null;
}

export function isSupportedProblemType(type) {
  return Boolean(getProblemType(type));
}
