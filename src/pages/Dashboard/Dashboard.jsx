import { useNavigate } from 'react-router-dom';
import { PenLine, Activity, User } from 'lucide-react';
import { Navbar } from '@/components/navigation/Navbar';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, EmptyState } from '@/components/ui';
import { useCare } from '@/hooks/useCare';
import { useNotes } from '@/hooks/useNotes';
import { useAuth } from '@/hooks/useAuth';
import { calculateAge } from '@/utils/helpers/formatAge';
import { getTimeOfDay } from '@/utils/helpers/formatAge';
import { formatDate } from '@/utils/helpers/formatAge';
import { ROUTES } from '@/utils/constants/routes';
import { STRINGS } from '@/utils/constants/strings';

function getGreeting() {
  const time = getTimeOfDay();
  if (time === 'morning') return STRINGS.dashboard.greeting;
  if (time === 'afternoon') return STRINGS.dashboard.greetingAfternoon;
  return STRINGS.dashboard.greetingEvening;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { careRecipient, caregiver } = useCare();
  const { notes, isLoading } = useNotes(careRecipient?.id, { limit: 3 });

  const displayName = caregiver?.firstName || user?.displayName || 'there';

  return (
    <>
      <Navbar title={STRINGS.dashboard.title} />
      <DashboardLayout>
        <Card className="sm:col-span-2">
          <CardHeader>
            <CardTitle>
              {getGreeting()}, {displayName}
            </CardTitle>
          </CardHeader>
          <CardContent>Welcome back to CareNest.</CardContent>
        </Card>

        {careRecipient && (
          <Card interactive onClick={() => navigate(ROUTES.CARE_RECIPIENT)}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" aria-hidden="true" />
                <CardTitle>{STRINGS.dashboard.careSummary}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-medium text-text">
                {careRecipient.firstName} {careRecipient.lastName}
              </p>
              {careRecipient.dateOfBirth && (
                <p className="mt-1">
                  Age {calculateAge(careRecipient.dateOfBirth)} · Born{' '}
                  {formatDate(careRecipient.dateOfBirth)}
                </p>
              )}
              {careRecipient.healthDescription && (
                <p className="mt-2 line-clamp-2">{careRecipient.healthDescription}</p>
              )}
            </CardContent>
          </Card>
        )}

        <Card interactive onClick={() => navigate(ROUTES.NOTES)}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <PenLine className="h-5 w-5 text-primary" aria-hidden="true" />
              <CardTitle>{STRINGS.dashboard.quickNote}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>{STRINGS.dashboard.quickNoteDesc}</CardContent>
        </Card>

        <Card className="sm:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-primary" aria-hidden="true" />
              <CardTitle>{STRINGS.dashboard.recentActivity}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading...</p>
            ) : notes.length === 0 ? (
              <EmptyState
                title={STRINGS.dashboard.emptyTitle}
                description={STRINGS.dashboard.emptyDesc}
                action={
                  <button
                    type="button"
                    className="text-primary font-medium"
                    onClick={() => navigate(ROUTES.NOTES)}
                  >
                    {STRINGS.notes.newNote}
                  </button>
                }
              />
            ) : (
              <ul className="flex flex-col gap-3">
                {notes.map((note) => (
                  <li key={note.id} className="rounded-xl border border-border p-4">
                    <p className="line-clamp-2 text-text">{note.content}</p>
                    <p className="mt-2 text-caption text-text-secondary">
                      {formatDate(note.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </DashboardLayout>
    </>
  );
}
