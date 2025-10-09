import { X, Settings as SettingsIcon, Shield, HelpCircle, Mail, ExternalLink, ChevronRight, Moon, Sun, Monitor, Type, Palette, Trash2, RefreshCw, Info, Heart } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../store/useStore';

interface SettingsProps {
  onClose: () => void;
}

export function Settings({ onClose }: SettingsProps) {
  const { readingPreferences, setReadingPreferences, resetUsage } = useStore();
  const [activeSection, setActiveSection] = useState<'main' | 'appearance' | 'support' | 'legal' | 'data' | 'purchases' | 'about'>('main');

  const clearLocalData = () => {
    try {
      // Clear zustand persisted store and app-specific local storage keys
      localStorage.removeItem('faith-explorer-storage');
      localStorage.removeItem('faithExplorer_appVersion');
      localStorage.removeItem('faithExplorer_hasSeenOnboarding');
      localStorage.removeItem('faithExplorer_premium');
      localStorage.removeItem('faithExplorer_usage');
      resetUsage();
      alert('All local data has been deleted from this device.');
    } catch (e) {
      alert('Failed to delete local data.');
    }
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'sepia') => {
    setReadingPreferences({
      ...readingPreferences,
      theme,
    });
  };

  const handleFontFamilyChange = (fontFamily: 'sans' | 'serif' | 'dyslexic') => {
    setReadingPreferences({
      ...readingPreferences,
      fontFamily,
    });
  };

  const handleFontSizeChange = (fontSize: number) => {
    setReadingPreferences({
      ...readingPreferences,
      fontSize,
    });
  };

  const openExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const MainSettings = () => (
    <div className="space-y-4">
      <button
        onClick={() => setActiveSection('appearance')}
        className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 sepia:hover:bg-amber-200 transition-colors"
      >
        <Palette className="w-5 h-5 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700" />
        <div className="flex-1 text-left">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">Appearance</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">Customize your reading experience</p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-500" />
      </button>

      <button
        onClick={() => setActiveSection('legal')}
        className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 sepia:hover:bg-amber-200 transition-colors"
      >
        <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700" />
        <div className="flex-1 text-left">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">Privacy & Terms</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">View our privacy policy and terms</p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-500" />
      </button>

      <button
        onClick={() => setActiveSection('support')}
        className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 sepia:hover:bg-amber-200 transition-colors"
      >
        <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700" />
        <div className="flex-1 text-left">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">Support</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">Get help and contact us</p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );

  const AppearanceSettings = () => (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 sepia:text-amber-900 mb-3">Theme</h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleThemeChange('light')}
            className={`p-4 rounded-lg border-2 transition-all ${
              readingPreferences.theme === 'light'
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 sepia:bg-amber-100'
                : 'border-gray-200 dark:border-gray-600 sepia:border-amber-300 hover:border-gray-300 dark:hover:border-gray-500 sepia:hover:border-amber-400'
            }`}
          >
            <Sun className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">Light</span>
          </button>
          <button
            onClick={() => handleThemeChange('dark')}
            className={`p-4 rounded-lg border-2 transition-all ${
              readingPreferences.theme === 'dark'
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 sepia:bg-amber-100'
                : 'border-gray-200 dark:border-gray-600 sepia:border-amber-300 hover:border-gray-300 dark:hover:border-gray-500 sepia:hover:border-amber-400'
            }`}
          >
            <Moon className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">Dark</span>
          </button>
          <button
            onClick={() => handleThemeChange('sepia')}
            className={`p-4 rounded-lg border-2 transition-all ${
              readingPreferences.theme === 'sepia'
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 sepia:bg-amber-100'
                : 'border-gray-200 dark:border-gray-600 sepia:border-amber-300 hover:border-gray-300 dark:hover:border-gray-500 sepia:hover:border-amber-400'
            }`}
          >
            <Monitor className="w-6 h-6 mx-auto mb-2 text-amber-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">Sepia</span>
          </button>
        </div>
      </div>

      {/* Font Family */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 sepia:text-amber-900 mb-3">Font Family</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'sans', label: 'Sans', icon: Type },
            { id: 'serif', label: 'Serif', icon: Type },
            { id: 'dyslexic', label: 'Dyslexic', icon: Type },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleFontFamilyChange(id as 'sans' | 'serif' | 'dyslexic')}
              className={`p-4 rounded-lg border-2 transition-all ${
                readingPreferences.fontFamily === id
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 sepia:bg-amber-100'
                  : 'border-gray-200 dark:border-gray-600 sepia:border-amber-300 hover:border-gray-300 dark:hover:border-gray-500 sepia:hover:border-amber-400'
              }`}
            >
              <Icon className="w-6 h-6 mx-auto mb-2 text-gray-600 dark:text-gray-400 sepia:text-amber-700" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 sepia:text-amber-900 mb-3">Font Size</h3>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">Small</span>
          <input
            type="range"
            min="12"
            max="24"
            value={readingPreferences.fontSize}
            onChange={(e) => handleFontSizeChange(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 sepia:bg-amber-300 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">Large</span>
        </div>
        <div className="text-center mt-2">
          <span className="text-sm text-gray-500 dark:text-gray-500 sepia:text-amber-600">{readingPreferences.fontSize}px</span>
        </div>
      </div>
    </div>
  );

  const SupportSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg">
        <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700" />
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">Contact Support</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">Get help with any issues</p>
        </div>
        <button
          onClick={() => openExternalLink('mailto:support@faithexplorer.app')}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 sepia:hover:bg-amber-200 rounded flex items-center gap-1"
        >
          <span className="text-sm text-indigo-600 dark:text-indigo-400 sepia:text-amber-700">Email</span>
          <ExternalLink className="w-3 h-3 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700" />
        </button>
      </div>

      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg">
        <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700" />
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">Privacy Policy</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">How we protect your data</p>
        </div>
        <button
          onClick={() => openExternalLink('https://faithexplorer.app/privacy')}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 sepia:hover:bg-amber-200 rounded flex items-center gap-1"
        >
          <span className="text-sm text-indigo-600 dark:text-indigo-400 sepia:text-amber-700">View</span>
          <ExternalLink className="w-3 h-3 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700" />
        </button>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 sepia:bg-amber-100 rounded-lg">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 sepia:text-amber-900 mb-2">Need Help?</h4>
        <p className="text-sm text-blue-800 dark:text-blue-200 sepia:text-amber-800">
          If you're experiencing any issues or have questions about Faith Explorer, 
          please don't hesitate to reach out to our support team.
        </p>
      </div>
    </div>
  );

  const LegalSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg">
        <div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">Privacy Policy</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">How we protect your data</p>
        </div>
        <button onClick={() => openExternalLink('https://faithexplorer.app/privacy')} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 sepia:hover:bg-amber-200 rounded flex items-center gap-1">
          <span className="text-sm text-indigo-600 dark:text-indigo-400 sepia:text-amber-700">View</span>
          <ExternalLink className="w-3 h-3 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700" />
        </button>
      </div>
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg">
        <div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">Terms of Use</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">Read our terms</p>
        </div>
        <button onClick={() => openExternalLink('https://faithexplorer.app/terms/')} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 sepia:hover:bg-amber-200 rounded flex items-center gap-1">
          <span className="text-sm text-indigo-600 dark:text-indigo-400 sepia:text-amber-700">View</span>
          <ExternalLink className="w-3 h-3 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700" />
        </button>
      </div>
    </div>
  );

  const PurchasesSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg">
        <div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">Manage Subscription</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">Open iOS Subscriptions</p>
        </div>
        <a href="itms-apps://apps.apple.com/account/subscriptions" className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 sepia:hover:bg-amber-200 rounded flex items-center gap-1">
          <span className="text-sm text-indigo-600 dark:text-indigo-400 sepia:text-amber-700">Open</span>
          <ExternalLink className="w-3 h-3 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700" />
        </a>
      </div>
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg">
        <div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">Restore Purchases</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">Re-activate previous purchases</p>
        </div>
        <button onClick={() => window.dispatchEvent(new CustomEvent('fe_restore_purchases'))} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 sepia:hover:bg-amber-200 rounded flex items-center gap-1">
          <span className="text-sm text-indigo-600 dark:text-indigo-400 sepia:text-amber-700">Restore</span>
          <RefreshCw className="w-3 h-3 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700" />
        </button>
      </div>
      <p className="text-xs text-gray-500">Subscriptions are managed by Apple. You can cancel anytime from your device settings.</p>
    </div>
  );

  const DataSettings = () => (
    <div className="space-y-4">
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 sepia:bg-amber-100 rounded-lg">
        <h4 className="font-medium text-yellow-900 dark:text-yellow-100 sepia:text-amber-900 mb-1">Delete Local Data</h4>
        <p className="text-sm text-yellow-800 dark:text-yellow-200 sepia:text-amber-800">
          This app does not create user accounts or store personal data on servers. You can delete all data stored on this device at any time.
        </p>
      </div>
      <button onClick={clearLocalData} className="w-full flex items-center justify-center gap-2 p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg">
        <Trash2 className="w-4 h-4" />
        Delete Local Data
      </button>
    </div>
  );

  const AboutSettings = () => (
    <div className="space-y-4">
      <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 sepia:from-amber-100 sepia:to-amber-200 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900 mb-2">Faith Explorer</h4>
        <p className="text-sm text-gray-700 dark:text-gray-300 sepia:text-amber-800 mb-3">
          Explore sacred texts from major world religions. Compare teachings, search for wisdom on life's questions, and discover the common threads of spirituality across faiths.
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">
          <Heart className="w-4 h-4 text-pink-500 fill-current" />
          <span>Made with love for seekers of wisdom</span>
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg space-y-2">
        <div className="text-sm text-gray-700 dark:text-gray-300 sepia:text-amber-800">
          <strong>Version:</strong> 2.0.2 (Build 10)
        </div>
        <div className="text-sm text-gray-700 dark:text-gray-300 sepia:text-amber-800">
          <strong>Copyright:</strong> © {new Date().getFullYear()} Faith Explorer
        </div>
      </div>

      <div className="flex flex-col gap-2 text-sm">
        <button
          onClick={() => openExternalLink('https://faithexplorer.app/privacy')}
          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 sepia:hover:bg-amber-200 transition-colors"
        >
          <span className="text-gray-900 dark:text-gray-100 sepia:text-amber-900">Privacy Policy</span>
          <ExternalLink className="w-4 h-4 text-gray-500" />
        </button>
        <button
          onClick={() => openExternalLink('https://faithexplorer.app/terms')}
          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 sepia:hover:bg-amber-200 transition-colors"
        >
          <span className="text-gray-900 dark:text-gray-100 sepia:text-amber-900">Terms of Service</span>
          <ExternalLink className="w-4 h-4 text-gray-500" />
        </button>
        <button
          onClick={() => window.location.href = 'mailto:support@faithexplorer.app'}
          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 sepia:hover:bg-amber-200 transition-colors"
        >
          <span className="text-gray-900 dark:text-gray-100 sepia:text-amber-900">Contact Support</span>
          <Mail className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 sepia:bg-amber-50 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <SettingsIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 sepia:text-amber-900">Settings</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">
                  {activeSection === 'main' && 'Customize your experience'}
                  {activeSection === 'appearance' && 'Appearance settings'}
                  {activeSection === 'support' && 'Help & support'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {activeSection !== 'main' && (
                <button
                  onClick={() => setActiveSection('main')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 sepia:hover:bg-amber-200 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-gray-500 rotate-180" />
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 sepia:hover:bg-amber-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          {activeSection === 'main' && (
            <>
              <MainSettings />
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => setActiveSection('legal')}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 sepia:hover:bg-amber-200 transition-colors"
                >
                  <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700" />
                  <div className="flex-1 text-left">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">Legal</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">Privacy Policy and Terms of Use</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => setActiveSection('purchases')}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 sepia:hover:bg-amber-200 transition-colors"
                >
                  <RefreshCw className="w-5 h-5 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700" />
                  <div className="flex-1 text-left">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">Purchases</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">Manage or restore subscriptions</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => setActiveSection('data')}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 sepia:hover:bg-amber-200 transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                  <div className="flex-1 text-left">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">Data</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">Delete all local data on this device</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => setActiveSection('about')}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 sepia:hover:bg-amber-200 transition-colors"
                >
                  <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700" />
                  <div className="flex-1 text-left">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">About</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">App info, version, and credits</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </>
          )}
          {activeSection === 'appearance' && <AppearanceSettings />}
          {activeSection === 'support' && <SupportSettings />}
          {activeSection === 'legal' && <LegalSettings />}
          {activeSection === 'purchases' && <PurchasesSettings />}
          {activeSection === 'data' && <DataSettings />}
          {activeSection === 'about' && <AboutSettings />}
        </div>
      </div>
    </div>
  );
}