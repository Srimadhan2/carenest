export const ROUTES = {
  HOME: '/',
  CREATE_ACCOUNT: '/create-account',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  WELCOME: '/welcome',
  CARE_RECIPIENT: '/care-recipient',
  CAREGIVER: '/caregiver',
  DASHBOARD: '/dashboard',
  NOTES: '/notes',
  NOTE_DETAIL: '/notes/:id',
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',
};

export const ROUTE_GROUPS = {
  // Public auth screens a signed-in user should be redirected away from.
  // Note: RESET_PASSWORD is intentionally excluded — it runs under a recovery session.
  PUBLIC_AUTH: [ROUTES.HOME, ROUTES.CREATE_ACCOUNT, ROUTES.FORGOT_PASSWORD],
  ONBOARDING: [ROUTES.WELCOME, ROUTES.CARE_RECIPIENT, ROUTES.CAREGIVER],
  APP: [ROUTES.DASHBOARD, ROUTES.NOTES, ROUTES.PROFILE, ROUTES.PROFILE_EDIT],
};

/** @typedef {typeof ROUTES[keyof typeof ROUTES]} RoutePath */
