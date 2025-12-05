import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp, Users } from 'lucide-react';
import { useStore } from '../store/useStore';

export interface Challenge {
    id: string;
    title: string;
    description: string;
    goal: number; // e.g., 7 days or 5 acts
    unit: string; // "days", "acts"
    globalCount: number;
    icon: string;
    color: string;
}

interface ChallengeCardProps {
    challenge: Challenge;
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
    const { activeChallenges, joinChallenge, logAction, completedActions } = useStore();
    const isActive = activeChallenges.includes(challenge.id);
    const myProgress = completedActions[challenge.id] || 0;
    const progressPercent = Math.min((myProgress / challenge.goal) * 100, 100);
    const isCompleted = myProgress >= challenge.goal;

    return (
        <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">

            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-bl-full" style={{ backgroundColor: challenge.color }} />

            <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm" style={{ backgroundColor: `${challenge.color}20` }}>
                            {challenge.icon}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-gray-100">{challenge.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-1">{challenge.description}</p>
                        </div>
                    </div>

                    {isCompleted && (
                        <div className="bg-green-100 text-green-700 p-1.5 rounded-full">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                    )}
                </div>

                {!isActive ? (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Users className="w-4 h-4" />
                            <span>{challenge.globalCount.toLocaleString()} participants</span>
                        </div>
                        <button
                            onClick={() => joinChallenge(challenge.id)}
                            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
                            style={{ backgroundColor: challenge.color }}
                        >
                            Join Challenge
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Progress Bar */}
                        <div>
                            <div className="flex justify-between text-xs font-semibold mb-1.5">
                                <span style={{ color: challenge.color }}>
                                    {myProgress} / {challenge.goal} {challenge.unit}
                                </span>
                                <span className="text-gray-400">{Math.round(progressPercent)}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: challenge.color }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>

                        {!isCompleted && (
                            <button
                                onClick={() => logAction(challenge.id)}
                                className="w-full py-2 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-xl border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center gap-2 transition-colors"
                            >
                                <TrendingUp className="w-4 h-4 text-gray-400" />
                                Log Activity
                            </button>
                        )}

                        {isCompleted && (
                            <div className="text-center py-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <span className="text-xs font-bold text-green-600 dark:text-green-400">Challenge Completed! 🎉</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
