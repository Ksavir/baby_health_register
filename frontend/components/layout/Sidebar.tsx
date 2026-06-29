'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Baby, ClipboardList, Gauge, LogOut, Receipt, ShieldCheck, Syringe } from 'lucide-react';
import { classNames } from '@/lib/utils';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: Gauge },
  { href: '/babies', label: 'Babies', icon: Baby },
  { href: '/consultations', label: 'Consultations', icon: ClipboardList },
  { href: '/vaccines', label: 'Vaccines', icon: Syringe },
  { href: '/costs', label: 'Costs', icon: Receipt },
];

export function Sidebar({ email, onLogout }: { email: string; onLogout: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex min-h-screen w-full flex-col border-r border-[#d9e4de] bg-[#f7fbf6]/90 px-4 py-5 backdrop-blur md:w-72">
      <Link href="/dashboard" className="mb-8 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-md bg-[#0f3d3e] text-white">
          <ShieldCheck size={23} />
        </span>
        <span>
          <span className="block font-display text-xl font-black leading-none text-[#102f2f]">Koral</span>
          <span className="block text-xs font-black uppercase tracking-[0.16em] text-[#c56545]">Health record</span>
        </span>
      </Link>

      <nav className="grid gap-2">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={classNames(
                'flex h-11 items-center gap-3 rounded-md px-3 text-sm font-extrabold transition',
                active ? 'bg-[#0f3d3e] text-white shadow-ink' : 'text-[#315451] hover:bg-[#e8f1ec]'
              )}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-lg border border-[#d9e4de] bg-white p-3">
        <p className="truncate text-sm font-bold text-[#102f2f]">{email}</p>
        <button
          type="button"
          onClick={onLogout}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-[#cad7d2] px-3 py-2 text-sm font-black text-[#a6362f] transition hover:bg-[#fff4f2]"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
