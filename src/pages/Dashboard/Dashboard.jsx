import { useCare } from '@/hooks/useCare';
import { useNotes } from '@/hooks/useNotes';
import { GreetingHeader } from './components/GreetingHeader';
import { CareRecipientSummaryCard } from './components/CareRecipientSummaryCard';
import { QuickNoteCard } from './components/QuickNoteCard';
import { RecentActivityCard } from './components/RecentActivityCard';

export default function Dashboard() {
  const { careRecipient, caregiver } = useCare();
  const { notes } = useNotes(careRecipient?.id, { limit: 3 });

  return (
    <div className="flex flex-col gap-6">
      <GreetingHeader name={caregiver?.firstName} />
      <CareRecipientSummaryCard careRecipient={careRecipient} />
      <QuickNoteCard />
      <RecentActivityCard notes={notes} />
    </div>
  );
}
