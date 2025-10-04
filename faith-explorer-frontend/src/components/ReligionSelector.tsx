import { Check } from 'lucide-react';
import { RELIGIONS } from '../types';
import { useStore } from '../store/useStore';

export function ReligionSelector() {
  const { viewMode, setViewMode, selectedReligions, toggleReligion, setSelectedReligions } = useStore();

  const handleModeChange = (mode: 'single' | 'comparison') => {
    setViewMode(mode);
    if (mode === 'single' && selectedReligions.length > 1) {
      setSelectedReligions([selectedReligions[0]]);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-sage-200 overflow-hidden">
      {/* Mode Toggle */}
      <div className="p-4 sm:p-6 pb-4 border-b border-sage-100">
        <div className="inline-flex w-full sm:w-auto bg-sage-100 rounded-xl p-1 gap-1">
          <button
            onClick={() => handleModeChange('single')}
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
              viewMode === 'single'
                ? 'bg-white text-primary-700 shadow-soft'
                : 'text-sage-600 hover:text-sage-900'
            }`}
          >
            Single Religion
          </button>
          <button
            onClick={() => handleModeChange('comparison')}
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
              viewMode === 'comparison'
                ? 'bg-white text-primary-700 shadow-soft'
                : 'text-sage-600 hover:text-sage-900'
            }`}
          >
            Compare Religions
          </button>
        </div>
      </div>

      {/* Religion Selection */}
      <div className="p-4 sm:p-6">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-sage-900 mb-1">
            {viewMode === 'single' ? 'Select a Religion' : 'Select Religions to Compare'}
          </h3>
          <p className="text-xs text-sage-500">
            {viewMode === 'single' 
              ? 'Choose one faith tradition to explore' 
              : 'Choose 2-7 traditions for comparison'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                className={`group relative p-4 rounded-xl text-left transition-all duration-200 ${
                  isSelected
                    ? 'bg-white shadow-soft-lg scale-[1.02]'
                    : 'bg-sage-50 hover:bg-white hover:shadow-soft'
                } ${!canSelect ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                style={{
                  borderLeft: isSelected ? `4px solid ${religion.color}` : '4px solid transparent',
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 
                      className="font-bold text-base mb-0.5 truncate"
                      style={{ color: isSelected ? religion.color : '#0f172a' }}
                    >
                      {religion.name}
                    </h4>
                    <p className="text-xs text-sage-600 font-medium truncate">{religion.text}</p>
                  </div>
                  {isSelected && (
                    <div 
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: religion.color }}
                    >
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {viewMode === 'comparison' && selectedReligions.length < 2 && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-sm text-amber-900 font-medium">
              Please select at least 2 religions to compare
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
