import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import DecisionBadge from '../components/DecisionBadge'
import ProgressBar from '../components/ProgressBar'
import { papers, screeningProgress } from '../data/mock'
import type { PaperStatus } from '../types'

const filters: Array<{ label: string; value: PaperStatus | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Included', value: 'included' },
  { label: 'Excluded', value: 'excluded' },
  { label: 'Conflict', value: 'conflict' },
]

function Screening() {
  const [status, setStatus] = useState<PaperStatus | 'all'>('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () =>
      papers.filter((p) => {
        const matchesStatus = status === 'all' || p.status === status
        const matchesQuery = p.title.toLowerCase().includes(query.toLowerCase())
        return matchesStatus && matchesQuery
      }),
    [status, query],
  )

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-white">Screening</h1>
      <p className="mt-2 text-slate-400">Include or exclude papers based on the review protocol criteria.</p>

      <div className="mt-6">
        <ProgressBar label="Screening completion" done={screeningProgress.done} total={screeningProgress.total} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title..."
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-relis-teal/60"
          />
        </div>
        <div className="flex gap-1.5">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                status === f.value ? 'bg-relis-teal text-relis-dark' : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {filtered.map((paper) => (
          <Link
            key={paper.id}
            to={`/screening/${paper.id}`}
            className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition-colors hover:border-relis-teal/40"
          >
            <div className="min-w-0">
              <p className="truncate font-semibold text-white">{paper.title}</p>
              <p className="mt-1 text-sm text-slate-500">
                {paper.authors} &middot; {paper.venue} &middot; {paper.year}
              </p>
            </div>
            <DecisionBadge status={paper.status} />
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 text-center text-slate-500">
            No papers match this filter.
          </p>
        )}
      </div>
    </div>
  )
}

export default Screening
