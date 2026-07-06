import { ChevronRight } from 'lucide-react';
import { cn } from '@/utils/helpers/cn';

/**
 * Apple Settings-style row. Renders as a button when `onClick` is provided,
 * otherwise a static row (label + value).
 */
export function ListRow({
  icon: Icon,
  label,
  value,
  onClick,
  destructive = false,
  trailing,
  className,
}) {
  const interactive = Boolean(onClick);
  const Comp = interactive ? 'button' : 'div';

  return (
    <Comp
      type={interactive ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'flex min-h-[52px] w-full items-center gap-3 px-4 py-3 text-left',
        interactive &&
          'transition-colors hover:bg-background focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary',
        className,
      )}
    >
      {Icon && (
        <Icon
          className={cn('h-5 w-5 shrink-0', destructive ? 'text-danger' : 'text-text-secondary')}
          aria-hidden="true"
        />
      )}
      <span className={cn('text-body', destructive ? 'font-medium text-danger' : 'text-text')}>
        {label}
      </span>
      <span className="ml-auto flex items-center gap-2 text-body text-text-secondary">
        {value != null && value !== '' && <span className="max-w-[45vw] truncate">{value}</span>}
        {trailing}
        {interactive && !destructive && (
          <ChevronRight className="h-4 w-4 shrink-0 text-border" aria-hidden="true" />
        )}
      </span>
    </Comp>
  );
}

/** Grouped card container for a set of rows (Apple Settings grouping). */
export function ListGroup({ title, children, className }) {
  return (
    <section className={cn('flex flex-col gap-2', className)}>
      {title && <h2 className="px-1 text-label font-medium text-text-secondary">{title}</h2>}
      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
        {children}
      </div>
    </section>
  );
}
