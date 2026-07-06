import { describe, it, expect } from 'vitest';
import {
  validateCareRecipient,
  validateCaregiver,
  hasErrors,
} from '@/utils/validators/profileValidators';

describe('profileValidators', () => {
  describe('validateCareRecipient', () => {
    it('returns errors for empty required fields', () => {
      const errors = validateCareRecipient({});
      expect(errors.firstName).toBeDefined();
      expect(errors.lastName).toBeDefined();
      expect(errors.dateOfBirth).toBeDefined();
      expect(errors.gender).toBeDefined();
    });

    it('passes with valid data', () => {
      const errors = validateCareRecipient({
        firstName: 'Mary',
        lastName: 'Smith',
        dateOfBirth: '1945-06-15',
        gender: 'female',
      });
      expect(hasErrors(errors)).toBe(false);
    });

    it('rejects invalid date', () => {
      const errors = validateCareRecipient({
        firstName: 'Mary',
        lastName: 'Smith',
        dateOfBirth: 'invalid',
        gender: 'female',
      });
      expect(errors.dateOfBirth).toBeDefined();
    });
  });

  describe('validateCaregiver', () => {
    it('returns errors for empty fields', () => {
      const errors = validateCaregiver({});
      expect(hasErrors(errors)).toBe(true);
    });

    it('passes with valid data', () => {
      const errors = validateCaregiver({
        firstName: 'Sarah',
        lastName: 'Johnson',
        dateOfBirth: '1972-03-20',
        gender: 'female',
      });
      expect(hasErrors(errors)).toBe(false);
    });
  });
});
