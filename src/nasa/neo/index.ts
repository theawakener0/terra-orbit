import type { NasaBaseClient } from "../client"
import type { NeoBrowseResponse, NeoFeedResponse, NeoLookupResponse, NeoQueryParams } from "./types"

export function createNeoModule(client: NasaBaseClient) {
  function feed(params?: NeoQueryParams): Promise<NeoFeedResponse> {
    return client.get<NeoFeedResponse>("/neo/rest/v1/feed", { ...params })
  }

  function lookup(asteroidId: string): Promise<NeoLookupResponse> {
    return client.get<NeoLookupResponse>(`/neo/rest/v1/neo/${asteroidId}`)
  }

  function browse(page?: number): Promise<NeoBrowseResponse> {
    return client.get<NeoBrowseResponse>("/neo/rest/v1/neo/browse", { page })
  }

  return { feed, lookup, browse }
}
