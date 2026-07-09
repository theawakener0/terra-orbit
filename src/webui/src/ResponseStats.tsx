const FINISH_LABELS: Record<string, string> = {
  stop: "",
  length: "max tokens reached – response may be incomplete",
  "tool-calls": "",
  error: "error occurred during generation",
  "content-filtered": "content filtered",
  other: "unexpected finish",
};

export default function ResponseStats({
  usage,
  finishReason,
}: {
  usage?: { totalTokens?: number };
  finishReason?: string;
}) {
  const label = finishReason ? FINISH_LABELS[finishReason] : "";
  const show = usage?.totalTokens != null || label;
  if (!show) return null;

  return (
    <div className="response-stats" style={label ? { color: "var(--error)" } : undefined}>
      {usage?.totalTokens != null && `⚡ ${usage.totalTokens} tok`}
      {usage?.totalTokens != null && label && " · "}
      {label}
    </div>
  );
}
