import { tool } from "ai";
import { z } from "zod";
import { nasa } from "./index"
import { NasaApiError, RateLimitError } from "../../nasa";
import type { NearEarthObject, NeoFeedResponse, CloseApproachData } from "../../nasa";

function formatDiameterRange(d: { estimated_diameter_min: number; estimated_diameter_max: number }): string {
  return `${d.estimated_diameter_min.toFixed(3)} – ${d.estimated_diameter_max.toFixed(3)}`;
}

function formatCloseApproach(ca: CloseApproachData): string {
  return (
    `Date: ${ca.close_approach_date}\n` +
    `  Velocity: ${ca.relative_velocity.kilometers_per_second} km/s\n` +
    `  Miss Distance: ${ca.miss_distance.kilometers} km\n` +
    `  Orbiting Body: ${ca.orbiting_body}`
  );
}

function formatNearEarthObject(neo: NearEarthObject): string {
  const lines: string[] = [
    `Name: ${neo.name}`,
    `ID: ${neo.id}`,
    `Absolute Magnitude (H): ${neo.absolute_magnitude_h}`,
    `Estimated Diameter (km): ${formatDiameterRange(neo.estimated_diameter.kilometers)}`,
    `Potentially Hazardous: ${neo.is_potentially_hazardous_asteroid}`,
    `Sentry Object: ${neo.is_sentry_object}`,
  ];

  if (neo.close_approach_data.length > 0) {
    lines.push(`Close Approaches:\n  ${neo.close_approach_data.map(formatCloseApproach).join("\n  ")}`);
  }

  if (neo.orbital_data) {
    const od = neo.orbital_data;
    lines.push(
      `Orbit ID: ${od.orbit_id}`,
      `Eccentricity: ${od.eccentricity}`,
      `Semi-Major Axis (AU): ${od.semi_major_axis}`,
      `Inclination (°): ${od.inclination}`,
      `Orbital Period (days): ${od.orbital_period}`,
      `Perihelion Distance (AU): ${od.perihelion_distance}`,
      `Aphelion Distance (AU): ${od.aphelion_distance}`,
      `Orbit Class: ${od.orbit_class.orbit_class_type} — ${od.orbit_class.orbit_class_description}`,
    );
  }

  return lines.join("\n");
}

function formatNeoFeed(response: NeoFeedResponse): string {
  const dates = Object.keys(response.near_earth_objects).sort();
  const parts: string[] = [`Total elements: ${response.element_count}`];

  for (const date of dates) {
    const neos = response.near_earth_objects[date]!;
    parts.push(`\n=== ${date} (${neos.length} objects) ===`);
    for (const neo of neos) {
      parts.push(formatNearEarthObject(neo) + "\n---");
    }
  }

  return parts.join("\n");
}

export const neo_feed = tool({
    description: "Get near-earth objects feed",
    inputSchema: z.object({
        start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    }),
    execute: async ({start_date, end_date}) => {
        try {
            const result = await nasa.neo.feed({ start_date, end_date })
            return formatNeoFeed(result);
        } catch (err) {
            if (err instanceof RateLimitError) {
                return `Rate limited — retry after ${err.retryAfter}s`
            } else if (err instanceof NasaApiError) {
                return `API error ${err.status}: ${err.message}`
            } else {
                return `Error: ${(err as Error).message}`
            }
        }
    },
});

export const neo_lookup = tool({
    description: "Get near-earth object details",
    inputSchema: z.object({
        id: z.string().regex(/^\d+$/).describe("The id of the object"),
    }),
    execute: async ({id}) => {
        try {
            const result = await nasa.neo.lookup(id)
            return formatNearEarthObject(result);
        } catch (err) {
            if (err instanceof RateLimitError) {
                return `Rate limited — retry after ${err.retryAfter}s`
            } else if (err instanceof NasaApiError) {
                return `API error ${err.status}: ${err.message}`
            } else {
                return `Error: ${(err as Error).message}`
            }
        }
    },
});

export const neo_browse = tool({
    description: "Browse near-earth object catalog",
    inputSchema: z.object({
        page: z.number().min(1).max(25),
    }),
    execute: async ({page}) => {
        try {
            const result = await nasa.neo.browse(page)
            return result.near_earth_objects.map(formatNearEarthObject).join("\n---\n");
        } catch (err) {
            if (err instanceof RateLimitError) {
                return `Rate limited — retry after ${err.retryAfter}s`
            } else if (err instanceof NasaApiError) {
                return `API error ${err.status}: ${err.message}`
            } else {
                return `Error: ${(err as Error).message}`
            }
        }
    },
});

export const neo_tools = {
    neo_feed: neo_feed,
    neo_lookup: neo_lookup,
    neo_browse: neo_browse,
};
