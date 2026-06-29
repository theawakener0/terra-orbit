export type DateString = string

export interface PaginationParams {
  page?: number
}

export interface NasaResponse<T> {
  data: T
  error?: never
}
