import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from '@/hooks/useForm';
import { authService } from '@/services/auth/authService';
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
  // The email link must have established a (recovery) session for updateUser to
  // work. Verify it up front so an invalid/expired link shows a clear message
  // instead of a confusing failure after the user types a new password.
  const [sessionState, setSessionState] = useState('checking');
  const a = STRINGS.auth;

  useEffect(() => {
    let cancelled = false;
    authService
      .getSession()
      .then((result) => {
        if (!cancelled) {
          setSessionState(result?.data ? 'ready' : 'invalid');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSessionState('invalid');
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

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

  if (sessionState === 'checking') {
    return <AuthShell title={a.resetTitle} subtitle={a.resetChecking} />;
  }

  if (sessionState === 'invalid') {
    return (
      <AuthShell
        title={a.resetInvalidTitle}
        subtitle={a.resetInvalidBody}
        footer={
          <Link to={ROUTES.HOME} className="font-medium text-primary hover:underline">
            {a.backToLogin}
          </Link>
        }
      >
        <Button
          size="lg"
          className="w-full"
          onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
        >
          {a.requestNewLink}
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
