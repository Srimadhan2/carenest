import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { LogOut, Shield } from 'lucide-react';
import { Navbar } from '@/components/navigation/Navbar';
import { ListGroup, ListRow } from '@/components/ui/ListRow';
import { useCare } from '@/hooks/useCare';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCareContext } from '@/contexts/CareContext';
import { calculateAge } from '@/utils/helpers/formatAge';
import { STRINGS } from '@/utils/constants/strings';
import { ROUTES } from '@/utils/constants/routes';

const GENDER_LABELS = {
  male: STRINGS.gender.male,
  female: STRINGS.gender.female,
  other: STRINGS.gender.other,
  prefer_not_to_say: STRINGS.gender.preferNotToSay,
};

function fullName(person) {
  return person ? `${person.firstName} ${person.lastName}`.trim() : null;
}

export default function Profile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { careRecipient, caregiver } = useCare();
  const { signOut } = useAuthContext();
  const { resetCare } = useCareContext();
  const p = STRINGS.profile;

  // Clear all client state so the next account never sees this account's data.
  const handleSignOut = async () => {
    await signOut();
    resetCare();
    queryClient.clear();
    navigate(ROUTES.HOME);
  };

  const recipientAge = careRecipient ? calculateAge(careRecipient.dateOfBirth) : null;
  const caregiverAge = caregiver ? calculateAge(caregiver.dateOfBirth) : null;

  return (
    <div className="flex flex-col gap-6">
      <Navbar title={p.title} subtitle={p.intro} />

      <ListGroup title={p.careRecipientSection}>
        <ListRow label={p.name} value={fullName(careRecipient) ?? p.notSet} />
        <ListRow label={p.age} value={recipientAge != null ? String(recipientAge) : p.notSet} />
        <ListRow
          label={p.gender}
          value={careRecipient ? GENDER_LABELS[careRecipient.gender] : p.notSet}
        />
        <ListRow label={p.health} value={careRecipient?.healthDescription || p.notSet} />
      </ListGroup>

      <ListGroup title={p.caregiverSection}>
        <ListRow label={p.name} value={fullName(caregiver) ?? p.notSet} />
        <ListRow label={p.age} value={caregiverAge != null ? String(caregiverAge) : p.notSet} />
        <ListRow label={p.gender} value={caregiver ? GENDER_LABELS[caregiver.gender] : p.notSet} />
      </ListGroup>

      <ListGroup title={p.aboutSection}>
        <ListRow icon={Shield} label={p.privacy} value={p.privacyValue} />
        <ListRow label={p.version} value="1.0" />
      </ListGroup>

      <ListGroup>
        <ListRow icon={LogOut} label={p.signOut} destructive onClick={handleSignOut} />
      </ListGroup>
    </div>
  );
}
