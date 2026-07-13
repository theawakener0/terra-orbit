#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, "..", "dist", "index.js");

const result = spawnSync("bun", ["run", dist, ...process.argv.slice(2)], {
  stdio: "inherit",
});

process.exit(result.status ?? 1);
