import { createContext, createSignal, useContext, batch, type ParentProps } from "solid-js"
import { RGBA } from "@opentui/core"

export type AgentInfo = {
  name: string
  description: string
  color: RGBA
  mode: "commands" | "ai"
}

const agents: AgentInfo[] = [
  {
    name: "base",
    description: "Direct NASA API commands",
    color: RGBA.fromHex("#00FF00"),
    mode: "commands",
  },
  {
    name: "terra",
    description: "AI-powered space exploration",
    color: RGBA.fromHex("#00BFFF"),
    mode: "ai",
  },
]

type AgentContext = {
  agents: () => AgentInfo[]
  current: () => AgentInfo
  set: (name: string) => void
  move: (direction: 1 | -1) => void
  color: (name: string) => RGBA
}

const ctx = createContext<AgentContext>()

export function AgentProvider(props: ParentProps) {
  const [currentName, setCurrentName] = createSignal("base")

  const value: AgentContext = {
    agents: () => agents,
    current: () => agents.find((a) => a.name === currentName()) ?? agents[0]!,
    set: (name: string) => {
      if (agents.some((a) => a.name === name)) {
        setCurrentName(name)
      }
    },
    move: (direction: 1 | -1) => {
      batch(() => {
        const current = value.current()
        const idx = agents.findIndex((a) => a.name === current.name)
        let next = idx + direction
        if (next < 0) next = agents.length - 1
        if (next >= agents.length) next = 0
        setCurrentName(agents[next]!.name)
      })
    },
    color: (name: string) => {
      return agents.find((a) => a.name === name)?.color ?? RGBA.fromHex("#FFFFFF")
    },
  }

  return <ctx.Provider value={value}>{props.children}</ctx.Provider>
}

export function useAgent() {
  const value = useContext(ctx)
  if (!value) throw new Error("useAgent must be used within AgentProvider")
  return value
}
