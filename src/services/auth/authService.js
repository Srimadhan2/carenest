import { FEATURE_FLAGS } from '@/utils/constants/featureFlags';
import { supabase } from '@/lib/supabase';
import { sessionStorageAdapter } from '@/services/storage/sessionStorageAdapter';
import { ok, err, AuthError } from '@/services/errors';

const SESSION_KEY = 'auth:session';

const MOCK_DELAY = 600;

function delay(ms = MOCK_DELAY) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
  if (!supabase) {
    return err(new AuthError('Supabase is not configured'));
  }
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
    if (FEATURE_FLAGS.USE_SUPABASE && supabase) {
      return supabaseSignInWithGoogle();
    }
    return mockSignInWithGoogle();
  },

  async signInWithApple() {
    return err(new AuthError('Apple Sign In coming soon'));
  },

  async signOut() {
    if (FEATURE_FLAGS.USE_SUPABASE && supabase) {
      await supabase.auth.signOut();
    }
    sessionStorageAdapter.remove(SESSION_KEY);
    return ok(undefined);
  },

  async getCurrentUser() {
    if (FEATURE_FLAGS.USE_SUPABASE && supabase) {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        return err(new AuthError(error.message));
      }
      if (!user) {
        return ok(null);
      }
      return ok({
        id: user.id,
        email: user.email ?? '',
        displayName: user.user_metadata?.full_name ?? user.email ?? '',
        avatarUrl: user.user_metadata?.avatar_url,
        authProvider: 'google',
      });
    }
    return ok(getMockUser());
  },

  async getSession() {
    if (FEATURE_FLAGS.USE_SUPABASE && supabase) {
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
    if (!(FEATURE_FLAGS.USE_SUPABASE && supabase)) {
      return () => {};
    }
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      callback(
        user
          ? {
              id: user.id,
              email: user.email ?? '',
              displayName: user.user_metadata?.full_name ?? user.email ?? '',
              avatarUrl: user.user_metadata?.avatar_url,
              authProvider: 'google',
            }
          : null,
      );
    });
    return () => subscription.unsubscribe();
  },
};
