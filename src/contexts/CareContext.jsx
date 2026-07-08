import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { careRecipientService } from '@/services/profiles/careRecipientService';
import { caregiverService } from '@/services/profiles/caregiverService';
import { profileService } from '@/services/profile/profileService';

/** @type {React.Context<null | object>} */
const CareContext = createContext(null);

// Transient onboarding draft (entered form values only, never a source of truth).
// Persisted so an accidental refresh mid-onboarding does not lose progress; no
// database records are created until the final atomic commit.
const DRAFT_KEY = 'carenest:onboarding:draft';

function readDraft() {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeDraft(draft) {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    /* ignore quota/availability errors: the draft is best-effort */
  }
}

function removeDraft() {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
}

export function CareProvider({ children }) {
  const { user } = useAuthContext();
  const userId = user?.id ?? null;

  const [profile, setProfile] = useState(null);
  const [careRecipient, setCareRecipient] = useState(null);
  const [caregiver, setCaregiver] = useState(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [onboardingDraft, setOnboardingDraft] = useState(() => readDraft());
  // Which account the state above belongs to; anything else is treated as empty.
  const [hydratedFor, setHydratedFor] = useState(null);

  // Hydrate per account from Supabase on login (or account switch): load this
  // user's profile, care recipient, and caregiver so returning users skip
  // onboarding and only ever see their own data. Notes hydrate separately via
  // React Query, keyed by the care recipient id.
  useEffect(() => {
    if (!userId) {
      return;
    }

    let cancelled = false;

    Promise.all([
      profileService.getProfile(),
      careRecipientService.getActiveCareRecipient(),
      caregiverService.getActiveCaregiver(),
    ]).then(([profileResult, recipientResult, caregiverResult]) => {
      if (cancelled) {
        return;
      }
      const recipient = recipientResult.data ?? null;
      const giver = caregiverResult.data ?? null;
      setProfile(profileResult.data ?? null);
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

  const updateOnboardingDraft = useCallback((partial) => {
    setOnboardingDraft((prev) => {
      const next = { ...(prev ?? {}), ...partial };
      writeDraft(next);
      return next;
    });
  }, []);

  const clearOnboardingDraft = useCallback(() => {
    removeDraft();
    setOnboardingDraft(null);
  }, []);

  const resetCare = useCallback(() => {
    setProfile(null);
    setCareRecipient(null);
    setCaregiver(null);
    setIsOnboardingComplete(false);
    setHydratedFor(null);
    removeDraft();
    setOnboardingDraft(null);
  }, []);

  // State is only valid for the account it was loaded for; signed-out users
  // and freshly switched accounts see nothing until hydration completes.
  const isCurrent = Boolean(userId) && hydratedFor === userId;
  const isLoading = Boolean(userId) && !isCurrent;

  const value = useMemo(
    () => ({
      profile: isCurrent ? profile : null,
      careRecipient: isCurrent ? careRecipient : null,
      caregiver: isCurrent ? caregiver : null,
      isOnboardingComplete: isCurrent ? isOnboardingComplete : false,
      isLoading,
      onboardingDraft,
      updateOnboardingDraft,
      clearOnboardingDraft,
      setProfile,
      setCareRecipient,
      setCaregiver,
      completeOnboarding,
      resetCare,
    }),
    [
      isCurrent,
      isLoading,
      profile,
      careRecipient,
      caregiver,
      isOnboardingComplete,
      onboardingDraft,
      updateOnboardingDraft,
      clearOnboardingDraft,
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
