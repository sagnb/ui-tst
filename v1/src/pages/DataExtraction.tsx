import { useState } from 'react'
import { extractionFields, extractionRecords, papers } from '../data/mock'
import type { ExtractionField } from '../types'

function FieldInput({ field, value, onChange }: { field: ExtractionField; value: string; onChange: (v: string) => void }) {
  const baseClass =
    'w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-relis-teal/60'

  switch (field.type) {
    case 'textarea':
      return <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={`${baseClass} resize-none`} />
    case 'date':
      return <input type="date" value={value} onChange={(e) => onChange(e.target.value)} className={baseClass} />
    case 'select':
      return (
        <select value={value} onChange={(e) => onChange(e.target.value)} className={baseClass}>
          <option value="">Select...</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )
    case 'multiselect':
      return (
        <select multiple value={value ? value.split(',') : []} onChange={(e) => onChange(Array.from(e.target.selectedOptions, (o) => o.value).join(','))} className={`${baseClass} h-24`}>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )
    case 'checkbox':
      return (
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" checked={value === 'true'} onChange={(e) => onChange(String(e.target.checked))} className="accent-relis-teal" />
          Yes
        </label>
      )
    default:
      return <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={baseClass} />
  }
}

function DataExtraction() {
  const [selectedPaper, setSelectedPaper] = useState(papers[2].id)
  const [values, setValues] = useState<Record<string, string>>({})

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-white">Data Extraction</h1>
      <p className="mt-2 text-slate-400">Extract structured data from each primary study.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">Paper</label>
          <select
            value={selectedPaper}
            onChange={(e) => setSelectedPaper(e.target.value)}
            className="mb-6 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-relis-teal/60"
          >
            {papers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>

          <div className="space-y-4">
            {extractionFields.map((field) => (
              <div key={field.id}>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">{field.label}</label>
                <FieldInput
                  field={field}
                  value={values[field.id] ?? ''}
                  onChange={(v) => setValues((prev) => ({ ...prev, [field.id]: v }))}
                />
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-2">
            <button onClick={() => setValues({})} className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5">
              Reset
            </button>
            <button className="glow-teal flex-1 rounded-lg bg-gradient-to-r from-relis-teal to-relis-blue py-2.5 text-sm font-semibold text-relis-dark">
              Submit
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">Extracted records</h2>
          <div className="space-y-4">
            {extractionRecords.map((record) => (
              <div key={record.paperId} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <p className="mb-2 text-sm font-semibold text-white">{record.paperTitle}</p>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  {extractionFields.map((field) => (
                    <div key={field.id} className="contents">
                      <dt className="text-slate-500">{field.label}</dt>
                      <dd className="truncate text-slate-300">{record.values[field.id] ?? '-'}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataExtraction
