import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCareContext } from '@/contexts/CareContext';
import { ROUTES, ROUTE_GROUPS } from '@/utils/constants/routes';
import { isOnboardingComplete as checkComplete } from '@/utils/helpers/onboarding';

export function OnboardingGuard({ children }) {
  const { isAuthenticated } = useAuthContext();
  const { careRecipient, caregiver, isOnboardingComplete } = useCareContext();
  const location = useLocation();

  if (!isAuthenticated) {
    return children;
  }

  const complete = checkComplete(isOnboardingComplete, careRecipient, caregiver);
  const isOnboardingRoute = ROUTE_GROUPS.ONBOARDING.includes(location.pathname);
  const isAppRoute = ROUTE_GROUPS.APP.includes(location.pathname);

  if (!complete && isAppRoute) {
    return <Navigate to={ROUTES.WELCOME} replace />;
  }

  if (complete && isOnboardingRoute) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
}
