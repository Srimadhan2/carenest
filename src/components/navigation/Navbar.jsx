import { cn } from '@/utils/helpers/cn';

/**
 * Per-screen header. Renders a large title, optional subtitle, and a single
 * primary action (kept to one, per the design system's one-action-per-screen rule).
 */
export function Navbar({ title, subtitle, action, className }) {
  return (
    <header className={cn('mb-6 flex items-start justify-between gap-4', className)}>
      <div className="min-w-0">
        <h1 className="text-title font-semibold text-text">{title}</h1>
        {subtitle && <p className="mt-1 text-body text-text-secondary">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
