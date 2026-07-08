import {
  streamText,
  convertToModelMessages,
  toUIMessageStream,
  createUIMessageStreamResponse,
} from "ai";
import { hackclub, model } from "../../harness/config";
import { tools } from "../../harness/tools";
import { orbit } from "../../harness/subagents";
import { context } from "../../harness/context";

export async function handleChat(req: Request) {
  try {
    const { messages } = await req.json();

    const sanitized = messages.map((m: Record<string, unknown>) => ({
      ...m,
      parts: (m.parts as Record<string, unknown>[])?.filter(
        (p: Record<string, unknown>) => p.type !== "file"
      ),
    }));

    const result = streamText({
      model: hackclub(model),
      instructions: context.terra,
      messages: await convertToModelMessages(sanitized),
      tools: { ...tools, ...orbit },
      maxSteps: 100,
      maxRetries: 10,
      toolChoice: "auto",
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: result.stream,
        sendReasoning: true,
        originalMessages: messages,
        messageMetadata: ({ part }) => {
          if (part.type === "finish") {
            return {
              totalUsage: part.totalUsage,
              finishReason: part.finishReason,
            };
          }
          return undefined;
        },
        onError: (error) => {
          if (error instanceof Error) return error.message;
          if (typeof error === "string") return error;
          try {
            return JSON.stringify(error);
          } catch {
            return "An error occurred";
          }
        },
      }),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
