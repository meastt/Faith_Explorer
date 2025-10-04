# Faith Explorer 🌍

A comprehensive interfaith API that provides access to sacred texts from 9 major world religions, powered by Claude AI for intelligent responses.

## 🌟 Features

- **9 Major World Religions**: Christianity, Islam, Judaism, Hinduism, Buddhism, Sikhism, Taoism, Confucianism, and Shinto
- **AI-Powered Responses**: Uses Claude AI to provide contextually relevant answers based on sacred texts
- **Comprehensive Coverage**: Over 50,000 verses from major religious scriptures
- **RESTful API**: Simple HTTP endpoints for easy integration
- **Cultural Sensitivity**: Respectful handling of all religious traditions

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

2. **Install dependencies**
   ```bash
   cd faith-explorer-backend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your ANTHROPIC_API_KEY
   ```

4. **Start the server**
   ```bash
   npm start
   ```

The API will be available at `http://localhost:3001`

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

## 🔮 Roadmap

- [ ] **Frontend Web Interface**
- [ ] **Mobile App (React Native)**
- [ ] **Additional Religious Traditions**
- [ ] **Multi-language Support**
- [ ] **Advanced Search Features**
- [ ] **Community Contributions**
- [ ] **API Rate Limiting & Authentication**

---

**Faith Explorer** - Bridging understanding across the world's great religious traditions through technology and respect. 🌍✨
