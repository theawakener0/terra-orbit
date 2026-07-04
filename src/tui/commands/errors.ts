import { NasaApiError, RateLimitError } from "../../nasa"

export function formatError(err: unknown): string {
  if (err instanceof RateLimitError) {
    return `Rate limited — retry after ${err.retryAfter}s`
  }
  if (err instanceof NasaApiError) {
    return `API error ${err.status}: ${err.message}`
  }
  return `Error: ${(err as Error).message}`
}
