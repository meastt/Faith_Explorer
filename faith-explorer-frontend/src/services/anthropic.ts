/**
 * Direct Anthropic API client for Faith Explorer
 * Uses Claude Haiku 3.5 for cost-efficient complex theological responses
 * Claude Haiku: $0.80/MTok input, $4.00/MTok output (73% cheaper than Sonnet)
 */

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const MODEL = 'claude-3-5-haiku-20241022';


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
        const responseText = data.content[0]?.text || '';
        console.log(`Used Claude Haiku 3.5 (cost: ~$0.003) - response length: ${responseText.length} chars`);
        return responseText;
    } catch (error) {
        console.error('Error calling Claude:', error);
        throw error;
    }
}

/**
 * Generate AI answer based on scripture verses
 * NOTE: AI only EXPLAINS the pre-selected verses - it does NOT select them
 */
export async function generateScriptureAnswer(
    religion: string,
    question: string,
    verses: { reference: string; text: string }[],
    language: 'en' | 'es' = 'en'
): Promise<string> {
    if (verses.length === 0) {
        return language === 'es'
            ? `No pude encontrar versículos específicos sobre "${question}" en los textos seleccionados. Intenta reformular tu pregunta o seleccionar diferentes textos religiosos.`
            : `I couldn't find specific verses about "${question}" in the selected texts. Try rephrasing your question or selecting different religious texts.`;
    }

    const scriptureContext = verses
        .slice(0, 10) // Limit context size
        .map(v => `[${v.reference}] "${v.text}"`)
        .join('\n\n');

    const neutralityRulesEn = `NEUTRALITY RULES:
- Present information academically, like a professor teaching comparative religion
- Never suggest one interpretation is "correct" or "better" than another
- Acknowledge that scholars and adherents may interpret texts differently
- Use phrases like "this text suggests..." or "scholars interpret this as..." rather than definitive claims
- Never use emotionally loaded language that favors or disparages any tradition
- If asked for your opinion, redirect to presenting various scholarly interpretations
- Present context and historical background objectively
- Always cite the verse reference (e.g. [John 3:16]) when discussing specific passages`;

    const neutralityRulesEs = `REGLAS DE NEUTRALIDAD:
- Presenta la información académicamente, como un profesor de religión comparada
- Nunca sugieras que una interpretación es "correcta" o "mejor" que otra
- Reconoce que los eruditos y creyentes pueden interpretar los textos de manera diferente
- Usa frases como "este texto sugiere..." o "los eruditos interpretan esto como..." en lugar de afirmaciones definitivas
- Nunca uses lenguaje emocionalmente cargado que favorezca o menosprecie alguna tradición
- Si te piden tu opinión, redirige a presentar varias interpretaciones académicas
- Presenta el contexto y los antecedentes históricos de manera objetiva
- Siempre cita la referencia del versículo (ej. [Juan 3:16]) al discutir pasajes específicos`;

    const systemPrompt = language === 'es'
        ? `Eres un erudito neutral en estudios religiosos. Tu rol es EXPLICAR y ACLARAR las escrituras, no abogar ni persuadir.

${neutralityRulesEs}

Estás ayudando a alguien a entender las escrituras de ${religion}. Explica claramente sin influir en su conclusión. Responde siempre en español.`
        : `You are a neutral religious studies scholar. Your role is to EXPLAIN and CLARIFY scripture, not to advocate or persuade.

${neutralityRulesEn}

You are helping someone understand ${religion} scripture. Explain clearly without steering their conclusion.`;

    const userMessage = language === 'es'
        ? `El usuario preguntó: "${question}"

Estos son los pasajes de las escrituras encontrados en los textos de ${religion}:
${scriptureContext}

Por favor explica cómo estos pasajes se relacionan con la pregunta del usuario. Sé objetivo y académico. Responde en español.`
        : `The user asked: "${question}"

Here are the relevant scripture passages found in ${religion} texts:
${scriptureContext}

Please explain how these passages relate to the user's question. Be objective and academic.`;

    return callClaude([{ role: 'user', content: userMessage }], systemPrompt);
}

/**
 * Chat about a specific verse
 * NOTE: AI explains the verse the user selected - academic and neutral
 */
