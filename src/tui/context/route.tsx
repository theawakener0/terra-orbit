import { createContext, createSignal, useContext, type ParentProps } from "solid-js"

export type RouteData =
  | { type: "home" }
  | { type: "session"; sessionID: string }

type RouteContext = {
  data: () => RouteData
  navigate: (data: RouteData) => void
}

const ctx = createContext<RouteContext>()

export function RouteProvider(props: ParentProps) {
  const [data, setData] = createSignal<RouteData>({ type: "home" })

  const value: RouteContext = {
    data,
    navigate: (next: RouteData) => setData(next),
  }

  return <ctx.Provider value={value}>{props.children}</ctx.Provider>
}

export function useRoute() {
  const value = useContext(ctx)
  if (!value) throw new Error("useRoute must be used within RouteProvider")
  return value
}
