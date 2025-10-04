export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(timestamp);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function shareVerse(reference: string, text: string, notes?: string): string {
  const shareText = `${reference}\n\n"${text}"${notes ? `\n\nNotes: ${notes}` : ''}`;
  return shareText;
}

export function getReligionColor(religion: string): string {
  const colors: Record<string, string> = {
    christianity: '#DC2626',
    islam: '#059669',
    judaism: '#2563EB',
    hinduism: '#D97706',
    buddhism: '#7C3AED',
    sikhism: '#EA580C',
    taoism: '#0891B2',
    confucianism: '#BE123C',
    shinto: '#DB2777',
  };
  return colors[religion] || '#6B7280';
}
