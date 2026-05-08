import Link from "next/link";
import { FolderKanban, LayoutDashboard, PanelLeft, Users } from "lucide-react";
import { ReactNode } from "react";

import { SidebarLink } from "./studio-ui";

const navItems = [
  {
    href: "/app",
    label: "Visão geral",
    icon: LayoutDashboard,
  },
  {
    href: "/app/tenants",
    label: "Tenants",
    icon: Users,
  },
];

export function DashboardShell({
  currentPath,
  children,
}: {
  currentPath: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--card-strong)] p-6 shadow-[0_24px_64px_rgba(24,24,27,0.08)] backdrop-blur">
          <Link href="/app" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--foreground)] text-white">
              <PanelLeft className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                Dashboard
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-2xl">
                Trevvos Studio
              </h1>
            </div>
          </Link>

          <nav className="mt-10 flex flex-col gap-3">
            {navItems.map(({ href, label, icon: Icon }) => (
              <SidebarLink
                key={href}
                href={href}
                label={
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {label}
                  </span>
                }
                active={
                  currentPath === href ||
                  (href !== "/app" && currentPath.startsWith(href))
                }
              />
            ))}
          </nav>

          <div className="mt-10 rounded-[1.75rem] bg-[#201a17] p-5 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                <FolderKanban className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-white/50">
                  Preview Concierge MVP
                </p>
                <p className="mt-1 text-lg font-semibold">
                  Texto, specs e assets em uma única visão.
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-white/70">
              Modo dev/admin temporário para validar o fluxo operacional do Studio
              sem autenticação real.
            </p>
          </div>
        </aside>

        <div>{children}</div>
      </div>
    </main>
  );
}
