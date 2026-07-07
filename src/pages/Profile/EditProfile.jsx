import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/navigation/Navbar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/forms/FormField';
import { useForm } from '@/hooks/useForm';
import { useAuthContext } from '@/contexts/AuthContext';
import { useUIContext } from '@/contexts/UIContext';
import { profileService } from '@/services/profile/profileService';
import { STRINGS } from '@/utils/constants/strings';
import { ROUTES } from '@/utils/constants/routes';

const initialValues = { firstName: '', lastName: '' };

function validate(values) {
  const errors = {};
  if (!values.firstName?.trim()) {
    errors.firstName = STRINGS.errors.required;
  }
  if (!values.lastName?.trim()) {
    errors.lastName = STRINGS.errors.required;
  }
  return errors;
}

export default function EditProfile() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { showToast } = useUIContext();
  const { values, errors, handleChange, handleBlur, validateForm, setValues } = useForm(
    initialValues,
    validate,
  );
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const p = STRINGS.profile;

  useEffect(() => {
    let cancelled = false;
    profileService.getProfile().then((result) => {
      if (!cancelled && result.data) {
        setValues({
          firstName: result.data.firstName ?? '',
          lastName: result.data.lastName ?? '',
        });
        setEmail(result.data.email ?? '');
      }
    });
    return () => {
      cancelled = true;
    };
  }, [setValues]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm() || !user?.id) {
      return;
    }
    setIsSubmitting(true);
    const result = await profileService.updateProfile(user.id, {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
    });
    if (result?.error) {
      showToast(STRINGS.errors.generic, 'error');
      setIsSubmitting(false);
      return;
    }
    showToast(p.saved, 'success');
    navigate(ROUTES.PROFILE);
  };

  return (
    <div className="flex flex-col gap-6">
      <Navbar title={p.editTitle} subtitle={p.editSubtitle} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <FormField>
          <Input
            name="firstName"
            label={STRINGS.auth.firstName}
            value={values.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            onBlur={() => handleBlur('firstName')}
            error={errors.firstName}
          />
          <Input
            name="lastName"
            label={STRINGS.auth.lastName}
            value={values.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            onBlur={() => handleBlur('lastName')}
            error={errors.lastName}
          />
          <Input name="email" label={STRINGS.auth.email} value={email} disabled readOnly />
        </FormField>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="flex-1"
            onClick={() => navigate(ROUTES.PROFILE)}
          >
            {p.cancel}
          </Button>
          <Button type="submit" size="lg" className="flex-1" isLoading={isSubmitting}>
            {isSubmitting ? p.saving : p.save}
          </Button>
        </div>
      </form>
    </div>
  );
}
