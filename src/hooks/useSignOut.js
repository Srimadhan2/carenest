import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCareContext } from '@/contexts/CareContext';
import { ROUTES } from '@/utils/constants/routes';

/**
 * Single sign-out action shared by the onboarding header, the app avatar menu,
 * and the Profile page. Ends the Supabase session only (no data is deleted),
 * clears all client state, and returns the user to the login screen.
 */
export function useSignOut() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { signOut } = useAuthContext();
  const { resetCare } = useCareContext();

  return useCallback(async () => {
    await signOut(); // supabase.auth.signOut() + clears AuthContext user
    resetCare(); // clears CareContext (profile, recipient, caregiver, draft)
    queryClient.clear(); // clears React Query cache (notes, etc.)
    navigate(ROUTES.HOME);
  }, [signOut, resetCare, queryClient, navigate]);
}
