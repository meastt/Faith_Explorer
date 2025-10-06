const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { searchScriptures, searchSubsets } = require('./search');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'FaithExplorer API is running' });
});

app.post('/api/ask', async (req, res) => {
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
    
    // Use subset-specific search if subsets are provided, otherwise use legacy religion search
    const relevantVerses = subsets && subsets.length > 0 
      ? searchSubsets(subsets, question, 15)
      : searchScriptures(religion, question, 15);
    
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
    
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `${systemPrompts[religion]}

Relevant scripture passages:
${scriptureContext}

User Question: "${question}"

Provide a clear response based on these scriptures.`
        }]
      })
    });
    
    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      throw new Error(`Claude API error: ${claudeResponse.status} - ${errorText}`);
    }
    
    const claudeData = await claudeResponse.json();
    
    res.json({
      answer: claudeData.content[0].text,
      sources: relevantVerses.map(v => ({
        reference: v.reference,
        text: v.text
      }))
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

app.post('/api/compare', async (req, res) => {
  try {
    const { religions, question, results } = req.body;

    if (!religions || !question || !results) {
      return res.status(400).json({
        error: 'Missing required fields: religions, question, and results'
      });
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

    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
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
      })
    });

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      throw new Error(`Claude API error: ${claudeResponse.status} - ${errorText}`);
    }

    const claudeData = await claudeResponse.json();

    res.json({
      comparison: claudeData.content[0].text
    });

  } catch (error) {
    console.error('Comparison error:', error);
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
