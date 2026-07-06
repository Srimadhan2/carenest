import { NavLink } from 'react-router-dom';
import { House, FileText, User } from 'lucide-react';
import { ROUTES } from '@/utils/constants/routes';
import { STRINGS } from '@/utils/constants/strings';
import { cn } from '@/utils/helpers/cn';

const items = [
  { to: ROUTES.DASHBOARD, label: STRINGS.nav.dashboard, icon: House },
  { to: ROUTES.NOTES, label: STRINGS.nav.notes, icon: FileText },
  { to: ROUTES.PROFILE, label: STRINGS.nav.profile, icon: User },
];

export function TabBar() {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex min-h-[56px] flex-col items-center justify-center gap-1 text-caption font-medium transition-colors',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                  isActive ? 'text-primary' : 'text-text-secondary',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="h-6 w-6" aria-hidden="true" strokeWidth={isActive ? 2.4 : 2} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
