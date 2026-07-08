import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { useSignOut } from '@/hooks/useSignOut';
import { ROUTES } from '@/utils/constants/routes';
import { STRINGS } from '@/utils/constants/strings';
import { getPreviousStep } from '@/utils/helpers/onboarding';
import { pageTransition, pageVariants } from '@/lib/motion';

const STEP_MAP = {
  [ROUTES.WELCOME]: 1,
  [ROUTES.CARE_RECIPIENT]: 2,
  [ROUTES.CAREGIVER]: 3,
};

export function OnboardingLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const signOut = useSignOut();
  const currentStep = STEP_MAP[location.pathname] ?? 1;
  const previousStep = getPreviousStep(location.pathname);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-6">
        <Logo size="sm" />
        <button
          type="button"
          onClick={signOut}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-label font-medium text-text-secondary transition-colors hover:bg-background hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          <span>{STRINGS.auth.signOut}</span>
        </button>
      </header>

      <div className="mx-auto w-full max-w-xl flex-1 px-6 py-8">
        <ProgressIndicator currentStep={currentStep} className="mb-10" />

        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          transition={pageTransition}
        >
          <Outlet />
        </motion.div>
      </div>

      {previousStep && (
        <footer className="border-t border-border bg-surface px-6 py-4">
          <div className="mx-auto flex w-full max-w-xl">
            <Button variant="ghost" onClick={() => navigate(previousStep)}>
              {STRINGS.onboarding.back}
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
}
