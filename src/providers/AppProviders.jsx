import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { CareProvider } from '@/contexts/CareContext';
import { UIProvider } from '@/contexts/UIContext';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ToastContainer } from '@/components/ui/Toast';
import { useUIContext } from '@/contexts/UIContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

function ToastLayer({ children }) {
  const { toasts, dismissToast } = useUIContext();
  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}

export function AppProviders({ children }) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CareProvider>
            <UIProvider>
              <ToastLayer>{children}</ToastLayer>
            </UIProvider>
          </CareProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
