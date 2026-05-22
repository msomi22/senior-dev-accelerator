import ProblemBlockRenderer from './ProblemBlockRenderer.jsx';

const ALLOWED_VARIANTS = new Set(['default', 'architecture-case-study', 'interview-drill', 'deep-dive']);
const ALLOWED_DENSITIES = new Set(['compact', 'comfortable', 'detailed']);
const ALLOWED_ACCENTS = new Set(['blue', 'green', 'amber', 'neutral']);

function controlledToken(value, allowed, fallback) {
  return allowed.has(value) ? value : fallback;
}

export function getProblemBodyClassName(rendering = {}) {
  const variant = controlledToken(rendering?.variant, ALLOWED_VARIANTS, 'default');
  const density = controlledToken(rendering?.density, ALLOWED_DENSITIES, 'comfortable');
  const accent = controlledToken(rendering?.accent, ALLOWED_ACCENTS, 'neutral');

  return [
    'problem-rich-body',
    `problem-rich-variant-${variant}`,
    `problem-rich-density-${density}`,
    `problem-rich-accent-${accent}`
  ].join(' ');
}

export default function ProblemBodyRenderer({ body, rendering }) {
  if (!Array.isArray(body) || body.length === 0) return null;

  return (
    <section className={getProblemBodyClassName(rendering)} data-no-card-nav>
      {body.map((block, index) => (
        <ProblemBlockRenderer
          block={block}
          index={index}
          key={`${block?.type || 'unknown'}-${block?.title || index}`}
        />
      ))}
    </section>
  );
}
