import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { RELIGIONS, type Religion } from '../types';
import { useStore } from '../store/useStore';

// Religion icons as SVG paths
function getReligionIcon(religionId: Religion): React.ReactElement {
  switch (religionId) {
    case 'christianity':
      return (
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      );
    case 'islam':
      return (
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      );
    case 'judaism':
      return (
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6l4 4-1.41 1.41L12 13.17l-3.59 3.59L7 14l4-4V7z"/>
      );
    case 'hinduism':
      return (
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      );
    case 'buddhism':
      return (
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6l4 4-1.41 1.41L12 13.17l-3.59 3.59L7 14l4-4V7z"/>
      );
    case 'sikhism':
      return (
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      );
    case 'taoism':
      return (
        <g>
          <circle cx="12" cy="8" r="4"/>
          <circle cx="8" cy="16" r="3"/>
          <circle cx="16" cy="16" r="3"/>
        </g>
      );
    case 'confucianism':
      return (
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6l4 4-1.41 1.41L12 13.17l-3.59 3.59L7 14l4-4V7z"/>
      );
    case 'shinto':
      return (
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      );
    default:
      return (
        <circle cx="12" cy="12" r="3"/>
      );
  }
}

export function ReligionSelector() {
  const { viewMode, setViewMode, selectedReligions, toggleReligion, setSelectedReligions } = useStore();
  const [expandedReligion, setExpandedReligion] = useState<string | null>(null);

  const handleModeChange = (mode: 'single' | 'comparison') => {
    setViewMode(mode);
    if (mode === 'single' && selectedReligions.length > 1) {
      setSelectedReligions([selectedReligions[0]]);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 sepia:bg-amber-50 rounded-2xl border border-gray-200 dark:border-gray-700 sepia:border-amber-200 p-6 shadow-soft">
      {/* Mode Toggle */}
      <div className="mb-6">
        <div className="flex space-x-2 bg-gray-100 dark:bg-gray-700 sepia:bg-amber-200 p-1 rounded-xl">
          <button
            onClick={() => handleModeChange('single')}
            className={`flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              viewMode === 'single'
                ? 'bg-white dark:bg-gray-800 sepia:bg-amber-100 text-gray-900 dark:text-gray-100 sepia:text-amber-900 shadow-soft'
                : 'text-gray-600 dark:text-gray-400 sepia:text-amber-600 hover:text-gray-900 dark:hover:text-gray-100 sepia:hover:text-amber-900 hover:bg-white/50 dark:hover:bg-gray-600/50 sepia:hover:bg-amber-100/50'
            }`}
          >
            Single Religion
          </button>
          <button
            onClick={() => handleModeChange('comparison')}
            className={`flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              viewMode === 'comparison'
                ? 'bg-white dark:bg-gray-800 sepia:bg-amber-100 text-gray-900 dark:text-gray-100 sepia:text-amber-900 shadow-soft'
                : 'text-gray-600 dark:text-gray-400 sepia:text-amber-600 hover:text-gray-900 dark:hover:text-gray-100 sepia:hover:text-amber-900 hover:bg-white/50 dark:hover:bg-gray-600/50 sepia:hover:bg-amber-100/50'
            }`}
          >
            Compare Religions
          </button>
        </div>
      </div>

      {/* Religion Selection */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900 mb-4">
          {viewMode === 'single' ? 'Select a Religion' : 'Select Religions to Compare'}
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          {RELIGIONS.map((religion) => {
            const isSelected = selectedReligions.includes(religion.id);
            const canSelect =
              viewMode === 'single'
                ? true
                : selectedReligions.length < 7 || isSelected;

            return (
              <button
                key={religion.id}
                onClick={() => {
                  if (viewMode === 'single') {
                    setSelectedReligions([religion.id]);
                  } else {
                    if (canSelect) {
                      toggleReligion(religion.id);
                    }
                  }
                }}
                disabled={!canSelect}
                className={`p-6 text-center border-2 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  isSelected
                    ? 'border-primary-500 dark:border-primary-400 sepia:border-amber-600 bg-primary-50 dark:bg-primary-900/30 sepia:bg-amber-100 shadow-soft'
                    : 'border-gray-200 dark:border-gray-600 sepia:border-amber-300 hover:border-gray-300 dark:hover:border-gray-500 sepia:hover:border-amber-400 bg-white dark:bg-gray-700 sepia:bg-amber-50 hover:shadow-soft'
                } ${!canSelect ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                style={{
                  borderColor: isSelected ? religion.color : undefined,
                  backgroundColor: isSelected ? `${religion.color}10` : undefined,
                }}
              >
                <div className="flex flex-col items-center space-y-2">
                  {/* Religion Icon */}
                  <div className="w-12 h-12 flex items-center justify-center rounded-full" style={{ backgroundColor: `${religion.color}20` }}>
                    <svg className="w-6 h-6" style={{ color: religion.color }} fill="currentColor" viewBox="0 0 24 24">
                      {getReligionIcon(religion.id)}
                    </svg>
                  </div>
                  
                  {/* Religion Name with Subset Indicator */}
                  <div className="flex items-center gap-1">
                    <div className="font-medium text-sm text-gray-900 dark:text-gray-100 sepia:text-amber-900 text-center" style={{ color: religion.color }}>
                      {religion.name}
                    </div>
                    {religion.subsets && religion.subsets.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedReligion(expandedReligion === religion.id ? null : religion.id);
                        }}
                        className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 sepia:hover:bg-amber-300 rounded"
                      >
                        {expandedReligion === religion.id ? (
                          <ChevronUp className="w-3 h-3 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-3 h-3 text-gray-500" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Subsets Dropdown */}
                {expandedReligion === religion.id && religion.subsets && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 sepia:border-amber-300 space-y-1" onClick={(e) => e.stopPropagation()}>
                    {religion.subsets.map((subset) => (
                      <div
                        key={subset.id}
                        className={`flex items-center justify-between p-2 rounded-md text-xs ${
                          subset.comingSoon
                            ? 'bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 opacity-60 cursor-not-allowed'
                            : 'bg-blue-50 dark:bg-blue-900/30 sepia:bg-amber-200 border border-blue-200 dark:border-blue-700 sepia:border-amber-400'
                        }`}
                      >
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">{subset.name}</div>
                          <div className="text-gray-600 dark:text-gray-400 sepia:text-amber-700">{subset.description}</div>
                        </div>
                        {subset.comingSoon && (
                          <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 sepia:bg-amber-300 text-gray-700 dark:text-gray-300 sepia:text-amber-800 rounded-full text-xs font-semibold">
                            Coming Soon
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

              </button>
            );
          })}
        </div>

        {viewMode === 'comparison' && selectedReligions.length < 2 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Please select at least 2 religions to compare
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
