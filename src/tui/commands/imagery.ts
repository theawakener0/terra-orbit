import { NasaClient } from "../../nasa"
import { formatError } from "./errors"

export async function handleImagery(args: string[], nasa: NasaClient): Promise<string> {
  try {
    if (args[0] === "help" || args.length < 2) {
      return (
        "imagery search <query> [page_size]    search image library\n" +
        "imagery asset <nasa_id>               get asset details\n" +
        "imagery metadata <nasa_id>            get metadata"
      )
    }

    if (args[0] === "search") {
      const query = args.slice(1).join(" ")
      const result = await nasa.imagery.search({
        q: query,
        page_size: 10,
      })
      const total = result.collection.metadata.total_hits
      const lines = [`Found ${total} results for "${query}"`]
      for (const item of result.collection.items) {
        const d = item.data[0]
        lines.push(
          `Title: ${d?.title ?? "Untitled"}\n` +
            `ID: ${d?.nasa_id ?? ""}\n` +
            `Date: ${d?.date_created ?? ""}\n` +
            `Media: ${d?.media_type ?? ""}\n` +
            `Description: ${(d?.description ?? "").slice(0, 200)}${(d?.description ?? "").length > 200 ? "..." : ""}`,
        )
      }
      return lines.join("\n\n")
    }

    if (args[0] === "asset" && args[1]) {
      const result = await nasa.imagery.asset(args[1])
      const lines = [`Asset: ${args[1]}`]
      for (const item of result.collection.items) {
        lines.push(`  ${item.href}`)
      }
      return lines.join("\n")
    }

    if (args[0] === "metadata" && args[1]) {
      const result = await nasa.imagery.metadata(args[1])
      return `Metadata location: ${result.location}`
    }

    return "Usage: imagery [search|asset|metadata] ..."
  } catch (err) {
    return formatError(err)
  }
}
