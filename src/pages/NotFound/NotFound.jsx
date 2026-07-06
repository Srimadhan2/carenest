import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { STRINGS } from '@/utils/constants/strings';
import { ROUTES } from '@/utils/constants/routes';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-hero font-semibold text-text">{STRINGS.errors.notFound}</h1>
      <p className="text-body text-text-secondary">{STRINGS.errors.notFoundDesc}</p>
      <Button size="lg" onClick={() => navigate(ROUTES.HOME)}>
        {STRINGS.errors.goHome}
      </Button>
    </div>
  );
}
