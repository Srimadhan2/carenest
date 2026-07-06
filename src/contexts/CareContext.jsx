import { createContext, useCallback, useContext, useMemo, useState } from 'react';

/** @type {React.Context<null | object>} */
const CareContext = createContext(null);

export function CareProvider({ children }) {
  const [careRecipient, setCareRecipient] = useState(null);
  const [caregiver, setCaregiver] = useState(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  const completeOnboarding = useCallback(() => {
    setIsOnboardingComplete(true);
  }, []);

  const resetCare = useCallback(() => {
    setCareRecipient(null);
    setCaregiver(null);
    setIsOnboardingComplete(false);
  }, []);

  const value = useMemo(
    () => ({
      careRecipient,
      caregiver,
      isOnboardingComplete,
      setCareRecipient,
      setCaregiver,
      completeOnboarding,
      resetCare,
    }),
    [careRecipient, caregiver, isOnboardingComplete, completeOnboarding, resetCare],
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
