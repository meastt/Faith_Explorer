import { Compass } from 'lucide-react';

interface TopicExplorerProps {
  onTopicSelect: (topic: string) => void;
}

const TOPICS = [
  'Love', 'Hope', 'Suffering', 'Forgiveness',
  'Peace', 'Justice', 'Family', 'Purpose',
  'Gratitude', 'Fear', 'Wisdom', 'Death'
];

export function TopicExplorer({ onTopicSelect }: TopicExplorerProps) {
  return (
    <div className="bg-sand-50 dark:bg-stone-800/50 rounded-2xl border border-sand-200 dark:border-stone-700 p-5 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Compass className="w-5 h-5 text-bronze-600 dark:text-bronze-400" />
        <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wide">
          Common Themes
        </h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {TOPICS.map((topic) => (
          <button
            key={topic}
            onClick={() => onTopicSelect(topic)}
            className="px-4 py-2 bg-white dark:bg-stone-700 border border-sand-200 dark:border-stone-600 rounded-full text-sm text-stone-600 dark:text-stone-300 font-medium hover:border-bronze-400 hover:text-bronze-700 dark:hover:text-bronze-200 hover:shadow-sm transition-all duration-200 active:scale-95"
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
}