import { useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { VoiceButton } from '@/components/ui/VoiceButton';
import { useUIContext } from '@/contexts/UIContext';
import { STRINGS } from '@/utils/constants/strings';

/**
 * @param {{ onSubmit: (content: string, type: 'manual' | 'voice') => Promise<void>, isSubmitting?: boolean, disabled?: boolean }} props
 */
export function NoteComposer({ onSubmit, isSubmitting = false, disabled = false }) {
  const { showToast } = useUIContext();
  const [content, setContent] = useState('');
  const noteTypeRef = useRef('manual');
  const trimmed = content.trim();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!trimmed || disabled || isSubmitting) {
      return;
    }
    await onSubmit(trimmed, noteTypeRef.current);
    setContent('');
    noteTypeRef.current = 'manual';
  };

  const handleVoiceUsed = () => {
    noteTypeRef.current = 'voice';
  };

  const handleManualChange = (value) => {
    setContent(value);
    if (!value.trim()) {
      noteTypeRef.current = 'manual';
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm"
    >
      <Textarea
        name="note"
        rows={3}
        value={content}
        onChange={(e) => handleManualChange(e.target.value)}
        placeholder={`${STRINGS.notes.newNote}…`}
        aria-label={STRINGS.notes.newNote}
        disabled={disabled}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <VoiceButton
          disabled={disabled}
          value={content}
          onTranscriptChange={setContent}
          onVoiceUsed={handleVoiceUsed}
          onError={(message) => showToast(message, 'error')}
        />
        <Button
          type="submit"
          className="sm:shrink-0"
          isDisabled={!trimmed || disabled}
          isLoading={isSubmitting}
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          {STRINGS.notes.save}
        </Button>
      </div>
    </form>
  );
}
