import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { calculateAge } from '@/utils/helpers/formatAge';
import { STRINGS } from '@/utils/constants/strings';

export function CareRecipientSummaryCard({ careRecipient }) {
  if (!careRecipient) {
    return null;
  }

  const name = `${careRecipient.firstName} ${careRecipient.lastName}`.trim();
  const age = calculateAge(careRecipient.dateOfBirth);
  const health = careRecipient.healthDescription || STRINGS.profile.notSet;

  return (
    <Card className="flex items-center gap-4">
      <Avatar name={name} size="lg" />
      <div className="min-w-0">
        <p className="text-heading font-semibold text-text">{name}</p>
        <p className="truncate text-body text-text-secondary">
          {age != null ? `${age} · ` : ''}
          {health}
        </p>
      </div>
    </Card>
  );
}
