import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'error';
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    error: <AlertCircle className="w-4 h-4 text-red-500" />,
    info: <Info className="w-4 h-4 text-indigo-500" />,
  };

  const borders = {
    success: 'border-emerald-200/80 bg-white shadow-emerald-500/10',
    error: 'border-red-200/80 bg-white shadow-red-500/10',
    info: 'border-indigo-200/80 bg-white shadow-indigo-500/10',
  };

  const type = toast.type || 'success';

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border shadow-lg ${borders[type]} animate-in slide-in-from-bottom-5 duration-200`}
    >
      <div className="mt-0.5">{icons[type]}</div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold text-slate-900">{toast.title}</div>
        {toast.description && (
          <div className="text-[11px] text-slate-600 mt-0.5 leading-snug">{toast.description}</div>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
