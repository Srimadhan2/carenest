import { Input } from '@/components/ui/Input';
import { cn } from '@/utils/helpers/cn';

export function FormField({ children, className }) {
  return <div className={cn('flex flex-col gap-6', className)}>{children}</div>;
}

export function GenderSelect({ label, value, onChange, error, name = 'gender' }) {
  const options = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' },
  ];

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-label font-medium text-text">{label}</legend>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              'flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border px-4 transition-colors',
              value === option.value
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border bg-surface text-text hover:bg-background',
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
      {error && (
        <p className="text-caption text-danger" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export { Input as FormInput };
