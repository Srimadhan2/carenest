import { useEffect, useRef } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/utils/helpers/cn';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const styles = {
  success: 'border-success/30 bg-surface text-text',
  error: 'border-danger/30 bg-surface text-text',
  info: 'border-primary/30 bg-surface text-text',
};

export function Toast({ toast, onDismiss }) {
  const Icon = icons[toast.type] || Info;
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      tabIndex={-1}
      className={cn(
        'flex min-w-[280px] max-w-sm items-start gap-3 rounded-xl border p-4 shadow-lg',
        styles[toast.type],
      )}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
      <p className="flex-1 text-body">{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="min-h-11 min-w-11 rounded-lg p-2 text-text-secondary hover:bg-background"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3" aria-label="Notifications">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
