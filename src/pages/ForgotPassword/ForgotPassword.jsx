import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from '@/hooks/useForm';
import { validateForgotPassword } from '@/utils/validators/authValidators';
import { STRINGS } from '@/utils/constants/strings';
import { ROUTES } from '@/utils/constants/routes';
import { AuthShell } from '@/components/common/AuthShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const initialValues = { email: '' };

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const { values, errors, handleChange, handleBlur, validateForm } = useForm(
    initialValues,
    validateForgotPassword,
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
    const email = values.email.trim();
    const result = await resetPassword(email);
    if (result?.error) {
      setFormError(STRINGS.authErrors.resetFailed);
      setIsSubmitting(false);
      return;
    }
    setSentTo(email);
    setIsSubmitting(false);
  };

  if (sentTo) {
    return (
      <AuthShell
        title={a.forgotSentTitle}
        subtitle={a.forgotSentBody.replace('{email}', sentTo)}
        footer={
          <Link to={ROUTES.HOME} className="font-medium text-primary hover:underline">
            {a.backToLogin}
          </Link>
        }
      >
        <span className="sr-only">Reset email sent</span>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={a.forgotTitle}
      subtitle={a.forgotSubtitle}
      footer={
        <Link to={ROUTES.HOME} className="font-medium text-primary hover:underline">
          {a.backToLogin}
        </Link>
      }
    >
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

        {formError && (
          <p className="text-caption text-danger" role="alert">
            {formError}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
          {isSubmitting ? a.sending : a.sendReset}
        </Button>
      </form>
    </AuthShell>
  );
}
