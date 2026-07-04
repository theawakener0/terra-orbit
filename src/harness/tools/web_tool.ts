import { tool } from "ai";
import { z } from "zod";

const EXA_BASE = "https://ai.hackclub.com/proxy/v1/exa";

async function exaFetch(endpoint: string, body: Record<string, unknown>): Promise<string> {
  const response = await fetch(`${EXA_BASE}/${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Bun.env.HACK_CLUB_AI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Exa API error ${response.status}: ${text || response.statusText}`);
  }

  const data = await response.json();
  return JSON.stringify(data, null, 2);
}

export const web_search = tool({
  description: "Search the web using Exa. Returns matching pages with snippets.",
  inputSchema: z.object({
    query: z.string().describe("The search query"),
    numResults: z.number().min(1).max(50).optional().default(10),
    includeDomains: z.array(z.string()).optional().describe("Only search these domains"),
    excludeDomains: z.array(z.string()).optional().describe("Exclude these domains"),
    startPublishedDate: z.string().optional().describe("Earliest publish date (ISO 8601)"),
    endPublishedDate: z.string().optional().describe("Latest publish date (ISO 8601)"),
  }),
  execute: async ({ query, numResults, includeDomains, excludeDomains, startPublishedDate, endPublishedDate }) => {
    return exaFetch("search", { query, numResults, includeDomains, excludeDomains, startPublishedDate, endPublishedDate });
  },
});

export const web_find_similar = tool({
  description: "Find web pages similar to a given URL.",
  inputSchema: z.object({
    url: z.httpUrl().describe("The URL to find similar pages for"),
    numResults: z.number().min(1).max(50).optional().default(10),
    includeDomains: z.array(z.string()).optional(),
    excludeDomains: z.array(z.string()).optional(),
  }),
  execute: async ({ url, numResults, includeDomains, excludeDomains }) => {
    return exaFetch("findSimilar", { url, numResults, includeDomains, excludeDomains });
  },
});

export const web_get_contents = tool({
  description: "Extract the full text content from one or more URLs.",
  inputSchema: z.object({
    urls: z.array(z.httpUrl()).min(1).max(25).describe("URLs to extract content from"),
    textMode: z.boolean().optional().default(true).describe("Return text-only version"),
  }),
  execute: async ({ urls, textMode }) => {
    return exaFetch("contents", { urls, textMode });
  },
});

export const web_answer = tool({
  description: "Ask a question and get an answer grounded in live web search results.",
  inputSchema: z.object({
    query: z.string().describe("The question to answer"),
    stream: z.boolean().optional().default(false),
  }),
  execute: async ({ query, stream }) => {
    return exaFetch("answer", { query, stream });
  },
});

export const web_tools = {
    web_search: web_search,
    web_find_similar: web_find_similar,
    web_get_contents: web_get_contents,
    web_answer: web_answer,
};
