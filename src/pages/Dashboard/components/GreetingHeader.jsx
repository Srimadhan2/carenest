import { formatDate, getTimeOfDay } from '@/utils/helpers/formatAge';
import { STRINGS } from '@/utils/constants/strings';

const greetings = {
  morning: STRINGS.dashboard.greeting,
  afternoon: STRINGS.dashboard.greetingAfternoon,
  evening: STRINGS.dashboard.greetingEvening,
};

export function GreetingHeader({ name }) {
  const greeting = greetings[getTimeOfDay()];

  return (
    <header>
      <h1 className="text-hero font-semibold text-text">
        {greeting}
        {name ? `, ${name}` : ''}
      </h1>
      <p className="mt-1 text-body text-text-secondary">{formatDate(new Date().toISOString())}</p>
    </header>
  );
}
