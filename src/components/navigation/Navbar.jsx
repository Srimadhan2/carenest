import { cn } from '@/utils/helpers/cn';

export function Navbar({ title, action, className }) {
  return (
    <header
      className={cn(
        'flex min-h-16 items-center justify-between border-b border-border bg-surface px-6',
        className,
      )}
    >
      <h1 className="text-title font-semibold text-text">{title}</h1>
      {action && <div>{action}</div>}
    </header>
  );
}
