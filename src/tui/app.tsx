import { useRenderer, useTerminalDimensions, useKeyboard } from "@opentui/solid"
import { Show } from "solid-js"
import { ThemeProvider, useTheme } from "./context/theme"
import { AgentProvider, useAgent } from "./context/agent"
import { RouteProvider, useRoute } from "./context/route"
import { SessionProvider, useSession } from "./context/session"
import { InputProvider, useInput } from "./context/input"
import { Home } from "./routes/home"
import { Session } from "./routes/session"
import { NasaClient } from "../nasa"
import { executeCommand, getHelpText, isCommand } from "./commands"
import { streamTerraResponse } from "./agents/terra"

const nasa = new NasaClient(Bun.env.NASA_API_KEY!)

function AppContent() {
  const renderer = useRenderer()
  const { theme } = useTheme()
  const agent = useAgent()
  const route = useRoute()
  const session = useSession()
  const input = useInput()
  const dimensions = useTerminalDimensions()

  // All keyboard handling in one place - no <input> component to conflict
  useKeyboard((key) => {
    // Skip modifier-only keys
    if (key.ctrl || key.meta || key.option) return

    // Tab - cycle agent forward
    if (key.name === "tab" && !key.shift) {
      agent.move(1)
      return
    }
    // Shift+Tab - cycle agent backward
    if (key.name === "tab" && key.shift) {
      agent.move(-1)
      return
    }
    // Enter - submit
    if (key.name === "enter") {
      const value = input.getValue()
      if (value.trim()) {
        input.onSubmit(value.trim())
        input.clear()
      }
      return
    }
    // Backspace - delete last char
    if (key.name === "backspace") {
      const val = input.getValue()
      input.setValue(val.slice(0, -1))
      return
    }
    // Ctrl+C - exit
    if (key.name === "c" && key.ctrl) {
      renderer.destroy()
      return
    }
    // Ctrl+L - clear session, go home
    if (key.name === "l" && key.ctrl) {
      session.clear()
      route.navigate({ type: "home" })
      return
    }
    // Ctrl+U - clear input
    if (key.name === "u" && key.ctrl) {
      input.clear()
      return
    }
    // Regular character - single printable char, no modifiers
    if (key.name && key.name.length === 1) {
      input.setValue(input.getValue() + key.name)
    }
  })

  return (
    <box
      width={dimensions().width}
      height={dimensions().height}
      flexDirection="column"
      backgroundColor={theme.background}
    >
      <Show when={route.data().type === "home"} fallback={<Session />}>
        <Home />
      </Show>
    </box>
  )
}

function AppInner() {
  const route = useRoute()
  const session = useSession()
  const agent = useAgent()

  const handleSubmit = async (value: string) => {
    // Navigate to session if on home
    if (route.data().type === "home") {
      route.navigate({ type: "session", sessionID: Date.now().toString() })
    }

    const currentAgent = agent.current()

    // Add user message
    session.addMessage({
      role: "user",
      content: value,
      agent: currentAgent.name,
    })

    if (currentAgent.mode === "commands") {
      // Direct command execution
      if (value === "/help" || value === "help") {
        session.addMessage({
          role: "assistant",
          content: getHelpText(),
          agent: "base",
        })
        return
      }

      if (!isCommand(value)) {
        session.addMessage({
          role: "assistant",
          content:
            "Unknown command. Available: " +
            "/apod, /neo, /epic, /donki, /eonet, /techtransfer, /imagery, /help\n" +
            "Switch to terra agent (Tab) for AI-powered natural language.",
          agent: "base",
        })
        return
      }

      const output = await executeCommand(value.slice(1), nasa)
      session.addMessage({
        role: "assistant",
        content: output,
        agent: "base",
      })
    } else {
      // AI agent streaming
      session.setStreaming(true)

      session.addMessage({
        role: "assistant",
        content: "",
        agent: "terra",
      })

      let fullText = ""
      await streamTerraResponse(value, {
        onToken: (token) => {
          fullText += token
          const msgs = session.session().messages
          const lastMsg = msgs[msgs.length - 1]
          if (lastMsg) {
            session.updateMessage(lastMsg.id, fullText)
          }
        },
        onDone: () => {
          session.setStreaming(false)
        },
        onError: (err) => {
          const msgs = session.session().messages
          const lastMsg = msgs[msgs.length - 1]
          if (lastMsg) {
            session.updateMessage(lastMsg.id, `Error: ${err.message}`)
          }
          session.setStreaming(false)
        },
      })
    }
  }

  return (
    <InputProvider onSubmit={handleSubmit}>
      <AppContent />
    </InputProvider>
  )
}

export function App() {
  return (
    <ThemeProvider>
      <AgentProvider>
        <RouteProvider>
          <SessionProvider>
            <AppInner />
          </SessionProvider>
        </RouteProvider>
      </AgentProvider>
    </ThemeProvider>
  )
}
