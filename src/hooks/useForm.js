import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * @param {Record<string, string>} initialValues
 * @param {(values: Record<string, string>) => Record<string, string>} validate
 */
export function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const valuesRef = useRef(values);

  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  const handleChange = useCallback(
    (name, value) => {
      const next = { ...valuesRef.current, [name]: value };
      valuesRef.current = next;
      setValues(next);
      setTouched((prev) => ({ ...prev, [name]: true }));

      // Keep password / confirm-password errors in sync while typing so a
      // previously shown "Passwords do not match" clears as soon as they match.
      if (validate) {
        const nextErrors = validate(next);
        setErrors((prevErrors) => {
          const updated = { ...prevErrors };
          if (nextErrors[name]) {
            updated[name] = nextErrors[name];
          } else {
            delete updated[name];
          }
          if (name === 'password' || name === 'confirmPassword') {
            if (nextErrors.confirmPassword) {
              updated.confirmPassword = nextErrors.confirmPassword;
            } else {
              delete updated.confirmPassword;
            }
            if (nextErrors.password) {
              updated.password = nextErrors.password;
            } else if (name === 'password') {
              delete updated.password;
            }
          }
          return updated;
        });
      }
    },
    [validate],
  );

  const handleBlur = useCallback(
    (name) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      if (validate) {
        // Use the ref so blur always validates the latest typed values
        // (avoids stale closure showing a false password mismatch).
        setErrors(validate(valuesRef.current));
      }
    },
    [validate],
  );

  const validateForm = useCallback(() => {
    if (!validate) {
      return true;
    }
    const nextErrors = validate(valuesRef.current);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [validate]);

  const reset = useCallback(() => {
    valuesRef.current = initialValues;
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    reset,
    setValues,
  };
}
