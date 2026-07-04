import { tool } from "ai";
import { z } from "zod";
import { nasa } from "./index";
import type { ImageryItem } from "../../nasa";
import { NasaApiError, RateLimitError } from "../../nasa";

function formatSearchItem(item: ImageryItem): string {
  const data = item.data[0];
  if (!data) return "";
  const links = item.links
    ?.map((l) => l.href)
    .join("\n  ");
  return (
    `NASA ID: ${data.nasa_id}\n` +
    `Title: ${data.title}\n` +
    `Description: ${data.description}\n` +
    `Media Type: ${data.media_type}\n` +
    `Date Created: ${data.date_created}\n` +
    `Center: ${data.center}\n` +
    `Keywords: ${data.keywords?.join(", ") ?? "None"}\n` +
    `Links:\n  ${links ?? "None"}`
  );
}

export const imagery_search = tool({
  description: "Search NASA's image and video library",
  inputSchema: z.object({
    q: z.string().optional().describe("Free-text search query"),
    center: z.string().optional().describe("NASA center (e.g. 'JPL', 'KSC')"),
    description: z.string().optional().describe("Search within descriptions"),
    keywords: z.string().optional().describe("Comma-separated keywords"),
    location: z.string().optional().describe("Location filter"),
    media_type: z
      .enum(["image", "video", "audio"])
      .optional()
      .describe("Media type filter"),
    nasa_id: z.string().optional().describe("Specific NASA ID"),
    page: z.number().min(1).optional().describe("Page number"),
    page_size: z.number().min(1).max(100).optional().describe("Results per page"),
    year_start: z
      .string()
      .regex(/^\d{4}$/)
      .optional()
      .describe("Start year"),
    year_end: z
      .string()
      .regex(/^\d{4}$/)
      .optional()
      .describe("End year"),
  }),
  execute: async (params) => {
        try {
            const result = await nasa.imagery.search(params);
            const items = result.collection.items;
            if (items.length === 0) return "No results found.";
            const total = result.collection.metadata.total_hits;
            const formatted = items.map(formatSearchItem).join("\n===\n");
            return `Total hits: ${total}\n\n${formatted}`;
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

export const imagery_asset = tool({
  description: "Get asset download URLs for a NASA image/video ID",
  inputSchema: z.object({
    nasa_id: z.string().describe("NASA ID of the asset"),
  }),
  execute: async ({ nasa_id }) => {
    const result = await nasa.imagery.asset(nasa_id);
    const items = result.collection.items;
    if (items.length === 0) return "No assets found.";
    return items.map((i) => i.href).join("\n");
  },
});

export const imagery_metadata = tool({
  description: "Get metadata for a NASA image/video ID",
  inputSchema: z.object({
    nasa_id: z.string().describe("NASA ID of the asset"),
  }),
  execute: async ({ nasa_id }) => {
        try {
            const result = await nasa.imagery.metadata(nasa_id);
            return JSON.stringify(result, null, 2);
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

export const imagery_captions = tool({
  description: "Get captions/subtitles for a NASA media asset",
  inputSchema: z.object({
    nasa_id: z.string().describe("NASA ID of the asset"),
  }),
  execute: async ({ nasa_id }) => {
        try {
            const result = await nasa.imagery.captions(nasa_id);
            return result;
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

export const imagery_tools = {
    imagery_search: imagery_search,
    imagery_asset: imagery_asset,
    imagery_metadata: imagery_metadata,
    imagery_captions: imagery_captions,
};
