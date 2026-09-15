import {
  BarChart3,
  ClipboardList,
  FileSpreadsheet,
  FileStack,
  ShieldCheck,
  UserCheck,
  XCircle,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import StatTile from '../components/StatTile'
import { activeProject, currentUser, papers } from '../data/mock'

const iconColorMap = {
  teal: 'bg-relis-teal/15 text-relis-teal',
  blue: 'bg-relis-blue/15 text-relis-blue',
  purple: 'bg-relis-purple/15 text-relis-purple',
  orange: 'bg-relis-orange/15 text-relis-orange',
} as const

function Dashboard() {
  const total = papers.length
  const processed = papers.filter((p) => p.status !== 'pending').length
  const pending = papers.filter((p) => p.status === 'pending').length
  const excluded = papers.filter((p) => p.status === 'excluded').length

  return (
    <div>
      <p className="text-sm text-slate-400">Hello, {currentUser.name}</p>
      <h1 className="text-3xl font-bold tracking-tight text-white">{activeProject.title}</h1>
      <p className="mt-2 max-w-2xl text-slate-400">{activeProject.description}</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatTile label="All papers" value={total} icon={FileStack} color="blue" />
        <StatTile label="Processed papers" value={processed} icon={ClipboardList} color="teal" />
        <StatTile label="Pending papers" value={pending} icon={ShieldCheck} color="orange" />
        <StatTile label="Assigned to me" value={total} icon={UserCheck} color="purple" />
        <StatTile label="Excluded papers" value={excluded} icon={XCircle} color="red" />
      </div>

      <h2 className="mb-4 mt-10 text-lg font-semibold text-white">Review workflows</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { to: '/screening', label: 'Screening', desc: 'Include or exclude papers based on the protocol criteria.', icon: ClipboardList, color: 'teal' },
          { to: '/quality-assessment', label: 'Quality Assessment', desc: 'Assess the methodological quality of the included studies.', icon: ShieldCheck, color: 'blue' },
          { to: '/data-extraction', label: 'Data Extraction', desc: 'Extract structured data from each primary study.', icon: FileSpreadsheet, color: 'purple' },
          { to: '/reports', label: 'Reports', desc: 'Track statistics and the overall progress of the review.', icon: BarChart3, color: 'orange' },
        ].map(({ to, label, desc, icon: Icon, color }) => (
          <Link
            key={to}
            to={to}
            className="group flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-5 transition-all hover:-translate-y-0.5 hover:border-relis-teal/40"
          >
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconColorMap[color as keyof typeof iconColorMap]}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="font-semibold text-white">{label}</p>
              <p className="mt-1 text-sm text-slate-400">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
