const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { searchScriptures, searchSubsets } = require('./search');

// Startup validation - check required environment variables
function validateEnvironment() {
  const requiredEnvVars = ['ANTHROPIC_API_KEY'];
  const missing = requiredEnvVars.filter(key => !process.env[key] || process.env[key] === 'your_api_key_here');

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.error('Please configure these in your .env file');
    process.exit(1);
  }

  console.log('✅ Environment validation passed');
}

// Validate environment on startup
validateEnvironment();

const app = express();

app.use(cors());
app.use(express.json());

// Simple in-memory cache for API responses
const apiCache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function getCacheKey(type, params) {
  return `${type}:${JSON.stringify(params)}`;
}

function getFromCache(key) {
  const cached = apiCache.get(key);
  if (!cached) return null;

  if (Date.now() - cached.timestamp > CACHE_TTL) {
    apiCache.delete(key);
    return null;
  }

  return cached.data;
}

function setCache(key, data) {
  apiCache.set(key, {
    data,
    timestamp: Date.now()
  });
}

// Simple rate limiting
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30; // 30 requests per minute

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(ip) || [];

  // Filter out requests older than the window
  const recentRequests = userRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);

  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false; // Rate limit exceeded
  }

  // Add current request
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);

  return true; // Request allowed
}

// Rate limiting middleware
function rateLimitMiddleware(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';

  if (!checkRateLimit(ip)) {
    return res.status(429).json({
      error: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil(RATE_LIMIT_WINDOW / 1000)
    });
  }

  next();
}

// Helper function to call Anthropic API with retry and timeout
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
          model: 'claude-sonnet-4-20250514',
          max_tokens: maxTokens,
          messages
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();

        // Retry on 5xx errors or rate limits
        if (response.status >= 500 || response.status === 429) {
          if (attempt < retries - 1) {
            const backoff = Math.pow(2, attempt) * 1000; // Exponential backoff
            console.log(`API error ${response.status}, retrying in ${backoff}ms...`);
            await new Promise(resolve => setTimeout(resolve, backoff));
            continue;
          }
        }

        throw new Error(`Claude API error: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error(`Request timeout on attempt ${attempt + 1}`);
      } else {
        console.error(`API call failed on attempt ${attempt + 1}:`, error.message);
      }

      // Retry on network errors
      if (attempt < retries - 1) {
        const backoff = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, backoff));
        continue;
      }

      throw error;
    }
  }
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'FaithExplorer API is running' });
});

// Apply rate limiting to API routes
app.post('/api/ask', rateLimitMiddleware, async (req, res) => {
  try {
    const { religion, question, subsets } = req.body;

    if (!religion || !question) {
      return res.status(400).json({
        error: 'Missing required fields: religion and question'
      });
    }

    if (!['christianity', 'islam', 'judaism', 'hinduism', 'buddhism', 'sikhism', 'taoism', 'confucianism', 'shinto'].includes(religion)) {
      return res.status(400).json({
        error: 'Invalid religion. Must be: christianity, islam, judaism, hinduism, buddhism, sikhism, taoism, confucianism, or shinto'
      });
    }

    // Check cache first
    const cacheKey = getCacheKey('ask', { religion, question: question.toLowerCase().trim(), subsets });
    const cachedResponse = getFromCache(cacheKey);
    if (cachedResponse) {
      console.log('Cache hit for ask query');
      return res.json(cachedResponse);
    }

    // Use subset-specific search if subsets are provided, otherwise use legacy religion search
    const relevantVerses = subsets && subsets.length > 0
      ? await searchSubsets(subsets, question, 15)
      : await searchScriptures(religion, question, 15);
    
    if (relevantVerses.length === 0) {
      return res.json({
        answer: `I couldn't find specific scripture passages related to "${question}" in ${religion}. Try rephrasing your question.`,
        sources: []
      });
    }
    
    // Check if API key exists
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_api_key_here') {
      return res.json({
        answer: 'API key not configured. Here are the relevant scriptures I found:',
        sources: relevantVerses.map(v => ({
          reference: v.reference,
          text: v.text
        })),
        error: 'ANTHROPIC_API_KEY not set in .env file'
      });
    }
    
    const scriptureContext = relevantVerses
      .map(v => `[${v.reference}] "${v.text}"`)
      .join('\n\n');
    
    const systemPrompts = {
      christianity: 'You are a knowledgeable guide on Christianity. Answer ONLY based on the Bible, Book of Mormon, and Doctrine & Covenants passages provided below. Always cite the reference. Never make up verses.',
      islam: 'You are a knowledgeable guide on Islam. Answer ONLY based on the Quran and Hadith passages provided below. Always cite the reference. Never make up verses.',
      judaism: 'You are a knowledgeable guide on Judaism. Answer ONLY based on the Torah and Talmud passages provided below. Always cite the reference. Never make up verses.',
      hinduism: 'You are a knowledgeable guide on Hinduism. Answer ONLY based on the Bhagavad Gita passages provided below. Always cite the reference. Never make up verses.',
      buddhism: 'You are a knowledgeable guide on Buddhism. Answer ONLY based on the Dhammapada passages provided below. Always cite the reference. Never make up verses.',
      sikhism: 'You are a knowledgeable guide on Sikhism. Answer ONLY based on the Guru Granth Sahib passages provided below. Always cite the reference. Never make up verses.',
      taoism: 'You are a knowledgeable guide on Taoism. Answer ONLY based on the Tao Te Ching passages provided below. Always cite the reference. Never make up verses.',
      confucianism: 'You are a knowledgeable guide on Confucianism. Answer ONLY based on the Analects passages provided below. Always cite the reference. Never make up verses.',
      shinto: 'You are a knowledgeable guide on Shinto. Answer ONLY based on the Kojiki passages provided below. Always cite the reference. Never make up verses.'
    };
    
    const claudeData = await callAnthropicWithRetry([{
      role: 'user',
      content: `${systemPrompts[religion]}

Relevant scripture passages:
${scriptureContext}

User Question: "${question}"

Provide a clear response based on these scriptures.`
    }], 1000);

    const response = {
      answer: claudeData.content[0].text,
      sources: relevantVerses.map(v => ({
        reference: v.reference,
        text: v.text
      }))
    };

    // Cache the response
    setCache(cacheKey, response);

    res.json(response);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

