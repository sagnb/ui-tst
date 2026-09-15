import { FolderKanban, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { currentUser, projects } from '../data/mock'

function Projects() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-relis-bg">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-relis-navy font-bold text-white">
              R
            </div>
            <span className="text-lg font-bold text-relis-navy">ReLiS</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-relis-navy hover:bg-slate-50"
          >
            <LogOut size={15} /> Log Out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-sm text-slate-500">Hello, {currentUser.name}</p>
        <h1 className="text-2xl font-bold text-relis-navy">Your projects</h1>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {projects.map((project) => {
            const pct = Math.round((project.papersProcessed / project.papersTotal) * 100)
            return (
              <button
                key={project.id}
                onClick={() => navigate('/dashboard')}
                className="flex flex-col rounded-lg border border-slate-200 bg-white p-6 text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-relis-blue/10 text-relis-blue">
                    <FolderKanban size={18} />
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{project.role}</span>
                </div>
                <h2 className="font-semibold text-relis-navy">{project.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{project.description}</p>
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs text-slate-500">
                    <span>{project.papersProcessed} / {project.papersTotal} papers</span>
                    <span className="font-semibold text-relis-blue">{pct}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-relis-blue" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Projects
