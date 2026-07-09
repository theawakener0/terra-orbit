import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export const hackclub = createOpenRouter({
    apiKey: Bun.env.HACK_CLUB_AI_API_KEY,
    baseURL: "https://ai.hackclub.com/proxy/v1",
});

export const model = "nvidia/nemotron-3-ultra-550b-a55b:free";
export const subagentModel = "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free";