app.post('/api/compare', rateLimitMiddleware, async (req, res) => {
  try {
    const { religions, question, results } = req.body;

    if (!religions || !question || !results) {
      return res.status(400).json({
        error: 'Missing required fields: religions, question, and results'
      });
    }

    // Check cache first
    const cacheKey = getCacheKey('compare', { religions, question: question.toLowerCase().trim() });
    const cachedResponse = getFromCache(cacheKey);
    if (cachedResponse) {
      console.log('Cache hit for compare query');
      return res.json(cachedResponse);
    }

    // Check if API key exists
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_api_key_here') {
      return res.json({
        comparison: 'API key not configured. Unable to generate comparative analysis.',
        error: 'ANTHROPIC_API_KEY not set in .env file'
      });
    }

    // Build context from all religions' answers
    const contextParts = results.map(r => {
      const religionName = religions.find(rel => rel === r.religion) || r.religion;
      return `**${religionName.toUpperCase()}**:\n${r.answer}\n`;
    }).join('\n');

    const claudeData = await callAnthropicWithRetry([{
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
    }], 1500);

    const response = {
      comparison: claudeData.content[0].text
    };

    // Cache the response
    setCache(cacheKey, response);

    res.json(response);

  } catch (error) {
    console.error('Comparison error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Chat endpoint for verse discussions
app.post('/api/chat', rateLimitMiddleware, async (req, res) => {
  try {
    const { religion, verseReference, verseText, question, conversationHistory = [] } = req.body;

    if (!religion || !verseReference || !verseText || !question) {
      return res.status(400).json({
        error: 'Missing required fields: religion, verseReference, verseText, and question'
      });
    }

    // Check if API key exists
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_api_key_here') {
      return res.json({
        answer: 'API key not configured. Unable to generate response.',
        error: 'ANTHROPIC_API_KEY not set in .env file'
      });
    }

    const systemPrompts = {
      christianity: 'You are a knowledgeable guide on Christianity. Answer based on Biblical context and wisdom.',
      islam: 'You are a knowledgeable guide on Islam. Answer based on Quranic and Hadith context.',
      judaism: 'You are a knowledgeable guide on Judaism. Answer based on Torah and Talmud context.',
      hinduism: 'You are a knowledgeable guide on Hinduism. Answer based on Hindu scripture context.',
      buddhism: 'You are a knowledgeable guide on Buddhism. Answer based on Buddhist scripture context.',
      sikhism: 'You are a knowledgeable guide on Sikhism. Answer based on Guru Granth Sahib context.',
      taoism: 'You are a knowledgeable guide on Taoism. Answer based on Taoist scripture context.',
      confucianism: 'You are a knowledgeable guide on Confucianism. Answer based on Confucian scripture context.',
      shinto: 'You are a knowledgeable guide on Shinto. Answer based on Shinto scripture context.'
    };

    const messages = [
      ...conversationHistory,
      {
        role: 'user',
        content: `${systemPrompts[religion]}

Context verse: [${verseReference}] "${verseText}"

User question: "${question}"

Provide a thoughtful response based on this verse and the broader religious context.`
      }
    ];

    const claudeData = await callAnthropicWithRetry(messages, 800);

    res.json({
      answer: claudeData.content[0].text
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

const PORT = process.env.PORT || 3001;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ FaithExplorer API running on port ${PORT}`);
    console.log(`📖 Loaded scriptures: Bible + Book of Mormon + Doctrine & Covenants + Quran + Hadith + Torah + Talmud + Bhagavad Gita + Dhammapada + Guru Granth Sahib + Tao Te Ching + Analects + Kojiki`);
    console.log(`🔗 Test: http://localhost:${PORT}/health`);
    console.log(`🔗 iOS Simulator: http://192.168.1.26:${PORT}/health`);
  });
