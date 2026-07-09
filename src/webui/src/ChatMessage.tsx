import type { UIMessage } from "ai";
import ReasoningBlock from "./ReasoningBlock";
import StepSeparator from "./StepSeparator";
import ResponseStats from "./ResponseStats";
import ToolCallCard from "./ToolCallCard";

interface ToolPartData {
  toolName: string;
  state: "input-streaming" | "input-available" | "output-available" | "output-error";
  input: Record<string, unknown>;
  output: unknown;
  errorText?: string;
}

function isToolPart(part: Record<string, unknown>): ToolPartData | null {
  const type = part.type;
  if (type === "dynamic-tool" || (typeof type === "string" && type.startsWith("tool-"))) {
    return {
      toolName: (part.toolName as string) || ((typeof type === "string" ? type.replace(/^tool-/, "") : "")),
      state: (part.state as "input-streaming" | "input-available" | "output-available" | "output-error") || "input-available",
      input: (part.input as Record<string, unknown>) ?? {},
      output: part.output,
      errorText: part.errorText as string | undefined,
    };
  }
  return null;
}

function getMessageUsage(
  metadata: unknown,
): { totalTokens?: number; finishReason?: string } | undefined {
  if (!metadata || typeof metadata !== "object") return undefined;
  const m = metadata as Record<string, unknown>;
  const totalUsage = m.totalUsage as { totalTokens?: number } | undefined;
  const finishReason = m.finishReason as string | undefined;
  if (!totalUsage && !finishReason) return undefined;
  return { ...totalUsage, finishReason };
}

export default function ChatMessage({ message }: { message: UIMessage }) {
  const metadata = getMessageUsage(message.metadata);

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

          const toolPart = isToolPart(part as unknown as Record<string, unknown>);
          if (toolPart) {
            return <ToolCallCard key={index} part={toolPart} />;
          }

          return null;
        }) : null}
      </div>
      {metadata && (
        <ResponseStats
          usage={metadata.totalTokens != null ? { totalTokens: metadata.totalTokens } : undefined}
          finishReason={metadata.finishReason}
        />
      )}
    </div>
  );
}