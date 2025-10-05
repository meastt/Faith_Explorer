import { Compass, ArrowRight } from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  description: string;
  query: string;
  icon: string;
}

const TOPICS: Topic[] = [
  {
    id: 'love',
    title: 'Love & Compassion',
    description: 'Explore how different faiths understand and practice love',
    query: 'What is love and compassion?',
    icon: '❤️',
  },
  {
    id: 'forgiveness',
    title: 'Forgiveness',
    description: 'Discover teachings on mercy, pardon, and letting go',
    query: 'What does it say about forgiveness?',
    icon: '🕊️',
  },
  {
    id: 'suffering',
    title: 'Suffering & Hardship',
    description: 'Understand perspectives on pain, struggle, and resilience',
    query: 'How should we approach suffering?',
    icon: '🌊',
  },
  {
    id: 'purpose',
    title: 'Life\'s Purpose',
    description: 'Examine the meaning and goal of human existence',
    query: 'What is the purpose of life?',
    icon: '🎯',
  },
  {
    id: 'justice',
    title: 'Justice & Fairness',
    description: 'Compare views on righteousness and social equity',
    query: 'What is justice and how should we pursue it?',
    icon: '⚖️',
  },
  {
    id: 'death',
    title: 'Death & Afterlife',
    description: 'Explore beliefs about mortality and what comes after',
    query: 'What happens after death?',
    icon: '🌙',
  },
  {
    id: 'prayer',
    title: 'Prayer & Meditation',
    description: 'Learn about spiritual practices and connection',
    query: 'How should we pray or meditate?',
    icon: '🙏',
  },
  {
    id: 'wisdom',
    title: 'Wisdom & Knowledge',
    description: 'Discover teachings on understanding and enlightenment',
    query: 'What is wisdom?',
    icon: '📖',
  },
];

interface TopicExplorerProps {
  onTopicSelect: (query: string) => void;
}

export function TopicExplorer({ onTopicSelect }: TopicExplorerProps) {
  // const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Compass className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Explore Topics</h3>
          <p className="text-sm text-gray-600">Discover wisdom across faiths</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {TOPICS.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onTopicSelect(topic.query)}
            className="group relative p-4 text-left bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:shadow-md transition-all duration-200"
          >
            <div className="text-2xl mb-2">{topic.icon}</div>
            <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
              {topic.title}
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed mb-3">
              {topic.description}
            </p>
            <div className="flex items-center text-xs font-medium text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Explore</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
