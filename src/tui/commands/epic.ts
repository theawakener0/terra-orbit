import { NasaClient } from "../../nasa"
import { formatError } from "./errors"

export async function handleEpic(args: string[], nasa: NasaClient): Promise<string> {
  try {
    if (args[0] === "help") {
      return (
        "epic                          latest natural images\n" +
        "epic enhanced                 latest enhanced images\n" +
        "epic <type> <date>            images by date (YYYY-MM-DD)\n" +
        "epic dates [type]             available dates"
      )
    }

    if (args[0] === "dates") {
      const type = (args[1] as "natural" | "enhanced") ?? "natural"
      const dates = await nasa.epic.getAvailableDates(type)
      return dates.map((d) => d.date).join("\n")
    }

    if (args[0] && args[1] && /^\d{4}-\d{2}-\d{2}$/.test(args[1]!)) {
      const type = (args[0] === "enhanced" ? "enhanced" : "natural") as "natural" | "enhanced"
      const date = args[1]!
      const images = await nasa.epic.getByDate(type, date)
      return images
        .map((img) => {
          const url = nasa.epic.imageUrl(type, date, img.image)
          return (
            `ID: ${img.identifier}\n` +
            `Date: ${img.date}\n` +
            `Caption: ${img.caption}\n` +
            `Coordinates: ${img.centroid_coordinates.lat.toFixed(2)}°, ${img.centroid_coordinates.lon.toFixed(2)}°\n` +
            `Image URL: ${url}`
          )
        })
        .join("\n\n")
    }

    const type = (args[0] === "enhanced" ? "enhanced" : "natural") as "natural" | "enhanced"
    const images = await nasa.epic.getLatest(type)
    return images
      .slice(0, 10)
      .map((img) => {
        const datePart = img.date.split(" ")[0] ?? img.date
        const url = nasa.epic.imageUrl(type, datePart, img.image)
        return (
          `ID: ${img.identifier}\n` +
          `Date: ${img.date}\n` +
          `Caption: ${img.caption}\n` +
          `Coordinates: ${img.centroid_coordinates.lat.toFixed(2)}°, ${img.centroid_coordinates.lon.toFixed(2)}°\n` +
          `Image URL: ${url}`
        )
      })
      .join("\n\n")
  } catch (err) {
    return formatError(err)
  }
}
