import { Heart, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation('common');

  const openExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="relative mt-auto bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 overflow-hidden">
      {/* Decorative Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <button
              onClick={() => openExternalLink('https://faithexplorer.app/privacy')}
              className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors"
            >
              <span>{t('footer.privacyPolicy')}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <button
              onClick={() => openExternalLink('https://faithexplorer.app/terms/')}
              className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors"
            >
              <span>{t('footer.termsOfService')}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <button
              onClick={() => window.location.href = 'mailto:mike@faithexplorer.app'}
              className="text-white/90 hover:text-white transition-colors"
            >
              {t('footer.contactSupport')}
            </button>
          </div>

          {/* Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-white/80">
            <p>&copy; {currentYear} {t('footer.copyright')}</p>
            <span className="hidden sm:inline">&bull;</span>
            <div className="flex items-center gap-1.5">
              <span>{t('footer.madeWith')}</span>
              <Heart className="w-3.5 h-3.5 text-pink-300 fill-current" />
              <span>{t('footer.forSeekers')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
