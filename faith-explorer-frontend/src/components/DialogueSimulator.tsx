import { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles, MessageSquare, ArrowLeft } from 'lucide-react';
import { simulateDialogue, type Persona, type DialogueResponse } from '../services/api';
import { PersonaSelector } from './PersonaSelector';

export function DialogueSimulator() {
    const [activePersona, setActivePersona] = useState<Persona | null>(null);
    const [activeScenario, setActiveScenario] = useState<string | null>(null);
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
    const [coachFeedback, setCoachFeedback] = useState<DialogueResponse | null>(null);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleStart = (persona: Persona, scenario: string) => {
        setActivePersona(persona);
        setActiveScenario(scenario);
        setMessages([{ role: 'assistant', content: `Hello! I am ${persona.name}. I understand you wanted to discuss "${scenario}"?` }]);
        setCoachFeedback(null);
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
            setCoachFeedback(result);
        } catch (e) {
            console.error(e);
            // Add error message to chat
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setActivePersona(null);
        setActiveScenario(null);
        setMessages([]);
        setCoachFeedback(null);
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
        <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col h-[600px] md:h-[700px] relative animate-in fade-in duration-300">

            {/* Header */}
            <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                    <button onClick={handleReset} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm" style={{ backgroundColor: `${activePersona.color}20` }}>
                        {activePersona.avatar}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100">{activePersona.name}</h3>
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            Online • Practice Mode
                        </p>
                    </div>
                </div>
                <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-500 dark:text-gray-400">
                    {activeScenario}
                </div>
            </div>

            {/* Content Area uses Flex Row for Chat + Coach */}
            <div className="flex-1 flex overflow-hidden relative">

                {/* Chat Area */}
                <div className="flex-1 flex flex-col relative z-0">
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
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
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none'}
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
                                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={`Reply to ${activePersona.name}...`}
                                disabled={isLoading}
                                className="flex-1 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 dark:text-white"
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Coach Panel (Overlay on mobile, Side on desktop) */}
                <div className={`
                absolute md:relative bottom-0 left-0 right-0 md:w-80 
                bg-gray-50/95 dark:bg-gray-900/95 md:bg-gray-50 md:dark:bg-gray-900 
                border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800
                backdrop-blur-sm md:backdrop-blur-none
                transition-transform duration-300 transform
                ${coachFeedback ? 'translate-y-0' : 'translate-y-full md:translate-y-0 md:opacity-50'}
                flex flex-col
            `}>
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                        <h3 className="font-bold text-gray-700 dark:text-gray-200">Coach's Feedback</h3>
                        {coachFeedback && (
                            <span className={`ml-auto px-2 py-0.5 rounded text-xs font-bold ${coachFeedback.score >= 8 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                Score: {coachFeedback.score}/10
                            </span>
                        )}
                    </div>

                    <div className="p-6 flex-1 overflow-y-auto">
                        {coachFeedback ? (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-purple-100 dark:border-gray-700">
                                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                        "{coachFeedback.feedback}"
                                    </p>
                                </div>

                                <div className="text-xs text-gray-400 text-center uppercase tracking-widest mt-4">
                                    Tips for Improvement
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <MessageSquare className="w-4 h-4 text-blue-400" />
                                        <span>Use specific faith terminology</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <User className="w-4 h-4 text-green-400" />
                                        <span>Mirror their greeting style</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center p-4">
                                <Sparkles className="w-12 h-12 mb-3 opacity-20" />
                                <p className="text-sm">Send a message to receive real-time coaching feedback on your interfaith etiquette.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
