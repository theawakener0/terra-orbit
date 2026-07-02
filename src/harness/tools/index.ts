import { NasaClient } from "../../nasa";
import { apod_tools } from "./apod_tool";
import { neo_tools } from "./neo_tool";
import { donki_tools } from "./donki_tool";
import { techtransfer_tools } from "./techtransfer_tool";
import { web_tools } from "./web_tool";


export const nasa = new NasaClient(Bun.env.NASA_API_KEY!);

export const tools = {
    apod_tools,
    neo_tools,
    donki_tools,
    techtransfer_tools,
    web_tools,
};
