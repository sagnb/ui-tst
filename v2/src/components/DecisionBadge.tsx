import type { PaperStatus } from '../types'

const styles: Record<PaperStatus, string> = {
  included: 'bg-emerald-100 text-emerald-700',
  excluded: 'bg-red-100 text-red-700',
  conflict: 'bg-amber-100 text-amber-700',
  pending: 'bg-blue-100 text-blue-700',
}

const labels: Record<PaperStatus, string> = {
  included: 'Included',
  excluded: 'Excluded',
  conflict: 'Conflict',
  pending: 'Pending',
}

function DecisionBadge({ status }: { status: PaperStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

export default DecisionBadge
