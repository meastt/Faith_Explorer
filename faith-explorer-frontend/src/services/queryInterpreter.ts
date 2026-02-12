/**
 * AI Query Interpreter for Faith Explorer
 * 
 * Converts natural language queries into search keywords.
 * Uses Gemini (cost-efficient) with Claude fallback.
 * 
 * Example:
 *   Input:  "What is the meaning of life?"
 *   Output: ["purpose", "created", "existence", "reason", "soul", "why", "made"]
 */

import { interpretSearchIntentGemini } from './gemini';
import { callClaude } from './anthropic';

/**
 * Interpret user's search intent and extract relevant keywords
 * Uses Gemini for cost efficiency (~97% cheaper than Claude)
 * Falls back to Claude if Gemini is unavailable
 */
export async function interpretSearchIntent(query: string): Promise<string[]> {
    // Try Gemini first (much cheaper for simple tasks)
    try {
        const geminiKeywords = await interpretSearchIntentGemini(query);
        if (geminiKeywords.length > 0) {
            console.log('Used Gemini for search interpretation (cost: ~$0.00004)');
            return geminiKeywords;
        }
    } catch (error) {
        console.log('Gemini unavailable, falling back to Claude');
    }

    // Fallback to Claude if Gemini fails
    const systemPrompt = `You are a search query interpreter for a religious scripture database.
Your ONLY job is to convert a user's natural language question into relevant search keywords.

STRICT RULES:
1. Output ONLY a JSON array of lowercase keywords
2. NEVER quote, reference, or mention any scripture
3. NEVER answer the user's question
4. NEVER add theological interpretation or opinion
5. Just identify the TOPICS and CONCEPTS being asked about
6. Return 5-10 relevant terms maximum
7. Include synonyms and related concepts that would appear in religious texts

EXAMPLES:
User: "What happens when we die?"
Output: ["death", "afterlife", "soul", "heaven", "resurrection", "judgment", "eternal", "spirit"]

User: "What is the meaning of life?"  
Output: ["purpose", "created", "existence", "reason", "soul", "why", "made", "creation"]

Output ONLY the JSON array, nothing else.`;

    try {
        const response = await callClaude(
            [{ role: 'user', content: `User query: "${query}"` }],
            systemPrompt,
            200
        );

        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            const keywords = JSON.parse(jsonMatch[0]);
            if (Array.isArray(keywords) && keywords.length > 0) {
                const cleanKeywords = keywords
                    .filter((k): k is string => typeof k === 'string')
                    .map(k => k.toLowerCase().trim())
                    .filter(k => k.length > 2);

                console.log('Used Claude fallback for search interpretation');
                return cleanKeywords;
            }
        }

        return [];
    } catch (error) {
        console.error('Query interpretation failed:', error);
        return [];
    }
}


/**
 * Check if a query would benefit from semantic interpretation
 * Some queries are already specific enough (e.g., "John 3:16")
 */
export function shouldUseSemanticSearch(query: string): boolean {
    // Skip for verse references (e.g., "John 3:16", "Genesis 1:1")
    const verseRefPattern = /^[A-Za-z]+\s+\d+:\d+/;
    if (verseRefPattern.test(query.trim())) {
        return false;
    }

    // Skip for very short queries (likely specific keywords already)
    if (query.trim().split(/\s+/).length <= 2) {
        return false;
    }

    // Use semantic search for longer, natural language queries
    return true;
}
