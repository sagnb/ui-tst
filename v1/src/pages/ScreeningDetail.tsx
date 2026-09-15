import { AlertTriangle, ArrowLeft, Check, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DecisionBadge from '../components/DecisionBadge'
import { exclusionCriteriaOptions, inclusionCriteriaOptions, papers } from '../data/mock'
import type { PaperStatus } from '../types'

function ScreeningDetail() {
  const { paperId } = useParams()
  const navigate = useNavigate()
  const paper = useMemo(() => papers.find((p) => p.id === paperId), [paperId])

  const [decision, setDecision] = useState<PaperStatus>(paper?.status ?? 'pending')
  const [inclusion, setInclusion] = useState<string[]>(paper?.inclusionCriteria ?? [])
  const [exclusion, setExclusion] = useState<string[]>(paper?.exclusionCriteria ?? [])
  const [note, setNote] = useState(paper?.note ?? '')
  const [error, setError] = useState('')

  if (!paper) {
    return <p className="text-slate-400">Paper not found.</p>
  }

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  function handleSave() {
    if (decision === 'included' && inclusion.length === 0) {
      setError('You must select at least one inclusion criterion.')
      return
    }
    if (decision === 'excluded' && exclusion.length === 0) {
      setError('You must select an exclusion criterion.')
      return
    }
    setError('')
    navigate('/screening')
  }

  return (
    <div>
      <Link to="/screening" className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white">
        <ArrowLeft size={16} /> Back to Screening
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
          <div className="mb-3 flex items-start justify-between gap-4">
            <h1 className="text-xl font-bold text-white">Paper: {paper.title}</h1>
            <DecisionBadge status={paper.status} />
          </div>
          <p className="text-sm text-slate-500">
            {paper.authors} &middot; {paper.venue} &middot; {paper.year}
          </p>

          <h2 className="mb-2 mt-6 text-sm font-semibold uppercase tracking-wide text-slate-400">Abstract</h2>
          <p className="text-sm leading-relaxed text-slate-300">{paper.abstract}</p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
          <h2 className="text-lg font-bold text-white">Decision</h2>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setDecision('included')}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
                decision === 'included' ? 'bg-relis-teal text-relis-dark' : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <Check size={16} className="mr-1.5 inline" /> Include
            </button>
            <button
              onClick={() => setDecision('excluded')}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
                decision === 'excluded' ? 'bg-relis-red text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <X size={16} className="mr-1.5 inline" /> Exclude
            </button>
          </div>

          {decision === 'included' && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Inclusion criteria</p>
              <div className="space-y-2">
                {inclusionCriteriaOptions.map((c) => (
                  <label key={c} className="flex cursor-pointer items-start gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={inclusion.includes(c)}
                      onChange={() => toggle(inclusion, setInclusion, c)}
                      className="mt-0.5 accent-relis-teal"
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>
          )}

          {decision === 'excluded' && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Exclusion criteria</p>
              <div className="space-y-2">
                {exclusionCriteriaOptions.map((c) => (
                  <label key={c} className="flex cursor-pointer items-start gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={exclusion.includes(c)}
                      onChange={() => toggle(exclusion, setExclusion, c)}
                      className="mt-0.5 accent-relis-red"
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Note</p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white outline-none focus:border-relis-teal/60"
              placeholder="Assignment note..."
            />
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-relis-red/30 bg-relis-red/10 p-3 text-sm text-relis-red">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <button
            onClick={handleSave}
            className="glow-teal mt-5 w-full rounded-lg bg-gradient-to-r from-relis-teal to-relis-blue py-2.5 text-sm font-semibold text-relis-dark"
          >
            Save and Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default ScreeningDetail
