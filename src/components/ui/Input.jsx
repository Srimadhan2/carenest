import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/utils/helpers/cn';
import { STRINGS } from '@/utils/constants/strings';

export const Input = forwardRef(function Input(
  { label, error, helperText, className, id, type = 'text', ...props },
  ref,
) {
  const inputId = id || props.name;
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (passwordVisible ? 'text' : 'password') : type;

  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="text-label font-medium text-text">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          className={cn(
            'min-h-11 w-full rounded-xl border border-border bg-surface px-4 text-body text-text',
            'placeholder:text-text-secondary',
            'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
            error && 'border-danger focus:border-danger focus:ring-danger/20',
            isPassword && 'pr-11',
            className,
          )}
          {...props}
          type={inputType}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={0}
            onClick={() => setPasswordVisible((prev) => !prev)}
            aria-label={passwordVisible ? STRINGS.auth.hidePassword : STRINGS.auth.showPassword}
            aria-pressed={passwordVisible}
            className={cn(
              'absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg',
              'text-text-secondary transition-colors hover:bg-background hover:text-text',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
            )}
          >
            {passwordVisible ? (
              <EyeOff className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Eye className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
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
