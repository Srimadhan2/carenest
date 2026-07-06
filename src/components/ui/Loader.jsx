import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/helpers/cn';

export function Loader({ size = 'md', className, label = 'Loading' }) {
  const sizes = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div
      className={cn('flex items-center justify-center', className)}
      role="status"
      aria-label={label}
    >
      <Loader2 className={cn('animate-spin text-primary', sizes[size])} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Loader size="lg" />
    </div>
  );
}
