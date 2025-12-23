import { useState } from 'react';
import { Compass, Lock, Check, ChevronRight, PlayCircle, MessageCircle } from 'lucide-react';
import { LEARNING_PATHS, type LearningPath } from '../data/learningPaths';
import { useStore } from '../store/useStore';
import { PathDetail } from './PathDetail';
import { DialogueSimulator } from './DialogueSimulator';

type LearnView = 'browse' | 'path' | 'dialogue';

export function LearnTab() {
    const [view, setView] = useState<LearnView>('browse');
    const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
    const { learningProgress, usage } = useStore();

    const handleSelectPath = (path: LearningPath) => {
        setSelectedPath(path);
        setView('path');
    };

    const handleBack = () => {
        setView('browse');
        setSelectedPath(null);
    };

    if (view === 'path' && selectedPath) {
        return <PathDetail path={selectedPath} onBack={handleBack} />;
    }

    if (view === 'dialogue') {
        return (
            <div className="pb-8">
                <button
                    onClick={() => setView('browse')}
                    className="mb-4 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                    ← Back to Learning Paths
                </button>
                <DialogueSimulator />
            </div>
        );
    }

    // Get active path details
    const activePath = learningProgress.activePath
        ? LEARNING_PATHS.find(p => p.id === learningProgress.activePath)
        : null;
    const activeProgress = activePath
        ? learningProgress.completedDays[activePath.id] || []
        : [];

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-3">
                    <Compass className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Learning Paths</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Structured journeys through sacred wisdom</p>
            </div>

            {/* Active Path Banner */}
            {activePath && (
                <button
                    onClick={() => handleSelectPath(activePath)}
                    className="w-full p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl text-left text-white shadow-lg hover:shadow-xl transition-shadow"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-indigo-100 text-sm font-medium">Continue Your Journey</p>
                            <h3 className="text-lg font-bold mt-0.5">{activePath.icon} {activePath.title}</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="flex gap-1">
                                    {activePath.days.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-2 h-2 rounded-full ${activeProgress.includes(i + 1) ? 'bg-white' : 'bg-white/30'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-indigo-100">
                                    Day {activeProgress.length + 1} of {activePath.days.length}
                                </span>
                            </div>
                        </div>
                        <ChevronRight className="w-6 h-6" />
                    </div>
                </button>
            )}

            {/* Path Cards */}
            <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {activePath ? 'Other Paths' : 'Choose a Path'}
                </h2>

                {LEARNING_PATHS.filter(p => p.id !== activePath?.id).map((path) => {
                    const progress = learningProgress.completedDays[path.id] || [];
                    const isLocked = path.premium && !usage.isPremium;
                    const isCompleted = progress.length === path.days.length;

                    return (
                        <button
                            key={path.id}
                            onClick={() => !isLocked && handleSelectPath(path)}
                            disabled={isLocked}
                            className={`w-full p-4 bg-white dark:bg-gray-800 rounded-xl border text-left transition-all ${isLocked
                                ? 'border-gray-200 dark:border-gray-700 opacity-75 cursor-not-allowed'
                                : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="text-3xl">{path.icon}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{path.title}</h3>
                                        {isLocked && <Lock className="w-4 h-4 text-gray-400" />}
                                        {isCompleted && <Check className="w-4 h-4 text-green-500" />}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">
                                        {path.description}
                                    </p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-xs text-gray-500 dark:text-gray-500">{path.duration}</span>
                                        {progress.length > 0 && !isCompleted && (
                                            <span className="text-xs text-indigo-600 dark:text-indigo-400">
                                                {progress.length}/{path.days.length} days complete
                                            </span>
                                        )}
                                        {path.premium && (
                                            <span className="text-xs px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                                                Premium
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <PlayCircle className={`w-5 h-5 ${isLocked ? 'text-gray-300' : 'text-indigo-500'}`} />
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Dialogue Simulator Link */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setView('dialogue')}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 text-left hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <MessageCircle className="w-6 h-6 text-indigo-500" />
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">Interfaith Dialogue</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Practice discussing faith topics</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                    </div>
                </button>
            </div>
        </div>
    );
}
