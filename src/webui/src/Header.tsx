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
      <span className="header-brand">TerraOrbit</span>
      <span className={`header-status ${statusLabel}`}>{statusLabel}</span>
    </header>
  );
}
