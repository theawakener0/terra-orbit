import { useState, type ReactNode } from "react";

export interface ToolPart {
  toolName: string;
  state: "input-streaming" | "input-available" | "output-available" | "output-error";
  input: Record<string, unknown>;
  output?: unknown;
  errorText?: string;
}

function formatName(name: string): string {
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ToolCallCard({ part }: { part: ToolPart }) {
  const [open, setOpen] = useState(false);

  const statusText = () => {
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
            <span className="tool-call-section-label" style={{ color: "var(--error)" }}>
              error
            </span>
            <pre style={{ color: "var(--error)" }}>{part.errorText}</pre>
          </div>
        )}
      </div>
    );
  };

  const stateClass =
    part.state === "output-available"
      ? "done"
      : part.state === "output-error"
        ? "error"
        : "executing";

  return (
    <div className="tool-call">
      <div className="tool-call-header" onClick={() => setOpen(!open)}>
        {part.state === "input-streaming" || part.state === "input-available" ? (
          <span className="tool-call-spinner" />
        ) : part.state === "output-available" ? (
          <span style={{ color: "var(--success)" }}>✓</span>
        ) : (
          <span style={{ color: "var(--error)" }}>✗</span>
        )}
        <span className="tool-call-name">{formatName(part.toolName)}</span>
        <span className={`tool-call-status ${stateClass}`}>{statusText()}</span>
      </div>
      {renderContent()}
    </div>
  );
}
