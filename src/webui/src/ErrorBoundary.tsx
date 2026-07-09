import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  override render() {
    if (this.state.error) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-label">render error</div>
          <div>{this.state.error.message}</div>
          <button className="error-boundary-retry" onClick={() => this.setState({ error: null })}>
            retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
