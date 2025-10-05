// Simple markdown-like formatter for AI responses
export function formatAIResponse(text: string): string {
  if (!text) return text;

  let formatted = text;

  // Convert **bold** to HTML
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Convert *italic* to HTML
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Convert line breaks to paragraphs
  // Split by double newlines (paragraph breaks)
  const paragraphs = formatted.split('\n\n');

  // Wrap each paragraph
  formatted = paragraphs
    .map(para => {
      para = para.trim();
      if (!para) return '';

      // Check if it starts with a number and period (numbered list)
      if (/^\d+\./.test(para)) {
        return `<li class="ml-4">${para.replace(/^\d+\.\s*/, '')}</li>`;
      }

      // Check if it starts with a dash or bullet (bullet list)
      if (/^[-•]\s/.test(para)) {
        return `<li class="ml-4">${para.replace(/^[-•]\s*/, '')}</li>`;
      }

      return `<p class="mb-3">${para}</p>`;
    })
    .join('');

  return formatted;
}
