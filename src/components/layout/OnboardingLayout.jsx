import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
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
  const currentStep = STEP_MAP[location.pathname] ?? 1;
  const previousStep = getPreviousStep(location.pathname);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-surface px-6 py-6">
        <Logo size="sm" />
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
