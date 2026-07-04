import { tool } from "ai";
import { z } from "zod";
import { nasa } from "./index"
import {NasaApiError, RateLimitError} from "../../nasa";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

const dateRangeSchema = z.object({
  start_date: z.string().regex(datePattern),
  end_date: z.string().regex(datePattern),
});

export const donki_cme = tool({
  description: "Get coronal mass ejections",
  inputSchema: dateRangeSchema,
  execute: async ({ start_date, end_date }) => {
    try {
      const range = { startDate: start_date, endDate: end_date }
      const result = await nasa.donki.cme(range)
      return JSON.stringify(result, null, 2)
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

export const donki_cme_analysis = tool({
  description: "Get CME analysis data with optional filters",
  inputSchema: z.object({
    start_date: z.string().regex(datePattern),
    end_date: z.string().regex(datePattern),
    most_accurate_only: z.boolean().optional().describe("Only return most accurate analyses"),
    speed: z.number().optional().describe("Filter by speed"),
    half_angle: z.number().optional().describe("Filter by half angle"),
    catalog: z.enum(["ALL", "SWRC_CATALOG", "JANG_ET_AL_CATALOG"]).optional(),
  }),
  execute: async ({ start_date, end_date, most_accurate_only, speed, half_angle, catalog }) => {
        try {
            const result = await nasa.donki.cmeAnalysis({
                startDate: start_date,
                endDate: end_date,
                mostAccurateOnly: most_accurate_only,
                speed,
                halfAngle: half_angle,
                catalog,
            })
            return JSON.stringify(result, null, 2)
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

export const donki_flares = tool({
  description: "Get solar flares",
  inputSchema: dateRangeSchema,
  execute: async ({ start_date, end_date }) => {
    try {
      const result = await nasa.donki.solarFlares({ startDate: start_date, endDate: end_date })
      return JSON.stringify(result, null, 2)
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

export const donki_storms = tool({
  description: "Get geomagnetic storms",
  inputSchema: dateRangeSchema,
  execute: async ({ start_date, end_date }) => {
        try {
            const result = await nasa.donki.geomagneticStorms({ startDate: start_date, endDate: end_date })
            return JSON.stringify(result, null, 2)
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

export const donki_sep = tool({
  description: "Get solar energetic particles",
  inputSchema: dateRangeSchema,
  execute: async ({ start_date, end_date }) => {
    const result = await nasa.donki.solarEnergeticParticles({ startDate: start_date, endDate: end_date })
    return JSON.stringify(result, null, 2)
  }
});

export const donki_mpc = tool({
  description: "Get magnetopause crossings",
  inputSchema: dateRangeSchema,
  execute: async ({ start_date, end_date }) => {
        try {
            const result = await nasa.donki.magnetopauseCrossings({ startDate: start_date, endDate: end_date })
            return JSON.stringify(result, null, 2)
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

export const donki_ips = tool({
  description: "Get interplanetary shocks",
  inputSchema: z.object({
    start_date: z.string().regex(datePattern),
    end_date: z.string().regex(datePattern),
    location: z.enum(["Earth", "MESSENGER", "STEREO A", "STEREO B"]).optional(),
    catalog: z.enum(["ALL", "SWRC_CATALOG", "WINSLOW_MESSENGER_ICME_CATALOG"]).optional(),
  }),
  execute: async ({ start_date, end_date, location, catalog }) => {
        try {
            const result = await nasa.donki.interplanetaryShocks({
              startDate: start_date,
              endDate: end_date,
              location,
              catalog,
            })
            return JSON.stringify(result, null, 2)
        } catch (err) {
            if (err instanceof RateLimitError) {
                return `Rate limited — retry after ${err.retryAfter}s`
            } else if (err instanceof NasaApiError) {
                return `API error ${err.status}: ${err.message}`
            } else {
                return `Error: ${(err as Error).message}`
            }
        }
  }
});

export const donki_rbe = tool({
  description: "Get radiation belt enhancements",
  inputSchema: dateRangeSchema,
  execute: async ({ start_date, end_date }) => {
        try {
            const result = await nasa.donki.radiationBeltEnhancements({ startDate: start_date, endDate: end_date })
            return JSON.stringify(result, null, 2)
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

export const donki_hss = tool({
  description: "Get high-speed solar wind streams",
  inputSchema: dateRangeSchema,
  execute: async ({ start_date, end_date }) => {
        try {
            const result = await nasa.donki.hightSpeedStreams({ startDate: start_date, endDate: end_date })
            return JSON.stringify(result, null, 2)
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

export const donki_wsa = tool({
  description: "Get WSA-Enlil solar wind simulations",
  inputSchema: dateRangeSchema,
  execute: async ({ start_date, end_date }) => {
        try {
            const result = await nasa.donki.wsaEnlilSimulations({ startDate: start_date, endDate: end_date })
            return JSON.stringify(result, null, 2)
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

export const donki_notifications = tool({
  description: "Get DONKI notifications (space weather alerts)",
  inputSchema: z.object({
    start_date: z.string().regex(datePattern),
    end_date: z.string().regex(datePattern),
    type: z.enum(["all", "FLR", "SEP", "CME", "IPS", "MPC", "GST", "RBE", "report"]).optional(),
  }),
  execute: async ({ start_date, end_date, type }) => {
        try  {
            const result = await nasa.donki.notifications({
              startDate: start_date,
              endDate: end_date,
              type,
            })
            return JSON.stringify(result, null, 2)
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

export const donki_tools = {
    donki_cme: donki_cme,
    donki_cme_analysis: donki_cme_analysis,
    donki_flares: donki_flares,
    donki_storms: donki_storms,
    donki_sep: donki_sep,
    donki_mpc: donki_mpc,
    donki_ips: donki_ips,
    donki_rbe: donki_rbe,
    donki_hss: donki_hss,
    donki_wsa: donki_wsa,
    donki_notifications: donki_notifications,
};
