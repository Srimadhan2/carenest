import { useState } from 'react';
import { Search, Plus, Mic } from 'lucide-react';
import { Navbar } from '@/components/navigation/Navbar';
import { Button, EmptyState, Modal, Textarea, VoiceButton, Loader } from '@/components/ui';
import { useCare } from '@/hooks/useCare';
import { useAuth } from '@/hooks/useAuth';
import { useNotes } from '@/hooks/useNotes';
import { formatDate } from '@/utils/helpers/formatAge';
import { STRINGS } from '@/utils/constants/strings';

export default function Notes() {
  const { careRecipient } = useCare();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  const typeFilter = filter === 'all' ? undefined : filter === 'manual' ? 'manual' : 'voice';

  const { notes, isLoading, createNote, isCreating } = useNotes(careRecipient?.id, {
    search,
    limit: 50,
  });

  const filteredNotes = filter === 'all' ? notes : notes.filter((n) => n.type === typeFilter);

  const handleCreate = async () => {
    if (!noteContent.trim() || !careRecipient || !user) {
      return;
    }

    await createNote({
      careRecipientId: careRecipient.id,
      authorId: user.id,
      content: noteContent.trim(),
      type: 'manual',
    });

    setNoteContent('');
    setIsEditorOpen(false);
  };

  return (
    <>
      <Navbar
        title={STRINGS.notes.title}
        action={
          <Button size="sm" onClick={() => setIsEditorOpen(true)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            {STRINGS.notes.newNote}
          </Button>
        }
      />

      <div className="flex-1 p-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary"
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder={STRINGS.notes.search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="min-h-11 w-full rounded-xl border border-border bg-surface py-2 pl-12 pr-4 text-body"
                aria-label={STRINGS.notes.search}
              />
            </div>
            <div className="flex gap-2" role="group" aria-label="Filter notes">
              {['all', 'manual', 'voice'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`min-h-11 rounded-xl px-4 text-label font-medium transition-colors ${
                    filter === f
                      ? 'bg-primary text-white'
                      : 'border border-border bg-surface text-text-secondary'
                  }`}
                >
                  {f === 'all'
                    ? STRINGS.notes.filterAll
                    : f === 'manual'
                      ? STRINGS.notes.filterManual
                      : STRINGS.notes.filterVoice}
                </button>
              ))}
            </div>
          </div>

          <VoiceButton
            label={STRINGS.notes.voiceComingSoon}
            className="mb-6 w-full justify-center"
          />

          {isLoading ? (
            <Loader className="py-12" />
          ) : filteredNotes.length === 0 ? (
            <EmptyState
              icon={Mic}
              title={STRINGS.notes.emptyTitle}
              description={STRINGS.notes.emptyDesc}
              action={
                <Button onClick={() => setIsEditorOpen(true)}>{STRINGS.notes.newNote}</Button>
              }
            />
          ) : (
            <ul className="flex flex-col gap-4" aria-label="Notes timeline">
              {filteredNotes.map((note) => (
                <li
                  key={note.id}
                  className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
                >
                  <p className="whitespace-pre-wrap text-body text-text">{note.content}</p>
                  <div className="mt-4 flex items-center justify-between text-caption text-text-secondary">
                    <span className="capitalize">{note.type}</span>
                    <time dateTime={note.createdAt}>{formatDate(note.createdAt)}</time>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        title={STRINGS.notes.newNote}
      >
        <Textarea
          label="Note"
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          rows={6}
          placeholder="Write about today's care..."
        />
        <div className="mt-6 flex gap-3">
          <Button variant="ghost" onClick={() => setIsEditorOpen(false)}>
            {STRINGS.notes.cancel}
          </Button>
          <Button onClick={handleCreate} isLoading={isCreating} isDisabled={!noteContent.trim()}>
            {STRINGS.notes.save}
          </Button>
        </div>
      </Modal>
    </>
  );
}
