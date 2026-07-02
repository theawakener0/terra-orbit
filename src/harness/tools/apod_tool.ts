import { tool } from "ai";
import { z } from "zod";
import { nasa } from "./index";
import type { ApodResponse } from "../../nasa";


const format_apod_result = (result: ApodResponse): string => {
    return `Title: ${result.title}\n` + `Date: ${result.date}\n` + `Copyright: ${result.copyright ?? "Public"}\n` + `Media Type: ${result.media_type}\n` + `URL: ${result.url}\n` + `${result.explanation}`

} 

export const apond_today = tool({
    description: "Get today's APOD image to retrieve",
    inputSchema: z.object({}),
    execute: async () => {
        const apod = await nasa.apod.today();
        return apod;
    },
});

export const apod_date = tool({
    description: "Get a specific date's APOD image to retrieve",
    inputSchema: z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    }),
    execute: async ({ date }) => {
        const apod = await nasa.apod.byDate(date);
        return format_apod_result(apod);
    },
});

export const  apod_random = tool({
    description: "Get a certain number of random APOD images to retrieve",
    inputSchema: z.object({
        number: z.number().min(1).max(10),
    }),
    execute: async ({ number }) => {
        const apod = await nasa.apod.getRandom(number);
        let apods = "";
        for (const ap of apod) {
            apods += format_apod_result(ap) + "\n";
        }
        return apods;
    },
});

export const apod_range = tool({
    description: "Get a range of APOD images to retrieve",
    inputSchema: z.object({
        start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    }),
    execute: async ({ start, end }) => {
        const apod = await nasa.apod.getRange(start, end);
        let apods = "";
        for (const ap of apod) {
            apods += format_apod_result(ap) + "\n";
        }
        return apods;
    },
});

export const apod_tools = {
    apond_today,
    apod_date,
    apod_random,
    apod_range,
};


