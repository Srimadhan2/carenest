import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '@/services/auth/authService';
import { sessionStorageAdapter } from '@/services/storage/sessionStorageAdapter';

/** @type {React.Context<null | object>} */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    authService.getCurrentUser().then((result) => {
      if (cancelled) {
        return;
      }
      if (result.data) {
        setUser(result.data);
      }
      setIsLoading(false);
    });

    // Supabase mode: keeps user in sync after the Google OAuth redirect,
    // token refreshes, and sign-outs in other tabs. No-op in mock mode.
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

  const signInWithGoogle = useCallback(async () => {
    // Supabase mode redirects to Google here; the user state is set by
    // onAuthStateChange after the redirect back. Mock mode resolves inline.
    const result = await authService.signInWithGoogle();
    if (result.data && typeof result.data === 'object' && 'id' in result.data) {
      setUser(result.data);
    }
    return result;
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
    sessionStorageAdapter.clear();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      signInWithGoogle,
      signOut,
    }),
    [user, isLoading, signInWithGoogle, signOut],
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
