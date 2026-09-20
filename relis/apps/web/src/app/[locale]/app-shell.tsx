"use client";

import {
  BarChart3,
  ClipboardList,
  FileSpreadsheet,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { Dictionary, Locale } from "@/i18n/get-dictionary";
import { mockActiveProject, mockCurrentUser } from "@/shared/lib/mock-dashboard-data";
import { publicConfig } from "@/shared/lib/public-config";

interface NavItem {
  segment: string | null;
  label: string;
  icon: LucideIcon;
}

interface AppShellProps {
  locale: Locale;
  dictionary: Dictionary;
  children: ReactNode;
}

export function AppShell({ locale, dictionary, children }: AppShellProps) {
  const pathname = usePathname();
  const projectBase = `/${locale}/projects/${mockActiveProject.id}`;

  const navItems: NavItem[] = [
    { segment: null, label: dictionary.layout.nav.dashboard, icon: LayoutDashboard },
    { segment: "screening", label: dictionary.layout.nav.screening, icon: ClipboardList },
    { segment: "quality-assessment", label: dictionary.layout.nav.qualityAssessment, icon: ShieldCheck },
    { segment: "data-extraction", label: dictionary.layout.nav.dataExtraction, icon: FileSpreadsheet },
    { segment: "reporting", label: dictionary.layout.nav.reporting, icon: BarChart3 },
  ];

  const homeHref = `/${locale}`;

  return (
    <div className="flex min-h-screen bg-relis-dark text-slate-100">
      <aside className="flex w-64 shrink-0 flex-col border-r border-white/5 bg-relis-panel">
        <div className="flex items-center gap-2 px-6 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-relis-teal to-relis-blue font-bold text-relis-dark">
            R
          </div>
          <span className="text-lg font-bold tracking-tight">{dictionary.layout.appName}</span>
        </div>

        <Link
          href={projectBase}
          className="mx-4 mb-4 flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-sm text-slate-300 transition-colors hover:border-relis-teal/40 hover:text-white"
        >
          <FolderKanban size={16} />
          <span className="truncate">{mockActiveProject.title}</span>
        </Link>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {navItems.map(({ segment, label, icon: Icon }) => {
            const href = segment ? `${projectBase}/${segment}` : homeHref;
            const isActive = segment === null ? pathname === homeHref : pathname.startsWith(href);
            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "glow-teal bg-relis-teal/10 text-relis-teal"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/5 p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-relis-slate text-sm font-semibold">
              {mockCurrentUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-100">{mockCurrentUser.name}</p>
              <p className="text-xs text-slate-500">{mockCurrentUser.role}</p>
            </div>
          </div>
          <Link
            href={`/${locale}/login`}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-relis-red"
          >
            <LogOut size={16} />
            {dictionary.layout.logOut}
          </Link>
        </div>

        {/* Hidden diagnostics node: proves NEXT_PUBLIC_API_URL was inlined
            into the client bundle at build time (see public-config.build.test.ts). */}
        <span data-testid="public-api-base-url" hidden>
          {publicConfig.NEXT_PUBLIC_API_URL}
        </span>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
