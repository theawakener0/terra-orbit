import { tool } from "ai";
import { z } from "zod";
import { nasa } from "./index"


export const donki_cme = tool({
    description: "Get coronal mass ejections",
    inputSchema: z.object({
        start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    }),
    execute: async ({start_date, end_date}) => {
        const range = start_date ? { start_date, end_date } : undefined
        const result = await nasa.donki.cme(range)
        return result
    }
});

export const donki_flares = tool({
    description: "Get solar flares",
    inputSchema: z.object({
        start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    }),
    execute: async ({start_date, end_date}) => {
        const result = await nasa.donki.solarFlares({ start_date, end_date })
        return result
    }
});

export const donki_storms = tool({
    description: "Get geomagnetic storms",
    inputSchema: z.object({
        start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    }),
    execute: async ({start_date, end_date}) => {
        const result = await nasa.donki.geomagneticStorms({ start_date, end_date })
        return result
    }
});

export const donki_tools = {
    donki_cme,
    donki_flares,
    donki_storms,
};

