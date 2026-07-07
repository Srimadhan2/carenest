import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from '@/hooks/useForm';
import { validateResetPassword } from '@/utils/validators/authValidators';
import { STRINGS } from '@/utils/constants/strings';
import { ROUTES } from '@/utils/constants/routes';
import { AuthShell } from '@/components/common/AuthShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const initialValues = { password: '', confirmPassword: '' };

export default function ResetPassword() {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const { values, errors, handleChange, handleBlur, validateForm } = useForm(
    initialValues,
    validateResetPassword,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [done, setDone] = useState(false);
  const a = STRINGS.auth;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    const result = await updatePassword(values.password);
    if (result?.error) {
      setFormError(STRINGS.authErrors.updateFailed);
      setIsSubmitting(false);
      return;
    }
    setDone(true);
    setIsSubmitting(false);
  };

  if (done) {
    return (
      <AuthShell title={a.resetDoneTitle} subtitle={a.resetDoneBody}>
        <Button size="lg" className="w-full" onClick={() => navigate(ROUTES.DASHBOARD)}>
          {a.continueToApp}
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell title={a.resetTitle} subtitle={a.resetSubtitle}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          type="password"
          name="password"
          label={a.newPassword}
          autoComplete="new-password"
          helperText={a.passwordHint}
          value={values.password}
          onChange={(e) => handleChange('password', e.target.value)}
          onBlur={() => handleBlur('password')}
          error={errors.password}
        />
        <Input
          type="password"
          name="confirmPassword"
          label={a.confirmPassword}
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          onBlur={() => handleBlur('confirmPassword')}
          error={errors.confirmPassword}
        />

        {formError && (
          <p className="text-caption text-danger" role="alert">
            {formError}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
          {isSubmitting ? a.updating : a.updatePassword}
        </Button>
      </form>
    </AuthShell>
  );
}
