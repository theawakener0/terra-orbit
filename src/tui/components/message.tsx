import { createMemo } from "solid-js"
import { useTheme } from "../context/theme"
import { useAgent } from "../context/agent"
import type { Message } from "../context/session"

type MessageProps = {
  message: Message
}

export function Message(props: MessageProps) {
  const { theme } = useTheme()
  const agent = useAgent()

  const color = createMemo(() => agent.color(props.message.agent))
  const isUser = props.message.role === "user"

  return (
    <box flexDirection="column" border={["left"]} borderColor={color()} paddingLeft={1} marginBottom={1}>
      <text fg={color()}>
        {isUser ? "You" : props.message.agent === "terra" ? "Terra" : "Terra"}{" "}
        <text fg={theme.textMuted}>{new Date(props.message.timestamp).toLocaleTimeString()}</text>
      </text>
      <text fg={theme.text}>
        {props.message.content}
      </text>
    </box>
  )
}
