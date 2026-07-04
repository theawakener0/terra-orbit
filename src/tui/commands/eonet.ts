import { NasaClient } from "../../nasa"
import { formatError } from "./errors"

export async function handleEonet(args: string[], nasa: NasaClient): Promise<string> {
  try {
    if (args[0] === "help" || args.length === 0) {
      return (
        "eonet events [limit] [status] [category]  natural events\n" +
        "eonet categories                          event categories"
      )
    }

    if (args[0] === "events") {
      const result = await nasa.eonet.events({
        limit: args[1] ? Number(args[1]) : 10,
        status: args[2] as "open" | "closed" | "all" | undefined,
        category: args[3] as string | number | undefined,
      })
      return result.events
        .map(
          (e) =>
            `ID: ${e.id}\n` +
            `Title: ${e.title}\n` +
            `Categories: ${e.categories.map((c) => c.title).join(", ")}\n` +
            `Sources: ${e.sources.map((s) => s.id).join(", ")}\n` +
            `Status: ${e.closed ? "closed" : "open"}`,
        )
        .join("\n\n")
    }

    if (args[0] === "categories") {
      const result = await nasa.eonet.categories()
      return result.categories
        .map((c) => `ID: ${c.id}  Title: ${c.title}\n${c.description}`)
        .join("\n\n")
    }

    return "Usage: eonet [events|categories] ..."
  } catch (err) {
    return formatError(err)
  }
}
