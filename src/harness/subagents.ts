import { ToolLoopAgent, isStepCount, tool } from "ai";
import { z } from "zod";
import { donki_tools } from "./tools/donki_tool";
import { neo_tools } from "./tools/neo_tool";
import { web_tools } from "./tools/web_tool";
import { eonet_tools } from "./tools/eonet_tool";
import { epic_tools } from "./tools/epic_tool";
import { apod_tools } from "./tools/apod_tool";
import { imagery_tools } from "./tools/imagery_tool";
import {techtransfer_tools} from "./tools/techtransfer_tool";
import { hackclub, subagentModel } from "./config";

const helios = new ToolLoopAgent({
    model: hackclub(subagentModel),
    instructions: "You are Helios a space weather expert, a solar physics expert, and a specialized subagent for querying, cross-referencing, and interpreting the multi-endpoint DONKI data into precise, actionable space weather forecasting to deliver advanced space weather intelligence",
    tools: {
       ...donki_tools 
    },
    maxRetries: 5,
    toolChoice: "required",
    stopWhen: isStepCount(30), 
});

const aegis = new ToolLoopAgent({
    model: hackclub(subagentModel),
    instructions: "You are Aegis a planetary defence, an asteriod intelligence, and a specialized subagent for utilizing NASA NEO and live web intelligence to track, contextually scale (size comparisons/orbital mechanics), and proactively flag high-interest or hazardous near-Earth objects that actively flags high-risk near-Earth objects, translating raw orbital vectors and sizing data into intuitive threat assessments and physical scale comparisons",
    tools: {
        ...neo_tools,
        ...web_tools
    },
    maxRetries: 5,
    toolChoice: "required",
    stopWhen: isStepCount(30),
});

const gaia = new ToolLoopAgent({
    model: hackclub(subagentModel),
    instructions: "You are Gaia an earth observatory, a disaster response, and specialized subagent for merging NASA EONET dynamic threat tracking with EPIC satellite imagery delivring instant, visually paired context on active wildfires, hurricanes, and volcanic eruptions in a single turn",
    tools: {
        ...eonet_tools,
        ...epic_tools
    },
    maxRetries: 5,
    toolChoice: "required",
    stopWhen: isStepCount(30),
});

const chronos = new ToolLoopAgent({
    model: hackclub(subagentModel),
    instructions: "You are Chronos a NASA imagery curator, an archivist, and  a specialized subagent integrating APOD, the NASA image library, and EPIC data into a singular visual ecosystem. Acts as a master storyteller, deep-diving into the cosmic history, engineering context, and structural beauty behind every image",
    tools: {
        ...apod_tools,
        ...imagery_tools,
        ...epic_tools
    },
    maxRetries: 5,
    toolChoice: "required",
    stopWhen: isStepCount(30),
});

const prometheus = new ToolLoopAgent({
    model: hackclub(subagentModel),
    instructions: "You are Prometheus a NASA spinoffs, a tech transfer, and a specialized subagent trained to explore NASA's active patent portfolio, free open-source software catalog, and commercial spinoff history. Built to help developers, entrepreneurs, and makers find, license, and weaponize space-grade technology for Earth applications",
    tools: {
        ...techtransfer_tools,
        ...web_tools
    },
    maxRetries: 5,
    toolChoice: "required",
    stopWhen: isStepCount(30),
});

const argus = new ToolLoopAgent({
    model: hackclub(subagentModel),
    instructions: "You are Argus a deep web researcher, a data miner, and a specialized research subagent bypassing traditional keyword search to leverage Exa’s neural embeddings. Built to extract clean, token-efficient webpage highlights, parse full-text documents, and deliver highly objective, source-grounded synthesis when internal APIs lack coverage",
    tools: {
        ...web_tools
    },
    maxRetries: 5,
    toolChoice: "required",
    stopWhen: isStepCount(30),
});

