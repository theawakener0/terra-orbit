import { tool } from "ai";
import { z } from "zod";
import { nasa } from "./index";
import { NasaApiError, RateLimitError } from "../../nasa";

const format_techtransfer_tool = (result: string): string => {
    return result;
}

export const patent = tool({
    description: "Search for a NASA tech transfer patent",
    inputSchema: z.object({
        query: z.string().describe("The patent query"),
    }),
    execute: async ({ query }) => {
        try {
            const result = await nasa.techtransfer.patent(query);
            let results: string = "";
            for (const s of result.results) {
                results += format_techtransfer_tool(
                   `Title: ${s.title}\n` +
                   `Patent: ${s.patentNumber}\n` +
                   `Status: ${s.status}\n` +
                   `Abstract: ${s.abstract}`
                ) + "\n";
            }
            return results;
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

export const software = tool({
    description: "Search for a NASA tech transfer software",
    inputSchema: z.object({
        query: z.string().describe("The software query"),
    }),
    execute: async ({ query }) => {
        try {
            const result = await nasa.techtransfer.software(query);
            let results: string = "";
            for (const s of result.results) {
                results += format_techtransfer_tool(
                    `Title: ${s.title}\n` +
                    `Software: ${s.softwareNumber}\n` +
                    `Abstract: ${s.abstract}`
                ) + "\n";
            }
            return results;
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

export const spinoff = tool({
    description: "Search for a NASA tech transfer spinoff",
    inputSchema: z.object({
        query: z.string().describe("The spinoff query"),
    }),
    execute: async ({ query }) => {
        try {
            const result = await nasa.techtransfer.spinoff(query);
            let results: string = "";
            for (const s of result.results) {
                results += format_techtransfer_tool(
                    `Title: ${s.title}\n` +
                    `Abstract: ${s.abstract}`
                ) + "\n";
            }
            return results;
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


export const techtransfer_tools = {
    techtransfer_patent: patent,
    techtransfer_software: software,
    techtransfer_spinoff: spinoff,
};
