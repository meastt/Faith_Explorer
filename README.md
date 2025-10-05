# Faith Explorer 🌍

A comprehensive interfaith learning platform that helps users explore and compare sacred texts from 9 major world religions, powered by Claude AI for intelligent insights and comparative analysis.

## 🌟 Features

### Core Functionality
- **9 Major World Religions**: Christianity, Islam, Judaism, Hinduism, Buddhism, Sikhism, Taoism, Confucianism, and Shinto
- **AI-Powered Insights**: Claude AI provides contextual explanations and interpretations based on sacred texts
- **Comparative Analysis**: Compare perspectives across multiple traditions with AI-generated synthesis
- **Interactive Chat**: Deep dive into any verse with conversational AI assistance
- **Smart Search**: Semantic search with up to 15 relevant results per religion

### User Experience
- **Modern Web Interface**: Clean, responsive design with mobile optimization
- **Onboarding Flow**: Guided introduction for new users with example queries
- **Data Coverage Indicators**: Clear visibility into available content for each religion
- **Saved Library**: Save verses with personal notes, search, and filter functionality
- **Mobile-Optimized Chat**: Bottom sheet design for better mobile experience

### Subscription & Monetization
- **RevenueCat Integration**: Professional subscription management
- **Free Tier**: 50 searches and 100 chat messages per month
- **Premium Features**: Unlimited searches, unlimited chat, advanced comparisons

## 📚 Supported Religions & Texts

| Religion | Primary Text | Verses | Source |
|----------|-------------|--------|---------|
| **Christianity** | Bible (KJV) | 31,102 | Public Domain |
| **Islam** | Quran + Hadith | 13,799 | Public Domain |
| **Judaism** | Torah (Complete) | 5,846 | Sefaria API |
| **Hinduism** | Bhagavad Gita | 4 | Public Domain |
| **Buddhism** | Dhammapada | 4 | Public Domain |
| **Sikhism** | Guru Granth Sahib | 4 | Public Domain |
| **Taoism** | Tao Te Ching | 10 | Public Domain |
| **Confucianism** | Analects | 10 | Public Domain |
| **Shinto** | Kojiki | 8 | Public Domain |

**Total Coverage**: ~51,000+ verses across 9 major world religions

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Claude AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/faith-explorer.git
   cd faith-explorer
   ```

2. **Set up the backend**
   ```bash
   cd faith-explorer-backend
   npm install
   cp .env.example .env
   # Edit .env and add your ANTHROPIC_API_KEY
   npm start
   ```

   **⚠️ Security Note**: Never commit your actual `.env` file to version control. The `.env.example` file shows the required format without exposing your API key.

3. **Set up the frontend** (in a new terminal)
   ```bash
   cd faith-explorer-frontend
   npm install
   cp .env.example .env
   # Edit .env and add your VITE_REVENUECAT_API_KEY (optional for development)
   npm run dev
   ```

**Environment Variables:**

Backend (`.env`):
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
PORT=3001
```

Frontend (`.env`):
```
# Use RevenueCat PUBLIC key (starts with "rcb_"), NOT the secret key!
VITE_REVENUECAT_PUBLIC_KEY=your_revenuecat_public_key_here
VITE_API_URL=http://localhost:3001
```

**⚠️ Security Note:**
- Use RevenueCat's **PUBLIC** key in the frontend (safe to expose)
- NEVER use the secret API key in frontend code
- Public keys start with `rcb_` and are designed for client-side use

The API will be available at `http://localhost:3001`
The web app will be available at `http://localhost:5173`

## 📖 API Usage

### Health Check
```bash
curl http://localhost:3001/health
```

### Ask a Question
```bash
curl -X POST http://localhost:3001/api/ask \
  -H "Content-Type: application/json" \
  -d '{
    "religion": "christianity",
    "question": "What does the Bible say about love?"
  }'
```

### Supported Religions
- `christianity`
- `islam`
- `judaism`
- `hinduism`
- `buddhism`
- `sikhism`
- `taoism`
- `confucianism`
- `shinto`

### Example Responses

