import { useNavigate } from 'react-router-dom';
import { Card, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { STRINGS } from '@/utils/constants/strings';
import { ROUTES } from '@/utils/constants/routes';

export function QuickNoteCard() {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <CardTitle>{STRINGS.dashboard.quickNote}</CardTitle>
        <p className="mt-1 text-body text-text-secondary">{STRINGS.dashboard.quickNoteDesc}</p>
      </div>
      <Button className="w-full sm:w-auto sm:self-start" onClick={() => navigate(ROUTES.NOTES)}>
        {STRINGS.notes.newNote}
      </Button>
    </Card>
  );
}
