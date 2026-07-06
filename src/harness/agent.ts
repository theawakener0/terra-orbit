import { ToolLoopAgent, isStepCount } from "ai";
import { hackclub, model } from "./config";
import { tools } from "./tools";
import { context } from "./context";
import { orbit } from "./subagents";

export const terra = new ToolLoopAgent({
    model: hackclub(model),
    instructions: context.terra,
    tools: {
        ...tools,
        ...orbit,
    },
    toolChoice: "auto",
    stopWhen: isStepCount(100),
    maxRetries: 10,
});
