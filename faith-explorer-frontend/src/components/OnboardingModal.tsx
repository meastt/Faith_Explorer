import { X, BookOpen, GitCompare, MessageCircle } from 'lucide-react';
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
  ];

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentStep.title}</h2>
          <p className="text-gray-600">{currentStep.description}</p>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 mb-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Try asking:</h3>
          <div className="space-y-2">
            {currentStep.examples.map((example, idx) => (
              <div key={idx} className="bg-white rounded-lg px-3 py-2 text-sm text-gray-700">
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
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === step ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            {step < steps.length - 1 ? (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  Skip
                </button>
                <button
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Next
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
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
