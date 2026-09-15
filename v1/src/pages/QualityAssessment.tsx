import { CheckCircle2, Circle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { papers, qaCutoffScore } from '../data/mock'

function QualityAssessment() {
  const eligible = papers.filter((p) => p.status === 'included' || p.qaScore !== null)

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-white">Quality Assessment</h1>
      <p className="mt-2 text-slate-400">Assess the methodological quality of the included studies.</p>

      <div className="mt-6 space-y-3">
        {eligible.map((paper) => {
          const done = paper.qaScore !== null
          const highQuality = (paper.qaScore ?? 0) >= qaCutoffScore
          return (
            <Link
              key={paper.id}
              to={`/quality-assessment/${paper.id}`}
              className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition-colors hover:border-relis-teal/40"
            >
              <div className="flex min-w-0 items-center gap-3">
                {done ? (
                  <CheckCircle2 size={18} className="shrink-0 text-relis-teal" />
                ) : (
                  <Circle size={18} className="shrink-0 text-slate-600" />
                )}
                <p className="truncate font-medium text-white">{paper.title}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                  !done
                    ? 'bg-white/5 text-slate-400'
                    : highQuality
                      ? 'bg-relis-teal/15 text-relis-teal'
                      : 'bg-relis-red/15 text-relis-red'
                }`}
              >
                {done ? paper.qaScore?.toFixed(2) : 'Not assessed'}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default QualityAssessment
