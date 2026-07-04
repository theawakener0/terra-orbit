import { useTerminalDimensions } from "@opentui/solid"
import { Logo } from "../components/logo"
import { Prompt } from "../components/prompt"
import { useTheme } from "../context/theme"

export function Home() {
  const { theme } = useTheme()
  const dimensions = useTerminalDimensions()

  return (
    <box
      width={dimensions().width}
      height={dimensions().height}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      backgroundColor={theme.background}
    >
      <box flexGrow={1} />
      <Logo />
      <box height={2} />
      <box width="80%" maxWidth={60}>
        <Prompt autofocus />
      </box>
      <box flexGrow={1} />
    </box>
  )
}
