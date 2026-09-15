import MiniChart from '../components/MiniChart'
import { exclusionCriteriaStats, extractionReport, qaReport, screeningReport } from '../data/mock'

function Reports() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-white">Reports</h1>
      <p className="mt-2 text-slate-400">Track statistics and overall progress of the review.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <MiniChart title="Screening decisions" buckets={screeningReport} />
        <MiniChart title="Quality assessment score" buckets={qaReport} />
        <MiniChart title="ML techniques (data extraction)" buckets={extractionReport} />
        <MiniChart title="Statistics on exclusion criteria" buckets={exclusionCriteriaStats} />
      </div>
    </div>
  )
}

export default Reports
