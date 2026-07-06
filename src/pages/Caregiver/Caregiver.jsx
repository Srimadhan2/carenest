import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button } from '@/components/ui';
import { FormField, GenderSelect } from '@/components/forms/FormField';
import { useForm } from '@/hooks/useForm';
import { useCare } from '@/hooks/useCare';
import { validateCaregiver } from '@/utils/validators/profileValidators';
import { ROUTES } from '@/utils/constants/routes';
import { STRINGS } from '@/utils/constants/strings';

export default function Caregiver() {
  const navigate = useNavigate();
  const { saveCaregiver, finishOnboarding } = useCare();
  const [isSaving, setIsSaving] = useState(false);

  const { values, errors, handleChange, validateForm } = useForm(
    {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
    },
    validateCaregiver,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    const result = await saveCaregiver(values);
    setIsSaving(false);

    if (!result.error) {
      finishOnboarding();
      navigate(ROUTES.DASHBOARD);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="mb-2 text-title font-semibold text-text">{STRINGS.caregiver.title}</h1>
      <p className="mb-8 text-body text-text-secondary">{STRINGS.caregiver.subtitle}</p>

      <FormField>
        <Input
          label={STRINGS.caregiver.firstName}
          name="firstName"
          value={values.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
          error={errors.firstName}
          autoComplete="given-name"
        />
        <Input
          label={STRINGS.caregiver.lastName}
          name="lastName"
          value={values.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
          error={errors.lastName}
          autoComplete="family-name"
        />
        <Input
          label={STRINGS.caregiver.dateOfBirth}
          name="dateOfBirth"
          type="date"
          value={values.dateOfBirth}
          onChange={(e) => handleChange('dateOfBirth', e.target.value)}
          error={errors.dateOfBirth}
        />
        <GenderSelect
          label={STRINGS.caregiver.gender}
          value={values.gender}
          onChange={(v) => handleChange('gender', v)}
          error={errors.gender}
        />
      </FormField>

      <p className="mt-6 rounded-xl bg-primary/5 p-4 text-body text-text">
        {STRINGS.caregiver.encouragement}
      </p>

      <Button type="submit" size="lg" className="mt-8 w-full" isLoading={isSaving}>
        {STRINGS.onboarding.complete}
      </Button>
    </form>
  );
}