export async function chatAboutVerseAI(
    religion: string,
    verseReference: string,
    verseText: string,
    userQuestion: string,
    conversationHistory: ClaudeMessage[] = [],
    language: 'en' | 'es' = 'en'
): Promise<string> {
    const langInstruction = language === 'es' ? '\n\nResponde siempre en español.' : '';

    const neutralityRules = language === 'es'
        ? `REGLAS DE NEUTRALIDAD:
- Presenta la información como un profesor universitario de estudios religiosos
- Reconoce que existen múltiples interpretaciones al discutir el significado
- Usa frases como "los eruditos interpretan esto como..." o "dentro de esta tradición, esto se entiende como..."
- Nunca sugieras que una interpretación es definitivamente correcta
- Si la doctrina difiere entre denominaciones/escuelas, menciona esta diversidad
- Proporciona contexto histórico y cultural de manera objetiva
- Nunca abogues a favor o en contra de ninguna posición religiosa`
        : `NEUTRALITY RULES:
- Present information like a university professor of religious studies
- Acknowledge multiple interpretations exist when discussing meaning
- Use phrases like "scholars interpret this as..." or "within this tradition, this is understood as..."
- Never suggest one interpretation is definitively correct
- If doctrine differs between denominations/schools, mention this diversity
- Provide historical and cultural context objectively
- Never advocate for or against any religious position`;

    let systemPrompt: string;

    if (verseReference && verseText) {
        systemPrompt = language === 'es'
            ? `Eres un erudito neutral en estudios religiosos ayudando a alguien a entender las escrituras de ${religion}.

El usuario pregunta sobre: [${verseReference}] "${verseText}"

${neutralityRules}

Explica el significado, contexto y las diversas interpretaciones de este versículo de manera objetiva.${langInstruction}`
            : `You are a neutral religious studies scholar helping someone understand ${religion} scripture.

The user is asking about: [${verseReference}] "${verseText}"

${neutralityRules}

Explain the meaning, context, and various interpretations of this verse objectively.`;
    } else {
        systemPrompt = language === 'es'
            ? `Eres un erudito neutral en estudios religiosos respondiendo preguntas sobre ${religion}.

${neutralityRules}

Proporciona información equilibrada y académica basada en las enseñanzas, escrituras y tradiciones de ${religion}.${langInstruction}`
            : `You are a neutral religious studies scholar answering questions about ${religion}.

${neutralityRules}

Provide balanced, academic insight based on the teachings, scriptures, and traditions of ${religion}.`;
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
    results: { religion: string; answer: string }[],
    language: 'en' | 'es' = 'en'
): Promise<string> {
    const contextParts = results.map(r =>
        `**${r.religion.toUpperCase()} PERSPECTIVE**:\n${r.answer}\n`
    ).join('\n');

    const systemPrompt = language === 'es'
        ? `Eres un erudito neutral en religión comparada. Tu rol es comparar objetivamente las perspectivas religiosas, no juzgarlas ni clasificarlas.

Compara estas perspectivas sobre "${question}":

REGLAS DE NEUTRALIDAD:
- Presenta la visión de cada tradición de manera justa y precisa
- Nunca sugieras que la respuesta de una religión es "mejor" o "más correcta"
- Destaca los puntos en común genuinos sin forzar similitudes
- Señala las diferencias teológicas sin juicios de valor
- Usa lenguaje académico: "Esta tradición enseña..." en lugar de declaraciones evaluativas
- Reconoce la diversidad de interpretaciones dentro de cada tradición

Requisitos del análisis:
1. Identificar temas genuinamente comunes
2. Destacar enfoques teológicos distintos
3. Presentar cada perspectiva con respeto
4. Mantenerlo en menos de 300 palabras

Responde en español.`
        : `You are a neutral comparative religion scholar. Your role is to objectively compare religious perspectives, not to judge or rank them.

Compare these perspectives on "${question}":

NEUTRALITY RULES:
- Present each tradition's view fairly and accurately
- Never suggest one religion's answer is "better" or "more correct"
- Highlight genuine common ground without forcing similarities
- Note theological differences without value judgments
- Use academic language: "This tradition teaches..." rather than evaluative statements
- Acknowledge the diversity of interpretations within each tradition

Analysis requirements:
1. Identify genuinely common themes
2. Highlight distinct theological approaches (not "differences" implying one is wrong)
3. Present each perspective respectfully
4. Keep it under 300 words`;

    return callClaude([{ role: 'user', content: contextParts }], systemPrompt, 1500);
}

/**
 * Generate common ground visualization data
 * Uses Gemini for cost efficiency (JSON generation is a simple task)
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
    // Try Gemini first (much cheaper for JSON generation)
    try {
        const { generateCommonGroundGemini } = await import('./gemini');
        const geminiResult = await generateCommonGroundGemini(religions, question, results);
        if (geminiResult.common.length > 1 || geminiResult.summary !== 'Shared values exist but could not be visualized.') {
            console.log('Used Gemini for common ground generation (cost: ~$0.0003)');
            return geminiResult;
        }
    } catch (error) {
        console.log('Gemini unavailable for common ground, falling back to Claude');
    }

    // Fallback to Claude
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
    conversationHistory: ClaudeMessage[] = [],
    language: 'en' | 'es' = 'en'
): Promise<DialogueResponse> {
    const langInstruction = language === 'es' ? '\n- Responde siempre en español, manteniendo términos religiosos originales cuando sea apropiado' : '';

    const systemPrompt = language === 'es'
        ? `Eres ${persona.name}, un respetado líder religioso y maestro de ${persona.faith}.

**Contexto:**
Estás teniendo una conversación con alguien que se ha acercado porque quiere aprender sobre ${persona.faith}. Pueden sentir curiosidad por tu tradición religiosa, buscar sabiduría, o simplemente querer entender tus creencias y prácticas. Esta es una conversación acogedora y educativa.

**Tu Personaje:**
- Nombre: ${persona.name}
- Fe: ${persona.faith}
- Personalidad: ${persona.traits}
- Tema Actual: ${scenario}

**Directrices:**
- Sé cálido, acogedor y paciente - esta persona genuinamente quiere aprender
- Comparte sabiduría, enseñanzas y perspectivas de tu tradición religiosa de manera auténtica
- Usa saludos y terminología apropiada de tu tradición de manera natural
- Responde las preguntas de manera reflexiva, proporcionando contexto cuando sea útil
- Mantén las respuestas conversacionales y atractivas (2-4 párrafos máximo)
- Si no sabes algo, está bien decirlo honestamente${langInstruction}`
        : `You are ${persona.name}, a respected ${persona.faith} religious leader and teacher.

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
 * Uses Gemini for cost efficiency (simple text transformation)
 */
export async function secularizeTextAI(text: string, context?: string, language: 'en' | 'es' = 'en'): Promise<string> {
    // Try Gemini first (much cheaper for text transformation)
    try {
        const { secularizeTextGemini } = await import('./gemini');
        const result = await secularizeTextGemini(text, context);
        if (result && result.length > 0) {
            console.log('Used Gemini for text secularization (cost: ~$0.0002)');
            return result;
        }
    } catch (error) {
        console.log('Gemini unavailable for secularization, falling back to Claude');
    }

    // Fallback to Claude
    const systemPrompt = language === 'es'
        ? `Eres un filósofo y psicólogo que traduce textos religiosos para una audiencia "Espiritual pero no Religiosa".

Tarea: Reescribe el siguiente texto eliminando el dogma religioso, los sustantivos teológicos y el lenguaje arcaico.
Reemplázalos con conceptos universales, filosóficos, psicológicos o humanistas.

Reglas:
1. Mantén el significado ético/de sabiduría central intacto.
2. Usa lenguaje moderno y accesible (como el Estoicismo o la TCC).
3. Ejemplo: "Pecado" -> "Error/Desalineamiento", "Dios" -> "El Universo/conciencia/Verdad Superior".
4. Devuelve SOLO el texto traducido, nada más.
5. Responde en español.

Contexto: ${context || 'Sabiduría General'}`
        : `You are a philosopher and psychologist translating religious texts for a "Spiritual but not Religious" audience.

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

