import { useState } from "react";

export default function ReasoningBlock({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const display = typeof text === "string" ? text : "";

  return (
    <div className="reasoning">
      <div className="reasoning-header" onClick={() => setOpen(!open)}>
        <span className={`reasoning-arrow ${open ? "open" : ""}`}>▶</span>
        reasoning
      </div>
      {open && <div className="reasoning-text">{display}</div>}
    </div>
  );
}
