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
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
      <h3 className="mb-4 text-sm font-semibold text-slate-200">{title}</h3>
      <div className="space-y-3">
        {buckets.map((b) => (
          <div key={b.label}>
            <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
              <span>{b.label}</span>
              <span className="font-medium text-slate-200">{b.count}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className={`h-full rounded-full ${colorMap[b.colorToken] ?? 'bg-relis-teal'}`}
                style={{ width: `${(b.count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-slate-500">Total: {total}</p>
    </div>
  )
}

export default MiniChart
