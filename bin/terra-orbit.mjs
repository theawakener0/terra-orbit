#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const [major] = process.versions.node.split(".").map(Number);
if (major < 18) {
  console.error(`terra-orbit requires Node.js >= 18 (current: ${process.version})`);
  process.exit(1);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, "..", "dist", "index.js");

import(dist).catch((err) => {
  console.error("Failed to start terra-orbit:", err?.message ?? err);
  process.exit(1);
});
