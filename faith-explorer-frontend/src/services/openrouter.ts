/**
 * OpenRouter API client for Faith Explorer
 * Primarily used for high-performance AI access via OpenRouter
 * 
 * Model: minimax/minimax-m2.7
 */

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const MODEL = 'minimax/minimax-m2.7';

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

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

/**
 * Call OpenRouter API
 */
export async function callOpenRouter(
    messages: Message[],
    systemPrompt?: string,
    maxTokens: number = 1000
): Promise<string> {
    if (!OPENROUTER_API_KEY) {
        throw new Error('OpenRouter API key not configured. Please set VITE_OPENROUTER_API_KEY in your .env file.');
    }

    const fullMessages = systemPrompt 
        ? [{ role: 'system', content: systemPrompt }, ...messages]
        : messages;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': 'https://faithexplorer.app',
                'X-Title': 'Faith Explorer'
            },
            body: JSON.stringify({
                model: MODEL,
                messages: fullMessages,
                max_tokens: maxTokens,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('OpenRouter API error:', response.status, errorText);
            throw new Error(`OpenRouter API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || '';
    } catch (error) {
        console.error('Error calling OpenRouter:', error);
        throw error;
    }
}

/**
 * Generate AI answer based on scripture verses
 */
export async function generateScriptureAnswer(
    religion: string,
    question: string,
    verses: { reference: string; text: string }[],
    language: 'en' | 'es' = 'en'
): Promise<string> {
    if (verses.length === 0) {
        return language === 'es'
            ? `No pude encontrar versículos específicos sobre "${question}".`
            : `I couldn't find specific verses about "${question}".`;
    }

    const scriptureContext = verses
        .slice(0, 10)
        .map(v => `[${v.reference}] "${v.text}"`)
        .join('\n\n');

    const neutralityRules = language === 'es'
        ? `REGLAS DE NEUTRALIDAD: Presenta información académicamente, reconoce múltiples interpretaciones, evita juicios de valor, usa lenguaje objetivo. Cita siempre.`
        : `NEUTRALITY RULES: Present information academically, acknowledge multiple interpretations, avoid value judgments, use objective language. Always cite.`;

    const systemPrompt = language === 'es'
        ? `Eres un erudito neutral en estudios religiosos. Tu rol es EXPLICAR y ACLARAR las escrituras de ${religion}. ${neutralityRules} Responde en español.`
        : `You are a neutral religious studies scholar. Your role is to EXPLAIN and CLARIFY ${religion} scripture. ${neutralityRules}`;

    const userMessage = `User asked: "${question}"\n\nScripture Context:\n${scriptureContext}`;

    return callOpenRouter([{ role: 'user', content: userMessage }], systemPrompt);
}

/**
 * Chat about a specific verse
 */
export async function chatAboutVerseAI(
    religion: string,
    verseReference: string,
    verseText: string,
    userQuestion: string,
    conversationHistory: Message[] = [],
    language: 'en' | 'es' = 'en'
): Promise<string> {
    const neutralityRules = language === 'es'
        ? `REGLAS DE NEUTRALIDAD: Presenta información académicamente, reconoce múltiples interpretaciones, evita juicios de valor.`
        : `NEUTRALITY RULES: Present information academically, acknowledge multiple interpretations, avoid value judgments.`;

    const systemPrompt = language === 'es'
        ? `Eres un erudito neutral especializado en ${religion}. Ayuda a entender: [${verseReference}] "${verseText}". ${neutralityRules} Responde en español.`
        : `You are a neutral scholar specialized in ${religion}. Help understand: [${verseReference}] "${verseText}". ${neutralityRules}`;

    const messages: Message[] = [
        ...conversationHistory,
        { role: 'user', content: userQuestion }
    ];

    return callOpenRouter(messages, systemPrompt, 800);
}

/**
 * Generate comparative analysis
 */
export async function generateComparison(
    _religions: string[],
    question: string,
    results: { religion: string; answer: string }[],
    language: 'en' | 'es' = 'en'
): Promise<string> {
    const contextParts = results.map(r => `**${r.religion.toUpperCase()}**:\n${r.answer}`).join('\n\n');

    const systemPrompt = language === 'es'
        ? `Eres un erudito neutral en religión comparada. Compara objetivamente estas perspectivas sobre "${question}" sin juzgarlas. Máximo 300 palabras. Responde en español.`
        : `You are a neutral comparative religion scholar. Objectively compare these perspectives on "${question}" without judgment. Max 300 words.`;

    return callOpenRouter([{ role: 'user', content: contextParts }], systemPrompt, 1500);
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
    const contextParts = results.map(r => `**${r.religion.toUpperCase()}**:\n${r.answer}`).join('\n\n');

    const systemPrompt = `Analyze these perspectives on "${question}". Produce ONLY a JSON object:
    {
      "common": ["Shared value 1", "Shared concept 2"],
      "distinctA": ["Unique to ${religions[0]} 1"],
      "distinctB": ["Unique to ${religions[1]} 1"],
      "summary": "One sentence summary."
    }
    Keep points short (2-5 words).`;

    const responseText = await callOpenRouter([{ role: 'user', content: contextParts }], systemPrompt, 1000);

    try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch (e) {
        console.error('JSON parse error:', e);
    }

    return { common: [], distinctA: [], distinctB: [], summary: 'Shared values found.' };
}

/**
 * Simulate dialogue with a religious persona
 */
export async function simulateDialogueAI(
    persona: Persona,
    scenario: string,
    userMessage: string,
    conversationHistory: Message[] = [],
    language: 'en' | 'es' = 'en'
): Promise<DialogueResponse> {
    const systemPrompt = language === 'es'
        ? `Eres ${persona.name}, un líder de ${persona.faith}. Personalidad: ${persona.traits}. Escenario actual: ${scenario}. Sé cálido y educativo. Responde en español.`
        : `You are ${persona.name}, a leader of ${persona.faith}. Personality: ${persona.traits}. Current scenario: ${scenario}. Be warm and educational.`;

    const messages: Message[] = [
        ...conversationHistory,
        { role: 'user', content: userMessage }
    ];

    const reply = await callOpenRouter(messages, systemPrompt, 800);

    return { reply, feedback: '', score: 0 };
}

/**
 * Secularize religious text
 */
export async function secularizeTextAI(text: string, context?: string, language: 'en' | 'es' = 'en'): Promise<string> {
    const systemPrompt = language === 'es'
        ? `Eres un filósofo que traduce textos religiosos para una audiencia secular. Reescribe el texto eliminando el dogma pero manteniendo la sabiduría ética. Responde en español.`
        : `You are a philosopher translating religious texts for a secular audience. Rewrite the text stripping away dogma while keeping the ethical wisdom.`;

    const userMessage = `Context: ${context || 'General Wisdom'}\nText: "${text}"`;

    return callOpenRouter([{ role: 'user', content: userMessage }], systemPrompt, 500);
}
