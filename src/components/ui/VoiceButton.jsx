import { Mic, Square, Trash2 } from 'lucide-react';
import { cn } from '@/utils/helpers/cn';
import { STRINGS } from '@/utils/constants/strings';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

function VoiceWaveform({ active }) {
  if (!active) {
    return null;
  }

  return (
    <div
      className="flex h-5 items-end gap-0.5"
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4].map((bar) => (
        <span
          key={bar}
          className="w-1 rounded-full bg-primary animate-pulse"
          style={{
            height: `${40 + (bar % 3) * 20}%`,
            animationDelay: `${bar * 120}ms`,
            animationDuration: '0.8s',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Voice input control using the browser Web Speech API.
 * Appends recognized speech into the parent textarea via onTranscriptChange.
 */
export function VoiceButton({
  className,
  disabled = false,
  /** When true, renders the disabled onboarding placeholder instead of controls. */
  placeholder = false,
  label,
  value = '',
  onTranscriptChange,
  onVoiceUsed,
  onError,
}) {
  const v = STRINGS.voice;

  const speech = useSpeechRecognition({
    onTranscriptChange: (text) => {
      onTranscriptChange?.(text);
      if (text.trim()) {
        onVoiceUsed?.();
      }
    },
    onError,
  });

  if (placeholder || !speech.isSupported) {
    return (
      <div className={cn('flex flex-col gap-1', className)}>
        <button
          type="button"
          disabled
          aria-label={label || STRINGS.careRecipient.voicePlaceholder}
          className={cn(
            'flex min-h-11 items-center gap-2 rounded-xl border border-dashed border-border px-4 py-3',
            'cursor-not-allowed text-text-secondary opacity-60',
          )}
        >
          <Mic className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span className="text-label">
            {label ||
              (speech.isSupported
                ? STRINGS.careRecipient.voicePlaceholder
                : v.unsupported)}
          </span>
        </button>
        {!speech.isSupported && !placeholder && (
          <p className="text-caption text-text-secondary">{v.unsupported}</p>
        )}
      </div>
    );
  }

  const handleStart = () => {
    speech.start(value);
  };

  const handleStop = () => {
    speech.stop();
  };

  const handleClear = () => {
    speech.clearVoiceSession();
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex flex-wrap items-center gap-2">
        {!speech.isListening ? (
          <button
            type="button"
            disabled={disabled}
            onClick={handleStart}
            aria-label={v.startRecording}
            className={cn(
              'inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2',
              'text-label font-medium text-text transition-colors',
              'hover:border-primary hover:text-primary',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            <Mic className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span>{v.startRecording}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStop}
            aria-label={v.stopRecording}
            aria-pressed="true"
            className={cn(
              'inline-flex min-h-11 items-center gap-2 rounded-xl border border-primary bg-primary/10 px-4 py-2',
              'text-label font-medium text-primary transition-colors',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
            )}
          >
            <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
              <Mic className="relative h-5 w-5" aria-hidden="true" />
            </span>
            <VoiceWaveform active />
            <span>{v.listening}</span>
            <Square className="h-4 w-4 shrink-0 fill-current" aria-hidden="true" />
            <span className="sr-only">{v.stopRecording}</span>
          </button>
        )}

        {(speech.hasVoiceContent || value.trim()) && !speech.isListening && (
          <button
            type="button"
            disabled={disabled}
            onClick={handleClear}
            aria-label={v.clearRecording}
            className={cn(
              'inline-flex min-h-11 items-center gap-2 rounded-xl px-3 py-2',
              'text-label font-medium text-text-secondary transition-colors hover:bg-background hover:text-text',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            <Trash2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{v.clearRecording}</span>
          </button>
        )}
      </div>
    </div>
  );
}
