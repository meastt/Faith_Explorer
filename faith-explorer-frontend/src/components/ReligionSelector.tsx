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
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => handleModeChange('single')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            viewMode === 'single'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Single Religion
        </button>
        <button
          onClick={() => handleModeChange('comparison')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            viewMode === 'comparison'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Compare Religions
        </button>
      </div>

      {/* Religion Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {viewMode === 'single' ? 'Select Religion' : 'Select Religions to Compare (2-7)'}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  isSelected
                    ? 'border-current shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                } ${!canSelect ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{
                  borderColor: isSelected ? religion.color : undefined,
                  backgroundColor: isSelected ? `${religion.color}10` : undefined,
                }}
              >
                <div className="font-semibold text-sm" style={{ color: religion.color }}>
                  {religion.name}
                </div>
                <div className="text-xs text-gray-600">{religion.text}</div>
              </button>
            );
          })}
        </div>

        {viewMode === 'comparison' && selectedReligions.length < 2 && (
          <p className="text-sm text-amber-600 mt-2">
            Please select at least 2 religions to compare
          </p>
        )}
      </div>
    </div>
  );
}
