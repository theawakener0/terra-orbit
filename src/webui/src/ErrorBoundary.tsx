import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            padding: 40,
            color: "var(--error)",
            fontFamily: "DM Sans",
            fontSize: 13,
            textAlign: "center",
            gap: 8,
          }}
        >
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1 }}>
            render error
          </div>
          <div>{this.state.error.message}</div>
          <button
            onClick={() => this.setState({ error: null })}
            style={{
              marginTop: 12,
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: 4,
              padding: "8px 16px",
              color: "var(--text-primary)",
              cursor: "pointer",
              fontFamily: "DM Sans",
              fontSize: 12,
            }}
          >
            retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
