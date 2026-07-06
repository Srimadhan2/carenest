import { STRINGS } from '@/utils/constants/strings';
import { cn } from '@/utils/helpers/cn';

export function Logo({ size = 'md', className }) {
  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={cn('flex items-center gap-2', className)} aria-label={STRINGS.app.name}>
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white"
        aria-hidden="true"
      >
        C
      </div>
      <span className={cn('font-semibold text-text', sizes[size])}>{STRINGS.app.name}</span>
    </div>
  );
}
