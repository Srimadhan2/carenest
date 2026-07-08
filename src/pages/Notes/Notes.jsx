import { useState } from 'react';
import { Navbar } from '@/components/navigation/Navbar';
import { Input } from '@/components/ui/Input';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { NoteComposer } from './components/NoteComposer';
import { NotesTimeline } from './components/NotesTimeline';
import { useCare } from '@/hooks/useCare';
import { useNotes } from '@/hooks/useNotes';
import { useAuth } from '@/hooks/useAuth';
import { STRINGS } from '@/utils/constants/strings';

const filters = [
  { value: 'all', label: STRINGS.notes.filterAll },
  { value: 'manual', label: STRINGS.notes.filterManual },
  { value: 'voice', label: STRINGS.notes.filterVoice },
];

export default function Notes() {
  const { careRecipient } = useCare();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const { notes, isLoading, createNote, isCreating } = useNotes(careRecipient?.id, {
    search,
    limit: 50,
  });

  const visible = filter === 'all' ? notes : notes.filter((note) => note.type === filter);

  const handleCreate = async (content, type = 'manual') => {
    if (!careRecipient || !user?.id) {
      return;
    }
    await createNote({
      careRecipientId: careRecipient.id,
      authorId: user.id,
      content,
      type,
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <Navbar title={STRINGS.notes.title} />
      <NoteComposer onSubmit={handleCreate} isSubmitting={isCreating} disabled={!careRecipient} />
      <Input
        name="search"
        type="search"
        placeholder={STRINGS.notes.search}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <SegmentedControl
        options={filters}
        value={filter}
        onChange={setFilter}
        ariaLabel="Filter notes"
      />
      <NotesTimeline notes={visible} isLoading={isLoading} />
    </div>
  );
}
