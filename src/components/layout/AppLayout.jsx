import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/navigation/Sidebar';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCareContext } from '@/contexts/CareContext';
import { useUIContext } from '@/contexts/UIContext';
import { ROUTES } from '@/utils/constants/routes';

export function AppLayout() {
  const navigate = useNavigate();
  const { signOut } = useAuthContext();
  const { resetCare } = useCareContext();
  const { sidebarCollapsed } = useUIContext();

  const handleSignOut = async () => {
    await signOut();
    resetCare();
    navigate(ROUTES.HOME);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar onSignOut={handleSignOut} collapsed={sidebarCollapsed} />
      <main className="flex flex-1 flex-col overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
