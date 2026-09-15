import { AlertTriangle, Check, ClipboardList, Eye, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import DecisionBadge from '../components/DecisionBadge'
import FilterBar from '../components/FilterBar'
import Modal from '../components/Modal'
import { exclusionCriteriaOptions, inclusionCriteriaOptions, papers as initialPapers, screeningProgress } from '../data/mock'
import type { Paper, PaperStatus } from '../types'

const statusFilters: Array<{ label: string; value: PaperStatus | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Included', value: 'included' },
  { label: 'Excluded', value: 'excluded' },
  { label: 'Conflict', value: 'conflict' },
]

function Screening() {
  const [papers, setPapers] = useState<Paper[]>(initialPapers)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<PaperStatus | 'all'>('all')
  const [activePaper, setActivePaper] = useState<Paper | null>(null)
  const [decision, setDecision] = useState<PaperStatus>('pending')
  const [inclusion, setInclusion] = useState<string[]>([])
  const [exclusion, setExclusion] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  const filtered = useMemo(
    () =>
      papers.filter((p) => {
        const matchesStatus = status === 'all' || p.status === status
        const matchesQuery = p.title.toLowerCase().includes(query.toLowerCase())
        return matchesStatus && matchesQuery
      }),
    [papers, status, query],
  )

  function openPaper(paper: Paper) {
    setActivePaper(paper)
    setDecision(paper.status)
    setInclusion(paper.inclusionCriteria)
    setExclusion(paper.exclusionCriteria)
    setNote(paper.note)
    setError('')
  }

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  function handleSave() {
    if (!activePaper) return
    if (decision === 'included' && inclusion.length === 0) {
      setError('You must select at least one inclusion criterion.')
      return
    }
    if (decision === 'excluded' && exclusion.length === 0) {
      setError('You must select an exclusion criterion.')
      return
    }
    setPapers((prev) =>
      prev.map((p) => (p.id === activePaper.id ? { ...p, status: decision, inclusionCriteria: inclusion, exclusionCriteria: exclusion, note } : p)),
    )
    setActivePaper(null)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-relis-navy">Screening</h1>
      <p className="mt-1 text-slate-500">Include or exclude papers based on the review protocol criteria.</p>

      <div className="my-5 flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 text-sm">
        <span className="text-slate-600">Screening completion</span>
        <span className="font-bold text-relis-navy">
          {screeningProgress.done} / {screeningProgress.total} &rarr; {Math.round((screeningProgress.done / screeningProgress.total) * 100)}%
        </span>
      </div>

      <FilterBar query={query} onQueryChange={setQuery} placeholder="Search by title...">
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                status === f.value ? 'bg-relis-navy text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </FilterBar>

      <div className="overflow-hidden rounded-lg border border-slate-200">
        <div className="border-b border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-relis-navy">
          Results ({filtered.length})
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-relis-navy text-white">
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Authors</th>
                <th className="px-4 py-3 font-semibold">Year</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((paper, i) => (
                <tr key={paper.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="max-w-xs truncate px-4 py-3 font-medium text-relis-navy">{paper.title}</td>
                  <td className="px-4 py-3 text-slate-500">{paper.authors}</td>
                  <td className="px-4 py-3 text-slate-500">{paper.year}</td>
                  <td className="px-4 py-3">
                    <DecisionBadge status={paper.status} />
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => openPaper(paper)} className="text-relis-blue hover:text-relis-navy">
                      <Eye size={17} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    No papers match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activePaper && (
        <Modal
          title={`Decision — ${activePaper.title}`}
          icon={ClipboardList}
          onClose={() => setActivePaper(null)}
          footer={
            <>
              <button onClick={() => setActivePaper(null)} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-relis-navy hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={handleSave} className="rounded-md bg-relis-blue px-4 py-2 text-sm font-semibold text-white hover:bg-relis-navy">
                Save decision
              </button>
            </>
          }
        >
          <p className="mb-4 text-sm text-slate-600">{activePaper.abstract}</p>

          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setDecision('included')}
              className={`flex-1 rounded-md py-2 text-sm font-semibold transition-colors ${
                decision === 'included' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Check size={15} className="mr-1.5 inline" /> Include
            </button>
            <button
              onClick={() => setDecision('excluded')}
              className={`flex-1 rounded-md py-2 text-sm font-semibold transition-colors ${
                decision === 'excluded' ? 'bg-relis-red text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <X size={15} className="mr-1.5 inline" /> Exclude
            </button>
          </div>

          {decision === 'included' && (
            <div className="mb-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Inclusion criteria</p>
              <div className="space-y-1.5">
                {inclusionCriteriaOptions.map((c) => (
                  <label key={c} className="flex cursor-pointer items-start gap-2 text-sm text-slate-700">
                    <input type="checkbox" checked={inclusion.includes(c)} onChange={() => toggle(inclusion, setInclusion, c)} className="mt-0.5 accent-relis-blue" />
                    {c}
                  </label>
                ))}
              </div>
            </div>
          )}

          {decision === 'excluded' && (
            <div className="mb-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Exclusion criteria</p>
              <div className="space-y-1.5">
                {exclusionCriteriaOptions.map((c) => (
                  <label key={c} className="flex cursor-pointer items-start gap-2 text-sm text-slate-700">
                    <input type="checkbox" checked={exclusion.includes(c)} onChange={() => toggle(exclusion, setExclusion, c)} className="mt-0.5 accent-relis-red" />
                    {c}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Note</p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-md border border-slate-300 p-2.5 text-sm text-relis-navy outline-none focus:border-relis-blue"
              placeholder="Assignment note..."
            />
          </div>

          {error && (
            <div className="mt-3 flex items-start gap-2 rounded-md bg-red-50 p-3 text-sm text-relis-red">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}

export default Screening
