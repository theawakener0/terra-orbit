import { createSignal, createMemo, For } from "solid-js"
import { useKeyboard, useRenderer } from "@opentui/solid"
import { useTheme } from "../context/theme"
import { useAgent } from "../context/agent"
import { useInput } from "../context/input"

type PromptProps = {
  autofocus?: boolean
}

export function Prompt(props: PromptProps) {
  const renderer = useRenderer()
  const { theme } = useTheme()
  const agent = useAgent()
  const inputCtx = useInput()

  const currentAgent = agent.current()
  const agentColor = currentAgent.color

  const placeholder = createMemo(() => {
    if (currentAgent.mode === "commands") {
      return "Type / for commands..."
    }
    return "Ask Terra anything about space..."
  })

  const displayValue = createMemo(() => {
    const val = inputCtx.getValue()
    return val || placeholder()
  })

  const isPlaceholder = createMemo(() => !inputCtx.getValue())

  return (
    <box flexDirection="column" border={["left"]} borderColor={agentColor} paddingLeft={1}>
      <box flexDirection="row">
        <text fg={agentColor}>
          {currentAgent.name === "terra" ? "Terra" : "Terra"} {">"}{" "}
        </text>
        <text fg={isPlaceholder() ? theme.textMuted : theme.text}>
          {displayValue() + " "}
        </text>
        <text bg={agentColor}> </text>
      </box>
      <box flexDirection="row" gap={1}>
        <text fg={theme.textMuted}>
          [{currentAgent.name}] {currentAgent.description} • Tab to switch • Enter to submit
        </text>
      </box>
    </box>
  )
}
