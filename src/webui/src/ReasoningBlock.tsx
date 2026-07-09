import { useState, type KeyboardEvent } from "react";

export default function ReasoningBlock({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const display = typeof text === "string" ? text : "";

  return (
    <div className="reasoning">
      <div
        className="reasoning-header"
        role="button"
        tabIndex={0}
        onClick={() => setOpen(!open)}
        onKeyDown={(e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(!open); } }}
        aria-expanded={open}
        aria-label="Toggle reasoning"
      >
        <span className={`reasoning-arrow ${open ? "open" : ""}`}>▶</span>
        reasoning
      </div>
      {open && <div className="reasoning-text">{display}</div>}
    </div>
  );
}
