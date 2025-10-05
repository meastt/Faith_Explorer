import { Compass } from 'lucide-react';

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
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm h-full">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Compass className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-base font-bold text-gray-900">Quick Topics</h3>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {TOPICS.slice(0, 6).map((topic) => (
          <button
            key={topic.id}
            onClick={() => onTopicSelect(topic.query)}
            className="group p-3 text-left bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg hover:border-purple-400 hover:shadow-sm transition-all"
          >
            <div className="text-xl mb-1">{topic.icon}</div>
            <h4 className="font-semibold text-sm text-gray-900 group-hover:text-purple-600 transition-colors">
              {topic.title}
            </h4>
          </button>
        ))}
      </div>
    </div>
  );
}
