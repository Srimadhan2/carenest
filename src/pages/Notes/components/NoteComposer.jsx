import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { VoiceButton } from '@/components/ui/VoiceButton';
import { STRINGS } from '@/utils/constants/strings';

export function NoteComposer({ onSubmit, isSubmitting = false, disabled = false }) {
  const [content, setContent] = useState('');
  const trimmed = content.trim();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!trimmed || disabled || isSubmitting) {
      return;
    }
    await onSubmit(trimmed);
    setContent('');
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
        onChange={(e) => setContent(e.target.value)}
        placeholder={`${STRINGS.notes.newNote}…`}
        aria-label={STRINGS.notes.newNote}
        disabled={disabled}
      />
      <div className="flex items-center justify-between">
        <VoiceButton />
        <Button type="submit" isDisabled={!trimmed || disabled} isLoading={isSubmitting}>
          <Send className="h-4 w-4" aria-hidden="true" />
          {STRINGS.notes.save}
        </Button>
      </div>
    </form>
  );
}
