import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Star, Quote, X } from 'lucide-react';

export interface ThreadNode {
    id: string;
    era: string;
    faith: string;
    title: string;
    quote: string;
    description: string;
    color: string;
}

export interface ThreadData {
    id: string;
    title: string;
    description: string;
    nodes: ThreadNode[];
}

interface ThreadViewProps {
    thread: ThreadData;
    onBack: () => void;
}

export function ThreadView({ thread, onBack }: ThreadViewProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Scroll to top when component mounts
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo({ top: 0, behavior: 'instant' });
        }
        // Also scroll the window/body to top in case the component is in a scrollable parent
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [thread.id]);

    return (
        <div className="min-h-screen flex flex-col bg-sand-50 dark:bg-stone-900 fixed inset-0 z-50 overflow-hidden">
            {/* Header - Fixed at top */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-sand-200 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-sm z-30 flex-shrink-0">
                <button
                    onClick={onBack}
                    className="p-2.5 bg-sand-100 dark:bg-stone-700 hover:bg-sand-200 dark:hover:bg-stone-600 rounded-xl transition-colors flex items-center gap-2"
                    aria-label="Go back"
                >
                    <ArrowLeft className="w-5 h-5 text-stone-700 dark:text-stone-200" />
                    <span className="text-sm font-medium text-stone-700 dark:text-stone-200 hidden sm:inline">Back</span>
                </button>
                <div className="flex-1">
                    <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">The Golden Thread</div>
                    <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 truncate">{thread.title}</h2>
                </div>
                <button
                    onClick={onBack}
                    className="p-2.5 hover:bg-sand-100 dark:hover:bg-stone-700 rounded-xl transition-colors sm:hidden"
                    aria-label="Close"
                >
                    <X className="w-5 h-5 text-stone-500" />
                </button>
            </div>

            {/* Introduction */}
            <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-b border-amber-100 dark:border-amber-900/30 flex-shrink-0">
                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    {thread.description}
                </p>
                <p className="text-xs text-stone-400 dark:text-stone-500 mt-2">
                    📜 {thread.nodes.length} passages through history
                </p>
            </div>

            {/* Timeline Content - Scrollable */}
            <div ref={containerRef} className="flex-1 overflow-y-auto relative">
                <div className="p-6 space-y-8">
                    {/* The Golden Line */}
                    <div className="absolute left-9 top-6 bottom-24 w-0.5 bg-gradient-to-b from-amber-400 via-amber-300 to-transparent opacity-60 z-0"></div>

                    {thread.nodes.map((node, index) => (
                        <motion.div
                            key={node.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.15, duration: 0.4 }}
                            className="relative z-10 pl-12 group"
                        >
                            {/* Timeline Dot */}
                            <div
                                className="absolute left-0 top-1 w-7 h-7 rounded-full border-3 shadow-lg flex items-center justify-center text-xs font-bold bg-white dark:bg-stone-800"
                                style={{ borderColor: node.color, color: node.color, borderWidth: '3px' }}
                            >
                                {index + 1}
                            </div>

                            {/* Content Card */}
                            <div className="bg-white dark:bg-stone-800 rounded-xl p-5 border border-sand-200 dark:border-stone-700 shadow-sm hover:shadow-md hover:border-amber-300 dark:hover:border-amber-700 transition-all">
                                <div className="flex justify-between items-start mb-3 gap-2">
                                    <span 
                                        className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                                        style={{ backgroundColor: node.color }}
                                    >
                                        {node.era}
                                    </span>
                                    <span className="text-xs font-medium text-stone-500 dark:text-stone-400 flex items-center gap-1 flex-shrink-0">
                                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                        {node.faith}
                                    </span>
                                </div>

                                <h3 className="font-serif text-lg font-bold text-stone-800 dark:text-stone-200 mb-3">
                                    {node.title}
                                </h3>

                                <div className="relative pl-4 border-l-3 mb-3 py-2 italic text-stone-700 dark:text-stone-300 font-serif text-base leading-relaxed" style={{ borderColor: `${node.color}40`, borderLeftWidth: '3px' }}>
                                    <Quote className="absolute -left-3 -top-1 w-5 h-5 bg-white dark:bg-stone-800" style={{ color: node.color }} />
                                    "{node.quote}"
                                </div>

                                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                                    {node.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}

                    {/* End marker */}
                    <div className="flex flex-col items-center pt-8 pb-12">
                        <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-3">
                            <BookOpen className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <p className="text-sm text-stone-400 dark:text-stone-500 text-center">
                            The golden thread continues...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
