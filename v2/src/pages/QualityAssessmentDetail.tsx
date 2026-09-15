import { ArrowLeft } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CollapsibleCard from '../components/CollapsibleCard'
import { papers, qaCutoffScore, qaQuestions } from '../data/mock'

const scoreForOption: Record<string, number> = { Yes: 1, Partial: 0.5, No: 0 }

function QualityAssessmentDetail() {
  const { paperId } = useParams()
  const navigate = useNavigate()
  const paper = useMemo(() => papers.find((p) => p.id === paperId), [paperId])
  const [answers, setAnswers] = useState<Record<string, string>>(paper?.qaAnswers ?? {})

  if (!paper) {
    return <p className="text-slate-500">Paper not found.</p>
  }

  const answeredValues = Object.values(answers)
  const score =
    answeredValues.length > 0
      ? answeredValues.reduce((sum, a) => sum + (scoreForOption[a] ?? 0), 0) / qaQuestions.length
      : null

  return (
    <div>
      <Link to="/quality-assessment" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-relis-navy">
        <ArrowLeft size={15} /> Back to Quality Assessment
      </Link>

      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-relis-navy">{paper.title}</h1>
        <span
          className={`rounded-full px-3 py-1 text-sm font-bold ${
            score === null ? 'bg-slate-100 text-slate-500' : score >= qaCutoffScore ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {score !== null ? score.toFixed(2) : 'Pending'}
        </span>
      </div>
      <p className="mb-4 text-sm text-slate-500">Reviewer: {paper.authors.split(',')[0]}</p>

      <CollapsibleCard title="Assessment questions">
        <div className="space-y-4">
          {qaQuestions.map((q) => (
            <div key={q.id} className="rounded-md border border-slate-200 p-3">
              <p className="mb-2 text-sm font-medium text-relis-navy">{q.text}</p>
              <div className="flex gap-2">
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                      answers[q.id] === opt ? 'bg-relis-blue text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
          className="mt-5 w-full rounded-md bg-relis-blue py-2.5 text-sm font-semibold text-white hover:bg-relis-navy"
        >
          Save assessment
        </button>
      </CollapsibleCard>
    </div>
  )
}

export default QualityAssessmentDetail
