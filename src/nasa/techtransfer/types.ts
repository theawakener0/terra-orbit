export interface PatentResult {
  id: string
  title: string
  abstract: string
  patentNumber: string
  status: string
}

export interface SoftwareResult {
  id: string
  title: string
  abstract: string
  softwareNumber: string
}

export interface SpinoffResult {
  id: string
  title: string
  abstract: string
}

export interface TechtransferResponse<T> {
  results: T[]
  count: number
  total: number
}
