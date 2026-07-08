import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/navigation/Sidebar';
import { TabBar } from '@/components/navigation/TabBar';
import { AvatarMenu } from '@/components/navigation/AvatarMenu';

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 pt-6 md:px-8 md:pb-10">
        <div className="mb-4 flex justify-end">
          <AvatarMenu />
        </div>
        <Outlet />
      </main>
      <TabBar />
    </div>
  );
}
