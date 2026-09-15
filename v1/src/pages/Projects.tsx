import { ArrowRight, FolderKanban, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { currentUser, projects } from '../data/mock'

function Projects() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-relis-dark px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Hello, {currentUser.name}</p>
            <h1 className="text-3xl font-bold tracking-tight text-white">Your projects</h1>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((project) => {
            const pct = Math.round((project.papersProcessed / project.papersTotal) * 100)
            return (
              <button
                key={project.id}
                onClick={() => navigate('/dashboard')}
                className="group flex flex-col rounded-2xl border border-white/5 bg-white/[0.03] p-6 text-left transition-all hover:-translate-y-0.5 hover:border-relis-teal/40"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-relis-teal/20 to-relis-blue/20 text-relis-teal">
                    <FolderKanban size={20} />
                  </div>
                  <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-slate-400">
                    {project.role}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-white">{project.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-slate-400">{project.description}</p>

                <div className="mt-5">
                  <div className="mb-1.5 flex justify-between text-xs text-slate-400">
                    <span>
                      {project.papersProcessed} / {project.papersTotal} papers
                    </span>
                    <span className="font-semibold text-relis-teal">{pct}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-relis-teal to-relis-blue"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-1 text-sm font-medium text-relis-teal opacity-0 transition-opacity group-hover:opacity-100">
                  Enter project <ArrowRight size={14} />
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
