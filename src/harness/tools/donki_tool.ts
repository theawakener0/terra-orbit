import { tool } from "ai";
import { z } from "zod";
import { nasa } from "./index"
import {NasaApiError, RateLimitError} from "../../nasa";
import type { CmeEvent, SolarFlare, GeomagneticStorm, SolarEnergeticParticle, MagnetopauseCrossing, InterplanetaryShock, RadiationBeltEnhancement, HightSpeedStream, WsaEnlilSimulation, DonkiNotification } from "../../nasa";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

const dateRangeSchema = z.object({
  start_date: z.string().regex(datePattern),
  end_date: z.string().regex(datePattern),
});

function formatCmeEvent(e: CmeEvent): string {
  const analysis = e.cmeAnalyses.length > 0 ? e.cmeAnalyses[0]! : null;
  const lines: string[] = [
    `Activity ID: ${e.activityID}`,
    `Start Time: ${e.startTime}`,
    `Source Location: ${e.sourceLocation}`,
    `Active Region: ${e.activeRegionNum ?? "N/A"}`,
    `Catalog: ${e.catalog}`,
    `Note: ${e.note || "None"}`,
    `Instruments: ${e.instruments.map((i) => i.displayName).join(", ")}`,
  ];
  if (analysis) {
    lines.push(
      `Analysis — Time: ${analysis.time21_5}, Speed: ${analysis.speed} km/s, Type: ${analysis.type}, Half Angle: ${analysis.halfAngle}°, Most Accurate: ${analysis.isMostAccurate}`,
    );
  }
  return lines.join("\n");
}

function formatSolarFlare(f: SolarFlare): string {
  return (
    `FLR ID: ${f.flrID}\n` +
    `Class: ${f.classType}\n` +
    `Begin: ${f.beginTime}\n` +
    `Peak: ${f.peakTime}\n` +
    `End: ${f.endTime}\n` +
    `Source Location: ${f.sourceLocation}\n` +
    `Active Region: ${f.activeRegionNum}\n` +
    `Instruments: ${f.instruments.map((i) => i.displayName).join(", ")}`
  );
}

function formatGeomagneticStorm(s: GeomagneticStorm): string {
  const kpSummary = [...s.allKpIndex]
    .sort((a, b) => b.kpIndex - a.kpIndex)
    .slice(0, 3);
  return (
    `GST ID: ${s.gstID}\n` +
    `Start Time: ${s.startTime}\n` +
    `Kp Index (top 3):\n${kpSummary.map((kp) => `  Time: ${kp.observedTime}, Kp: ${kp.kpIndex} (${kp.source})`).join("\n")}` +
    (s.allKpIndex.length > 3 ? `\n  ... and ${s.allKpIndex.length - 3} more readings` : "")
  );
}

function formatSep(s: SolarEnergeticParticle): string {
  return (
    `SEP ID: ${s.sepID}\n` +
    `Event Time: ${s.eventTime}\n` +
    `Instruments: ${s.instruments.map((i) => i.displayName).join(", ")}`
  );
}

function formatMpc(m: MagnetopauseCrossing): string {
  return (
    `MPC ID: ${m.mpcID}\n` +
    `Event Time: ${m.eventTime}\n` +
    `Location: ${m.location}`
  );
}

function formatIps(i: InterplanetaryShock): string {
  return (
    `Shock ID: ${i.shockID}\n` +
    `Event Time: ${i.eventTime}\n` +
    `Location: ${i.location}`
  );
}

function formatRbe(r: RadiationBeltEnhancement): string {
  return (
    `RBE ID: ${r.rbeID}\n` +
    `Event Time: ${r.eventTime}`
  );
}

function formatHss(h: HightSpeedStream): string {
  return (
    `HSS ID: ${h.hssID}\n` +
    `Event Time: ${h.eventTime}`
  );
}

function formatWsa(w: WsaEnlilSimulation): string {
  return (
    `Simulation ID: ${w.simulationID}\n` +
    `Start Time: ${w.startTime}\n` +
    `Note: ${w.note || "None"}`
  );
}

function formatNotification(n: DonkiNotification): string {
  return (
    `Message ID: ${n.messageID}\n` +
    `Type: ${n.messageType}\n` +
    `Issue Time: ${n.messageIssueTime}\n` +
    `URL: ${n.messageURL}\n` +
    `Body:\n${n.messageBody}`
  );
}

export const donki_cme = tool({
  description: "Get coronal mass ejections",
  inputSchema: dateRangeSchema,
  execute: async ({ start_date, end_date }) => {
    try {
      const range = { startDate: start_date, endDate: end_date }
      const result = await nasa.donki.cme(range)
      return result.map(formatCmeEvent).join("\n---\n")
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
            return result.map(formatCmeEvent).join("\n---\n")
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
      return result.map(formatSolarFlare).join("\n---\n")
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
            return result.map(formatGeomagneticStorm).join("\n---\n")
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
    try {
      const result = await nasa.donki.solarEnergeticParticles({ startDate: start_date, endDate: end_date })
      return result.map(formatSep).join("\n---\n")
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

export const donki_mpc = tool({
  description: "Get magnetopause crossings",
  inputSchema: dateRangeSchema,
  execute: async ({ start_date, end_date }) => {
        try {
            const result = await nasa.donki.magnetopauseCrossings({ startDate: start_date, endDate: end_date })
            return result.map(formatMpc).join("\n---\n")
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
            return result.map(formatIps).join("\n---\n")
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
            return result.map(formatRbe).join("\n---\n")
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
            return result.map(formatHss).join("\n---\n")
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
            return result.map(formatWsa).join("\n---\n")
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
            return result.map(formatNotification).join("\n---\n")
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
