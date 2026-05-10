const visualModules = import.meta.glob('../data/visuals/**/*.js');

function buildCandidatePaths(questionId) {
  const segments = questionId.split('-');

  if (segments.length < 2) {
    return [];
  }

  const topicFolder = segments.slice(0, -1).join('-');

  return [
    `../data/visuals/dsa/${topicFolder}/${questionId}.js`,
    `../data/visuals/system/${topicFolder}/${questionId}.js`
  ];
}

export async function loadVisualWalkthrough(questionId) {
  const candidates = buildCandidatePaths(questionId);

  for (const path of candidates) {
    const loader = visualModules[path];

    if (loader) {
      const module = await loader();
      return module.default || null;
    }
  }

  return null;
}
