import { handleChat } from "./api/chat";
import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { readFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, extname } from "node:path";
import { port as cfgPort } from "../harness/config";

const PORT = cfgPort;

const dir = dirname(fileURLToPath(import.meta.url));
const prodDist = resolve(dir, "webui");
const devDist = resolve(dir, "../webui/dist");

let DIST: string;
try {
  await access(resolve(prodDist, "index.html"), constants.F_OK);
  DIST = prodDist;
} catch {
  DIST = devDist;
}

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".json": "application/json",
};

const CACHEABLE_EXTS = new Set([
  ".js", ".css", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".woff2",
]);

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolveBody) => {
    let data = "";
    req.on("data", (chunk: string) => (data += chunk));
    req.on("end", () => resolveBody(data));
  });
}

async function serveStatic(filePath: string, res: ServerResponse): Promise<boolean> {
  const fullPath = resolve(DIST, "." + filePath);
  try {
    await access(fullPath, constants.F_OK);
    const content = await readFile(fullPath);
    const ext = extname(filePath).toLowerCase();
    const mime = MIME_TYPES[ext] ?? "application/octet-stream";
    const cacheMaxAge = CACHEABLE_EXTS.has(ext) ? 86400 : 0;
    res.writeHead(200, {
      "Content-Type": mime,
      "Content-Length": content.length.toString(),
      "Cache-Control": `public, max-age=${cacheMaxAge}`,
    });
    res.end(content);
    return true;
  } catch {
    return false;
  }
}

export function startServer() {
  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      });
      res.end();
      return;
    }

    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

    if (url.pathname === "/api/chat" && req.method === "POST") {
      const body = await readBody(req);

      const webReq = new Request(`http://${req.headers.host}${url.pathname}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      const webRes = await handleChat(webReq);

      const status = webRes.status;
      const headers: Record<string, string> = {};
      webRes.headers.forEach((value, key) => { headers[key] = value; });

      res.writeHead(status, headers);

      if (webRes.body) {
        const reader = webRes.body.getReader();
        let aborted = false;
        res.on("close", () => { aborted = true; reader.cancel().catch(() => {}); });

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (aborted) break;
            if (!res.write(value)) {
              await new Promise((resolve) => res.once("drain", resolve));
            }
          }
        } catch (err) {
          if (!aborted) console.error("Stream error:", err);
        }
        if (!aborted) res.end();
      } else {
        res.end();
      }
      return;
    }

    const filePath = url.pathname === "/" ? "/index.html" : url.pathname;

    if (await serveStatic(filePath, res)) return;

    if (await serveStatic("/index.html", res)) return;

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  });

  server.keepAliveTimeout = 120_000;

  server.listen(PORT, () => {
    console.log(`TerraOrbit running at http://localhost:${PORT}`);
  });

  process.on("SIGINT", () => { server.close(); process.exit(0); });
  process.on("SIGTERM", () => { server.close(); process.exit(0); });
}

if (import.meta.main) {
  startServer();
}
