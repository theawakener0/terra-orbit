import { useTheme } from "../context/theme"

const logoLines = [
  "▄▄▄▄▄▄▄▄▄                        ▄▄▄▄▄         ▄▄             ",
  "▀▀▀███▀▀▀                      ▄███████▄       ██    ▀▀  ██   ",
  "   ███ ▄█▀█▄ ████▄ ████▄  ▀▀█▄ ███   ███ ████▄ ████▄ ██ ▀██▀▀ ",
  "   ███ ██▄█▀ ██ ▀▀ ██ ▀▀ ▄█▀██ ███▄▄▄███ ██ ▀▀ ██ ██ ██  ██   ",
  "   ███ ▀█▄▄▄ ██    ██    ▀█▄██  ▀█████▀  ██    ████▀ ██▄ ██   ",
]

export function Logo() {
  const { theme } = useTheme()

  return (
    <box flexDirection="column" alignItems="center">
      {logoLines.map((line) => (
        <text fg={theme.secondary}>{line}</text>
      ))}
      <text fg={theme.textMuted}> </text>
      <text fg={theme.textMuted}>NASA Open APIs • AI-Powered Exploration</text>
    </box>
  )
}
