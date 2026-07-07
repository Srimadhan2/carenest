import { STRINGS } from '@/utils/constants/strings';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

/**
 * @param {string} email
 */
function isValidEmail(email) {
  return EMAIL_RE.test(String(email).trim());
}

/**
 * Password must be at least 8 chars and contain a letter and a number.
 * @param {string} password
 */
function passwordError(password) {
  const value = String(password ?? '');
  if (value.length < MIN_PASSWORD) {
    return STRINGS.authErrors.passwordTooShort;
  }
  if (!/[a-zA-Z]/.test(value) || !/\d/.test(value)) {
    return STRINGS.authErrors.passwordWeak;
  }
  return null;
}

/**
 * @param {Record<string, string>} values
 * @returns {Record<string, string>}
 */
export function validateLogin(values) {
  /** @type {Record<string, string>} */
  const errors = {};
  if (!values.email?.trim()) {
    errors.email = STRINGS.errors.required;
  } else if (!isValidEmail(values.email)) {
    errors.email = STRINGS.authErrors.invalidEmail;
  }
  if (!values.password) {
    errors.password = STRINGS.errors.required;
  }
  return errors;
}

/**
 * @param {Record<string, string>} values
 * @returns {Record<string, string>}
 */
export function validateSignUp(values) {
  /** @type {Record<string, string>} */
  const errors = {};
  if (!values.firstName?.trim()) {
    errors.firstName = STRINGS.errors.required;
  }
  if (!values.lastName?.trim()) {
    errors.lastName = STRINGS.errors.required;
  }
  if (!values.email?.trim()) {
    errors.email = STRINGS.errors.required;
  } else if (!isValidEmail(values.email)) {
    errors.email = STRINGS.authErrors.invalidEmail;
  }
  const pwError = passwordError(values.password);
  if (!values.password) {
    errors.password = STRINGS.errors.required;
  } else if (pwError) {
    errors.password = pwError;
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = STRINGS.errors.required;
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = STRINGS.authErrors.passwordMismatch;
  }
  return errors;
}

/**
 * @param {Record<string, string>} values
 * @returns {Record<string, string>}
 */
export function validateForgotPassword(values) {
  /** @type {Record<string, string>} */
  const errors = {};
  if (!values.email?.trim()) {
    errors.email = STRINGS.errors.required;
  } else if (!isValidEmail(values.email)) {
    errors.email = STRINGS.authErrors.invalidEmail;
  }
  return errors;
}

/**
 * @param {Record<string, string>} values
 * @returns {Record<string, string>}
 */
export function validateResetPassword(values) {
  /** @type {Record<string, string>} */
  const errors = {};
  const pwError = passwordError(values.password);
  if (!values.password) {
    errors.password = STRINGS.errors.required;
  } else if (pwError) {
    errors.password = pwError;
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = STRINGS.errors.required;
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = STRINGS.authErrors.passwordMismatch;
  }
  return errors;
}
