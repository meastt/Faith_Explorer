import { Trophy, Globe2 } from 'lucide-react';
import { ChallengeCard, type Challenge } from './ChallengeCard';

const CHALLENGES: Challenge[] = [
    {
        id: 'gratitude-week',
        title: 'Week of Gratitude',
        description: 'Log one act of thanks daily for 7 days.',
        goal: 7,
        unit: 'days',
        globalCount: 1240,
        icon: '🙏',
        color: '#f59e0b'
    },
    {
        id: 'charity-drive',
        title: 'Generosity Month',
        description: 'Give to those in need (time or money).',
        goal: 5,
        unit: 'acts',
        globalCount: 890,
        icon: '💝',
        color: '#ec4899'
    },
    {
        id: 'interfaith-reader',
        title: 'Bridge Builder',
        description: 'Read texts from 3 different faiths.',
        goal: 3,
        unit: 'faiths',
        globalCount: 450,
        icon: '📚',
        color: '#6366f1'
    }
];

export function ChallengeDashboard() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">

            {/* Global Goal Card */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                    <Globe2 className="w-48 h-48" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2 text-indigo-100 text-sm font-medium uppercase tracking-wider">
                        <Trophy className="w-4 h-4" />
                        Community Goal
                    </div>
                    <h2 className="text-3xl font-bold mb-1">5,230</h2>
                    <p className="text-indigo-100 mb-6">Acts of Faith logged this week.</p>

                    <div className="h-2 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                        <div className="h-full bg-white/90 w-[75%] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                    </div>
                    <div className="flex justify-between text-xs mt-2 text-indigo-200">
                        <span>0</span>
                        <span>Target: 7,000</span>
                    </div>
                </div>
            </div>

            {/* Challenges Grid */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 px-1">Active Challenges</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {CHALLENGES.map(challenge => (
                        <ChallengeCard key={challenge.id} challenge={challenge} />
                    ))}
                </div>
            </div>

        </div>
    );
}
