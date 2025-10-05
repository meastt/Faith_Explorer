// Simple markdown-like formatter for AI responses
export function formatAIResponse(text: string): string {
  if (!text) return text;

  let formatted = text;

  // Convert ### headers to h3
  formatted = formatted.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>');

  // Convert ## headers to h2
  formatted = formatted.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-5 mb-3">$1</h2>');

  // Convert # headers to h1
  formatted = formatted.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>');

  // Convert **bold** to HTML
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Convert *italic* to HTML (but not asterisks that are already part of bold)
  formatted = formatted.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');

  // Convert line breaks to paragraphs
  // Split by double newlines (paragraph breaks)
  const paragraphs = formatted.split('\n\n');

  // Wrap each paragraph
  formatted = paragraphs
    .map(para => {
      para = para.trim();
      if (!para) return '';

      // Skip if already wrapped in heading tag
      if (para.startsWith('<h')) {
        return para;
      }

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
