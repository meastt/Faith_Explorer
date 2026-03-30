/**
 * Google Gemini API client for Faith Explorer
 * Used for cost-efficient operations: search keywords, JSON generation, simple tasks
 * 
 * Model: Gemini 3.1 Flash-Lite ($0.25/MTok input, $1.50/MTok output)
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-3.1-flash-lite-preview';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

interface GeminiResponse {
    candidates: {
        content: {
            parts: { text: string }[];
        };
    }[];
}


/**
 * Call Gemini API directly
 */
export async function callGemini(
    prompt: string,
    systemInstruction?: string,
    maxTokens: number = 500
): Promise<string> {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
        console.warn('Gemini API key not configured, falling back to Claude');
        throw new Error('Gemini API key not configured');
    }

    const url = `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const requestBody: Record<string, unknown> = {
        contents: [
            {
                role: 'user',
                parts: [{ text: prompt }]
            }
        ],
        generationConfig: {
            maxOutputTokens: maxTokens,
            temperature: 0.7,
        }
    };

    if (systemInstruction) {
        requestBody.systemInstruction = {
            parts: [{ text: systemInstruction }]
        };
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API error:', response.status, errorText);
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data: GeminiResponse = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (error) {
        console.error('Error calling Gemini:', error);
        throw error;
    }
}

/**
 * Interpret user's search intent and extract relevant keywords
 * Uses Gemini for cost efficiency - simple keyword extraction task
 */
export async function interpretSearchIntentGemini(query: string): Promise<string[]> {
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
        const response = await callGemini(
            `User query: "${query}"`,
            systemPrompt,
            200
        );

        // Parse the JSON array from response
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            const keywords = JSON.parse(jsonMatch[0]);
            if (Array.isArray(keywords) && keywords.length > 0) {
                const cleanKeywords = keywords
                    .filter((k): k is string => typeof k === 'string')
                    .map(k => k.toLowerCase().trim())
                    .filter(k => k.length > 2);

                console.log('Gemini-interpreted keywords:', cleanKeywords);
                return cleanKeywords;
            }
        }

        return [];
    } catch (error) {
        console.error('Gemini query interpretation failed:', error);
        return [];
    }
}

/**
 * Generate common ground visualization data (JSON output)
 * Uses Gemini for cost efficiency - structured JSON output task
 */
export async function generateCommonGroundGemini(
    religions: string[],
    question: string,
    results: { religion: string; answer: string }[]
): Promise<{
    common: string[];
    distinctA: string[];
    distinctB: string[];
    summary: string;
}> {
    const contextParts = results.map(r =>
        `**${r.religion.toUpperCase()}**:\n${r.answer}\n`
    ).join('\n');

    const systemPrompt = `You are an expert in interfaith dialogue. Analyze these two religious perspectives on "${question}".

Produce a JSON object representing a Venn Diagram of their values/concepts.
The output MUST be valid JSON with this exact structure:
{
  "common": ["Shared value 1", "Shared concept 2", "Shared belief 3"],
  "distinctA": ["Unique to ${religions[0]} 1", "Unique to ${religions[0]} 2"],
  "distinctB": ["Unique to ${religions[1]} 1", "Unique to ${religions[1]} 2"],
  "summary": "One sentence summarizing the core overlap."
}

- Keep points short (2-5 words).
- "Common" items should be concepts both explicitly agree on.
- "Distinct" items should be nuanced differences.
- Return ONLY JSON.`;

    try {
        const responseText = await callGemini(contextParts, systemPrompt, 1000);

        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.common && Array.isArray(parsed.common)) {
                return parsed;
            }
        }
    } catch (e) {
        console.error('Gemini common ground generation failed:', e);
    }

    // Fallback
    return {
        common: ['Shared Values'],
        distinctA: ['Tradition A'],
        distinctB: ['Tradition B'],
        summary: 'Shared values exist but could not be visualized.'
    };
}

/**
 * Secularize religious text (simple text transformation)
 * Uses Gemini for cost efficiency
 */
export async function secularizeTextGemini(text: string, context?: string): Promise<string> {
    const systemPrompt = `You are a philosopher and psychologist translating religious texts for a "Spiritual but not Religious" audience.

Task: Rewrite the following text to strip away religious dogma, theological nouns, and archaic language.
Replace them with universal, philosophical, psychological, or humanist concepts.

Rules:
1. Keep the core wisdom/ethical meaning intact.
2. Use modern, accessible language (like Stoicism or CBT).
3. Example: "Sin" -> "Error/Misalignment", "God" -> "The Universe/conscience/Higher Truth".
4. Return ONLY the translated text, nothing else.

Context: ${context || 'General Wisdom'}`;

    try {
        return await callGemini(`Text: "${text}"`, systemPrompt, 500);
    } catch (error) {
        console.error('Gemini secularization failed:', error);
        throw error;
    }
}
