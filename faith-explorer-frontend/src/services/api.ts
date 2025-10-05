import Anthropic from '@anthropic-ai/sdk';
import type { Religion, Verse } from '../types';
import { searchScriptures } from './search';

export interface AskResponse {
  answer: string;
  sources: Verse[];
  error?: string;
}

const SYSTEM_PROMPTS: Record<Religion, string> = {
  christianity: 'You are a knowledgeable guide on Christianity. Answer ONLY based on the Bible passages provided below. Always cite the reference. Never make up verses.',
  islam: 'You are a knowledgeable guide on Islam. Answer ONLY based on the Quran and Hadith passages provided below. Always cite the reference. Never make up verses.',
  judaism: 'You are a knowledgeable guide on Judaism. Answer ONLY based on the Torah passages provided below. Always cite the reference. Never make up verses.',
  hinduism: 'You are a knowledgeable guide on Hinduism. Answer ONLY based on the Bhagavad Gita passages provided below. Always cite the reference. Never make up verses.',
  buddhism: 'You are a knowledgeable guide on Buddhism. Answer ONLY based on the Dhammapada passages provided below. Always cite the reference. Never make up verses.',
  sikhism: 'You are a knowledgeable guide on Sikhism. Answer ONLY based on the Guru Granth Sahib passages provided below. Always cite the reference. Never make up verses.',
  taoism: 'You are a knowledgeable guide on Taoism. Answer ONLY based on the Tao Te Ching passages provided below. Always cite the reference. Never make up verses.',
  confucianism: 'You are a knowledgeable guide on Confucianism. Answer ONLY based on the Analects passages provided below. Always cite the reference. Never make up verses.',
  shinto: 'You are a knowledgeable guide on Shinto. Answer ONLY based on the Kojiki passages provided below. Always cite the reference. Never make up verses.'
};

// Initialize Anthropic client
let anthropic: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
  if (!anthropic) {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_ANTHROPIC_API_KEY not configured');
    }
    anthropic = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true // Required for client-side usage
    });
  }
  return anthropic;
}

export async function searchReligion(
  religion: Religion,
  question: string
): Promise<AskResponse> {
  try {
    // Search for relevant scriptures
    const relevantVerses = await searchScriptures(religion, question, 15);

    if (relevantVerses.length === 0) {
      return {
        answer: `I couldn't find specific scripture passages related to "${question}" in ${religion}. Try rephrasing your question.`,
        sources: []
      };
    }

    // Build scripture context
    const scriptureContext = relevantVerses
      .map(v => `[${v.reference}] "${v.text}"`)
      .join('\n\n');

    // Get Claude's response
    const client = getAnthropicClient();
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `${SYSTEM_PROMPTS[religion]}

Relevant scripture passages:
${scriptureContext}

User Question: "${question}"

Provide a clear response based on these scriptures.`
      }]
    });

    const answer = message.content[0].type === 'text' ? message.content[0].text : '';

    return {
      answer,
      sources: relevantVerses
    };
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}

export async function chatAboutVerse(
  religion: Religion,
  verseReference: string,
  verseText: string,
  userQuestion: string,
  _conversationHistory: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<string> {
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
  _religions: Religion[],
  question: string,
  results: { religion: Religion; answer: string }[]
): Promise<string> {
  try {
    // Build context from all religions' answers
    const contextParts = results.map(r => {
      return `**${r.religion.toUpperCase()}**:\n${r.answer}\n`;
    }).join('\n');

    const client = getAnthropicClient();
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: `You are a comparative religion scholar. Based on the following perspectives from different religious traditions on the question "${question}", provide a thoughtful comparative analysis.

${contextParts}

Your analysis should:
1. Identify key similarities and common themes across traditions
2. Highlight meaningful differences in perspective or approach
3. Note any unique insights from specific traditions
4. Be respectful and balanced, avoiding judgment
5. Be concise (2-3 paragraphs maximum)

Provide your comparative analysis:`
      }]
    });

    const comparison = message.content[0].type === 'text' ? message.content[0].text : '';
    return comparison;
  } catch (error) {
    console.error('Comparison error:', error);
    throw error;
  }
}