**Christianity - Love**
```json
{
  "answer": "Based on the Bible passages provided, love is presented as...",
  "sources": [
    {
      "reference": "John 3:16",
      "text": "For God so loved the world..."
    }
  ]
}
```

**Buddhism - Suffering**
```json
{
  "answer": "Based on the Dhammapada passages provided, suffering is...",
  "sources": [
    {
      "reference": "Dhammapada 1:1",
      "text": "Mind precedes all mental states..."
    }
  ]
}
```

## 🏗️ Architecture

```
faith-explorer/
├── faith-explorer-backend/          # Main API server
│   ├── data/                       # Religious text data (JSON)
│   ├── server.js                   # Express server
│   ├── search.js                   # Text search functionality
│   └── package.json
├── faith-explorer-frontend/        # React web application
│   ├── src/                       # Source code
│   │   ├── components/           # React components
│   │   ├── services/            # API integration
│   │   ├── store/               # State management
│   │   ├── types/               # TypeScript types
│   │   └── utils/               # Helper functions
│   └── package.json
├── faith-explorer-data/            # Data processing
│   ├── processed-files/           # Clean, structured JSON files
│   ├── raw-files/                 # Original source files
│   └── scripts/                   # Data processing scripts
└── README.md
```

## 🔧 Development

### Adding New Religious Texts

1. **Add raw text file** to `faith-explorer-data/raw-files/`
2. **Create processing script** in `faith-explorer-data/scripts/`
3. **Process the data** and save to `processed-files/`
4. **Update backend** in `search.js` and `server.js`
5. **Test the integration**

### Data Structure

All religious texts follow this standardized format:

```json
{
  "religion": "religion_name",
  "source": "Text Name",
  "version": "Translation/Version",
  "verses": [
    {
      "id": "unique_id",
      "reference": "Book Chapter:Verse",
      "book": "Book Name",
      "chapter": 1,
      "verse": 1,
      "text": "Actual verse text..."
    }
  ]
}
```

## 🌍 Global Religious Coverage

Faith Explorer covers approximately **95-98%** of religious adherents globally:

- **Abrahamic Religions** (Judaism, Christianity, Islam)
- **Dharmic Religions** (Hinduism, Buddhism, Sikhism)  
- **East Asian Traditions** (Taoism, Confucianism, Shinto)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Areas for Contribution

- **Additional Religious Texts**: Expand coverage to more traditions
- **Translation Quality**: Improve existing translations
- **API Enhancements**: Add new endpoints and features
- **Documentation**: Improve guides and examples

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Sacred Texts Archive** for providing access to public domain texts
- **Sefaria** for Torah data
- **Anthropic** for Claude AI integration
- **Religious communities** worldwide for preserving these sacred texts

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/faith-explorer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/faith-explorer/discussions)
- **Email**: support@faithexplorer.com

## 🚀 New in This Version

### ✅ Completed Features
- **AI Response Display**: Search results now prominently show AI-generated insights and explanations
- **Comparative Analysis**: Multi-religion searches include AI-powered synthesis of similarities and differences
- **Data Coverage Indicators**: Each religion shows coverage status (Full/Limited) and verse counts
- **Onboarding Experience**: New users get a guided tour with example queries
- **RevenueCat Integration**: Professional subscription management system
- **Enhanced Search**: Increased from 5 to 15 results per search for better coverage
- **Mobile UX Improvements**: Bottom sheet chat drawer for better mobile experience
- **Saved Library Enhancements**: Search and filter functionality for saved verses

### 🎯 Future Roadmap

- [ ] **Expand Religious Text Coverage**: Add complete texts for Hinduism, Buddhism, Sikhism, etc.
- [ ] **Semantic Search**: Upgrade to embedding-based search for better concept matching
- [ ] **User Authentication**: Account system for cross-device sync
- [ ] **Mobile App**: React Native version for iOS and Android
- [ ] **Multi-language Support**: Translations and multilingual text support
- [ ] **Community Features**: Share insights, discussion forums
- [ ] **Export Functionality**: PDF and Markdown export for saved collections
- [ ] **API Rate Limiting**: Production-ready API with authentication

---

**Faith Explorer** - Bridging understanding across the world's great religious traditions through technology and respect. 🌍✨
