export class NasaApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message)
    this.name = "NasaApiError"
  }
}

export class RateLimitError extends NasaApiError {
  constructor(
    message: string,
    public retryAfter: number,
  ) {
    super(message, 429)
    this.name = "RateLimitError"
  }
}
