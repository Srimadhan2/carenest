import { useNavigate } from 'react-router-dom';
import { Heart, Shield, Notebook } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/utils/constants/routes';
import { STRINGS } from '@/utils/constants/strings';

export default function Welcome() {
  const navigate = useNavigate();

  const benefits = [
    { icon: Notebook, text: STRINGS.welcome.benefit1 },
    { icon: Shield, text: STRINGS.welcome.benefit2 },
    { icon: Heart, text: STRINGS.welcome.benefit3 },
  ];

  return (
    <div>
      <h1 className="mb-3 text-title font-semibold text-text">{STRINGS.welcome.title}</h1>
      <p className="mb-8 text-body text-text-secondary">{STRINGS.welcome.subtitle}</p>

      <ul className="mb-10 flex flex-col gap-4">
        {benefits.map(({ icon: Icon, text }) => (
          <li
            key={text}
            className="flex items-center gap-4 rounded-xl bg-surface p-4 border border-border"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <span className="text-body text-text">{text}</span>
          </li>
        ))}
      </ul>

      <Button size="lg" className="w-full" onClick={() => navigate(ROUTES.CARE_RECIPIENT)}>
        {STRINGS.welcome.continue}
      </Button>
    </div>
  );
}
