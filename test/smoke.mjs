import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const binPath = join(root, "bin", "terra-orbit.mjs");

let passed = 0;
let failed = 0;
let totalChecks = 0;

function check(desc, ok) {
  totalChecks++;
  if (ok) { passed++; console.log(`  PASS  ${desc}`); }
  else { failed++; console.error(`  FAIL  ${desc}`); }
}

// ── Test 1: dist files exist ──────────────────────────────────────
{
  const files = [
    ["dist/index.js", "bundled entry"],
    ["dist/BASE.txt", "base prompt"],
    ["dist/TERRA.txt", "terra prompt"],
    ["dist/webui/index.html", "web UI HTML"],
  ];
  for (const [rel, label] of files) {
    try {
      const stat = await import("node:fs/promises").then(m => m.stat(join(root, rel)));
      check(`${rel} (${label}) exists`, stat.size > 0);
    } catch { check(`${rel} (${label}) exists`, false); }
  }
}

// ── Test 2: dist/index.js has no Bun references ───────────────────
{
  const content = await readFile(join(root, "dist", "index.js"), "utf-8");
  check("dist/index.js has zero Bun references", !content.includes("Bun."));
  check("dist/index.js has zero bun: imports", !content.includes('from "bun"'));
}

// ── Test 3: usage message printed with no flags ───────────────────
{
  const out = await new Promise((resolve) => {
    const proc = spawn("node", [binPath], { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "", stderr = "";
    proc.stdout.on("data", (d) => stdout += d);
    proc.stderr.on("data", (d) => stderr += d);
    proc.on("exit", () => resolve({ stdout, stderr }));
    setTimeout(() => { proc.kill(); resolve({ stdout, stderr }); }, 3000);
  });
  check("no-flag prints usage", out.stdout.includes("Usage:"));
}

// ── Test 4: server starts and serves SPA HTML ─────────────────────
{
  let server;
  const result = await new Promise((resolve) => {
    server = spawn("node", [binPath, "--web"], {
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, NASA_API_KEY: "DEMO_KEY", HACK_CLUB_AI_API_KEY: "DEMO_KEY", PORT: "34567" },
    });

    let started = false;
    server.stdout.on("data", (d) => {
      const text = d.toString();
      if (text.includes("TerraOrbit running")) started = true;
    });

    setTimeout(async () => {
      const results = [];
      results.push(["server started message", started]);

      if (started) {
        try {
          const res = await fetch("http://localhost:34567/");
          results.push(["GET / status 200", res.status === 200]);
          const html = await res.text();
          results.push(["GET / returns HTML", html.includes("<!doctype")]);

          // invalid chat request should return an error, not crash
          const chatRes = await fetch("http://localhost:34567/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          });
          results.push(["POST /api/chat (invalid) returns JSON", chatRes.headers.get("content-type")?.includes("json")]);
          const chatBody = await chatRes.json();
          results.push(["POST /api/chat (invalid) returns error", !!chatBody.error]);

          // test CORS preflight
          const corsRes = await fetch("http://localhost:34567/api/chat", {
            method: "OPTIONS",
          });
          results.push(["OPTIONS returns 204", corsRes.status === 204]);
        } catch (e) {
          results.push(["HTTP requests failed", false]);
        }
      }

      server.kill();
      resolve(results);
    }, 1500);
  });

  for (const [desc, ok] of result) check(desc, ok);
}

// ── Report ────────────────────────────────────────────────────────
console.log(`\n${passed}/${totalChecks} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
