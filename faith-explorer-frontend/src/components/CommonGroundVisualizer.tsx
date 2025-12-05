import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Sparkles, AlertCircle } from 'lucide-react';
import { getCommonGround, type CommonGroundData } from '../services/api';
import { RELIGIONS, type Religion } from '../types';

interface CommonGroundVisualizerProps {
    religions: Religion[];
    question: string;
    results: { religion: Religion; answer: string }[];
    onClose: () => void;
}

export function CommonGroundVisualizer({ religions, question, results, onClose }: CommonGroundVisualizerProps) {
    const [data, setData] = useState<CommonGroundData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeZone, setActiveZone] = useState<'A' | 'B' | 'Common' | null>('Common');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getCommonGround(religions, question, results);
                setData(data);
            } catch (err) {
                setError('Failed to analyze common ground. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [religions, question, results]);

    const religionA = RELIGIONS.find(r => r.id === religions[0]);
    const religionB = RELIGIONS.find(r => r.id === religions[1]);

    if (!religionA || !religionB) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative transition-all">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Common Ground</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">AI-Powered Venn Analysis</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6 md:p-10 flex flex-col md:flex-row gap-8 items-center justify-center">

                    {loading && (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-500 animate-pulse">Synthesizing perspectives...</p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center text-red-500 bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl max-w-md">
                            <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-80" />
                            <p>{error}</p>
                            <button onClick={onClose} className="mt-4 px-4 py-2 bg-white dark:bg-gray-800 shadow-sm border rounded-lg text-sm font-medium">Close</button>
                        </div>
                    )}

                    {!loading && !error && data && (
                        <>
                            {/* Visualization (Venn Diagram) */}
                            <div className="relative w-72 h-48 md:w-96 md:h-64 flex-shrink-0 select-none">

                                {/* Circle A */}
                                <motion.div
                                    className={`absolute left-0 top-0 w-48 h-48 md:w-64 md:h-64 rounded-full border-4 transition-all duration-300 cursor-pointer flex items-center justify-start pl-8 md:pl-12
                                ${activeZone === 'A' ? 'z-20 scale-105 bg-opacity-90' : 'z-10 bg-opacity-40 hover:bg-opacity-50'}
                            `}
                                    style={{
                                        backgroundColor: `${religionA.color}20`,
                                        borderColor: religionA.color,
                                        left: '0%'
                                    }}
                                    onClick={() => setActiveZone('A')}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <span
                                        className="font-bold text-lg md:text-2xl opacity-40 uppercase transform -rotate-12 absolute top-12 left-10"
                                        style={{ color: religionA.color }}
                                    >
                                        {religionA.name}
                                    </span>
                                </motion.div>

                                {/* Circle B */}
                                <motion.div
                                    className={`absolute right-0 top-0 w-48 h-48 md:w-64 md:h-64 rounded-full border-4 transition-all duration-300 cursor-pointer flex items-center justify-end pr-8 md:pr-12
                                ${activeZone === 'B' ? 'z-20 scale-105 bg-opacity-90' : 'z-10 bg-opacity-40 hover:bg-opacity-50'}
                            `}
                                    style={{
                                        backgroundColor: `${religionB.color}20`,
                                        borderColor: religionB.color,
                                        right: '0%'
                                    }}
                                    onClick={() => setActiveZone('B')}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <span
                                        className="font-bold text-lg md:text-2xl opacity-40 uppercase transform rotate-12 absolute bottom-12 right-10"
                                        style={{ color: religionB.color }}
                                    >
                                        {religionB.name}
                                    </span>
                                </motion.div>

                                {/* Intersection Zone (Clickable via dedicated overlay if needed, or by overlapping logic) */}
                                <div
                                    className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer"
                                    onClick={() => setActiveZone('Common')}
                                >
                                    <div className={`
                                w-24 h-48 md:w-32 md:h-64 flex flex-col items-center justify-center transition-all duration-300
                                ${activeZone === 'Common' ? 'opacity-100 scale-110' : 'opacity-60 hover:opacity-100'}
                            `}>
                                        <div className="bg-white/80 dark:bg-black/40 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                                            <span className="text-xs font-bold tracking-widest uppercase text-gray-800 dark:text-gray-200">Shared</span>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Details Panel */}
                            <div className="flex-1 w-full max-w-md bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 min-h-[300px] flex flex-col">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeZone}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex-1"
                                    >
                                        {activeZone === 'Common' && (
                                            <>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="p-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg">
                                                        <Sparkles className="w-5 h-5 text-white" />
                                                    </div>
                                                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600 dark:from-indigo-400 dark:to-pink-400">
                                                        Shared Values
                                                    </h3>
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-300 mb-6 italic text-sm border-l-4 border-purple-200 pl-3">
                                                    "{data.summary}"
                                                </p>
                                                <ul className="space-y-3">
                                                    {data.common.map((item, i) => (
                                                        <li key={i} className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                            <span className="text-gray-800 dark:text-gray-200 font-medium">{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </>
                                        )}

                                        {activeZone === 'A' && (
                                            <>
                                                <div className="flex items-center gap-2 mb-6">
                                                    <div className="w-3 h-8 rounded-full" style={{ backgroundColor: religionA.color }}></div>
                                                    <h3 className="text-xl font-bold" style={{ color: religionA.color }}>
                                                        Unique to {religionA.name}
                                                    </h3>
                                                </div>
                                                <ul className="space-y-3">
                                                    {data.distinctA.map((item, i) => (
                                                        <li key={i} className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                                            <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: religionA.color }}></div>
                                                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </>
                                        )}

                                        {activeZone === 'B' && (
                                            <>
                                                <div className="flex items-center gap-2 mb-6">
                                                    <div className="w-3 h-8 rounded-full" style={{ backgroundColor: religionB.color }}></div>
                                                    <h3 className="text-xl font-bold" style={{ color: religionB.color }}>
                                                        Unique to {religionB.name}
                                                    </h3>
                                                </div>
                                                <ul className="space-y-3">
                                                    {data.distinctB.map((item, i) => (
                                                        <li key={i} className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                                            <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: religionB.color }}></div>
                                                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </>
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                <div className="mt-8 flex justify-center gap-2">
                                    {/* Zone Indicators */}
                                    <button onClick={() => setActiveZone('A')} className={`h-1.5 rounded-full transition-all duration-300 ${activeZone === 'A' ? 'w-8 opacity-100' : 'w-2 opacity-30'}`} style={{ backgroundColor: religionA.color }} />
                                    <button onClick={() => setActiveZone('Common')} className={`h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ${activeZone === 'Common' ? 'w-8 opacity-100' : 'w-2 opacity-30'}`} />
                                    <button onClick={() => setActiveZone('B')} className={`h-1.5 rounded-full transition-all duration-300 ${activeZone === 'B' ? 'w-8 opacity-100' : 'w-2 opacity-30'}`} style={{ backgroundColor: religionB.color }} />
                                </div>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}
