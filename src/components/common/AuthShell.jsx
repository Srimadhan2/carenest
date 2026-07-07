import { Logo } from '@/components/ui/Logo';

/**
 * Shared frame for the authentication screens: centered card, logo, heading.
 * @param {{ title: string, subtitle?: string, children: React.ReactNode, footer?: React.ReactNode }} props
 */
export function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="flex flex-col items-center gap-8 rounded-2xl bg-surface p-8 shadow-sm">
      <Logo size="lg" />
      <div className="text-center">
        <h1 className="text-title font-semibold text-text">{title}</h1>
        {subtitle && <p className="mt-3 text-body text-text-secondary">{subtitle}</p>}
      </div>
      <div className="flex w-full flex-col gap-4">{children}</div>
      {footer && <div className="text-center text-body text-text-secondary">{footer}</div>}
    </div>
  );
}
