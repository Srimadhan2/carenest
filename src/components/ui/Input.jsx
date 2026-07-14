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
            'min-h-11 w-full rounded-xl border border-border bg-surface text-body text-text',
            'placeholder:text-text-secondary',
            'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
            error && 'border-danger focus:border-danger focus:ring-danger/20',
            isPassword ? 'py-2 pl-4 pr-20' : 'px-4',
            className,
          )}
          {...props}
          type={inputType}
        />
        {isPassword && (
          <button
            type="button"
            onMouseDown={(event) => {
              // Keep focus in the field while toggling visibility.
              event.preventDefault();
            }}
            onClick={() => setPasswordVisible((prev) => !prev)}
            aria-label={passwordVisible ? STRINGS.auth.hidePassword : STRINGS.auth.showPassword}
            aria-pressed={passwordVisible}
            className={cn(
              'absolute inset-y-0 right-0 z-20 m-1 flex items-center gap-1.5 rounded-lg px-2.5',
              'bg-surface text-label font-medium text-primary',
              'hover:bg-primary/10',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
            )}
          >
            {passwordVisible ? (
              <EyeOff className="h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            <span>{passwordVisible ? STRINGS.auth.hide : STRINGS.auth.show}</span>
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
