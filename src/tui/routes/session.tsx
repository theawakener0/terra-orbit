import { useTerminalDimensions } from "@opentui/solid"
import { useTheme } from "../context/theme"
import { MessageList } from "../components/message-list"
import { Prompt } from "../components/prompt"

export function Session() {
  const { theme } = useTheme()
  const dimensions = useTerminalDimensions()

  return (
    <box
      width={dimensions().width}
      height={dimensions().height}
      flexDirection="column"
      backgroundColor={theme.background}
    >
      {/* Header bar */}
      <box
        flexDirection="row"
        justifyContent="space-between"
        padding={1}
        border={["bottom"]}
        borderColor={theme.border}
      >
        <text fg={theme.text}>Terra Orbit</text>
        <text fg={theme.primary}>Tab to switch agent</text>
      </box>

      {/* Messages */}
      <MessageList />

      {/* Input */}
      <box border={["top"]} borderColor={theme.border} padding={1}>
        <Prompt />
      </box>
    </box>
  )
}
