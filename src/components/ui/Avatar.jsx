import { cn } from '@/utils/helpers/cn';

export function Avatar({ src, name, size = 'md', className }) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-11 w-11 text-sm',
    lg: 'h-14 w-14 text-base',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name ? `${name} avatar` : 'Avatar'}
        className={cn('rounded-full object-cover', sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-primary/10 font-semibold text-primary',
        sizes[size],
        className,
      )}
      aria-label={name ? `${name} avatar` : 'Avatar'}
      role="img"
    >
      {initials}
    </div>
  );
}
