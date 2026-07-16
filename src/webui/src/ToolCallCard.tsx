import { useState, useCallback, type ReactNode, type KeyboardEvent } from "react";

export interface ToolPart {
  toolName: string;
  state: "input-streaming" | "input-available" | "output-available" | "output-error";
  input: Record<string, unknown>;
  output?: unknown;
  errorText?: string;
  preliminary?: boolean;
}

function formatName(name: string): string {
  if (!name || typeof name !== "string") return "";
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ToolCallCard({ part }: { part: ToolPart }) {
  const [open, setOpen] = useState(false);

  const isStreaming = part.state === "output-available" && part.preliminary;

  const statusText = () => {
    if (isStreaming) return "streaming";
    switch (part.state) {
      case "input-streaming":
        return "streaming";
      case "input-available":
        return "executing";
      case "output-available":
        return "done";
      case "output-error":
        return "error";
    }
  };

  const renderJson = (value: unknown): string => {
    if (value === undefined) return "";
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  };

  const renderContent = (): ReactNode => {
    if (!open) return null;

    const hasInput = part.input && Object.keys(part.input).length > 0;
    const hasOutput = part.output !== undefined;
    const hasError = part.errorText;

    return (
      <div className="tool-call-body">
        {hasInput && (
          <div className="tool-call-section">
            <span className="tool-call-section-label">input</span>
            <pre className={part.state === "input-streaming" ? "tool-call-partial" : ""}>
              {renderJson(part.input)}
            </pre>
          </div>
        )}

        {hasOutput && (
          <div className="tool-call-section">
            <span className="tool-call-section-label">result</span>
            <pre>{renderJson(part.output)}</pre>
          </div>
        )}

        {hasError && (
          <div className="tool-call-section">
            <span className="tool-call-section-label tool-call-section-error">
              error
            </span>
            <pre className="tool-call-error">{part.errorText}</pre>
          </div>
        )}
      </div>
    );
  };

  const stateClass =
    isStreaming
      ? "streaming"
      : part.state === "output-available"
        ? "done"
        : part.state === "output-error"
          ? "error"
          : "executing";

  return (
    <div className="tool-call">
      <div
        className="tool-call-header"
        role="button"
        tabIndex={0}
        onClick={() => setOpen(!open)}
        onKeyDown={(e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(!open); } }}
        aria-expanded={open}
        aria-label={`${formatName(part.toolName)} tool call`}
      >
        {part.state === "input-streaming" || part.state === "input-available" || isStreaming ? (
          <span className="tool-call-spinner" />
        ) : part.state === "output-available" ? (
          <span className="tool-call-icon-success">✓</span>
        ) : (
          <span className="tool-call-icon-error">✗</span>
        )}
        <span className="tool-call-name">{formatName(part.toolName)}</span>
        <span className={`tool-call-status ${stateClass}`}>{statusText()}</span>
      </div>
      {renderContent()}
    </div>
  );
}
