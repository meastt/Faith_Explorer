import React from 'react';
import { Check } from 'lucide-react';
import { RELIGIONS, type Religion, type ReligionSubsetId } from '../types';
import { useStore } from '../store/useStore';

// Simplified icons for the new aesthetic
function getReligionSymbol(id: Religion) {
  const symbols: Record<string, string> = {
    christianity: "✝", islam: "☪", judaism: "✡",
    hinduism: "ॐ", buddhism: "☸", sikhism: "☬",
    taoism: "☯", confucianism: "水", shinto: "⛩"
  };
  return symbols[id] || "•";
}

export function ReligionSelector() {
  const { viewMode, setViewMode, selectedSubsets, toggleSubset, setSelectedSubsets } = useStore();

  const handleSubsetToggle = (religion: Religion, subset: ReligionSubsetId) => {
    if (viewMode === 'single') {
      setSelectedSubsets([{ religion, subset }]);
    } else {
      toggleSubset(religion, subset);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher - Segmented Control */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 bg-sand-200 dark:bg-stone-800 rounded-xl">
          <button
            onClick={() => setViewMode('single')}
            className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              viewMode === 'single'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                : 'text-stone-500 hover:text-stone-700 dark:text-stone-400'
            }`}
          >
            Single Path
          </button>
          <button
            onClick={() => setViewMode('comparison')}
            className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              viewMode === 'comparison'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                : 'text-stone-500 hover:text-stone-700 dark:text-stone-400'
            }`}
          >
            Compare Perspectives
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Library */}
      <div className="relative -mx-4 px-4 overflow-x-auto no-scrollbar pb-4">
        <div className="flex gap-3 min-w-max">
          {RELIGIONS.map((religion) => (
            <div key={religion.id} className="flex flex-col gap-2">
              {/* Religion Header */}
              <div className="px-2 text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 text-center">
                {religion.name}
              </div>
              
              {/* Books/Subsets */}
              <div className="flex gap-2">
                {religion.subsets?.map((subset) => {
                  const isSelected = selectedSubsets.some(s => s.subset === subset.id);
                  const isDisabled = subset.comingSoon;

                  return (
                    <button
                      key={subset.id}
                      disabled={isDisabled}
                      onClick={() => !isDisabled && handleSubsetToggle(religion.id, subset.id)}
                      className={`
                        relative flex flex-col items-start justify-between w-32 h-32 p-3 rounded-2xl border transition-all duration-200
                        ${isDisabled ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1'}
                        ${isSelected 
                          ? 'bg-bronze-500 border-bronze-600 text-white shadow-lg shadow-bronze-500/20' 
                          : 'bg-white dark:bg-stone-800 border-sand-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-bronze-300'}
                      `}
                    >
                      <div className="flex justify-between w-full">
                        <span className="text-xl leading-none opacity-80">{getReligionSymbol(religion.id)}</span>
                        {isSelected && <Check className="w-4 h-4" />}
                      </div>
                      
                      <div className="text-left mt-auto">
                        <span className="block font-serif font-bold text-sm leading-tight">
                          {subset.name}
                        </span>
                        {isDisabled && <span className="text-[9px] uppercase mt-1 block opacity-70">Coming Soon</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}