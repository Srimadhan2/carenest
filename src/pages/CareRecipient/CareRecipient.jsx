import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { VoiceButton } from '@/components/ui/VoiceButton';
import { FormField, GenderSelect } from '@/components/forms/FormField';
import HipaaNotice from './components/HipaaNotice';
import { useForm } from '@/hooks/useForm';
import { useCare } from '@/hooks/useCare';
import { validateCareRecipient } from '@/utils/validators/profileValidators';
import { STRINGS } from '@/utils/constants/strings';
import { ROUTES } from '@/utils/constants/routes';

const initialValues = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  healthDescription: '',
};

export default function CareRecipient() {
  const navigate = useNavigate();
  const { saveCareRecipient } = useCare();
  const { values, errors, handleChange, handleBlur, validateForm } = useForm(
    initialValues,
    validateCareRecipient,
  );
  const s = STRINGS.careRecipient;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    await saveCareRecipient(values);
    navigate(ROUTES.CAREGIVER);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div>
        <h1 className="text-title font-semibold text-text">{s.title}</h1>
        <p className="mt-2 text-body text-text-secondary">{s.subtitle}</p>
      </div>

      <FormField>
        <Input
          name="firstName"
          label={s.firstName}
          placeholder="Mary"
          value={values.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
          onBlur={() => handleBlur('firstName')}
          error={errors.firstName}
        />
        <Input
          name="lastName"
          label={s.lastName}
          placeholder="Johnson"
          value={values.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
          onBlur={() => handleBlur('lastName')}
          error={errors.lastName}
        />
        <Input
          type="date"
          name="dateOfBirth"
          label={s.dateOfBirth}
          value={values.dateOfBirth}
          onChange={(e) => handleChange('dateOfBirth', e.target.value)}
          onBlur={() => handleBlur('dateOfBirth')}
          error={errors.dateOfBirth}
        />
        <GenderSelect
          label={s.gender}
          value={values.gender}
          onChange={(value) => handleChange('gender', value)}
          error={errors.gender}
        />
        <Textarea
          name="healthDescription"
          label={s.healthDescription}
          placeholder={s.healthPlaceholder}
          value={values.healthDescription}
          onChange={(e) => handleChange('healthDescription', e.target.value)}
        />
        <VoiceButton />
      </FormField>

      <HipaaNotice />

      <Button type="submit" size="lg" className="w-full">
        {STRINGS.onboarding.continue}
      </Button>
    </form>
  );
}
