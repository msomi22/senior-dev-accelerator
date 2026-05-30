const markdownLinkPattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
const urlPattern = /(https?:\/\/[^\s]+)/g;
const inlineTokenPattern = /`([^`]+)`/g;

function TechnicalToken({ children, index }) {
  return (
    <span className={`inline-tech-token inline-tech-token-${index % 4}`}>
      {children}
    </span>
  );
}

function TokenizedText({ text }) {
  if (!text) return null;

  const nodes = [];
  let lastIndex = 0;
  let match;
  let tokenIndex = 0;

  inlineTokenPattern.lastIndex = 0;
  while ((match = inlineTokenPattern.exec(text)) !== null) {
    const [fullMatch, token] = match;
    if (match.index > lastIndex) {
      nodes.push(<span key={`plain-${lastIndex}`}>{text.slice(lastIndex, match.index)}</span>);
    }
    nodes.push(<TechnicalToken index={tokenIndex} key={`token-${match.index}`}>{token}</TechnicalToken>);
    tokenIndex += 1;
    lastIndex = match.index + fullMatch.length;
  }

  if (lastIndex < text.length) {
    nodes.push(<span key={`plain-${lastIndex}`}>{text.slice(lastIndex)}</span>);
  }

  return nodes;
}

function AutoLinkedText({ text }) {
  if (!text) return null;
  const parts = text.split(urlPattern);
  return parts.map((part, index) => {
    if (!part.match(urlPattern)) return <TokenizedText key={`${part}-${index}`} text={part} />;
    return <a href={part} key={`${part}-${index}`} rel="noreferrer" target="_blank">{part}</a>;
  });
}

export default function InlineTechnicalText({ text }) {
  if (typeof text !== 'string') return null;

  const nodes = [];
  let lastIndex = 0;
  let match;

  markdownLinkPattern.lastIndex = 0;
  while ((match = markdownLinkPattern.exec(text)) !== null) {
    const [fullMatch, label, href] = match;
    if (match.index > lastIndex) {
      nodes.push(<AutoLinkedText key={`text-${lastIndex}`} text={text.slice(lastIndex, match.index)} />);
    }
    nodes.push(<a href={href} key={`link-${match.index}`} rel="noreferrer" target="_blank">{label}</a>);
    lastIndex = match.index + fullMatch.length;
  }

  if (lastIndex < text.length) {
    nodes.push(<AutoLinkedText key={`text-${lastIndex}`} text={text.slice(lastIndex)} />);
  }

  return nodes;
}
