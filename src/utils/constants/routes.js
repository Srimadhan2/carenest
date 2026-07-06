/** @type {import('./routes.js').RoutePath} */
export const ROUTES = {
  HOME: '/',
  WELCOME: '/welcome',
  CARE_RECIPIENT: '/care-recipient',
  CAREGIVER: '/caregiver',
  DASHBOARD: '/dashboard',
  NOTES: '/notes',
  NOTE_DETAIL: '/notes/:id',
};

export const ROUTE_GROUPS = {
  ONBOARDING: [ROUTES.WELCOME, ROUTES.CARE_RECIPIENT, ROUTES.CAREGIVER],
  APP: [ROUTES.DASHBOARD, ROUTES.NOTES],
};

/** @typedef {typeof ROUTES[keyof typeof ROUTES]} RoutePath */
