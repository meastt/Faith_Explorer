import { X, BookOpen, GitCompare, MessageCircle, Star } from 'lucide-react';
import { useState } from 'react';

interface OnboardingModalProps {
  onClose: () => void;
}

export function OnboardingModal({ onClose }: OnboardingModalProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: BookOpen,
      title: 'Welcome to Faith Explorer',
      description: 'Explore and compare sacred texts from 9 major world religions. Ask questions and discover wisdom across traditions.',
      examples: [
        'What is love?',
        'What is the meaning of life?',
        'How should we treat others?',
      ],
    },
    {
      icon: GitCompare,
      title: 'Compare Traditions',
      description: 'Switch to comparison mode to see how different religions approach the same topic. Get AI-powered comparative analysis.',
      examples: [
        'Views on compassion',
        'Perspectives on suffering',
        'The golden rule',
      ],
    },
    {
      icon: MessageCircle,
      title: 'Chat with Verses',
      description: 'Click on any verse to chat about it. Ask for context, interpretations, or related teachings.',
      examples: [
        'What does this verse mean?',
        'Are there similar verses?',
        'Tell me more about the context',
      ],
    },
    {
      icon: Star,
      title: 'Unlock Full Potential',
      description: 'Upgrade to Premium for unlimited searches, deep dives, and priority support. Start your journey to wisdom today.',
      examples: [
        'Unlimited Searches',
        'Advanced Comparisons',
        'Priority Support',
      ],
    },
  ];

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-sand-50 dark:bg-stone-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 relative border border-sand-200 dark:border-stone-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-sand-200 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5 text-stone-500" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-bronze-100 dark:bg-bronze-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-bronze-200 dark:border-bronze-800">
            <Icon className="w-8 h-8 text-bronze-600 dark:text-bronze-400" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-2">{currentStep.title}</h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{currentStep.description}</p>
        </div>

        <div className="bg-sand-100 dark:bg-stone-800/50 rounded-xl p-5 mb-8 border border-sand-200 dark:border-stone-700">
          <h3 className="text-xs font-bold uppercase tracking-wider text-bronze-700 dark:text-bronze-400 mb-3">Try asking:</h3>
          <div className="space-y-2">
            {currentStep.examples.map((example, idx) => (
              <div key={idx} className="bg-white dark:bg-stone-800 rounded-lg px-4 py-3 text-sm text-stone-700 dark:text-stone-300 shadow-sm border border-sand-100 dark:border-stone-700 font-medium">
                "{example}"
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${idx === step ? 'bg-bronze-600 dark:bg-bronze-500' : 'bg-sand-300 dark:bg-stone-700'
                  }`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            {step < steps.length - 1 ? (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 font-medium transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-2 bg-bronze-600 text-white rounded-lg hover:bg-bronze-700 font-medium transition-colors shadow-md shadow-bronze-900/10"
                >
                  Next
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="px-6 py-2 bg-bronze-600 text-white rounded-lg hover:bg-bronze-700 font-medium transition-colors shadow-md shadow-bronze-900/10"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
