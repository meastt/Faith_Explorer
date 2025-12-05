import { Map, PlayCircle } from 'lucide-react';
import { useState } from 'react';
import { ThreadView, type ThreadData } from './ThreadView';

// Curated "Golden Thread" Data
const GOLDEN_THREADS: ThreadData[] = [
  {
    id: 'golden-rule',
    title: 'The Golden Rule',
    description: 'The universal ethic of reciprocity found in every major tradition.',
    nodes: [
      {
        id: 'hindu-mahabharata',
        era: '3000 BCE ~',
        faith: 'Hinduism',
        title: 'The Sum of Duty',
        quote: 'This is the sum of duty: Do naught unto others which would cause you pain if done to you.',
        description: 'From the Mahabharata, highlighting that empathy is the root of dharma (duty).',
        color: '#f97316' // Orange
      },
      {
        id: 'confucius',
        era: '500 BCE',
        faith: 'Confucianism',
        title: 'Reciprocity (Shu)',
        quote: 'Do not impose on others what you yourself do not desire.',
        description: 'Confucius defines the single word that can guide a life: "Reciprocity".',
        color: '#ef4444' // Red
      },
      {
        id: 'hillel',
        era: '1st Century BCE',
        faith: 'Judaism',
        title: 'The Whole Torah',
        quote: 'That which is hateful to you, do not do to your fellow. That is the whole Torah.',
        description: 'Rabbi Hillel summation of the entire law while standing on one foot.',
        color: '#3b82f6' // Blue
      },
      {
        id: 'jesus',
        era: '1st Century CE',
        faith: 'Christianity',
        title: 'The Law & Prophets',
        quote: 'Do to others what you would have them do to you.',
        description: 'Jesus frames it positively (active benevolence) in the Sermon on the Mount.',
        color: '#8b5cf6' // Violet
      },
      {
        id: 'islam',
        era: '7th Century CE',
        faith: 'Islam',
        title: 'True Belief',
        quote: 'None of you truly believes until he wishes for his brother what he wishes for himself.',
        description: 'An-Nawawi\'s Forty Hadith, linking faith directly to social brotherhood.',
        color: '#10b981' // Emerald
      }
    ]
  },
  {
    id: 'hospitality',
    title: 'Sacred Hospitality',
    description: 'How treating the stranger as divine connects us all.',
    nodes: [
      {
        id: 'abraham',
        era: '2000 BCE',
        faith: 'Judaism/Islam',
        title: 'Abraham\'s Tent',
        quote: 'He saw three men standing nearby... and bowed low to the ground.',
        description: 'Abraham runs to welcome strangers, who turn out to be angels/divine messengers.',
        color: '#d97706' // Amber
      },
      {
        id: 'greek',
        era: '800 BCE',
        faith: 'Ancient Greek',
        title: 'Xenia',
        quote: 'Do not neglect to show hospitality to strangers.',
        description: 'The ancient code that Zeus protects strangers (Xenos). Violation invokes divine wrath.',
        color: '#0ea5e9' // Sky
      },
      {
        id: 'hindu-atithi',
        era: 'Variable',
        faith: 'Hinduism',
        title: 'Atithi Devo Bhava',
        quote: 'The guest is God.',
        description: 'A Sanskrit mantra from the Taittiriya Upanishad instructing to revere guests as deities.',
        color: '#f97316'
      }
    ]
  }
];

interface LearningPathsProps {
  onStepSelect: (query: string, pathId?: string, stepIndex?: number) => void;
}

export function LearningPaths({ onStepSelect }: LearningPathsProps) {
  const [activeThread, setActiveThread] = useState<ThreadData | null>(null);

  if (activeThread) {
    return <ThreadView thread={activeThread} onBack={() => setActiveThread(null)} />;
  }

  return (
    <div className="bg-sand-50 dark:bg-stone-800/50 rounded-2xl border border-sand-200 dark:border-stone-700 p-5 h-full relative overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <Map className="w-5 h-5 text-bronze-600 dark:text-bronze-400" />
        <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wide">
          Golden Thread Paths
        </h3>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-stone-600 dark:text-stone-400">
          Follow a single concept as it weaves through history and tradition.
        </p>

        {GOLDEN_THREADS.map((thread) => (
          <button
            key={thread.id}
            onClick={() => setActiveThread(thread)}
            className="w-full text-left group relative overflow-hidden bg-white dark:bg-stone-800 border border-sand-200 dark:border-stone-600 hover:border-bronze-400 dark:hover:border-bronze-500 rounded-xl p-4 shadow-sm transition-all hover:shadow-md"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-300 to-amber-600 opacity-60 group-hover:opacity-100 transition-opacity"></div>

            <div className="pl-3">
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 group-hover:text-bronze-700 dark:group-hover:text-bronze-300 transition-colors">
                  {thread.title}
                </h4>
                <PlayCircle className="w-5 h-5 text-stone-300 group-hover:text-bronze-500 transition-colors" />
              </div>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-snug pr-4">
                {thread.description}
              </p>

              <div className="flex gap-1 mt-3">
                {thread.nodes.map((node, i) => (
                  <div
                    key={i}
                    className="w-6 h-1.5 rounded-full"
                    style={{ backgroundColor: node.color, opacity: 0.6 }}
                  />
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}