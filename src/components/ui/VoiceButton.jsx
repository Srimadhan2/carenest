import { Mic } from 'lucide-react';
import { cn } from '@/utils/helpers/cn';
import { STRINGS } from '@/utils/constants/strings';

export function VoiceButton({ className, disabled = true, label, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={label || STRINGS.careRecipient.voicePlaceholder}
      className={cn(
        'flex min-h-11 items-center gap-2 rounded-xl border border-dashed border-border px-4 py-3',
        'text-text-secondary transition-colors',
        !disabled && 'hover:border-primary hover:text-primary',
        disabled && 'cursor-not-allowed opacity-60',
        className,
      )}
    >
      <Mic className="h-5 w-5" aria-hidden="true" />
      <span className="text-label">{label || STRINGS.careRecipient.voicePlaceholder}</span>
    </button>
  );
}
