import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { RELIGIONS, type Religion, type ReligionSubsetId } from '../types';
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
  const { viewMode, setViewMode, selectedSubsets, toggleSubset, setSelectedSubsets } = useStore();
  const [selectedReligion, setSelectedReligion] = useState<Religion | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleModeChange = (mode: 'single' | 'comparison') => {
    setViewMode(mode);
    if (mode === 'single' && selectedSubsets.length > 1) {
      setSelectedSubsets([selectedSubsets[0]]);
    }
  };

  const handleReligionChange = (religion: Religion) => {
    setSelectedReligion(religion);
    setIsDropdownOpen(false);
  };

  const handleSubsetToggle = (religion: Religion, subset: ReligionSubsetId) => {
    if (viewMode === 'single') {
      // In single mode, replace current selection
      setSelectedSubsets([{ religion, subset }]);
    } else {
      // In comparison mode, toggle selection
      toggleSubset(religion, subset);
    }
  };

  const selectedReligionInfo = selectedReligion ? RELIGIONS.find(r => r.id === selectedReligion) : null;

  return (
    <div className="bg-white dark:bg-gray-800 sepia:bg-amber-50 rounded-2xl border border-gray-200 dark:border-gray-700 sepia:border-amber-200 p-6 shadow-soft">
      {/* Instructional Header - Only show when nothing is selected */}
      {selectedSubsets.length === 0 && (
        <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 sepia:from-amber-100 sepia:to-amber-200 rounded-xl border border-blue-200 dark:border-blue-800 sepia:border-amber-300">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 sepia:text-amber-900 mb-2">
            ✨ Get Started
          </h3>
          <div className="text-sm text-gray-700 dark:text-gray-300 sepia:text-amber-800 space-y-2">
            <p><strong>Step 1:</strong> Choose to explore a single text or compare multiple faiths</p>
            <p><strong>Step 2:</strong> Select a religion and its text from the dropdown below</p>
            <p><strong>Step 3:</strong> Search for a life question or browse topics at the bottom</p>
          </div>
        </div>
      )}

      {/* Mode Toggle */}
      <div className="mb-6">
        <div className="flex space-x-2 bg-gray-100 dark:bg-gradient-to-r dark:from-gray-700 dark:to-gray-800 sepia:from-amber-200 sepia:to-amber-300 p-1 rounded-xl border border-gray-200 dark:border-gray-600 sepia:border-amber-300">
          <button
            onClick={() => handleModeChange('single')}
            className={`flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              viewMode === 'single'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg transform scale-105'
                : 'text-gray-700 dark:text-gray-300 sepia:text-amber-700 hover:text-gray-900 dark:hover:text-gray-100 sepia:hover:text-amber-900 hover:bg-white/70 dark:hover:bg-gray-600/70 sepia:hover:bg-amber-100/70'
            }`}
          >
            Single Text
          </button>
          <button
            onClick={() => handleModeChange('comparison')}
            className={`flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              viewMode === 'comparison'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg transform scale-105'
                : 'text-gray-700 dark:text-gray-300 sepia:text-amber-700 hover:text-gray-900 dark:hover:text-gray-100 sepia:hover:text-amber-900 hover:bg-white/70 dark:hover:bg-gray-600/70 sepia:hover:bg-amber-100/70'
            }`}
          >
            Compare Texts
          </button>
        </div>
      </div>

      {/* Religion Dropdown */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900 mb-4">
          Select Religion
        </h3>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-700 sepia:bg-amber-200 rounded-xl border border-gray-200 dark:border-gray-600 sepia:border-amber-300 hover:bg-gray-50 dark:hover:bg-gray-600 sepia:hover:bg-amber-300 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {selectedReligionInfo ? (
                <>
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                    style={{ backgroundColor: selectedReligionInfo.color }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      {getReligionIcon(selectedReligion!)}
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">
                    {selectedReligionInfo.name}
                  </span>
                </>
              ) : (
                <span className="font-medium text-gray-500 dark:text-gray-400 sepia:text-amber-600">
                  Choose a religion...
                </span>
              )}
            </div>
            {isDropdownOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 sepia:bg-amber-50 rounded-xl border border-gray-200 dark:border-gray-700 sepia:border-amber-200 shadow-lg z-10 max-h-64 overflow-y-auto">
              {RELIGIONS.map((religion) => (
                <button
                  key={religion.id}
                  onClick={() => handleReligionChange(religion.id)}
                  className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 sepia:hover:bg-amber-100 transition-colors first:rounded-t-xl last:rounded-b-xl"
                >
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                    style={{ backgroundColor: religion.color }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      {getReligionIcon(religion.id)}
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">
                      {religion.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 sepia:text-amber-600">
                      {religion.verseCount?.toLocaleString()} verses
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Subset Selection */}
      {selectedReligionInfo && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900 mb-4">
            {viewMode === 'single' ? 'Select a Text' : 'Select Texts to Compare'}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedReligionInfo.subsets?.map((subset) => {
              const isSelected = selectedSubsets.some(s => s.religion === selectedReligion && s.subset === subset.id);
              const isDisabled = subset.comingSoon;
              
              return (
                <button
                  key={subset.id}
                  onClick={() => !isDisabled && selectedReligion && handleSubsetToggle(selectedReligion, subset.id)}
                  disabled={isDisabled}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    isSelected
                      ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900 sepia:from-amber-100 sepia:to-amber-200 shadow-md'
                      : isDisabled
                      ? 'border-gray-200 dark:border-gray-700 sepia:border-amber-200 bg-gray-50 dark:bg-gray-800 sepia:bg-amber-50 cursor-not-allowed opacity-60'
                      : 'border-gray-200 dark:border-gray-700 sepia:border-amber-200 bg-white dark:bg-gray-800 sepia:from-amber-50 sepia:to-amber-100 hover:border-gray-300 dark:hover:border-gray-600 sepia:hover:border-amber-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">
                          {subset.name}
                        </h4>
                        {subset.comingSoon && (
                          <span className="text-xs bg-gray-200 dark:bg-gray-700 sepia:bg-amber-300 text-gray-600 dark:text-gray-400 sepia:text-amber-700 px-2 py-1 rounded-full">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 sepia:text-amber-600">
                        {subset.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="ml-3">
                        <Check className="w-5 h-5 text-primary-600 dark:text-primary-400 sepia:text-amber-600" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Summary */}
      {selectedSubsets.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-gray-700 sepia:bg-amber-200 rounded-xl border border-blue-100 dark:border-gray-600 sepia:border-amber-300">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900 mb-2">
            Selected Texts ({selectedSubsets.length}):
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedSubsets.map((selected, index) => {
              const religionInfo = RELIGIONS.find(r => r.id === selected.religion);
              const subsetInfo = religionInfo?.subsets?.find(s => s.id === selected.subset);
              return (
                <span
                  key={`${selected.religion}-${selected.subset}-${index}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 sepia:bg-amber-200 text-primary-800 dark:text-primary-200 sepia:text-amber-800"
                >
                  {religionInfo?.name}: {subsetInfo?.name}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}