# Faith Explorer - Quick Start Guide

## ⚡ 60-Second Setup

### Backend
```bash
cd faith-explorer-backend
npm install
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
npm start
```

### Frontend
```bash
# New terminal window
cd faith-explorer-frontend
npm install
npm run dev
```

### Open
🌐 http://localhost:5173

---

## ✨ Key Features

### 🔍 Search Modes
- **Single Religion**: Deep dive into one tradition
- **Comparison**: Compare 2-7 religions side-by-side

### 💬 AI Chat
- Click "Chat" on any verse
- AI knows the exact verse you're discussing
- Ask meaning, context, interpretations

### 💾 Save & Organize
- One-click save
- Add personal notes
- Access from "Saved" tab

### 🟣 Common Ground Visualizer
- **Venn Diagram**: Visualize shared values between faiths
- **Interactive**: Explore unique and shared concepts
- **AI-Powered**: Dynamic synthesis of perspectives

### 🗣️ Dialogue Simulator
- **Practice Mode**: Roleplay with AI personas (e.g., "Brother Ahmed", "Rev. Sarah")
- **Real-time Coaching**: Get feedback on your interfaith etiquette
- **Scenarios**: Practice specific situations like greetings or dietary questions

### 🎁 Freemium Model
- **Free**: 50 searches + 100 chat messages/month
- **Premium**: Unlimited everything

---

## 📱 Quick Tour

1. **Choose mode**: Single or Comparison
2. **Select religion(s)**: Click religion cards
3. **Search**: Enter topic (e.g., "love", "suffering")
4. **Explore results**: Read verses
5. **Chat**: Click "Chat" to discuss with AI
6. **Visualize**: In Comparison mode, click "Visualize Common Ground"
7. **Practice**: Go to "Practice" tab to simulate conversations
8. **Save**: Click "Save" to keep verses
9. **Organize**: Add notes in "Saved" tab

---

## 🎯 Try These Searches

**Single Religion:**
- Christianity: "forgiveness"
- Islam: "charity"
- Buddhism: "enlightenment"

**Comparison (select Christianity + Islam + Judaism):**
- "What is prayer?"
- "nature of God"

**Visualization:**
- Compare Christianity & Buddhism on "Suffering" -> Click "Visualize Common Ground"

**Dialogue Practice:**
- Select "Brother Ahmed" (Muslim) -> Ask him about "Halal food"

---

## 🛠️ Tech Stack

- React 19 + TypeScript
- Vite (build tool)
- Tailwind CSS v4
- Zustand (state)
- Framer Motion (animations)
- Lucide Icons
- Express (backend) + Fuse.js

---

## 📚 Documentation

- **Full README**: See `README.md`
- **Getting Started**: See `GETTING_STARTED.md`
- **Frontend Deep Dive**: See `FRONTEND_SUMMARY.md`

---

## 🚀 Production Build

```bash
cd faith-explorer-frontend
npm run build
# Deploy dist/ folder to Vercel/Netlify/etc.
```

---

## 💡 Pro Tips

1. Use specific keywords for better results
2. Try comparison mode for fascinating insights
3. Save verses as you explore
4. Chat liberally - it's incredibly helpful
5. Notes persist forever (localStorage)

---

## 🔜 What's Next?

- [ ] User authentication
- [ ] Payment integration (Stripe)
- [ ] Cloud sync for saved verses
- [ ] Mobile app
- [ ] More religions
- [ ] Community features

---

Made with ❤️ for interfaith understanding
