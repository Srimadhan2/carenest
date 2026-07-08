import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, User } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCareContext } from '@/contexts/CareContext';
import { useSignOut } from '@/hooks/useSignOut';
import { ROUTES } from '@/utils/constants/routes';
import { STRINGS } from '@/utils/constants/strings';
import { cn } from '@/utils/helpers/cn';

function getInitials(profile, user) {
  const first = profile?.firstName?.trim();
  const last = profile?.lastName?.trim();
  if (first || last) {
    return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();
  }
  const email = profile?.email || user?.email || '';
  return email ? email[0].toUpperCase() : '?';
}

/**
 * Top-right account avatar for the authenticated app. Opens a small menu with
 * Profile, Settings, and a destructive Sign Out. Closes on outside click / Escape.
 */
export function AvatarMenu() {
  const navigate = useNavigate();
  const signOut = useSignOut();
  const { user } = useAuthContext();
  const { profile } = useCareContext();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const m = STRINGS.menu;

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    function handlePointerDown(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const items = [
    {
      icon: User,
      label: m.profile,
      onClick: () => {
        setOpen(false);
        navigate(ROUTES.PROFILE);
      },
    },
    {
      icon: Settings,
      label: m.settings,
      onClick: () => {
        setOpen(false);
        navigate(ROUTES.PROFILE_EDIT);
      },
    },
    {
      icon: LogOut,
      label: m.signOut,
      destructive: true,
      onClick: () => {
        setOpen(false);
        signOut();
      },
    },
  ];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={m.open}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-label font-semibold text-primary',
          'transition-colors hover:bg-primary/20',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        )}
      >
        {getInitials(profile, user)}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-border bg-surface shadow-lg"
        >
          {items.map(({ icon: Icon, label, onClick, destructive }) => (
            <button
              key={label}
              type="button"
              role="menuitem"
              onClick={onClick}
              className={cn(
                'flex w-full items-center gap-3 px-4 py-3 text-left text-body transition-colors hover:bg-background',
                'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary',
                destructive ? 'font-medium text-danger' : 'text-text',
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5 shrink-0',
                  destructive ? 'text-danger' : 'text-text-secondary',
                )}
                aria-hidden="true"
              />
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
