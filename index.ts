const flag = process.argv[2];

if (flag === "--tui") {
  const { runAgentTUI } = await import("@ai-sdk/tui");
  const { terra } = await import("./src/harness/agent");
  await runAgentTUI({
    title: "Terra Agent",
    agent: terra as any,
    tools: "auto-collapsed",
    reasoning: "auto-collapsed",
    responseStatistics: "outputTokensPerSecond",
    contextSize: 200_000,
  });
} else if (flag === "--web") {
  const { startServer } = await import("./src/web/server");
  startServer();
} else {
  console.log("Usage:");
  console.log("  bun run index.ts --tui    Launch terminal UI");
  console.log("  bun run index.ts --web    Launch web UI");
  process.exit(1);
}
