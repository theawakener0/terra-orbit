import { tool } from "ai";
import { z } from "zod";
import { nasa } from "../config";
import { NasaApiError, RateLimitError, type ApodResponse } from "../../nasa";


const format_apod_result = (result: ApodResponse): string => {
    return `Title: ${result.title}\n` + `Date: ${result.date}\n` + `Copyright: ${result.copyright ?? "Public"}\n` + `Media Type: ${result.media_type}\n` + `URL: ${result.url}\n` + `${result.explanation}`

} 

export const apod_today = tool({
    description: "Get today's APOD image to retrieve",
    inputSchema: z.object({}),
    execute: async () => {
        try {
            const apod = await nasa.apod.today();
            return format_apod_result(apod);
        } catch (err) {
            if (err instanceof RateLimitError) {
                return `Rate limited — retry after ${err.retryAfter}s`;
            } else if (err instanceof NasaApiError) {
                return `API error ${err.status}: ${err.message}`;
            } else {
                return `Error: ${(err as Error).message}`;
            }
        }
    },
});

export const apod_date = tool({
    description: "Get a specific date's APOD image to retrieve",
    inputSchema: z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("The date to retrieve"),
    }),
    execute: async ({ date }) => {
        try {
            const apod = await nasa.apod.byDate(date);
            return format_apod_result(apod);
        } catch (err) {
            if (err instanceof RateLimitError) {
                return `Rate limited — retry after ${err.retryAfter}s`;
            } else if (err instanceof NasaApiError) {
                return `API error ${err.status}: ${err.message}`;
            } else {
                return `Error: ${(err as Error).message}`;
            }
 
        }
    },
});

export const  apod_random = tool({
    description: "Get a certain number of random APOD images to retrieve",
    inputSchema: z.object({
        number: z.number().min(1).max(25).describe("The number of images to retrieve"),
    }),
    execute: async ({ number }) => {
        try {
            const apod = await nasa.apod.getRandom(number);
            let apods = "";
            for (const ap of apod) {
                apods += format_apod_result(ap) + "\n";
            }
            return apods;
        } catch (err) {
            if (err instanceof RateLimitError) {
                return `Rate limited — retry after ${err.retryAfter}s`;
            } else if (err instanceof NasaApiError) {
                return `API error ${err.status}: ${err.message}`;
            } else {
                return `Error: ${(err as Error).message}`;
            }
        }
    },
});

export const apod_range = tool({
    description: "Get a range of APOD images to retrieve",
    inputSchema: z.object({
        start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Start date (YYYY-MM-DD)"),
        end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("End date (YYYY-MM-DD)"),
    }),
    execute: async ({ start, end }) => {
        try {
            const apod = await nasa.apod.getRange(start, end);
            let apods = "";
            for (const ap of apod) {
                apods += format_apod_result(ap) + "\n";
            }
            return apods;
        } catch (err) {
            if (err instanceof RateLimitError) {
                return `Rate limited — retry after ${err.retryAfter}s`;
            } else if (err instanceof NasaApiError) {
                return `API error ${err.status}: ${err.message}`;
            } else {
                return `Error: ${(err as Error).message}`;
            }
        }
    },
});

export const apod_tools = {
    apod_today: apod_today,
    apod_date: apod_date,
    apod_random: apod_random,
    apod_range: apod_range,
};


