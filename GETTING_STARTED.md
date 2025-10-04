# Getting Started with Faith Explorer

This guide will help you set up and run Faith Explorer locally.

## Overview

Faith Explorer consists of two main components:
- **Backend API** - Express server that provides scripture search and AI responses
- **Frontend Web App** - React application with a modern UI/UX

## Prerequisites

Before you begin, ensure you have:
- Node.js v18+ installed
- npm or yarn package manager
- An Anthropic API key (get one at https://console.anthropic.com)
- A terminal/command line interface
- A modern web browser

## Step-by-Step Setup

### 1. Backend Setup

First, let's get the API server running:

```bash
# Navigate to the backend directory
cd faith-explorer-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Open .env and add your API key
# ANTHROPIC_API_KEY=your_actual_api_key_here

# Start the server
npm start
```

You should see:
```
✅ FaithExplorer API running on port 3001
📖 Loaded scriptures: Bible + Quran + Hadith + Torah + Bhagavad Gita + Dhammapada + Guru Granth Sahib + Tao Te Ching + Analects + Kojiki
🔗 Test: http://localhost:3001/health
```

**Test the backend:**
```bash
curl http://localhost:3001/health
```

You should see: `{"status":"ok","message":"FaithExplorer API is running"}`

### 2. Frontend Setup

Open a **new terminal window** (keep the backend running!) and:

```bash
# Navigate to the frontend directory
cd faith-explorer-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

You should see:
```
VITE v7.x.x ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 3. Open the Application

Open your web browser and navigate to: **http://localhost:5173**

## First Steps in the App

### 1. Choose Your Mode
- **Single Religion** - Search within one religion at a time
- **Comparison Mode** - Compare across multiple religions simultaneously

### 2. Select Religion(s)
- Click on any religion card to select it
- In comparison mode, select 2-7 religions
- Each religion has a unique color for easy identification

### 3. Search
- Enter a topic, question, or keywords (e.g., "love", "suffering", "prayer")
- Click the search icon or press Enter
- Wait for AI-powered results with relevant scripture verses

### 4. Explore Results
Each verse card shows:
- The scripture reference
- The full verse text
- Action buttons:
  - **Chat** - Start an AI conversation about this specific verse
  - **Save** - Save to your personal library with notes
  - **Share** - Copy to clipboard for sharing

### 5. Chat with AI
- Click "Chat" on any verse
- A sidebar opens with the verse context
- Ask questions like:
  - "What does this mean?"
  - "What's the historical context?"
  - "How do scholars interpret this?"
- The AI knows exactly which verse you're discussing!

### 6. Save and Organize
- Click "Save" on verses you want to keep
- Navigate to the "Saved" tab
- Add personal notes and thoughts
- Organize your spiritual study

### 7. Freemium Limits
Free tier includes:
- 50 searches per month
- 100 chat messages per month
- Unlimited saving and organizing
- Resets automatically every 30 days

Click "Upgrade to Premium" to remove all limits.

## Example Searches

Try these to get started:

**Single Religion Mode:**
- Christianity: "forgiveness"
- Islam: "charity"
- Buddhism: "enlightenment"
- Judaism: "justice"

**Comparison Mode:**
- Select Christianity, Islam, and Judaism
- Search: "What is the nature of God?"
- Compare how each tradition addresses this

## Troubleshooting

### Backend won't start
- **Port already in use**: Change `PORT=3001` in `.env` to another port
- **Missing API key**: Ensure `ANTHROPIC_API_KEY` is set in `.env`
- **Module errors**: Try `rm -rf node_modules && npm install`

### Frontend won't start
- **Module errors**: Try `rm -rf node_modules && npm install`
- **Build errors**: Ensure you're using Node.js v18+
- **Can't reach backend**: Check backend is running on port 3001

### No search results
- **API key invalid**: Check your Anthropic API key
- **Backend not running**: Ensure backend server is active
- **Try different keywords**: Some topics may not have direct matches

### Chat not working
- **Check usage limits**: Free tier has 100 messages/month
- **Backend errors**: Check backend terminal for error messages
- **Refresh the page**: Sometimes helps with connection issues

## Project Structure

```
faith-explorer/
├── faith-explorer-backend/     # API server
│   ├── data/                  # Scripture JSON files
│   ├── server.js             # Main server file
│   └── search.js             # Search logic
│
├── faith-explorer-frontend/   # Web application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API calls
│   │   ├── store/            # State management
│   │   └── types/            # TypeScript types
│   └── package.json
│
└── README.md
```

## Next Steps

Now that you're set up:

1. **Explore Different Religions** - Try searching across all 9 traditions
2. **Use Comparison Mode** - See how different religions address the same topics
3. **Build Your Library** - Save verses and add personal reflections
4. **Chat Deeply** - Use the AI chat to understand verses better
5. **Share Insights** - Use the share feature to discuss with friends

## Development

Want to contribute or customize?

**Backend Development:**
```bash
cd faith-explorer-backend
# Make your changes to server.js or search.js
# Restart server to see changes
npm start
```

**Frontend Development:**
```bash
cd faith-explorer-frontend
# Make your changes in src/
# Vite has hot reload - changes appear immediately
npm run dev
```

**Build for Production:**
```bash
cd faith-explorer-frontend
npm run build
# Creates optimized build in dist/
```

## Getting Help

- **Documentation**: See README.md files in each directory
- **Issues**: Check existing issues or create a new one
- **Questions**: Use GitHub Discussions

## Tips for Best Experience

1. **Use specific keywords** - "compassion" works better than "what does Buddhism say about being nice"
2. **Try different phrasings** - If you don't get results, rephrase your search
3. **Explore comparisons** - Some of the most interesting insights come from comparing religions
4. **Save as you go** - Don't lose great verses you find
5. **Use chat liberally** - The AI can provide valuable context and explanations

## What's Next?

The app is designed with a freemium model for future monetization:
- Free users get generous limits to explore
- Premium removes all limits
- Future: User accounts, cloud sync, mobile apps

Enjoy exploring the world's sacred texts! 🌍✨
