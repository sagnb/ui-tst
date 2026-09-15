import { ArrowRight, BookOpen, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen overflow-hidden bg-relis-dark">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-relis-teal/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-relis-blue/20 blur-[120px]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-16 px-6 py-16 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl text-center lg:text-left">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-relis-teal/30 bg-relis-teal/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-relis-teal">
            <Sparkles size={14} />
            Systematic Literature Review
          </span>
          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">
            Run your <span className="bg-gradient-to-r from-relis-teal to-relis-blue bg-clip-text text-transparent">systematic reviews</span> effortlessly
          </h1>
          <p className="mt-6 text-lg text-slate-400">
            ReLiS helps researchers plan, conduct, and report systematic literature reviews
            in a collaborative, traceable, and evidence-driven way.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400 lg:justify-start">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-relis-teal" /> Collaborative screening
            </div>
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-relis-blue" /> Quality assessment
            </div>
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-relis-purple" /> Data extraction
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-white">Log in</h2>
          <p className="mt-1 text-sm text-slate-400">Access your account to continue your review.</p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              navigate('/projects')
            }}
          >
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Username</label>
              <input
                type="text"
                required
                defaultValue="alice"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-relis-teal/60"
                placeholder="your username"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Password</label>
              <input
                type="password"
                required
                defaultValue="••••••••"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-relis-teal/60"
                placeholder="your password"
              />
            </div>
            <button
              type="submit"
              className="glow-teal flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-relis-teal to-relis-blue px-4 py-2.5 text-sm font-semibold text-relis-dark transition-transform hover:scale-[1.01]"
            >
              Log in
              <ArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="w-full rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5"
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
