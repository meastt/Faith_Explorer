import { Route, Check, Lock } from 'lucide-react';
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
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <Route className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Learning Paths</h3>
          <p className="text-sm text-gray-600">Guided journeys through faith traditions</p>
        </div>
      </div>

      <div className="space-y-3">
        {LEARNING_PATHS.map((path) => {
          const isExpanded = expandedPath === path.id;

          return (
            <div key={path.id} className="border-2 border-gray-200 rounded-xl overflow-hidden transition-all">
              <button
                onClick={() => setExpandedPath(isExpanded ? null : path.id)}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[path.color as keyof typeof colorClasses]} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
                    {path.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{path.title}</h4>
                    <p className="text-sm text-gray-600">{path.description}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {path.steps.length} steps
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="space-y-2">
                    {path.steps.map((step, stepIndex) => {
                      const completed = step.completed || false;

                      return (
                        <button
                          key={stepIndex}
                          onClick={() => onStepSelect(step.query, path.id, stepIndex)}
                          className="w-full flex items-center gap-3 p-3 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors text-left group"
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            completed
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-400'
                          }`}>
                            {completed ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <span className="text-xs font-semibold">{stepIndex + 1}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {step.title}
                            </p>
                          </div>
                        </button>
                      );
                    })}
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
