export const ROUTES = {
  HOME: '/',
  WELCOME: '/welcome',
  CARE_RECIPIENT: '/care-recipient',
  CAREGIVER: '/caregiver',
  DASHBOARD: '/dashboard',
  NOTES: '/notes',
  NOTE_DETAIL: '/notes/:id',
  PROFILE: '/profile',
};

export const ROUTE_GROUPS = {
  ONBOARDING: [ROUTES.WELCOME, ROUTES.CARE_RECIPIENT, ROUTES.CAREGIVER],
  APP: [ROUTES.DASHBOARD, ROUTES.NOTES, ROUTES.PROFILE],
};

/** @typedef {typeof ROUTES[keyof typeof ROUTES]} RoutePath */
