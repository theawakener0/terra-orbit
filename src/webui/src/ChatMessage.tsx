import type { UIMessage } from "ai";
import ReasoningBlock from "./ReasoningBlock";
import StepSeparator from "./StepSeparator";
import ResponseStats from "./ResponseStats";
import ToolCallCard from "./ToolCallCard";

function getToolPart(part: Record<string, unknown>) {
  const type = part.type as string;
  if (!type) return null;
  if (type === "dynamic-tool" || type.startsWith("tool-")) {
    return {
      toolName: (part.toolName as string) || type.replace(/^tool-/, ""),
      state: (part.state as "input-streaming" | "input-available" | "output-available" | "output-error") || "input-available",
      input: (part.input as Record<string, unknown>) || {},
      output: part.output,
      errorText: part.errorText as string | undefined,
    };
  }
  return null;
}

export default function ChatMessage({ message }: { message: UIMessage }) {
  return (
    <div className={`message ${message.role}`}>
      <div className="message-label">
        {message.role === "user" ? "you" : "Terra"}
      </div>
      <div className="message-content">
        {Array.isArray(message.parts) ? message.parts.map((part, index) => {
          if (!part || !part.type) return null;

          if (part.type === "text") {
            return (
              <div key={index} className="text-part">
                {part.text}
              </div>
            );
          }

          if (part.type === "reasoning") {
            return <ReasoningBlock key={index} text={part.text} />;
          }

          if (part.type === "step-start") {
            return <StepSeparator key={index} />;
          }

          const toolPart = getToolPart(part as unknown as Record<string, unknown>);
          if (toolPart) {
            return <ToolCallCard key={index} part={toolPart} />;
          }

          return null;
        }) : null}
      </div>
      <ResponseStats
        usage={(message.metadata as Record<string, unknown>)?.totalUsage as { totalTokens?: number } | undefined}
        finishReason={(message.metadata as Record<string, unknown>)?.finishReason as string | undefined}
      />
    </div>
  );
}
