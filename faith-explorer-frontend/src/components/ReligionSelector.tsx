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
                <div className="font-medium text-gray-900 mb-1" style={{ color: religion.color }}>
                  {religion.name}
                </div>
                <div className="text-sm text-gray-600">{religion.text}</div>
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
