import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { NasaClient } from "../nasa";
import { homedir } from "os";
import { join } from "path";
import { readFile } from "node:fs/promises";

const configPath = join(homedir(), ".config", "terra-orbit", "config.json");

interface AppConfig {
    [key: string]: string | undefined;
}

let config: AppConfig = {};

try {
    const content = await readFile(configPath, "utf-8");
    config = JSON.parse(content) as AppConfig;
} catch (error) {
    if ((error as NodeJS.ErrnoException)?.code !== "ENOENT") {
        console.warn(`Warning: Failed to parse config file at ${configPath}. Using defaults.`, error);
    }
}

function get(key: string): string | undefined {
    return config[key] ?? process.env[key];
}

export const hackclub = createOpenRouter({
    apiKey: get("HACK_CLUB_AI_API_KEY"),
    baseURL: "https://ai.hackclub.com/proxy/v1",
});

export const nasa = new NasaClient(get("NASA_API_KEY")!);
export const model: string | undefined = get("MAIN_MODEL");
export const subagentModel: string | undefined = get("SUB_MODEL");
export const port: number = parseInt(get("PORT") || "3000", 10);
