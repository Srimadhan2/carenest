import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, LogOut } from 'lucide-react';
import { ROUTES } from '@/utils/constants/routes';
import { STRINGS } from '@/utils/constants/strings';
import { cn } from '@/utils/helpers/cn';
import { Logo } from '@/components/ui/Logo';

const navItems = [
  { to: ROUTES.DASHBOARD, label: STRINGS.nav.dashboard, icon: LayoutDashboard },
  { to: ROUTES.NOTES, label: STRINGS.nav.notes, icon: FileText },
];

export function Sidebar({ onSignOut, collapsed = false }) {
  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-border bg-surface',
        collapsed ? 'w-16' : 'w-64',
      )}
      aria-label="Main navigation"
    >
      <div className="border-b border-border p-6">
        {!collapsed && <Logo size="sm" />}
        {collapsed && (
          <div className="flex justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white">
              C
            </div>
          </div>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex min-h-11 items-center gap-3 rounded-xl px-4 text-label font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:bg-background hover:text-text',
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {onSignOut && (
        <div className="border-t border-border p-4">
          <button
            type="button"
            onClick={onSignOut}
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-4 text-label text-text-secondary hover:bg-background hover:text-text"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
            {!collapsed && <span>{STRINGS.auth.signOut}</span>}
          </button>
        </div>
      )}
    </aside>
  );
}
