import { handleChat } from "./api/chat";

const PORT = parseInt(process.env.PORT || "3000");
const DIST = "./src/webui/dist";

export function startServer() {
  Bun.serve({
    port: PORT,
    idleTimeout: 120,
    async fetch(req) {
      const url = new URL(req.url);

      if (req.method === "OPTIONS") {
        return new Response(null, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        });
      }

      if (url.pathname === "/api/chat" && req.method === "POST") {
        return handleChat(req);
      }

      const filePath = url.pathname === "/" ? "/index.html" : url.pathname;
      const file = Bun.file(`${DIST}${filePath}`);
      if (await file.exists()) {
        return new Response(file);
      }

      const index = Bun.file(`${DIST}/index.html`);
      if (await index.exists()) {
        return new Response(index);
      }

      return new Response("Not found", { status: 404 });
    },
  });

  console.log(`TerraOrbit running at http://localhost:${PORT}`);
}

if (import.meta.main) {
  startServer();
}
