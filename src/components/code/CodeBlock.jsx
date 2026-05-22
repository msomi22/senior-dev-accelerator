import { tokenizeCode } from '../../utils/codeTokenizer.js';

function text(value) {
  if (value === null || value === undefined) return '';
  return String(value);
}

function normalizeLanguage(language) {
  const value = text(language).trim().toLowerCase();
  return value || 'text';
}

function tokenClassName(type) {
  return `code-token-${type || 'plain'}`;
}

export default function CodeBlock({
  code,
  language = 'text',
  title,
  caption,
  filename,
  className = ''
}) {
  const safeCode = text(code);
  const label = title || filename || 'Code';
  const normalizedLanguage = normalizeLanguage(language);
  const lines = tokenizeCode(safeCode || 'No code sample is configured yet.');
  const rootClassName = ['ide-code-block', className].filter(Boolean).join(' ');

  return (
    <figure className={rootClassName} aria-label={`${label} code block`}>
      <figcaption className="ide-code-header">
        <span className="ide-code-title">{label}</span>
        <span className="ide-code-meta">
          {filename ? <span className="ide-code-filename">{filename}</span> : null}
          <span className="ide-code-language">{normalizedLanguage}</span>
        </span>
      </figcaption>

      <div className="ide-code-scroll" tabIndex={0}>
        <pre className="ide-code-pre">
          <code>
            {lines.map((line, lineIndex) => (
              <span className="ide-code-line" key={`line-${lineIndex}`}>
                {line.length ? line.map((token, tokenIndex) => (
                  <span className={tokenClassName(token.type)} key={`${token.type}-${lineIndex}-${tokenIndex}`}>
                    {token.value}
                  </span>
                )) : '\u00A0'}
              </span>
            ))}
          </code>
        </pre>
      </div>

      {caption ? <figcaption className="problem-rich-caption ide-code-caption">{caption}</figcaption> : null}
    </figure>
  );
}
