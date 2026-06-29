import type { NasaBaseClient } from "../client"
import type { ImageryAssetResponse, ImageryMetadataResponse, ImagerySearchQuery, ImagerySearchResponse } from "./types"

const IMAGERY_BASE = "https://images-api.nasa.gov"

export function createImageryModule(client: NasaBaseClient) {
  function search(query: ImagerySearchQuery): Promise<ImagerySearchResponse> {
    return client.get<ImagerySearchResponse>("/search", { ...query }, { noAuth: true })
  }

  function asset(nasaId: string): Promise<ImageryAssetResponse> {
    return client.get<ImageryAssetResponse>(`/asset/${encodeURIComponent(nasaId)}`, {}, { noAuth: true })
  }

  function metadata(nasaId: string): Promise<ImageryMetadataResponse> {
    return client.get<ImageryMetadataResponse>(`/metadata/${encodeURIComponent(nasaId)}`, {}, { noAuth: true })
  }

  function captions(nasaId: string): Promise<string> {
    return client.get<string>(`/captions/${encodeURIComponent(nasaId)}`, {}, { noAuth: true })
  }

  return { search, asset, metadata, captions }
}

export { IMAGERY_BASE }
