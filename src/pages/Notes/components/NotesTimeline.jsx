import { FileText } from 'lucide-react';
import { PageLoader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { STRINGS } from '@/utils/constants/strings';
import { NoteBubble } from './NoteBubble';
import { DateDivider } from './DateDivider';

function dayLabel(iso) {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const sameDay = (a, b) => a.toDateString() === b.toDateString();

  if (sameDay(date, today)) {
    return 'Today';
  }
  if (sameDay(date, yesterday)) {
    return 'Yesterday';
  }
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function NotesTimeline({ notes, isLoading }) {
  if (isLoading) {
    return <PageLoader />;
  }

  if (!notes.length) {
    return (
      <EmptyState
        icon={FileText}
        title={STRINGS.notes.emptyTitle}
        description={STRINGS.notes.emptyDesc}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {notes.map((note, index) => {
        const label = dayLabel(note.createdAt);
        const previousLabel = index > 0 ? dayLabel(notes[index - 1].createdAt) : null;
        const showDivider = label !== previousLabel;

        return (
          <div key={note.id} className="flex flex-col gap-3">
            {showDivider && <DateDivider label={label} />}
            <NoteBubble note={note} />
          </div>
        );
      })}
    </div>
  );
}
