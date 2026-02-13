import { X, Mail, Gift, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useTranslation } from 'react-i18next';

interface EmailOptInModalProps {
    onClose: () => void;
}

export function EmailOptInModal({ onClose }: EmailOptInModalProps) {
    const [email, setEmailInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { setEmail, dismissEmailOptIn } = useStore();
    const { t } = useTranslation('common');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !email.includes('@')) return;

        setIsSubmitting(true);

        // Save email and apply bonus
        setEmail(email.trim());

        // Small delay for visual feedback
        await new Promise(resolve => setTimeout(resolve, 500));

        onClose();
    };

    const handleDismiss = () => {
        dismissEmailOptIn();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-sand-50 dark:bg-stone-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 relative border border-gold-200 dark:border-gold-900/30 animate-in fade-in zoom-in duration-300">
                <button
                    onClick={handleDismiss}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg bg-sand-200 dark:bg-stone-800 hover:bg-sand-300 dark:hover:bg-stone-700 transition-colors"
                    aria-label="Close"
                >
                    <X className="w-4 h-4 text-stone-600 dark:text-stone-400" />
                </button>

                {/* Header with Icon */}
                <div className="text-center mb-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-gold-300 to-bronze-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-glow">
                        <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-1">
                        {t('emailOptIn.title')}
                    </h2>
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                        {t('emailOptIn.subtitle')}
                    </p>
                </div>

                {/* Incentive Badge */}
                <div className="flex items-center justify-center gap-2 mb-5 py-2.5 px-4 bg-gradient-to-r from-gold-100 to-bronze-100 dark:from-gold-900/20 dark:to-bronze-900/20 rounded-xl border border-gold-200 dark:border-gold-800">
                    <Gift className="w-5 h-5 text-bronze-600 dark:text-bronze-400" />
                    <span className="text-sm font-bold text-bronze-700 dark:text-bronze-300">
                        {t('emailOptIn.bonusBadge')}
                    </span>
                </div>

                {/* Email Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmailInput(e.target.value)}
                            placeholder={t('emailOptIn.placeholder')}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-sand-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                            autoComplete="email"
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !email.includes('@')}
                        className="w-full py-3.5 bg-gradient-to-r from-bronze-600 to-gold-600 text-white rounded-xl font-bold hover:from-bronze-700 hover:to-gold-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                {t('loading.unlocking')}
                            </>
                        ) : (
                            <>
                                <Gift className="w-4 h-4" />
                                {t('emailOptIn.submitButton')}
                            </>
                        )}
                    </button>
                </form>

                {/* Dismiss Option */}
                <button
                    onClick={handleDismiss}
                    className="w-full mt-3 py-2 text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 transition-colors"
                >
                    {t('emailOptIn.maybeLater')}
                </button>

                {/* Privacy Note */}
                <p className="mt-4 text-xs text-center text-stone-400 dark:text-stone-500">
                    {t('emailOptIn.privacyNote')}
                </p>
            </div>
        </div>
    );
}
