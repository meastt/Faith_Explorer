import type { Religion, Verse, SelectedSubset } from '../types';

// Get API URL from environment or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface AskResponse {
  answer: string;
  sources: Verse[];
  error?: string;
}

export async function searchSubsets(
  selectedSubsets: SelectedSubset[],
  question: string
): Promise<AskResponse> {
  try {
    if (selectedSubsets.length === 0) {
      return {
        answer: 'Please select at least one religious text to search.',
        sources: []
      };
    }

    // Get religion from first subset for backward compatibility
    const religion = selectedSubsets[0].religion;

    // Convert selectedSubsets to subset IDs for the backend
    const subsets = selectedSubsets.map(s => `${s.religion}-${s.subset}`);

    // Call backend API
    const response = await fetch(`${API_URL}/api/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        religion,
        question,
        subsets
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `API request failed: ${response.status}`);
    }

    const data = await response.json();

    return {
      answer: data.answer,
      sources: data.sources || [],
      error: data.error
    };
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}

// Legacy function for backward compatibility
export async function searchReligion(
  religion: Religion,
  question: string
): Promise<AskResponse> {
  // Map religion to a default subset for backward compatibility
  const defaultSubsets: Record<Religion, SelectedSubset> = {
    christianity: { religion: 'christianity', subset: 'kjv' },
    islam: { religion: 'islam', subset: 'quran-sahih' },
    judaism: { religion: 'judaism', subset: 'torah' },
    hinduism: { religion: 'hinduism', subset: 'bhagavad-gita' },
    buddhism: { religion: 'buddhism', subset: 'dhammapada' },
    sikhism: { religion: 'sikhism', subset: 'guru-granth-sahib' },
    taoism: { religion: 'taoism', subset: 'tao-te-ching' },
    confucianism: { religion: 'confucianism', subset: 'analects' },
    shinto: { religion: 'shinto', subset: 'kojiki' },
  };

  return searchSubsets([defaultSubsets[religion]], question);
}

export async function chatAboutVerse(
  religion: Religion,
  verseReference: string,
  verseText: string,
  userQuestion: string,
  _conversationHistory: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<string> {
  try {
    // Call backend API for chat
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        religion,
        verseReference,
        verseText,
        question: userQuestion,
        conversationHistory: _conversationHistory
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `Chat request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.answer;
  } catch (error) {
    console.error('Chat error:', error);
    throw error;
  }
}

export async function getComparativeAnalysis(
  religions: Religion[],
  question: string,
  results: { religion: Religion; answer: string }[]
): Promise<string> {
  try {
    // Call backend API for comparative analysis
    const response = await fetch(`${API_URL}/api/compare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        religions,
        question,
        results
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `Comparison request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.comparison;
  } catch (error) {
    console.error('Comparison error:', error);
    throw error;
  }
}