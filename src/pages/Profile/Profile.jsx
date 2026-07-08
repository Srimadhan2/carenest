import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Pencil, Shield } from 'lucide-react';
import { Navbar } from '@/components/navigation/Navbar';
import { ListGroup, ListRow } from '@/components/ui/ListRow';
import { useCare } from '@/hooks/useCare';
import { useSignOut } from '@/hooks/useSignOut';
import { useAuthContext } from '@/contexts/AuthContext';
import { profileService } from '@/services/profile/profileService';
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
  const signOut = useSignOut();
  const { careRecipient, caregiver } = useCare();
  const { user } = useAuthContext();
  const [profile, setProfile] = useState(null);
  const p = STRINGS.profile;

  useEffect(() => {
    let cancelled = false;
    profileService.getProfile().then((result) => {
      if (!cancelled && result.data) {
        setProfile(result.data);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const accountName = fullName(profile) || user?.displayName || p.notSet;
  const accountEmail = profile?.email || user?.email || p.notSet;
  const recipientAge = careRecipient ? calculateAge(careRecipient.dateOfBirth) : null;
  const caregiverAge = caregiver ? calculateAge(caregiver.dateOfBirth) : null;

  return (
    <div className="flex flex-col gap-6">
      <Navbar title={p.title} subtitle={p.intro} />

      <ListGroup title={p.accountSection}>
        <ListRow label={p.name} value={accountName} />
        <ListRow label={p.email} value={accountEmail} />
        <ListRow
          icon={Pencil}
          label={p.editProfile}
          onClick={() => navigate(ROUTES.PROFILE_EDIT)}
        />
      </ListGroup>

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
        <ListRow icon={LogOut} label={p.signOut} destructive onClick={signOut} />
      </ListGroup>
    </div>
  );
}
