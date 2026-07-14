import { getSupabase } from '@/lib/supabase';
import { ok, err, AuthError, fromSupabaseAuthError } from '@/services/errors';
import { ROUTES } from '@/utils/constants/routes';

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

export const authService = {
  async signInWithGoogle() {
    const { data, error } = await getSupabase().auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        // Always show Google's account chooser so users can pick / add another account.
        queryParams: {
          prompt: 'select_account',
        },
      },
    });
    if (error) {
      return err(fromSupabaseAuthError(error, 'Google sign-in failed. Please try again.'));
    }
    return ok(data);
  },

  /**
   * Create an account with email + password.
   * @param {{ email: string, password: string, firstName: string, lastName: string }} input
   * @returns {Promise<import('@/services/types.js').ServiceResult<{ user: import('@/services/types.js').User | null, needsVerification: boolean }>>}
   */
  async signUpWithEmail({ email, password, firstName, lastName }) {
    const { data, error } = await getSupabase().auth.signUp({
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
      return err(fromSupabaseAuthError(error, 'Could not create your account. Please try again.'));
    }
    // No session means email confirmation is required before login.
    return ok({ user: mapUser(data.user), needsVerification: !data.session });
  },

  /**
   * @param {{ email: string, password: string }} input
   * @returns {Promise<import('@/services/types.js').ServiceResult<import('@/services/types.js').User | null>>}
   */
  async signInWithEmail({ email, password }) {
    const { data, error } = await getSupabase().auth.signInWithPassword({ email, password });
    if (error) {
      return err(fromSupabaseAuthError(error));
    }
    return ok(mapUser(data.user));
  },

  /**
   * Send a password reset email that links back to the reset screen.
   * @param {string} email
   */
  async resetPassword(email) {
    const { error } = await getSupabase().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${ROUTES.RESET_PASSWORD}`,
    });
    if (error) {
      return err(fromSupabaseAuthError(error, 'Could not send the reset email. Please try again.'));
    }
    return ok(undefined);
  },

  /**
   * Set a new password for the current (recovery) session.
   * @param {string} newPassword
   */
  async updatePassword(newPassword) {
    const { error } = await getSupabase().auth.updateUser({ password: newPassword });
    if (error) {
      return err(fromSupabaseAuthError(error, 'Could not update your password. Please try again.'));
    }
    return ok(undefined);
  },

  async signInWithApple() {
    return err(new AuthError('Apple Sign In coming soon'));
  },

  async signOut() {
    const { error } = await getSupabase().auth.signOut();
    if (error) {
      return err(fromSupabaseAuthError(error, 'Could not sign out. Please try again.'));
    }
    return ok(undefined);
  },

  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await getSupabase().auth.getUser();
    // A missing session is not an error here: it simply means "no user".
    if (error) {
      return ok(null);
    }
    return ok(mapUser(user));
  },

  async getSession() {
    const { data, error } = await getSupabase().auth.getSession();
    if (error) {
      return err(fromSupabaseAuthError(error));
    }
    return ok(data.session);
  },

  /**
   * Subscribe to auth changes (OAuth redirect return, token refresh, sign-out).
   * Returns an unsubscribe function.
   * @param {(user: import('@/services/types.js').User | null) => void} callback
   */
  onAuthStateChange(callback) {
    const {
      data: { subscription },
    } = getSupabase().auth.onAuthStateChange((_event, session) => {
      callback(mapUser(session?.user));
    });
    return () => subscription.unsubscribe();
  },
};
