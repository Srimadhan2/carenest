import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { STRINGS } from '@/utils/constants/strings';
import { ROUTES } from '@/utils/constants/routes';

const benefits = [STRINGS.welcome.benefit1, STRINGS.welcome.benefit2, STRINGS.welcome.benefit3];

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-hero font-semibold text-text">{STRINGS.welcome.title}</h1>
        <p className="mt-3 text-body text-text-secondary">{STRINGS.welcome.subtitle}</p>
      </div>

      <ul className="flex flex-col gap-4">
        {benefits.map((benefit) => (
          <li key={benefit} className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle className="h-5 w-5 text-primary" aria-hidden="true" />
            </span>
            <span className="text-body text-text">{benefit}</span>
          </li>
        ))}
      </ul>

      <Button size="lg" className="w-full" onClick={() => navigate(ROUTES.CARE_RECIPIENT)}>
        {STRINGS.welcome.continue}
      </Button>
    </div>
  );
}
