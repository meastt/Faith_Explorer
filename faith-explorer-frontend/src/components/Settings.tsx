import { X, Shield, HelpCircle, Mail, ExternalLink, ChevronRight, Moon, Sun, Monitor, Type, Palette, Trash2, RefreshCw, Info, Heart, Award, Bell, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/useStore';
import { Badges } from './Badges';
import { notificationService } from '../services/notifications';
import { showToast } from './Toast';

interface SettingsProps {
  onClose: () => void;
}

export function Settings({ onClose }: SettingsProps) {
  const { t } = useTranslation('settings');
  const { t: tc } = useTranslation('common');
  const { readingPreferences, setReadingPreferences, resetUsage, notificationPreferences, setNotificationPreferences, language, setLanguage } = useStore();
  const [activeSection, setActiveSection] = useState<'main' | 'appearance' | 'badges' | 'notifications' | 'support' | 'legal' | 'data' | 'purchases' | 'about' | 'language'>('main');
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  const clearLocalData = () => {
    try {
      localStorage.removeItem('faith-explorer-storage');
      localStorage.removeItem('faithExplorer_appVersion');
      localStorage.removeItem('faithExplorer_hasSeenOnboarding');
      localStorage.removeItem('faithExplorer_premium');
      localStorage.removeItem('faithExplorer_usage');
      resetUsage();
      showToast(tc('toast.localDataDeleted'));
    } catch (e) {
      showToast(tc('toast.localDataDeleteFailed'), 'error');
    }
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'sepia') => {
    setReadingPreferences({ ...readingPreferences, theme });
  };

  const handleFontFamilyChange = (fontFamily: 'sans' | 'serif' | 'dyslexic') => {
    setReadingPreferences({ ...readingPreferences, fontFamily });
  };

  const handleFontSizeChange = (fontSize: number) => {
    setReadingPreferences({ ...readingPreferences, fontSize });
  };

  const openExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const MainSettings = () => (
    <div className="space-y-1.5">
      <button
        onClick={() => setActiveSection('language')}
        className="w-full flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
      >
        <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700" />
        <span className="flex-1 text-left font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900 text-sm">{t('language.title')}</span>
        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
          {language === 'en' ? 'English' : 'Español'}
        </span>
        <ChevronRight className="w-4 h-4 text-gray-500" />
      </button>

      <button
        onClick={() => setActiveSection('appearance')}
        className="w-full flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
      >
        <Palette className="w-5 h-5 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700" />
        <span className="flex-1 text-left font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900 text-sm">{t('settings.sections.appearance.title')}</span>
        <ChevronRight className="w-4 h-4 text-gray-500" />
      </button>

      <button
        onClick={() => setActiveSection('badges')}
        className="w-full flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
      >
        <Award className="w-5 h-5 text-amber-600 dark:text-amber-400 sepia:text-amber-700" />
        <span className="flex-1 text-left font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900 text-sm">{t('settings.sections.badges.title')}</span>
        <ChevronRight className="w-4 h-4 text-gray-500" />
      </button>

      <button
        onClick={() => setActiveSection('notifications')}
        className="w-full flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
      >
        <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700" />
        <span className="flex-1 text-left font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900 text-sm">{t('settings.sections.notifications.title')}</span>
        <ChevronRight className="w-4 h-4 text-gray-500" />
      </button>

      <button
        onClick={() => setActiveSection('legal')}
        className="w-full flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
      >
        <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700" />
        <span className="flex-1 text-left font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900 text-sm">{t('settings.sections.privacyAndTerms.title')}</span>
        <ChevronRight className="w-4 h-4 text-gray-500" />
      </button>

      <button
        onClick={() => setActiveSection('support')}
        className="w-full flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
      >
        <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700" />
        <span className="flex-1 text-left font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900 text-sm">{t('settings.sections.support.title')}</span>
        <ChevronRight className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );

  const LanguageSettings = () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700 mb-4">
        {t('language.selectDescription')}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setLanguage('en')}
          className={`p-4 rounded-lg border-2 transition-all text-center ${language === 'en'
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 sepia:bg-amber-100'
            : 'border-gray-200 dark:border-gray-600 sepia:border-amber-300 hover:border-gray-300 dark:hover:border-gray-500 sepia:hover:border-amber-400'
            }`}
        >
          <span className="text-2xl block mb-2">🇺🇸</span>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">English</span>
        </button>
        <button
          onClick={() => setLanguage('es')}
          className={`p-4 rounded-lg border-2 transition-all text-center ${language === 'es'
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 sepia:bg-amber-100'
            : 'border-gray-200 dark:border-gray-600 sepia:border-amber-300 hover:border-gray-300 dark:hover:border-gray-500 sepia:hover:border-amber-400'
            }`}
        >
          <span className="text-2xl block mb-2">🇪🇸</span>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">Español</span>
        </button>
      </div>
    </div>
  );

  const AppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 sepia:text-amber-900 mb-3">{t('appearance.theme.title')}</h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleThemeChange('light')}
            className={`p-4 rounded-lg border-2 transition-all ${readingPreferences.theme === 'light'
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 sepia:bg-amber-100'
              : 'border-gray-200 dark:border-gray-600 sepia:border-amber-300 hover:border-gray-300 dark:hover:border-gray-500 sepia:hover:border-amber-400'
              }`}
          >
            <Sun className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">{t('appearance.theme.light')}</span>
          </button>
          <button
            onClick={() => handleThemeChange('dark')}
            className={`p-4 rounded-lg border-2 transition-all ${readingPreferences.theme === 'dark'
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 sepia:bg-amber-100'
              : 'border-gray-200 dark:border-gray-600 sepia:border-amber-300 hover:border-gray-300 dark:hover:border-gray-500 sepia:hover:border-amber-400'
              }`}
          >
            <Moon className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">{t('appearance.theme.dark')}</span>
          </button>
          <button
            onClick={() => handleThemeChange('sepia')}
            className={`p-4 rounded-lg border-2 transition-all ${readingPreferences.theme === 'sepia'
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 sepia:bg-amber-100'
              : 'border-gray-200 dark:border-gray-600 sepia:border-amber-300 hover:border-gray-300 dark:hover:border-gray-500 sepia:hover:border-amber-400'
              }`}
          >
            <Monitor className="w-6 h-6 mx-auto mb-2 text-amber-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">{t('appearance.theme.sepia')}</span>
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 sepia:text-amber-900 mb-3">{t('appearance.fontFamily.title')}</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'sans', label: t('appearance.fontFamily.sans'), icon: Type },
            { id: 'serif', label: t('appearance.fontFamily.serif'), icon: Type },
            { id: 'dyslexic', label: t('appearance.fontFamily.dyslexic'), icon: Type },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleFontFamilyChange(id as 'sans' | 'serif' | 'dyslexic')}
              className={`p-4 rounded-lg border-2 transition-all ${readingPreferences.fontFamily === id
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

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 sepia:text-amber-900 mb-3">{t('appearance.fontSize.title')}</h3>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">{t('appearance.fontSize.small')}</span>
          <input
            type="range"
            min="12"
            max="24"
            value={readingPreferences.fontSize}
            onChange={(e) => handleFontSizeChange(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 sepia:bg-amber-300 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">{t('appearance.fontSize.large')}</span>
        </div>
        <div className="text-center mt-2">
          <span className="text-sm text-gray-500 dark:text-gray-500 sepia:text-amber-600">{readingPreferences.fontSize}px</span>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    notificationService.getPermissionStatus().then(status => {
      setPermissionGranted(status.granted);
    });
  }, []);

  const handleDailyWisdomToggle = async (enabled: boolean) => {
    if (enabled && permissionGranted === false) {
      const permission = await notificationService.requestPermission();
      setPermissionGranted(permission.granted);
      if (!permission.granted) return;
    }
    setNotificationPreferences({ dailyWisdomEnabled: enabled });
    if (enabled) {
      await notificationService.scheduleDailyWisdom(notificationPreferences.dailyWisdomTime);
    } else {
      await notificationService.cancelDailyWisdom();
    }
  };

  const handleTimeChange = async (time: string) => {
    setNotificationPreferences({ dailyWisdomTime: time });
    if (notificationPreferences.dailyWisdomEnabled) {
      await notificationService.scheduleDailyWisdom(time);
    }
  };

  const handleStreakRemindersToggle = async (enabled: boolean) => {
    if (enabled && permissionGranted === false) {
      const permission = await notificationService.requestPermission();
      setPermissionGranted(permission.granted);
      if (!permission.granted) return;
    }
    setNotificationPreferences({ streakRemindersEnabled: enabled });
    if (!enabled) {
      await notificationService.cancelStreakReminder();
    }
  };

  const NotificationsSettings = () => (
    <div className="space-y-6">
      {permissionGranted === false && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 sepia:bg-amber-100 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 sepia:text-amber-800">
            {t('notifications.permissionDisabled')}
          </p>
        </div>
      )}

      <div className="p-4 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">{t('notifications.dailyWisdom.title')}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">{t('notifications.dailyWisdom.description')}</p>
          </div>
          <button
            onClick={() => handleDailyWisdomToggle(!notificationPreferences.dailyWisdomEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationPreferences.dailyWisdomEnabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationPreferences.dailyWisdomEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        {notificationPreferences.dailyWisdomEnabled && (
          <div className="flex items-center gap-3 pt-2 border-t border-gray-200 dark:border-gray-600 sepia:border-amber-300">
            <label className="text-sm text-gray-700 dark:text-gray-300 sepia:text-amber-800">{t('notifications.dailyWisdom.timeLabel')}</label>
            <input
              type="time"
              value={notificationPreferences.dailyWisdomTime}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 sepia:bg-amber-50 sepia:border-amber-300"
            />
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">{t('notifications.streakProtection.title')}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">{t('notifications.streakProtection.description')}</p>
          </div>
          <button
            onClick={() => handleStreakRemindersToggle(!notificationPreferences.streakRemindersEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationPreferences.streakRemindersEnabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationPreferences.streakRemindersEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 sepia:text-amber-600 mt-2">
          {t('notifications.streakProtection.note')}
        </p>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 sepia:bg-amber-100 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200 sepia:text-amber-800">
          {t('notifications.respectNote')}
        </p>
      </div>
    </div>
  );

  const SupportSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg">
        <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700" />
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">{t('support.contactSupport.title')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">{t('support.contactSupport.description')}</p>
        </div>
        <button
          onClick={() => openExternalLink('mailto:mike@faithexplorer.app')}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 sepia:hover:bg-amber-200 rounded flex items-center gap-1"
        >
          <span className="text-sm text-indigo-600 dark:text-indigo-400 sepia:text-amber-700">{tc('buttons.email')}</span>
          <ExternalLink className="w-3 h-3 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700" />
        </button>
      </div>

      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg">
        <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700" />
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">{t('support.privacyPolicy.title')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">{t('support.privacyPolicy.description')}</p>
        </div>
        <button
          onClick={() => openExternalLink('https://faithexplorer.app/privacy')}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 sepia:hover:bg-amber-200 rounded flex items-center gap-1"
        >
          <span className="text-sm text-indigo-600 dark:text-indigo-400 sepia:text-amber-700">{tc('buttons.view')}</span>
          <ExternalLink className="w-3 h-3 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700" />
        </button>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 sepia:bg-amber-100 rounded-lg">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 sepia:text-amber-900 mb-2">{t('support.needHelp.title')}</h4>
        <p className="text-sm text-blue-800 dark:text-blue-200 sepia:text-amber-800">
          {t('support.needHelp.description')}
        </p>
      </div>
    </div>
  );

  const LegalSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg">
        <div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">{t('legal.privacyPolicy.title')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">{t('legal.privacyPolicy.description')}</p>
        </div>
        <button onClick={() => openExternalLink('https://faithexplorer.app/privacy')} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 sepia:hover:bg-amber-200 rounded flex items-center gap-1">
          <span className="text-sm text-indigo-600 dark:text-indigo-400 sepia:text-amber-700">{tc('buttons.view')}</span>
          <ExternalLink className="w-3 h-3 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700" />
        </button>
      </div>
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg">
        <div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">{t('legal.termsOfUse.title')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">{t('legal.termsOfUse.description')}</p>
        </div>
        <button onClick={() => openExternalLink('https://faithexplorer.app/terms/')} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 sepia:hover:bg-amber-200 rounded flex items-center gap-1">
          <span className="text-sm text-indigo-600 dark:text-indigo-400 sepia:text-amber-700">{tc('buttons.view')}</span>
          <ExternalLink className="w-3 h-3 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700" />
        </button>
      </div>
    </div>
  );

  const PurchasesSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg">
        <div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">{t('purchases.manageSubscription.title')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">{t('purchases.manageSubscription.description')}</p>
        </div>
        <a href="itms-apps://apps.apple.com/account/subscriptions" className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 sepia:hover:bg-amber-200 rounded flex items-center gap-1">
          <span className="text-sm text-indigo-600 dark:text-indigo-400 sepia:text-amber-700">{tc('buttons.open')}</span>
          <ExternalLink className="w-3 h-3 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700" />
        </a>
      </div>
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg">
        <div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">{t('purchases.restorePurchases.title')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">{t('purchases.restorePurchases.description')}</p>
        </div>
        <button onClick={() => window.dispatchEvent(new CustomEvent('fe_restore_purchases'))} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 sepia:hover:bg-amber-200 rounded flex items-center gap-1">
          <span className="text-sm text-indigo-600 dark:text-indigo-400 sepia:text-amber-700">{tc('buttons.restore')}</span>
          <RefreshCw className="w-3 h-3 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700" />
        </button>
      </div>
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gold-50 to-bronze-50 dark:from-gold-900/10 dark:to-bronze-900/10 sepia:bg-amber-100 rounded-lg border border-gold-200 dark:border-gold-900/30">
        <div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">{t('purchases.redeemPromoCode.title')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">{t('purchases.redeemPromoCode.description')}</p>
        </div>
        <a href="https://apps.apple.com/redeem" className="p-1 hover:bg-gold-100 dark:hover:bg-gold-900/20 sepia:hover:bg-amber-200 rounded flex items-center gap-1">
          <span className="text-sm text-bronze-600 dark:text-bronze-400 sepia:text-amber-700 font-medium">{tc('buttons.redeem')}</span>
          <ExternalLink className="w-3 h-3 text-bronze-600 dark:text-bronze-400 sepia:text-amber-700" />
        </a>
      </div>
      <p className="text-xs text-gray-500">{t('purchases.subscriptionManagedByApple')}</p>
    </div>
  );

  const DataSettings = () => (
    <div className="space-y-4">
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 sepia:bg-amber-100 rounded-lg">
        <h4 className="font-medium text-yellow-900 dark:text-yellow-100 sepia:text-amber-900 mb-1">{t('data.deleteLocalData.title')}</h4>
        <p className="text-sm text-yellow-800 dark:text-yellow-200 sepia:text-amber-800">
          {t('data.deleteLocalData.description')}
        </p>
      </div>
      <button onClick={clearLocalData} className="w-full flex items-center justify-center gap-2 p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg">
        <Trash2 className="w-4 h-4" />
        {t('data.deleteLocalData.button')}
      </button>
    </div>
  );

  const AboutSettings = () => (
    <div className="space-y-4">
      <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 sepia:from-amber-100 sepia:to-amber-200 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900 mb-2">{t('about.appName')}</h4>
        <p className="text-sm text-gray-700 dark:text-gray-300 sepia:text-amber-800 mb-3">
          {t('about.description')}
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">
          <Heart className="w-4 h-4 text-pink-500 fill-current" />
          <span>{t('about.madeWithLove')}</span>
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg space-y-2">
        <div className="text-sm text-gray-700 dark:text-gray-300 sepia:text-amber-800">
          <strong>{t('about.versionLabel')}</strong> {t('about.version')}
        </div>
        <div className="text-sm text-gray-700 dark:text-gray-300 sepia:text-amber-800">
          <strong>{t('about.copyrightLabel')}</strong> © {new Date().getFullYear()} {t('about.copyrightText')}
        </div>
      </div>

      <div className="flex flex-col gap-2 text-sm">
        <button
          onClick={() => openExternalLink('https://faithexplorer.app/privacy')}
          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 sepia:hover:bg-amber-200 transition-colors"
        >
          <span className="text-gray-900 dark:text-gray-100 sepia:text-amber-900">{tc('footer.privacyPolicy')}</span>
          <ExternalLink className="w-4 h-4 text-gray-500" />
        </button>
        <button
          onClick={() => openExternalLink('https://faithexplorer.app/terms/')}
          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 sepia:hover:bg-amber-200 transition-colors"
        >
          <span className="text-gray-900 dark:text-gray-100 sepia:text-amber-900">{tc('footer.termsOfService')}</span>
          <ExternalLink className="w-4 h-4 text-gray-500" />
        </button>
        <button
          onClick={() => window.location.href = 'mailto:mike@faithexplorer.app'}
          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 sepia:hover:bg-amber-200 transition-colors"
        >
          <span className="text-gray-900 dark:text-gray-100 sepia:text-amber-900">{tc('footer.contactSupport')}</span>
          <Mail className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  );


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 sepia:bg-amber-50 rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-y-auto sm:mx-4" onClick={e => e.stopPropagation()}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {activeSection !== 'main' && (
                <button
                  onClick={() => setActiveSection('main')}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-gray-500 rotate-180" />
                </button>
              )}
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 sepia:text-amber-900">{t('settings.title')}</h2>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {activeSection === 'main' && (
            <>
              <MainSettings />
              <div className="mt-2 space-y-1.5">

                <button
                  onClick={() => setActiveSection('purchases')}
                  className="w-full flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <RefreshCw className="w-5 h-5 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700" />
                  <span className="flex-1 text-left font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900 text-sm">{t('settings.sections.purchases.title')}</span>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => setActiveSection('data')}
                  className="w-full flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                  <span className="flex-1 text-left font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900 text-sm">{t('settings.sections.data.title')}</span>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => setActiveSection('about')}
                  className="w-full flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700" />
                  <span className="flex-1 text-left font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900 text-sm">{t('settings.sections.about.title')}</span>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </>
          )}
          {activeSection === 'language' && <LanguageSettings />}
          {activeSection === 'appearance' && <AppearanceSettings />}
          {activeSection === 'badges' && <Badges />}
          {activeSection === 'notifications' && <NotificationsSettings />}
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
