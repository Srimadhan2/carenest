import { describe, it, expect } from 'vitest';
import { calculateAge, formatDate } from '@/utils/helpers/formatAge';

describe('formatAge helpers', () => {
  it('calculateAge returns correct age', () => {
    const birthYear = new Date().getFullYear() - 30;
    const age = calculateAge(`${birthYear}-01-15`);
    expect(age).toBeGreaterThanOrEqual(29);
    expect(age).toBeLessThanOrEqual(30);
  });

  it('calculateAge returns null for invalid input', () => {
    expect(calculateAge('')).toBeNull();
    expect(calculateAge('bad')).toBeNull();
  });

  it('formatDate formats ISO date', () => {
    const formatted = formatDate('2024-03-15');
    expect(formatted).toContain('2024');
  });
});
