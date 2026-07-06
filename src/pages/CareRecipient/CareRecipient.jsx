import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Textarea, Button, VoiceButton } from '@/components/ui';
import { FormField, GenderSelect } from '@/components/forms/FormField';
import { useForm } from '@/hooks/useForm';
import { useCare } from '@/hooks/useCare';
import { validateCareRecipient } from '@/utils/validators/profileValidators';
import { ROUTES } from '@/utils/constants/routes';
import { STRINGS } from '@/utils/constants/strings';
import HipaaNotice from './components/HipaaNotice';

export default function CareRecipient() {
  const navigate = useNavigate();
  const { saveCareRecipient } = useCare();
  const [isSaving, setIsSaving] = useState(false);

  const { values, errors, handleChange, validateForm } = useForm(
    {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      healthDescription: '',
    },
    validateCareRecipient,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    const result = await saveCareRecipient(values);
    setIsSaving(false);

    if (!result.error) {
      navigate(ROUTES.CAREGIVER);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="mb-2 text-title font-semibold text-text">{STRINGS.careRecipient.title}</h1>
      <p className="mb-8 text-body text-text-secondary">{STRINGS.careRecipient.subtitle}</p>

      <FormField>
        <Input
          label={STRINGS.careRecipient.firstName}
          name="firstName"
          value={values.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
          error={errors.firstName}
          autoComplete="given-name"
        />
        <Input
          label={STRINGS.careRecipient.lastName}
          name="lastName"
          value={values.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
          error={errors.lastName}
          autoComplete="family-name"
        />
        <Input
          label={STRINGS.careRecipient.dateOfBirth}
          name="dateOfBirth"
          type="date"
          value={values.dateOfBirth}
          onChange={(e) => handleChange('dateOfBirth', e.target.value)}
          error={errors.dateOfBirth}
        />
        <GenderSelect
          label={STRINGS.careRecipient.gender}
          value={values.gender}
          onChange={(v) => handleChange('gender', v)}
          error={errors.gender}
        />
        <Textarea
          label={STRINGS.careRecipient.healthDescription}
          name="healthDescription"
          value={values.healthDescription}
          onChange={(e) => handleChange('healthDescription', e.target.value)}
          placeholder={STRINGS.careRecipient.healthPlaceholder}
        />
        <VoiceButton />
        <HipaaNotice />
      </FormField>

      <Button type="submit" size="lg" className="mt-8 w-full" isLoading={isSaving}>
        {STRINGS.onboarding.continue}
      </Button>
    </form>
  );
}
