import { ROUTES } from '@/utils/constants/routes';

export const ONBOARDING_STEPS = [ROUTES.WELCOME, ROUTES.CARE_RECIPIENT, ROUTES.CAREGIVER];

/**
 * @param {string} currentPath
 * @returns {string | null}
 */
export function getNextStep(currentPath) {
  const index = ONBOARDING_STEPS.indexOf(currentPath);
  if (index === -1 || index >= ONBOARDING_STEPS.length - 1) {
    return null;
  }
  return ONBOARDING_STEPS[index + 1];
}

/**
 * @param {string} currentPath
 * @returns {string | null}
 */
export function getPreviousStep(currentPath) {
  const index = ONBOARDING_STEPS.indexOf(currentPath);
  if (index <= 0) {
    return null;
  }
  return ONBOARDING_STEPS[index - 1];
}

/**
 * @param {boolean} isAuthenticated
 * @param {boolean} isOnboardingComplete
 * @param {string} pathname
 * @returns {string | null}
 */
export function getRedirectPath(isAuthenticated, isOnboardingComplete, pathname) {
  if (!isAuthenticated) {
    return pathname === ROUTES.HOME ? null : ROUTES.HOME;
  }

  if (!isOnboardingComplete) {
    if (pathname === ROUTES.HOME) {
      return ROUTES.WELCOME;
    }
    if (!ONBOARDING_STEPS.includes(pathname) && pathname !== ROUTES.HOME) {
      return ROUTES.WELCOME;
    }
    return null;
  }

  if (pathname === ROUTES.HOME || ONBOARDING_STEPS.includes(pathname)) {
    return ROUTES.DASHBOARD;
  }

  return null;
}

/**
 * @param {boolean} isOnboardingComplete
 * @param {import('@/services/types.js').CareRecipient | null} careRecipient
 * @param {import('@/services/types.js').Caregiver | null} caregiver
 * @returns {boolean}
 */
export function isOnboardingComplete(isOnboardingComplete, careRecipient, caregiver) {
  if (isOnboardingComplete) {
    return true;
  }
  return Boolean(
    careRecipient?.firstName &&
    careRecipient?.lastName &&
    careRecipient?.dateOfBirth &&
    caregiver?.firstName &&
    caregiver?.lastName &&
    caregiver?.dateOfBirth,
  );
}
