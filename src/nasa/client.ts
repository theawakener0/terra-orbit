import { NasaApiError, RateLimitError } from "./errors"
import { toQueryString } from "./utils"

export interface ClientOptions {
  baseUrl?: string
  apiKey?: string
  timeout?: number
}

export class NasaBaseClient {
  private baseUrl: string
  private apiKey?: string
  private timeout: number

  constructor(opts: ClientOptions) {
    this.baseUrl = opts.baseUrl?.replace(/\/+$/, "") ?? "https://api.nasa.gov"
    this.apiKey = opts.apiKey
    this.timeout = opts.timeout ?? 30_000
  }

  async get<T>(
    path: string,
    params: Record<string, unknown> = {},
    opts?: { noAuth?: boolean },
  ): Promise<T> {
    const merged = opts?.noAuth ? { ...params } : { ...params, api_key: this.apiKey }
    const query = toQueryString(merged)
    const url = `${this.baseUrl}${path}${query}`

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, { signal: controller.signal })

      if (!response.ok) {
        if (response.status === 429) {
          const retryAfter = Number(response.headers.get("Retry-After")) || 60
          throw new RateLimitError(
            `Rate limit exceeded. Retry after ${retryAfter}s`,
            retryAfter,
          )
        }

        const body = await response.text().catch(() => "")
        throw new NasaApiError(
          `NASA API error ${response.status}: ${body || response.statusText}`,
          response.status,
        )
      }

      return (await response.json()) as T
    } catch (err) {
      if (err instanceof NasaApiError || err instanceof RateLimitError) {
        throw err
      }
      if (err instanceof DOMException && err.name === "AbortError") {
        throw new NasaApiError("Request timed out", 408)
      }
      throw new NasaApiError(
        err instanceof Error ? err.message : "Unknown fetch error",
        0,
      )
    } finally {
      clearTimeout(timer)
    }
  }
}
