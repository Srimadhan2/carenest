import { STRINGS } from '@/utils/constants/strings';

const GENDER_VALUES = ['male', 'female', 'other', 'prefer_not_to_say'];

/**
 * @param {Record<string, string>} values
 * @returns {Record<string, string>}
 */
export function validateCareRecipient(values) {
  /** @type {Record<string, string>} */
  const errors = {};

  if (!values.firstName?.trim()) {
    errors.firstName = STRINGS.errors.required;
  }
  if (!values.lastName?.trim()) {
    errors.lastName = STRINGS.errors.required;
  }
  if (!values.dateOfBirth) {
    errors.dateOfBirth = STRINGS.errors.required;
  } else if (Number.isNaN(new Date(values.dateOfBirth).getTime())) {
    errors.dateOfBirth = STRINGS.errors.invalidDate;
  }
  if (!values.gender || !GENDER_VALUES.includes(values.gender)) {
    errors.gender = STRINGS.errors.required;
  }

  return errors;
}

/**
 * @param {Record<string, string>} values
 * @returns {Record<string, string>}
 */
export function validateCaregiver(values) {
  /** @type {Record<string, string>} */
  const errors = {};

  if (!values.firstName?.trim()) {
    errors.firstName = STRINGS.errors.required;
  }
  if (!values.lastName?.trim()) {
    errors.lastName = STRINGS.errors.required;
  }
  if (!values.dateOfBirth) {
    errors.dateOfBirth = STRINGS.errors.required;
  } else if (Number.isNaN(new Date(values.dateOfBirth).getTime())) {
    errors.dateOfBirth = STRINGS.errors.invalidDate;
  }
  if (!values.gender || !GENDER_VALUES.includes(values.gender)) {
    errors.gender = STRINGS.errors.required;
  }

  return errors;
}

/**
 * @param {Record<string, string>} errors
 * @returns {boolean}
 */
export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
