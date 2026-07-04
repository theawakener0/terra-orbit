import { tool } from "ai";
import { z } from "zod";
import { nasa } from "./index";
import type { EpicImage } from "../../nasa";
import { NasaApiError, RateLimitError } from "../../nasa";

function formatEpicImages(images: EpicImage[]): string {
  return images
    .map((img) => {
      const url = nasa.epic.imageUrl(
        img.date.includes("enhanced") ? "enhanced" : "natural",
        img.date.split(" ")[0]!,
        img.image,
      );
      return (
        `Identifier: ${img.identifier}\n` +
        `Caption: ${img.caption}\n` +
        `Date: ${img.date}\n` +
        `Coordinates: ${img.centroid_coordinates.lat}, ${img.centroid_coordinates.lon}\n` +
        `Image URL: ${url}`
      );
    })
    .join("\n---\n");
}

export const epic_latest = tool({
  description: "Get the latest EPIC (Earth Polychromatic Imaging Camera) images",
  inputSchema: z.object({
    type: z
      .enum(["natural", "enhanced"])
      .optional()
      .default("natural")
      .describe("Imagery type: natural color or enhanced"),
  }),
  execute: async ({ type }) => {
        try {
            const result = await nasa.epic.getLatest(type);
            return formatEpicImages(result);
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

export const epic_by_date = tool({
  description: "Get EPIC images for a specific date",
  inputSchema: z.object({
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .describe("Date (YYYY-MM-DD)"),
    type: z
      .enum(["natural", "enhanced"])
      .optional()
      .default("natural")
      .describe("Imagery type"),
  }),
  execute: async ({ date, type }) => {
        try {
            const result = await nasa.epic.getByDate(type, date);
            return formatEpicImages(result);
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

export const epic_available_dates = tool({
  description: "List available dates for EPIC imagery",
  inputSchema: z.object({
    type: z
      .enum(["natural", "enhanced"])
      .optional()
      .default("natural")
      .describe("Imagery type"),
  }),
  execute: async ({ type }) => {
        try {
            const result = await nasa.epic.getAvailableDates(type);
            return result.map((d) => d.date).join("\n");
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

export const epic_tools = {
    epic_latest: epic_latest,
    epic_by_date: epic_by_date,
    epic_available_dates: epic_available_dates,
};
