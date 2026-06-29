export interface ImagerySearchResponse {
  collection: {
    version: string
    href: string
    items: ImageryItem[]
    metadata: {
      total_hits: number
    }
    links: {
      rel: string
      prompt: string
      href: string
    }[]
  }
}

export interface ImageryItem {
  href: string
  data: ImageryData[]
  links: ImageryLink[]
}

export interface ImageryData {
  center: string
  title: string
  photographer: string
  keywords: string[]
  location: string
  nasa_id: string
  media_type: string
  date_created: string
  description: string
  album: string[]
  secondary_creator: string
}

export interface ImageryLink {
  href: string
  rel: string
  render: string
}

export interface ImageryAssetResponse {
  collection: {
    version: string
    href: string
    items: {
      href: string
    }[]
  }
}

export interface ImagerySearchQuery {
  q?: string
  center?: string
  description?: string
  keywords?: string
  location?: string
  media_type?: "image" | "video" | "audio"
  nasa_id?: string
  page?: number
  page_size?: number
  year_start?: string
  year_end?: string
}

export interface ImageryMetadataResponse {
  location: string
}

export interface ImageryFullMetadata {
  location: string
  avcenter: string
  description: string
  nasa_id: string
  keywords: string[]
  title: string
  date_created: string
  media_type: string
  center: string
}
