import { describe, it, expect } from 'vitest';
import { getNextStep, getPreviousStep, isOnboardingComplete } from '@/utils/helpers/onboarding';
import { ROUTES } from '@/utils/constants/routes';

describe('onboarding helpers', () => {
  it('getNextStep returns next onboarding route', () => {
    expect(getNextStep(ROUTES.WELCOME)).toBe(ROUTES.CARE_RECIPIENT);
    expect(getNextStep(ROUTES.CARE_RECIPIENT)).toBe(ROUTES.CAREGIVER);
    expect(getNextStep(ROUTES.CAREGIVER)).toBeNull();
  });

  it('getPreviousStep returns previous onboarding route', () => {
    expect(getPreviousStep(ROUTES.CARE_RECIPIENT)).toBe(ROUTES.WELCOME);
    expect(getPreviousStep(ROUTES.WELCOME)).toBeNull();
  });

  it('isOnboardingComplete returns true when flag set', () => {
    expect(isOnboardingComplete(true, null, null)).toBe(true);
  });

  it('isOnboardingComplete checks profiles when flag false', () => {
    const recipient = {
      firstName: 'Mary',
      lastName: 'Smith',
      dateOfBirth: '1945-01-01',
    };
    const caregiver = {
      firstName: 'Sarah',
      lastName: 'J',
      dateOfBirth: '1970-01-01',
    };
    expect(isOnboardingComplete(false, recipient, caregiver)).toBe(true);
    expect(isOnboardingComplete(false, recipient, null)).toBe(false);
  });
});
