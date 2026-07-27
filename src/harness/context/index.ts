import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const terra = await readFile(resolve(__dirname, "TERRA.txt"), "utf-8");
const base = await readFile(resolve(__dirname, "BASE.txt"), "utf-8");

export const context = {
    terra,
    base,
    full: `${terra}\n\n---\n\n${base}`,
};
