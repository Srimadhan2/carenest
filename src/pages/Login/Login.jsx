import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { STRINGS } from '@/utils/constants/strings';
import { FEATURE_FLAGS } from '@/utils/constants/featureFlags';
import { Logo } from '@/components/ui/Logo';
import GoogleSignInButton from './components/GoogleSignInButton';
import AppleSignInButton from './components/AppleSignInButton';

export default function Login() {
  const { signInWithGoogle } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Post-login routing is owned by OnboardingGuard: first login goes to
  // onboarding, returning login goes to the dashboard. In Supabase mode this
  // call redirects to Google and the session resumes after the redirect back.
  const handleGoogle = async () => {
    setIsSubmitting(true);
    const result = await signInWithGoogle();
    if (result?.error) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 rounded-2xl bg-surface p-8 shadow-sm">
      <Logo size="lg" />
      <div className="text-center">
        <h1 className="text-hero font-semibold text-text">{STRINGS.auth.loginTitle}</h1>
        <p className="mt-3 text-body text-text-secondary">{STRINGS.auth.loginSubtitle}</p>
      </div>
      <div className="flex w-full flex-col gap-3">
        <GoogleSignInButton onClick={handleGoogle} isLoading={isSubmitting} />
        <AppleSignInButton />
      </div>
      {!FEATURE_FLAGS.USE_SUPABASE && (
        <p className="text-center text-caption text-text-secondary">{STRINGS.auth.devNotice}</p>
      )}
    </div>
  );
}
