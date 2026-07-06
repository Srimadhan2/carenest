import { cn } from '@/utils/helpers/cn';

/**
 * iOS-style single-select segmented control.
 * @param {{
 *   options: { value: string, label: string }[],
 *   value: string,
 *   onChange: (value: string) => void,
 *   ariaLabel?: string,
 *   className?: string,
 * }} props
 */
export function SegmentedControl({ options, value, onChange, ariaLabel = 'Filter', className }) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn('inline-flex w-full rounded-xl bg-background p-1', className)}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              'min-h-11 flex-1 rounded-lg px-4 text-label font-medium transition-colors',
              'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary',
              selected ? 'bg-surface text-text shadow-sm' : 'text-text-secondary hover:text-text',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
