import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCareContext } from '@/contexts/CareContext';
import { ROUTES, ROUTE_GROUPS } from '@/utils/constants/routes';
import { isOnboardingComplete as checkComplete } from '@/utils/helpers/onboarding';
import { PageLoader } from '@/components/ui/Loader';

export function OnboardingGuard({ children }) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthContext();
  const {
    careRecipient,
    caregiver,
    isOnboardingComplete,
    isLoading: isCareLoading,
  } = useCareContext();
  const location = useLocation();

  // Wait for the session restore so returning users don't flash the login page.
  if (isAuthLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return children;
  }

  // Wait for this account's profiles to load before deciding the route,
  // so first-login vs returning-login is based on real data.
  if (isCareLoading) {
    return <PageLoader />;
  }

  const complete = checkComplete(isOnboardingComplete, careRecipient, caregiver);
  const isOnboardingRoute = ROUTE_GROUPS.ONBOARDING.includes(location.pathname);
  const isAppRoute = ROUTE_GROUPS.APP.includes(location.pathname);

  // Signed-in users never see the login page: first login starts onboarding,
  // returning login goes straight to the dashboard.
  if (location.pathname === ROUTES.HOME) {
    return <Navigate to={complete ? ROUTES.DASHBOARD : ROUTES.WELCOME} replace />;
  }

  if (!complete && isAppRoute) {
    return <Navigate to={ROUTES.WELCOME} replace />;
  }

  if (complete && isOnboardingRoute) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
}
