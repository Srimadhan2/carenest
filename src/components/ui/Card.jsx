import { cn } from '@/utils/helpers/cn';

export function Card({ children, className, interactive = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-surface p-6 shadow-sm',
        interactive && 'cursor-pointer transition-shadow duration-200 hover:shadow-md',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

export function CardTitle({ children, className }) {
  return <h3 className={cn('text-heading font-semibold text-text', className)}>{children}</h3>;
}

export function CardContent({ children, className }) {
  return <div className={cn('text-body text-text-secondary', className)}>{children}</div>;
}
