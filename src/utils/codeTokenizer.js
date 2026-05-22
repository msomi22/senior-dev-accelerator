const JAVA_KEYWORDS = new Set([
  'public', 'private', 'protected', 'class', 'interface', 'enum', 'static',
  'final', 'void', 'int', 'long', 'double', 'boolean', 'char', 'String',
  'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'return',
  'new', 'null', 'true', 'false', 'try', 'catch', 'finally', 'throw',
  'throws', 'import', 'package', 'extends', 'implements', 'this', 'super'
]);

const OPERATORS = new Set([
  '+', '-', '*', '/', '%', '=', '!', '<', '>', '&', '|', '^', '~', '?', ':'
]);

const PUNCTUATION = new Set(['(', ')', '{', '}', '[', ']', ';', ',', '.', '@']);

function isIdentifierStart(char) {
  return /[A-Za-z_$]/.test(char);
}

function isIdentifierPart(char) {
  return /[A-Za-z0-9_$]/.test(char);
}

function isDigit(char) {
  return /[0-9]/.test(char);
}

function readWhile(line, start, predicate) {
  let end = start;
  while (end < line.length && predicate(line[end])) end += 1;
  return end;
}

function classifyIdentifier(value, line, end) {
  if (JAVA_KEYWORDS.has(value)) return 'keyword';

  const remainder = line.slice(end);
  if (/^\s*\(/.test(remainder)) return 'method';

  if (/^[A-Z]/.test(value)) return 'type';

  return 'plain';
}

function pushToken(tokens, type, value) {
  if (!value) return;
  tokens.push({ type, value });
}

function tokenizeLine(line, state = { inBlockComment: false }) {
  const tokens = [];
  let index = 0;
  let inBlockComment = state.inBlockComment === true;

  while (index < line.length) {
    if (inBlockComment) {
      const closeIndex = line.indexOf('*/', index);
      if (closeIndex === -1) {
        pushToken(tokens, 'comment', line.slice(index));
        index = line.length;
      } else {
        pushToken(tokens, 'comment', line.slice(index, closeIndex + 2));
        index = closeIndex + 2;
        inBlockComment = false;
      }
      continue;
    }

    const char = line[index];
    const next = line[index + 1];

    if (char === '/' && next === '/') {
      pushToken(tokens, 'comment', line.slice(index));
      index = line.length;
      continue;
    }

    if (char === '/' && next === '*') {
      const closeIndex = line.indexOf('*/', index + 2);
      if (closeIndex === -1) {
        pushToken(tokens, 'comment', line.slice(index));
        index = line.length;
        inBlockComment = true;
      } else {
        pushToken(tokens, 'comment', line.slice(index, closeIndex + 2));
        index = closeIndex + 2;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      const quote = char;
      let end = index + 1;
      let escaped = false;

      while (end < line.length) {
        const current = line[end];
        if (current === quote && !escaped) {
          end += 1;
          break;
        }
        escaped = current === '\\' && !escaped;
        if (current !== '\\') escaped = false;
        end += 1;
      }

      pushToken(tokens, 'string', line.slice(index, end));
      index = end;
      continue;
    }

    if (isDigit(char)) {
      const end = readWhile(line, index, (current) => /[0-9._A-Fa-fxXLl]/.test(current));
      pushToken(tokens, 'number', line.slice(index, end));
      index = end;
      continue;
    }

    if (isIdentifierStart(char)) {
      const end = readWhile(line, index, isIdentifierPart);
      const value = line.slice(index, end);
      pushToken(tokens, classifyIdentifier(value, line, end), value);
      index = end;
      continue;
    }

    if (OPERATORS.has(char)) {
      const end = readWhile(line, index, (current) => OPERATORS.has(current));
      pushToken(tokens, 'operator', line.slice(index, end));
      index = end;
      continue;
    }

    if (PUNCTUATION.has(char)) {
      pushToken(tokens, 'punctuation', char);
      index += 1;
      continue;
    }

    const end = readWhile(line, index, (current) => (
      !isIdentifierStart(current)
      && !isDigit(current)
      && !OPERATORS.has(current)
      && !PUNCTUATION.has(current)
      && current !== '"'
      && current !== "'"
    ));
    pushToken(tokens, 'plain', line.slice(index, Math.max(end, index + 1)));
    index = Math.max(end, index + 1);
  }

  return { tokens, state: { inBlockComment } };
}

export function tokenizeCode(code = '') {
  const lines = String(code).split('\n');
  let state = { inBlockComment: false };

  return lines.map((line) => {
    const result = tokenizeLine(line, state);
    state = result.state;
    return result.tokens;
  });
}

export const codeTokenTypes = [
  'keyword',
  'string',
  'comment',
  'number',
  'type',
  'method',
  'operator',
  'punctuation',
  'plain'
];