export const helios_subagent = tool({
    description: "Helios is a space weather expert, a solar physics expert, and a specialized subagent for querying, cross-referencing, and interpreting the multi-endpoint DONKI data into precise, actionable space weather forecasting to deliver advanced space weather intelligence",
    inputSchema: z.object({
        task: z.string().describe("The task to be performed by Helios"),
    }),
    execute: async ({task}, {abortSignal}) => {
        try {
            const result = await helios.generate({
                prompt: task,
                abortSignal,
            });
            return result.text;
        } catch (err) {
            return `Error from helios: ${(err as Error).message}`;
        }
    },
});

export const aegis_subagent = tool({
    description: "Aegis is a planetary defence, an asteriod intelligence, and a specialized subagent for utilizing NASA NEO and live web intelligence to track, contextually scale (size comparisons/orbital mechanics), and proactively flag high-interest or hazardous near-Earth objects that actively flags high-risk near-Earth objects, translating raw orbital vectors and sizing data into intuitive threat assessments and physical scale comparisons",
    inputSchema: z.object({
        task: z.string().describe("The task to be performed by Aegis"),
    }),
    execute: async ({task}, {abortSignal}) => {
        try {
            const result = await aegis.generate({
                prompt: task,
                abortSignal,
            });
            return result.text;
        } catch (err) {
            return `Error from aegis: ${(err as Error).message}`;
        }
    },
});

export const gaia_subagent = tool({
    description: "Gaia is an earth observatory, a disaster response, and specialized subagent for merging NASA EONET dynamic threat tracking with EPIC satellite imagery delivring instant, visually paired context on active wildfires, hurricanes, and volcanic eruptions in a single turn",
    inputSchema: z.object({
        task: z.string().describe("The task to be performed by Gaia"),
    }),
    execute: async ({task}, {abortSignal}) => {
        try {
            const result = await gaia.generate({
                prompt: task,
                abortSignal,
            });
            return result.text;
        } catch (err) {
            return `Error from gaia: ${(err as Error).message}`;
        }
    },
});

export const chronos_subagent = tool({
    description: "Chronos is a NASA imagery curator, an archivist, and  a specialized subagent integrating APOD, the NASA image library, and EPIC data into a singular visual ecosystem. Acts as a master storyteller, deep-diving into the cosmic history, engineering context, and structural beauty behind every image",
    inputSchema: z.object({
        task: z.string().describe("The task to be performed by Chronos"),
    }),
    execute: async ({task}, {abortSignal}) => {
        try {
            const result = await chronos.generate({
                prompt: task,
                abortSignal,
            });
            return result.text;
        } catch(err) {
            return `Error from chronos: ${(err as Error).message}`; 
        }
    },
});

export const prometheus_subagent = tool({
    description: "Prometheus is a NASA spinoffs, a tech transfer, and a specialized subagent trained to explore NASA's active patent portfolio, free open-source software catalog, and commercial spinoff history. Built to help developers, entrepreneurs, and makers find, license, and weaponize space-grade technology for Earth applications",
    inputSchema: z.object({
        task: z.string().describe("The task to be performed by Prometheus"),
    }),
    execute: async ({task}, {abortSignal}) => {
        try {
            const result = await prometheus.generate({
                prompt: task,
                abortSignal,
            });
            return result.text;
        } catch(err) {
            return `Error from prometheus: ${(err as Error).message}`;
        }
    },
});

export const argus_subagent = tool({
    description: "Argus is a deep web researcher, a data miner, and a specialized research subagent bypassing traditional keyword search to leverage Exa’s neural embeddings. Built to extract clean, token-efficient webpage highlights, parse full-text documents, and deliver highly objective, source-grounded synthesis when internal APIs lack coverage",
    inputSchema: z.object({
        task: z.string().describe("The task to be performed by Argus"),
    }),
    execute: async ({task}, {abortSignal}) => {
        try {
            const result = await argus.generate({
                prompt: task,
                abortSignal,
            });
            return result.text;
        } catch (err) {
            return `Error from argus: ${(err as Error).message}`;
        }
    },
});

export const orbit = {
    helios: helios_subagent,
    aegis: aegis_subagent,
    gaia: gaia_subagent,
    chronos: chronos_subagent,
    prometheus: prometheus_subagent,
    argus: argus_subagent,
}

