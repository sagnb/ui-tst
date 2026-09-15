import { useState } from 'react'
import { extractionFields, extractionRecords, papers } from '../data/mock'
import type { ExtractionField } from '../types'

function FieldInput({ field, value, onChange }: { field: ExtractionField; value: string; onChange: (v: string) => void }) {
  const baseClass = 'w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-relis-navy outline-none focus:border-relis-blue'

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
        <select
          multiple
          value={value ? value.split(',') : []}
          onChange={(e) => onChange(Array.from(e.target.selectedOptions, (o) => o.value).join(','))}
          className={`${baseClass} h-24`}
        >
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )
    case 'checkbox':
      return (
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={value === 'true'} onChange={(e) => onChange(String(e.target.checked))} className="accent-relis-blue" />
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
      <h1 className="text-2xl font-bold text-relis-navy">Data Extraction</h1>
      <p className="mt-1 text-slate-500">Extract structured data from each primary study.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <div className="border-b border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-relis-navy">Form</div>
          <div className="bg-white p-5">
            <label className="mb-1.5 block text-xs font-medium text-slate-500">Paper</label>
            <select
              value={selectedPaper}
              onChange={(e) => setSelectedPaper(e.target.value)}
              className="mb-5 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-relis-navy outline-none focus:border-relis-blue"
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
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">{field.label}</label>
                  <FieldInput field={field} value={values[field.id] ?? ''} onChange={(v) => setValues((prev) => ({ ...prev, [field.id]: v }))} />
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-2">
              <button onClick={() => setValues({})} className="flex-1 rounded-md border border-slate-300 py-2.5 text-sm font-medium text-relis-navy hover:bg-slate-50">
                Reset
              </button>
              <button className="flex-1 rounded-md bg-relis-blue py-2.5 text-sm font-semibold text-white hover:bg-relis-navy">Submit</button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200">
          <div className="border-b border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-relis-navy">Extracted records</div>
          <div className="space-y-4 bg-white p-5">
            {extractionRecords.map((record) => (
              <div key={record.paperId} className="rounded-md border border-slate-200 p-4">
                <p className="mb-2 text-sm font-semibold text-relis-navy">{record.paperTitle}</p>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  {extractionFields.map((field) => (
                    <div key={field.id} className="contents">
                      <dt className="text-slate-400">{field.label}</dt>
                      <dd className="truncate text-slate-700">{record.values[field.id] ?? '-'}</dd>
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
