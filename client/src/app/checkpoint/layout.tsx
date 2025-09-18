"use client";

import LogoutButton from '@/components/auth/LogoutButton';
import { withAuth } from '@/components/auth/withAuth';
import WsStatus from '@/components/gate/WsStatus';

function CheckpointLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className='flex-1 p-4 md:p-6 bg-gray-50 overflow-y-auto'>
        <header className="flex items-center justify-between gap-4">
          <WsStatus />
          <LogoutButton />
        </header>
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}

export default withAuth(CheckpointLayout, { role: "employee" }); // export protected