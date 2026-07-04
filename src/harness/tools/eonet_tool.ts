import { tool } from "ai";
import { z } from "zod";
import { nasa } from "./index";
import type { EonetEvent, EonetCategory } from "../../nasa";
import { NasaApiError, RateLimitError } from "../../nasa";

function formatEvents(events: EonetEvent[]): string {
  return events
    .map((e) => {
      const cats = e.categories.map((c) => c.title).join(", ");
      const coords = e.geometries
        .map((g) => `[${g.coordinates.join(", ")}]`)
        .join("; ");
      return (
        `ID: ${e.id}\n` +
        `Title: ${e.title}\n` +
        `Description: ${e.description}\n` +
        `Categories: ${cats}\n` +
        `Link: ${e.link}\n` +
        `Coordinates: ${coords}\n` +
        `Closed: ${e.closed ?? "Still open"}`
      );
    })
    .join("\n---\n");
}

export const eonet_events = tool({
  description: "Search natural events from EONET (fires, volcanoes, storms, etc.)",
  inputSchema: z.object({
    category: z
      .union([z.number(), z.string()])
      .optional()
      .describe("Category ID or name to filter by"),
    status: z
      .enum(["open", "closed", "all"])
      .optional()
      .describe("Event status"),
    days: z
      .number()
      .min(1)
      .max(365)
      .optional()
      .describe("Number of days back to look"),
    limit: z.number().min(1).max(100).optional().describe("Max results"),
    source: z.string().optional().describe("Source ID to filter by"),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .describe("Start date (YYYY-MM-DD)"),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .describe("End date (YYYY-MM-DD)"),
  }),
  execute: async ({ category, status, days, limit, source, startDate, endDate }) => {
        try {
            const result = await nasa.eonet.events({
                category,
                status,
                days,
                limit,
                source,
                startDate,
                endDate,
            });
            return formatEvents(result.events);
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

export const eonet_categories = tool({
  description: "List all EONET natural event categories",
  inputSchema: z.object({}),
  execute: async () => {
        try {
            const result = await nasa.eonet.categories();
            return result.categories
              .map(
                (c: EonetCategory) =>
                  `${c.id}: ${c.title} — ${c.description}`,
              )
              .join("\n");
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

export const eonet_tools = {
    eonet_events: eonet_events,
    eonet_categories: eonet_categories,
};
