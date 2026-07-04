import { hackclub, model } from "../../harness/config"
import { streamText, isStepCount } from "ai"
import { context } from "../../harness/context"
import { tools } from "../../harness/tools"

export type StreamCallbacks = {
  onToken: (token: string) => void
  onDone: (fullText: string) => void
  onError: (error: Error) => void
}

export async function streamTerraResponse(
  prompt: string,
  callbacks: StreamCallbacks,
): Promise<void> {
  try {
    const result = streamText({
      model: hackclub(model),
      instructions: context.full,
      tools: {
        ...tools,
      },
      stopWhen: isStepCount(50),
      maxRetries: 3,
      prompt,
    })

    let fullText = ""
    for await (const text of result.textStream) {
      fullText += text
      callbacks.onToken(text)
    }
    callbacks.onDone(fullText)
  } catch (err) {
    callbacks.onError(err instanceof Error ? err : new Error(String(err)))
  }
}
