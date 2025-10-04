# Faith Explorer Frontend

A modern, responsive web application for exploring and comparing sacred texts across multiple world religions.

## Features

### Core Functionality
- **Single Religion Search** - Deep dive into one religion's texts at a time
- **Multi-Religion Comparison** - Compare up to 7 religions side-by-side
- **AI-Powered Chat** - Contextual AI discussions about specific verses
- **Save & Annotate** - Save verses with personal notes and tags
- **Share** - Easy sharing of verses and comparisons

### Freemium Model
- **Free Tier**: 50 searches/month, 100 chat messages/month
- **Premium**: Unlimited searches and chat messages
- Usage automatically resets every 30 days

### Supported Religions
- Christianity (Bible - KJV)
- Islam (Quran & Hadith)
- Judaism (Torah)
- Hinduism (Bhagavad Gita)
- Buddhism (Dhammapada)
- Sikhism (Guru Granth Sahib)
- Taoism (Tao Te Ching)
- Confucianism (Analects)
- Shinto (Kojiki)

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand (with localStorage persistence)
- **Icons**: Lucide React
- **API**: RESTful API (backend required)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Faith Explorer Backend running on port 3001

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env if your backend runs on a different URL
```

3. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # App header with usage stats
│   ├── ReligionSelector.tsx  # Religion selection UI
│   ├── SearchBar.tsx   # Search input
│   ├── SearchResults.tsx     # Results display
│   ├── VerseCard.tsx   # Individual verse display
│   ├── ChatDrawer.tsx  # AI chat sidebar
│   └── SavedLibrary.tsx      # Saved verses view
├── services/           # API integration
│   └── api.ts         # Backend API calls
├── store/             # State management
│   └── useStore.ts    # Zustand store
├── types/             # TypeScript definitions
│   └── index.ts       # All type definitions
├── utils/             # Utility functions
│   └── helpers.ts     # Helper functions
├── App.tsx            # Main app component
└── main.tsx           # Entry point
```

## Key Features Explained

### Contextual AI Chat
Each verse has a "Chat" button that opens a sidebar where you can:
- Ask questions about the verse's meaning
- Request historical context
- Explore theological interpretations
- The AI automatically knows which verse you're discussing

### Comparison Mode
- Select 2-7 religions to compare
- Search once, see results from all selected religions
- Easy visual distinction with color-coded religion cards
- Save entire comparisons for later reference

### Smart Saving
All saved data persists in localStorage:
- Saved verses with notes
- Saved comparisons
- Usage statistics
- User preferences

### Freemium Implementation
The app tracks:
- Number of searches per month
- Number of chat messages per month
- Automatic reset after 30 days
- Upgrade prompts when limits reached

## Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3001
```

## Backend Integration

This frontend requires the Faith Explorer Backend API. The backend should provide:

- `POST /api/ask` - Search religious texts and get AI responses
  - Request: `{ religion: string, question: string }`
  - Response: `{ answer: string, sources: Verse[] }`

## Future Enhancements

### Planned Features
1. **User Accounts** - Cloud sync across devices
2. **Advanced Comparison Chat** - AI discussions about cross-religion comparisons
3. **Collections** - Organize saved verses into themed collections
4. **Public Sharing** - Share saved verses via unique URLs
5. **Export** - Export notes and verses to PDF/Markdown
6. **Study Plans** - Guided reading plans across religions
7. **Community Features** - Share insights with other users
8. **Mobile App** - React Native version

### Backend Enhancements Needed
1. **User Authentication** - JWT-based auth system
2. **Database Integration** - PostgreSQL for user data
3. **Dedicated Chat Endpoint** - Support for conversation history
4. **Batch Search** - Optimize multi-religion searches
5. **Payment Integration** - Stripe for premium subscriptions
6. **Rate Limiting** - API rate limiting per user
7. **Analytics** - Usage tracking for business insights

## Development Notes

### State Management
Uses Zustand with persistence middleware. All state automatically saves to localStorage.

### API Calls
All API calls are centralized in `src/services/api.ts` for easy maintenance.

### Styling
Tailwind CSS v4 with custom color scheme. Primary color can be changed in `tailwind.config.js`.

### Type Safety
Full TypeScript coverage with strict mode enabled.

## Contributing

When adding new features:
1. Add types to `src/types/index.ts`
2. Update Zustand store if state management needed
3. Create reusable components in `src/components/`
4. Follow existing naming conventions
5. Test with both free and premium user flows

## License

MIT

## Support

For issues or questions, please file an issue on GitHub.
