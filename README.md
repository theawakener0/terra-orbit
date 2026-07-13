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

## Environment Variables

| Variable | Description |
|---|---|
| `NASA_API_KEY` | NASA API key (required for NASA tools) |
| `HACK_CLUB_AI_API_KEY` | API key for AI provider |
| `MAIN_MODEL` | Main AI model (default: provider-specific) |
| `SUB_MODEL` | Sub-agent AI model |

## Development

```bash
bun install
bun run build
```
