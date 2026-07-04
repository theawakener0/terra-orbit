import { NasaClient } from "../../nasa"
import { formatError } from "./errors"

export async function handleApod(args: string[], nasa: NasaClient): Promise<string> {
  try {
    if (args[0] === "help") {
      return (
        "apod                        today's picture\n" +
        "apod <date>                 picture by date (YYYY-MM-DD)\n" +
        "apod <n>                    n random pictures\n" +
        "apod <start> <end>          date range"
      )
    }

    if (args.length === 0) {
      const apod = await nasa.apod.today()
      return (
        `Title: ${apod.title}\n` +
        `Date: ${apod.date}\n` +
        `Copyright: ${apod.copyright ?? "Public"}\n` +
        `Media Type: ${apod.media_type}\n` +
        `URL: ${apod.url}\n` +
        `${apod.explanation}`
      )
    }

    if (args.length === 1) {
      const a0 = args[0]!
      if (/^\d+$/.test(a0)) {
        const results = await nasa.apod.getRandom(Number(a0))
        return results
          .map(
            (ap) =>
              `Title: ${ap.title}\n` +
              `Date: ${ap.date}\n` +
              `Copyright: ${ap.copyright ?? "Public"}\n` +
              `Media Type: ${ap.media_type}\n` +
              `URL: ${ap.url}\n` +
              `${ap.explanation}`,
          )
          .join("\n\n")
      }
      const apod = await nasa.apod.byDate(a0)
      return (
        `Title: ${apod.title}\n` +
        `Date: ${apod.date}\n` +
        `Copyright: ${apod.copyright ?? "Public"}\n` +
        `Media Type: ${apod.media_type}\n` +
        `URL: ${apod.url}\n` +
        `${apod.explanation}`
      )
    }

    if (args.length === 2) {
      const [a0, a1] = [args[0]!, args[1]!]
      const results = await nasa.apod.getRange(a0, a1)
      return results
        .map(
          (ap) =>
            `Title: ${ap.title}\n` +
            `Date: ${ap.date}\n` +
            `Copyright: ${ap.copyright ?? "Public"}\n` +
            `Media Type: ${ap.media_type}\n` +
            `URL: ${ap.url}\n` +
            `${ap.explanation}`,
        )
        .join("\n\n")
    }

    return "Usage: apod [help|<date>|<n>|<start> <end>]"
  } catch (err) {
    return formatError(err)
  }
}
