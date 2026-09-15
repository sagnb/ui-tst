export type PaperStatus = 'pending' | 'included' | 'excluded' | 'conflict'

export interface Paper {
  id: string
  title: string
  authors: string
  year: number
  venue: string
  abstract: string
  status: PaperStatus
  inclusionCriteria: string[]
  exclusionCriteria: string[]
  note: string
  qaScore: number | null
  qaAnswers: Record<string, string>
}

export interface Project {
  id: string
  title: string
  description: string
  role: string
  papersTotal: number
  papersProcessed: number
}

export interface QaQuestion {
  id: string
  text: string
  options: string[]
}

export type ExtractionFieldType =
  | 'text'
  | 'textarea'
  | 'date'
  | 'select'
  | 'multiselect'
  | 'checkbox'

export interface ExtractionField {
  id: string
  label: string
  type: ExtractionFieldType
  options?: string[]
}

export interface ExtractionRecord {
  paperId: string
  paperTitle: string
  values: Record<string, string>
}

export interface ReportBucket {
  label: string
  count: number
  colorToken: string
}
