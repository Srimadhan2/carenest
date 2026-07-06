import { describe, it, expect } from 'vitest';
import { ServiceError, AuthError, ValidationError, ok, err } from '@/services/errors';

describe('service errors', () => {
  it('ServiceError has correct code', () => {
    const error = new ServiceError('fail');
    expect(error.code).toBe('SERVICE_ERROR');
    expect(error.message).toBe('fail');
  });

  it('AuthError extends ServiceError', () => {
    const error = new AuthError('auth fail');
    expect(error.code).toBe('AUTH_ERROR');
    expect(error).toBeInstanceOf(ServiceError);
  });

  it('ValidationError extends ServiceError', () => {
    const error = new ValidationError('invalid');
    expect(error.code).toBe('VALIDATION_ERROR');
  });

  it('ok returns data wrapper', () => {
    expect(ok({ id: '1' })).toEqual({ data: { id: '1' } });
  });

  it('err returns error wrapper', () => {
    const error = new ServiceError('fail');
    expect(err(error)).toEqual({ error });
  });
});
