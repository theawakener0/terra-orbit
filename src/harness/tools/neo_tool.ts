import { tool } from "ai";
import { z } from "zod";
import { nasa } from "./index"


export const neo_feed = tool({
    description: "Get near-earth objects feed",
    inputSchema: z.object({
        start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    }),
    execute: async ({start_date, end_date}) => {
        const result = await nasa.neo.feed({ start_date, end_date })
        return JSON.stringify(result, null, 2);
    }
});

export const neo_lookup = tool({
    description: "Get near-earth object details",
    inputSchema: z.object({
        id: z.string().regex(/^\d+$/).describe("The id of the object"),
    }),
    execute: async ({id}) => {
        const result = await nasa.neo.lookup(id)
        return JSON.stringify(result, null, 2);
    }
});

export const neo_browse = tool({
    description: "Browse near-earth object catalog",
    inputSchema: z.object({
        page: z.number().min(1).max(25),
    }),
    execute: async ({page}) => {
        const result = await nasa.neo.browse(page)
        return JSON.stringify(result, null, 2);
    }
});

export const neo_tools = {
    neo_feed,
    neo_lookup,
    neo_browse,
};

