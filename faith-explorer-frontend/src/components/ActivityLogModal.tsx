import { useState } from 'react';
import { X, Send, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import type { Challenge } from './ChallengeCard';

interface ActivityLogModalProps {
    challenge: Challenge;
    onClose: () => void;
}

export function ActivityLogModal({ challenge, onClose }: ActivityLogModalProps) {
    const [note, setNote] = useState('');
    const [showHistory, setShowHistory] = useState(false);
    const { logAction, getActivityLogs, completedActions } = useStore();
    
    const logs = getActivityLogs(challenge.id);
    const myProgress = completedActions[challenge.id] || 0;
    const isCompleted = myProgress >= challenge.goal;

    const handleSubmit = () => {
        if (!note.trim()) return;
        logAction(challenge.id, note.trim());
        setNote('');
        // Optionally close or show success
        if (myProgress + 1 >= challenge.goal) {
            // Challenge completed!
            setTimeout(onClose, 500);
        }
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    const placeholders: Record<string, string> = {
        'gratitude-week': 'What are you grateful for today?',
        'charity-drive': 'How did you show generosity today?',
        'interfaith-reader': 'What wisdom did you discover?'
    };

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-x-4 top-[15%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
                {/* Header */}
                <div className="relative px-6 py-5 text-white overflow-hidden" style={{ backgroundColor: challenge.color }}>
                    <div className="absolute top-0 right-0 opacity-20">
                        <span className="text-7xl">{challenge.icon}</span>
                    </div>
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Log Activity</p>
                            <h2 className="text-xl font-bold mt-1">{challenge.title}</h2>
                            <p className="text-sm opacity-80 mt-1">
                                {myProgress} of {challenge.goal} {challenge.unit} completed
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {!isCompleted ? (
                        <>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                What did you do?
                            </label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder={placeholders[challenge.id] || 'Describe your activity...'}
                                className="w-full h-32 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 dark:text-gray-100 placeholder-gray-400"
                                autoFocus
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={!note.trim()}
                                className="w-full mt-4 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:opacity-90"
                                style={{ backgroundColor: challenge.color }}
                            >
                                <Send className="w-4 h-4" />
                                Log This Activity
                            </button>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <span className="text-4xl mb-3 block">🎉</span>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Challenge Complete!</h3>
                            <p className="text-gray-500 mt-2">Amazing work! You've finished the {challenge.title} challenge.</p>
                        </div>
                    )}

                    {/* Activity History */}
                    {logs.length > 0 && (
                        <div className="mt-6 border-t border-gray-100 dark:border-gray-700 pt-4">
                            <button
                                onClick={() => setShowHistory(!showHistory)}
                                className="w-full flex items-center justify-between text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                            >
                                <span className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Your Activity Journal ({logs.length})
                                </span>
                                {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>

                            <AnimatePresence>
                                {showHistory && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-4 space-y-3 max-h-48 overflow-y-auto">
                                            {logs.map((log) => (
                                                <div
                                                    key={log.id}
                                                    className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3"
                                                >
                                                    <p className="text-sm text-gray-800 dark:text-gray-200">{log.note}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{formatDate(log.timestamp)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </motion.div>
        </>
    );
}
