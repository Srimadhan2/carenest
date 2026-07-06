import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { careRecipientService } from '@/services/profiles/careRecipientService';
import { caregiverService } from '@/services/profiles/caregiverService';

/** @type {React.Context<null | object>} */
const CareContext = createContext(null);

export function CareProvider({ children }) {
  const { user } = useAuthContext();
  const userId = user?.id ?? null;

  const [careRecipient, setCareRecipient] = useState(null);
  const [caregiver, setCaregiver] = useState(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  // Which account the state above belongs to; anything else is treated as empty.
  const [hydratedFor, setHydratedFor] = useState(null);

  // Hydrate per account: on login (or account switch) load that user's saved
  // profiles, so returning users skip onboarding and see their own data only.
  useEffect(() => {
    if (!userId) {
      return;
    }

    let cancelled = false;

    Promise.all([
      careRecipientService.getActiveCareRecipient(),
      caregiverService.getActiveCaregiver(),
    ]).then(([recipientResult, caregiverResult]) => {
      if (cancelled) {
        return;
      }
      const recipient = recipientResult.data ?? null;
      const giver = caregiverResult.data ?? null;
      setCareRecipient(recipient);
      setCaregiver(giver);
      setIsOnboardingComplete(Boolean(recipient && giver));
      setHydratedFor(userId);
    });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const completeOnboarding = useCallback(() => {
    setIsOnboardingComplete(true);
  }, []);

  const resetCare = useCallback(() => {
    setCareRecipient(null);
    setCaregiver(null);
    setIsOnboardingComplete(false);
    setHydratedFor(null);
  }, []);

  // State is only valid for the account it was loaded for; signed-out users
  // and freshly switched accounts see nothing until hydration completes.
  const isCurrent = Boolean(userId) && hydratedFor === userId;
  const isLoading = Boolean(userId) && !isCurrent;

  const value = useMemo(
    () => ({
      careRecipient: isCurrent ? careRecipient : null,
      caregiver: isCurrent ? caregiver : null,
      isOnboardingComplete: isCurrent ? isOnboardingComplete : false,
      isLoading,
      setCareRecipient,
      setCaregiver,
      completeOnboarding,
      resetCare,
    }),
    [
      isCurrent,
      isLoading,
      careRecipient,
      caregiver,
      isOnboardingComplete,
      completeOnboarding,
      resetCare,
    ],
  );

  return <CareContext.Provider value={value}>{children}</CareContext.Provider>;
}

export function useCareContext() {
  const context = useContext(CareContext);
  if (!context) {
    throw new Error('useCareContext must be used within CareProvider');
  }
  return context;
}
