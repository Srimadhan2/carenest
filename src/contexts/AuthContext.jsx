import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '@/services/auth/authService';
import { profileService } from '@/services/profile/profileService';

/** @type {React.Context<null | object>} */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // Restore the Supabase session on startup.
    authService
      .getCurrentUser()
      .then((result) => {
        if (cancelled) {
          return;
        }
        if (result.data) {
          setUser(result.data);
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    // Keeps the user in sync after the Google OAuth redirect, token refreshes,
    // and sign-outs in other tabs.
    const unsubscribe = authService.onAuthStateChange((nextUser) => {
      if (!cancelled) {
        setUser(nextUser);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  // Guarantee a profile row exists for the authenticated user (the signup
  // trigger normally creates it; this covers pre-existing accounts). Idempotent.
  useEffect(() => {
    if (!user?.id) {
      return;
    }
    profileService.ensureProfile(user);
  }, [user]);

  const signInWithGoogle = useCallback(async () => {
    // Redirects to Google; the user state is set by onAuthStateChange after
    // the redirect returns to the app.
    const result = await authService.signInWithGoogle();
    if (result.data && typeof result.data === 'object' && 'id' in result.data) {
      setUser(result.data);
    }
    return result;
  }, []);

  const signInWithEmail = useCallback(async (credentials) => {
    // onAuthStateChange also sets the user; set it here too for immediate reads.
    const result = await authService.signInWithEmail(credentials);
    if (result.data) {
      setUser(result.data);
    }
    return result;
  }, []);

  const signUpWithEmail = useCallback(async (input) => {
    const result = await authService.signUpWithEmail(input);
    if (result.data?.user && !result.data.needsVerification) {
      setUser(result.data.user);
    }
    return result;
  }, []);

  const resetPassword = useCallback((email) => authService.resetPassword(email), []);

  const updatePassword = useCallback((password) => authService.updatePassword(password), []);

  const signOut = useCallback(async () => {
    // Ends the Supabase session only; user data in the database is never deleted.
    await authService.signOut();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      resetPassword,
      updatePassword,
      signOut,
    }),
    [
      user,
      isLoading,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      resetPassword,
      updatePassword,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}
