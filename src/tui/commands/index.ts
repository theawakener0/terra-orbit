import { NasaClient } from "../../nasa"
import { handleApod } from "./apod"
import { handleNeo } from "./neo"
import { handleEpic } from "./epic"
import { handleDonki } from "./donki"
import { handleEonet } from "./eonet"
import { handleTechtransfer } from "./techtransfer"
import { handleImagery } from "./imagery"

export type CommandHandler = (args: string[], nasa: NasaClient) => Promise<string>

const commands: Record<string, CommandHandler> = {
  apod: handleApod,
  neo: handleNeo,
  epic: handleEpic,
  donki: handleDonki,
  eonet: handleEonet,
  techtransfer: handleTechtransfer,
  imagery: handleImagery,
}

export const commandList = Object.keys(commands)

export function isCommand(input: string): boolean {
  const cmd = input.trim().split(/\s+/)[0]
  return cmd !== undefined && cmd in commands
}

export function getCommandName(input: string): string {
  return input.trim().split(/\s+/)[0] ?? ""
}

export async function executeCommand(
  input: string,
  nasa: NasaClient,
): Promise<string> {
  const parts = input.trim().split(/\s+/)
  const cmd = parts[0]
  const args = parts.slice(1)

  if (!cmd) return "No command entered. Type /help for available commands."

  const handler = commands[cmd]
  if (!handler) {
    return (
      `Unknown command: ${cmd}\n` +
      `Available: ${commandList.join(", ")}\n` +
      `Type /help for detailed usage.`
    )
  }

  return handler(args, nasa)
}

export function getHelpText(): string {
  return (
    "Available commands:\n" +
    "  /apod       Astronomy Picture of the Day\n" +
    "  /neo        Near-Earth Objects\n" +
    "  /epic       Earth Polychromatic Imaging Camera\n" +
    "  /donki      Space Weather (CME, flares, storms)\n" +
    "  /eonet      Natural Events (EONET)\n" +
    "  /techtransfer  NASA Tech Transfer\n" +
    "  /imagery    NASA Image Library\n" +
    "  /help       Show this help\n" +
    "\n" +
    "Type /<command> help for command-specific help.\n" +
    "Switch to terra agent (Tab) for AI-powered natural language."
  )
}
