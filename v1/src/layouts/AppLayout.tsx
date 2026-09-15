import {
  BarChart3,
  ClipboardList,
  FileSpreadsheet,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
} from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { activeProject, currentUser } from '../data/mock'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/screening', label: 'Screening', icon: ClipboardList },
  { to: '/quality-assessment', label: 'Quality Assessment', icon: ShieldCheck },
  { to: '/data-extraction', label: 'Data Extraction', icon: FileSpreadsheet },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
]

function AppLayout() {
  return (
    <div className="flex min-h-screen bg-relis-dark text-slate-100">
      <aside className="flex w-64 shrink-0 flex-col border-r border-white/5 bg-relis-panel">
        <div className="flex items-center gap-2 px-6 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-relis-teal to-relis-blue font-bold text-relis-dark">
            R
          </div>
          <span className="text-lg font-bold tracking-tight">ReLiS</span>
        </div>

        <NavLink
          to="/projects"
          className="mx-4 mb-4 flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-sm text-slate-300 transition-colors hover:border-relis-teal/40 hover:text-white"
        >
          <FolderKanban size={16} />
          <span className="truncate">{activeProject.title}</span>
        </NavLink>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'glow-teal bg-relis-teal/10 text-relis-teal'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/5 p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-relis-slate text-sm font-semibold">
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-100">{currentUser.name}</p>
              <p className="text-xs text-slate-500">{currentUser.role}</p>
            </div>
          </div>
          <NavLink
            to="/login"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-relis-red"
          >
            <LogOut size={16} />
            Log Out
          </NavLink>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-8 py-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AppLayout
