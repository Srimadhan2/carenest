import { useCallback } from 'react';
import { useCareContext } from '@/contexts/CareContext';
import { onboardingService } from '@/services/onboarding/onboardingService';
import { ValidationError, err } from '@/services/errors';

export function useCare() {
  const {
    profile,
    careRecipient,
    caregiver,
    isOnboardingComplete,
    onboardingDraft,
    updateOnboardingDraft,
    clearOnboardingDraft,
    setCareRecipient,
    setCaregiver,
    completeOnboarding: markOnboardingComplete,
  } = useCareContext();

  // Onboarding step 1: keep the entered care recipient values in the draft only.
  // Nothing is written to the database until the final atomic commit.
  const saveCareRecipientDraft = useCallback(
    (data) => {
      updateOnboardingDraft({ recipient: data });
    },
    [updateOnboardingDraft],
  );

  // Onboarding step 2: keep caregiver values in the draft so a refresh restores them.
  const saveCaregiverDraft = useCallback(
    (data) => {
      updateOnboardingDraft({ caregiver: data });
    },
    [updateOnboardingDraft],
  );

  // Final step: commit profile + care recipient + caregiver atomically. On
  // success the context is populated and the draft cleared; on failure the
  // database is left unchanged.
  const completeOnboarding = useCallback(
    async (caregiverData) => {
      const recipientData = onboardingDraft?.recipient;
      if (!recipientData) {
        return err(new ValidationError('Please complete the care recipient step first.'));
      }
      const result = await onboardingService.completeOnboarding(recipientData, caregiverData);
      if (result.data) {
        setCareRecipient(result.data.careRecipient);
        setCaregiver(result.data.caregiver);
        markOnboardingComplete();
        clearOnboardingDraft();
      }
      return result;
    },
    [onboardingDraft, setCareRecipient, setCaregiver, markOnboardingComplete, clearOnboardingDraft],
  );

  return {
    profile,
    careRecipient,
    caregiver,
    isOnboardingComplete,
    onboardingDraft,
    saveCareRecipientDraft,
    saveCaregiverDraft,
    completeOnboarding,
  };
}
