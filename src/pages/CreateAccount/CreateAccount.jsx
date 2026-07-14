import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from '@/hooks/useForm';
import { validateSignUp } from '@/utils/validators/authValidators';
import { STRINGS } from '@/utils/constants/strings';
import { ROUTES } from '@/utils/constants/routes';
import { AuthShell } from '@/components/common/AuthShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function CreateAccount() {
  const { signUpWithEmail } = useAuth();
  const { values, errors, handleChange, handleBlur, validateForm } = useForm(
    initialValues,
    validateSignUp,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [sentTo, setSentTo] = useState('');
  const a = STRINGS.auth;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    const result = await signUpWithEmail({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      password: values.password,
    });
    if (result?.error) {
      setFormError(result.error.message || STRINGS.authErrors.signUpFailed);
      setIsSubmitting(false);
      return;
    }
    // If email confirmation is on, there is no session yet: show a check-email
    // state. Otherwise the OnboardingGuard routes the now-signed-in user.
    if (result.data?.needsVerification) {
      setSentTo(values.email.trim());
      setIsSubmitting(false);
    }
  };

  if (sentTo) {
    return (
      <AuthShell
        title={a.verifyTitle}
        subtitle={a.verifyBody.replace('{email}', sentTo)}
        footer={
          <Link to={ROUTES.HOME} className="font-medium text-primary hover:underline">
            {a.backToLogin}
          </Link>
        }
      >
        <span className="sr-only">Verification email sent</span>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={a.createTitle}
      subtitle={a.createSubtitle}
      footer={
        <span>
          {a.haveAccount}{' '}
          <Link to={ROUTES.HOME} className="font-medium text-primary hover:underline">
            {a.loginLink}
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div className="flex gap-3">
          <Input
            name="firstName"
            label={a.firstName}
            autoComplete="given-name"
            value={values.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            onBlur={() => handleBlur('firstName')}
            error={errors.firstName}
          />
          <Input
            name="lastName"
            label={a.lastName}
            autoComplete="family-name"
            value={values.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            onBlur={() => handleBlur('lastName')}
            error={errors.lastName}
          />
        </div>
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
          autoComplete="new-password"
          helperText={a.passwordHint}
          revealable
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
          revealable
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
          {isSubmitting ? a.creating : a.createButton}
        </Button>
      </form>
    </AuthShell>
  );
}
