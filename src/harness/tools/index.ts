import { NasaClient } from "../../nasa";
import { tool } from "ai";
import { z } from "zod";
import { apod_tools } from "./apod_tool";
import { neo_tools } from "./neo_tool";
import { donki_tools } from "./donki_tool";
import { techtransfer_tools } from "./techtransfer_tool";
import { eonet_tools } from "./eonet_tool";
import { epic_tools } from "./epic_tool";
import { imagery_tools } from "./imagery_tool";
import { web_tools } from "./web_tool";


export const nasa = new NasaClient(Bun.env.NASA_API_KEY!);

const timeTool = tool({
    description: "Get the current time",
    inputSchema: z.object({}),
    execute: async () => {
        return Date.now();
    }
}); 

export const tools = {
    ...apod_tools,
    ...neo_tools,
    ...donki_tools,
    ...techtransfer_tools,
    ...eonet_tools,
    ...epic_tools,
    ...imagery_tools,
    ...web_tools,
    time: timeTool,
};
