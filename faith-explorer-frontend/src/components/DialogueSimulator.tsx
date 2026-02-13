import { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { simulateDialogue, type Persona } from '../services/api';
import { PersonaSelector } from './PersonaSelector';

export function DialogueSimulator() {
    const { t } = useTranslation('search');
    const { t: tCommon } = useTranslation('common');
    const [activePersona, setActivePersona] = useState<Persona | null>(null);
    const [activeScenario, setActiveScenario] = useState<string | null>(null);
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Reset scroll position when component mounts or when persona/scenario resets
    useEffect(() => {
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            // Also reset any scrollable containers
            const scrollableContainers = document.querySelectorAll('[class*="overflow"], main, [role="main"]');
            scrollableContainers.forEach(container => {
                if (container instanceof HTMLElement && container.scrollTop > 0) {
                    container.scrollTop = 0;
                }
            });
        });
    }, [activePersona, activeScenario]);

    const getInitialGreeting = (persona: Persona, scenario: string): string => {
        // Map scenario IDs to greeting keys
        const idToGreetingKey: Record<string, string> = {
            'introduction': 'dialogue.greetings.meetAndGreet',
            'dietary-rules': 'dialogue.greetings.dietaryPractices',
            'prayer-habits': 'dialogue.greetings.prayerAndWorship',
            'charity': 'dialogue.greetings.charityAndGiving',
            'suffering': 'dialogue.greetings.lifesChallenges',
        };

        // The scenario param is the translated title; find the matching scenario ID
        const translatedScenarios = t('dialogue.scenarios', { returnObjects: true }) as { id: string; title: string }[];
        let scenarioId = '';
        if (Array.isArray(translatedScenarios)) {
            const match = translatedScenarios.find(s => s.title === scenario);
            if (match) scenarioId = match.id;
        }

        const key = idToGreetingKey[scenarioId];
        if (key) {
            const translated = t(key, { name: persona.name });
            if (translated !== key && !translated.includes('{name}')) {
                return translated;
            }
        }

        // Fallback to default greeting
        const defaultGreeting = t('dialogue.greetings.default', { name: persona.name, scenario: scenario.toLowerCase() });
        if (defaultGreeting !== 'dialogue.greetings.default' && !defaultGreeting.includes('{name}')) {
            return defaultGreeting;
        }
        return `Hello! I'm ${persona.name}. I'm looking forward to our conversation about ${scenario.toLowerCase()}. What would you like to discuss?`;
    };

    const handleStart = (persona: Persona, scenario: string) => {
        setActivePersona(persona);
        setActiveScenario(scenario);
        setMessages([{ role: 'assistant', content: getInitialGreeting(persona, scenario) }]);
    };

    const handleSend = async () => {
        if (!input.trim() || !activePersona || !activeScenario) return;

        const userMsg = input.trim();
        const newHistory: { role: 'user' | 'assistant'; content: string }[] = [...messages, { role: 'user', content: userMsg }];

        setMessages(newHistory);
        setInput('');
        setIsLoading(true);

        try {
            const result = await simulateDialogue(activePersona, activeScenario, userMsg, newHistory);
            setMessages([...newHistory, { role: 'assistant', content: result.reply }]);
        } catch (e) {
            console.error(e);
            setMessages([...newHistory, { role: 'assistant', content: tCommon('errors.dialogueError') }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setActivePersona(null);
        setActiveScenario(null);
        setMessages([]);
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    if (!activePersona) {
        return <PersonaSelector onSelect={handleStart} />;
    }

    return (
        <div className="bg-white dark:bg-gray-900 sepia:bg-amber-50 md:rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800 sepia:border-amber-300 flex flex-col h-[calc(100vh-200px)] md:h-[700px] relative animate-in fade-in duration-300">

            {/* Header */}
            <div className="p-4 bg-white dark:bg-gray-800 sepia:bg-amber-100 border-b border-gray-100 dark:border-gray-700 sepia:border-amber-300 flex items-center justify-between z-10 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <button onClick={handleReset} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 sepia:hover:bg-amber-200 rounded-full">
                        <ArrowLeft className="w-5 h-5 text-gray-500 dark:text-gray-400 sepia:text-amber-700" />
                    </button>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm" style={{ backgroundColor: `${activePersona.color}20` }}>
                        {activePersona.avatar}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 sepia:text-amber-900">{activePersona.name}</h3>
                        <p className="text-xs text-green-600 dark:text-green-400 sepia:text-amber-700 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            {t('dialogue.onlineStatus')}
                        </p>
                    </div>
                </div>
                <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 sepia:bg-amber-200 rounded-full text-xs font-medium text-gray-500 dark:text-gray-400 sepia:text-amber-800">
                    {activeScenario}
                </div>
            </div>

            {/* Content Area uses Flex Row for Chat + Coach */}
            <div className="flex-1 flex overflow-hidden relative">

                {/* Chat Area */}
                <div className="flex-1 flex flex-col relative z-0">
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900 sepia:bg-amber-100/50">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-8 h-8 rounded-full flex-shrink-0 mr-2 flex items-center justify-center text-sm" style={{ backgroundColor: `${activePersona.color}20` }}>
                                        {activePersona.avatar}
                                    </div>
                                )}
                                <div className={`
                                max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                                ${msg.role === 'user'
                                        ? 'bg-blue-600 sepia:bg-amber-700 text-white rounded-tr-none'
                                        : 'bg-white dark:bg-gray-800 sepia:bg-amber-50 text-gray-800 dark:text-gray-100 sepia:text-amber-900 rounded-tl-none shadow-sm border border-gray-200 dark:border-gray-700 sepia:border-amber-300'}
                            `}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="w-8 h-8 rounded-full flex-shrink-0 mr-2 flex items-center justify-center text-sm" style={{ backgroundColor: `${activePersona.color}20` }}>
                                    {activePersona.avatar}
                                </div>
                                <div className="bg-gray-100 dark:bg-gray-800 sepia:bg-amber-100 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 border sepia:border-amber-300">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white dark:bg-gray-800 sepia:bg-amber-50 border-t border-gray-100 dark:border-gray-700 sepia:border-amber-300">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={(() => {
                                    const translated = t('dialogue.replyPlaceholder', { name: activePersona.name });
                                    // Fallback if translation returns placeholder
                                    if (translated === 'dialogue.replyPlaceholder' || translated.includes('{name}')) {
                                        return `Reply to ${activePersona.name}...`;
                                    }
                                    return translated;
                                })()}
                                disabled={isLoading}
                                className="flex-1 bg-gray-100 dark:bg-gray-700 sepia:bg-amber-100 border-0 sepia:border sepia:border-amber-300 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 sepia:focus:ring-amber-500 dark:text-white sepia:text-amber-900 sepia:placeholder-amber-600"
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="p-3 bg-blue-600 hover:bg-blue-700 sepia:bg-amber-700 sepia:hover:bg-amber-800 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
