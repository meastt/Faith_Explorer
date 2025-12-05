import { motion } from 'framer-motion';
import type { Persona } from '../services/api';

interface PersonaSelectorProps {
    onSelect: (persona: Persona, scenario: string) => void;
}

export const PERSONAS: Persona[] = [
    {
        id: 'muslim',
        name: 'Brother Ahmed',
        faith: 'Islam',
        traits: 'Warm, community-focused, values hospitality',
        avatar: '🕌',
        color: '#059669' // emerald-600
    },
    {
        id: 'christian',
        name: 'Rev. Sarah',
        faith: 'Christianity',
        traits: 'Theologically minded, gentle, engaging',
        avatar: '✝️',
        color: '#7c3aed' // violet-600
    },
    {
        id: 'jewish',
        name: 'Rabbi Cohen',
        faith: 'Judaism',
        traits: 'Analytical, encourages questions, wise',
        avatar: '✡️',
        color: '#2563eb' // blue-600
    },
    {
        id: 'buddhist',
        name: 'Monk Tenzin',
        faith: 'Buddhism',
        traits: 'Calm, mindful, direct but kind',
        avatar: '☸️',
        color: '#d97706' // amber-600
    },
];

const SCENARIOS = [
    "General Greeting",
    "Ask about Dietary Rules",
    "Ask about Prayer Habits",
    "Discuss Charity",
    "Discuss Suffering"
];

export function PersonaSelector({ onSelect }: PersonaSelectorProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Select a Practice Partner</h2>
                <p className="text-gray-500">Choose a guide to practice respectful dialogue with.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PERSONAS.map(persona => (
                    <motion.div
                        key={persona.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden group"
                        onClick={() => onSelect(persona, SCENARIOS[0])} // Default scenario for now
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-white/5 opacity-10 rounded-bl-full" style={{ backgroundColor: persona.color }}></div>

                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-soft" style={{ backgroundColor: `${persona.color}20` }}>
                                {persona.avatar}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{persona.name}</h3>
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                                    {persona.faith}
                                </span>
                                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                                    {persona.traits}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
