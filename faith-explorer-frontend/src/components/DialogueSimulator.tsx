import { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import { simulateDialogue, type Persona } from '../services/api';
import { PersonaSelector } from './PersonaSelector';

export function DialogueSimulator() {
    const [activePersona, setActivePersona] = useState<Persona | null>(null);
    const [activeScenario, setActiveScenario] = useState<string | null>(null);
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const getInitialGreeting = (persona: Persona, scenario: string): string => {
        const greetings: Record<string, string> = {
            "Meet & Greet": `Hello! I'm ${persona.name}. It's wonderful to meet you. I'm always happy to share about my faith and learn about others. What brings you here today?`,
            "Dietary Practices": `Shalom! I'm ${persona.name}. I understand you're curious about how faith influences what we eat? It's a meaningful topic - food connects us to tradition in so many ways. What would you like to know?`,
            "Prayer & Worship": `Peace be upon you! I'm ${persona.name}. Prayer and worship are central to my daily life. I'd be glad to share how I connect with the divine. What aspect interests you most?`,
            "Charity & Giving": `Welcome! I'm ${persona.name}. Generosity and caring for others is a cornerstone of my faith. There's so much wisdom in our traditions about giving. What draws you to this topic?`,
            "Life's Challenges": `Hello, friend. I'm ${persona.name}. Life's challenges are something every faith tradition has grappled with deeply. I'm honored you'd want to explore this with me. Where shall we begin?`,
        };
        return greetings[scenario] || `Hello! I'm ${persona.name}. I'm looking forward to our conversation about ${scenario.toLowerCase()}. What would you like to discuss?`;
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
            setMessages([...newHistory, { role: 'assistant', content: "I'm sorry, I couldn't respond. Please check your connection and try again." }]);
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
                            Online • Practice Mode
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
                                placeholder={`Reply to ${activePersona.name}...`}
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
