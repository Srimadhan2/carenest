import { cn } from '@/utils/helpers/cn';
import { STRINGS } from '@/utils/constants/strings';

const STEPS = [
  STRINGS.onboarding.stepWelcome,
  STRINGS.onboarding.stepRecipient,
  STRINGS.onboarding.stepCaregiver,
  STRINGS.onboarding.stepDone,
];

export function ProgressIndicator({ currentStep = 1, totalSteps = 4, className }) {
  return (
    <nav aria-label="Onboarding progress" className={cn('w-full', className)}>
      <ol className="flex items-center justify-between gap-2">
        {STEPS.slice(0, totalSteps).map((label, index) => {
          const step = index + 1;
          const isActive = step === currentStep;
          const isComplete = step < currentStep;

          return (
            <li key={label} className="flex flex-1 flex-col items-center gap-2">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors',
                  isComplete && 'bg-primary text-white',
                  isActive && 'bg-primary text-white ring-4 ring-primary/20',
                  !isActive && !isComplete && 'bg-border text-text-secondary',
                )}
                aria-current={isActive ? 'step' : undefined}
              >
                {isComplete ? '✓' : step}
              </div>
              <span
                className={cn(
                  'hidden text-caption sm:block',
                  isActive ? 'font-medium text-text' : 'text-text-secondary',
                )}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
