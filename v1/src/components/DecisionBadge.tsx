import type { PaperStatus } from '../types'

const styles: Record<PaperStatus, string> = {
  included: 'bg-relis-teal/15 text-relis-teal border-relis-teal/30',
  excluded: 'bg-relis-red/15 text-relis-red border-relis-red/30',
  conflict: 'bg-relis-orange/15 text-relis-orange border-relis-orange/30',
  pending: 'bg-relis-blue/15 text-relis-blue border-relis-blue/30',
}

const labels: Record<PaperStatus, string> = {
  included: 'Included',
  excluded: 'Excluded',
  conflict: 'Conflict',
  pending: 'Pending',
}

function DecisionBadge({ status }: { status: PaperStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

export default DecisionBadge
