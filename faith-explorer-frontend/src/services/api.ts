import type { Religion, Verse, SelectedSubset } from '../types';
import { searchScriptures } from './search';
import {
  generateScriptureAnswer,
  chatAboutVerseAI,
  generateComparison,
  generateCommonGround,
  simulateDialogueAI,
  secularizeTextAI,
  type Persona,
  type DialogueResponse
} from './openrouter';
import { useStore } from '../store/useStore';

// Re-export types for backward compatibility
export type { Persona, DialogueResponse };

export interface AskResponse {
  answer: string;
  sources: Verse[];
  error?: string;
}

/**
 * Search scriptures and get AI-powered answer
 * Now calls Minimax via OpenRouter directly from the frontend
 */
export async function searchSubsets(
  selectedSubsets: SelectedSubset[],
  question: string,
  _isPremium: boolean = false
): Promise<AskResponse> {
  const language = useStore.getState().language;

  if (selectedSubsets.length === 0) {
    return {
      answer: language === 'es'
        ? 'Por favor selecciona al menos un texto religioso para buscar.'
        : 'Please select at least one religious text to search.',
      sources: []
    };
  }

  try {
    // 1. Perform local scripture search
    const localVerses = await searchScriptures(selectedSubsets, question);

    if (localVerses.length === 0) {
      return {
        answer: language === 'es'
          ? `No pude encontrar versículos específicos sobre "${question}" en los textos seleccionados. Intenta reformular tu pregunta o seleccionar diferentes textos religiosos.`
          : `I couldn't find specific verses about "${question}" in the selected texts. Try rephrasing your question or selecting different religious texts.`,
        sources: []
      };
    }

    // 2. Get AI-generated answer based on found verses
    const religion = selectedSubsets[0].religion;
    const versesForAI = localVerses.map(v => ({
      reference: v.reference,
      text: v.text
    }));

    const answer = await generateScriptureAnswer(religion, question, versesForAI, language);

    return {
      answer,
      sources: localVerses
    };
  } catch (error) {
    console.error('Search error:', error);

    // If AI fails, still return verses with a simple answer
    try {
      const localVerses = await searchScriptures(selectedSubsets, question);
      if (localVerses.length > 0) {
        const topVerses = localVerses.slice(0, 5);
        const prefix = language === 'es'
          ? `Se encontraron ${localVerses.length} versículo${localVerses.length > 1 ? 's' : ''} relevante${localVerses.length > 1 ? 's' : ''}:`
          : `Here are ${localVerses.length} relevant verse${localVerses.length > 1 ? 's' : ''} found:`;
        const answer = `${prefix}\n\n${topVerses.map((v, i) => `${i + 1}. ${v.reference}: "${v.text.substring(0, 100)}${v.text.length > 100 ? '...' : ''}"`).join('\n\n')}`;
        return { answer, sources: localVerses };
      }
    } catch (searchError) {
      console.error('Even local search failed:', searchError);
    }

    throw new Error(language === 'es'
      ? 'La búsqueda falló. Por favor verifica tu conexión e intenta de nuevo.'
      : 'Search failed. Please check your connection and try again.');
  }
}

/**
 * Legacy function for backward compatibility
 */
export async function searchReligion(
  religion: Religion,
  question: string,
  isPremium: boolean = false
): Promise<AskResponse> {
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

  return searchSubsets([defaultSubsets[religion]], question, isPremium);
}

/**
 * Chat about a specific verse
 */
export async function chatAboutVerse(
  religion: Religion,
  verseReference: string,
  verseText: string,
  userQuestion: string,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<string> {
  const language = useStore.getState().language;
  try {
    return await chatAboutVerseAI(
      religion,
      verseReference,
      verseText,
      userQuestion,
      conversationHistory,
      language
    );
  } catch (error) {
    console.error('Chat error:', error);
    throw error;
  }
}

/**
 * Get comparative analysis across religions
 */
export async function getComparativeAnalysis(
  religions: Religion[],
  question: string,
  results: { religion: Religion; answer: string }[]
): Promise<string> {
  const language = useStore.getState().language;
  try {
    return await generateComparison(religions, question, results, language);
  } catch (error) {
    console.error('Comparison error:', error);
    throw error;
  }
}

/**
 * Common Ground Visualizer
 */
export interface CommonGroundData {
  common: string[];
  distinctA: string[];
  distinctB: string[];
  summary: string;
}

export async function getCommonGround(
  religions: string[],
  question: string,
  results: { religion: Religion; answer: string }[]
): Promise<CommonGroundData> {
  try {
    return await generateCommonGround(religions, question, results);
  } catch (error) {
    console.error('Common ground error:', error);
    throw error;
  }
}

/**
 * Dialogue Simulator - chat with religious personas
 */
export async function simulateDialogue(
  persona: Persona,
  scenario: string,
  userMessage: string,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[]
): Promise<DialogueResponse> {
  const language = useStore.getState().language;
  try {
    return await simulateDialogueAI(persona, scenario, userMessage, conversationHistory, language);
  } catch (error) {
    console.error('Dialogue error:', error);
    throw error;
  }
}

/**
 * Secularize religious text
 */
export async function secularizeText(text: string, context?: string): Promise<string> {
  const language = useStore.getState().language;
  try {
    return await secularizeTextAI(text, context, language);
  } catch (error) {
    console.error('Secularization error:', error);
    throw error;
  }
}