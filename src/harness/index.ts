import { hackclub, model } from "./config";
import { streamText, isStepCount } from "ai";
import { context } from "./context";
import { tools } from "./tools";

const result = streamText({
    model: hackclub(model),
    instructions: context.base,
    tools: {
        ...tools,
    },
    stopWhen: isStepCount(50),
    maxRetries: 3,
    prompt: "What is the meaning of life?",
});

for await (const text of result.textStream) {
    process.stdout.write(text);
}
