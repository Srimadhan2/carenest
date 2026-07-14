import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from '@/hooks/useForm';
import { validateLogin } from '@/utils/validators/authValidators';
import { STRINGS } from '@/utils/constants/strings';
import { ROUTES } from '@/utils/constants/routes';
import { AuthShell } from '@/components/common/AuthShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import GoogleSignInButton from './components/GoogleSignInButton';

const initialValues = { email: '', password: '' };

export default function Login() {
  const { signInWithGoogle, signInWithEmail } = useAuth();
  const { values, errors, handleChange, handleBlur, validateForm } = useForm(
    initialValues,
    validateLogin,
  );
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const a = STRINGS.auth;

  // Post-login routing is owned by OnboardingGuard: first login goes to
  // onboarding, returning login goes to the dashboard.
  const handleGoogle = async () => {
    setIsGoogleLoading(true);
    const result = await signInWithGoogle();
    if (result?.error) {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    const result = await signInWithEmail({ email: values.email.trim(), password: values.password });
    if (result?.error) {
      setFormError(result.error.message || STRINGS.authErrors.signInFailed);
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title={a.loginTitle}
      subtitle={a.loginSubtitle}
      footer={
        <span>
          {a.noAccount}{' '}
          <Link to={ROUTES.CREATE_ACCOUNT} className="font-medium text-primary hover:underline">
            {a.createAccountLink}
          </Link>
        </span>
      }
    >
      <GoogleSignInButton onClick={handleGoogle} isLoading={isGoogleLoading} />

      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-border" />
        <span className="text-caption text-text-secondary">{a.orDivider}</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          type="email"
          name="email"
          label={a.email}
          placeholder={a.emailPlaceholder}
          autoComplete="email"
          value={values.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          error={errors.email}
        />
        <Input
          type="password"
          name="password"
          label={a.password}
          placeholder={a.passwordPlaceholder}
          autoComplete="current-password"
          value={values.password}
          onChange={(e) => handleChange('password', e.target.value)}
          onBlur={() => handleBlur('password')}
          error={errors.password}
        />

        <div className="flex justify-end">
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-label font-medium text-primary hover:underline"
          >
            {a.forgotPassword}
          </Link>
        </div>

        {formError && (
          <p className="text-caption text-danger" role="alert">
            {formError}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
          {isSubmitting ? a.loggingIn : a.login}
        </Button>
      </form>
    </AuthShell>
  );
}
