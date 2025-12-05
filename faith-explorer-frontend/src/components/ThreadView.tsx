import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Star, Quote } from 'lucide-react';

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
    // Optional: Parallax or scroll progress could be used here
    // const { scrollYProgress } = useScroll({ container: containerRef });

    return (
        <div className="h-full flex flex-col bg-sand-50 dark:bg-stone-900 absolute inset-0 z-20 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-sand-200 dark:border-stone-700 bg-white/80 dark:bg-stone-800/80 backdrop-blur-md z-30 sticky top-0">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-sand-100 dark:hover:bg-stone-700 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-stone-600 dark:text-stone-300" />
                </button>
                <div>
                    <div className="text-xs font-bold text-bronze-600 dark:text-bronze-400 uppercase tracking-wider">The Golden Thread</div>
                    <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">{thread.title}</h2>
                </div>
            </div>

            {/* Timeline Content */}
            <div ref={containerRef} className="flex-1 overflow-y-auto relative p-6 space-y-12">
                {/* The Golden Line */}
                <div className="absolute left-9 top-10 bottom-10 w-0.5 bg-gradient-to-b from-transparent via-amber-400 to-transparent opacity-50 z-0"></div>

                {thread.nodes.map((node, index) => (
                    <motion.div
                        key={node.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: index * 0.1 }}
                        className="relative z-10 pl-12 group"
                    >
                        {/* Timeline Dot */}
                        <div
                            className="absolute left-0 top-1 w-6 h-6 rounded-full border-2 border-white dark:border-stone-800 shadow-md flex items-center justify-center text-xs font-bold bg-white dark:bg-stone-800"
                            style={{ borderColor: node.color, color: node.color }}
                        >
                            {index + 1}
                        </div>

                        {/* Content Card */}
                        <div className="bg-white dark:bg-stone-800 rounded-xl p-5 border border-sand-200 dark:border-stone-700 shadow-sm hover:shadow-md hover:border-bronze-300 dark:hover:border-bronze-700 transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sand-100 dark:bg-stone-700 text-stone-600 dark:text-stone-400">
                                    {node.era}
                                </span>
                                <span className="text-xs font-medium text-stone-400 flex items-center gap-1">
                                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                    {node.faith}
                                </span>
                            </div>

                            <h3 className="font-serif text-lg font-bold text-stone-800 dark:text-stone-200 mb-2">
                                {node.title}
                            </h3>

                            <div className="relative pl-4 border-l-2 border-bronze-200 dark:border-bronze-800 mb-3 italic text-stone-600 dark:text-stone-400 font-serif">
                                <Quote className="absolute -left-3 -top-2 w-4 h-4 bg-white dark:bg-stone-800 text-bronze-400" />
                                "{node.quote}"
                            </div>

                            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                                {node.description}
                            </p>
                        </div>
                    </motion.div>
                ))}

                <div className="flex justify-center pt-8 pb-4 opacity-50">
                    <BookOpen className="w-6 h-6 text-stone-400" />
                </div>
            </div>
        </div>
    );
}
