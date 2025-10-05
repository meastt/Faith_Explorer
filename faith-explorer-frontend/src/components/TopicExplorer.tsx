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
    <div className="bg-white dark:bg-gray-800 sepia:bg-amber-50 rounded-2xl border border-gray-200 dark:border-gray-700 sepia:border-amber-200 p-4 shadow-soft h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Compass className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 sepia:text-amber-900">Quick Topics</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {TOPICS.slice(0, 6).map((topic) => (
          <button
            key={topic.id}
            onClick={() => onTopicSelect(topic.query)}
            className="group p-3 text-left bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 sepia:from-amber-100 sepia:to-amber-50 border border-gray-200 dark:border-gray-600 sepia:border-amber-300 rounded-lg hover:border-purple-400 dark:hover:border-purple-500 sepia:hover:border-amber-400 hover:shadow-soft transition-all duration-200"
          >
            <div className="text-xl mb-2">{topic.icon}</div>
            <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 sepia:text-amber-900 group-hover:text-purple-600 dark:group-hover:text-purple-400 sepia:group-hover:text-amber-700 transition-colors">
              {topic.title}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 sepia:text-amber-700 mt-1 line-clamp-2">
              {topic.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
