import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle } from 'lucide-react';
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
    {
        id: 'hindu',
        name: 'Pandit Sharma',
        faith: 'Hinduism',
        traits: 'Spiritual, philosophical, embraces diversity',
        avatar: '🕉️',
        color: '#ea580c' // orange-600
    },
    {
        id: 'sikh',
        name: 'Bhai Harpreet',
        faith: 'Sikhism',
        traits: 'Humble, service-oriented, values equality',
        avatar: '🙏',
        color: '#c2410c' // orange-700
    },
    {
        id: 'taoist',
        name: 'Master Chen',
        faith: 'Taoism',
        traits: 'Peaceful, naturalistic, speaks in paradoxes',
        avatar: '☯️',
        color: '#0891b2' // cyan-600
    },
    {
        id: 'confucian',
        name: 'Teacher Wei',
        faith: 'Confucianism',
        traits: 'Scholarly, emphasizes virtue and relationships',
        avatar: '📚',
        color: '#be123c' // rose-700
    },
    {
        id: 'shinto',
        name: 'Kannushi Tanaka',
        faith: 'Shinto',
        traits: 'Reverent of nature, ceremonial, harmonious',
        avatar: '⛩️',
        color: '#db2777' // pink-600
    },
];

interface ScenarioOption {
    id: string;
    title: string;
    description: string;
    icon: string;
}

const SCENARIOS: ScenarioOption[] = [
    {
        id: "introduction",
        title: "Meet & Greet",
        description: "Introduce yourself and learn about their faith journey",
        icon: "👋"
    },
    {
        id: "dietary-rules",
        title: "Dietary Practices",
        description: "Ask about food customs, fasting, and dietary laws",
        icon: "🍽️"
    },
    {
        id: "prayer-habits",
        title: "Prayer & Worship",
        description: "Discuss prayer routines and worship practices",
        icon: "🙏"
    },
    {
        id: "charity",
        title: "Charity & Giving",
        description: "Explore the role of generosity and helping others",
        icon: "💝"
    },
    {
        id: "suffering",
        title: "Life's Challenges",
        description: "Discuss perspectives on suffering and hardship",
        icon: "🌱"
    }
];

export function PersonaSelector({ onSelect }: PersonaSelectorProps) {
    const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);

    if (selectedPersona) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Back button & persona preview */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => setSelectedPersona(null)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${selectedPersona.color}20` }}>
                            {selectedPersona.avatar}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-gray-100">{selectedPersona.name}</h3>
                            <p className="text-xs text-gray-500">{selectedPersona.faith}</p>
                        </div>
                    </div>
                </div>

                <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">What would you like to discuss?</h2>
                    <p className="text-gray-500 text-sm">Choose a topic to practice respectful dialogue.</p>
                </div>

                <div className="space-y-3">
                    {SCENARIOS.map((scenario) => (
                        <motion.button
                            key={scenario.id}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => onSelect(selectedPersona, scenario.title)}
                            className="w-full text-left bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all flex items-center gap-4 group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                {scenario.icon}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">{scenario.title}</h4>
                                <p className="text-sm text-gray-500">{scenario.description}</p>
                            </div>
                            <MessageCircle className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-colors" />
                        </motion.button>
                    ))}
                </div>
            </div>
        );
    }

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
                        onClick={() => setSelectedPersona(persona)}
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
