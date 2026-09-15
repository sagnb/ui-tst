import { Search } from 'lucide-react'
import type { ReactNode } from 'react'

interface FilterBarProps {
  query: string
  onQueryChange: (v: string) => void
  placeholder?: string
  children?: ReactNode
}

function FilterBar({ query, onQueryChange, placeholder = 'Search...', children }: FilterBarProps) {
  return (
    <div className="mb-6 overflow-hidden rounded-lg border border-slate-200">
      <div className="border-b border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-relis-navy">
        Filters
      </div>
      <div className="flex flex-wrap items-center gap-3 bg-white p-4">
        <div className="relative min-w-[220px] flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm text-relis-navy outline-none focus:border-relis-blue"
          />
        </div>
        {children}
      </div>
    </div>
  )
}

export default FilterBar
