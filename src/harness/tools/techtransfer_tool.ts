import { tool } from "ai";
import { z } from "zod";
import { nasa } from "./index";

const format_techtransfer_tool = (result: string): string => {
    return result;
}

export const patent = tool({
    description: "Search for a NASA tech transfer patent",
    inputSchema: z.object({
        query: z.string().describe("The patent query"),
    }),
    execute: async ({ query }) => {
        const result = await nasa.techtransfer.patent(query);
        for (const s of result.results) {
            return format_techtransfer_tool(
               `Title: ${s.title}\n` +
               `Patent: ${s.patentNumber}\n` +
               `Status: ${s.status}\n` +
               `Abstract: ${s.abstract}`
            );
        }
    },
});

export const software = tool({
    description: "Search for a NASA tech transfer software",
    inputSchema: z.object({
        query: z.string().describe("The software query"),
    }),
    execute: async ({ query }) => {
        const result = await nasa.techtransfer.software(query);
        for (const s of result.results) {
            return format_techtransfer_tool(
                `Title: ${s.title}\n` +
                `Software: ${s.softwareNumber}\n` +
                `Abstract: ${s.abstract}`
            );
        }
    },
});

export const spinoff = tool({
    description: "Search for a NASA tech transfer spinoff",
    inputSchema: z.object({
        query: z.string().describe("The spinoff query"),
    }),
    execute: async ({ query }) => {
        const result = await nasa.techtransfer.spinoff(query);
        for (const s of result.results) {
            return format_techtransfer_tool(
                `Title: ${s.title}\n` +
                `Abstract: ${s.abstract}`
            );
        }
    },
});


export const techtransfer_tools = {
    patent,
    software,
    spinoff,
};
