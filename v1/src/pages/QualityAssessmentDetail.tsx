import { ArrowLeft } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { papers, qaCutoffScore, qaQuestions } from '../data/mock'

const scoreForOption: Record<string, number> = { Yes: 1, Partial: 0.5, No: 0 }

function QualityAssessmentDetail() {
  const { paperId } = useParams()
  const navigate = useNavigate()
  const paper = useMemo(() => papers.find((p) => p.id === paperId), [paperId])
  const [answers, setAnswers] = useState<Record<string, string>>(paper?.qaAnswers ?? {})

  if (!paper) {
    return <p className="text-slate-400">Paper not found.</p>
  }

  const answeredValues = Object.values(answers)
  const score =
    answeredValues.length > 0
      ? answeredValues.reduce((sum, a) => sum + (scoreForOption[a] ?? 0), 0) / qaQuestions.length
      : null

  return (
    <div>
      <Link to="/quality-assessment" className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white">
        <ArrowLeft size={16} /> Back to Quality Assessment
      </Link>

      <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-xl font-bold text-white">{paper.title}</h1>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${
              score === null
                ? 'bg-white/5 text-slate-400'
                : score >= qaCutoffScore
                  ? 'bg-relis-teal/15 text-relis-teal'
                  : 'bg-relis-red/15 text-relis-red'
            }`}
          >
            {score !== null ? score.toFixed(2) : 'Pending'}
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-500">Reviewer: {paper.authors.split(',')[0]}</p>

        <div className="mt-6 space-y-4">
          {qaQuestions.map((q) => (
            <div key={q.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <p className="mb-3 text-sm font-medium text-slate-200">{q.text}</p>
              <div className="flex gap-2">
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                      answers[q.id] === opt
                        ? 'bg-relis-teal text-relis-dark'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/quality-assessment')}
          className="glow-teal mt-6 w-full rounded-lg bg-gradient-to-r from-relis-teal to-relis-blue py-2.5 text-sm font-semibold text-relis-dark"
        >
          Save assessment
        </button>
      </div>
    </div>
  )
}

export default QualityAssessmentDetail
