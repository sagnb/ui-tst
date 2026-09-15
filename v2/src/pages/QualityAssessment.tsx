import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { papers, qaCutoffScore } from '../data/mock'

function QualityAssessment() {
  const eligible = papers.filter((p) => p.status === 'included' || p.qaScore !== null)

  return (
    <div>
      <h1 className="text-2xl font-bold text-relis-navy">Quality Assessment</h1>
      <p className="mt-1 text-slate-500">Assess the methodological quality of the included studies.</p>

      <div className="mt-6 overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-relis-navy text-white">
              <th className="px-4 py-3 font-semibold">Paper</th>
              <th className="px-4 py-3 font-semibold">Score</th>
              <th className="px-4 py-3 font-semibold">Done</th>
            </tr>
          </thead>
          <tbody>
            {eligible.map((paper, i) => {
              const done = paper.qaScore !== null
              const highQuality = (paper.qaScore ?? 0) >= qaCutoffScore
              return (
                <tr key={paper.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="px-4 py-3">
                    <Link to={`/quality-assessment/${paper.id}`} className="font-medium text-relis-blue hover:underline">
                      {paper.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        !done ? 'bg-slate-100 text-slate-500' : highQuality ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {done ? paper.qaScore?.toFixed(2) : 'Not assessed'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {done ? <Check size={16} className="text-emerald-600" /> : <span className="text-slate-300">—</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default QualityAssessment
