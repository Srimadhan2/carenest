import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField, GenderSelect } from '@/components/forms/FormField';
import { useForm } from '@/hooks/useForm';
import { useCare } from '@/hooks/useCare';
import { useUIContext } from '@/contexts/UIContext';
import { validateCaregiver } from '@/utils/validators/profileValidators';
import { STRINGS } from '@/utils/constants/strings';
import { ROUTES } from '@/utils/constants/routes';

const defaultValues = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
};

export default function Caregiver() {
  const navigate = useNavigate();
  const { onboardingDraft, saveCaregiverDraft, completeOnboarding } = useCare();
  const { showToast } = useUIContext();
  // Prefill from the draft so an accidental refresh restores entered values.
  const { values, errors, handleChange, handleBlur, validateForm } = useForm(
    { ...defaultValues, ...(onboardingDraft?.caregiver ?? {}) },
    validateCaregiver,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const s = STRINGS.caregiver;

  // If the care recipient step was never completed (e.g. deep link), go back.
  useEffect(() => {
    if (!onboardingDraft?.recipient) {
      navigate(ROUTES.CARE_RECIPIENT, { replace: true });
    }
  }, [onboardingDraft, navigate]);

  // Keep the draft in sync as the user types (persisted to sessionStorage).
  useEffect(() => {
    saveCaregiverDraft(values);
  }, [values, saveCaregiverDraft]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting || !validateForm()) {
      return;
    }
    setIsSubmitting(true);
    // Commits profile + care recipient + caregiver atomically via the RPC.
    const result = await completeOnboarding(values);
    if (result?.error) {
      showToast(result.error.message || STRINGS.errors.generic, 'error');
      setIsSubmitting(false);
      return;
    }
    showToast(s.encouragement, 'success');
    navigate(ROUTES.DASHBOARD);
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
          placeholder="Sarah"
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
      </FormField>

      <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
        {STRINGS.onboarding.complete}
      </Button>
    </form>
  );
}
