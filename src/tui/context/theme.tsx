import { createContext, useContext, type ParentProps } from "solid-js"
import { RGBA } from "@opentui/core"

export type Theme = {
  background: RGBA
  backgroundPanel: RGBA
  text: RGBA
  textMuted: RGBA
  primary: RGBA
  secondary: RGBA
  accent: RGBA
  success: RGBA
  warning: RGBA
  error: RGBA
  info: RGBA
  border: RGBA
}

const darkTheme: Theme = {
  background: RGBA.fromHex("#0a0a0a"),
  backgroundPanel: RGBA.fromHex("#141414"),
  text: RGBA.fromHex("#e0e0e0"),
  textMuted: RGBA.fromHex("#666666"),
  primary: RGBA.fromHex("#00BFFF"),
  secondary: RGBA.fromHex("#00FF00"),
  accent: RGBA.fromHex("#FF6B35"),
  success: RGBA.fromHex("#00FF00"),
  warning: RGBA.fromHex("#FFD700"),
  error: RGBA.fromHex("#FF4444"),
  info: RGBA.fromHex("#00BFFF"),
  border: RGBA.fromHex("#333333"),
}

const ctx = createContext<{ theme: Theme }>({ theme: darkTheme })

export function ThemeProvider(props: ParentProps) {
  return <ctx.Provider value={{ theme: darkTheme }}>{props.children}</ctx.Provider>
}

export function useTheme() {
  return useContext(ctx)
}
