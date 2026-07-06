import { Card, CardTitle } from '@/components/ui/Card';
import { formatDate } from '@/utils/helpers/formatAge';
import { STRINGS } from '@/utils/constants/strings';

export function RecentActivityCard({ notes }) {
  return (
    <Card className="flex flex-col gap-4">
      <CardTitle>{STRINGS.dashboard.recentActivity}</CardTitle>
      {notes.length === 0 ? (
        <p className="text-body text-text-secondary">{STRINGS.dashboard.emptyDesc}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {notes.map((note) => (
            <li key={note.id} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
              <p className="line-clamp-2 text-body text-text">{note.content}</p>
              <p className="text-caption text-text-secondary">{formatDate(note.createdAt)}</p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
