import type { ReportBucket } from '../types'

const colorMap: Record<string, string> = {
  teal: 'bg-relis-teal',
  blue: 'bg-relis-blue',
  red: 'bg-relis-red',
  orange: 'bg-relis-orange',
  purple: 'bg-relis-purple',
}

function MiniChart({ title, buckets }: { title: string; buckets: ReportBucket[] }) {
  const max = Math.max(1, ...buckets.map((b) => b.count))
  const total = buckets.reduce((sum, b) => sum + b.count, 0)

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-bold text-relis-navy">{title}</h3>
      <div className="space-y-3">
        {buckets.map((b) => (
          <div key={b.label} className="flex items-center gap-3 text-sm">
            <span className="w-40 shrink-0 truncate text-slate-600">{b.label}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full ${colorMap[b.colorToken] ?? 'bg-relis-blue'}`} style={{ width: `${(b.count / max) * 100}%` }} />
            </div>
            <span className="w-6 shrink-0 text-right font-semibold text-relis-navy">{b.count}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400">Total: {total}</p>
    </div>
  )
}

export default MiniChart
