import { ToolLoopAgent, isStepCount } from "ai";
import { hackclub, model } from "./config";
import { tools } from "./tools";
import { context } from "./context";

export const terra = new ToolLoopAgent({
    model: hackclub(model),
    instructions: context.terra,
    tools: {
        ...tools,
    },
    toolChoice: "auto",
    stopWhen: isStepCount(100),
    maxRetries: 10,
});
