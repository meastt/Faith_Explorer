import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation('search');
    const scenarios = t('dialogue.scenarios', { returnObjects: true }) as { id: string; title: string; description: string; icon: string }[];
    const translatedPersonas = t('dialogue.personas', { returnObjects: true }) as { id: string; name: string; faith: string; traits: string }[];
    const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);

    // Use translated scenarios, falling back to hardcoded SCENARIOS
    const displayScenarios = Array.isArray(scenarios) ? scenarios : SCENARIOS;

    // Build display personas by overlaying translated data onto hardcoded PERSONAS
    const displayPersonas: Persona[] = PERSONAS.map(persona => {
        if (Array.isArray(translatedPersonas)) {
            const translated = translatedPersonas.find(tp => tp.id === persona.id);
            if (translated) {
                return {
                    ...persona,
                    name: translated.name || persona.name,
                    faith: translated.faith || persona.faith,
                    traits: translated.traits || persona.traits,
                };
            }
        }
        return persona;
    });

    // Reset scroll position when component mounts or persona changes
    useEffect(() => {
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            // Also scroll any scrollable containers to top
            const scrollableContainers = document.querySelectorAll('[class*="overflow"], main, [role="main"]');
            scrollableContainers.forEach(container => {
                if (container instanceof HTMLElement && container.scrollTop > 0) {
                    container.scrollTop = 0;
                }
            });
        });
    }, [selectedPersona]);

    if (selectedPersona) {
        return (
            <div className="pt-8 pb-6 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Back button & persona preview */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => setSelectedPersona(null)}
                        className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 sepia:hover:bg-amber-200 rounded-xl transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400 sepia:text-amber-700" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md" style={{ backgroundColor: `${selectedPersona.color}20` }}>
                            {selectedPersona.avatar}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 sepia:text-amber-900">{selectedPersona.name}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 sepia:text-amber-700 font-medium">{selectedPersona.faith}</p>
                        </div>
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 sepia:text-amber-900 mb-3">{t('dialogue.discussTopicTitle')}</h2>
                    <p className="text-gray-600 dark:text-gray-400 sepia:text-amber-700 text-base max-w-lg mx-auto leading-relaxed">{t('dialogue.discussTopicDescription')}</p>
                </div>

                <div className="space-y-4 max-w-2xl mx-auto">
                    {displayScenarios.map((scenario) => {
                        // Map icon strings to emojis
                        const iconMap: Record<string, string> = {
                            'wave': '👋',
                            'food': '🍽️',
                            'prayer': '🙏',
                            'heart': '💝',
                            'growth': '🌱',
                        };
                        const iconEmoji = iconMap[scenario.icon] || scenario.icon || '💬';

                        return (
                            <motion.button
                                key={scenario.id}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() => onSelect(selectedPersona, scenario.title)}
                                className="w-full text-left bg-white dark:bg-gray-800 sepia:bg-amber-50 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700 sepia:border-amber-300 hover:border-indigo-400 dark:hover:border-indigo-600 sepia:hover:border-amber-400 hover:shadow-xl transition-all group relative overflow-hidden"
                            >
                                {/* Subtle gradient overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-indigo-50/20 dark:to-indigo-900/10 sepia:to-amber-200/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="relative flex items-center gap-5">
                                    {/* Icon with colored background */}
                                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-lg" style={{
                                        background: `linear-gradient(135deg, ${selectedPersona.color}25, ${selectedPersona.color}15)`
                                    }}>
                                        {iconEmoji}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-xl text-gray-900 dark:text-gray-100 sepia:text-amber-900 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 sepia:group-hover:text-amber-800 transition-colors">
                                            {scenario.title}
                                        </h4>
                                        <p className="text-base text-gray-600 dark:text-gray-400 sepia:text-amber-700 leading-relaxed">
                                            {scenario.description}
                                        </p>
                                    </div>

                                    {/* Arrow indicator */}
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 sepia:bg-amber-200 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 sepia:group-hover:bg-amber-300 transition-colors shadow-sm">
                                            <svg className="w-5 h-5 text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 sepia:group-hover:text-amber-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="pt-8 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 sepia:text-amber-900 mb-3">{t('dialogue.selectPartnerTitle')}</h2>
                <p className="text-gray-600 dark:text-gray-400 sepia:text-amber-700 text-lg max-w-lg mx-auto">{t('dialogue.selectPartnerDescription')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
                {displayPersonas.map(persona => (
                    <motion.div
                        key={persona.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white dark:bg-gray-800 sepia:bg-amber-50 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 sepia:border-amber-300 cursor-pointer hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-600 sepia:hover:border-amber-400 transition-all relative overflow-hidden group"
                        onClick={() => setSelectedPersona(persona)}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-white/10 opacity-20 rounded-bl-full" style={{ backgroundColor: persona.color }}></div>

                        <div className="relative flex items-start gap-5">
                            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform" style={{ backgroundColor: `${persona.color}20` }}>
                                {persona.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 sepia:text-amber-900 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 sepia:group-hover:text-amber-800 transition-colors">{persona.name}</h3>
                                <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider bg-gray-100 dark:bg-gray-700 sepia:bg-amber-200 text-gray-600 dark:text-gray-300 sepia:text-amber-800 mb-3">
                                    {persona.faith}
                                </span>
                                <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700 leading-relaxed">
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
