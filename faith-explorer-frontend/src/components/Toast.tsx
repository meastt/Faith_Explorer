import { create } from 'zustand';
import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

type ToastVariant = 'success' | 'error' | 'info';

interface ToastState {
  message: string | null;
  variant: ToastVariant;
  show: (message: string, variant?: ToastVariant) => void;
  dismiss: () => void;
}

export const useToast = create<ToastState>((set) => ({
  message: null,
  variant: 'success',
  show: (message, variant = 'success') => set({ message, variant }),
  dismiss: () => set({ message: null }),
}));

export function showToast(message: string, variant: ToastVariant = 'success') {
  useToast.getState().show(message, variant);
}

export function Toast() {
  const { message, variant, dismiss } = useToast();

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(dismiss, 3000);
    return () => clearTimeout(timer);
  }, [message, dismiss]);

  if (!message) return null;

  const styles = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800',
      text: 'text-green-800 dark:text-green-200',
      icon: <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />,
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-200',
      icon: <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />,
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-200',
      icon: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />,
    },
  };

  const s = styles[variant];

  return (
    <div className="fixed top-[calc(env(safe-area-inset-top)+4rem)] left-1/2 -translate-x-1/2 z-[9999] animate-in fade-in slide-in-from-top-2 duration-300 w-[90%] max-w-md">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${s.bg}`}>
        {s.icon}
        <p className={`text-sm font-medium flex-1 ${s.text}`}>{message}</p>
        <button onClick={dismiss} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
          <X className={`w-4 h-4 ${s.text}`} />
        </button>
      </div>
    </div>
  );
}
