import { useState } from 'react';
import { Check } from 'lucide-react';
import { RELIGIONS, type Religion, type ReligionSubsetId } from '../types';
import { useStore } from '../store/useStore';
import { SubscriptionModal } from './SubscriptionModal';

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
  const { viewMode, setViewMode, selectedSubsets, toggleSubset, setSelectedSubsets, usage, setPremium } = useStore();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const handleSubsetToggle = (religion: Religion, subset: ReligionSubsetId) => {
    if (viewMode === 'single') {
      setSelectedSubsets([{ religion, subset }]);
    } else {
      // Check if adding this would exceed free tier limit (3 subsets for comparison)
      const isAlreadySelected = selectedSubsets.some(s => s.subset === subset && s.religion === religion);
      if (!usage.isPremium && !isAlreadySelected && selectedSubsets.length >= 3) {
        setShowSubscriptionModal(true);
        return;
      }
      toggleSubset(religion, subset);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher - Segmented Control */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 bg-sand-200 dark:bg-stone-800 rounded-xl border border-sand-300 dark:border-stone-700">
          <button
            onClick={() => setViewMode('single')}
            className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${viewMode === 'single'
              ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm ring-1 ring-black/5'
              : 'text-stone-500 hover:text-stone-700 dark:text-stone-400'
              }`}
          >
            Single Path
          </button>
          <button
            onClick={() => setViewMode('comparison')}
            className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${viewMode === 'comparison'
              ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm ring-1 ring-black/5'
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
              <div className="px-2 text-xs font-bold uppercase tracking-widest text-bronze-600 dark:text-bronze-500 text-center font-serif">
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
                        relative flex flex-col items-start justify-between w-32 h-36 p-3 rounded-2xl border transition-all duration-300 group
                        ${isDisabled ? 'opacity-50 grayscale cursor-not-allowed bg-sand-50 dark:bg-stone-900' : 'cursor-pointer hover:-translate-y-1'}
                        ${isSelected
                          ? 'bg-bronze-600 border-bronze-700 text-white shadow-lg shadow-bronze-900/20'
                          : 'bg-white dark:bg-stone-800 border-sand-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-bronze-300 dark:hover:border-stone-500 hover:shadow-md'}
                      `}
                    >
                      <div className="flex justify-between w-full">
                        {/* Coin Icon */}
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-inner transition-colors
                          ${isSelected
                            ? 'bg-bronze-500 text-white border border-bronze-400'
                            : 'bg-sand-100 dark:bg-stone-700 text-bronze-600 dark:text-bronze-400 border border-sand-200 dark:border-stone-600 group-hover:bg-sand-50'}
                        `}>
                          {getReligionSymbol(religion.id)}
                        </div>
                        {isSelected && <Check className="w-5 h-5 text-white/80" />}
                      </div>

                      <div className="text-left mt-auto w-full">
                        <span className={`block font-serif font-bold text-sm leading-tight ${isSelected ? 'text-white' : 'text-stone-900 dark:text-stone-100'}`}>
                          {subset.name}
                        </span>
                        {isDisabled ? (
                          <span className="text-[9px] uppercase mt-1.5 block opacity-70 font-medium tracking-wide">Coming Soon</span>
                        ) : (
                          <div className={`h-0.5 w-8 mt-2 rounded-full transition-all ${isSelected ? 'bg-white/40' : 'bg-bronze-200 dark:bg-stone-600 group-hover:w-full group-hover:bg-bronze-400'}`} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showSubscriptionModal && (
        <SubscriptionModal
          onClose={() => setShowSubscriptionModal(false)}
          onSubscribe={() => {
            setPremium(true);
            setShowSubscriptionModal(false);
          }}
        />
      )}
    </div>
  );
}