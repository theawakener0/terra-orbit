import type { NasaBaseClient } from "../client"
import type { EonetCategoriesResponse, EonetEventsQuery, EonetEventsResponse } from "./types"

const EONET_BASE = "https://eonet.gsfc.nasa.gov/api/v3"

export function createEonetModule(client: NasaBaseClient) {
  function events(query?: EonetEventsQuery): Promise<EonetEventsResponse> {
    return client.get<EonetEventsResponse>("/events", { ...query })
  }

  function categories(): Promise<EonetCategoriesResponse> {
    return client.get<EonetCategoriesResponse>("/categories")
  }

  return { events, categories }
}

export { EONET_BASE }
