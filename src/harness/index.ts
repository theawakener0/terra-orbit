import { hackclub, model } from "./config";
import { streamText } from "ai";

const result = streamText({
    model: hackclub(model),
    prompt: "What is the meaning of life?",
});

for await (const text of result.textStream) {
    Bun.stdout.write(text);
}


