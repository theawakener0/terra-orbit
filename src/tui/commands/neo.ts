import { NasaClient } from "../../nasa"
import { formatError } from "./errors"

export async function handleNeo(args: string[], nasa: NasaClient): Promise<string> {
  try {
    if (args[0] === "help" || args.length === 0) {
      return (
        "neo feed <start> <end>       asteroid feed for date range\n" +
        "neo lookup <id>              asteroid details\n" +
        "neo browse [page]            browse asteroid catalog"
      )
    }

    if (args[0] === "feed" && args[1] && args[2]) {
      const result = await nasa.neo.feed({ start_date: args[1], end_date: args[2] })
      const lines = [`Near-Earth Objects: ${result.element_count} found`]
      for (const [date, objects] of Object.entries(result.near_earth_objects)) {
        for (const n of objects) {
          const dia = n.estimated_diameter.kilometers
          const approach = n.close_approach_data[0]
          lines.push(
            `Date: ${date}\n` +
              `ID: ${n.id}\n` +
              `Name: ${n.name}\n` +
              `Hazardous: ${n.is_potentially_hazardous_asteroid}\n` +
              `Diameter: ${dia.estimated_diameter_min.toFixed(3)}–${dia.estimated_diameter_max.toFixed(3)} km\n` +
              (approach
                ? `Close Approach: ${approach.close_approach_date}, ` +
                  `${approach.relative_velocity.kilometers_per_second} km/s, ` +
                  `miss ${approach.miss_distance.kilometers} km`
                : ""),
          )
        }
      }
      return lines.join("\n\n")
    }

    if (args[0] === "lookup" && args[1]) {
      const result = await nasa.neo.lookup(args[1])
      const dia = result.estimated_diameter.kilometers
      const approach = result.close_approach_data[0]
      return (
        `ID: ${result.id}\n` +
        `Name: ${result.name}\n` +
        `URL: ${result.nasa_jpl_url}\n` +
        `Hazardous: ${result.is_potentially_hazardous_asteroid}\n` +
        `Diameter: ${dia.estimated_diameter_min.toFixed(3)}–${dia.estimated_diameter_max.toFixed(3)} km\n` +
        `Magnitude: ${result.absolute_magnitude_h}\n` +
        (approach
          ? `Close Approach: ${approach.close_approach_date}, ` +
            `${approach.relative_velocity.kilometers_per_second} km/s\n` +
            `Orbiting: ${approach.orbiting_body}`
          : "") +
        (result.orbital_data
          ? `\nOrbit Class: ${result.orbital_data.orbit_class.orbit_class_type}\n` +
            `Eccentricity: ${result.orbital_data.eccentricity}\n` +
            `Inclination: ${result.orbital_data.inclination}°\n` +
            `Period: ${result.orbital_data.orbital_period} days`
          : "")
      )
    }

    if (args[0] === "browse") {
      const page = args[1] ? Number(args[1]) : 1
      const result = await nasa.neo.browse(page)
      const lines = [
        `Page ${result.page.number} of ${result.page.total_pages} ` +
          `(${result.page.total_elements} total)`,
      ]
      for (const n of result.near_earth_objects) {
        const dia = n.estimated_diameter.kilometers
        lines.push(
          `ID: ${n.id}  Name: ${n.name}\n` +
            `Hazardous: ${n.is_potentially_hazardous_asteroid}\n` +
            `Diameter: ${dia.estimated_diameter_min.toFixed(3)}–${dia.estimated_diameter_max.toFixed(3)} km`,
        )
      }
      return lines.join("\n\n")
    }

    return "Usage: neo [feed|lookup|browse] ..."
  } catch (err) {
    return formatError(err)
  }
}
