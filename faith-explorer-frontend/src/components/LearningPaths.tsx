import { Route } from 'lucide-react';
import { useState } from 'react';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  steps: { title: string; query: string; completed?: boolean }[];
  icon: string;
  color: string;
}

const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'foundations',
    title: 'Foundations of Faith',
    description: 'Explore core beliefs across traditions',
    icon: '🏛️',
    color: 'blue',
    steps: [
      { title: 'Understanding the Divine', query: 'What is God or the divine?' },
      { title: 'Sacred Texts', query: 'What are the holy scriptures?' },
      { title: 'Creation & Origins', query: 'How was the world created?' },
      { title: 'Human Purpose', query: 'Why do humans exist?' },
    ],
  },
  {
    id: 'ethics',
    title: 'Ethics & Morality',
    description: 'Learn moral teachings and principles',
    icon: '⚖️',
    color: 'green',
    steps: [
      { title: 'The Golden Rule', query: 'How should we treat others?' },
      { title: 'Justice & Fairness', query: 'What is justice?' },
      { title: 'Compassion', query: 'What is compassion?' },
      { title: 'Forgiveness', query: 'How do we forgive?' },
    ],
  },
  {
    id: 'spiritual',
    title: 'Spiritual Practice',
    description: 'Discover prayer, meditation, and worship',
    icon: '🙏',
    color: 'purple',
    steps: [
      { title: 'Prayer & Meditation', query: 'How should we pray?' },
      { title: 'Worship & Ritual', query: 'How do we worship?' },
      { title: 'Fasting & Discipline', query: 'What is the purpose of fasting?' },
      { title: 'Community & Fellowship', query: 'Why gather in community?' },
    ],
  },
  {
    id: 'journey',
    title: 'Life\'s Journey',
    description: 'Navigate life stages and transitions',
    icon: '🌱',
    color: 'amber',
    steps: [
      { title: 'Birth & Beginning', query: 'What is the significance of birth?' },
      { title: 'Growth & Learning', query: 'How should we pursue wisdom?' },
      { title: 'Suffering & Trials', query: 'How do we face hardship?' },
      { title: 'Death & Afterlife', query: 'What happens after death?' },
    ],
  },
];

interface LearningPathsProps {
  onStepSelect: (query: string, pathId: string, stepIndex: number) => void;
}

export function LearningPaths({ onStepSelect }: LearningPathsProps) {
  const [expandedPath, setExpandedPath] = useState<string | null>(null);

  const colorClasses = {
    blue: 'from-blue-500 to-indigo-600',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-purple-500 to-pink-600',
    amber: 'from-amber-500 to-orange-600',
  };

  return (
    <div className="bg-white dark:bg-gray-800 sepia:bg-amber-50 rounded-2xl border border-gray-200 dark:border-gray-700 sepia:border-amber-200 p-4 shadow-soft h-full">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <Route className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 sepia:text-amber-900">Learning Paths</h3>
      </div>

      <div className="space-y-2">
        {LEARNING_PATHS.slice(0, 3).map((path) => {
          const isExpanded = expandedPath === path.id;

          return (
            <div key={path.id} className="border border-gray-200 dark:border-gray-600 sepia:border-amber-300 rounded-lg overflow-hidden transition-all">
              <button
                onClick={() => setExpandedPath(isExpanded ? null : path.id)}
                className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 sepia:hover:bg-amber-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-9 h-9 bg-gradient-to-br ${colorClasses[path.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center text-lg flex-shrink-0`}>
                    {path.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 sepia:text-amber-900 truncate">{path.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 sepia:text-amber-600">{path.steps.length} steps</p>
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-200 dark:border-gray-600 sepia:border-amber-300 p-2 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100">
                  <div className="space-y-1">
                    {path.steps.map((step, stepIndex) => (
                      <button
                        key={stepIndex}
                        onClick={() => onStepSelect(step.query, path.id, stepIndex)}
                        className="w-full flex items-center gap-2 p-2 bg-white dark:bg-gray-600 sepia:bg-amber-50 hover:bg-gray-100 dark:hover:bg-gray-500 sepia:hover:bg-amber-200 border border-gray-200 dark:border-gray-500 sepia:border-amber-300 rounded-md transition-colors text-left group"
                      >
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100 dark:bg-gray-400 sepia:bg-amber-200 text-gray-500 dark:text-gray-800 sepia:text-amber-800">
                          <span className="text-xs font-semibold">{stepIndex + 1}</span>
                        </div>
                        <p className="text-xs font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900 group-hover:text-blue-600 dark:group-hover:text-blue-400 sepia:group-hover:text-amber-700 transition-colors">
                          {step.title}
                        </p>
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
