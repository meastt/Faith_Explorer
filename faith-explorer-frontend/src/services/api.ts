import type { Religion, Verse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface AskResponse {
  answer: string;
  sources: Verse[];
  error?: string;
}

export async function searchReligion(
  religion: Religion,
  question: string
): Promise<AskResponse> {
  const response = await fetch(`${API_BASE_URL}/api/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ religion, question }),
  });

  if (!response.ok) {
    throw new Error('Failed to search scriptures');
  }

  return response.json();
}

export async function chatAboutVerse(
  religion: Religion,
  verseReference: string,
  verseText: string,
  userQuestion: string,
  _conversationHistory: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<string> {
  // For now, we'll use the existing /api/ask endpoint
  // In the future, you might want a dedicated chat endpoint with conversation history
  const contextPrompt = `I'm reading ${verseReference}: "${verseText}". ${userQuestion}`;

  const response = await searchReligion(religion, contextPrompt);
  return response.answer;
}

export async function searchMultipleReligions(
  religions: Religion[],
  question: string
): Promise<{ religion: Religion; result: AskResponse }[]> {
  const promises = religions.map(async (religion) => {
    const result = await searchReligion(religion, question);
    return { religion, result };
  });

  return Promise.all(promises);
}

export async function getComparativeAnalysis(
  religions: Religion[],
  question: string,
  results: { religion: Religion; answer: string }[]
): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/compare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ religions, question, results }),
  });

  if (!response.ok) {
    throw new Error('Failed to get comparative analysis');
  }

  const data = await response.json();
  return data.comparison;
}
