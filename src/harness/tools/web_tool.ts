import { tool } from "ai";
import { z } from "zod";

const EXA_BASE = "https://ai.hackclub.com/proxy/v1/exa";

interface ExaResult {
  title?: string
  url?: string
  publishedDate?: string
  author?: string
  text?: string
  score?: number
}

function isExaResult(v: unknown): v is ExaResult {
  return typeof v === "object" && v !== null;
}

function formatResult(r: ExaResult): string {
  const lines: string[] = [];
  if (r.title) lines.push(`Title: ${r.title}`);
  if (r.url) lines.push(`URL: ${r.url}`);
  if (r.publishedDate) lines.push(`Published: ${r.publishedDate}`);
  if (r.author) lines.push(`Author: ${r.author}`);
  if (r.score !== undefined) lines.push(`Score: ${r.score}`);
  if (r.text) lines.push(`Text:\n${r.text}`);
  return lines.join("\n");
}

function formatResultsList(data: unknown): string {
  const obj = data as Record<string, unknown>;
  const results = obj?.results;
  if (!Array.isArray(results) || results.length === 0) return "No results found.";
  return results.filter(isExaResult).map(formatResult).join("\n---\n");
}

async function exaFetch(endpoint: string, body: Record<string, unknown>): Promise<unknown> {
  const response = await fetch(`${EXA_BASE}/${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HACK_CLUB_AI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Exa API error ${response.status}: ${text || response.statusText}`);
  }

  return response.json();
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
    try {
      const data = await exaFetch("search", { query, numResults, includeDomains, excludeDomains, startPublishedDate, endPublishedDate });
      return formatResultsList(data);
    } catch (err) {
      return `Error: ${(err as Error).message}`;
    }
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
    try {
      const data = await exaFetch("findSimilar", { url, numResults, includeDomains, excludeDomains });
      return formatResultsList(data);
    } catch (err) {
      return `Error: ${(err as Error).message}`;
    }
  },
});

export const web_get_contents = tool({
  description: "Extract the full text content from one or more URLs.",
  inputSchema: z.object({
    urls: z.array(z.httpUrl()).min(1).max(25).describe("URLs to extract content from"),
    textMode: z.boolean().optional().default(true).describe("Return text-only version"),
  }),
  execute: async ({ urls, textMode }) => {
    try {
      const data = await exaFetch("contents", { urls, textMode });
      return formatResultsList(data);
    } catch (err) {
      return `Error: ${(err as Error).message}`;
    }
  },
});

export const web_answer = tool({
  description: "Ask a question and get an answer grounded in live web search results.",
  inputSchema: z.object({
    query: z.string().describe("The question to answer"),
    stream: z.boolean().optional().default(false),
  }),
  execute: async ({ query, stream }) => {
    try {
      const data = await exaFetch("answer", { query, stream }) as Record<string, unknown>;
      if (typeof data?.answer === "string") return data.answer;
      return formatResultsList(data);
    } catch (err) {
      return `Error: ${(err as Error).message}`;
    }
  },
});

export const web_tools = {
    web_search: web_search,
    web_find_similar: web_find_similar,
    web_get_contents: web_get_contents,
    web_answer: web_answer,
};
