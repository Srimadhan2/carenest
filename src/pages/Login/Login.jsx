import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useUIContext } from '@/contexts/UIContext';
import { ROUTES } from '@/utils/constants/routes';
import { STRINGS } from '@/utils/constants/strings';
import { fadeTransition, fadeVariants } from '@/lib/motion';
import { motion } from 'framer-motion';
import GoogleSignInButton from './components/GoogleSignInButton';
import AppleSignInButton from './components/AppleSignInButton';

export default function Login() {
  const navigate = useNavigate();
  const { signInWithGoogle, isAuthenticated } = useAuth();
  const { showToast } = useUIContext();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.WELCOME, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const result = await signInWithGoogle();
    setIsLoading(false);

    if (result.error) {
      showToast(result.error.message, 'error');
      return;
    }

    navigate(ROUTES.WELCOME);
  };

  return (
    <motion.div
      className="rounded-2xl border border-border bg-surface p-8 shadow-sm"
      variants={fadeVariants}
      initial="initial"
      animate="animate"
      transition={fadeTransition}
    >
      <div className="mb-8 flex justify-center">
        <Logo />
      </div>

      <h1 className="mb-2 text-center text-hero font-semibold text-text">
        {STRINGS.auth.loginTitle}
      </h1>
      <p className="mb-8 text-center text-body text-text-secondary">{STRINGS.auth.loginSubtitle}</p>

      <div className="flex flex-col gap-4">
        <GoogleSignInButton onClick={handleGoogleSignIn} isLoading={isLoading} />
        <AppleSignInButton />
      </div>

      <p className="mt-8 text-center text-caption text-text-secondary">{STRINGS.auth.devNotice}</p>
    </motion.div>
  );
}
