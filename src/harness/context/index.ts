import { file } from "bun";

const terra = await file(new URL("./TERRA.txt", import.meta.url)).text();
const base = await file(new URL("./BASE.txt", import.meta.url)).text();

export const context = {
    terra,
    base,
    /** Combined context: Terra identity layered on top of base principles */
    full: `${terra}\n\n---\n\n${base}`,
} as const;
