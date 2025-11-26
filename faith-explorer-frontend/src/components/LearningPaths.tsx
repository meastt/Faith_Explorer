import { Map, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  steps: { title: string; query: string; }[];
  icon: string;
}

const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'foundations',
    title: 'Foundations of Faith',
    description: 'Explore core beliefs across traditions',
    icon: '🏛️',
    steps: [
      { title: 'Understanding the Divine', query: 'What is God or the divine?' },
      { title: 'Sacred Texts', query: 'What are the holy scriptures?' },
      { title: 'Creation & Origins', query: 'How was the world created?' },
    ],
  },
  {
    id: 'ethics',
    title: 'Ethics & Morality',
    description: 'Learn moral teachings and principles',
    icon: '⚖️',
    steps: [
      { title: 'The Golden Rule', query: 'How should we treat others?' },
      { title: 'Justice & Fairness', query: 'What is justice?' },
      { title: 'Compassion', query: 'What is compassion?' },
    ],
  },
  {
    id: 'spiritual',
    title: 'Spiritual Practice',
    description: 'Discover prayer, meditation, and worship',
    icon: '🙏',
    steps: [
      { title: 'Prayer & Meditation', query: 'How should we pray?' },
      { title: 'Worship & Ritual', query: 'How do we worship?' },
      { title: 'Fasting & Discipline', query: 'What is the purpose of fasting?' },
    ],
  },
];

interface LearningPathsProps {
  onStepSelect: (query: string, pathId: string, stepIndex: number) => void;
}

export function LearningPaths({ onStepSelect }: LearningPathsProps) {
  const [expandedPath, setExpandedPath] = useState<string | null>(null);

  return (
    <div className="bg-sand-50 dark:bg-stone-800/50 rounded-2xl border border-sand-200 dark:border-stone-700 p-5 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Map className="w-5 h-5 text-bronze-600 dark:text-bronze-400" />
        <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wide">
          Guided Paths
        </h3>
      </div>

      <div className="space-y-3">
        {LEARNING_PATHS.map((path) => {
          const isExpanded = expandedPath === path.id;

          return (
            <div 
              key={path.id} 
              className={`
                border rounded-xl transition-all duration-300 overflow-hidden
                ${isExpanded 
                  ? 'bg-white dark:bg-stone-800 border-bronze-300 shadow-paper' 
                  : 'bg-white dark:bg-stone-800 border-sand-200 dark:border-stone-600 hover:border-bronze-200'}
              `}
            >
              <button
                onClick={() => setExpandedPath(isExpanded ? null : path.id)}
                className="w-full p-3 text-left flex items-center gap-3"
              >
                <span className="text-2xl">{path.icon}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 leading-tight">
                    {path.title}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5">
                    {path.description}
                  </p>
                </div>
                <ChevronRight className={`w-4 h-4 text-stone-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </button>

              {isExpanded && (
                <div className="px-3 pb-3 pt-0">
                  <div className="h-px w-full bg-sand-100 dark:bg-stone-700 mb-3"></div>
                  <div className="space-y-1">
                    {path.steps.map((step, stepIndex) => (
                      <button
                        key={stepIndex}
                        onClick={() => onStepSelect(step.query, path.id, stepIndex)}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-sand-50 dark:hover:bg-stone-700 transition-colors text-left group"
                      >
                        <div className="w-5 h-5 rounded-full bg-sand-200 dark:bg-stone-600 text-stone-600 dark:text-stone-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0 group-hover:bg-bronze-100 group-hover:text-bronze-700">
                          {stepIndex + 1}
                        </div>
                        <span className="text-sm text-stone-700 dark:text-stone-300 font-medium group-hover:text-bronze-800 dark:group-hover:text-bronze-200">
                          {step.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}