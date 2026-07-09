import {
  streamText,
  isStepCount,
  convertToModelMessages,
  toUIMessageStream,
  createUIMessageStreamResponse,
} from "ai";

import { hackclub, model } from "../../harness/config";
import { tools } from "../../harness/tools";
import { orbit } from "../../harness/subagents";
import { context } from "../../harness/context";

function safeStream(stream: ReadableStream) {
  const reader = stream.getReader();
  let done = false;

  return new ReadableStream({
    async pull(controller) {
      if (done) { controller.close(); return; }

      try {
        const result = await reader.read();
        if (result.done) {
          done = true;
          controller.close();
        } else {
          controller.enqueue(result.value);
        }
      } catch (error) {
        done = true;
        const text =
          error instanceof Error
            ? error.message
            : typeof error === "string"
              ? error
              : JSON.stringify(error);
        controller.enqueue({ type: "error", error: text });
        controller.enqueue({
          type: "finish",
          finishReason: "error",
          usage: { promptTokens: 0, completionTokens: 0 },
        });
        controller.close();
      }
    },
    cancel(reason) {
      reader.cancel(reason);
    },
  });
}

function isValidMessages(body: unknown): body is { messages: Record<string, unknown>[] } {
  if (!body || typeof body !== "object") return false;
  const obj = body as Record<string, unknown>;
  if (!Array.isArray(obj.messages)) return false;
  return obj.messages.every(
    (m: unknown) => m && typeof m === "object" && typeof (m as Record<string, unknown>).role === "string"
  );
}

export async function handleChat(req: Request) {
  try {
    const body = await req.json();
    if (!isValidMessages(body)) {
      return new Response(JSON.stringify({ error: "Invalid request: messages array required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const sanitized = body.messages.map((m: Record<string, unknown>) => ({
      ...m,
      parts: (m.parts as Record<string, unknown>[])?.filter(
        (p: Record<string, unknown>) => p.type !== "file"
      ),
    }));

    const result = streamText({
      model: hackclub(model),
      instructions: context.terra,
      messages: await convertToModelMessages(sanitized as any),
      tools: { ...tools, ...orbit },
      stopWhen: isStepCount(100),
      maxRetries: 10,
      toolChoice: "auto",
    });

    const uiStream = toUIMessageStream({
      stream: safeStream(result.stream),
      sendReasoning: true,
      originalMessages: body.messages as any,
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
    });

    return createUIMessageStreamResponse({
      stream: uiStream,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
