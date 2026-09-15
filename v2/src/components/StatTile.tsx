import type { LucideIcon } from 'lucide-react'

const colorMap = {
  teal: 'bg-relis-teal/10 text-relis-teal',
  blue: 'bg-relis-blue/10 text-relis-blue',
  red: 'bg-relis-red/10 text-relis-red',
  orange: 'bg-relis-orange/10 text-relis-orange',
  purple: 'bg-relis-purple/10 text-relis-purple',
} as const

interface StatTileProps {
  label: string
  value: number | string
  icon: LucideIcon
  color?: keyof typeof colorMap
}

function StatTile({ label, value, icon: Icon, color = 'teal' }: StatTileProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${colorMap[color]}`}>
        <Icon size={20} />
      </div>
      <p className="text-2xl font-bold text-relis-navy">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  )
}

export default StatTile
