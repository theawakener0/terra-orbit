import type { DateString } from "../types"

export interface ApodResponse {
  copyright?: string
  date: string
  explanation: string
  hdurl?: string
  media_type: "image" | "video"
  service_version: string
  title: string
  url: string
  thumbnail_url?: string
}

export interface ApodQueryParams {
  date?: DateString
  start_date?: DateString
  end_date?: DateString
  count?: number
  thumbs?: boolean
}
