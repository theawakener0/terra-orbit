# terra-orbit

An AI space harness powered with NASA APIs, built with [Bun](https://bun.sh).

## Install

```bash
bun add terra-orbit
```

## Usage

Run the terminal UI:

```bash
bunx terra-orbit --tui
```

Run the web UI:

```bash
bunx terra-orbit --web
```

## Configuration

Create `~/.config/terra-orbit/config.json`:

```json
{
  "NASA_API_KEY": "your-nasa-api-key",
  "HACK_CLUB_AI_API_KEY": "your-hackclub-ai-api-key",
  "MAIN_MODEL": "your-favourite-main-model",
  "SUB_MODEL": "your-favourite-sub-model",
  "PORT": "3000"
}
```

Alternatively, you can use a `.env` file in the working directory.

| Variable | Description |
|---|---|
| `NASA_API_KEY` | NASA API key (required for NASA tools) |
| `HACK_CLUB_AI_API_KEY` | API key for AI provider |
| `MAIN_MODEL` | Main AI model |
| `SUB_MODEL` | Sub-agent AI model |
| `PORT` | Web server port (default: 3000) |

## Development

```bash
bun install
bun run build
```
