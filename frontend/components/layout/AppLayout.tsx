'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { getUser, logout } from '@/lib/auth';
import type { User } from '@/types';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.replace('/login');
      return;
    }

    setUser(currentUser);
    setChecking(false);
  }, [router]);

  function handleLogout() {
    logout();
    router.replace('/login');
  }

  if (checking) {
    return <main className="grid min-h-screen place-items-center text-sm font-bold text-[#315451]">Checking session...</main>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen md:flex">
      <Sidebar email={user.email} onLogout={handleLogout} />
      <main className="min-w-0 flex-1 px-4 py-6 md:px-8 lg:px-10">{children}</main>
    </div>
  );
}
