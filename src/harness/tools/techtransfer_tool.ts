import { tool } from "ai";
import { z } from "zod";
import { nasa } from "./index";

export const patent = tool({
    description: "Search for a NASA tech transfer patent",
    inputSchema: z.object({
        query: z.string().describe("The patent query"),
    }),
    execute: async ({ query }) => {
        const result = await nasa.techtransfer.patent(query);
        return result;
    },
});

export const software = tool({
    description: "Search for a NASA tech transfer software",
    inputSchema: z.object({
        query: z.string().describe("The software query"),
    }),
    execute: async ({ query }) => {
        const result = await nasa.techtransfer.software(query);
        return result;
    },
});

export const spinoff = tool({
    description: "Search for a NASA tech transfer spinoff",
    inputSchema: z.object({
        query: z.string().describe("The spinoff query"),
    }),
    execute: async ({ query }) => {
        const result = await nasa.techtransfer.spinoff(query);
        return result;
    },
});


export const techtransfer_tools = {
    patent,
    software,
    spinoff,
};
