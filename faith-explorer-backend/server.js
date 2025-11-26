const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { searchScriptures, searchSubsets } = require('./search');

// Startup validation
function validateEnvironment() {
  const requiredEnvVars = ['ANTHROPIC_API_KEY'];
  const missing = requiredEnvVars.filter(key => !process.env[key] || process.env[key] === 'your_api_key_here');

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    process.exit(1);
  }
  console.log('✅ Environment validation passed');
}

validateEnvironment();

const app = express();
app.use(cors());
app.use(express.json());

// --- Cache System ---
const apiCache = new Map();
const SEARCH_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 Hours for search results
const CHAT_CACHE_TTL = 60 * 60 * 1000; // 1 Hour for chat

function getCacheKey(type, params) {
  return `${type}:${JSON.stringify(params)}`;
}

function getFromCache(key, ttl) {
  const cached = apiCache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > ttl) {
    apiCache.delete(key);
    return null;
  }
  return cached.data;
}

function setCache(key, data) {
  // prevent cache from growing too large (simple LRU-like safety)
  if (apiCache.size > 1000) {
    const firstKey = apiCache.keys().next().value;
    apiCache.delete(firstKey);
  }
  apiCache.set(key, { data, timestamp: Date.now() });
}

// --- Rate Limiting System ---
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30; // 30 requests per minute

// Cleanup interval for rate limit map (Prevent Memory Leak)
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of rateLimitMap.entries()) {
    const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
    if (recent.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      rateLimitMap.set(ip, recent);
    }
  }
}, RATE_LIMIT_WINDOW);

function rateLimitMiddleware(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const userRequests = rateLimitMap.get(ip) || [];
  
  const recentRequests = userRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);

  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return res.status(429).json({
      error: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil(RATE_LIMIT_WINDOW / 1000)
    });
  }

  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  next();
}

// --- Anthropic API Helper ---
async function callAnthropicWithRetry(messages, maxTokens = 1000, retries = 3, timeout = 30000) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229', // Updated to latest stable model
          max_tokens: maxTokens,
          messages
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status >= 500 || response.status === 429) {
          if (attempt < retries - 1) {
            const backoff = Math.pow(2, attempt) * 1000;
            await new Promise(resolve => setTimeout(resolve, backoff));
            continue;
          }
        }
        throw new Error(`Claude API error: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      if (attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
        continue;
      }
      throw error;
    }
  }
}

// --- Routes ---

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'FaithExplorer API is running' });
});

// Search Endpoint
app.post('/api/ask', rateLimitMiddleware, async (req, res) => {
  try {
    const { religion, question, subsets } = req.body;

    if (!religion || !question) {
      return res.status(400).json({ error: 'Missing religion or question' });
    }

    // Check Cache
    const cacheKey = getCacheKey('ask', { religion, question: question.toLowerCase().trim(), subsets });
    const cachedResponse = getFromCache(cacheKey, SEARCH_CACHE_TTL);
    if (cachedResponse) return res.json(cachedResponse);

    // Execute Search (Using Fuse.js logic from search.js)
    const relevantVerses = subsets && subsets.length > 0
      ? await searchSubsets(subsets, question, 15)
      : await searchScriptures(religion, question, 15);
    
    // 1. Smart Fallback: If no verses found, try to answer generally
    // (Only if no specific subsets were forced, implying a general query)
    if (relevantVerses.length === 0) {
      return res.json({
        answer: `I couldn't find exact scripture matches for "${question}" in the loaded texts. Try using broader keywords like "hope" instead of "optimism", or ask the AI Chat directly.`,
        sources: []
      });
    }
    
    // Check API Key availability
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.includes('your_api_key')) {
      return res.json({
        answer: 'API key not configured. Showing raw search results:',
        sources: relevantVerses
      });
    }
    
    const scriptureContext = relevantVerses
      .map(v => `[${v.reference}] "${v.text}"`)
      .join('\n\n');
    
    // Dynamic System Prompt based on religion
    const basePrompt = `You are a knowledgeable guide on ${religion}. Answer the user's question ONLY based on the provided scripture passages. 
    - Always cite the reference (e.g. [John 3:16]).
    - If the verses don't fully answer the question, admit it gently.
    - Be concise and spiritual in tone.`;

    const claudeData = await callAnthropicWithRetry([{
      role: 'user',
      content: `${basePrompt}\n\nRelevant passages:\n${scriptureContext}\n\nQuestion: "${question}"`
    }], 1000);

    const response = {
      answer: claudeData.content[0].text,
      sources: relevantVerses.map(v => ({
        reference: v.reference,
        text: v.text,
        score: v.score // Pass score to frontend for debugging/sorting
      }))
    };

    setCache(cacheKey, response);
    res.json(response);
    
  } catch (error) {
    console.error('Search Error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Comparison Endpoint
app.post('/api/compare', rateLimitMiddleware, async (req, res) => {
  try {
    const { religions, question, results } = req.body;

    if (!religions || !question || !results) return res.status(400).json({ error: 'Missing required fields' });

    const cacheKey = getCacheKey('compare', { religions, question: question.toLowerCase().trim() });
    const cachedResponse = getFromCache(cacheKey, SEARCH_CACHE_TTL);
    if (cachedResponse) return res.json(cachedResponse);

    const contextParts = results.map(r => {
      const relName = typeof r.religion === 'string' ? r.religion : r.religion.name;
      return `**${relName.toUpperCase()} PERSPECTIVE**:\n${r.answer}\n`;
    }).join('\n');

    const claudeData = await callAnthropicWithRetry([{
      role: 'user',
      content: `You are a comparative religion scholar. Compare these perspectives on "${question}".
      
      ${contextParts}
      
      Analysis requirements:
      1. Identify common themes.
      2. Highlight distinct theological differences.
      3. Be respectful and balanced.
      4. Keep it under 300 words.`
    }], 1500);

    const response = { comparison: claudeData.content[0].text };
    setCache(cacheKey, response);
    res.json(response);

  } catch (error) {
    console.error('Comparison Error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Chat Endpoint (Updated for Flexibility)
app.post('/api/chat', rateLimitMiddleware, async (req, res) => {
  try {
    const { religion, verseReference, verseText, question, conversationHistory = [] } = req.body;

    if (!religion || !question) {
      return res.status(400).json({ error: 'Missing religion or question' });
    }

    // Construct Context
    // If verse is present, we focus on it. If not, we act as a general guide.
    let systemContext = '';
    if (verseReference && verseText) {
      systemContext = `You are a guide on ${religion}. Focus your answer on this specific verse: [${verseReference}] "${verseText}". Explain its meaning, context, and application.`;
    } else {
      systemContext = `You are a knowledgeable guide on ${religion}. Answer the user's question based on the general teachings, scriptures, and traditions of ${religion}.`;
    }

    const messages = [
      ...conversationHistory,
      {
        role: 'user',
        content: `${systemContext}\n\nUser Question: "${question}"`
      }
    ];

    const claudeData = await callAnthropicWithRetry(messages, 800);

    res.json({ answer: claudeData.content[0].text });

  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ FaithExplorer API running on port ${PORT}`);
});
