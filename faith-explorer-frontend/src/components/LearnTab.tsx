import { useState, useEffect } from 'react';
import { Compass, Lock, Check, ChevronRight, PlayCircle, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LEARNING_PATHS, type LearningPath } from '../data/learningPaths';
import { useStore } from '../store/useStore';
import { PathDetail } from './PathDetail';

type LearnView = 'browse' | 'path';

interface LearnTabProps {
    onDialogueClick?: () => void;
}

export function LearnTab({ onDialogueClick }: LearnTabProps = {}) {
    const { t } = useTranslation('learn');
    const { t: tSearch } = useTranslation('search');
    const [view, setView] = useState<LearnView>('browse');
    const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
    const { learningProgress, usage } = useStore();

    // Scroll to top when this tab mounts
    useEffect(() => {
        requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        });
    }, []);

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

    // Map data file IDs (kebab-case) to locale keys (camelCase) where they differ
    const pathIdToKey: Record<string, string> = {
        'inner-peace': 'innerPeace',
        'golden-rule': 'goldenRule',
    };
    const getLocaleKey = (id: string) => pathIdToKey[id] || id;

    // Helper to get translated path field
    const getPathTitle = (path: LearningPath) =>
        t(`learningPaths.${getLocaleKey(path.id)}.title`, { defaultValue: path.title });
    const getPathDescription = (path: LearningPath) =>
        t(`learningPaths.${getLocaleKey(path.id)}.description`, { defaultValue: path.description });
    const getPathDuration = (path: LearningPath) =>
        t(`learningPaths.${getLocaleKey(path.id)}.duration`, { defaultValue: path.duration });

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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sepia:text-amber-900">{t('learnTab.title')}</h1>
                <p className="text-gray-600 dark:text-gray-400 sepia:text-amber-700 mt-1">{t('learnTab.subtitle')}</p>
            </div>

            {/* Active Path Banner */}
            {activePath && (
                <button
                    onClick={() => handleSelectPath(activePath)}
                    className="w-full p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl text-left text-white shadow-lg hover:shadow-xl transition-shadow"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-indigo-100 text-sm font-medium">{t('learnTab.continueJourney')}</p>
                            <h3 className="text-lg font-bold mt-0.5">{activePath.icon} {getPathTitle(activePath)}</h3>
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
                                    {t('learnTab.dayOfTotal', { current: activeProgress.length + 1, total: activePath.days.length })}
                                </span>
                            </div>
                        </div>
                        <ChevronRight className="w-6 h-6" />
                    </div>
                </button>
            )}

            {/* Path Cards */}
            <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 sepia:text-amber-900">
                    {activePath ? t('learnTab.otherPaths') : t('learnTab.chooseAPath')}
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
                            className={`w-full p-4 bg-white dark:bg-gray-800 sepia:bg-amber-50 rounded-xl border text-left transition-all ${isLocked
                                ? 'border-gray-200 dark:border-gray-700 sepia:border-amber-200 opacity-75 cursor-not-allowed'
                                : 'border-gray-200 dark:border-gray-700 sepia:border-amber-300 hover:border-indigo-300 dark:hover:border-indigo-600 sepia:hover:border-amber-400 hover:shadow-md'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="text-3xl">{path.icon}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 sepia:text-amber-900">{getPathTitle(path)}</h3>
                                        {isLocked && <Lock className="w-4 h-4 text-gray-400" />}
                                        {isCompleted && <Check className="w-4 h-4 text-green-500" />}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700 mt-0.5 line-clamp-2">
                                        {getPathDescription(path)}
                                    </p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-xs text-gray-500 dark:text-gray-400 sepia:text-amber-600">{getPathDuration(path)}</span>
                                        {progress.length > 0 && !isCompleted && (
                                            <span className="text-xs text-indigo-600 dark:text-indigo-400 sepia:text-amber-700">
                                                {t('learnTab.daysComplete', { completed: progress.length, total: path.days.length })}
                                            </span>
                                        )}
                                        {path.premium && (
                                            <span className="text-xs px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                                                {t('learnTab.premium')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <PlayCircle className={`w-5 h-5 ${isLocked ? 'text-gray-300 sepia:text-amber-300' : 'text-indigo-500 sepia:text-amber-600'}`} />
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Dialogue Simulator Link - More Prominent */}
            <div className="pt-6">
                <button
                    onClick={() => onDialogueClick?.()}
                    className="w-full p-5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl text-left text-white shadow-lg hover:shadow-xl transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-2xl backdrop-blur-sm">
                            <MessageCircle className="w-7 h-7" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1">{tSearch('dialogue.chatWithGuidesTitle')}</h3>
                            <p className="text-sm text-indigo-100">{tSearch('dialogue.chatWithGuidesDescription')}</p>
                        </div>
                        <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                    </div>
                </button>
            </div>
        </div>
    );
}
