import { createEffect, Show } from "solid-js"
import { useTheme } from "../context/theme"
import { useSession } from "../context/session"
import { Message } from "./message"

export function MessageList() {
  const { theme } = useTheme()
  const session = useSession()

  return (
    <box
      flexDirection="column"
      flexGrow={1}
      minHeight={0}
      overflow="hidden"
      padding={1}
    >
      <Show
        when={session.session().messages.length > 0}
        fallback={
          <box flexGrow={1} alignItems="center" justifyContent="center">
            <text fg={theme.textMuted}>
              Type a command or ask Terra about space
            </text>
          </box>
        }
      >
        {session.session().messages.map((msg) => (
          <Message message={msg} />
        ))}
        <Show when={session.isStreaming()}>
          <box flexDirection="row" paddingLeft={1} marginBottom={1}>
            <text fg={theme.primary}>Terra is thinking...</text>
          </box>
        </Show>
      </Show>
    </box>
  )
}
