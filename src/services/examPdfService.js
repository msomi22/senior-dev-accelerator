function ascii(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/[^\x20-\x7E]/g, '')
    .trim();
}

function escapePdfText(value) {
  return ascii(value)
    .replaceAll('\\', '\\\\')
    .replaceAll('(', '\\(')
    .replaceAll(')', '\\)');
}

function formatCompletedAt(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? ascii(value) : date.toLocaleString();
}

function optionLetter(index) {
  return String.fromCharCode(65 + index);
}

function answerStatus(answer = {}) {
  if (answer.timedOut || answer.selectedAnswerIndex === null) return 'Unanswered';
  return answer.isCorrect ? 'Correct' : 'Incorrect';
}

function wrapLine(value, maxLength = 82) {
  const text = ascii(value);
  if (text.length <= maxLength) return [text];

  const lines = [];
  let current = '';

  for (const word of text.split(/\s+/)) {
    if (!current) {
      current = word;
      continue;
    }

    if (`${current} ${word}`.length > maxLength) {
      lines.push(current);
      current = word;
      continue;
    }

    current = `${current} ${word}`;
  }

  if (current) lines.push(current);
  return lines;
}

function pushWrapped(lines, text, options = {}) {
  const { maxLength = 82, ...lineOptions } = options;
  for (const line of wrapLine(text, maxLength)) {
    lines.push({ text: line, ...lineOptions });
  }
}

function reportLines(attempt, context = {}) {
  const lines = [
    { text: context.platformName || 'Qubitel Academy Platform', size: 18, font: 'bold', color: 'green' },
    { text: context.productName || 'CBC Exam Practice', size: 13, color: 'muted' },
    { text: '' },
    { text: `${attempt.examTitle} Result`, size: 16, font: 'bold' },
    { text: `Academy: ${context.academyName || 'CBC Academy'}` },
    { text: `Category: ${context.categoryName || 'Grade 3'}` },
    { text: `Topic: ${context.topicName || 'English'}` },
    { text: `Lesson / skill: ${context.skillName || 'Spelling'}` },
    { text: `Attempt: ${attempt.attemptNumber}` },
    { text: `Learner: ${context.learnerName || 'Learner'}` },
    { text: `Completed: ${formatCompletedAt(attempt.completedAt)}` },
    { text: `Status: ${attempt.status}`, font: 'bold' },
    { text: '' },
    { text: `Score: ${attempt.correctCount} / ${attempt.totalQuestions}`, size: 15, font: 'bold', color: 'green' },
    { text: `Percentage: ${attempt.percentage}%`, size: 15, font: 'bold', color: 'green' },
    { text: `Incorrect answers: ${attempt.incorrectCount}` },
    { text: `Unanswered or timed out: ${attempt.unansweredCount}` },
    { text: '' },
    { text: 'Answer Details', size: 15, font: 'bold' }
  ];

  const answers = Object.values(attempt.answers || {});

  answers.forEach((answer, index) => {
    lines.push({ text: '' });
    lines.push({ text: `Question ${index + 1}: ${answerStatus(answer)}`, font: 'bold', color: answer.isCorrect ? 'green' : 'red' });
    pushWrapped(lines, answer.question || answer.title || 'Choose the correctly spelt word.', { maxLength: 78 });

    (answer.options || []).forEach((option, optionIndex) => {
      const markers = [];
      if (optionIndex === answer.selectedAnswerIndex) markers.push('Your answer');
      if (optionIndex === answer.correctAnswerIndex) markers.push('Correct');
      const markerText = markers.length ? ` (${markers.join(', ')})` : '';
      pushWrapped(lines, `${optionLetter(optionIndex)}. ${option}${markerText}`, { maxLength: 76 });
    });

    lines.push({ text: `Selected answer: ${answer.selectedAnswer || 'No answer'}` });
    lines.push({ text: `Correct answer: ${answer.correctAnswer || 'Not available'}` });
    if (answer.explanation) pushWrapped(lines, `Explanation: ${answer.explanation}`, { maxLength: 78, color: 'muted' });
  });

  return lines;
}

function commandForLine(line, y) {
  const font = line.font === 'bold' ? '/F2' : '/F1';
  const size = line.size || 11;
  const color = line.color === 'green'
    ? '0.12 0.49 0.34 rg'
    : line.color === 'red'
      ? '0.73 0.11 0.11 rg'
      : line.color === 'muted'
        ? '0.33 0.36 0.42 rg'
        : '0.05 0.08 0.13 rg';

  return `${color}\nBT\n${font} ${size} Tf\n50 ${y} Td\n(${escapePdfText(line.text)}) Tj\nET`;
}

function paginate(lines) {
  const pages = [];
  let current = [];
  let y = 760;

  for (const line of lines) {
    const lineHeight = line.text ? Math.max(15, (line.size || 11) + 5) : 10;
    if (y - lineHeight < 48) {
      pages.push(current);
      current = [];
      y = 760;
    }

    if (line.text) current.push(commandForLine(line, y));
    y -= lineHeight;
  }

  if (current.length) pages.push(current);
  return pages;
}

export function createExamResultPdf(attempt, context = {}) {
  const pages = paginate(reportLines(attempt, context));
  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj',
    `2 0 obj\n<< /Type /Pages /Kids [${pages.map((_, index) => `${3 + index * 2} 0 R`).join(' ')}] /Count ${pages.length} >>\nendobj`
  ];

  pages.forEach((commands, index) => {
    const pageObjectId = 3 + index * 2;
    const contentObjectId = pageObjectId + 1;
    const stream = commands.join('\n');

    objects.push(`${pageObjectId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${3 + pages.length * 2} 0 R /F2 ${4 + pages.length * 2} 0 R >> >> /Contents ${contentObjectId} 0 R >>\nendobj`);
    objects.push(`${contentObjectId} 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj`);
  });

  objects.push(`${3 + pages.length * 2} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>\nendobj`);
  objects.push(`${4 + pages.length * 2} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>\nendobj`);

  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  for (const object of objects) {
    offsets.push(pdf.length);
    pdf += `${object}\n`;
  }

  const xrefOffset = pdf.length;
  const xrefRows = offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(10, '0')} 00000 n `)
    .join('\n');

  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${xrefRows}\n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefOffset}\n%%EOF`;

  return pdf;
}

export function downloadExamResultPdf(attempt, context = {}) {
  const pdf = createExamResultPdf(attempt, context);
  const blob = new Blob([pdf], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `${attempt.examId}-attempt-${attempt.attemptNumber}.pdf`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
