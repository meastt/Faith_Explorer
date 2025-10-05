import { Settings, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../store/useStore';

export function ReadingPreferences() {
  const [showMenu, setShowMenu] = useState(false);
  const { readingPreferences, setReadingPreferences } = useStore();

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Settings className="w-4 h-4" />
        <span className="hidden sm:inline">Reading</span>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-20 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Reading Preferences</h3>

            {/* Theme */}
            <div className="mb-4">
              <label className="text-xs font-medium text-gray-700 mb-2 block">Theme</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setReadingPreferences({ ...readingPreferences, theme: 'light' })}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-colors ${
                    readingPreferences.theme === 'light'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  <span className="text-xs font-medium">Light</span>
                </button>
                <button
                  onClick={() => setReadingPreferences({ ...readingPreferences, theme: 'dark' })}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-colors ${
                    readingPreferences.theme === 'dark'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  <span className="text-xs font-medium">Dark</span>
                </button>
                <button
                  onClick={() => setReadingPreferences({ ...readingPreferences, theme: 'sepia' })}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-colors ${
                    readingPreferences.theme === 'sepia'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="w-4 h-4 bg-amber-100 rounded-full border border-amber-300" />
                  <span className="text-xs font-medium">Sepia</span>
                </button>
              </div>
            </div>

            {/* Font Size */}
            <div className="mb-4">
              <label className="text-xs font-medium text-gray-700 mb-2 block">
                Font Size: {readingPreferences.fontSize}px
              </label>
              <input
                type="range"
                min="14"
                max="24"
                step="2"
                value={readingPreferences.fontSize}
                onChange={(e) =>
                  setReadingPreferences({ ...readingPreferences, fontSize: parseInt(e.target.value) })
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Small</span>
                <span>Large</span>
              </div>
            </div>

            {/* Font Family */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-2 block">Font Style</label>
              <select
                value={readingPreferences.fontFamily}
                onChange={(e) =>
                  setReadingPreferences({ ...readingPreferences, fontFamily: e.target.value as any })
                }
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="sans">Sans Serif (Modern)</option>
                <option value="serif">Serif (Traditional)</option>
                <option value="dyslexic">OpenDyslexic (Accessible)</option>
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
