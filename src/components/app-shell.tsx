'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardCheck, FolderKanban, Home, PlusCircle, Settings, Workflow } from 'lucide-react';
import { ProjectStoreProvider } from '@/context/project-store';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/new', label: 'New App', icon: PlusCircle },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/tasks', label: 'Task Board', icon: ClipboardCheck },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ProjectStoreProvider>
      <div className="min-h-screen bg-zinc-100 text-zinc-950">
        <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-zinc-200 bg-white lg:block">
          <div className="flex h-full flex-col">
            <div className="border-b border-zinc-200 px-6 py-5">
              <Link href="/" className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-zinc-950 text-white">
                  <Workflow className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold uppercase tracking-wide text-zinc-500">
                    Josh&apos;s
                  </span>
                  <span className="block text-lg font-semibold">AppFactory</span>
                </span>
              </Link>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
              {navItems.map(item => {
                const Icon = item.icon;
                const active =
                  item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                      active
                        ? 'bg-zinc-950 text-white'
                        : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-zinc-200 p-4 text-xs leading-5 text-zinc-500">
              Local-first MVP. No live OpenAI, GitHub, or Vercel calls.
            </div>
          </div>
        </aside>
        <div className="lg:pl-72">
          <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Workflow className="h-5 w-5" />
                AppFactory
              </Link>
              <Link
                href="/new"
                className="rounded-md bg-zinc-950 px-3 py-2 text-sm font-medium text-white"
              >
                New
              </Link>
            </div>
            <nav className="flex gap-1 overflow-x-auto px-2 pb-2">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap rounded-md px-3 py-2 text-xs font-medium ${
                    pathname === item.href ? 'bg-zinc-950 text-white' : 'text-zinc-600'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </header>
          <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </ProjectStoreProvider>
  );
}
