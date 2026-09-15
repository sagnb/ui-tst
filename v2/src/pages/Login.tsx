import { BookOpen, ShieldCheck, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-relis-bg">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-6 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-relis-navy font-bold text-white">
            R
          </div>
          <span className="text-lg font-bold text-relis-navy">ReLiS</span>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center">
        <div>
          <h1 className="text-3xl font-bold text-relis-navy">Systematic literature reviews</h1>
          <p className="mt-4 text-slate-600">
            ReLiS helps researchers plan, conduct, and report systematic reviews in a
            collaborative way, with traceability and decision support at every step.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-relis-teal/10 text-relis-teal">
                <BookOpen size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-relis-navy">Collaborative screening</p>
                <p className="text-xs text-slate-500">Inclusion and exclusion of papers by multiple reviewers.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-relis-blue/10 text-relis-blue">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-relis-navy">Quality Assessment</p>
                <p className="text-xs text-slate-500">Assessment of the methodological quality of the studies.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-relis-purple/10 text-relis-purple">
                <Users size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-relis-navy">Teamwork</p>
                <p className="text-xs text-slate-500">Track the progress of the whole review team.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-relis-navy">Log in</h2>
          <p className="mt-1 text-sm text-slate-500">Access your account to continue your review.</p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              navigate('/projects')
            }}
          >
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">Username</label>
              <input
                type="text"
                required
                defaultValue="alice"
                className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-relis-navy outline-none focus:border-relis-blue"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">Password</label>
              <input
                type="password"
                required
                defaultValue="••••••••"
                className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-relis-navy outline-none focus:border-relis-blue"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-relis-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-relis-navy"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm font-medium text-relis-navy hover:bg-slate-50"
            >
              Log in as demo user
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
