import { useCallback, useState } from 'react';

/**
 * @param {Record<string, string>} initialValues
 * @param {(values: Record<string, string>) => Record<string, string>} validate
 */
export function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const handleBlur = useCallback(
    (name) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      if (validate) {
        setErrors(validate(values));
      }
    },
    [validate, values],
  );

  const validateForm = useCallback(() => {
    if (!validate) {
      return true;
    }
    const nextErrors = validate(values);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [validate, values]);

  const reset = useCallback(() => {
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
