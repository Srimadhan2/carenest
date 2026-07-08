export class ServiceError extends Error {
  /**
   * @param {string} message
   * @param {Object} [options]
   * @param {string} [options.code]
   * @param {number} [options.statusCode]
   * @param {unknown} [options.cause]
   */
  constructor(message, options = {}) {
    super(message);
    this.name = 'ServiceError';
    this.code = options.code ?? 'SERVICE_ERROR';
    this.statusCode = options.statusCode;
    this.cause = options.cause;
  }
}

export class AuthError extends ServiceError {
  constructor(message, options = {}) {
    super(message, { ...options, code: options.code ?? 'AUTH_ERROR' });
    this.name = 'AuthError';
  }
}

export class ValidationError extends ServiceError {
  constructor(message, options = {}) {
    super(message, { ...options, code: options.code ?? 'VALIDATION_ERROR' });
    this.name = 'ValidationError';
  }
}

/**
 * @template T
 * @param {T} data
 * @returns {import('./types.js').ServiceResult<T>}
 */
export function ok(data) {
  return { data };
}

/**
 * @param {ServiceError} error
 * @returns {import('./types.js').ServiceResult<never>}
 */
export function err(error) {
  return { error };
}

// Postgres SQLSTATE / PostgREST codes -> friendly, non-technical messages.
const FRIENDLY_BY_CODE = {
  23505: 'This record already exists.',
  23503: 'This references information that no longer exists.',
  23502: 'Some required information is missing.',
  23514: 'Some of the information provided is invalid.',
  42501: "You don't have permission to do that.",
  28000: 'Your session has expired. Please sign in again.',
  PGRST301: 'Your session has expired. Please sign in again.',
};

function logRaw(scope, error) {
  // Log the raw error for debugging, but never surface it to the UI.
  if (import.meta.env?.DEV) {
    console.error(`[${scope}]`, error);
  }
}

/**
 * Convert a raw Supabase/Postgres data error into a friendly ServiceError.
 * @param {{ code?: string, message?: string } | null | undefined} error
 * @param {string} [fallbackMessage]
 * @returns {ServiceError}
 */
export function fromSupabaseError(
  error,
  fallbackMessage = 'Something went wrong. Please try again.',
) {
  logRaw('supabase', error);
  const code = error?.code ? String(error.code) : undefined;
  const message = (code && FRIENDLY_BY_CODE[code]) || fallbackMessage;
  return new ServiceError(message, { code, cause: error });
}

/**
 * Convert a raw Supabase auth error into a friendly AuthError.
 * @param {{ code?: string, message?: string } | null | undefined} error
 * @param {string} [fallbackMessage]
 * @returns {AuthError}
 */
export function fromSupabaseAuthError(
  error,
  fallbackMessage = 'Authentication failed. Please try again.',
) {
  logRaw('supabase-auth', error);
  const raw = error?.message ?? '';
  let message = fallbackMessage;
  if (/invalid login credentials/i.test(raw)) {
    message = 'Incorrect email or password.';
  } else if (/email not confirmed/i.test(raw)) {
    message = 'Please confirm your email address before signing in.';
  } else if (/already registered|already been registered|user already/i.test(raw)) {
    message = 'An account with this email already exists.';
  } else if (/rate limit|too many/i.test(raw)) {
    message = 'Too many attempts. Please wait a moment and try again.';
  } else if (/password/i.test(raw)) {
    message = 'Please choose a stronger password (at least 8 characters).';
  }
  return new AuthError(message, { code: error?.code, cause: error });
}
