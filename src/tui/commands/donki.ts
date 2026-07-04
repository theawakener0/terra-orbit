import { NasaClient } from "../../nasa"
import { formatError } from "./errors"

export async function handleDonki(args: string[], nasa: NasaClient): Promise<string> {
  try {
    if (args[0] === "help" || args.length === 0) {
      return (
        "donki cme [start] [end]             coronal mass ejections\n" +
        "donki flares [start] [end]          solar flares\n" +
        "donki storms [start] [end]          geomagnetic storms\n" +
        "donki sep [start] [end]             solar energetic particles\n" +
        "donki notifications [start] [end] [type]  space weather notifications"
      )
    }

    const startDate = args[1]
    const endDate = args[2]
    const range = startDate ? { startDate, endDate } : undefined

    switch (args[0]) {
      case "cme": {
        const events = await nasa.donki.cme(range)
        return events
          .map((e) => {
            const analysis = e.cmeAnalyses[0]
            return (
              `ID: ${e.activityID}\n` +
              `Start: ${e.startTime}\n` +
              `Location: ${e.sourceLocation}\n` +
              (analysis ? `Speed: ${analysis.speed} km/s\n` : "") +
              (analysis ? `Type: ${analysis.type}` : "")
            )
          })
          .join("\n\n")
      }
      case "flares": {
        const events = await nasa.donki.solarFlares(range)
        return events
          .map(
            (f) =>
              `ID: ${f.flrID}\n` +
              `Begin: ${f.beginTime}\n` +
              `Peak: ${f.peakTime}\n` +
              `Class: ${f.classType}\n` +
              `Location: ${f.sourceLocation}`,
          )
          .join("\n\n")
      }
      case "storms": {
        const events = await nasa.donki.geomagneticStorms(range)
        return events
          .map((s) => {
            const kp = s.allKpIndex[0]
            return (
              `ID: ${s.gstID}\n` +
              `Start: ${s.startTime}\n` +
              (kp ? `Kp Index: ${kp.kpIndex} (${kp.observedTime})` : "")
            )
          })
          .join("\n\n")
      }
      case "sep": {
        const events = await nasa.donki.solarEnergeticParticles(range)
        return events
          .map(
            (p) =>
              `ID: ${p.sepID}\n` +
              `Time: ${p.eventTime}\n` +
              `Instruments: ${p.instruments.map((i) => i.displayName).join(", ")}`,
          )
          .join("\n\n")
      }
      case "notifications": {
        const type = args[3] as any
        const events = await nasa.donki.notifications({ startDate, endDate, type })
        return events
          .map(
            (n) =>
              `Type: ${n.messageType}\n` +
              `Time: ${n.messageIssueTime}\n` +
              `Body: ${n.messageBody.slice(0, 200)}${n.messageBody.length > 200 ? "..." : ""}`,
          )
          .join("\n\n")
      }
      default:
        return "Usage: donki [cme|flares|storms|sep|notifications] [start] [end]"
    }
  } catch (err) {
    return formatError(err)
  }
}
