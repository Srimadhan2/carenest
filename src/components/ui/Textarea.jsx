import { forwardRef } from 'react';
import { cn } from '@/utils/helpers/cn';

export const Textarea = forwardRef(function Textarea(
  { label, error, helperText, className, id, rows = 4, ...props },
  ref,
) {
  const inputId = id || props.name;

  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="text-label font-medium text-text">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        className={cn(
          'w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-body text-text',
          'placeholder:text-text-secondary',
          'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
          error && 'border-danger focus:border-danger focus:ring-danger/20',
          className,
        )}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-caption text-danger" role="alert">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${inputId}-helper`} className="text-caption text-text-secondary">
          {helperText}
        </p>
      )}
    </div>
  );
});
