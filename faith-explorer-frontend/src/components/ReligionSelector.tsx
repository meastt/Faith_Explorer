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
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Mode Toggle */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => handleModeChange('single')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'single'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Single Religion
          </button>
          <button
            onClick={() => handleModeChange('comparison')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'comparison'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Compare Religions
          </button>
        </div>
      </div>

      {/* Religion Selection */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {viewMode === 'single' ? 'Select a Religion' : 'Select Religions to Compare'}
        </h3>
        
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
                className={`p-4 text-left border-2 rounded-lg transition-colors ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                } ${!canSelect ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                style={{
                  borderColor: isSelected ? religion.color : undefined,
                  backgroundColor: isSelected ? `${religion.color}10` : undefined,
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 mb-1" style={{ color: religion.color }}>
                      {religion.name}
                    </div>
                    <div className="text-sm text-gray-600">{religion.text}</div>
                    {religion.verseCount && (
                      <div className="text-xs text-gray-500 mt-1">
                        {religion.verseCount.toLocaleString()} verses
                      </div>
                    )}
                  </div>
                  {religion.coverage && (
                    <div className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                      religion.coverage === 'full'
                        ? 'bg-green-100 text-green-700'
                        : religion.coverage === 'partial'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {religion.coverage === 'full' ? '✓ Full' : religion.coverage === 'partial' ? 'Partial' : 'Limited'}
                    </div>
                  )}
                </div>
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
