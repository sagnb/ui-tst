import { ChevronDown, LogOut, User } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { activeProject, currentUser } from '../data/mock'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/screening', label: 'Screening' },
  { to: '/quality-assessment', label: 'Quality Assessment' },
  { to: '/data-extraction', label: 'Data Extraction' },
  { to: '/reports', label: 'Reports' },
]

function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-relis-bg">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-8 px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-relis-navy font-bold text-white">
              R
            </div>
            <span className="text-lg font-bold text-relis-navy">ReLiS</span>
          </div>

          <nav className="flex flex-1 items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `border-b-2 px-3 py-5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-relis-blue text-relis-navy'
                      : 'border-transparent text-slate-500 hover:text-relis-navy'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-relis-navy hover:bg-slate-100"
            >
              <span className="hidden text-slate-500 sm:inline">{activeProject.title}</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-relis-blue text-xs font-semibold text-white">
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <ChevronDown size={14} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                <div className="border-b border-slate-100 px-3 py-2">
                  <p className="text-sm font-medium text-relis-navy">{currentUser.name}</p>
                  <p className="text-xs text-slate-500">{currentUser.role}</p>
                </div>
                <NavLink to="/projects" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                  <User size={14} /> Switch project
                </NavLink>
                <NavLink to="/login" className="flex items-center gap-2 px-3 py-2 text-sm text-relis-red hover:bg-slate-50">
                  <LogOut size={14} /> Log Out
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
