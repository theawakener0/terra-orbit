import { createContext, createSignal, useContext, batch, type ParentProps } from "solid-js"

export type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  agent: string
  timestamp: number
}

export type Session = {
  id: string
  title: string
  messages: Message[]
  createdAt: number
}

type SessionContext = {
  session: () => Session
  addMessage: (msg: Omit<Message, "id" | "timestamp">) => void
  updateMessage: (id: string, content: string) => void
  clear: () => void
  isStreaming: () => boolean
  setStreaming: (val: boolean) => void
}

const ctx = createContext<SessionContext>()

function createID() {
  return Math.random().toString(36).slice(2, 10)
}

export function SessionProvider(props: ParentProps) {
  const [messages, setMessages] = createSignal<Message[]>([])
  const [title, setTitle] = createSignal("New Session")
  const [sessionID, setSessionID] = createSignal(createID())
  const [createdAt, setCreatedAt] = createSignal(Date.now())
  const [streaming, setStreaming] = createSignal(false)

  const session = (): Session => ({
    id: sessionID(),
    title: title(),
    messages: messages(),
    createdAt: createdAt(),
  })

  const value: SessionContext = {
    session,
    addMessage: (msg) => {
      batch(() => {
        const id = createID()
        setMessages((prev) => [
          ...prev,
          { ...msg, id, timestamp: Date.now() },
        ])
        if (msg.role === "user" && messages().length === 0) {
          const t = msg.content.length > 40
            ? msg.content.slice(0, 37) + "..."
            : msg.content
          setTitle(t)
        }
      })
    },
    updateMessage: (id, content) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, content } : m)),
      )
    },
    clear: () => {
      batch(() => {
        setMessages([])
        setTitle("New Session")
        setSessionID(createID())
        setCreatedAt(Date.now())
        setStreaming(false)
      })
    },
    isStreaming: streaming,
    setStreaming,
  }

  return <ctx.Provider value={value}>{props.children}</ctx.Provider>
}

export function useSession() {
  const value = useContext(ctx)
  if (!value) throw new Error("useSession must be used within SessionProvider")
  return value
}
