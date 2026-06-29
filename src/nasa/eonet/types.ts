export interface EonetEvent {
  id: string
  title: string
  description: string
  link: string
  categories: {
    id: number
    title: string
  }[]
  sources: {
    id: string
    url: string
  }[]
  geometries: {
    date: string
    type: string
    coordinates: number[]
  }[]
  closed?: string
}

export interface EonetEventsResponse {
  title: string
  description: string
  link: string
  events: EonetEvent[]
}

export interface EonetCategory {
  id: number
  title: string
  link: string
  description: string
  layers: string
}

export interface EonetCategoriesResponse {
  title: string
  description: string
  link: string
  categories: EonetCategory[]
}

export interface EonetEventsQuery {
  source?: string
  category?: number | string
  status?: "open" | "closed" | "all"
  limit?: number
  days?: number
  startDate?: string
  endDate?: string
}
