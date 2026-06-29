import type { NasaBaseClient } from "../client"
import type { ApodQueryParams, ApodResponse } from "./types"

export function createApodModule(client: NasaBaseClient) {
  function get(params?: ApodQueryParams): Promise<ApodResponse> {
    return client.get<ApodResponse>("/planetary/apod", { ...params })
  }

  function getRange(startDate: string, endDate: string): Promise<ApodResponse[]> {
    return client.get<ApodResponse[]>("/planetary/apod", {
      start_date: startDate,
      end_date: endDate,
    })
  }

  function getRandom(count: number = 1): Promise<ApodResponse[]> {
    return client.get<ApodResponse[]>("/planetary/apod", { count })
  }

  function today(): Promise<ApodResponse> {
    return client.get<ApodResponse>("/planetary/apod")
  }

  function byDate(date: string): Promise<ApodResponse> {
    return client.get<ApodResponse>("/planetary/apod", { date })
  }

  return { get, getRange, getRandom, today, byDate }
}
