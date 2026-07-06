import { Shield } from 'lucide-react';
import { STRINGS } from '@/utils/constants/strings';

export default function HipaaNotice() {
  return (
    <div className="flex gap-3 rounded-xl border border-border bg-background p-4">
      <Shield className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
      <div>
        <p className="text-label font-medium text-text">{STRINGS.careRecipient.hipaaTitle}</p>
        <p className="mt-1 text-caption text-text-secondary">{STRINGS.careRecipient.hipaaText}</p>
      </div>
    </div>
  );
}
