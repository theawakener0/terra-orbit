import type { NasaBaseClient } from "../client"
import type { EpicAvailableDate, EpicImage, EpicImageryType } from "./types"

export function createEpicModule(client: NasaBaseClient) {
  function getLatest(type: EpicImageryType = "natural"): Promise<EpicImage[]> {
    return client.get<EpicImage[]>(`/EPIC/api/${type}`)
  }

  function getByDate(type: EpicImageryType, date: string): Promise<EpicImage[]> {
    return client.get<EpicImage[]>(`/EPIC/api/${type}/date/${date}`)
  }

  function getAvailableDates(type: EpicImageryType = "natural"): Promise<EpicAvailableDate[]> {
    return client.get<EpicAvailableDate[]>(`/EPIC/api/${type}/all`)
  }

  function imageUrl(type: EpicImageryType, date: string, imageName: string): string {
    const [year, month, day] = date.split("-")
    return `https://epic.gsfc.nasa.gov/archive/${type}/${year}/${month}/${day}/png/${imageName}.png`
  }

  return { getLatest, getByDate, getAvailableDates, imageUrl }
}
