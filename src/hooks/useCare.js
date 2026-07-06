import { useCallback } from 'react';
import { useCareContext } from '@/contexts/CareContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { careRecipientService } from '@/services/profiles/careRecipientService';
import { caregiverService } from '@/services/profiles/caregiverService';

export function useCare() {
  const {
    careRecipient,
    caregiver,
    isOnboardingComplete,
    setCareRecipient,
    setCaregiver,
    completeOnboarding,
  } = useCareContext();
  const { user } = useAuthContext();

  const saveCareRecipient = useCallback(
    async (data) => {
      const result = careRecipient
        ? await careRecipientService.updateCareRecipient(careRecipient.id, data)
        : await careRecipientService.createCareRecipient(data);

      if (result.data) {
        setCareRecipient(result.data);
      }
      return result;
    },
    [careRecipient, setCareRecipient],
  );

  const saveCaregiver = useCallback(
    async (data) => {
      const payload = { ...data, userId: user?.id ?? 'mock-user' };
      const result = caregiver
        ? await caregiverService.updateCaregiver(caregiver.id, payload)
        : await caregiverService.createCaregiver(payload);

      if (result.data) {
        setCaregiver(result.data);
      }
      return result;
    },
    [caregiver, user, setCaregiver],
  );

  const finishOnboarding = useCallback(() => {
    completeOnboarding();
  }, [completeOnboarding]);

  return {
    careRecipient,
    caregiver,
    isOnboardingComplete,
    saveCareRecipient,
    saveCaregiver,
    finishOnboarding,
  };
}
