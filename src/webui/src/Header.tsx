type Status = "ready" | "submitted" | "streaming" | "error";

export default function Header({ status }: { status: Status }) {
  const statusLabel =
    status === "ready"
      ? "online"
      : status === "streaming" || status === "submitted"
        ? "streaming"
        : "error";

  return (
    <header className="header">
      <span className="header-brand"><span className="brand-terra">Terra</span><span className="brand-orbit">Orbit</span></span>
      <span className={`header-status ${statusLabel}`}>{statusLabel}</span>
    </header>
  );
}
