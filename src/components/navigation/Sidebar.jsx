import { NavLink } from 'react-router-dom';
import { House, FileText, User } from 'lucide-react';
import { ROUTES } from '@/utils/constants/routes';
import { STRINGS } from '@/utils/constants/strings';
import { cn } from '@/utils/helpers/cn';
import { Logo } from '@/components/ui/Logo';

const navItems = [
  { to: ROUTES.DASHBOARD, label: STRINGS.nav.dashboard, icon: House },
  { to: ROUTES.NOTES, label: STRINGS.nav.notes, icon: FileText },
  { to: ROUTES.PROFILE, label: STRINGS.nav.profile, icon: User },
];

export function Sidebar() {
  return (
    <aside
      className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface md:flex"
      aria-label="Primary"
    >
      <div className="border-b border-border p-6">
        <Logo size="sm" />
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex min-h-11 items-center gap-3 rounded-xl px-4 text-label font-medium transition-colors',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:bg-background hover:text-text',
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
