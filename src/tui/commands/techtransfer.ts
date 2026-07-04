import { NasaClient } from "../../nasa"
import { formatError } from "./errors"

export async function handleTechtransfer(args: string[], nasa: NasaClient): Promise<string> {
  try {
    if (args[0] === "help" || args.length < 2) {
      return (
        "techtransfer patent <query>      search NASA patents\n" +
        "techtransfer software <query>    search NASA software\n" +
        "techtransfer spinoff <query>     search NASA spinoffs"
      )
    }

    const query = args.slice(1).join(" ")

    switch (args[0]) {
      case "patent": {
        const result = await nasa.techtransfer.patent(query)
        return (
          `Found ${result.count} results (${result.total} total)\n\n` +
          result.results
            .map(
              (p) =>
                `Title: ${p.title}\n` +
                `Patent: ${p.patentNumber}\n` +
                `Status: ${p.status}\n` +
                `Abstract: ${p.abstract.slice(0, 200)}${p.abstract.length > 200 ? "..." : ""}`,
            )
            .join("\n\n")
        )
      }
      case "software": {
        const result = await nasa.techtransfer.software(query)
        return (
          `Found ${result.count} results (${result.total} total)\n\n` +
          result.results
            .map(
              (s) =>
                `Title: ${s.title}\n` +
                `Software: ${s.softwareNumber}\n` +
                `Abstract: ${s.abstract.slice(0, 200)}${s.abstract.length > 200 ? "..." : ""}`,
            )
            .join("\n\n")
        )
      }
      case "spinoff": {
        const result = await nasa.techtransfer.spinoff(query)
        return (
          `Found ${result.count} results (${result.total} total)\n\n` +
          result.results
            .map(
              (s) =>
                `Title: ${s.title}\n` +
                `Abstract: ${s.abstract.slice(0, 200)}${s.abstract.length > 200 ? "..." : ""}`,
            )
            .join("\n\n")
        )
      }
      default:
        return "Usage: techtransfer [patent|software|spinoff] <query>"
    }
  } catch (err) {
    return formatError(err)
  }
}
