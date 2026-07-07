import { FEATURE_FLAGS } from '@/utils/constants/featureFlags';
import { supabase } from '@/lib/supabase';
import { sessionStorageAdapter } from '@/services/storage/sessionStorageAdapter';
import { ok, err, AuthError } from '@/services/errors';
import { ROUTES } from '@/utils/constants/routes';

const SESSION_KEY = 'auth:session';

const MOCK_DELAY = 600;

function delay(ms = MOCK_DELAY) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function supabaseReady() {
  return Boolean(FEATURE_FLAGS.USE_SUPABASE && supabase);
}

/**
 * Normalize a Supabase auth user into the app's User shape.
 * @param {import('@supabase/supabase-js').User | null | undefined} user
 * @returns {import('@/services/types.js').User | null}
 */
function mapUser(user) {
  if (!user) {
    return null;
  }
  const meta = user.user_metadata ?? {};
  const composed = `${meta.first_name ?? ''} ${meta.last_name ?? ''}`.trim();
  return {
    id: user.id,
    email: user.email ?? '',
    displayName: meta.full_name || composed || user.email || '',
    avatarUrl: meta.avatar_url,
    authProvider: user.app_metadata?.provider ?? 'email',
  };
}

/**
 * @returns {import('@/services/types.js').User | null}
 */
function getMockUser() {
  const raw = sessionStorageAdapter.get(SESSION_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * @param {import('@/services/types.js').User} user
 */
function setMockUser(user) {
  sessionStorageAdapter.set(SESSION_KEY, JSON.stringify(user));
}

async function mockSignInWithGoogle() {
  await delay();
  const user = {
    id: 'mock-user-1',
    email: 'caregiver@example.com',
    displayName: 'Sarah Johnson',
    authProvider: 'mock',
  };
  setMockUser(user);
  return ok(user);
}

async function supabaseSignInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
  if (error) {
    return err(new AuthError(error.message));
  }
  return ok(data);
}

export const authService = {
  async signInWithGoogle() {
    if (supabaseReady()) {
      return supabaseSignInWithGoogle();
    }
    return mockSignInWithGoogle();
  },

  /**
   * Create an account with email + password.
   * @param {{ email: string, password: string, firstName: string, lastName: string }} input
   * @returns {Promise<import('@/services/types.js').ServiceResult<{ user: import('@/services/types.js').User | null, needsVerification: boolean }>>}
   */
  async signUpWithEmail({ email, password, firstName, lastName }) {
    if (supabaseReady()) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`.trim(),
          },
        },
      });
      if (error) {
        return err(new AuthError(error.message));
      }
      // No session means email confirmation is required before login.
      return ok({ user: mapUser(data.user), needsVerification: !data.session });
    }

    await delay();
    const user = {
      id: `mock-${Date.now()}`,
      email,
      displayName: `${firstName} ${lastName}`.trim() || email,
      authProvider: 'mock',
    };
    setMockUser(user);
    return ok({ user, needsVerification: false });
  },

  /**
   * @param {{ email: string, password: string }} input
   * @returns {Promise<import('@/services/types.js').ServiceResult<import('@/services/types.js').User | null>>}
   */
  async signInWithEmail({ email, password }) {
    if (supabaseReady()) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return err(new AuthError(error.message));
      }
      return ok(mapUser(data.user));
    }

    await delay();
    const user = {
      id: 'mock-user-1',
      email,
      displayName: email,
      authProvider: 'mock',
    };
    setMockUser(user);
    return ok(user);
  },

  /**
   * Send a password reset email that links back to the reset screen.
   * @param {string} email
   */
  async resetPassword(email) {
    if (supabaseReady()) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}${ROUTES.RESET_PASSWORD}`,
      });
      if (error) {
        return err(new AuthError(error.message));
      }
      return ok(undefined);
    }
    await delay();
    return ok(undefined);
  },

  /**
   * Set a new password for the current (recovery) session.
   * @param {string} newPassword
   */
  async updatePassword(newPassword) {
    if (supabaseReady()) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        return err(new AuthError(error.message));
      }
      return ok(undefined);
    }
    await delay();
    return ok(undefined);
  },

  async signInWithApple() {
    return err(new AuthError('Apple Sign In coming soon'));
  },

  async signOut() {
    if (supabaseReady()) {
      await supabase.auth.signOut();
    }
    sessionStorageAdapter.remove(SESSION_KEY);
    return ok(undefined);
  },

  async getCurrentUser() {
    if (supabaseReady()) {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        return err(new AuthError(error.message));
      }
      return ok(mapUser(user));
    }
    return ok(getMockUser());
  },

  async getSession() {
    if (supabaseReady()) {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        return err(new AuthError(error.message));
      }
      return ok(data.session);
    }
    const user = getMockUser();
    return ok(user ? { user } : null);
  },

  /**
   * Subscribe to auth changes (OAuth redirect return, token refresh, sign-out).
   * No-op in mock mode. Returns an unsubscribe function.
   * @param {(user: import('@/services/types.js').User | null) => void} callback
   */
  onAuthStateChange(callback) {
    if (!supabaseReady()) {
      return () => {};
    }
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(mapUser(session?.user));
    });
    return () => subscription.unsubscribe();
  },
};
