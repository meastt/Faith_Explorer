const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { searchScriptures } = require('./search');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'FaithExplorer API is running' });
});

app.post('/api/ask', async (req, res) => {
  try {
    const { religion, question } = req.body;
    
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
    
    const relevantVerses = searchScriptures(religion, question, 5);
    
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

const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`✅ FaithExplorer API running on port ${PORT}`);
    console.log(`📖 Loaded scriptures: Bible + Quran + Hadith + Torah + Bhagavad Gita + Dhammapada + Guru Granth Sahib + Tao Te Ching + Analects + Kojiki`);
    console.log(`🔗 Test: http://localhost:${PORT}/health`);
  });
