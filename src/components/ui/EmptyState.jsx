import { cn } from '@/utils/helpers/cn';

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-8 py-12 text-center',
        className,
      )}
    >
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
        </div>
      )}
      <h3 className="mb-2 text-heading font-semibold text-text">{title}</h3>
      <p className="mb-6 max-w-sm text-body text-text-secondary">{description}</p>
      {action}
    </div>
  );
}
