import { ArrowLeft, Check, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { type LearningPath } from '../data/learningPaths';
import { useStore } from '../store/useStore';

interface PathDetailProps {
    path: LearningPath;
    onBack: () => void;
}

export function PathDetail({ path, onBack }: PathDetailProps) {
    const { learningProgress, startPath, completeDay, usage } = useStore();
    const [expandedDay, setExpandedDay] = useState<number | null>(null);

    const completedDays = learningProgress.completedDays[path.id] || [];
    const isStarted = learningProgress.startedAt[path.id] !== undefined;
    const isLocked = path.premium && !usage.isPremium;

    // Find current day (first incomplete day)
    const currentDay = path.days.find(d => !completedDays.includes(d.day))?.day || path.days.length;

    const handleStart = () => {
        if (isLocked) return;
        startPath(path.id);
        setExpandedDay(1);
    };

    const handleCompleteDay = (day: number) => {
        completeDay(path.id, day);
        // Auto-expand next day
        if (day < path.days.length) {
            setExpandedDay(day + 1);
        }
    };

    const toggleDay = (day: number) => {
        setExpandedDay(expandedDay === day ? null : day);
    };

    // Auto-expand current day if nothing expanded
    if (expandedDay === null && isStarted && currentDay <= path.days.length) {
        setExpandedDay(currentDay);
    }

    return (
        <div className="pb-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {path.icon} {path.title}
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{path.duration}</p>
                </div>
            </div>

            {/* Progress */}
            <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Progress</span>
                    <span>{completedDays.length} / {path.days.length} days</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                        style={{ width: `${(completedDays.length / path.days.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Locked Notice */}
            {isLocked && (
                <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                    <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        <div>
                            <p className="font-medium text-amber-900 dark:text-amber-100">Premium Path</p>
                            <p className="text-sm text-amber-700 dark:text-amber-300">Upgrade to access this learning journey.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Start Button */}
            {!isStarted && !isLocked && (
                <button
                    onClick={handleStart}
                    className="w-full mb-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                    Begin Journey
                </button>
            )}

            {/* Day List */}
            <div className="space-y-3">
                {path.days.map((day) => {
                    const isCompleted = completedDays.includes(day.day);
                    const isExpanded = expandedDay === day.day;
                    const isAccessible = isStarted && (isCompleted || day.day <= currentDay) && !isLocked;

                    return (
                        <div
                            key={day.day}
                            className={`border rounded-xl overflow-hidden transition-all ${isCompleted
                                    ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10'
                                    : isAccessible
                                        ? 'border-indigo-200 dark:border-indigo-800 bg-white dark:bg-gray-800'
                                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60'
                                }`}
                        >
                            {/* Day Header */}
                            <button
                                onClick={() => isAccessible && toggleDay(day.day)}
                                disabled={!isAccessible}
                                className="w-full p-4 flex items-center gap-3 text-left"
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isCompleted
                                            ? 'bg-green-500 text-white'
                                            : isAccessible
                                                ? 'bg-indigo-500 text-white'
                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                                        }`}
                                >
                                    {isCompleted ? <Check className="w-4 h-4" /> : day.day}
                                </div>
                                <div className="flex-1">
                                    <h3 className={`font-medium ${isAccessible ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500'
                                        }`}>
                                        {day.title}
                                    </h3>
                                    <p className="text-sm text-gray-500">{day.verse.religion}</p>
                                </div>
                                {isAccessible && (
                                    isExpanded
                                        ? <ChevronUp className="w-5 h-5 text-gray-400" />
                                        : <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                            </button>

                            {/* Expanded Content */}
                            {isExpanded && isAccessible && (
                                <div className="px-4 pb-4 space-y-4 border-t border-gray-100 dark:border-gray-700">
                                    {/* Verse */}
                                    <div className="pt-4">
                                        <blockquote className="italic text-gray-700 dark:text-gray-300 border-l-4 border-indigo-500 pl-4">
                                            "{day.verse.text}"
                                        </blockquote>
                                        <p className="text-sm text-gray-500 mt-2">— {day.verse.reference}</p>
                                    </div>

                                    {/* Reflection */}
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Reflection</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                            {day.reflection}
                                        </p>
                                    </div>

                                    {/* Question */}
                                    {day.question && (
                                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                            <h4 className="font-medium text-indigo-900 dark:text-indigo-100 mb-1 text-sm">
                                                Journaling Prompt
                                            </h4>
                                            <p className="text-indigo-700 dark:text-indigo-300 text-sm">
                                                {day.question}
                                            </p>
                                        </div>
                                    )}

                                    {/* Complete Button */}
                                    {!isCompleted && (
                                        <button
                                            onClick={() => handleCompleteDay(day.day)}
                                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                                        >
                                            Mark Day Complete
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Completion Message */}
            {completedDays.length === path.days.length && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white text-center">
                    <p className="text-lg font-bold">🎉 Journey Complete!</p>
                    <p className="text-sm text-green-100 mt-1">
                        You've finished {path.title}. The wisdom lives on in you.
                    </p>
                </div>
            )}
        </div>
    );
}
