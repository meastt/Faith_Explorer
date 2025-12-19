/**
 * Direct Anthropic API client for Faith Explorer
 * Calls Claude API directly from the frontend - no backend required
 */

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const MODEL = 'claude-sonnet-4-5-20250929';

interface ClaudeMessage {
    role: 'user' | 'assistant';
    content: string;
}

interface ClaudeResponse {
    content: { type: string; text: string }[];
}

/**
 * Call Claude API directly
 */
export async function callClaude(
    messages: ClaudeMessage[],
    systemPrompt?: string,
    maxTokens: number = 1000
): Promise<string> {
    if (!ANTHROPIC_API_KEY || ANTHROPIC_API_KEY === 'your_anthropic_api_key_here') {
        throw new Error('Anthropic API key not configured. Please set VITE_ANTHROPIC_API_KEY in your .env file.');
    }

    const requestBody: Record<string, unknown> = {
        model: MODEL,
        max_tokens: maxTokens,
        messages
    };

    if (systemPrompt) {
        requestBody.system = systemPrompt;
    }

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Claude API error:', response.status, errorText);
            throw new Error(`Claude API error: ${response.status}`);
        }

        const data: ClaudeResponse = await response.json();
        return data.content[0]?.text || '';
    } catch (error) {
        console.error('Error calling Claude:', error);
        throw error;
    }
}

/**
 * Generate AI answer based on scripture verses
 */
export async function generateScriptureAnswer(
    religion: string,
    question: string,
    verses: { reference: string; text: string }[]
): Promise<string> {
    if (verses.length === 0) {
        return `I couldn't find specific verses about "${question}" in the selected texts. Try rephrasing your question or selecting different religious texts.`;
    }

    const scriptureContext = verses
        .slice(0, 10) // Limit context size
        .map(v => `[${v.reference}] "${v.text}"`)
        .join('\n\n');

    const systemPrompt = `You are a knowledgeable guide on ${religion}. Answer the user's question ONLY based on the provided scripture passages.
- Always cite the reference (e.g. [John 3:16]).
- If the verses don't fully answer the question, admit it gently.
- Be concise and spiritual in tone.`;

    const userMessage = `Relevant passages:\n${scriptureContext}\n\nQuestion: "${question}"`;

    return callClaude([{ role: 'user', content: userMessage }], systemPrompt);
}

/**
 * Chat about a specific verse
 */
export async function chatAboutVerseAI(
    religion: string,
    verseReference: string,
    verseText: string,
    userQuestion: string,
    conversationHistory: ClaudeMessage[] = []
): Promise<string> {
    let systemPrompt: string;

    if (verseReference && verseText) {
        systemPrompt = `You are a guide on ${religion}. Focus your answer on this specific verse: [${verseReference}] "${verseText}". Explain its meaning, context, and application.`;
    } else {
        systemPrompt = `You are a knowledgeable guide on ${religion}. Answer the user's question based on the general teachings, scriptures, and traditions of ${religion}.`;
    }

    const messages: ClaudeMessage[] = [
        ...conversationHistory,
        { role: 'user', content: userQuestion }
    ];

    return callClaude(messages, systemPrompt, 800);
}

/**
 * Generate comparative analysis
 */
export async function generateComparison(
    _religions: string[],
    question: string,
    results: { religion: string; answer: string }[]
): Promise<string> {
    const contextParts = results.map(r =>
        `**${r.religion.toUpperCase()} PERSPECTIVE**:\n${r.answer}\n`
    ).join('\n');

    const systemPrompt = `You are a comparative religion scholar. Compare these perspectives on "${question}".

Analysis requirements:
1. Identify common themes.
2. Highlight distinct theological differences.
3. Be respectful and balanced.
4. Keep it under 300 words.`;

    return callClaude([{ role: 'user', content: contextParts }], systemPrompt, 1500);
}

/**
 * Generate common ground visualization data
 */
export async function generateCommonGround(
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

    const responseText = await callClaude([{ role: 'user', content: contextParts }], systemPrompt, 1500);

    try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.common && Array.isArray(parsed.common)) {
                return parsed;
            }
        }
    } catch (e) {
        console.error('JSON parse error:', e);
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
 * Simulate dialogue with a religious persona
 */
export interface Persona {
    id?: string;
    name: string;
    faith: string;
    traits: string;
    avatar?: string;
    color?: string;
}

export interface DialogueResponse {
    reply: string;
    feedback: string;
    score: number;
}

export async function simulateDialogueAI(
    persona: Persona,
    scenario: string,
    userMessage: string,
    conversationHistory: ClaudeMessage[] = []
): Promise<DialogueResponse> {
    const systemPrompt = `You are ${persona.name}, a respected ${persona.faith} religious leader and teacher.

**Context:**
You are having a conversation with someone who has approached you because they want to learn about ${persona.faith}. They may be curious about your faith tradition, seeking wisdom, or simply wanting to understand your beliefs and practices better. This is a welcoming, educational conversation.

**Your Character:**
- Name: ${persona.name}
- Faith: ${persona.faith}
- Personality: ${persona.traits}
- Current Topic: ${scenario}

**Guidelines:**
- Be warm, welcoming, and patient - this person genuinely wants to learn
- Share wisdom, teachings, and perspectives from your faith tradition authentically
- Use appropriate greetings and terminology from your tradition naturally
- Answer questions thoughtfully, providing context when helpful
- Keep responses conversational and engaging (2-4 paragraphs max)
- If you don't know something, it's okay to say so honestly`;

    const messages: ClaudeMessage[] = [
        ...conversationHistory,
        { role: 'user', content: userMessage }
    ];

    const responseText = await callClaude(messages, systemPrompt, 800);

    // Return just the reply, no scoring
    return {
        reply: responseText,
        feedback: '',
        score: 0
    };
}

/**
 * Secularize religious text
 */
export async function secularizeTextAI(text: string, context?: string): Promise<string> {
    const systemPrompt = `You are a philosopher and psychologist translating religious texts for a "Spiritual but not Religious" audience.

Task: Rewrite the following text to strip away religious dogma, theological nouns, and archaic language.
Replace them with universal, philosophical, psychological, or humanist concepts.

Rules:
1. Keep the core wisdom/ethical meaning intact.
2. Use modern, accessible language (like Stoicism or CBT).
3. Example: "Sin" -> "Error/Misalignment", "God" -> "The Universe/conscience/Higher Truth".
4. Return ONLY the translated text, nothing else.

Context: ${context || 'General Wisdom'}`;

    return callClaude([{ role: 'user', content: `Text: "${text}"` }], systemPrompt, 500);
}
