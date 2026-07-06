import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/helpers/cn';

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-hover',
  secondary: 'bg-surface text-text border border-border hover:bg-background',
  ghost: 'bg-transparent text-primary hover:bg-background',
  destructive: 'bg-danger text-white hover:opacity-90',
};

const sizes = {
  sm: 'min-h-10 px-4 text-sm',
  md: 'min-h-11 px-6 text-base',
  lg: 'min-h-[52px] px-8 text-lg',
};

export const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    isDisabled = false,
    className,
    type = 'button',
    ...props
  },
  ref,
) {
  const disabled = isDisabled || isLoading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-busy={isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-200',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {isLoading && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
});
