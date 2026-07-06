export class ServiceError extends Error {
  /**
   * @param {string} message
   * @param {Object} [options]
   * @param {string} [options.code]
   * @param {number} [options.statusCode]
   * @param {unknown} [options.cause]
   */
  constructor(message, options = {}) {
    super(message);
    this.name = 'ServiceError';
    this.code = options.code ?? 'SERVICE_ERROR';
    this.statusCode = options.statusCode;
    this.cause = options.cause;
  }
}

export class AuthError extends ServiceError {
  constructor(message, options = {}) {
    super(message, { ...options, code: options.code ?? 'AUTH_ERROR' });
    this.name = 'AuthError';
  }
}

export class ValidationError extends ServiceError {
  constructor(message, options = {}) {
    super(message, { ...options, code: options.code ?? 'VALIDATION_ERROR' });
    this.name = 'ValidationError';
  }
}

/**
 * @template T
 * @param {T} data
 * @returns {import('./types.js').ServiceResult<T>}
 */
export function ok(data) {
  return { data };
}

/**
 * @param {ServiceError} error
 * @returns {import('./types.js').ServiceResult<never>}
 */
export function err(error) {
  return { error };
}
